<template>
  <div class="jtPagination">
    <!-- showSizeChanger  @showSizeChange="onChange" -->
    <a-pagination
      v-model="currentPage"
      showQuickJumper
      size="small"
      :defaultPageSize="defaultPageSize"
      :pageSizeOptions="pageSizeOptions"
      showSizeChanger
      @showSizeChange="onChange"
      @change="onChange"
      :showTotal="total => `总共 ${total} 条数据` + (selRow > 0 ? '，选中 ' + selRow + ' 数据' : '')"
      :total="total"
    ></a-pagination>
  </div>
</template>

<script>
export default {
  data () {
    return {
      currentPage: this.current
    }
  },
  props: {
    selRow: {
      type: Number,
      default: 0
    },
    current: {
      type: Number,
      default: 1
    },
    total: {
      type: Number,
      default: 0
    },
    defaultPageSize: {
      type: Number,
      default: 10
    },
    pageSizeOptions: {
      type: Array,
      default: () => ['2', '10', '15', '20', '30', '50', '80', '100']
    },
    value: {
      type: Object,
      default: () => {
        return { current: 1, pageSize: 20 }
      }
    }
  },
  methods: {
    onChange (page, pageSize) {
      this.$emit('pageChange', page, pageSize)
      this.$emit('input', { current: page, pageSize: pageSize })
    }
  }
}
</script>

<style scoped>
.jtPagination {
  background: #91d5ff;
  /* border-radius: 5px; */
  margin-bottom: 5px;
  padding: 5px 8px;
  border: 1px solid rgb(24, 144, 255);
  color: #999;
}
</style>
