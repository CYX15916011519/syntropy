<template>
  <a-card :bordered="false">
    <a-row :gutter="8">
      <a-col :span="5">
        <s-tree
          :dataSource="orgTree"
          :openKeys.sync="openKeys"
          :search="true"
          @click="handleClick"
          @add="handleAdd"
          @titleClick="handleTitleClick"
        ></s-tree>
      </a-col>
      <a-col :span="19"> </a-col>
    </a-row>
  </a-card>
</template>

<script>
export default {
  name: '',
  data () {
    return {
      orgTree: [],
      openKeys: ['key-01']
    }
  },
  methods: {
    handleClick () {},
    handleAdd () {},
    handleTitleClick () {}
  }
}
</script>

<style lang="scss" scoped></style>
