import { GetSQLReport75, GetSQLReport76, GetSQLReport } from '@/api/K3/SQLReport'

const SQLReport = {
  state: {
    List75: {},
    List76: {},
    List: {}
  },
  mutations: {
    SET_LIST75: (state, List) => {
      state.List75 = List
    },
    SET_LIST76: (state, List) => {
      state.List76 = List
    },
    SET_LIST: (state, List) => {
      state.List = List
    }
  },

  actions: {
    // 获取列表
    SQLReport75GetAll ({ commit }, parame) {
      return new Promise((resolve, reject) => {
        GetSQLReport75(parame)
          .then(response => {
            commit('SET_LIST75', response)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    SQLReport76GetAll ({ commit }, parame) {
      return new Promise((resolve, reject) => {
        GetSQLReport76(parame)
          .then(response => {
            commit('SET_LIST76', response)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    SQLReportGetAll ({ commit }, parame) {
      return new Promise(async (resolve, reject) => {
        await GetSQLReport(parame)
          .then(response => {
            commit('SET_LIST', response)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
}

export default SQLReport
