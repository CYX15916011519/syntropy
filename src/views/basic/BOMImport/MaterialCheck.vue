<template>
  <div>
    <a-spin :spinning="spinning" :delay="delayTime">
      <div>
        <br />
        <a-table
          :rowKey="uuid()"
          bordered
          :columns="getcolumns"
          :dataSource="getdataSource"
          :size="'small'"
          :pagination="false"
          :scroll="{ x: 1300 }"
        >
        </a-table>
        <footer-tool-bar class="ftl">
          <a-button style="margin-left: 8px" @click="prevStep">上一步</a-button>
          <a-button style="margin-left: 8px" :loading="loading" @click="CheckData" v-if="!CheckSuccess"
            >下一步</a-button
          >
          <a-button style="margin-left: 8px" :loading="loading" @click="nextStep" v-if="CheckSuccess">下一步</a-button>
        </footer-tool-bar>
      </div>
      <CreateMaterial ref="CreateMaterial" @Success="CheckData" />
    </a-spin>
  </div>
</template>

<script>
export default {
  components: {
    CreateMaterial: () => import('./CreateMaterial')
  },
  name: 'MaterialCheck',
  props: {
    listObj: {
      type: Array,
      required: true
    },
    custID: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      spinning: false,
      delayTime: 500,
      loading: false,
      dataSource: [],
      columns: [],
      count: 0,
      CheckSuccess: false,
      MaterialList: []
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
    this.loadTable()
    this.CheckData()
  },
  methods: {
    // 上一步
    prevStep() {
      this.$emit('prevStep')
    },
    // 下一步
    nextStep() {
      this.$emit('IsSuccess', this.dataSource)
      this.$emit('SetCustID', this.custID)
      this.$emit('nextStep')
    },
    // 加载表格
    loadTable() {
      var _this = this
      _this.listObj.forEach(item => {
        var keys = Object.keys(item)
        keys.forEach(k => {
          if (JSON.stringify(_this.columns).indexOf(JSON.stringify({ title: k, dataIndex: k, key: k, width: '145' }))===-1  && k.indexOf('EMPTY') === -1) {
            _this.columns.push({ title: k, dataIndex: k, key: k, width: '145' })
          }
        })
      })

      this.dataSource = this.listObj
      this.count = this.dataSource.length
    },
    // 开始检验
    CheckData() {
      // 等于空自选BOM
      if (this.custID === '') {
        this.Optional()
      }
      // 不等于空则是客供BOM
      else {
        this.CustomerSupply()
      }
    },
    // 自选BOM
    Optional() {
      var _this = this
      _this.loading = true
      var diclist = []
      this.dataSource.forEach(f => {
        if (diclist.indexOf(f.FNumber) === -1) {
          diclist.push(f.FNumber)
        }
      })
      var List = this.dataSource
      var objList = []
      //
      var i = 0
      var interror = 0
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
              var FName = List.filter(a => {
                return a.FNumber === f
              })[0].FName
              if (res.Data.length === 0) {
                objList.push({ FNumber: f, FName: FName })
              } else {
                if (typeof res.Data[0].Data === 'string') {
                  objList.push({ FNumber: f, FName: FName })
                }
              }
            }
          })
          .catch(c => {
            interror++
          })
          .finally(k => {
            i++
            if (i === diclist.length) {
              _this.loading = false
              if (objList.length === 0 && interror === 0) {
                _this.CheckSuccess = true
                this.$message.success('物料检验通过')
              } else {
                _this.CheckSuccess = false
                _this.$refs.CreateMaterial.showModal(objList, 0)
              }
            }
          })
      })
    },
    // 客供编码
    CustomerSupply() {
      var _this = this
      // 客户信息
      var CustID = _this.custID.split(',')[0]
      // 去重物料
      var diclist = []
      this.dataSource.forEach(f => {
        if (diclist.indexOf(f.FNumber) === -1) {
          diclist.push(f.FNumber)
        }
      })
      //
      var List = this.dataSource
      var objList = []
      //
      var i = 0
      var interror = 0
      diclist.forEach(async (f, index) => {
        var params = {
          Data: {
            Top: '100',
            PageSize: '10',
            PageIndex: '1',
            Filter: "[FCustomer] = '" + CustID + "' and FMeterName = '" + f + "' ",
            OrderBy: '[FCustomer] asc',
            SelectPage: '1',
            Fields: 'FMeterName,FMeterialCode,FInvMeterName,FTaxCode'
          }
        }
        await _this.$store
          .dispatch('Bill1000200GetAll', params)
          .then(res => {
            if (res.StatusCode === 200) {
              var result = res.Data.DATA
              if (result.length > 0) {
              } else {
                var FName = List.filter(a => {
                  return a.FNumber === f
                })[0].FName
                objList.push({ FNumber: f, FName: FName })
              }
            } else {
              this.$message.error('检验失败，请检查Excel格式是否合格！')
            }
          })
          .catch(c => {
            console.log(c)
            interror++
          })
          .finally(k => {
            i++
            if (i === diclist.length) {
              _this.loading = false
              if (objList.length === 0 && interror === 0) {
                _this.CheckSuccess = true
                this.$message.success('物料检验通过')
              } else if (objList.length > 0) {
                _this.CheckSuccess = false
                _this.$refs.CreateMaterial.showModal(objList, _this.custID)
              }
            }
          })
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

<style lang="less" scoped>
.stepFormText {
  margin-bottom: 24px;

  .ant-form-item-label,
  .ant-form-item-control {
    line-height: 22px;
  }
}
.ant-table-thead > tr > th,
.ant-table-tbody > tr > td {
  padding: 16px 16px;
  word-break: break-word;
  -ms-word-break: break-all;
}
.ftl {
  text-align: center;
  width: -webkit-fill-available;
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  background-color: white;
  padding: 15px 0px;
}
.spin-content {
  border: 1px solid #91d5ff;
  background-color: #e6f7ff;
  padding: 30px;
}
</style>
