<template>
  <div>
    <a-modal
      width="70%"
      :title="title"
      :visible="visible"
      @ok="handleOk"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
      :loading="loading"
    >
      <a-table
        :rowKey="uuid()"
        bordered
        :columns="getcolumns"
        :dataSource="getdataSource"
        :size="'small'"
        :pagination="false"
        :scroll="{ x: 1300 }"
      >
        <template slot="SelectMaterial" slot-scope="text, record, index">
          <a-select
            showSearch
            :placeholder="'请选择物料用户'"
            style="min-width:120px;"
            v-model="record.SelectMaterial"
            @change="value => handleSelectChange(value, index, 'SelectMaterial')"
          >
            <a-select-option v-for="tmp in getMaterialList" :key="tmp.id">
              {{ tmp.fNumber + '-' + tmp.name }}
            </a-select-option>
          </a-select>
          <!-- <a-button type="primary" size="small" v-if="record.SelectMaterial !== ''" @click="TS(index)">提交</a-button> -->
        </template>
      </a-table>
    </a-modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      title: '物料不存在',
      visible: false,
      confirmLoading: false,
      dataSource: [],
      columns: [],
      count: 0,
      MaterialList: [],
      loading: false,
      spinning: false,
      custID: 0
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
    }
  },
  beforeMount() {
    this.GetMaterialList()
  },
  methods: {
    // 下拉更新值
    handleSelectChange(value, key, column) {
      var _this = this
      const newData = [...this.dataSource]
      const target = newData[key]
      if (target) { 
        // 获取对应物料编码
        if (target['WlNumber'] === undefined && column === 'SelectMaterial') {
          var params = { textHead: 'WL' }
          this.$store.dispatch('JITCommonGetNumber', params).then(res => {
            if (res.success) {
              target['WlNumber'] = res.result
            }
          })
        }
        target[column] = value
        this.dataSource = newData
      }
    },
    // 获取物料模板下拉列表
    GetMaterialList() {
      var _this = this
      var params = {
        Data: {
          Top: '10000',
          PageSize: '10000',
          PageIndex: '1',
          Filter: "FNumber like '%%'",
          OrderBy: 'FNumber asc',
          Fields: 'FNumber,FName,FItemID'
        }
      }
      _this.loading = false
      _this.$store
        .dispatch('materialTemplateGetAll', params)
        .then(res => {
          _this.MaterialList = res.result.items
        })
        .finally(f => {
          _this.loading = false
        })
    },
    // 保存物料
    handleOk() {
      this.SaveMateriel()
    },
    // 保存
    SaveMateriel() {
      var _this = this
      this.confirmLoading = true
      // 所有物料JSON
      var newMaterialList = this.MaterialList
      var list = this.dataSource
      var j = 0
      var interror = 0
      // 保存到K3数据库，循环列表的下拉
      list.forEach(async (item, index) => {
        // 获取物料JSON
        var selmar = newMaterialList.filter(f => {
          return f.id === item.SelectMaterial
        })
        var params = {
          id: 0,
          Data: {}
        }
        // 替换模板值
        selmar.forEach(tmp => {
          var template = JSON.parse(tmp.template)
          template['FNumber'] = tmp.fNumber + '.' + (_this.custID === 0 ? item.FNumber : item.WlNumber)
          template['FName'] = item.FName
          params.Data = template
        })
        await _this.$store
          .dispatch('MaterialSave', params)
          .then(res => {
            if (res.StatusCode === 200) {
            } else {
              this.$message.error('生成物料失败')
            }
          })
          .catch(c => {
            interror++
          })
          .finally(f => {
            j = j + 1
            if (j === list.length) {
              if (_this.custID === 0) {
                setTimeout(() => {
                  this.visible = false
                  this.confirmLoading = false
                  _this.$emit('Success')
                }, 2000)
              } else {
                _this.Bill1000200Save()
              }
            }
          })
      })
    },
    // 显示
    showModal(list, custID) {
      this.custID = custID
      this.loadTable(list)
      this.visible = true
    },
    // 点击取消
    handleCancel(e) {
      this.visible = false
    },
    // 加载表格
    loadTable(list) {
      var _this = this
      _this.columns = []
      var keys = Object.keys(list[0])
      keys.forEach(k => {
        _this.columns.push({ title: k, dataIndex: k, key: k, width: '145' })
      })
      _this.columns.push({
        title: '选择物料模板',
        dataIndex: 'SelectMaterial',
        key: 'SelectMaterial',
        width: '245',
        scopedSlots: { customRender: 'SelectMaterial' }
      })
      this.dataSource = list
      this.count = this.dataSource.length
    },
    // 生成对应编码
    Bill1000200Save() {
      this.spinning = true
      var newMaterialList = this.MaterialList
      this.dataSource.forEach(async item => {
        var selmar = newMaterialList.filter(f => {
          return f.id === item.SelectMaterial
        })
        var selobj = selmar[0]
        var WlNumber =  selobj.fNumber + '.' + item.WlNumber
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
                  FNumber: WlNumber,
                  FName: item.FName
                },
                FInvMeterName: this.custID.split(',')[2],
                FInvMeterSpec: '',
                FMeterName: item.FNumber,
                FTaxCode: item.FName,
                FEnjoyPolicy: '',
                FPolicy: '',
                FJson: ''
              }
            ]
          }
        }
        this.$store
          .dispatch('Bill1000200Save', obj)
          .then(res => {})
          .finally(f => {
            setTimeout(() => {
              this.visible = false
              this.confirmLoading = false
              _this.$emit('Success')
            }, 2000)
          })
      })
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
