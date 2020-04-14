<template>
  <a-card :bordered="false">
    <a-row :gutter="8">
      <a-col :span="6">
        <a-input-search style="margin-bottom: 8px" placeholder="Search" @change="onChange" v-if="false" />
        <a-tree :defaultExpandAll="defaultExpandAll" :treeData="GettreeData" @select="onSelect"></a-tree>
      </a-col>
      <a-col :span="18">
        <div class="table-operations">
          <Handle :handle="'reload,add,delete,edit'" @add="OnAdd" @edit="OnEdit" @reload="OnReload" @delete="OnDelete" />
        </div>
        <!-- 分页 -->
        <pagination :current="pagination.current" :total="pagination.total" @pageChange="onPaginationChange" :selRow="selectedRowKeys.length" hidden />
        <a-table
          rowKey="wl"
          :size="'small'"
          :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
          :columns="columns"
          :dataSource="data"
          :pagination="false"
          :loading="loading"
          showSizeChanger
          showQuickJumper
          @change="handleTableChange"
        >
          <span slot="enable" slot-scope="enable">
            <div v-if="enable">
              <a-tag color="#87d068">启用</a-tag>
            </div>
            <div v-else>
              <a-tag color="#f50">不启用</a-tag>
            </div>
          </span>
        </a-table>
      </a-col>
    </a-row>
    <!-- <component :is="currentComponet" :isHide="showModel" @Success="OnReload"></component> -->
    <AddOrEdit v-if="HideIF" ref="AddOrEdit" @Success="OnReload" />
  </a-card>
</template>

<script>
import { ACCESS_TOKEN } from '@/store/mutation-types'
import Vue from 'vue'
const columns = [
  {
    title: 'Id',
    dataIndex: 'id',
    width: '5%'
  },
  {
    title: '物料内码',
    dataIndex: 'fItemID',
    sorter: true,
    width: '20%'
  },
  {
    title: '物料编码',
    dataIndex: 'fNumber',
    sorter: true,
    width: '30%'
  },
  {
    title: '模板名称',
    dataIndex: 'name',
    sorter: true,
    width: '30%'
  },
  {
    title: '是否启用',
    dataIndex: 'enable',
    width: '10%',
    scopedSlots: { customRender: 'enable' }
  }
  // {
  //   title: '模板Json',
  //   dataIndex: 'template',
  //   width: '20%'
  // },
  // {
  //   title: '操作',
  //   dataIndex: 'operation',
  //   width: '10%'
  // }
]
export default {
  components: {
    Handle: () => import('@/JITComponents/handle'),
    pagination: () => import('@/JITComponents/Pagination'),
    Edit: () => import('@/views/basic/materialsetup/Edit.vue'),
    STree: () => import('@/components/Tree/Tree'),
    AddOrEdit: () => import('./materialsetup/AddOrEdit')
  },
  mounted () {
    this.OnSearch()
  },
  name: 'Materialsetup',
  computed: {
    GettreeData () {
      return this.treeData
    }
  },
  data () {
    return {
      defaultExpandAll: true,
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
          PageSize: 100,
          PageIndex: 1,
          Filter: "FNumber like '%%'",
          OrderBy: 'FNumber asc',
          Fields: 'FNumber,FName'
        }
      },
      newlist: [],
      selectinfo: {},
      HideIF: true,
      SelectText: ''
    }
  },
  methods: {
    // s
    OnHandle (value) {
      value()
    },
    // 刷新
    OnReload () {
      this.HideIF = false
      this.selectedRowKeys = []
      this.OnTableSearch()
      this.HideIF = true
    },
    // 新增
    OnAdd () {
      if (this.selectedKeys.length === 0) {
        this.$message.warning('请选择物料')
      } else {
        this.$refs.AddOrEdit.show({ id: 0, fItemID: this.selectedKeys[0], setBookID: Vue.ls.get(ACCESS_TOKEN + 'SetBookID'), FNumber: this.selectinfo.node.value })
      }
      // this.currentComponet = 'Edit'
      // this.showModel = true
    },
    OnEdit () {
      if (this.selectedRowKeys.length === 0) {
        this.$message.warning('请选择要修改的数据')
      } else {
        this.$refs.AddOrEdit.show({ id: this.data[this.selectedRowKeys[0]].id })
      }
    },
    OnDelete () {
      var _this = this
      console.log(this.selectedRowKeys)
      if (this.selectedRowKeys.length === 0) {
        this.$message.warning('请选择要删除的数据')
      } else if (this.selectedRowKeys.length === 1) {
        _this.loading = true
        _this.$store
          .dispatch('materialTemplateDelete', { id: this.data[this.selectedRowKeys[0]].id })
          .then(res => {
            var Restult = this.$store.state.materialTemplate.deleteRestult
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
      } else {
        this.$message.warning('请选择1条要删除的数据')
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
      this.selectinfo = info
      this.selectedRowKeys = []
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
          FItemID: this.selectedKeys[0],
          SetBookID: Vue.ls.get(ACCESS_TOKEN + 'SetBookID')
        }
      }
    },
    OnSearch () {
      var _this = this
      _this.loading = true
      _this.$store
        .dispatch('MaterialGroupGetAll', _this.MaterialGroupGetAllParams)
        .then(res => {
          var list = this.$store.state.MaterialGroup.List.Data
          if (list === undefined) {
            list = []
            return
          }
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
          
        })
        .finally(f => {
          _this.loading = false
          if (_this.$store.state.MaterialGroup.List.RowCount > _this.newlist.length) {
            _this.MaterialGroupGetAllParams.Data.PageIndex = _this.MaterialGroupGetAllParams.Data.PageIndex * 1 + 1
            _this.OnSearch()
          } else {
            // _this.treeData = [{ title: '物料', key: 0, value: '', ParentID: '', children: _this.GetTreeList('') }]
            _this.treeData = _this.GetTreeList('')
          }
        })
    },
    OnTableSearch () {
      var _this = this
      _this.loading = true
      _this.$store
        .dispatch('materialTemplateGetByFItemID', this.OnSearchParams())
        .then(res => {
          this.data = this.$store.state.materialTemplate.GetByFItemIDList.result
          this.pagination.total = this.$store.state.materialTemplate.GetByFItemIDList.length
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
    onChange (e) {
      this.SelectText = e.target.value
    }
  }
}
</script>

<style lang="scss" scoped></style>
