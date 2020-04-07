import { Get } from '@/api/K3/Token'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
const Token = {
  state: {
    Detailed: {}
  },
  mutations: {
    SET_DETAILED: (state, Detailed) => {
      state.Detailed = Detailed
    }
  },

  actions: {
    // 获取明细
    async TokenGet ({ commit }) {
      return new Promise(async (resolve, reject) => {
        await Get({ authorityCode: Vue.ls.get(ACCESS_TOKEN + 'authorityCode') })
          .then(async res2 => {
            var res = res2.data
            if (res.StatusCode === 200) {
              console.log(res)
              commit('SET_DETAILED', res)
              var Validity = 7 * 24 * 60 * 60 * 1000
              Vue.ls.set(ACCESS_TOKEN + 'K3', res.Data.Token, (res.Data.Validity - 1000) * 1000)
              Vue.ls.set(ACCESS_TOKEN + 'SetBookID', Vue.ls.get(ACCESS_TOKEN + 'SetBookID'), Validity)
              Vue.ls.set(ACCESS_TOKEN + 'authorityCode', Vue.ls.get(ACCESS_TOKEN + 'authorityCode'), Validity)
              resolve(res)
            } else {
              resolve(res)
            }
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
}

export default Token
