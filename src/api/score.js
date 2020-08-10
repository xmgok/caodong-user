import request from '@/utils/request'
import { downloadExcel } from '@/utils'

export function getDetail () {
  return request({ url: '/integralsetup/info' }).then(res => res)
}

export function save (params = {}) {
  return request({ url: `/integralsetup/save`, method: 'post', data: params }).then(res => res)
}

// 积分明细列表。
export function detailList (data = {}, filename) {
  return request({
    url: '/integral/list',
    method: 'get',
    data
  })
}

// 积分明细导出。
export function detailExport (data = {}, filename) {
  return request({
    url: '/integral/export',
    method: 'get',
    headers: {
      'Content-type': 'application/json'
    },
    responseType: 'arraybuffer',
    data
  }).then((data) => downloadExcel(data, filename))
}
