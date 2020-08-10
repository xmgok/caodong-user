import request from '@/utils/request'
import { COMMON_SETTING } from '@/config/const'

export function getDetail () {
  return request({ url: '/brand_setup/info' }).then(res => {
    if (!res.data.length) {
      res.data = Object.keys(COMMON_SETTING).map(key => COMMON_SETTING[key])
    }
    res.data.forEach(item => {
      item.type = isNaN(Number(item.type)) ? item.type : Number(item.type)
      item.subVal = isNaN(Number(item.subVal)) ? item.subVal : Number(item.subVal)
    })
    return res
  })
}

export function save (params = {}) {
  return request({ url: `/brand_setup/save`, method: 'post', data: params }).then(res => res)
}
