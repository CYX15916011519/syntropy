import { axiosk3 as axios } from '@/utils/K3Api'

const api = {
  BaseUrl: '/K3API/Bill1000200/',
  Get: 'GetTemplate',
  GetAll: 'GetList',
  Create: 'Save',
  Update: 'Update',
  Delete: 'Delete',
  GetByFItemID: 'GetDetail',
  Check: 'CheckItem'
}

export default api

export function Get (parameter) {
  return axios({
    url: api.BaseUrl + api.Get,
    method: 'get',
    params: parameter
  })
}

export function GetAll (parameter) {
  return axios({
    url: api.BaseUrl + api.GetAll,
    method: 'post',
    data: parameter
  })
}

// id == 0 add     post
// id != 0 update  put
export function Save (parameter) {
  return axios({
    url: api.BaseUrl + api.Create,
    method: 'post',
    data: parameter
  })
}

export function Save2 (parameter) {
  return axios({
    url: api.BaseUrl + api.Update,
    method: 'post',
    data: parameter
  })
}

export function Delete (parameter) {
  return axios({
    url: api.BaseUrl + api.Delete,
    method: 'post',
    data: parameter
  })
}

export function GetByFItemID (parameter) {
  return axios({
    url: api.BaseUrl + api.GetByFItemID,
    method: 'post',
    data: parameter
  })
}

export function Check (parameter) {
  return axios({
    url: api.BaseUrl + api.Check,
    method: 'post',
    data: parameter
  })
}
