<template>
  <a-card :bordered="false">
    <a-row :gutter="8">
      <a-col :span="5"> </a-col>
      <a-col :span="19">
        <div class="table-operations">
          <a-button @click="OnSearch"><a-icon type="reload" />刷新</a-button>
          <a-button><a-icon type="search" />查询</a-button>
          <!-- <a-button><a-icon type="check-square" />全选</a-button>
          <a-button><a-icon type="close-square" />全清</a-button> -->
          <a-button><a-icon type="plus" />新增</a-button>
          <a-button><a-icon type="edit" />修改</a-button>
          <a-button><a-icon type="delete" />删除</a-button>
          <a-button><a-icon type="copy" />复制</a-button>
          <a-button><a-icon type="info-circle" />详情</a-button>
          <a-button><a-icon type="check-circle" />启用</a-button>
          <a-button><a-icon type="stop" />禁用</a-button>
          <a-button><a-icon type="import" />导入</a-button>
          <a-button><a-icon type="export" />导出</a-button>
          <span style="margin-left: 8px">
            <template v-if="hasSelected">
              {{ `选中 ${selectedRowKeys.length} 个` }}
            </template>
          </span>
        </div>
        <a-table
          :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
          :columns="columns"
          :rowKey="record => record.id"
          :dataSource="data"
          :pagination="false"
          :loading="loading"
          showSizeChanger
          showQuickJumper
          @change="handleTableChange"
        >
          <span slot="enable" slot-scope="enable">
            <a-tag>{{ enable }}</a-tag>
          </span>
        </a-table>
      </a-col>
    </a-row>
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
    title: '物料内码',
    dataIndex: 'name',
    sorter: true,
    width: '20%'
  },
  {
    title: '物料编码',
    dataIndex: 'name',
    sorter: true,
    width: '20%'
  },
  {
    title: '模板名称',
    dataIndex: 'name',
    sorter: true,
    width: '20%'
  },
  {
    title: '是否启用',
    dataIndex: 'enable',
    width: '10%',
    scopedSlots: { customRender: 'enable' }
  },
  {
    title: '模板Json',
    dataIndex: 'template',
    width: '20%'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: '10%'
  }
]
export default {
  mounted () {
    this.OnSearch()
  },
  name: '',
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
    hasSelected () {
      return this.selectedRowKeys.length > 0
    }
  },
  methods: {
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
      this.$store.dispatch('materialTemplateGetAll', this.OnSearchParams()).then(res => {
        this.data = this.$store.state.materialTemplate.List.items
        this.pagination.total = this.$store.state.materialTemplate.List.totalCount
      }).finally(f => {
        this.loading = false
      })

      this.loading = true
      this.$store.dispatch('MaterialGroupGetAll', this.OnSearchParams()).then(res => {
        this.data = this.$store.state.materialTemplate.List.items
        this.pagination.total = this.$store.state.materialTemplate.List.totalCount
      }).finally(f => {
        this.loading = false
      })
    },
    handleClick () {},
    handleAdd () {},
    handleTitleClick () {}
  }
}
</script>

<style lang="scss" scoped></style>
