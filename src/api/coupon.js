import request from '@/utils/request'
import { downloadExcel } from '@/utils'

export function list (params) {
  return request({ url: '/coupon/list', params }).then(res => res)
}

export function info (params) {
  return request({ url: '/coupon/info', params }).then(res => res)
}

export function save (params) {
  return request({
    url: `/coupon/${params.id ? 'edit' : 'add'}`,
    method: 'post',
    data: params
  }).then(res => res)
}

export function discard (params) {
  return request({
    url: '/coupon/discard',
    method: 'post',
    data: params
  }).then(res => res)
}

// 优惠券导出。
export function couponExport (data = {}, filename) {
  return request({
    url: '/coupon/export',
    method: 'post',
    headers: {
      'Content-type': 'application/json'
    },
    responseType: 'arraybuffer',
    data
  }).then((data) => downloadExcel(data, filename))
}
