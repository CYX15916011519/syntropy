<template>
  <div>
    <a-modal
      width="50%"
      :title="title"
      :visible="visible"
      @ok="handleOk"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
      :loading="loading"
    >
      <a-tag color="cyan">共 {{ this.getdataSource.length }} 个物料不存在</a-tag>
      <a-table
        :rowKey="uuid()"
        bordered
        :columns="getcolumns"
        :dataSource="getdataSource"
        :size="'small'"
        :pagination="false"
      >
        <template slot="FName" slot-scope="text, record">
          <a-input v-model="record.FName" placeholder="请输入物料名称" />
        </template>
        <template slot="SelectMaterial" slot-scope="text, record, index">
          <a-select
            showSearch
            :placeholder="'请选择物料模板'"
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
  name: 'CreateMaterial',
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
      custID: 0,
      WlNumber: []
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
        target[column] = value
        this.dataSource = newData
      }
    },
    GetJITCommonGetNumberList() {
      var _this = this
      if (this.custID !== 0 && _this.WlNumber.length === 0) {
        var params = { textHead: 'WL', Num: _this.dataSource.length }
        this.$store.dispatch('JITCommonGetNumberList', params).then(res => {
          if (res.success) {
            _this.WlNumber = res.result
          }
        })
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
      if (this.SaveCheck()) {
        this.SaveMateriel()
      }
    },
    // 保存检验
    SaveCheck() {
      var list = this.dataSource.filter(f => {
        return f.FName.length === 0 || f.SelectMaterial.length === 0
      })
      if (list.length > 0) {
        this.$message.warning('请填写完整信息，名称与物料模板不能为空！')
        return false
      }
      return true
    },
    // 保存
    async SaveMateriel() {
      var _this = this
      this.confirmLoading = true
      // 所有物料JSON
      var newMaterialList = this.MaterialList

      var params = {
        id: 0,
        Data: []
      }
      // 保存到K3数据库，循环列表的下拉
      this.dataSource.forEach((item, index) => {
        // 获取物料JSON
        var selmar = newMaterialList.filter(f => {
          return f.id === item.SelectMaterial
        })
        // 替换模板值
        selmar.forEach(tmp => {
          var template = JSON.parse(tmp.template)
          template['FNumber'] = _this.custID === 0 ? item.FNumber : tmp.fNumber + '.' + _this.WlNumber[index]
          template['FName'] = item.FName
          params.Data.push(template)
        })
      })
      var interror = 0
      var StatusCode = 200
      _this.$store
        .dispatch('MaterialSave', params)
        .then(res => {
          StatusCode = res.StatusCode
          if (res.StatusCode === 200) {
          } else {
            this.$message.error(res.Data[0].DataDesc)
            this.$message.error('生成物料失败')
          }
        })
        .catch(c => {
          StatusCode = 0
        })
        .finally(f => {
          this.confirmLoading = false
          var TF = StatusCode === 200
          if (_this.custID === 0 && TF) {
            setTimeout(() => {
              this.visible = false
              this.confirmLoading = false
              this.$emit('Success')
            }, 2000)
          } else if (TF) {
            _this.Bill1000200Save()
          }
        })
    },
    // 显示
    showModal(list, custID) {
      this.custID = custID
      this.loadTable(list)
      this.visible = true
      this.GetJITCommonGetNumberList()
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
        if (k !== 'FName' && k !== 'FNumber' && k !== 'SelectMaterial') {
          _this.columns.push({ title: k, dataIndex: k, key: k, width: '145' })
        }
      })
      _this.columns.push({ title: '物料编码', dataIndex: 'FNumber', key: 'FNumber', width: '145' })
      _this.columns.push({
        title: '物料名称',
        dataIndex: 'FName',
        key: 'FName',
        width: '245',
        scopedSlots: { customRender: 'FName' }
      })
      _this.columns.push({
        title: '选择物料模板',
        dataIndex: 'SelectMaterial',
        key: 'SelectMaterial',
        width: '245',
        scopedSlots: { customRender: 'SelectMaterial' }
      })
      // if (this.custID !== 0) {
      //   _this.columns.push({ title: '对应关系', dataIndex: 'DYGX', key: 'DYGX', width: '145' })
      // }
      this.dataSource = list
      this.count = this.dataSource.length
    },
    // 生成对应编码数据
    Bill1000200Save() {
      var _this = this
      this.spinning = true
      var newMaterialList = this.MaterialList
      var SaveList = []
      this.dataSource.forEach((item, index) => {
        var selmar = newMaterialList.filter(f => {
          return f.id === item.SelectMaterial
        })
        var selobj = selmar[0]
        var WlNumber = selobj.fNumber + '.' + _this.WlNumber[index]
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
        SaveList.push(obj)
      })
      this.FormalBill1000200Save(SaveList, 0)
    },
    // 正式保存数据
    async FormalBill1000200Save(SaveList, i) {
      this.confirmLoading = true
      if (SaveList.length === i) {
        setTimeout(() => {
          this.visible = false
          this.confirmLoading = false
          this.$emit('Success')
        }, 2000)
        return
      }
      var obj = SaveList.slice(i, i + 1)[0]
      var StatusCode = 200
      await this.$store
        .dispatch('Bill1000200Save', obj)
        .then(res => {
          StatusCode = res.StatusCode
        })
        .catch(c => {
          this.FormalBill1000200Save(SaveList, i)
        })
        .finally(f => {
          this.confirmLoading = false
          if (StatusCode === 200) {
            this.FormalBill1000200Save(SaveList, i + 1)
          } else {
            this.FormalBill1000200Save(SaveList, i)
          }
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
