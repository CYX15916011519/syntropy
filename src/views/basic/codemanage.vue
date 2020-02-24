<template>
  <a-card :bordered="false">
    <a-row :gutter="8">
      <a-col :span="5"></a-col>
      <a-col :span="19">
      </a-col>
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
