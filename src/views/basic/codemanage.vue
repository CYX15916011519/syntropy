<template>
  <a-card :bordered="false">
    <a-row :gutter="8">
      <a-col :span="6">
        <a-input-search style="margin-bottom: 8px" placeholder="Search" @change="onChange" />
        <a-tree :treeData="treeData" @select="onSelect"></a-tree>
      </a-col>
      <a-col :span="18">
        <div class="table-operations">
          <Handle :handle="'reload,add,delete,edit'" @add="OnAdd" @edit="OnEdit" @reload="OnReload" @delete="OnDelete" />
        </div>
        <!-- 分页 -->
        <pagination :current="pagination.current" :total="pagination.total" @pageChange="onPaginationChange" :selRow="selectedRowKeys.length" hidden />
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
    <component :is="currentComponet" :isHide="showModel" @Close="Close"></component>
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
    title: '客户ID',
    dataIndex: 'customID',
    sorter: true,
    width: '20%'
  },
  {
    title: '客户物料编码',
    dataIndex: 'customFNumber',
    sorter: true,
    width: '45%'
  },
  {
    title: '本地物料编码',
    dataIndex: 'localFNumber',
    sorter: true,
    width: '20%'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: '10%'
  }
]
export default {
  components: {
    Handle: () => import('@/JITComponents/handle'),
    pagination: () => import('@/JITComponents/Pagination'),
    STree: () => import('@/components/Tree/Tree'),
    AddOrEdit: () => import('./codemanage/AddOrEdit')
  },
  mounted () {
    this.OnSearch()
  },
  name: 'Materialsetup',
  data () {
    return {
      currentComponet: '',
      showModel: false,
      selectedKeys: [],
      treeData: [{ title: '物料', key: '', children: [] }],
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
      },
      MaterialGroupGetAllParams: {
        Data: {
          FUNDetail: 1,
          Top: '0',
          PageSize: '10000',
          PageIndex: '1',
          Filter: "FNumber like '%%'",
          OrderBy: 'FNumber asc',
          Fields: 'FNumber,FName'
        }
      },
      MaterialGroupGetAllParams2: {
        Data: {
          FUNDetail: 0,
          Top: '0',
          PageSize: '10000',
          PageIndex: '1',
          Filter: "FNumber like '%%'",
          OrderBy: 'FNumber asc',
          Fields: 'FNumber,FName'
        }
      },
      newlist: []
    }
  },
  methods: {
    // s
    OnHandle (value) {
      value()
    },
    // 刷新
    OnReload () {
      this.selectedRowKeys = []
      this.OnTableSearch()
    },
    // 新增
    OnAdd () {
      this.$refs.AddOrEdit.show({ id: 0, fItemID: this.selectedKeys[0] })
      // this.showModel = true
    },
    OnEdit () {
      if (this.selectedRowKeys.length === 0) {
        this.$message.warning('请选择要修改的数据')
      } else {
        this.$refs.AddOrEdit.show({ id: this.selectedRowKeys[0] })
      }
    },
    OnDelete () {
      var _this = this
      console.log(this.selectedRowKeys)
      if (this.selectedRowKeys.length === 0) {
        this.$message.warning('请选择要删除的数据')
      } else {
        _this.loading = true
        _this.$store
          .dispatch('LocalMaterialMapCustomMaterialDelete', { id: this.selectedRowKeys[0] })
          .then(res => {
            var Restult = this.$store.state.LocalMaterialMapCustomMaterial.deleteRestult
            if (Restult.success) {
              this.$message.success('删除成功')
              this.OnReload()
            } else {
              this.$message.error('删除失败')
            }
          })
          .finally(f => {
            _this.loading = false
          })
      }
    },
    Close () {
      this.currentComponet = ''
      this.showModel = false
    },
    // s
    onExpand (expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onCheck (checkedKeys) {
      // console.log('onCheck', checkedKeys)
      this.checkedKeys = checkedKeys
    },
    onSelect (selectedKeys, info) {
      this.selectedKeys = selectedKeys
      this.OnTableSearch()
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
      // console.log(sorter)
      this.OnSearch()
    },
    OnSearchParams () {
      if (this.selectedKeys.length === 0) {
        this.$message.warning('请选择物料')
        return {}
      } else {
        return {
          FNumber: this.selectedKeys[0]
        }
      }
    },
    OnSearch (type) {
      console.log(type)
      var _this = this
      _this.loading = true
      var obj = _this.MaterialGroupGetAllParams
      if (type !== undefined) {
        obj = _this.MaterialGroupGetAllParams2
      }
      _this.$store
        .dispatch('MaterialGroupGetAll', obj)
        .then(res => {
          var list = this.$store.state.MaterialGroup.List.Data
          list.forEach(item => {
            var listd = (item.FNumber + '').lastIndexOf('.')
            var ParentID = (item.FNumber + '').substring(0, listd)
            _this.newlist.push({
              title: item.FNumber.replace(ParentID + '.', '') + '(' + item.FName + ')',
              key: item.FItemID,
              value: item.FNumber,
              ParentID: ParentID
            })
          })
          if (type !== undefined) {
            _this.treeData = _this.GetTreeList('')
          } else {
            _this.OnSearch(2)
          }
          // _this.treeData = [{ title: '物料', key: 0, value: '', ParentID: '', children: _this.GetTreeList('') }]
        })
        .finally(f => {
          _this.loading = false
        })
    },
    OnTableSearch () {
      var _this = this
      _this.loading = true
      _this.$store
        .dispatch('LocalMaterialMapCustomMaterialGetByFItemID', this.OnSearchParams())
        .then(res => {
          this.data = this.$store.state.LocalMaterialMapCustomMaterial.GetByFItemIDList.result
          this.pagination.total = this.$store.state.LocalMaterialMapCustomMaterial.GetByFItemIDList.length
        })
        .finally(f => {
          _this.loading = false
        })
    },
    GetTreeList (ParentID) {
      var _this = this
      var list = _this.GetChildMenuList(ParentID)
      list.forEach(item => {
        if (_this.GetTreeList(item.value).length > 0) {
          item.children = _this.GetTreeList(item.value)
        }
      })
      return list
    },
    GetChildMenuList (ParentID) {
      return this.newlist.filter(f => {
        return f.ParentID === ParentID
      })
    },
    onChange () {
      console.log(1)
    }
  }
}
</script>

<style lang="scss" scoped></style>
