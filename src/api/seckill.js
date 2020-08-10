import request from '@/utils/request'
import {
  downloadExcel
} from '@/utils'

// 秒杀列表
export function list (data) {
  return request({
    url: '/seckill/list',
    method: 'post',
    data
  }).then(res => res)
}
// 新增秒杀
export function addSeckill (data, id) {
  return request({
    url: !data.id ? '/seckill/add' : '/seckill/update',
    method: 'post',
    data
  }).then(res => res)
}
// 查看秒杀详情
export function seckillInfo (data) {
  return request({
    url: '/seckill/info',
    data
  }).then(res => res)
}
// 统计信息
export function seckillStatisinfo (data) {
  return request({
    url: '/seckill/statisinfo',
    method: 'post',
    data
  }).then(res => res)
}
// 统计信息详情
export function seckillStatisinfoDetail (data) {
  return request({
    url: '/seckill/statis_detail',
    method: 'post',
    data
  }).then(res => res)
}

// 删除、关闭秒杀活动
export function deleteStop (data) {
  return request({
    url: '/seckill/statu',
    data
  }).then(res => res)
}

// 编辑秒杀活动
export function editSeckill (data) {
  return request({
    url: '/seckill/update',
    method: 'post',
    data
  }).then(res => res)
}
// 修改虚拟销量
export function editvirtualNumber (data) {
  return request({
    url: '/seckill/virtual_number',
    data
  }).then(res => res)
}

// 统计导出
export function seckillExport (params = {}, filename) {
  return request({
    url: 'seckill/reportinfo',
    method: 'post',
    headers: {
      'Content-type': 'application/json'
    },
    responseType: 'arraybuffer',
    params
  }).then((data) => downloadExcel(data, filename))
}
// 统计信息小计
export function statisinfoDataTotal (data) {
  return request({
    url: '/seckill/statisinfo_data',
    method: 'post',
    data
  }).then(res => res)
}
// 统计详情小计
export function statisDetailDataTotal (data) {
  return request({
    url: '/seckill/statis_detail_data',
    method: 'post',
    data
  }).then(res => res)
}
