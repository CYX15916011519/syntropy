<template>
  <a-locale-provider :locale="locale">
    <div id="app">
      <router-view />
    </div>
  </a-locale-provider>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import { AppDeviceEnquire } from '@/utils/mixin'

export default {
  mixins: [AppDeviceEnquire],
  data () {
    return {
      locale: zhCN
      // timer: '',
      // value: 0
    }
  },
  methods: {
    // get () {
    //   this.value++
    //   this.$store
    //     .dispatch('TokenGet')
    //     .then(res => {
    //       console.log(1)
    //     })
    // }
  },
  mounted () {
    // this.timer = setInterval(this.get, 10000)
  },
  beforeDestroy () {
    // clearInterval(this.timer)
  }
}
</script>
<style>
#app {
  height: 100%;
}
</style>
