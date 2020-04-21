<template>
  <a-card :bordered="false" style="margin: -24px -24px 0px;">
    <result type="success" :description="description" :title="title">
      <template slot="action">
        <div style="margin-bottom: 16px">
          <span v-if="selBomNo.length>0">BOM单号: </span> <a-tag color="blue"  v-for="(tmp,index) in selBomNo" :key="index">{{tmp}}</a-tag>
        </div>
        <a-button type="primary" @click="finish">再次导入</a-button>
      </template>
    </result>
  </a-card>
</template>

<script>
import { Result } from '@/components'
import { mixinDevice } from '@/utils/mixin.js'

const directionType = {
  horizontal: 'horizontal',
  vertical: 'vertical'
}

export default {
  props: {
    selBomNo: {
      type: Array
    }
  },
  name: 'ImportResult',
  components: {
    Result
  },
  mixins: [mixinDevice],
  data () {
    return {
      title: '导入成功',
      description: '',
      directionType
    }
  },
  methods: {
      // 上一步
    finish () {
      this.$emit('finish')
    }
  }
}
</script>

<style scoped>

</style>
