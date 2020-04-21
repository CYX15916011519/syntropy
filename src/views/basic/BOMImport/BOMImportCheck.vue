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
          <template slot="FNUMBER" slot-scope="text, record, index">
            <a-button icon="search" @click="OnSelectWL(index, record)">{{ record.FNUMBER }}</a-button>
          </template>
          <template slot="FParentID" slot-scope="text, record, index">
            <a-select
              showSearch
              :placeholder="'请选择BOM单组别'"
              style="min-width:120px;"
              :defaultValue="record.FParentID"
              v-model="record.FParentID"
              @change="value => handleSelectChange(value, index, 'FParentID')"
              v-if="CheckShow(record, 'FParentID')"
            >
              <a-select-option v-for="tmp in getSQLReport75" :key="tmp.FInterID">
                {{ tmp.FNumber + '-' + tmp.FName }}
              </a-select-option>
            </a-select>
          </template>
        </a-table>
        <footer-tool-bar class="ftl">
          <a-button style="margin-left: 8px" @click="prevStep">上一步</a-button>
          <a-button style="margin-left: 8px" @click="OnSelectBOMGroup">批量选择BOM单组别</a-button>
          <a-button style="margin-left: 8px" :loading="loading" type="primary" @click="nextStep">提交</a-button>
        </footer-tool-bar>
      </div>
    </a-spin>
    <SelMateriel ref="SelMateriel" @Success="OnReload" />
    <SelBOMGroup ref="SelBOMGroup" @Success="UpdateFParentID" />
  </div>
</template>

<script>
import Remarks from '@/views/basic/materialsetup/edit'
import TemplateSave from '@/views/basic/BOMImport/BOM'
import Select from '@/views/basic/BOMImport/selectBOM'
export default {
  components: {
    SelMateriel: () => import('@/views/basic/BOMImport/SelMateriel.vue'),
    SelBOMGroup: () => import('@/views/basic/BOMImport/SelBOMGroup')
  },
  name: 'BOMImportCheck',
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
  beforeMount() {
    if (this.custID !== '') {
      this.CustID = this.custID.split(',')[1]
    }
    this.GetSQLReport75()
    this.GetStockList()
    this.loadTable()
    this.DataCheck()
  },
  data() {
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
      },
      CustID: 0,
      // 成功的BOM单编码
      BillNo: []
    }
  },
  computed: {
    getdataSource() {
      return this.dataSource
    },
    getcolumns() {
      return this.columns
    },
    getMaterialList() {
      return this.MaterialList
    },
    getSQLReport75() {
      return this.SQLReport75
    }
  },
  methods: {
    // 上一步
    prevStep() {
      this.$emit('prevStep')
    },
    // 下一步
    nextStep() {
      if (this.SaveCheck()) {
        return
      }
      // BOM类型的
      var inputlist = this.dataSource.filter(f => {
        return f.FNUMBER !== ''
      })
      if (inputlist.length > 0) {
        this.SaveBOM()
      }
      // this.$emit('nextStep')
    },
    // 下拉选择
    handleSelectChange(value, key, column) {
      var _this = this
      const newData = [...this.dataSource]
      const target = newData[key]
      if (target) {
        target[column] = value
        this.dataSource = newData
      }
    },
    // 点击选择物料
    OnSelectWL(index, record) {
      this.SelectModel.index = index
      this.SelectModel.record = record
      this.$refs.SelMateriel.show()
    },
    // 批量选择BOM单组
    OnSelectBOMGroup() {
      var diclist = []
      var di = []
      this.dataSource.forEach(f => {
        if (di.indexOf(f.FNUMBER) === -1) {
          di.push(f.FNUMBER)
          diclist.push({ FNUMBER: f.FNUMBER, FNAME: f.FNAME, FParentID: '1038' })
        }
      })
      this.$refs.SelBOMGroup.showModal(this.getSQLReport75, diclist)
    },
    // 更新BOM单组别
    UpdateFParentID(list) {
      var _this = this
      var list2 = JSON.parse(JSON.stringify(list))
      list2.forEach(f => {
        _this.dataSource.forEach(a => {
          if (a.FNUMBER === f.FNUMBER) {
            a.FParentID = f.FParentID
          }
        })
      })
      var d = _this.dataSource
      _this.dataSource = null
      _this.dataSource = d
    },
    // 刷新选择行
    OnReload(FNumber, obj) {
      const newData = [...this.dataSource]
      const target = newData[this.SelectModel.index]
      if (target) {
        target['FNUMBER'] = FNumber
        this.dataSource = newData
      }
      this.ApiData[FNumber] = obj
    },
    // 判断是否显示
    CheckShow(record, type) {
      // 对应编码不等于空，并且不等于外购并且BOM不存在
      if (this.custID !== '') {
        if (type === 'FNUMBER' || type === 'FParentID') {
          return record.FNUMBER !== '' && record.FERPCLSNAME !== '外购' && record.FBOMNUMBER === ''
        }
      } else {
        if (type === 'FNUMBER' || type === 'FParentID') {
          return record.FNUMBER !== '' && record.FERPCLSNAME !== '外购' && record.FBOMNUMBER === ''
        }
      }
    },
    // 获取
    GetSQLReport75() {
      var _this = this
      var params = {
        Data: {
          PageSize: '1000',
          PageIndex: '1'
        },
        SQLReport: _this.$Api.BOMGroupUrl
      }
       _this.SQLReport75 = []
      this.$store
        .dispatch('SQLReportGetAll', params)
        .then(res => {
          _this.SQLReport75 = res.Data.DATA
        })
        .catch(c => {
          console.log('GetSQLReport75-->' + c)
        })
        .finally(f => {
          if (_this.SQLReport75 === []) {
            _this.GetSQLReport75()
          }
        })
    },
    // 获取
    GetStockList() {
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
      _this.ApiData['Stock'] = []
      this.$store
        .dispatch('StockGetAll', params)
        .then(res => {
          _this.ApiData['Stock'] = res.Data.Data
        })
        .catch(c => {
          console.log('GetStockList-->' + c)
        })
        .finally(f => {
          if (_this.ApiData['Stock'] === []) {
            _this.GetStockList()
          }
        })
    },
    // 去重物料
    GetDiclist() {
      var diclist = []
      // 物料去重
      this.listObj.forEach(f => {
        if (diclist.indexOf(f.Number) === -1) {
          diclist.push(f.Number)
        }
      })
      return diclist
    },
    DataCheck() {
      var _this = this
      //
      var diclist = this.GetDiclist()
      // 参数
      var params = {
        Data: {
          PageSize: diclist.length,
          PageIndex: '1'
        },
        '*Number*': diclist.join(','),
        '*CustNo*': _this.CustID,
        SQLReport: _this.$Api.BOMImportCheckUrl
      }
      //
      var StatusCode = 200
      var DataResult = []
      _this.$store
        .dispatch('SQLReportGetAll', params)
        .then(res => {
          StatusCode = res.StatusCode
          if (res.StatusCode === 200) {
            var result = res.Data.DATA
            if (result.length > 0) {
              DataResult = result
            }
          } else {
            this.$message.error('检验失败，请检查Excel格式是否合格！')
          }
        })
        .catch(c => {
          StatusCode = 0
        })
        .finally(f => {
          _this.loading = false
          if (StatusCode === 200) {
            _this.UpdateTable(DataResult)
          }
        })
    },
    // 检验数据
    DataCheck1() {
      var _this = this
      //
      var diclist = []
      // 物料去重
      _this.listObj.forEach(f => {
        if (diclist.indexOf(f.Number) === -1) {
          diclist.push(f.Number)
        }
      })
      //
      var i = 0
      var interror = 0
      var DataResult = []
      //
      diclist.forEach(async (item, index) => {
        var params = {
          Data: {
            PageSize: '1',
            PageIndex: '1'
          },
          '*Number*': item,
          '*CustNo*': _this.CustID,
          SQLReport: _this.$Api.BOMImportCheckUrl
        }
        await _this.$store
          .dispatch('SQLReportGetAll', params)
          .then(res => {
            if (res.StatusCode === 200) {
              var result = res.Data.DATA
              if (result.length > 0) {
                var resultMX = result[0]
                resultMX['Number'] = item
                DataResult.push(resultMX)
              }
            } else {
              this.$message.error('检验失败，请检查Excel格式是否合格！')
            }
          })
          .catch(c => {
            interror++
          })
          .finally(f => {
            _this.loading = false
            i++
            if (i === diclist.length && interror === 0) {
              _this.UpdateTable(DataResult)
            }
          })
      })
    },
    // 添加
    UpdateTable(DataResult) {
      var _this = this
      var col = true
      DataResult.forEach(item => {
        _this.dataSource.forEach(f => {
          if (f.Number === item.FMETERNAME) {
            var key = Object.keys(item)
            key.forEach(k => {
              if (col && k !== 'Number' && k !== 'FNUMBER') {
                if (
                  JSON.stringify(_this.columns).indexOf(
                    JSON.stringify({ title: k, dataIndex: k, key: k, width: '145' })
                  ) === -1
                ) {
                  _this.columns.push({ title: k, dataIndex: k, key: k, width: '145' })
                }
              }
              f[k] = item[k]
            })
            col = false
          }
        })
      })
      var list = _this.dataSource
      _this.dataSource = null
      _this.dataSource = list
      _this.loadWLFNumber()
    },
    // 保存校验
    SaveCheck() {
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
    SaveBOM() {
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
            if (k.Level * 1 === num) {
              yudao++
            }
            // 表头
            if (k.Level * 1 === num && yudao === index) {
              // 形成BOM 表头
              GetTF = true
              obj = k
            }
            // 表明细
            if (GetTF && yudao === index) {
              if (k.Level * 1 === num + 1) {
                child.push(k)
              }
            }
          })
          // 长度大于0
          if (child.length > 0) {
            obj.child = child
          }
          // 获取到所有BOM
          BOMList.push(JSON.parse(JSON.stringify(obj)))
        }
      })
      // 要保存的
      var SaveList = []
      // 过滤已经有编码的
      BOMList.forEach(k => {
        // 1.testOK不能等于空并且selectmaterial等于空并且子级不为空的
        if (k.child && k.FBOMNUMBER === '' && k.FERPCLSNAME !== '外购') {
          SaveList.push(k)
          return true
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
        // console.log(item.FNUMBER)
        var day1 = new Date()
        var now = day1.getFullYear() + '-' + (day1.getMonth() + 1) + '-' + day1.getDate() + ' ' + '00:00:00'
        head.FEntertime = new Date(now)
        head.FCheckDate = new Date(now)
        head.FPercentItemID.FNumber = item.FNUMBER
        head.FPercentItemID.FName = item.FNAME
        //
        var FPercentUnitID = api1['FUnitID']
        head.FPercentUnitID.FNumber = FPercentUnitID['FNumber']
        head.FPercentUnitID.FName = FPercentUnitID['FName']
        //
        //
        var FParentID = _this.SQLReport75.filter(f => {
          return f.FInterID === item['FParentID']
        })[0]
        head.FParentID.FNumber = FParentID['FNumber']
        head.FParentID.FName = FParentID['FName']
        //
        head.FAuxQty = item['BOM.Qty']
        // 明细
        var bodylist = []
        item.child.forEach(f => {
          var body = JSON.parse(JSON.stringify(BOMTmp.Data.Page2[0]))
          body.FDetailID = _this.uuid()
          var api2 = _this.ApiData[f.FNUMBER]
          body.FItemID.FNumber = f.FNUMBER
          body.FItemID.FName = f.FNAME
          //
          var FMaterielType = _this.Select.FMaterielType.filter(a => {
            return a.FName === '普通件'
          })[0]
          body.FMaterielType.FNumber = FMaterielType['FNumber']
          body.FMaterielType.FName = FMaterielType['FName']
          //
          var FMarshalType = _this.Select.FMarshalType.filter(a => {
            return a.FName === '通用'
          })[0]
          body.FMarshalType.FNumber = FMarshalType['FNumber']
          body.FMarshalType.FName = FMarshalType['FName']
          //
          var FBackFlush = _this.Select.FBackFlush.filter(a => {
            return a.FName === '否'
          })[0]
          body.FBackFlush.FNumber = FBackFlush['FNumber']
          body.FBackFlush.FName = FBackFlush['FName']

          var FStockIDList = _this.ApiData['Stock']
          var FStockID = FStockIDList[0]
          body.FStockID.FNumber = FStockID['FNumber']
          body.FStockID.FName = FStockID['FName']
          //
          var FUnitID = api2['FUnitID']
          body.FUnitID.FNumber = FUnitID['FNumber']
          body.FUnitID.FName = FUnitID['FName']
          //
          body.FAuxQtyScrap = item['BOM.Qty']
          // body.FScrap = 1
          // body.FPositionNo = 1
          // body.FMachinePos = 1
          // body.FOffSetDay = 1
          body.FNote0 = f.Description
          //
          bodylist.push(body)
        })
        //
        EndList.push({ Data: { Page1: [head], Page2: bodylist } })
      })
      if (EndList.length === 0) {
        this.$message.info('没有要保存的数据')
        this.$emit('nextStep')
        return true
      }
      this.FormalSaveBOM(EndList, 0)
    },
    FormalSaveBOM(EndList, i) {
      if (EndList.length === i) {
        this.$emit('setBomNo', this.BillNo)
        this.$message.success('全部保存成功')
        this.$emit('nextStep')
        return
      }
      var _this = this
      this.spinning = true
      // 开始保存BOM
      var StatusCode = 200
      var obj = EndList.slice(i, i + 1)[0]
      _this.$store
        .dispatch('BOMSave', obj)
        .then(res => {
          StatusCode = res.StatusCode
          if (res.StatusCode !== 200) {
            this.$message.error(res.Message + ',' + res.Data)
          } else {
            _this.BillNo.push(res.Data.BillNo)
            this.$message.success('保存成功')
          }
        })
        .catch(c => {
          this.FormalSaveBOM(EndList, i)
        })
        .finally(f => {
          this.spinning = false
          if (StatusCode !== 200) {
            this.FormalSaveBOM(EndList, i)
          } else {
            this.FormalSaveBOM(EndList, i + 1)
          }
        })
    },
    // 加载表格
    loadTable() {
      this.empty()
      var _this = this
      var colobj = []
      var keys = Object.keys(_this.listObj[0])
      keys.forEach(k => {
        if (k === 'FNUMBER' || k === 'FParentID' || k === '检验情况') {
        } else {
          colobj.push({ title: k, dataIndex: k, key: k, width: '145' })
        }
      })
      colobj.push({
        title: '物料',
        dataIndex: 'FNUMBER',
        key: 'FNUMBER',
        width: '145',
        scopedSlots: { customRender: 'FNUMBER' }
      })
      colobj.push({
        title: 'BOM单组别',
        dataIndex: 'FParentID',
        key: 'FParentID',
        width: '145',
        scopedSlots: { customRender: 'FParentID' }
      })
      this.listObj.forEach(item => {
        item['FParentID'] = item.FParentID
        item['FNUMBER'] = item.FNumber
      })
      this.columns = colobj
      this.dataSource = this.listObj
      this.count = this.listObj.length
    },
    // 加载物料
    loadWLFNumber() {
      var diclist = []
      var GetList = []
      this.dataSource.forEach(item => {
        if (diclist.indexOf(item.FNUMBER) === -1) {
          var params = {
            Data: {
              FNumber: item.FNUMBER
            },
            GetProperty: true
          }
          GetList.push(params)
          diclist.push(item.FNUMBER)
        }
      })
      this.GetMaterialLIst(GetList, 0)
    },
    // 正式获取
    GetMaterialLIst(list, i) {
      if (list.length === i) {
        return
      }
      var obj = list.slice(i, i + 1)[0]
      var StatusCode = 200
      this.$store
        .dispatch('MaterialGetByFItemID', obj)
        .then(res => {
          StatusCode = res.StatusCode
          if (res.StatusCode !== 200) {
            this.$message.error(res.Data)
          } else {
            this.ApiData[obj.Data.FNumber] = res.Data[0].Data
          }
        })
        .catch(c => {
          this.GetMaterialLIst(list, i)
        })
        .finally(f => {
          if (StatusCode === 200) {
            this.GetMaterialLIst(list, i + 1)
          } else {
            this.GetMaterialLIst(list, i)
          }
        })
    },
    // 清空表格内容
    empty() {
      this.dataSource = []
      this.columns = []
      this.count = 0
    },
    // UUID
    uuid() {
      var s = []
      var hexDigits = '0123456789abcdef'
      for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
      }
      s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
      s[8] = s[13] = s[18] = s[23] = '-'
      var uuid = s.join('')
      return uuid
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
.ant-table-thead > tr > th,
.ant-table-tbody > tr > td {
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
