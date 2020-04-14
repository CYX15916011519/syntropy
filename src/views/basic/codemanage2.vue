<template>
  <a-card :bordered="false">
    <a-row :gutter="8">
      <a-col :span="6">
        <a-input-search style="margin-bottom: 8px" placeholder="Search" @change="onChange" v-if="false" />
        <a-tree :treeData="GettreeData" @select="onSelect"></a-tree>
      </a-col>
      <a-col :span="18">
        <div class="table-operations">
          <Handle
            :handle="'reload,add,delete,edit,import'"
            @add="OnAdd"
            @edit="OnEdit"
            @reload="OnReload"
            @delete="OnDelete"
            @import="OnImport"
          />
          <!-- <Handle
            :handle="'reload,import'"
            @reload="OnReload"
            @import="OnImport"
          /> -->
        </div>
        <!-- 分页 -->
        <pagination
          :current="pagination.current"
          :total="pagination.total"
          @pageChange="onPaginationChange"
          :selRow="selectedRowKeys.length"
          hidden
        />
        <a-table
          :size="'small'"
          :rowSelection="{ selectedRowKeys: selectedRowKeys, selectedRows: selectedRows, onChange: onSelectChange }"
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
    <Import ref="Import" @Success="OnReload" />
  </a-card>
</template>

<script>
const columns = [
  // {
  //   title: 'Id',
  //   dataIndex: 'FID',
  //   width: '5%'
  // },
  {
    title: 'K3物料编码',
    dataIndex: 'FMeterialCode_FNDName',
    sorter: true,
    width: '20%'
  },
  {
    title: 'K3物料名称',
    dataIndex: 'FInvMeterName',
    sorter: true,
    width: '20%'
  },
  {
    title: '客供物料编码',
    dataIndex: 'FMeterName',
    sorter: true,
    width: '30%'
  },
  {
    title: '客供物料名称',
    dataIndex: 'FTaxCode',
    sorter: true,
    width: '30%'
  }
]
export default {
  components: {
    Handle: () => import('@/JITComponents/handle'),
    pagination: () => import('@/JITComponents/Pagination'),
    STree: () => import('@/components/Tree/Tree'),
    AddOrEdit: () => import('./codemanage2/AddOrEdit'),
    Import: () => import('./codemanage2/Import')
  },
  mounted() {
    this.OnSearch()
  },
  name: 'Codemanage2',
  computed: {
    GettreeData() {
      return this.treeData
    }
  },
  data() {
    return {
      currentComponet: '',
      showModel: false,
      selectedKeys: [],
      selectedRows: [],
      TreeselectedRows: [],
      treeData: [{ title: '客户', key: '', children: [] }],
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
      newlist: []
    }
  },
  methods: {
    // 导入
    OnImport() {
      this.$refs.Import.showModal()
    },
    // s
    OnHandle(value) {
      value()
    },
    // 刷新
    OnReload() {
      this.selectedRowKeys = []
      this.OnTableSearch()
    },
    // 新增
    OnAdd() {
      if (this.selectedKeys.length === 0) {
        this.$message.warning('请选择客户')
      } else {
        this.$refs.AddOrEdit.show({ FCustomer: this.TreeselectedRows.FNumber })
      }
    },
    OnEdit() {
      if (this.selectedRowKeys.length === 0) {
        this.$message.warning('请选择要修改的数据')
      } else {
        this.$refs.AddOrEdit.show({
          FBillNo: this.selectedRows[0].FBillNo,
          list: [{ FNumber: this.selectedRows[0].FCustomer, FName: this.selectedRows[0].FMeterialCode_DSPName }]
        })
      }
    },
    OnDelete() {
      var _this = this
      if (this.selectedRowKeys.length === 0) {
        this.$message.warning('请选择要删除的数据')
      } else if (this.selectedRowKeys.length === 1) {
        var obj = {
          Data: {
            FBillNo: this.selectedRows[0].FBillNo
          }
        }
        _this.loading = true
        _this.$store
          .dispatch('Bill1000200Delete', obj)
          .then(res => {
            var Restult = this.$store.state.Bill1000200.deleteRestult
            if (Restult.StatusCode === 200) {
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
    Close() {
      this.currentComponet = ''
      this.showModel = false
    },
    // s
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
      this.selectedRows = []
      this.TreeselectedRows = info.node.dataRef
      this.OnTableSearch()
    },
    // 切换分页
    onPaginationChange(page, size) {
      this.pagination.current = page
      this.pagination.pageSize = size
      this.params.SkipCount = this.pagination.current - 1
      this.params.MaxResultCount = this.pagination.pageSize
      this.OnSearch()
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRows = selectedRows
      this.selectedRowKeys = selectedRowKeys
    },
    handleTableChange(pagination, filters, sorter) {
      this.params.Sorting = sorter.field + ' ' + (sorter.order + '').replace('end', '')
      // console.log(sorter)
      this.OnSearch()
    },
    OnSearchParams() {
      if (this.selectedKeys.length === 0) {
        this.$message.warning('请选择客户')
        return {}
      } else {
        return {
          CustomID: this.selectedKeys[0]
        }
      }
    },
    OnSearch(type) {
      this.GetCustomList()
    },
    OnTableSearch() {
      var params = {
        Data: {
          Top: '100',
          PageSize: '100000',
          PageIndex: '1',
          Filter: "[FCustomer] = '" + this.OnSearchParams().CustomID + "' ",
          OrderBy: '[FCustomer] asc',
          SelectPage: '1',
          Fields: 'FMeterName,FMeterialCode,FInvMeterName,FTaxCode'
        }
      }
      var _this = this
      _this.loading = true
      _this.$store
        .dispatch('Bill1000200GetAll', params)
        .then(res => {
          // res.Data.DATA.forEach(f => {
          //   var list = _this.newlist.filter(a => { return a.FItemID * 1 === f.FMeterialCode * 1 })
          //   // console.log(f.FMeterialCode)
          //   if (list.length > 0) {
          //     // console.log(list)
          //     f.FMeterialId = list[0].FNumber
          //   }
          // })
          this.data = res.Data.DATA
          this.pagination.total = res.Data.DATA.length
        })
        .finally(f => {
          _this.loading = false
        })
    },
    GetCustomList() {
      var _this = this
      _this.$store.dispatch('CustomerGetAll', {}).then(() => {
        // console.log(this.$store.state.Customer.List)
        var result = this.$store.state.Customer.List
        if (result.StatusCode === 200) {
          result.Data.Data.forEach(item => {
            item.title = item.FNumber + ' ' + item.FName
            item.key = item.FItemID
          })
          _this.treeData = result.Data.Data
        } else {
          _this.$notification['error']({
            message: result.error.message,
            description: result.error.details
          })
        }
      })
    },
    onChange(e) {
      const value = e.target.value
    }
  }
}
</script>

<style lang="scss" scoped></style>
