import { axios } from '@/utils/request'

const api = {
  BaseUrl: '/api/services/app/JITCommon/',
  GetNumber: 'GetNumber',
  GetNumberList: 'GetNumberList'
}

export default api

export function GetNumber (parameter) {
  return axios({
    url: api.BaseUrl + api.GetNumber,
    method: 'get',
    params: parameter
  })
}

export function GetNumberList (parameter) {
  return axios({
    url: api.BaseUrl + api.GetNumberList,
    method: 'get',
    params: parameter
  })
}