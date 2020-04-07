<template>
  <a-card :bordered="false">
    <a-row :gutter="8">
      <a-col :span="24">
        <div class="table-operations">
          <Handle :handle="'reload,add,delete,edit'" @add="OnAdd" @reload="OnReload" @delete="OnDelete" @edit="OnEdit" />
        </div>
        <!-- 分页 -->
        <pagination :current="pagination.current" :total="pagination.total" @pageChange="onPaginationChange" :selRow="selectedRowKeys.length" />
        <a-table
          :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
          :columns="columns"
          :rowKey="record => record.id"
          :dataSource="data"
          :pagination="false"
          :loading="loading"
          showSizeChanger
          showQuickJumper
          @change="handleTableChange"
        >
        </a-table>
      </a-col>
    </a-row>
    <AddOrEdit ref="AddOrEdit" @Success="OnReload" />
  </a-card>
</template>

<script>
const columns = [
  {
    title: 'Id',
    dataIndex: 'id',
    width: '5%'
  },
  {
    title: '账套名称',
    dataIndex: 'name',
    sorter: true,
    width: '20%'
  },
  {
    title: '连接秘钥',
    dataIndex: 'authorityCode',
    sorter: true,
    width: '20%'
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: '60%'
  }
]
export default {
  components: {
    Handle: () => import('@/JITComponents/handle'),
    pagination: () => import('@/JITComponents/Pagination'),
    AddOrEdit: () => import('./manage/AddOrEdit')
  },
  mounted () {
    this.OnSearch()
  },
  name: 'Connectmanage',
  data () {
    return {
      data: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 50
      },
      loading: false,
      columns,
      selectedRowKeys: [],
      params: {
        SkipCount: 0,
        MaxResultCount: 10,
        Sorting: ''
      }
    }
  },
  computed: {
  },
  methods: {
    OnAdd () {
      this.$refs.AddOrEdit.show({ id: 0 })
    },
    OnEdit () {
      if (this.selectedRowKeys.length === 0) {
        this.$message.warning('请选择要修改的数据')
      } else {
        this.$refs.AddOrEdit.show({ id: this.selectedRowKeys[0] })
      }
    },
    OnReload () {
      this.selectedRowKeys = []
      this.OnSearch()
    },
    OnDelete () {
      var _this = this
      if (this.selectedRowKeys.length === 0) {
        this.$message.warning('请选择要删除的数据')
      } else if (this.selectedRowKeys.length === 1) {
        _this.loading = true
        _this.$store
          .dispatch('connectDelete', { id: this.selectedRowKeys[0] })
          .then(res => {
            var deleteRestult = this.$store.state.K3ApiUrl.deleteRestult
            if (deleteRestult.success === true) {
              _this.OnReload()
              this.$message.success('删除成功')
            } else {
              this.$message.error('删除失败')
            }
          })
          .finally(f => {
            _this.loading = false
          })
      } else {
        this.$message.warning('请选择1条要删除的数据')
      }
    },
    // 切换分页
    onPaginationChange (page, size) {
      this.pagination.current = page
      this.pagination.pageSize = size
      this.params.SkipCount = this.pagination.current - 1
      this.params.MaxResultCount = this.pagination.pageSize
      this.OnSearch()
    },
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    handleTableChange (pagination, filters, sorter) {
      this.params.Sorting = sorter.field + ' ' + (sorter.order + '').replace('end', '')
      console.log(sorter)
      this.OnSearch()
    },
    OnSearchParams () {
      return this.params
    },
    OnSearch () {
      this.loading = true
      this.$store.dispatch('connectGetAll', this.OnSearchParams()).then(res => {
        var connectList = this.$store.state.K3ApiUrl.connectList
        this.data = connectList.items
        this.pagination.total = connectList.totalCount
      }).finally(f => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
