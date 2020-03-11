<template>
  <div>
    <a-form :form="form" style="max-width: 500px; margin: 40px auto 0;">
      <a-form-item label="物料用户" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-select showSearch :placeholder="'请选择物料用户'">
          <a-select-option v-for="tmp in CustomerList" :key="tmp.FName + '-' + tmp.FNumber">
            {{ tmp.FNumber + ' - ' + tmp.FName }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="BOM文件（.Excel）" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-upload :beforeUpload="beforeUpload" listType="picture" :defaultFileList="fileList" :accept="'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel'" :remove="OnRemove">
          <a-button v-if="fileList.length === 0"> <a-icon type="upload" /> 上传（只能上传一个） </a-button>
        </a-upload>
      </a-form-item>
      <a-form-item :wrapperCol="{ span: 8, offset: 8 }">
        <a-button type="primary" @click="nextStep">下一步</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
export default {
  name: 'Import',
  data () {
    return {
      labelCol: { lg: { span: 8 }, sm: { span: 8 } },
      wrapperCol: { lg: { span: 16 }, sm: { span: 16 } },
      form: this.$form.createForm(this),
      fileList: [],
      uploading: false,
      ApiData: {},
      CustomerList: []
    }
  },
  beforeMount () {
    this.getCustomer('Customer')
  },
  computed: {
    // GetApiData
    GetApiData () {
      return this.ApiData
    }
  },
  methods: {
    nextStep () {
      this.$emit('nextStep')
    },
    OnRemove () {
      this.fileList = []
    },
    handleChange (info) {
      const status = info.file.status
      if (status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (status === 'done') {
        this.$message.success(`${info.file.name} file uploaded successfully.`)
      } else if (status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`)
      }
    },
    handleRemove (file) {
      const index = this.fileList.indexOf(file)
      const newFileList = this.fileList.slice()
      newFileList.splice(index, 1)
      this.fileList = newFileList
    },
    beforeUpload (file) {
      this.fileList = [...this.fileList, file]
      return false
    },
    handleUpload () {
      const { fileList } = this
      const formData = new FormData()
      fileList.forEach(file => {
        formData.append('files[]', file)
      })
      this.uploading = true
      // You can use any AJAX library you like
      //   reqwest({
      //     url: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      //     method: 'post',
      //     processData: false,
      //     data: formData,
      //     success: () => {
      //       this.fileList = []
      //       this.uploading = false
      //       this.$message.success('upload successfully.')
      //     },
      //     error: () => {
      //       this.uploading = false
      //       this.$message.error('upload failed.')
      //     }
      //   })
    },
    getCustomer (id) {
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
          _this.CustomerList = res.Data.Data
          console.log(res.Data.Data)
        })
        .finally(f => {
          _this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped></style>
