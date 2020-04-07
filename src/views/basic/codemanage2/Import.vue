<template>
  <div>
    <a-modal
      title="客供编码管理 —— 导入"
      :visible="visible"
      @ok="handleOk"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
      width="70%"
    >
      <a-spin tip="保存中，请稍等..." :spinning="spinning">
        <a-form :form="form">
          <a-form-item label="Excel文件" :labelCol="labelCol" :wrapperCol="wrapperCol">
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
        </a-form>
        <a-table
          bordered
          :columns="getcolumns"
          :dataSource="getdataSource"
          :size="'small'"
          :pagination="false"
          :scroll="{ x: 1200 }"
        >
        </a-table>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
import XLSX from 'xlsx'
export default {
  name: 'Codemanage2Import',
  data () {
    return {
      spinning: false, // 加载框
      labelCol: { lg: { span: 2 }, sm: { span: 2 } },
      wrapperCol: { lg: { span: 6 }, sm: { span: 6 } },
      ModalText: 'Content of the modal',
      visible: false,
      confirmLoading: false,
      ListObj: {
        body: [],
        header: []
      },
      form: {},
      fileList: [],
      columns: [],
      dataSource: [],
      dataSource_en: [],
      count: 0
    }
  },
  computed: {
    getdataSource () {
      return this.dataSource
    },
    getcolumns () {
      return this.columns
    }
  },
  methods: {
    // 显示加载框
    ShowLoad () {
      this.spinning = true
    },
    // 隐藏加载框
    HideLoad () {
      this.spinning = false
    },
    // 加载表格
    loadTable () {
      var _this = this
      var colobj = []
      var keys = _this.ListObj.header
      keys.forEach(k => {
        var col = { title: k, dataIndex: k, key: k, width: '140' }
        colobj.push(col)
      })
      console.log(colobj)
      this.columns = colobj
      this.dataSource = this.ListObj.body
      this.count = this.ListObj.body.length
    },
    showModal () {
      this.visible = true
    },
    handleOk (e) {
      this.SaveBill1000200()
    },
    handleCancel (e) {
      console.log('Clicked cancel button')
      this.visible = false
    },
    beforeUpload (file) {
      this.fileList = [...this.fileList, file]
      return false
    },
    OnRemove () {
      this.fileList = []
      this.dataSource = []
    },
    // 解析表格获取数据
    exportData () {
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
      FileReader.prototype.readAsBinaryString = function (f) {
        var binary = ''
        var wb // 读取完成的数据
        var outdata // 你需要的数据
        var reader = new FileReader()
        reader.onload = function (e) {
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
          var ii = 0
          for (var tmp in outdata) {
            var obj = outdata[tmp]
            for (var item in obj) {
              if (ii === 0) {
                _this.ListObj.header.push(item)
                // _this.ListObj.header.push('操作');
              }
            }
            // obj.操作='删除'
            _this.ListObj.body.push(obj)
            ii++
          }
          // _this.ListObj.header.push('操作');
          // console.log(JSON.stringify(_this.ListObj.header) + '_________' + JSON.stringify(_this.ListObj.body))
          _this.loadTable()
        }
        reader.readAsArrayBuffer(f)
      }
      reader.readAsBinaryString(f)
    },
    //
    SaveBill1000200 () {
      var objList = []
      this.dataSource.forEach(f => {
        objList.push({
          FClassTypeID: '',
          FBillNo: 'WL_' + this.uuid(),
          FCustomer: {
            FNumber: f.客户编码,
            FName: f.客户名称
          },
          FMeterialCode: {
            FNumber: f.物料编码,
            FName: f.物料名称
          },
          FInvMeterName: f.客户名称,
          FInvMeterSpec: '',
          FMeterName: f.客供物料编码,
          FTaxCode: f.客供物料名称,
          FEnjoyPolicy: '',
          FPolicy: '',
          FJson: ''
        })
      })
      this.Save(objList)
    },
    Save (objList) {
      objList.forEach((f, index) => {
        var obj = {
          Data: {
            Page1: [f]
          }
        }
        this.confirmLoading = true
        this.ShowLoad()
        this.$store
          .dispatch('Bill1000200Save', obj)
          .then(res => {
            if (res.StatusCode === 200) {
              if (index === objList.length - 1) {
                this.$emit('Success')
                this.visible = false
              }
              this.$message.success('保存成功')
            } else {
              this.$message.error(res.Message)
            }
          })
          .finally(() => {
            setTimeout(() => {
              this.confirmLoading = false
              this.HideLoad()
            }, 2000)
          })
      })
    },
    uuid () {
      var s = []
      var hexDigits = '0123456789abcdef'
      for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
      }
      s[14] = '4'// bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1)// bits 6-7 of the clock_seq_hi_and_reserved to 01
      s[8] = s[13] = s[18] = s[23] = '-'
      var uuid = s.join('')
      return uuid
    }
  }
}
</script>

<style lang="scss" scoped></style>
