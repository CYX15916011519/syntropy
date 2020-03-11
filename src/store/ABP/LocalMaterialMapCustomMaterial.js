import { Get, GetAll, Save, Delete, GetByFItemID } from '@/api/ABP/LocalMaterialMapCustomMaterial'

const LocalMaterialMapCustomMaterial = {
  state: {
    List: [],
    Detailed: {},
    saveRestult: {},
    deleteRestult: {},
    GetByFItemIDList: []
  },
  mutations: {
    SET_LIST: (state, List) => {
      state.List = List
    },
    SET_DETAILED: (state, Detailed) => {
      state.Detailed = Detailed
    },
    SET_GETBYFITEMIDLIST: (state, GetByFItemIDList) => {
      state.GetByFItemIDList = GetByFItemIDList
    },
    SET_SAVE: (state, saveRestult) => {
      state.saveRestult = saveRestult
    },
    SET_DELETE: (state, deleteRestult) => {
      state.deleteRestult = deleteRestult
    }
  },

  actions: {
    LocalMaterialMapCustomMaterialGetByFItemID ({ commit }, parame) {
      return new Promise((resolve, reject) => {
        GetByFItemID(parame)
          .then(response => {
            commit('SET_GETBYFITEMIDLIST', response)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 获取明细
    LocalMaterialMapCustomMaterialGet ({ commit }, parame) {
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
    LocalMaterialMapCustomMaterialGetAll ({ commit }, parame) {
      return new Promise((resolve, reject) => {
        GetAll(parame)
          .then(response => {
            const result = response.result
            commit('SET_LIST', result)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 保存数据
    LocalMaterialMapCustomMaterialSave ({ commit }, parame) {
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
    LocalMaterialMapCustomMaterialDelete ({ commit }, parame) {
      return new Promise((resolve, reject) => {
        Delete(parame)
          .then(response => {
            const result = response
            commit('SET_DELETE', result)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
}

export default LocalMaterialMapCustomMaterial
