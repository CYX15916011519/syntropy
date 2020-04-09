<template>
  <div>
    <a-card :bordered="false">
      <a-steps :current="currentTab">
        <a-step title="选择导入" description="导入BOM模板" />
        <a-step title="物料检验情况" description="检验数据是否通过" />
        <a-step title="BOM检验情况" description="检验数据是否通过" />
        <a-step title="导入情况" description="" />
      </a-steps>
      <div class="content">
        <step1 v-if="currentTab === 0" @nextStep="nextStep" @IsSuccess="setTableVal" @SetCustID="SetCustID"/>
        <step2 v-if="currentTab === 1" @nextStep="nextStep" @prevStep="prevStep" :listObj="TableVal" :custID="CustID" />
        <step3 v-if="currentTab === 2" @nextStep="nextStep" @prevStep="prevStep" :listObj="TableVal" :custID="CustID"/>
        <step4 v-if="currentTab === 3" @prevStep="prevStep" @finish="finish" />
      </div>
    </a-card>
  </div>
</template>

<script>
export default {
  name: 'BOMImport',
  components: {
    Step1: () => import('./BOMImport/Import'),
    // Step2: () => import('./BOMImport/TestInfo'),
    Step2: () => import('./BOMImport/MaterialCheck'),
    Step3: () => import('./BOMImport/BOMImportCheck'),
    Step4: () => import('./BOMImport/ImportResult'),
  },
  data () {
    return {
      description: '',
      currentTab: 0,
      loading: false,
      // form
      form: null,
      TableVal: {},
      CustID: 0
    }
  },
  methods: {
    // handler
    nextStep () {
      if (this.currentTab < 3) {
        this.currentTab += 1
      }
    },
    prevStep () {
      if (this.currentTab > 0) {
        this.currentTab -= 1
      }
    },
    finish () {
      this.currentTab = 0
    },
    setTableVal (val) {
      this.TableVal = val
    },
    SetCustID (val) {
      this.CustID = val
    }
  }
}
</script>

<style lang="scss" scoped></style>
