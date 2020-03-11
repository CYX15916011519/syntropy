<!--页面代码-->
<template>
  <a-spin tip="保存中，请稍等..." :spinning="spinning">
    <a-modal
      :title="title"
      :visible="visible"
      :maskClosable="false"
      @ok="handleOk"
      @cancel="handleCancel"
      width="55%"
    >
      <a-form :form="form" @submit="handleSubmit" :layout="formLayout">
        <a-form-item label="客户编码：" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
          <a-input v-model="form.customFNumber" placeholder />
        </a-form-item>
        <a-form-item label="本地物料编码：" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
          <a-input v-model="form.localFNumber" placeholder disabled/>
        </a-form-item>
        <a-form-item label="客户：" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
          <a-select style="width: 100%" v-model="form.customID">
            <a-select-option v-for="item in customList" :key="item.FItemID">
              {{ item.FName + '(' + item.FNumber + ')' }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-spin>
</template>
<!--脚本文件-->
<script>
//
export default {
  name: 'AddOrEdit',
  data () {
    return {
      title: '编码对应设置',
      formLayout: 'horizontal',
      spinning: false, // 加载框
      visible: false, // 是否显示模态框
      loading: false,
      IsEdit: false,
      form: {
        id: 0,
        customID: '',
        customFNumber: '',
        localFNumber: ''
      },
      customList: []
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
    }
  },
  //
  created () {},
  mounted () {
    this.GetCustomList()
  },
  //
  methods: {
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
      this.form.id = 0
      this.form.customID = ''
      this.form.customFNumber = ''
      this.form.localFNumber = ''
    },
    // 显示
    show (obj) {
      this.empty()
      this.IsEdit = false
      this.form.localFNumber = obj.fItemID
      if (obj.id !== 0) {
        this.IsEdit = true
        this.GetDetailed(obj)
      }
      this.showModal()
    },
    // 隐藏
    hide () {
      this.visible = false
    },
    // 确定后执行关闭弹出层/窗口
    handleOk () {
      this.handleSubmit(this.form)
    },
    // 取消操作关闭弹出层/窗口
    handleCancel () {
      this.empty()
      this.visible = false
    },
    // 提交
    handleSubmit (obj) {
      var _this = this
      console.log(_this.form)
      _this.ShowLoad()
      _this.$store
        .dispatch('LocalMaterialMapCustomMaterialSave', _this.form)
        .then(res => {
          var saveRestult = this.$store.state.LocalMaterialMapCustomMaterial.saveRestult
          if (saveRestult.success) {
            _this.$notification['success']({
              message: '系统提示',
              description: obj.id === 0 ? '添加成功' : '保存成功'
            })
            _this.empty()
            _this.hide()
            _this.$emit('Success')
          } else {
            // console.log(res)
            _this.$notification['error']({
              message: res.error.message,
              description: res.error.details
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
      _this.$store.dispatch('LocalMaterialMapCustomMaterialGet', obj).then(() => {
        var result = this.$store.state.LocalMaterialMapCustomMaterial.Detailed
        if (result.success) {
          _this.form = result.result
        } else {
          _this.$notification['error']({
            message: result.error.message,
            description: result.error.details
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
    }
  }
}
</script>
