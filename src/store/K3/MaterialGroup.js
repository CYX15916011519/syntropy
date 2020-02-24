import { Get, GetAll, Save, Delete } from '@/api/K3/MaterialGroup'

const MaterialGroup = {
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
    MaterialGroupGet ({ commit }, parame) {
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
    MaterialGroupGetAll ({ commit }, parame) {
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
    MaterialGroupSave ({ commit }, parame) {
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
    MaterialGroupDelete ({ commit }, parame) {
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

export default MaterialGroup
