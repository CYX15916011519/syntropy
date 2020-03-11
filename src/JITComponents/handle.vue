<template>
  <div>
    <a-button v-for="item in GethandleList" :key="item.value" @click="OnHandle(item.value)"><a-icon :type="item.icon" />{{ item.title }}</a-button>
  </div>
</template>
<script>
export default {
  props: {
    handle: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      handleList: [
        { title: '刷新', value: 'reload', icon: 'reload', hide: false },
        { title: '查询', value: 'search', icon: 'search', hide: false },
        { title: '全选', value: 'check-square', icon: 'check-square', hide: true },
        { title: '全清', value: 'close-square', icon: 'close-square', hide: true },
        { title: '新增', value: 'add', icon: 'plus', hide: false },
        { title: '修改', value: 'edit', icon: 'edit', hide: false },
        { title: '删除', value: 'delete', icon: 'delete', hide: false },
        { title: '复制', value: 'copy', icon: 'copy', hide: false },
        { title: '详情', value: 'info-circle', icon: 'info-circle', hide: false },
        { title: '启用', value: 'check-circle', icon: 'check-circle', hide: false },
        { title: '禁用', value: 'stop', icon: 'stop', hide: false },
        { title: '导入', value: 'import', icon: 'import', hide: false },
        { title: '导出', value: 'export', icon: 'export', hide: false }
      ]
    }
  },
  methods: {
    // s
    OnHandle (t) {
      this.$emit(t)
    }
  },
  computed: {
    // 获取显示按钮
    GethandleList: function () {
      var _this = this
      var t = []
      this.handleList.forEach(item => {
        if (_this.handle.indexOf(item.value) >= 0) {
          t.push(item)
        }
      })
      return t
    }
  }
}
</script>
<style lang="scss" scoped></style>
