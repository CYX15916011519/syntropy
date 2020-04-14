import { GetNumber,GetNumberList } from '@/api/ABP/JITCommon'

const JITCommon = {
  state: {
    GetNumber: {},
    GetNumberList: {}
  },
  mutations: {
    SET_GETNUMBER: (state, GetNumber) => {
      state.GetNumber = GetNumber
    },
    SET_GETNUMBERLISR: (state, GetNumberList) => {
      state.GetNumberList = GetNumberList
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
    },
    JITCommonGetNumberList ({ commit }, parame) {
      return new Promise((resolve, reject) => {
        GetNumberList(parame)
          .then(response => {
            commit('SET_GETNUMBERLISR', response)
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
