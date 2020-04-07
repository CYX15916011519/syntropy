import { Get, GetAll, Save, Save2, Delete, GetByFItemID } from '@/api/K3/Bill1000200'

const Bill1000200 = {
  state: {
    List: [],
    Detailed: {},
    saveRestult: {},
    deleteRestult: {},
    GetByFItemIDRestult: {}
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
    SET_GETBYFITEMID: (state, GetByFItemIDRestult) => {
      state.GetByFItemIDRestult = GetByFItemIDRestult
    }
  },

  actions: {
    // 获取明细
    Bill1000200GetByFItemID ({ commit }, parame) {
      return new Promise((resolve, reject) => {
        GetByFItemID(parame)
          .then(response => {
            commit('SET_GETBYFITEMID', response)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 获取明细
    Bill1000200Get ({ commit }, parame) {
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
    Bill1000200GetAll ({ commit }, parame) {
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
    Bill1000200Save ({ commit }, parame) {
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
    // 保存数据
    Bill1000200Save2 ({ commit }, parame) {
      return new Promise((resolve, reject) => {
        Save2(parame)
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
    Bill1000200Delete ({ commit }, parame) {
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

export default Bill1000200
