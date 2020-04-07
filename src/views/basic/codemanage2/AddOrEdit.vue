<!--页面代码-->
<template>
  <a-modal
    :title="title"
    :visible="visible"
    :maskClosable="false"
    @ok="handleOk"
    @cancel="handleCancel"
    width="55%"
  >
    <a-spin tip="保存中，请稍等..." :spinning="spinning">
      <a-form :form="form" @submit="handleSubmit" :layout="formLayout">
        <a-form-item label="客供物料编码：" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
          <a-input v-model="form.FMeterName" placeholder />
        </a-form-item>
        <a-form-item label="客供物料名称：" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
          <a-input v-model="form.FTaxCode" placeholder />
        </a-form-item>
        <a-form-item label="客户：" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
          <a-select showSearch style="width: 100%" v-model="form.FCustomer.FNumber">
            <a-select-option v-for="item in customList" :key="item.FNumber">
              {{ item.FName + '(' + item.FNumber + ')' }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="K3物料编码：" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
          <a-select showSearch style="width: 100%" v-model="form.FMeterialCode.FNumber">
            <a-select-option v-for="item in GetData" :key="item.FNumber">
              {{ item.FName + '(' + item.FNumber + ')' }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
      <!-- <a-table
        :rowSelection="RowRadioSelection"
        :columns="GetColumns"
        :dataSource="GetData"
      /> -->
    </a-spin>
  </a-modal>
</template>
<!--脚本文件-->
<script>
//
const RowRadioSelection = {
  type: 'radio',
  columnTitle: '选择',
  onSelect: (selectedRowKeys, selectedRows) => {
    console.log(selectedRowKeys, selectedRows)
  }
}
export default {
  name: 'AddOrEdit',
  data () {
    return {
      data: [],
      columns: [],
      title: '编码对应设置',
      formLayout: 'horizontal',
      spinning: false, // 加载框
      visible: false, // 是否显示模态框
      loading: false,
      IsEdit: false,
      form: {
        FClassTypeID: '',
        FBillNo: '',
        FCustomer: {
          FNumber: '',
          FName: ''
        },
        FMeterialCode: {
          FNumber: '',
          FName: ''
        },
        FInvMeterName: '',
        FInvMeterSpec: '',
        FMeterName: '',
        FTaxCode: '',
        FEnjoyPolicy: '',
        FPolicy: '',
        FJson: ''
      },
      form1: {
        FClassTypeID: '',
        FBillNo: '',
        FCustomer: {
          FNumber: '',
          FName: ''
        },
        FMeterialCode: {
          FNumber: '',
          FName: ''
        },
        FInvMeterName: '',
        FInvMeterSpec: '',
        FMeterName: '',
        FTaxCode: '',
        FEnjoyPolicy: '',
        FPolicy: '',
        FJson: ''
      },
      customList: [],
      keywords: '',
      RowRadioSelection
    }
  },
  computed: {
    formItemLayout () {
      const { formLayout } = this
      return formLayout === 'horizontal' ? { labelCol: { span: 4 }, wrapperCol: { span: 20 } } : {}
    },
    buttonItemLayout () {
      const { formLayout } = this
      return formLayout === 'horizontal' ? { wrapperCol: { span: 20, offset: 4 } } : {}
    },
    GetData () {
      if (this.keywords === '') {
        return this.data
      }
      return this.data.filter(f => {
        return (JSON.stringify(f).indexOf(this.keywords) !== -1)
      })
    },
    GetColumns () {
      return this.columns
    }
  },
  //
  created () {},
  mounted () {
    this.GetWL()
    this.GetCustomList()
  },
   watch: {
     'form.FCustomer.FNumber':{
        deep: true,
        handler: function (newVal, oldVal){
          var FName = this.customList.filter(f => { return f.FNumber === newVal })[0].FName
          this.form.FCustomer.FName = FName
          // this.form.FTaxCode = FName
        }
      },
      'form.FMeterialCode.FNumber':{
        deep: true,
        handler: function (newVal, oldVal){
          var FName = this.GetData.filter(f => { return f.FNumber === newVal })[0].FName
          this.form.FInvMeterName = FName
          this.form.FMeterialCode.FName = FName
        }
      }
   },
  //
  methods: {
    //
    OnFMeterial () {
      var FName = this.GetData.filter(f => { return f.FNumber === this.form.FCustomer.FNumber })[0].FName
      this.form.FCustomer.FName = FName
      this.form.FTaxCode = FName
    },
    //
    OnChangeFCust () {
      var FName = this.customList.filter(f => { return f.FNumber === this.form.FMeterialCode.FNumber })[0].FName
      this.form.FInvMeterName = FName
      this.form.FMeterialCode.FName = FName
    },
    // 显示
    showModal () {
      this.visible = true
    },
    // 显示加载框
    ShowLoad () {
      this.spinning = true
    },
    // 隐藏加载框
    HideLoad () {
      this.spinning = false
    },
    // 清空表格内容
    empty () {
    },
    // 显示
    show (obj) {
      this.empty()
      this.IsEdit = false
      if (obj.FBillNo !== undefined) {
        this.IsEdit = true
        obj = {
          Data: {
            FBillNo: obj.FBillNo
          }
        }
        this.GetDetailed(obj)
      } else {
        this.form = this.form1
      }
      this.showModal()
    },
    // 隐藏
    hide () {
      this.visible = false
    },
    // 确定后执行关闭弹出层/窗口
    handleOk () {
      this.handleSubmit()
    },
    // 取消操作关闭弹出层/窗口
    handleCancel () {
      this.empty()
      this.visible = false
    },
    // 提交
    handleSubmit () {
      var _this = this
      if (this.spinning) { return }
      _this.ShowLoad()
      var obj = {
        FBillNo: _this.form.FBillNo,
        Data: {
          Page1: [_this.form]
        }
      }
      _this.$store
        .dispatch('Bill1000200Save' + (_this.form.FBillNo.length > 0 ? '2' : ''), obj)
        .then(res => {
          var saveRestult = this.$store.state.Bill1000200.saveRestult
          if (saveRestult.StatusCode === 200) {
            _this.$notification['success']({
              message: '系统提示',
              description: '保存成功'
            })
            _this.empty()
            _this.hide()
            _this.$emit('Success')
          } else {
            // console.log(res)
            _this.$notification['error']({
              message: saveRestult.Message,
              description: '保存失败'
            })
          }
        })
        .finally(() => {
          _this.HideLoad()
        })
    },
    // 获取明细
    GetDetailed (obj) {
      var _this = this
      _this.$store.dispatch('Bill1000200GetByFItemID', obj).then(res => {
        if (res.StatusCode === 200) {
          _this.form = res.Data.Page1[0]
        } else {
          _this.$notification['error']({
            message: res.Message,
            description: '获取明细异常'
          })
        }
      })
    },
    OnSearchParams () {
      return {
        Data: {
          FNumber: '1'
        },
        GetProperty: false
      }
    },
    GetCustomList () {
      var _this = this
      _this.$store.dispatch('CustomerGetAll', {}).then(() => {
        // console.log(this.$store.state.Customer.List)
        var result = this.$store.state.Customer.List
        if (result.StatusCode === 200) {
          _this.customList = result.Data.Data
        } else {
          _this.$notification['error']({
            message: result.error.message,
            description: result.error.details
          })
        }
      })
    },
    GetWL () {
      this.GetMaterielList()
      this.GetMaterieDetailed()
    },
    //
    GetMaterieDetailed () {
      var MaterialGroupGetAllParams2 = {
        Data: {
          FUNDetail: 0,
          Top: '0',
          PageSize: 100,
          PageIndex: 1,
          Filter: "FNumber like '%%'",
          OrderBy: 'FNumber asc',
          Fields: 'FNumber,FName,FItemID'
        }
      }
      this.$store.dispatch('MaterialGroupGetAll', MaterialGroupGetAllParams2).then(res => {
        // console.log(this.$store.state.MaterialGroup.List.Data)
        var list = this.$store.state.MaterialGroup.List.Data
        list.forEach(item => {
          _this.data.push(item)
        })
      })
       .finally(f => {
          _this.loading = false
          if (_this.$store.state.MaterialGroup.List.RowCount > _this.data.length) {
            _this.MaterialGroupGetAllParams2.Data.PageIndex = _this.MaterialGroupGetAllParams2.Data.PageIndex * 1 + 1
            _this.GetMaterieDetailed()
          } else {
            
          }
        })
    },
    //
    GetMaterielList () {
       var _this = this
      var MaterialGroupGetAllParams = {
        Data: {
          FUNDetail: 1,
          Top: '0',
          PageSize: 100,
          PageIndex: 1,
          Filter: "FNumber like '%%'",
          OrderBy: 'FNumber asc',
          Fields: 'FNumber,FName'
        }
      }
      this.$store.dispatch('MaterialGroupGetAll', MaterialGroupGetAllParams).then(res => {
        // console.log(this.$store.state.MaterialGroup.List.Data)
        var list = this.$store.state.MaterialGroup.List.Data
        list.forEach(item => {
          _this.data.push(item)
          if (_this.data.length === 0) {
            return []
          }
          var tab = Object.keys(_this.data[0])
          tab.forEach(k => {
            var col = { title: k, dataIndex: k, key: k, width: '145' }
            this.columns.push(col)
          })
        })
      })
      .finally(f => {
          _this.loading = false
          if (_this.$store.state.MaterialGroup.List.RowCount > _this.columns.length) {
            _this.MaterialGroupGetAllParams.Data.PageIndex = _this.MaterialGroupGetAllParams.Data.PageIndex * 1 + 1
            _this.GetMaterielList()
          } else {
            
          }
        })
    }
  }
}
</script>
