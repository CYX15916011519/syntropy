import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import user from './modules/user'

// default router permission control
import permission from './modules/permission'

// dynamic router permission control (Experimental)
// import permission from './modules/async-router'
import getters from './getters'
// ----------------系统API接口------------------------

import K3ApiUrl from './modules/connect'
import materialTemplate from './modules/materialTemplate'
import MaterialGroup from './K3/MaterialGroup'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    user,
    permission,
    K3ApiUrl,
    materialTemplate,
    MaterialGroup
  },
  state: {
    // K3ApiUrl: K3ApiUrl.state
  },
  mutations: {

  },
  actions: {

  },
  getters
})
