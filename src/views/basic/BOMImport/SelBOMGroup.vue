<template>
  <div>
    <a-modal
      width="70%"
      :title="title"
      :visible="visible"
      @ok="handleOk"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
      :loading="loading"
    >
      <a-tag color="cyan">共 {{ this.getdataSource.length }} 个BOM单</a-tag>
      <a-table
        :rowKey="uuid()"
        bordered
        :columns="getcolumns"
        :dataSource="getdataSource"
        :size="'small'"
        :pagination="false"
        :scroll="{ x: 1300 }"
      >
        <template slot="FParentID" slot-scope="text, record, index">
            <a-select
              showSearch
              :placeholder="'请选择BOM单组别'"
              style="min-width:120px;"
              :defaultValue="record.FParentID"
              @change="value => handleSelectChange(value, index, 'FParentID')"
            >
              <a-select-option v-for="tmp in getSQLReport75" :key="tmp.FInterID">
                {{ tmp.FNumber + '-' + tmp.FName }}
              </a-select-option>
            </a-select>
          </template>
      </a-table>
    </a-modal>
  </div>
</template>
<script>
export default {
  name: 'SelBOMGroup',
  data() {
    return {
      title: '批量选择BOM',
      visible: false,
      confirmLoading: false,
      dataSource: [],
      columns: [],
      count: 0,
      loading: false,
      spinning: false,
      custID: 0,
      SQLReport75: []
    }
  },
  computed: {
    getdataSource() {
      return this.dataSource
    },
    getcolumns() {
      return this.columns
    },
    getSQLReport75() {
      return this.SQLReport75
    }
  },
  beforeMount() {
  },
  methods: {
    // 下拉更新值
    handleSelectChange(value, key, column) {
      var _this = this
      const newData = [...this.dataSource]
      const target = newData[key]
      if (target) { 
        target[column] = value
        this.dataSource = newData
      }
    },
    // 保存
    handleOk() {
      this.$emit('Success',this.dataSource)
      this.handleCancel()
    }, 
    // 显示
    showModal(selList, list) {
      this.SQLReport75 = selList
      this.loadTable(list)
      this.visible = true
    },
    // 点击取消
    handleCancel() {
      this.visible = false
    },
    // 加载表格
    loadTable(list) {
      var _this = this
      _this.columns = []
      var keys = Object.keys(list[0])
      keys.forEach(k => {
        if (k === 'FParentID') {
          _this.columns.push({
            title: 'BOM单组别',
            dataIndex: 'FParentID',
            key: 'FParentID',
            width: '245',
            scopedSlots: { customRender: 'FParentID' }
          })
        } else {
          _this.columns.push({ title: k, dataIndex: k, key: k, width: '145' })
        }
      })
      this.dataSource = list
      this.count = this.dataSource.length
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
