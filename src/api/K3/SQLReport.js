import { axiosk3 as axios } from '@/utils/K3Api'

const api = {
  BaseUrl: '/K3API/',
  SQLReport75: 'SQLReport75',
  SQLReport76: 'SQLReport76'
}

export default api

export function GetSQLReport75 (parameter) {
  return axios({
    url: api.BaseUrl + api.SQLReport75 + '/GetList',
    method: 'post',
    data: parameter
  })
}
export function GetSQLReport76 (parameter) {
  return axios({
    url: api.BaseUrl + api.SQLReport76 + '/GetList',
    method: 'post',
    data: parameter
  })
}
export function GetSQLReport (parameter) {
  return axios({
    url: api.BaseUrl + parameter.SQLReport + '/GetList',
    method: 'post',
    data: parameter
  })
}