import { Get, GetAll, Save, Delete } from '@/api/K3/BOM'

const BOM = {
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
    BOMGet ({ commit }, parame) {
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
    BOMGetAll ({ commit }, parame) {
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
    BOMSave ({ commit }, parame) {
      return new Promise(async (resolve, reject) => {
        await Save(parame)
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
    BOMDelete ({ commit }, parame) {
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

export default BOM
