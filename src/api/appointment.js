import request from '@/utils/request'

export function list (data) {
  return request({ url: '/service_info/list_pc', method: 'post', data }).then(res => res)
}

export function info (data) {
  return request({ url: '/service_info/info', data }).then(res => res)
}

export function save (data) {
  return request({ method: 'post', url: `/service_info/${data.id ? 'update' : 'save'}`, data }).then(res => res)
}
