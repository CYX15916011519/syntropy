import axios from 'axios'

var baseURL = ''
var url = window.location.href
if (url.indexOf('localhost') >= 0) {
  baseURL = 'http://139.9.6.165:800'
} 
else if (url.indexOf('http://192.168') >= 0) {
  baseURL = 'http://192.168.10.2:800'
}
else {
  // 正式环境
  baseURL = 'http://192.168.10.2:800'
}

const api = {
  BaseUrl: baseURL + '/K3API/Token/',
  Get: 'Create'
}

export default api

export async function Get (parameter) {
  return axios({
    url: api.BaseUrl + api.Get,
    method: 'post',
    params: parameter
  })
}
