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
      style="max-height:70%;"
      :bodyStyle="{height: '-webkit-fill-available',overflow: 'auto'}"
    >
      <a-form :form="form" @submit="handleSubmit" :layout="formLayout">
        <a-tabs :defaultActiveKey="1">
          <a-tab-pane :tab="'基本信息'" :key="1">
            <a-form-item
              label="模板名称："
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
            >
              <a-input v-model="form.name" :placeholder="'请输入模板名称'" />
            </a-form-item>
            <a-form-item
              label="物料编码："
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
            >
              <a-input v-model="form.fNumber" :placeholder="'请输入物料编码'" :disabled="true" />
            </a-form-item>
            <a-form-item
              label="是否启用："
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
            >
              <a-checkbox :checked="form.enable"></a-checkbox>
            </a-form-item>
          </a-tab-pane>
          <a-tab-pane v-for="tmp in Object.keys(getK3Form)" :tab="getK3Form[tmp].name" :key="getK3Form[tmp].key" v-if="!getK3Form[tmp].Hide">
            <a-form-item v-for="(item) in getK3Form[tmp].list" :key="item.id" :label="(item.required ? '* ':'') + item.name" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
              <a-input-number v-if="(item.type === 'int' || item.type === 'float' || item.type === 'none') && tg(item)" :placeholder="'请输入' + item.name" style="width: 100%" :defaultValue="JsonForm[item.id] * 1" />
              <a-input v-if="item.type === 'varchar' && tg(item)" :placeholder="'请输入' + item.name" :defaultValue="JsonForm[item.id] * 1"/>
              <a-date-picker v-if="item.type === 'datetime' && tg(item)" style="width: 100%" />
              <a-checkbox v-if="item.type === 'bit' && tg(item)" :value="JsonForm[item.id]"></a-checkbox>
              <a-select showSearch v-if="(item.api !== undefined || item.List !== undefined) && item.id !== 'FUnitGroupID'" :placeholder="'请选择' + item.name" style="width: 100%" @change="value => OnChangSel(value, item)">
                <a-select-option v-for="(apitmp) in getApiData[item.id]" :key="apitmp.FName + ',' + apitmp.FNumber">
                  {{ apitmp.FNumber + ' - ' + apitmp.FName }}
                </a-select-option>
              </a-select>
              <a-select showSearch v-if="item.id === 'FUnitGroupID'" :placeholder="'请选择' + item.name" style="width: 100%" @change="value => OnChangSel(value, item)">
                <a-select-option v-for="(apitmp) in getApiData[item.id]" :key="apitmp.FName + ',' + apitmp.FNumber">
                  {{ apitmp.FDefaultUnitID + ' - ' + apitmp.FName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-tab-pane>
        </a-tabs>
      </a-form>
    </a-modal>
  </a-spin>
</template>
<!--脚本文件-->
<script>
import Remarks from '@/views/basic/materialsetup/edit'
//
export default {
  name: 'AddOrEdit',
  data () {
    return {
      title: '物料模板设置',
      formLayout: 'horizontal',
      spinning: false, // 加载框
      visible: false, // 是否显示模态框
      loading: false,
      IsEdit: false,
      form: {
        id: 0,
        name: '',
        enable: true,
        fNumber: '',
        fItemID: 0,
        template: '',
        setBookID: ''
      },
      JsonForm: {},
      Remarks,
      K3From: Remarks.formRemarksGroup,
      ApiData: {}
    }
  },
  computed: {
    formItemLayout () {
      const { formLayout } = this
      return formLayout === 'horizontal' ? { labelCol: { span: 5 }, wrapperCol: { span: 19 } } : {}
    },
    buttonItemLayout () {
      const { formLayout } = this
      return formLayout === 'horizontal' ? { wrapperCol: { span: 19, offset: 5 } } : {}
    },
    getK3Form () {
      // console.log(this.K3From)
      return this.K3From
    },
    getApiData () {
      return this.ApiData
    }
  },
  //
  created () {},
  mounted () {
    this.getApiData2()
  },
  //
  methods: {
    getApiData2 () {
      var _this = this
      var t = Remarks.formRemarks
      const keys = Object.keys(t)
      keys.forEach(k => {
        const label = t[k]
        if (label) {
          if (label.api !== undefined) {
            var obj1 = {
              Data: {
                Top: '10000',
                PageSize: '10000',
                PageIndex: '1',
                Filter: "FNumber like '%%' ",
                OrderBy: 'FNumber asc',
                Fields: 'FNumber,FName,FItemID'
              }
            }
            if (label.Parame !== undefined) {
              obj1 = label.Parame
            }
            _this.SetApiData(k, label.api, obj1)
          }
        }
      })
    },
    tg (item) {
      return item.api === undefined && item.List === undefined && item.id !== 'FUnitGroupID'
    },
    sortByKey (array, key) {
      return array.sort(function (a, b) {
        var x = a[key] * 1
        var y = b[key] * 1
        return x < y ? -1 : x > y ? 1 : 0
      })
    },
    OnChangSel (value, item) {
      this.JsonForm[item.id].FName = (value + '').split(',')[0]
      this.JsonForm[item.id].FNumber = (value + '').split(',')[1]
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
      this.form.id = 0
      this.form.name = ''
      this.form.enable = false
      this.form.fNumber = ''
      this.form.remark = ''
    },
    // 显示
    show (obj) {
      this.empty()
      this.IsEdit = false
      this.form.fItemID = obj.fItemID
      this.form.setBookID = obj.setBookID
      this.form.fNumber = obj.FNumber
      if (obj.id !== 0) {
        this.IsEdit = true
        this.GetDetailed(obj)
      } else {
        this.OnMaterialGet()
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
      // console.log(_this.form)
      _this.ShowLoad()
      _this.form.template = JSON.stringify(this.JsonForm)
      _this.$store
        .dispatch('materialTemplateSave', _this.form)
        .then(res => {
          var saveRestult = this.$store.state.materialTemplate.saveRestult
          if (saveRestult.success) {
            _this.$notification['success']({
              message: '系统提示',
              description: obj.id === 0 ? '添加成功' : '保存成功'
            })
            _this.empty()
            _this.hide()
            _this.$emit('Success')
          } else {
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
      _this.loading = true
      _this.$store.dispatch('materialTemplateGet', obj).then(() => {
        var result = this.$store.state.materialTemplate.Detailed
        if (result.success) {
          _this.form = result.result
          _this.SetForm(JSON.parse(_this.form.template))
          _this.OnCForm()
        } else {
          _this.$notification['error']({
            message: result.error.message,
            description: result.error.details
          })
        }
      }).finally(f => {
        _this.loading = false
      })
    },
    OnSearchParams () {
      return {
        Data: {
          FNumber: ''
        },
        GetProperty: false
      }
    },
    OnMaterialGet () {
      var _this = this
      _this.loading = true
      _this.$store
        .dispatch('MaterialGet', _this.OnSearchParams())
        .then(res => {
          _this.SetForm(this.$store.state.Material.Detailed.Data)
          _this.OnCForm()
        })
        .finally(f => {
          _this.loading = false
        })
    },
    OnCForm () {
      var _this = this
      var formRemarksGroup = Remarks.formRemarksGroup
      var formRemarks = Remarks.formRemarks
      var f = this.JsonForm
      const keys = Object.keys(f)
      keys.forEach(k => {
        const label = f[k]
        if (label) {
          var obj = formRemarks[k]
          if (obj.OnGroup === '') {
            obj.OnGroup = 'Other'
          }
          formRemarksGroup[obj.OnGroup].list = []
        }
      })
      keys.forEach(k => {
        const label = f[k]
        if (label) {
          // console.log(label)
          var obj = formRemarks[k]
          // console.log(obj)
          if (obj.OnGroup === '') {
            obj.OnGroup = 'Other'
          }
          var value = {}
          var type = typeof label
          // console.log(type)
          if (type === 'number' || type === 'string' || type === 'boolean') {
            value = label
          } else if (type === 'object') {
            value = label.FNumber + ',' + label.FName
          }
          if (obj.List !== undefined) {
            _this.ApiData[k] = obj.List
          } else {
            obj.List = []
          }
          const fieldItem = { id: k, name: (obj.name + '').trim(), type: (obj.type + '').trim(), OnGroup: obj.OnGroup, index: obj.index, api: obj.api, List: obj.List, required: obj.required, Parame: obj.Parame, value: value }
          if (!obj.Hide) {
            formRemarksGroup[obj.OnGroup].list.push(fieldItem)
          }
          if (obj.api !== undefined) {
            var obj1 = {
              Data: {
                Top: '10000',
                PageSize: '10000',
                PageIndex: '1',
                Filter: "FNumber like '%%' ",
                OrderBy: 'FNumber asc',
                Fields: 'FNumber,FName,FItemID'
              }
            }
            if (obj.Parame !== undefined) {
              obj1 = obj.Parame
            }
            _this.SetApiData(k, obj.api, obj1)
          }
        }
      })
      const keys1 = Object.keys(formRemarksGroup)
      keys1.forEach(k => {
        const label = formRemarksGroup[k]
        // if (label.Hide) {
        //   delete formRemarksGroup[k]
        // }
        if (label) {
          label.list = _this.sortByKey(label.list, 'index')
        }
      })
    },
    SetForm (obj) {
      var _this = this
      if (_this.JsonForm === []) {
        _this.JsonForm = obj
      } else {
        const keys = Object.keys(obj)
        keys.forEach(k => {
          const label = obj[k]
          // console.log(label)
          if (label) {
            _this.JsonForm[k] = label
          }
        })
      }
    },
    SetApiData (id, api, obj) {
      var _this = this
      if (_this.ApiData[id] !== undefined) {
        return
      }
      _this.loading = true
      _this.$store
        .dispatch(api, obj)
        .then(res => {
          _this.ApiData[id] = res.Data.Data
        })
        .finally(f => {
          _this.loading = false
        })
    },
    GetName (k) {
      var obj = Remarks.formRemarks[k]
      if (obj) {
        return (obj.name + '').trim()
      } else {
        return ''
      }
    },
    GetType (k) {
      var obj = Remarks.formRemarks[k]
      if (obj) {
        return (obj.type + '').trim()
      } else {
        return ''
      }
    },
    GetRequired (k) {
      var obj = Remarks.formRemarks[k]
      if (obj) {
        return (obj.required + '').trim()
      } else {
        return ''
      }
    }
  }
}
</script>
