import { Get, GetAll, Save, Delete } from '@/api/K3/Material'

const Material = {
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
    MaterialGet ({ commit }, parame) {
      return new Promise((resolve, reject) => {
        Get(parame)
          .then(response => {
            const result = response.Data
            commit('SET_DETAILED', result)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 获取列表
    MaterialGetAll ({ commit }, parame) {
      return new Promise((resolve, reject) => {
        GetAll(parame)
          .then(response => {
            // console.log(response)
            const result = response.Data
            commit('SET_LIST', result)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 保存数据
    MaterialSave ({ commit }, parame) {
      return new Promise((resolve, reject) => {
        Save(parame)
          .then(response => {
            const result = response.Data
            commit('SET_SAVE', result)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 删除数据
    MaterialDelete ({ commit }, parame) {
      return new Promise((resolve, reject) => {
        Delete(parame)
          .then(response => {
            const result = response.Data
            commit('SET_DELETE', result)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
}

export default Material
