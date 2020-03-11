import { Get, GetAll, Save, Delete } from '@/api/K3/Currency'

const Currency = {
  state: {
    List: [],
    Detailed: {},
    saveRestult: {},
    deleteRestult: {}
  },
  mutations: {
    SET_LIST: (state, List) => {
      state.List = List
    },
    SET_DETAILED: (state, Detailed) => {
      state.Detailed = Detailed
    },
    SET_SAVE: (state, saveRestult) => {
      state.saveRestult = saveRestult
    },
    SET_DELETE: (state, deleteRestult) => {
      state.deleteRestult = deleteRestult
    }
  },

  actions: {
    // 获取明细
    CurrencyGet ({ commit }, parame) {
      return new Promise((resolve, reject) => {
        Get(parame)
          .then(response => {
            commit('SET_DETAILED', response)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 获取列表
    CurrencyGetAll ({ commit }, parame) {
      return new Promise((resolve, reject) => {
        GetAll(parame)
          .then(response => {
            commit('SET_LIST', response)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 保存数据
    CurrencySave ({ commit }, parame) {
      return new Promise((resolve, reject) => {
        Save(parame)
          .then(response => {
            commit('SET_SAVE', response)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 删除数据
    CurrencyDelete ({ commit }, parame) {
      return new Promise((resolve, reject) => {
        Delete(parame)
          .then(response => {
            commit('SET_DELETE', response)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
}

export default Currency
