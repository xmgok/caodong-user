import request from '@/utils/request'

export function getDetail () {
  return request({ url: '/wxcard/info' }).then(res => res)
}

export function save (params = {}) {
  return request({ url: `/wxcard/save`, method: 'post', data: params }).then(res => res)
}
