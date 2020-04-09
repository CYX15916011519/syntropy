<template>
  <div>
    <a-modal :title="title" :visible="visible" :maskClosable="false" @ok="handleOk" @cancel="handleCancel" width="55%">
      <a-spin tip="获取明细中，请稍等..." :spinning="spinning">
        <a-form :form="form" @submit="handleSubmit" :layout="formLayout">
          <a-form-item label="物料编码：" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
            <a-select showSearch style="width: 100%" v-model="form.FMeterialCode.FNumber">
              <a-select-option v-for="item in GetData" :key="item.FNumber">
                {{ item.FName + '(' + item.FNumber + ')' }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
export default {
  name: 'SelMateriel',
  data() {
    return {
      data: [],
      title: '编码对应设置',
      formLayout: 'horizontal',
      spinning: false, // 加载框
      visible: false, // 是否显示模态框
      loading: false,
      form: {
        FMeterialCode: {
          FNumber: ''
        }
      },
      keywords: '',
      data: []
    }
  },
  computed: {
    formItemLayout () {
      const { formLayout } = this
      return formLayout === 'horizontal' ? { labelCol: { span: 4 }, wrapperCol: { span: 20 } } : {}
    },
    GetData () {
      if (this.keywords === '') {
        return this.data
      }
      return this.data.filter(f => {
        return (JSON.stringify(f).indexOf(this.keywords) !== -1)
      })
    }
  },
  mounted () {
    this.GetWL()
  },
  methods: {
    handleSubmit () {},
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
    show () {
      this.showModal()
    },
    // 隐藏
    hide () {
      this.visible = false
    },
    // 确定后执行关闭弹出层/窗口
    handleOk () {
      this.GetWLMX()
    },
    // 取消操作关闭弹出层/窗口
    handleCancel () {
      this.empty()
      this.visible = false
    },
    // 获取物料列表
    GetWL () {
      var _this = this
      var MaterialGroupGetAllParams = {
        Data: {
          FUNDetail: 1,
          Top: '0',
          PageSize: '10000',
          PageIndex: '1',
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
          var colobj = []
          tab.forEach(k => {
            var col = { title: k, dataIndex: k, key: k, width: '145' }
            colobj.push(col)
          })
          this.columns = colobj
        })
      })
      var MaterialGroupGetAllParams2 = {
        Data: {
          FUNDetail: 0,
          Top: '0',
          PageSize: '10000',
          PageIndex: '1',
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
    },
    // 获取物料明细
    GetWLMX () {
      if (this.form.FMeterialCode.length === 0) {
        this.$message.error('请选择物料')
        return
      }
      var params = {
        Data: {
          FNumber: this.form.FMeterialCode.FNumber
        },
        GetProperty: true
      }
      this.ShowLoad()
      // 获取对应物料
      this.$store.dispatch('MaterialGetByFItemID', params).then(res => {
        console.log(res)
        if (res.StatusCode !== 200) {
          this.$message.error(res.Data)
        } else {
          this.$emit('Success',this.form.FMeterialCode.FNumber,res.Data[0].Data)
          this.handleCancel()
        }
      }).finally(f => {
        this.HideLoad()
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
