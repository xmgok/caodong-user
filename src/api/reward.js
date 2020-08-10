import request from '@/utils/request'
import { downloadExcel } from '@/utils'

// 金币明细列表。
export function detailList (data = {}, filename) {
  return request({
    url: '/user_reward/list',
    method: 'get',
    data
  })
}

// 金币明细导出。
export function detailExport (data = {}, filename) {
  return request({
    url: '/user_reward/export',
    method: 'get',
    headers: {
      'Content-type': 'application/json'
    },
    responseType: 'arraybuffer',
    data
  }).then((data) => downloadExcel(data, filename))
}
