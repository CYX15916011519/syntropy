<template>
  <div>
    <a-spin :spinning="spinning" :delay="delayTime">
      <div>
        <br />
        <a-table
          rowKey="1"
          bordered
          :columns="getcolumns"
          :dataSource="getdataSource"
          :size="'small'"
          :pagination="false"
          :scroll="{ x: 1300 }"
        >
          <template slot="检验情况" slot-scope="text, record" v-if="record.检验情况.length > 0">
            <a-tag color="red">{{record.检验情况}}</a-tag>
          </template>
          <template slot="FNUMBER" slot-scope="text, record, index" v-if="CheckShow(record, 'FNUMBER')">
            <a-button icon="search" @click="OnSelectWL(index,record)">{{record.FNUMBER}}</a-button>
          </template>
          <template slot="FParentID" slot-scope="text, record, index" v-if="CheckShow(record, 'FParentID')">
            <a-select
              showSearch
              :placeholder="'请选择BOM单组别'"
              style="min-width:120px;"
              :defaultValue="record.FParentID"
              @change="value => handleSelectChange(value, index, 'FParentID')"
            >
              <a-select-option v-for="tmp in getSQLReport75" :key="tmp.FInterID">
                {{ tmp.FNumber + '-' + tmp.FName }}
              </a-select-option>
            </a-select>
          </template>
          <template slot="selectmaterial" slot-scope="text, record, index" v-if="CheckShow(record, 'selectmaterial')">
            <a-select
              showSearch
              :placeholder="'请选择物料用户'"
              style="min-width:120px;"
              :defaultValue="''"
              @change="value => handleSelectChange(value, index, 'selectmaterial')"
            >
              <a-select-option v-for="tmp in getMaterialList" :key="tmp.id">
                {{ tmp.fNumber + '-' + tmp.name }}
              </a-select-option>
            </a-select>
            <a-button type="primary" size="small" v-if="record.selectmaterial !== ''" @click="TS(index)">提交</a-button>
          </template>
        </a-table>
        <footer-tool-bar class="ftl">
          <a-button style="margin-left: 8px" @click="prevStep">上一步</a-button>
          <a-button :loading="loading" type="primary" @click="nextStep">提交</a-button>
        </footer-tool-bar>
      </div>
    </a-spin>
    <SelMateriel ref="SelMateriel" @Success="OnReload" />
  </div>
</template>

<script>
import Remarks from '@/views/basic/materialsetup/edit'
import TemplateSave from '@/views/basic/BOMImport/BOM'
import Select from '@/views/basic/BOMImport/selectBOM'
export default {
  components: {
    SelMateriel: () => import('@/views/basic/BOMImport/SelMateriel.vue')
  },
  name: 'TestInfo',
  props: {
    listObj: {
      type: Array,
      required: true
    },
    custID: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      spinning: false,
      delayTime: 500,
      Select,
      labelCol: { lg: { span: 8 }, sm: { span: 8 } },
      wrapperCol: { lg: { span: 16 }, sm: { span: 16 } },
      dataSource: [],
      columns: [],
      count: 0,
      MaterialList: [],
      loading: false,
      newlistObj: [],
      Remarks,
      TemplateSave,
      ApiData: {},
      SQLReport75: [],
      SelectModel: {
        index: 0,
        record: {}
      }
    }
  },
  computed: {
    getdataSource () {
      return this.dataSource
    },
    getcolumns () {
      return this.columns
    },
    getMaterialList () {
      return this.MaterialList
    },
    getSQLReport75 () {
      return this.SQLReport75
    }
  },
  beforeMount () {
    this.GetSQLReport75()
    this.GetStockList()
    this.loadTable()
    this.loadWLFNumber()
    this.GetMaterialList('materialTemplate')
  },
  methods: {
    // 上一步
    prevStep () {
      this.$emit('prevStep')
    },
    // 下一步
    nextStep () {
      if (this.SaveCheck()) { return }
      // BOM类型的
      var inputlist = this.dataSource.filter(f => {
        return f.FNUMBER !== ''
      })
      if (inputlist.length > 0) {
        this.SaveBOM()
      }
      // this.$emit('nextStep')
    },
    OnSelectWL (index, record) {
      this.SelectModel.index = index
      this.SelectModel.record = record
      this.$refs.SelMateriel.show()
    },
    OnReload(FNumber, obj){
      const newData = [...this.dataSource]
      const target = newData[this.SelectModel.index]
      if (target) {
        target['FNUMBER'] = FNumber
        this.dataSource = newData
      }
      this.ApiData[FNumber] = obj
    },
    // 判断是否显示
    CheckShow (record, type) {
      // 对应编码不等于空，并且不等于外购并且BOM不存在
      if (this.custID !== '') {
        if (type === 'FNUMBER' || type === 'FParentID') {
          return record.FNUMBER !== '' && record.FERPCLSNAME !== '外购' && record.FBOMNUMBER === ''
        }
        if (type === 'selectmaterial') {
          return record.FNUMBER === ''
        }
      } else {
        if (type === 'FNUMBER' || type === 'FParentID') {
          return record.FNUMBER === record.FNumber
        }
        if (type === 'selectmaterial') {
          return record.FNUMBER === ''
        }
      }
    },
    // 维护对应编码并且生成物料
    TS (index) {
      if (this.custID !== '') {
        this.SaveTemplate(index)
      } else {
        this.SaveWLTemplate(index)
      }
    },
    // 获取
    GetSQLReport75 () {
      var _this = this
      var params = {
          Data: {
            PageSize: '1000',
            PageIndex: '1'
          },
          SQLReport: _this.$Api.Url.BOMImportCheckUrl
        }
      this.$store.dispatch('SQLReportGetAll', params).then(res => {
        _this.SQLReport75 = res.Data.DATA
      })
    },
    // 获取
    GetStockList () {
      var _this = this
      var params = {
        Data: {
          Top: '100',
          PageSize: '1000',
          PageIndex: '1',
          Filter: "FNumber like '%%' ",
          OrderBy: 'FNumber asc',
          Fields: 'FNumber,FName'
        }
      }
      this.$store.dispatch('StockGetAll', params).then(res => {
        _this.ApiData['Stock'] = res.Data.Data
      })
    },
    // 下拉选择后
    handleSelectChange (value, key, column) {
      var _this = this
      const newData = [...this.dataSource]
      const target = newData[key]
      if (target) {
        // 获取对应物料编码
        if (target[column] === '' && column === 'selectmaterial') {
          var params = { textHead: 'WL' }
          this.$store.dispatch('JITCommonGetNumber', params).then(res => {
            if (res.success) {
              target['WlNumber'] = res.result
              this.UpdateTable(target)
            }
          })
        }
        target[column] = value
        this.dataSource = newData
      }
    },
    // 保存校验
    SaveCheck () {
      var checklist = this.dataSource.filter(f => {
        return f.FNUMBER === ''
      })
      if (checklist.length > 0) {
        this.$message.warning('请选择模板')
        return true
      }
      var BOMlist = this.dataSource.filter(f => {
        return f.FParentID === '' && f.FBOMNUMBER === '' && f.FERPCLSNAME !== '外购'
      })
      if (BOMlist.length > 0) {
        this.$message.warning('请选择BOM单组别,和输入物料')
        return true
      }
      return false
    },
    // 保存BOM
    SaveBOM () {
      var _this = this
      
      var BomData = _this.dataSource
      // 所有输入的物料
      // 1.生成BOM逻辑
      var diclist = {}
      BomData.forEach(f => {
        if (diclist.hasOwnProperty(f.Level)) {
          diclist[f.Level] = diclist[f.Level] + 1
        } else {
          diclist[f.Level] = 1
        }
      })
      // 最终结果
      var BOMList = []
      // 遍历
      var keylist = Object.keys(diclist)
      keylist.forEach(f => {
        var num = f * 1 // 数字
        var value = diclist[f] // 数字的总数
        // 循环次数
        for (let index = 0; index < value; index++) {
          var yudao = -1
          var GetTF = false
          var obj = {}
          var child = []
          BomData.forEach(k => {
            // 相同添加
            if (k.Level * 1 === num) { yudao++ }
            // 表头
            if (k.Level === num && yudao === index) {
              // 形成BOM 表头
              GetTF = true
              obj = k
            }
            // 表明细
            if (GetTF && yudao === index) {
              if (k.Level === num + 1) {
                child.push(k)
              }
            }
          })
          // 长度大于0
          if (child.length > 0) { obj.child = child }
          // 获取到所有BOM
          BOMList.push(JSON.parse(JSON.stringify(obj)))
        }
      })
      // 要保存的
      var SaveList = []
      // 过滤已经有编码的
      BOMList.forEach(k => {
        // 1.testOK不能等于空并且selectmaterial等于空并且子级不为空的
        if (k.child && k.FNUMBER !== '') {
          var list = k.child.filter(f => { return f.FNUMBER !== ''})
          if (list.length > 0) {
            SaveList.push(k)
            return true
          }
        }
        // 2.子级
        if (k.child) {
          var list2 = k.child.filter(f => { return f.FNUMBER !== ''})
          if (list2.length > 0) {
            SaveList.push(k)
            return true
          }
        }
      })
      //
      var BOMTmp = JSON.parse(JSON.stringify(TemplateSave.BOMTemplate))
      // 最终要保存的BOM
      var EndList = []
      SaveList.forEach(item => {
        // 表头
        var head = JSON.parse(JSON.stringify(BOMTmp.Data.Page1[0]))
        var api1 = _this.ApiData[item.FNUMBER]
        console.log(item.FNUMBER)
        var day1 = new Date()
        var now = day1.getFullYear() + '-' + (day1.getMonth() + 1) + '-' + day1.getDate() + ' ' + '00:00:00'
        head.FEntertime = now
        head.FCheckDate = now
        head.FPercentItemID.FNumber = api1['FNumber']
        head.FPercentItemID.FName = api1['FName']
        //
        var FPercentUnitID = _this.Select.FPercentUnitID.filter(f => { return f.FName === item['FUnitID'] })[0]
        head.FPercentUnitID.FNumber = FPercentUnitID['FNumber']
        head.FPercentUnitID.FName = FPercentUnitID['FName']
        //
        //
        var FParentID = _this.SQLReport75.filter(f => { return f.FInterID === item['FParentID'] })[0]
        head.FParentID.FNumber = FParentID['FNumber']
        head.FParentID.FName = FParentID['FName']
        //
        head.FAuxQty = item.FAuxQtyScrap
        // 明细
        var bodylist = []
        item.child.forEach(f => {
          var body = JSON.parse(JSON.stringify(BOMTmp.Data.Page2[0]))
          body.FDetailID = _this.uuid()
          var api2 = _this.ApiData[f.FNUMBER]
          body.FItemID.FNumber = api2['FNumber']
          body.FItemID.FName = api2['FName']
          //
          var FMaterielType = _this.Select.FMaterielType.filter(a => { return a.FName === f['FMaterielType'] })[0]
          body.FMaterielType.FNumber = FMaterielType['FNumber']
          body.FMaterielType.FName = FMaterielType['FName']
          //
          var FMarshalType = _this.Select.FMarshalType.filter(a => { return a.FName === f['FMarshalType'] })[0]
          body.FMarshalType.FNumber = FMarshalType['FNumber']
          body.FMarshalType.FName = FMarshalType['FName']
          //
          var FBackFlush = _this.Select.FBackFlush.filter(a => { return a.FName === f['FBackFlush'] })[0]
          body.FBackFlush.FNumber = FBackFlush['FNumber']
          body.FBackFlush.FName = FBackFlush['FName']
          //
          var FStockIDList = _this.ApiData['Stock']
          var FStockID = FStockIDList.filter(a => { return a.FName === f['FStockID'] })[0]
          body.FStockID.FNumber = FStockID['FNumber']
          body.FStockID.FName = FStockID['FName']
          //
          var FUnitID = _this.Select.FUnitID.filter(a => { return a.FName === f['FUnitID'] })[0]
          body.FUnitID.FNumber = FUnitID['FNumber']
          body.FUnitID.FName = FUnitID['FName']
          //
          body.FAuxQtyScrap = f.FAuxQtyScrap
          body.FScrap = f.FScrap
          body.FPositionNo = f.FPositionNo
          body.FMachinePos = f.FMachinePos
          body.FOffSetDay = f.FOffSetDay
          body.FNote0 = f.FNote0
          //
          bodylist.push(body)
        })
        //
        EndList.push({ Data: { Page1: [head], Page2: bodylist } })
      })
      if (EndList.length === 0) {
        this.$message.info('没有要保存的数据')
        return true
      }
      this.spinning = true
      var i = 0
      // 开始保存BOM
      EndList.forEach(async (item, index) => {
        await _this.$store.dispatch('BOMSave', item).then(res => {
          if (res.StatusCode !== 200) {
            this.$message.error(res.Message + ',' + res.Data)
          } else {
            this.$message.success('保存成功')
          }
        }).finally(f => {
          i = i + 1
          if (i === EndList.length) {
            this.$emit('nextStep')
            _this.spinning = false
          }
        })
      })
    },
    uuid () {
      var s = []
      var hexDigits = '0123456789abcdef'
      for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
      }
      s[14] = '4'// bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1)// bits 6-7 of the clock_seq_hi_and_reserved to 01
      s[8] = s[13] = s[18] = s[23] = '-'
      var uuid = s.join('')
      return uuid
    },
    // 保存物料
    SaveWLTemplate(i) {
      var _this = this
      _this.spinning = true
      // 所有物料JSON
      var newMaterialList = this.MaterialList
      var list = []
      if (i === -1) {
        list = this.dataSource.filter(f => { return f.selectmaterial.length !== '' })
      }
      else{
        list = this.dataSource.slice(i, i + 1)
      }
      var j = 0
      // 保存到K3数据库，循环列表的下拉
      list.forEach(async (item, index) => {
        // 获取物料JSON
        var selmar = newMaterialList.filter(f => {
          return f.id === item.selectmaterial
        })
        var params = {
          id: 0,
          Data: {}
        }
        // 替换模板值
        selmar.forEach(tmp => {
          var template = JSON.parse(tmp.template)
          template['FNumber'] =  tmp.fNumber + '.' + item.FNumber
          template['FName'] = item.FName
          params.Data = template
        })
        await _this.$store.dispatch('MaterialSave', params).then(res => {
          if (res.StatusCode === 200) {
            item.FNUMBER = item.FNumber
            _this.UpdateTable(item)
            _this.loadWLFNumber()
          } else {
            this.$message.error('生成物料失败')
          }
        }).finally(f => {
          j = j + 1
          if (j === list.length) {
            _this.spinning = false
          }
        })
      })
    },
    // 保存物料
    SaveTemplate (i) {
      var _this = this
      _this.spinning = true
      // 所有物料JSON
      var newMaterialList = this.MaterialList
      var list = []
      if (i === -1) {
        list = this.dataSource.filter(f => { return f.selectmaterial.length !== '' })
      }
      else{
        list = this.dataSource.slice(i, i + 1)
      }
      var j = 0
      // 保存到K3数据库，循环列表的下拉
      list.forEach(async (item, index) => {
        // 获取物料JSON
        var selmar = newMaterialList.filter(f => {
          return f.id === item.selectmaterial
        })
        var params = {
          id: 0,
          Data: {}
        }
        // 替换模板值
        selmar.forEach(tmp => {
          var template = JSON.parse(tmp.template)
          template['FNumber'] = tmp.fNumber + '.' + item.WlNumber
          template['FName'] = item.FName
          params.Data = template
        })
        await _this.$store.dispatch('MaterialSave', params).then(res => {
           if (res.StatusCode === 200) {
             this.dataSource.forEach(a => {
              if (a.FNUMBER === '' && a.FNumber === item.FNumber) {
                a.FNUMBER = params.Data.FNumber
                a['检验情况'] = ''
              }
            })
            _this.Bill1000200Save(item, params, index) 
           }
        }).finally(f => {
          j = j + 1
          if (j === list.length) {
            _this.spinning = false
          }
        })
      })
    },
    // 获取校验情况
    BOMCheck (item, index) {
      this.spinning = true
      var params = {
          Data: {
            PageSize: '1',
            PageIndex: '1'
          },
          '*Number*': item.FNumber,
          '*CustNo*': this.custID.split(',')[1],
          SQLReport: _this.$Api.Url.BOMImportCheckUrl
        }
        item['FNUMBER'] = ''
        item['FBOMNUMBER'] = ''
        item['FERPCLSNAME'] = ''
        item['检验情况'] = ''
        this.$store
          .dispatch('SQLReportGetAll', params)
          .then(res => {
            if (res.StatusCode === 200) {
              var result = res.Data.DATA
              if (result.length > 0) {
                var resultMX = result[0]
                var key = Object.keys(resultMX)
                key.forEach(k => {
                  item[k] = resultMX[k]
                })
              }
              else {
                item['检验情况'] = '对应编码不存在'
              }
              this.UpdateTable(item)
              this.loadWLFNumber()
            } else {
              this.$message.error('检验失败，请稍后重试')
            }
          }).finally(f => {
            this.spinning = false
          })
    },
    // 更改 表格
    UpdateTable (item) {
      this.dataSource.forEach(n => {
        if (n.FNumber === item.FNumber) {
          n.FERPCLSNAME = item.FERPCLSNAME
          n.WlNumber = item.WlNumber
          n.FNUMBER = item.FNUMBER
        }
      })
      this.dataSource = this.dataSource
    },
    // 生成对应编码
    Bill1000200Save (item, params, index) {
      this.spinning = true
      if (this.custID === '' || this.custID === undefined) {
        return true
      }
      var obj = {
        Data: {
          Page1: [
            {
              FClassTypeID: '',
              FBillNo: 'WL_' + this.uuid(),
              FCustomer: {
                FNumber: this.custID.split(',')[1],
                FName: this.custID.split(',')[2]
              },
              FMeterialCode: {
                FNumber: params.Data.FNumber,
                FName: params.Data.FName
              },
              FInvMeterName: this.custID.split(',')[2],
              FInvMeterSpec: '',
              FMeterName: item.FNumber,
              FTaxCode: params.Data.FName,
              FEnjoyPolicy: '',
              FPolicy: '',
              FJson: ''
            }
          ]
        }
      }
      this.$store.dispatch('Bill1000200Save', obj).then(res => {
      }).finally(f => {
        this.spinning = false
        this.BOMCheck(item, index)
      })
    },
    // 加载表格
    loadTable () {
      this.empty()
      var _this = this
      var colobj = []
      var keys = Object.keys(_this.listObj[0])
      keys.forEach(k => {
        if (k === 'FNUMBER' || k === 'FParentID' || k === 'selectmaterial' || k === '检验情况') {
        }
        else {
          colobj.push({ title: k, dataIndex: k, key: k, width: '145' })
        }
      })
      colobj.push({ title: '选择物料', dataIndex: 'FNUMBER', key: 'FNUMBER', width: '145', scopedSlots: { customRender: 'FNUMBER' } })
      colobj.push({ title: 'BOM单组别', dataIndex: 'FParentID', key: 'FParentID', width: '145', scopedSlots: { customRender: 'FParentID' } })
      colobj.push({ title: '选择物料模板', dataIndex: 'selectmaterial', key: 'selectmaterial', width: '245', scopedSlots: { customRender: 'selectmaterial' } })
      colobj.push({ title: '检验情况', dataIndex: '检验情况', key: '检验情况', width: '245', scopedSlots: { customRender: '检验情况' } })
      this.listObj.forEach(item => {
        item['selectmaterial'] = ''
        item['FParentID'] = item.FParentID
        item['FNUMBER'] = item.FNUMBER
      })
      this.columns = colobj
      this.dataSource = this.listObj
      this.count = this.listObj.length
    },
    // 加载物料
    loadWLFNumber() {
      var list = this.dataSource.filter(f => {
        return f.FNUMBER.length > 0
      })
      if (list.length > 0) {
        this.spinning = true
      }
      var i = 0
      list.forEach(item => {
        if (this.ApiData.hasOwnProperty(item.FNUMBER)) {
          i = i + 1 
          return true
        }
        var params = {
          Data: {
            FNumber: item.FNUMBER
          },
          GetProperty: true
        }
        // 获取对应物料
        this.$store.dispatch('MaterialGetByFItemID', params).then(res => {
          if (res.StatusCode !== 200) {
            this.$message.error(res.Data)
          } else {
            this.ApiData[item.FNUMBER] = res.Data[0].Data
          }
        }).finally(f => {
          i = i + 1 
          if (i === list.length) {
            this.spinning = false
          }
        })
      })
    },
    // 清空表格内容
    empty () {
      this.dataSource = []
      this.columns = []
      this.count = 0
    },
    // 获取下拉列表
    GetMaterialList (id) {
      var _this = this
      var params = {
        Data: {
          Top: '10000',
          PageSize: '10000',
          PageIndex: '1',
          Filter: "FNumber like '%%' ",
          OrderBy: 'FNumber asc',
          Fields: 'FNumber,FName,FItemID'
        }
      }
      _this.loading = false
      _this.$store
        .dispatch(id + 'GetAll', params)
        .then(res => {
          _this.MaterialList = res.result.items
        })
        .finally(f => {
          _this.loading = false
        })
    }
  }
}
</script>

<style lang="less" scoped>
.stepFormText {
  margin-bottom: 24px;

  .ant-form-item-label,
  .ant-form-item-control {
    line-height: 22px;
  }
}
.ant-table-thead > tr > th, .ant-table-tbody > tr > td {
  padding: 16px 16px;
  word-break: break-word;
  -ms-word-break: break-all;
}
.ftl {
    text-align: center;
    width: -webkit-fill-available;
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    background-color: white;
    padding: 15px 0px;
}
.spin-content {
    border: 1px solid #91d5ff;
    background-color: #e6f7ff;
    padding: 30px;
}
</style>
