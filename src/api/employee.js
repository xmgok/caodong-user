import request from '@/utils/request'

// 员工列表
export function getList (params) {
  return request({
    url: '/user/listemp',
    params: Object.assign({
      pageNum: 1,
      pageSize: 10
    }, params)
  }).then(res => res)
}

// 员工账号
export function accountList (params) {
  return request({
    url: '/withdraw/account_list',
    params: Object.assign({
      pageNum: 1,
      pageSize: 10
    }, params)
  }).then(res => {
    (res.data.dataList || []).forEach(v => {
      v.userName = v.userName || '-'
      v.storeName = v.storeName || '-'
      v.userPhone = v.userPhone || '-'
      v.allCommission = v.allCommission || '-'
      v.cashAmount = v.cashAmount || '-'
      v.frozenAmount = v.frozenAmount || '-'
      v.settlementAmount = v.settlementAmount || '-'
      v.withdrawAmount = v.withdrawAmount || '-'
    })
    return res
  })
}

// 添加员工、修改员工
export function add (params) {
  return request({
    url: params.id ? '/user/update' : '/user/add',
    method: 'post',
    data: params
  }).then(res => res)
}

// 门店列表
export function getStoresList (params) {
  return request({
    url: '/store/storelist',
    params
  }).then(res => res)
}
// 员工消息列表
export function getMessageList (params) {
  return request({
    url: '/message/list',
    params
  }).then(res => res)
}
// 员工消息列表详情
export function getMessageDetail (params) {
  return request({
    url: '/message/info',
    params
  }).then(res => res)
}
// 添加员工消息列表
export function addMessageList (params) {
  return request({
    url: '/message/add',
    method: 'post',
    data: params
  }).then(res => res)
}
// 删除员工消息列表
export function delMessageList (params) {
  return request({
    url: '/message/delete',
    data: params
  }).then(res => res)
}
