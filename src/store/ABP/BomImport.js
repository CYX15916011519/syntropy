import { Get, GetAll, Save, Delete, Check } from '@/api/ABP/BomImport'

const BomImport = {
  state: {
    List: [],
    Detailed: {},
    saveRestult: {},
    deleteRestult: {},
    checkRestult: {}
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
    },
    SET_CHECK: (state, checkRestult) => {
      state.checkRestult = checkRestult
    }
  },

  actions: {
    BomImportCheck ({ commit }, obj) {
      // console.log(obj)
      return new Promise((resolve, reject) => {
        Check(obj)
          .then(response => {
            commit('SET_CHECK', response)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 获取明细
    BomImportGet ({ commit }, parame) {
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
    BomImportGetAll ({ commit }, parame) {
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
    BomImportSave ({ commit }, parame) {
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
    BomImportDelete ({ commit }, parame) {
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

export default BomImport
