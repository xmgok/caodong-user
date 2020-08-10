import request from '@/utils/request'
import { downloadExcel } from '@/utils'

export function list (data) {
  return request({
    url: '/coupon_pack/list',
    method: 'post',
    data
  }).then(res => {
    res.data.dataList.forEach(v => {
      v._statusDesc = ['', '未开始', '进行中', '已结束', '已结束'][v.status] || ''
    })
    return res
  })
}

export function info (data) {
  return request({
    url: '/coupon_pack/info',
    method: 'get',
    data
  }).then(res => res)
}

export function save (data) {
  return request({
    url: `/coupon_pack/${data.id ? 'update' : 'add'}`,
    method: 'post',
    data
  }).then(res => res)
}

export function del (data) {
  return request({
    url: '/coupon_pack/delete',
    method: 'post',
    data
  }).then(res => res)
}

// 优惠券导出。
export function couponExport (data = {}, filename) {
  return request({
    url: '/coupon_pack/export',
    method: 'post',
    headers: {
      'Content-type': 'application/json'
    },
    responseType: 'arraybuffer',
    data
  }).then((data) => downloadExcel(data, filename))
}
