import request from '@/utils/request'
import { downloadExcel } from '@/utils'

export function getList (data) {
  return request({
    url: '/broadcast/list',
    data
  }).then(res => res)
}
// 新增直播员工
export function addStaff (data) {
  return request({
    url: '/broadcast/save',
    method: 'post',
    data
  }).then(res => res)
}
// 启用 and 停用 直播间
export function changStatus (data) {
  return request({
    url: '/broadcast/status',
    data
  }).then(res => res)
}
// 添加参与门店
export function addstore (data) {
  return request({
    url: '/broadcast/store/add',
    method: 'post',
    data
  }).then(res => res)
}
// 查看门店。。。
export function seestore (data) {
  return request({
    url: '/broadcast/store/idList',
    data
  }).then(res => res)
}
// 直播间商品列表
export function productList (data) {
  return request({
    url: '/broadcast/product/list',
    data
  }).then(res => res)
}
// 批量删除商品
export function productDel (data) {
  return request({
    url: '/broadcast/product/delete',
    method: 'post',
    data
  }).then(res => res)
}
// 添加直播间商品
export function productAdd (data) {
  return request({
    url: '/broadcast/product/add',
    method: 'post',
    data
  }).then(res => res)
}
// 对商品批量设置折扣
export function setDiscount (data) {
  return request({
    url: '/broadcast/product/setDiscount',
    method: 'post',
    data
  }).then(res => res)
}
// 直播间装饰
export function decorateSave (data) {
  return request({
    url: '/broadcast/decorate/save',
    method: 'post',
    data
  }).then(res => res)
}
// 编辑直播间统计
export function getdecorate (data) {
  return request({
    url: 'broadcast/decorate/roomId',
    data
  }).then(res => res)
}
// 统计数据
export function statisticsList (data) {
  return request({
    url: '/broadcast/statistics',
    method: 'post',
    data
  }).then(res => res)
}
// 统计导出
export function statisticsListExport (params = {}, filename) {
  return request({
    url: '/broadcast/statistics/export',
    method: 'post',
    headers: {
      'Content-type': 'application/json'
    },
    responseType: 'arraybuffer',
    params
  }).then((data) => downloadExcel(data, filename))
}
