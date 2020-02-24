import { Get, GetAll, Save, Delete, GetByFItemID } from '@/api/materialTemplate'

const materialTemplate = {
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
    materialTemplateGetByFItemID ({ commit }, parame) {
      return new Promise((resolve, reject) => {
        GetByFItemID(parame)
          .then(response => {
            const result = response.result
            commit('SET_GETBYFITEMIDLIST', result.result)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 获取明细
    materialTemplateGet ({ commit }, parame) {
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
    materialTemplateGetAll ({ commit }, parame) {
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
    materialTemplateSave ({ commit }, parame) {
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
    materialTemplateDelete ({ commit }, parame) {
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

export default materialTemplate
