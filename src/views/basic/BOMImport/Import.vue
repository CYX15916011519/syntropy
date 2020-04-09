<template>
  <div>
    <a-spin :spinning="loading">
      <a-form :form="form" style="max-width: 500px; margin: 40px auto 0;">
        <a-form-item label="导入类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group name="radioGroup" :defaultValue="BOMType" v-model="BOMType">
            <a-radio :value="'客供BOM导入'">客供BOM导入</a-radio>
            <a-radio :value="'自有BOM导入'">自有BOM导入</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="客户" :labelCol="labelCol" :wrapperCol="wrapperCol" v-show="BOMType !== '自有BOM导入'">
          <a-select showSearch :placeholder="'请选择客户'" v-model="CustID">
            <a-select-option v-for="tmp in CustomerList" :key="tmp.FItemID + ',' + tmp.FNumber + ',' + tmp.FName">
              {{ tmp.FNumber + ' - ' + tmp.FName }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="BOM文件（.Excel）" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-upload
            @change="exportData"
            :beforeUpload="beforeUpload"
            listType="picture"
            :defaultFileList="fileList"
            :remove="OnRemove"
            :accept="'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel'"
          >
            <a-button v-if="fileList.length === 0"> <a-icon type="upload" /> 上传（只能上传一个） </a-button>
          </a-upload>
        </a-form-item>
        <a-form-item :wrapperCol="{ span: 8, offset: 8 }">
          <a-button type="primary" @click="nextStep">下一步</a-button>
        </a-form-item>
      </a-form>
    </a-spin>
  </div>
</template>

<script>
import XLSX from 'xlsx'
export default {
  name: 'Import',
  data() {
    return {
      labelCol: { lg: { span: 8 }, sm: { span: 8 } },
      wrapperCol: { lg: { span: 16 }, sm: { span: 16 } },
      form: this.$form.createForm(this),
      fileList: [],
      uploading: false,
      ApiData: {},
      CustomerList: [],
      ListObj: {
        body: [],
        header: []
      },
      loading: false,
      CustID: '',
      BOMType: '客供BOM导入'
    }
  },
  beforeMount() {
    this.getCustomer('Customer')
  },
  computed: {
    // GetApiData
    GetApiData() {
      return this.ApiData
    }
  },
  methods: {
    nextStep() {
      this.handleOK()
      // this.$emit('nextStep')
      // this.$emit('IsSuccess', this.ListObj)
    },
    OnRemove() {
      this.fileList = []
    },
    handleChange(info) {
      const status = info.file.status
      if (status !== 'uploading') {
        // console.log(info.file, info.fileList)
      }
      if (status === 'done') {
        this.$message.success(`${info.file.name} file uploaded successfully.`)
      } else if (status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`)
      }
    },
    handleRemove(file) {
      const index = this.fileList.indexOf(file)
      const newFileList = this.fileList.slice()
      newFileList.splice(index, 1)
      this.fileList = newFileList
    },
    beforeUpload(file) {
      this.fileList = [...this.fileList, file]
      return false
    },
    handleOK() {
      var _this = this
      if ((_this.CustID === 0 || _this.CustID === '') && _this.BOMType === '客供BOM导入') {
        this.$message.warning('请选择客户')
        return
      }
      if (_this.ListObj.body.length === 0) {
        this.$message.warning('请选择BOM文件')
        return
      }
      if (this.BOMType === '客供BOM导入') {
        this.CustomerSupply()
      } else {
        this.Optional()
      }
    },
    // 自选BOM
    Optional() {
      var _this = this
      var kk = 1
      if (kk === 1) {
        this.$emit('nextStep')
        this.$emit('IsSuccess', _this.ListObj.body)
        this.$emit('SetCustID', _this.CustID)
        return
      }
      _this.loading = true
      var diclist = []
      this.ListObj.body.forEach(f => {
        if (diclist.indexOf(f.FNumber) === -1) {
          diclist.push(f.FNumber)
        }
      })
      var objList = []
      //
      var i = 0
      diclist.forEach(async (f, index) => {
        var params = {
          Data: {
            FNumber: f
          },
          GetProperty: true
        }
        // 获取对应物料
        await this.$store
          .dispatch('MaterialGetByFItemID', params)
          .then(res => {
            if (res.StatusCode !== 200) {
              this.$message.error(res.Data)
            } else {
              if (res.Data.length === 0) {
                objList.push({ FNUMBER: '', FNumber: f })
              } else {
                if (typeof res.Data[0].Data === 'string') {
                  objList.push({ FNUMBER: '', FNumber: f })
                } else {
                  objList.push({ FNUMBER: f, FNumber: f })
                }
              }
            }
            i++
            if (i === diclist.length) {
              _this.ListObj.body.forEach(item => {
                item['selectmaterial'] = ''
                item['FParentID'] = ''
                item['FNUMBER'] = ''
                item['检验情况'] = ''
                var tmp = objList.filter(a => {
                  return a.FNumber === item.FNumber
                })
                if (tmp.length > 0) {
                  item['FNUMBER'] = tmp[0].FNUMBER
                }
              })
              console.log(_this.ListObj.body)
              this.$emit('nextStep')
              this.$emit('IsSuccess', _this.ListObj.body)
              this.$emit('SetCustID', '')
            }
          })
          .finally(k => {
            if (i === diclist.length) {
              _this.loading = false
            }
          })
      })
    },
    // 客供BOM
    CustomerSupply() {
      var _this = this
      var kk = 1
      if (kk === 1) {
        this.$emit('nextStep')
        this.$emit('IsSuccess', _this.ListObj.body)
        this.$emit('SetCustID', _this.CustID)
        return
      }
      var data = _this.ListObj.body
      var CustID = _this.CustID.split(',')[1]
      var i = 0
      this.ListObj.body.forEach(async (item, index) => {
        var params = {
          Data: {
            PageSize: '1',
            PageIndex: '1'
          },
          '*Number*': item.FNumber,
          '*CustNo*': CustID,
          SQLReport: _this.$Api.BOMImportCheckUrl
        }
        item['FNUMBER'] = ''
        item['FBOMNUMBER'] = ''
        item['FERPCLSNAME'] = ''
        item['FParentID'] = ''
        item['selectmaterial'] = ''
        item['检验情况'] = ''
        await _this.$store
          .dispatch('SQLReportGetAll', params)
          .then(res => {
            if (res.StatusCode === 200) {
              var result = res.Data.DATA
              if (result.length > 0) {
                var resultMX = result[0]
                var key = Object.keys(resultMX)
                key.forEach(k => {
                  item[k] = resultMX[k]
                })
              } else {
                item['检验情况'] = '对应编码不存在'
              }
            } else {
              this.$message.error('检验失败，请检查Excel格式是否合格！')
            }
          })
          .finally(f => {
            _this.loading = false
            i = i + 1
            if (i === _this.ListObj.body.length - 1) {
              this.$emit('nextStep')
              this.$emit('IsSuccess', _this.ListObj.body)
              this.$emit('SetCustID', _this.CustID)
            }
          })
      })
    },
    handleUpload() {
      // const { fileList } = this
      // const formData = new FormData()
      // fileList.forEach(file => {
      //   formData.append('files[]', file)
      // })
      // this.uploading = true
      // var _this = this
      // _this.ListObj.header.forEach(key => {
      //   console.log(_this.ListObj.body)
      // })
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
    getCustomer(id) {
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
          // console.log(res.Data.Data)
        })
        .finally(f => {
          _this.loading = false
        })
    },
    // 解析表格获取数据
    exportData() {
      var _this = this
      _this.ListObj.body = [] // 表格数据
      _this.ListObj.header = [] // 表格列
      if (_this.fileList.length === 0) {
        return
      }
      // 拿取文件对象
      var f = _this.fileList[0]
      // 用FileReader来读取
      var reader = new FileReader()
      // 重写FileReader上的readAsBinaryString方法
      FileReader.prototype.readAsBinaryString = function(f) {
        var binary = ''
        var wb // 读取完成的数据
        var outdata // 你需要的数据
        var reader = new FileReader()
        reader.onload = function(e) {
          // 读取成Uint8Array，再转换为Unicode编码（Unicode占两个字节）
          var bytes = new Uint8Array(reader.result)
          var length = bytes.byteLength
          for (var i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i])
          }
          // 接下来就是xlsx了，具体可看api
          wb = XLSX.read(binary, {
            type: 'binary'
          })
          outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
          // 自定义方法向父组件传递数据
          // console.log(outdata)
          for (var tmp in outdata) {
            var obj = outdata[tmp]
            for (var item in obj) {
              // console.log(item)
              if (_this.ListObj.header.indexOf(item) === -1 && item.indexOf('EMPTY') === -1) {
                _this.ListObj.header.push(item)
                // _this.ListObj.header.push('操作');
              }
            }
            // obj.操作='删除'
            _this.ListObj.body.push(obj)
          }
          // _this.ListObj.header.push('操作');
          console.log(_this.ListObj)
          // console.log(JSON.stringify(_this.ListObj.header) + '_________' + JSON.stringify(_this.ListObj.body))
          // _this.loadTable()
        }
        reader.readAsArrayBuffer(f)
      }
      reader.readAsBinaryString(f)
    }
  }
}
</script>

<style lang="scss" scoped></style>
