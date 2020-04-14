import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import notification from 'ant-design-vue/es/notification'
import { VueAxios } from './axios'
import { ACCESS_TOKEN } from '@/store/mutation-types'

var baseURL = ''
var url = window.location.href
// console.log(url)
if (url.indexOf('localhost') >= 0) {
  baseURL = 'http://139.9.6.165:800'
}
else if (url.indexOf('http://192.168') >= 0) {
  baseURL = 'http://192.168.10.2:80'
}
else {
  // 正式环境
  baseURL = 'http://139.9.6.165:800'
}
// baseURL = 'http://192.168.10.2:800'
// 创建 axios 实例
const service = axios.create({
  // baseURL: process.env.VUE_APP_API_BASE_URL, // api base_url
  baseURL: baseURL,
  timeout: 6000,
  headers: {
    'Content-Type': 'application/json;'
  }
})

const err = (error) => {
  if (error.response) {
    const data = error.response.data
    const token = Vue.ls.get(ACCESS_TOKEN + 'K3')
    if (error.response.status === 403) {
      notification.error({
        message: 'Forbidden',
        description: data.message
      })
    }
    if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      notification.error({
        message: 'Unauthorized',
        description: 'Authorization verification failed'
      })
      if (token) {
        store.dispatch('Logout').then(() => {
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        })
      }
    }
  }
  return Promise.reject(error)
}

var isLogin = true
service.interceptors.request.use(async config => {
  var token = Vue.ls.get(ACCESS_TOKEN + 'K3') 
  if (!token && isLogin) {
    isLogin = false
    await store.dispatch('TokenGet').then(async (res) => {
      isLogin = true
      token = Vue.ls.get(ACCESS_TOKEN + 'K3')
    })
  }
  if (token) {
    config.params = {
      token: token,
      ...config.params
    }
  }
  return config
}, err)

// response interceptor
service.interceptors.response.use((response) => {
  if (response.data.StatusCode !== 200) {
    notification.error({
      message: 'Forbidden',
      description: response.data.Message
    })
  }
  return response.data
}, err)

const installer = {
  vm: {},
  install(Vue) {
    Vue.use(VueAxios, service)
  }
}

export {
  installer as VueAxios,
  service as axiosk3
}
