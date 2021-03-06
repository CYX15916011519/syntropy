import Vue from 'vue'
import { login, getInfo, logout, getCurrentLoginInformations } from '@/api/login'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { welcome } from '@/utils/util'
import store from '@/store'
// import { constantRouterMap } from '@/config/router.config'
const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {},
    K3loginstate: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
    SET_K3LOGINSTATE: (state, K3loginstate) => {
      state.K3loginstate = K3loginstate
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(res => {
          var obj = { IsSuccess: 0, message: '' }
          const result = res.result
          if (result === null) {
            obj.IsSuccess = 1
            obj.message = res.errot.details
            reject(obj)
          } else {
            var Validity = 7 * 24 * 60 * 60 * 1000
            Vue.ls.set(ACCESS_TOKEN, result.accessToken, Validity)
            commit('SET_TOKEN', result.accessToken)
            commit('SET_AVATAR', '/avatar2.jpg')
            Vue.ls.set(ACCESS_TOKEN + 'authorityCode', userInfo.authorityCode, Validity)
            Vue.ls.set(ACCESS_TOKEN + 'SetBookID', userInfo.SetBookID, Validity)
            store
              .dispatch('TokenGet')
              .then(res => {
                if (res.Data === null) {
                  obj.message = res.Message
                  obj.IsSuccess = 2
                  reject(obj)
                } else {
                  resolve(obj)
                }
              })
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    GetCurrentLoginInfo ({ commit }) {
      return new Promise((resolve) => {
        getCurrentLoginInformations().then((res) => {
          const result = res.result.user
          commit('SET_NAME', { name: result.name, welcome: welcome() })
          commit('SET_INFO', result)
          resolve()
        }).catch(() => {
          resolve()
        }).finally(() => {
        })
      })
    },
    // 获取用户信息
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const result = response.result
          // console.log(result)
          if (result.role && result.role.permissions.length > 0) {
            const role = result.role
            role.permissions = result.role.permissions
            role.permissions.map(per => {
              if (per.actionEntitySet != null && per.actionEntitySet.length > 0) {
                const action = per.actionEntitySet.map(action => { return action.action })
                per.actionList = action
              }
            })
            role.permissionList = role.permissions.map(permission => { return permission.permissionId })
            commit('SET_ROLES', result.role)
            commit('SET_INFO', result)
          } else {
            reject(new Error('getInfo: roles must be a non-null array !'))
          }

          commit('SET_NAME', { name: result.name, welcome: welcome() })
          commit('SET_AVATAR', result.avatar)

          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        logout(state.token).then(() => {
          resolve()
        }).catch(() => {
          resolve()
        }).finally(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          Vue.ls.remove(ACCESS_TOKEN)
          Vue.ls.remove(ACCESS_TOKEN + 'K3')
        })
      })
    }

  }
}

export default user
