<!--页面代码-->
<template>
  <a-modal
    :title="title"
    :visible="visible"
    :maskClosable="false"
    @ok="handleOk"
    @cancel="handleCancel"
    width="55%"
    style="max-height:70%;"
    :bodyStyle="{ height: '-webkit-fill-available', overflow: 'auto' }"
  >
    <a-spin tip="保存中，请稍等..." :spinning="spinning">
      <a-form :form="form" @submit="handleSubmit" :layout="formLayout">
        <a-tabs :defaultActiveKey="1" :tabBarStyle="{ height: '50%', overflow: 'auto' }">
          <a-tab-pane :tab="'基本信息'" :key="1">
            <a-form-item
              label="* 模板名称："
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
            >
              <a-input v-model="form.name" :placeholder="'请输入模板名称'" />
            </a-form-item>
            <a-form-item
              label="* 物料编码："
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
            >
              <a-input v-model="form.fNumber" :placeholder="'请输入物料编码'" :disabled="true" />
            </a-form-item>
            <a-form-item
              label="* 是否启用："
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
            >
              <a-checkbox v-model="form.enable"></a-checkbox>
            </a-form-item>
          </a-tab-pane>
          <!-- 选项卡 -->
          <a-tab-pane
            v-for="tmp in Object.keys(GetNewFormGroup)"
            :tab="GetNewFormGroup[tmp].name"
            :key="GetNewFormGroup[tmp].key"
          >
            <a-form-item
              v-for="item in GetNewFormGroup[tmp].List"
              :key="item.id"
              :label="(item.required ? '* ' : '') + item.name.trim()"
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
            >
              <a-input-number
                v-if="
                  (item.type.trim() === 'float' || item.type.trim() === 'none' || item.type.trim() === 'int') &&
                    typeof JsonForm[item.id] !== 'object'
                "
                :placeholder="'请输入' + item.id.trim()"
                style="width: 100%"
                v-model="JsonForm[item.id]"
              />
              <a-input
                :placeholder="'请输入' + item.id.trim()"
                v-if="item.type.trim() === 'varchar'"
                v-model="JsonForm[item.id]"
                :defaultValue="JsonForm[item.id]"
              />
              <a-checkbox v-if="item.type.trim() === 'bit'" v-model="JsonForm[item.id]"></a-checkbox>
              <a-date-picker v-if="item.type.trim() === 'datetime'" style="width: 100%" v-model="JsonForm[item.id]" />
              <a-select
                showSearch
                v-if="(item.api !== undefined || item.List !== undefined) && item.id !== 'FUnitGroupID'"
                :placeholder="'请选择' + item.id"
                @change="value => OnChangSel(value, item)"
                :defaultValue="OnGetSel(item)"
              >
                <a-select-option v-for="apitmp in GetApiData[item.id]" :key="apitmp.FName + '-' + apitmp.FNumber">
                  {{ apitmp.FNumber + ' - ' + apitmp.FName }}
                </a-select-option>
              </a-select>
              <a-select
                showSearch
                v-if="item.id === 'FUnitGroupID'"
                :placeholder="'请选择' + item.name"
                @change="value => OnChangSel(value, item)"
                :defaultValue="OnGetSel(item)"
              >
                <a-select-option
                  v-for="apitmp in GetApiData[item.id]"
                  :key="apitmp.FName + '-' + apitmp.FDefaultUnitID"
                >
                  {{ apitmp.FDefaultUnitID + ' - ' + apitmp.FName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-tab-pane>
        </a-tabs>
      </a-form>
    </a-spin>
  </a-modal>
</template>
<!--脚本文件-->
<script>
import Remarks from '@/views/basic/materialsetup/edit'
import moment from 'moment'
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
      // 表单
      form: {
        id: 0,
        name: '',
        enable: true,
        fNumber: '',
        fItemID: 0,
        template: '',
        setBookID: ''
      },
      // 物料模板
      JsonForm: {},
      // 选项卡以及接口数据声明
      Remarks,
      // 所有API接口数据
      ApiData: {},
      NewFormGroup: {}
    }
  },
  computed: {
    // GetApiData
    GetApiData () {
      return this.ApiData
    },
    // 获取表单
    GetNewFormGroup () {
      return this.NewFormGroup
    },
    // 文字布局
    formItemLayout () {
      const { formLayout } = this
      return formLayout === 'horizontal' ? { labelCol: { span: 5 }, wrapperCol: { span: 19 } } : {}
    },
    // 文字布局
    buttonItemLayout () {
      const { formLayout } = this
      return formLayout === 'horizontal' ? { wrapperCol: { span: 19, offset: 5 } } : {}
    }
  },
  //
  created () {},
  mounted () {
    this.SetApiData()
  },
  //
  methods: {
    moment,
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
      this.form.template = ''
    },
    // 显示
    show (obj) {
      this.empty()
      this.IsEdit = false
      this.form.fItemID = obj.fItemID
      this.form.setBookID = obj.setBookID
      this.form.fNumber = obj.FNumber
      this.NewFormGroup = {}
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
    // 检验
    Oncheck () {
      if (this.form.name === '') {
        this.$message.error('模板名称不能为空')
        return true
      }
      // 检验K3物料资料
      var FormGroup = this.NewFormGroup
      var JF = this.JsonForm
      var key = Object.keys(FormGroup)
      try {
        key.forEach(k => {
          const item = FormGroup[k]
          if (item) {
            item.List.forEach(tmp => {
              console.log(typeof JF[tmp.id] + '____' + JF[tmp.id] + '____' + tmp.id)
              if (typeof JF[tmp.id] === 'string' && JF[tmp.id] === '') {
                this.$message.error(tmp.name + '不能为空')
                throw new Error(true)
              }
              if (typeof JF[tmp.id] === 'object' && JF[tmp.id].FName === '') {
                this.$message.error(tmp.name + '不能为空')
                throw new Error(true)
              }
              if (JF[tmp.id] === 0 && (tmp.type === 'int'||tmp.type === 'number')) {
                this.$message.error(tmp.name + '不能为0')
                throw new Error(true)
              }
            })
          }
        })
      } catch (error) {
        return true
      }
      return false
    },
    // 提交
    handleSubmit (obj) {
      this.ShowLoad()
      if (this.Oncheck()) {
        this.HideLoad()
        return
      }
      var _this = this
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
    // 获取模板
    OnMaterialGet () {
      var _this = this
      _this.loading = true
      var params = {
        Data: {
          FNumber: ''
        },
        GetProperty: false
      }
      _this.$store
        .dispatch('MaterialGet', params)
        .then(res => {
          // console.log(this.$store.state.Material.Detailed.Data)
          _this.SetForm(this.$store.state.Material.Detailed.Data)
        })
        .finally(f => {
          _this.loading = false
        })
    },
    // 设置下拉值
    OnChangSel (value, item) {
      // console.log(this.JsonForm[item.id])
      console.log(value)
      if (item.id === 'FTrack') {
        this.JsonForm[item.id].FID = (value + '').split('-')[1]
      }
      if (item.id === 'FUnitGroupID') {
        this.againSetUnit((value + '').split('-')[1])
      }
      if (item.id === 'FErpClsID') {
        this.JsonForm[item.id]['FID'] = (value + '').split('-')[1]
      }
      this.JsonForm[item.id].FName = (value + '').split('-')[0]
      this.JsonForm[item.id].FNumber = (value + '').split('-')[1]
    },
    againSetUnit (value) {
      console.log(value)
      var _this = this
      var obj = this.ApiData['FUnitGroupID'].filter(f => {
        return f.FDefaultUnitID * 1 === value * 1
      })
      console.log(obj)
      var params = {
        Data: {
          Filter: "FParentID = '" + obj[0].FUnitGroupID + "' "
        }
      }
      var list = ['FUnitID', 'FOrderUnitID', 'FSaleUnitID', 'FProductUnitID', 'FStoreUnitID', 'FSecUnitID']
      var url = 'MeasureUnitGetAll'

      _this.loading = true
      _this.$store
        .dispatch(url, params)
        .then(res => {
          list.forEach(f => {
            // _this.JsonForm[f] = ''
            _this.ApiData[f] = res.Data.Data
          })
        })
        .finally(f => {
          _this.loading = false
        })
    },
    OnGetSel (item) {
      var val = ''
      // console.log(this.JsonForm[item.id].FName)
      var FName = this.JsonForm[item.id].FName
      var FNumber = this.JsonForm[item.id].FNumber
      if (FName !== undefined && FName !== '') {
        val += FName
      }
      if (FNumber !== undefined && FNumber !== '') {
        val += '-'
        val += FNumber
      }
      return val
    },
    GettmpDate (item) {
      console.log(1)
      console.log(this.JsonForm[item.id])
      var val = this.JsonForm[item.id]
      if (val === '' || val === undefined) {
        return new Date()
      }
      return moment(val, 'YYYY-MM-DD')
    },
    SetForm (obj) {
      var _this = this
      _this.JsonForm = null
      _this.JsonForm = obj
      _this.CreateForm()
      // if (_this.JsonForm === []) {
      //   _this.JsonForm = obj
      // } else {
      //   const keys = Object.keys(obj)
      //   keys.forEach(k => {
      //     const label = obj[k]
      //     // console.log(label)
      //     if (label) {
      //       _this.JsonForm[k] = label
      //     }
      //   })
      // }
    },
    // 设置api数据
    SetApiData () {
      var _this = this
      var ApiList = Remarks.formRemarks
      const keys = Object.keys(ApiList)
      keys.forEach(k => {
        const label = ApiList[k]
        if (label) {
          if (label.List !== undefined) {
            _this.ApiData[k] = label.List
          }
          if (label.api !== undefined) {
            var params = label.params
            if (params === undefined) {
              params = {
                Data: {
                  Top: '10000',
                  PageSize: '10000',
                  PageIndex: '1',
                  Filter: "FNumber like '%%' ",
                  OrderBy: 'FNumber asc',
                  Fields: 'FNumber,FName,FItemID'
                }
              }
            }
            _this.loading = true
            _this.$store
              .dispatch(label.api, params)
              .then(res => {
                _this.ApiData[k] = res.Data.Data
              })
              .finally(f => {
                _this.loading = false
              })
          }
        }
      })
    },
    // 创建form
    CreateForm () {
      var _this = this
      this.NewFormGroup = null
      var FormGroup = JSON.parse(JSON.stringify(Remarks.formRemarksGroup))
      var FromList = JSON.parse(JSON.stringify(Remarks.formRemarks))
      var JsonForm = JSON.parse(JSON.stringify(this.JsonForm))
      const keys = Object.keys(FromList)
      keys.forEach(k => {
        const item = FromList[k]
        if (item) {
          if (item.OnGroup === '') { item.OnGroup = 'Other' }
          if (!item.Hide && JsonForm.hasOwnProperty(k) && item.required) {
            item.id = k
            FormGroup[item.OnGroup].List.push(item)
          }
        }
      })
      const keys1 = Object.keys(FormGroup)
      keys1.forEach(k => {
        const item = FormGroup[k]
        if (item.Hide) {
          delete FormGroup[k]
        }
        if (item) {
          item.List = _this.sortByKey(item.List, 'index')
        }
      })
      this.NewFormGroup = FormGroup
    },
    // 排序
    sortByKey (array, key) {
      return array.sort(function (a, b) {
        var x = a[key] * 1
        var y = b[key] * 1
        return x < y ? -1 : x > y ? 1 : 0
      })
    }
  }
}
</script>

<style scoped>
  .spin-content {
    border: 1px solid #91d5ff;
    background-color: #e6f7ff;
    padding: 30px;
  }
</style>
