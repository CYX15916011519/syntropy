import { GetNumber } from '@/api/ABP/JITCommon'

const JITCommon = {
  state: {
    GetNumber: {}
  },
  mutations: {
    SET_GETNUMBER: (state, GetNumber) => {
      state.GetNumber = GetNumber
    }
  },

  actions: {
    // 获取明细
    JITCommonGetNumber ({ commit }, parame) {
      return new Promise((resolve, reject) => {
        GetNumber(parame)
          .then(response => {
            commit('SET_GETNUMBER', response)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
}

export default JITCommon
