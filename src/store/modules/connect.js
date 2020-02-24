import { Get, GetAll, Save, Delete } from '@/api/K3ApiUrl'

const K3ApiUrl = {
  state: {
    connectList: [],
    connectDetailed: {},
    saveRestult: {},
    deleteRestult: {}
  },
  mutations: {
    SET_LIST: (state, connectList) => {
      state.connectList = connectList
    },
    SET_DETAILED: (state, connectDetailed) => {
      state.connectDetailed = connectDetailed
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
    connectGet ({ commit }, parame) {
      return new Promise((resolve, reject) => {
        Get(parame)
          .then(response => {
            const result = response.result
            commit('SET_DETAILED', result.result)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 获取列表
    connectGetAll ({ commit }, parame) {
      return new Promise((resolve, reject) => {
        GetAll(parame)
          .then(response => {
            const result = response.result
            commit('SET_LIST', result)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 保存数据
    connectSave ({ commit }, parame) {
      return new Promise((resolve, reject) => {
        Save(parame)
          .then(response => {
            const result = response.result
            commit('SET_SAVE', result.result)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 删除数据
    connectDelete ({ commit }, parame) {
      return new Promise((resolve, reject) => {
        Delete(parame)
          .then(response => {
            const result = response.result
            commit('SET_DELETE', result.result)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
}

export default K3ApiUrl
