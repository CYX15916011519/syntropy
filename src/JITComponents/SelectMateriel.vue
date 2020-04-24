<template>
  <div>
    <a-modal :title="title" :visible="visible" :maskClosable="false" @ok="handleOk" @cancel="handleCancel" width="55%">
      <a-spin :spinning="spinning">
        <a-input-search placeholder="请输入物料名称或者物料编码" v-model="keyword" @search="OnTableSearch" />
        <pagination
          :current="pagination.current"
          :total="pagination.total"
          @pageChange="onPaginationChange"
          :selRow="selectedRowKeys.length"
        />
        <a-table
          rowKey="wl"
          :size="'small'"
          :rowSelection="{
            type: 'radio',
            columnTitle: '选择',
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange
          }"
          :columns="columns"
          :dataSource="data"
          :pagination="false"
          :loading="loading"
          showSizeChanger
          showQuickJumper
          @change="handleTableChange"
          :filterMultiple="false"
        >
        </a-table>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
const columns = [
  {
    dataIndex: 'FItemID',
    key: 'FItemID'
  },
  {
    title: '物料名称',
    dataIndex: 'FName',
    key: 'FName'
  },
  {
    title: '物料编码',
    dataIndex: 'FNumber',
    key: 'FNumber'
  }
]

export default {
  name: 'SelectMateriel',
  components: {
    pagination: () => import('@/JITComponents/Pagination')
  },
  data() {
    return {
      title: '物料选择',
      formLayout: 'horizontal',
      spinning: false, // 加载框
      visible: false, // 是否显示模态框
      loading: false,
      columns,
      data: [],
      selectedRowKeys: [],
      selectedRows: {},
      total: 0,
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      Params: {
        FUNDetail: 0,
        Top: 0,
        PageSize: 10,
        PageIndex: 1,
        Filter: '',
        OrderBy: 'FNumber asc',
        Fields: 'FNumber,FName,FItemID'
      },
      keyword: ''
    }
  },
  methods: {
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onCheck(checkedKeys) {
      // console.log('onCheck', checkedKeys)
      this.checkedKeys = checkedKeys
    },
    onSelect(selectedKeys, info) {
      this.selectedKeys = selectedKeys
      this.selectinfo = info
      this.selectedRowKeys = []
      this.OnTableSearch()
    },
    // 切换分页
    onPaginationChange(page, size) {
      this.selectedRowKeys = []
      this.selectedRows = {}
      this.pagination.current = page
      this.pagination.pageSize = size
      this.Params.PageSize = this.pagination.pageSize
      this.Params.PageIndex = this.pagination.current - 1
      this.OnTableSearch()
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleTableChange(pagination, filters, sorter) {
      // console.log(sorter)
    },
    // 显示
    showModal() {
      this.visible = true
    },
    // 显示加载框
    ShowLoad() {
      this.spinning = true
    },
    // 隐藏加载框
    HideLoad() {
      this.spinning = false
    },
    // 清空表格内容
    empty() {},
    // 显示
    show(obj) {
      this.empty()
      this.OnTableSearch()
      this.showModal()
    },
    // 隐藏
    hide() {
      this.visible = false
    },
    // 确定后执行关闭弹出层/窗口
    handleOk() {
      this.handleSubmit()
    },
    // 取消操作关闭弹出层/窗口
    handleCancel() {
      this.empty()
      this.visible = false
    },
    // 提交
    handleSubmit() {
      if (this.selectedRowKeys.length > 0) {
        var params = {
          Data: {
            FNumber: this.selectedRows[0].FNumber
          },
          GetProperty: true
        }
        this.ShowLoad()
        // 获取对应物料
        this.$store
          .dispatch('MaterialGetByFItemID', params)
          .then(res => {
            if (res.StatusCode !== 200) {
              this.$message.error(res.Data)
            } else {
              this.$emit('Success', this.selectedRows[0].FNumber, res.Data[0].Data)
              this.handleCancel()
            }
          })
          .finally(f => {
            this.HideLoad()
          })
      } else {
        this.$message.warning('请选择物料')
      }
    },
    OnTableSearch() {
      var _this = this
      _this.Params.Filter = "FNumber LIKE '%" + _this.keyword + "%' OR FName LIKE '%" + _this.keyword + "%'"
      this.$store
        .dispatch('MaterialGetAll', this.Params)
        .then(res => {
          if (res.StatusCode === 200) {
            _this.data = res.Data.Data
            _this.pagination.total = res.Data.RowCount
          }
        })
        .catch(c => {})
        .finally(f => {})
    }
  }
}
</script>

<style lang="scss" scoped></style>
