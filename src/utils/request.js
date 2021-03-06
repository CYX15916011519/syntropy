import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import notification from 'ant-design-vue/es/notification'
import { VueAxios } from './axios'
import { ACCESS_TOKEN } from '@/store/mutation-types'

var baseURL = ''
var url = window.location.href
if (url.indexOf('localhost') >= 0) {
  baseURL = 'http://localhost:8099'
} else if (url.indexOf('http://192.168') >= 0) {
  baseURL = 'http://' + window.location.hostname + ':8099'
} else {
  // 正式环境
  baseURL = 'http://139.9.6.165:8099'
}
// baseURL = 'http://localhost:21021'
// baseURL = 'http://139.9.6.165:8099'
// 创建 axios 实例
const service = axios.create({
  // baseURL: process.env.VUE_APP_API_BASE_URL, // api base_url
  baseURL: baseURL,
  crossDomain: true,
  timeout: 15000 // 请求超时时间
})

const err = error => {
  if (error.response) {
    const data = error.response.data
    const token = Vue.ls.get(ACCESS_TOKEN)
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

// request interceptor
service.interceptors.request.use(config => {
  // console.log(config)
  const token = Vue.ls.get(ACCESS_TOKEN)
  if (token) {
    // config.headers['Access-Token'] = token // 让每个请求携带自定义 token 请根据实际情况自行修改
    config.headers.common['Authorization'] = 'Bearer ' + token
    config.headers.common['.AspNetCore.Culture'] = 'zh-Hans'
    // config.headers.common['Host'] = window.location.host
  }
  return config
}, err)

// response interceptor
service.interceptors.response.use(response => {
  // console.log(response)
  return response.data
}, err)

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, service)
  }
}

export { installer as VueAxios, service as axios }
