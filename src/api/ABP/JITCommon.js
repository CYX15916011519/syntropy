import { axios } from '@/utils/request'

const api = {
  BaseUrl: '/api/services/app/JITCommon/',
  GetNumber: 'GetNumber'
}

export default api

export function GetNumber (parameter) {
  return axios({
    url: api.BaseUrl + api.GetNumber,
    method: 'get',
    params: parameter
  })
}
