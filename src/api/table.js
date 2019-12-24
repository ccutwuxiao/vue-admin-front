import request from '@/utils/request'
// import qs from 'qs'

export function queryUsers(data) {
  return request({
    url: '/user/queryUsers',
    method: 'post',
    data: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json;charset=UTF-8' }
  })
}

export function saveUser(data) {
  return request({
    url: '/user/saveUser',
    method: 'post',
    data: JSON.stringify(data),
    headers: { 'content-type': 'application/json; charset=utf-8' }
  })
}

export function updateUser(data) {
  return request({
    url: '/user/updateUser',
    method: 'post',
    data: JSON.stringify(data),
    headers: { 'content-type': 'application/json; charset=utf-8' }
  })
}

export function delUser(id) {
  return request({
    url: '/user/delUser',
    method: 'post',
    params: { id }
  })
}
