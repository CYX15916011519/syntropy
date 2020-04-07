<template>
  <div>
    <a-spin :spinning="spinning" :delay="delayTime">
      <div>
        <br />
        <a-table
          rowKey="wl"
          bordered
          :columns="getcolumns"
          :dataSource="getdataSource"
          :size="'small'"
          :pagination="false"
          :scroll="{ x: 1300 }"
        >
        <template slot="Info" slot-scope="text, record">
            <a-tag color="red" v-if="record.Info.length > 0">{{record.Info}}</a-tag>
        </template>
        <template slot="SelectMaterial" slot-scope="text, record, index">
            <a-select  v-if="record.Info.length > 0"
              showSearch
              :placeholder="'请选择物料用户'"
              style="min-width:120px;"
              :defaultValue="''"
              @change="value => handleSelectChange(value, index, 'SelectMaterial')"
            >
              <a-select-option v-for="tmp in getMaterialList" :key="tmp.id">
                {{ tmp.fNumber + '-' + tmp.name }}
              </a-select-option>
            </a-select>
            <!-- <a-button type="primary" size="small" v-if="record.SelectMaterial !== ''" @click="TS(index)">提交</a-button> -->
          </template>
        </a-table>
        <footer-tool-bar class="ftl">
          <a-button style="margin-left: 8px" @click="prevStep">上一步</a-button>
          <a-button :loading="loading" @click="CheckData" v-if="!CheckSuccess">下一步</a-button>
          <a-button :loading="loading" @click="nextStep" v-if="CheckSuccess">下一步</a-button>
        </footer-tool-bar>
      </div>
    </a-spin>
  </div>
</template>

<script>
export default {
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
    getMaterialList () {
      return this.MaterialList
    }
  },
  beforeMount() {
    this.GetMaterialList()
    this.loadTable()
    this.CheckData()
  },
  methods: {
    // 下拉选择后
    handleSelectChange (value, key, column) {
      var _this = this
      const newData = [...this.dataSource]
      const target = newData[key]
      if (target) {
        // 获取对应物料编码
        if (target[column] === '' && column === 'SelectMaterial') {
          var params = { textHead: 'WL' }
          this.$store.dispatch('JITCommonGetNumber', params).then(res => {
            if (res.success) {
              target['WlNumber'] = res.result
              this.UpdateTable(target)
            }
          })
        }
        target[column] = value
        this.dataSource = newData
      }
    },
    // 上一步
    prevStep() {
      this.$emit('prevStep')
    },
    // 下一步
    nextStep() {
      this.$emit('nextStep')
    },
     // 获取下拉列表
    GetMaterialList () {
      var _this = this
      var params = {
        Data: {
          Top: '10000',
          PageSize: '10000',
          PageIndex: '1',
          Filter: "FNumber like '%%'",
          OrderBy: 'FNumber asc',
          Fields: 'FNumber,FName,FItemID'
        }
      }
      _this.loading = false
      _this.$store
        .dispatch('materialTemplateGetAll', params)
        .then(res => {
          _this.MaterialList = res.result.items
        })
        .finally(f => {
          _this.loading = false
        })
    },
    // 加载表格
    loadTable() {
      var _this = this
      var keys = Object.keys(_this.listObj[0])
      keys.forEach(k => {
        if (k === 'Info') {
          _this.columns.push({ title: '校验情况', dataIndex: 'Info', key: 'Info', width: '145' })
        } else if (k === 'SelectMaterial') {
          _this.columns.push({ title: '选择物料模板', dataIndex: 'SelectMaterial', key: 'SelectMaterial', width: '245', scopedSlots: { customRender: 'SelectMaterial' } })
        } else {
          _this.columns.push({ title: k, dataIndex: k, key: k, width: '145' })
        }
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
                objList.push({ Info: '物料不存在', FNumber: f })
              } else {
                  if (f === '1.01.04.044444') {
                     console.log(typeof res.Data[0].Data)
                  }
                if (typeof res.Data[0].Data === 'string') {
                  objList.push({ Info: '物料不存在', FNumber: f })
                } else {
                  objList.push({ Info: '', FNumber: f })
                }
              }
            }
          })
          .finally(k => {
            i++
            if (i === diclist.length) {
              _this.loading = false
              console.log(objList)
              _this.UpdateFNumber(objList)
            }
          })
      })
    },
    // 更改信息
    UpdateFNumber(UpdateList) {
      var _this = this
      UpdateList.forEach(item => {
        _this.dataSource.forEach(tmp => {
          if (tmp.FNumber === item.FNumber) {
              if (tmp.FNumber === '1.01.04.044444') {
                     console.log( item.Info)
                  }
            tmp.Info = item.Info
          }
        })
      })
      _this.dataSource = _this.dataSource
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
