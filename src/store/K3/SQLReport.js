import { GetSQLReport75, GetSQLReport76, GetSQLReport } from '@/api/K3/SQLReport'

const SQLReport = {
  state: {
    List: {}
  },
  mutations: {
    SET_LIST: (state, List) => {
      state.List = List
    }
  },

  actions: {
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
