<template>
  <div>
    <a-card :bordered="false">
      <a-steps :current="currentTab">
        <a-step title="选择导入" description="导入BOM模板" />
        <a-step title="检验情况" description="检验数据是否通过" />
        <a-step title="导入情况" description="" />
      </a-steps>
      <div class="content">
        <step1 v-if="currentTab === 0" @nextStep="nextStep" />
        <step2 v-if="currentTab === 1" @nextStep="nextStep" @prevStep="prevStep" />
        <step3 v-if="currentTab === 2" @prevStep="prevStep" @finish="finish" />
      </div>
    </a-card>
  </div>
</template>

<script>
export default {
  name: 'BOMImport',
  components: {
    Step1: () => import('./BOMImport/Import'),
    Step2: () => import('./BOMImport/Import'),
    Step3: () => import('./BOMImport/Import')
  },
  data () {
    return {
      description: '',
      currentTab: 0,
      loading: false,
      // form
      form: null
    }
  },
  methods: {
    nextStep () {
      if (this.currentTab < 2) {
        this.currentTab += 1
      }
    },
    prevStep () {},
    finish () {}
  }
}
</script>

<style lang="scss" scoped></style>
