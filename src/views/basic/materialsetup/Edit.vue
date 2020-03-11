<template>
  <div>
    <a-modal
      v-model="isHide"
      title="物料"
      :closable="false"
      style="max-height:70%;width:50%"
      :bodyStyle="{height: '-webkit-fill-available',overflow: 'auto'}"
    >
      <template slot="footer">
        <a-button key="back" @click="afterClose">关闭</a-button>
        <a-button key="submit" type="primary" :loading="loading">提交</a-button>
      </template>
      <a-form v-for="(key, index) in Object.keys(form)" :key="index">
        <template v-if="GetType(key) === 'int' && GetType(key) !== '[object Object]'">
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" :label="GetName(key)">
            <a-input-number />
          </a-form-item>
        </template>
        <template v-if="GetType(key) === 'float' && GetType(key) !== '[object Object]'">
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" :label="GetName(key)">
            <a-input-number />
          </a-form-item>
        </template>
        <template v-if="GetType(key) === 'varchar' && GetType(key) !== '[object Object]'">
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" :label="GetName(key)">
            <a-input />
          </a-form-item>
        </template>
        <template v-if="GetType(key) === 'datetime' && GetType(key) !== '[object Object]'">
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" :label="GetName(key)">
            <a-date-picker style="width: 100%" />
          </a-form-item>
        </template>
        <template v-if="GetType(key) === 'bit' && GetType(key) !== '[object Object]'">
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" :label="GetName(key)">
            <a-checkbox-group v-decorator="['checkbox-group', { initialValue: ['是'] }]" style="width: 100%;">
              <a-row>
                <a-col>
                  <a-checkbox value="是"></a-checkbox>
                </a-col>
              </a-row>
            </a-checkbox-group>
          </a-form-item>
        </template>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import Remarks from '@/views/basic/materialsetup/edit'

export default {
  name: 'MaterialsetupEdit',
  props: {
    isHide: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      loading: false,
      form: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      }
    }
  },
  mounted () {
    this.OnSearch()
  },
  methods: {
    afterClose () {
      this.$emit('Close')
    },
    OnSearchParams () {
      return {
        Data: {
          FNumber: '1'
        },
        GetProperty: false
      }
    },
    OnSearch () {
      var _this = this
      _this.loading = true
      _this.$store
        .dispatch('MaterialGet', _this.OnSearchParams())
        .then(res => {
          _this.form = this.$store.state.Material.Detailed.Data
          _this.GetForm()
        })
        .finally(f => {
          _this.loading = false
        })
    },
    GetForm () {
      var _this = this
      const keys = Object.keys(this.form)
      const result = []
      keys.forEach(k => {
        const label = _this.form[k]
        if (label) {
          var obj = Remarks.formRemarks[k]
          const fieldItem = { id: k, name: (obj.name + '').trim(), type: (obj.type + '').trim() }
          result.push(fieldItem)
        }
      })
      // console.log(result)
      return this.form
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
  },
  computed: {}
}
</script>
<style lang="scss" scoped></style>
