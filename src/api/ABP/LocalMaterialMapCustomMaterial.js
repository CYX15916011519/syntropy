import { axios } from '@/utils/request'

const api = {
  BaseUrl: '/api/services/app/LocalMaterialMapCustomMaterialAppServices/',
  Get: 'Get',
  GetAll: 'GetAll',
  Create: 'Create',
  Update: 'Update',
  Delete: 'Delete',
  GetByFItemID: 'GetByLocalItemFumber',
  GetByLocalItemCustomID: 'GetByLocalItemCustomID'
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
    method: 'get',
    params: parameter
  })
}

// id == 0 add     post
// id != 0 update  put
export function Save (parameter) {
  return axios({
    url: api.BaseUrl + (parameter.id === 0 ? api.Create : api.Update),
    method: parameter.id === 0 ? 'post' : 'put',
    data: parameter
  })
}

export function Delete (parameter) {
  return axios({
    url: api.BaseUrl + api.Delete,
    method: 'delete',
    params: parameter
  })
}

export function GetByFItemID (parameter) {
  return axios({
    url: api.BaseUrl + api.GetByFItemID,
    method: 'get',
    params: parameter
  })
}

export function GetByFItemID2 (parameter) {
  return axios({
    url: api.BaseUrl + api.GetByLocalItemCustomID,
    method: 'get',
    params: parameter
  })
}
