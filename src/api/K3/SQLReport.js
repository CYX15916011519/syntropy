import { axiosk3 as axios } from '@/utils/K3Api'

const api = {
  BaseUrl: '/K3API/'
}

export default api

export function GetSQLReport (parameter) {
  return axios({
    url: api.BaseUrl + parameter.SQLReport + '/GetList',
    method: 'post',
    data: parameter
  })
}