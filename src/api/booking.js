// 预约活动
import { downloadExcel } from '@/utils'
import request from '@/utils/request'

// ------------------------------------------------------- 预约设置相关

// 预约设置详情。
export function info (data) {
  return request({ url: '/booking/setup', method: 'get', data }).then(res => res)
}

// 预约设置。
export function save (data) {
  return request({ url: '/booking/setup/save', method: 'post', data }).then(res => res)
}

// ------------------------------------------------------- 预约单相关

// 核销查询。
export function takeInfo (params) {
  return request({ url: '/booking/verify_code', method: 'get', params }).then(res => res.data)
}

// 核销验证预约码。
export function takeValidate (params) {
  return request({ url: '/booking/confirm_verify', method: 'get', params }).then(res => res)
}

// 核销记录。
export function takeList (params) {
  return request({ url: '/booking/verify_list', method: 'get', params }).then(res => res.data)
}

// 分配导购。
export function split (data) {
  return request({ url: '/booking/allot', method: 'get', data }).then(res => res)
}

// 预约关闭。
export function close (data) {
  return request({ url: '/booking/close', method: 'post', data }).then(res => res)
}

// 详情。
export function detail (data) {
  return request({ url: '/booking/info', method: 'get', data }).then(res => res)
}

// 明细列表。
export function detailList (data) {
  return request({ url: '/booking/list', method: 'post', data }).then(res => res)
}

// 明细导出。
export function detailExport (data = {}, filename) {
  return request({
    url: '/booking/export',
    method: 'post',
    headers: {
      'Content-type': 'application/json'
    },
    responseType: 'arraybuffer',
    data
  }).then((data) => downloadExcel(data, filename))
}
