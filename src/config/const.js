/* common const */

// 卡券颜色 - 服务端给的支持的值，不能随意添加。
export const WeChatCardBagColors = [
  '#63b359',
  '#2c9f67',
  '#509fc9',
  '#5885cf',
  '#9062c0',
  '#d09a45',
  '#e4b138',
  '#ee903c',
  '#f08500',
  '#a9d92d',
  '#dd6549',
  '#cc463d',
  '#cf3e36',
  '#5E6671'
]

// 优惠券类型
export const CouponTypes = {
  '1': '代金券',
  '3': '折扣券',
  '4': '包邮券',
  '5': '兑换券'
  // '6': '抵用券'
}

// 优惠券发放方式
export const CouponSendTypes = {
  '1': '主动领取',
  '2': '导购发放'
  // '3': '系统发放'
}

// 素材类型
export const MaterialTypes = {
  IMAGE: 1, // 图片
  VIDEO: 2, // 视屏
  REPORT: 3 // 被举报
}

// 退款原因
export const REFUND_REASON_LIST = [
  { label: '拍错/拍多/不想要了', value: 1 },
  { label: '订单信息错误', value: 2 },
  { label: '长时间未发货', value: 3 },
  { label: '缺货', value: 4 },
  { label: '其他', value: 5 }
]

// 退货退款原因
export const RETURN_REASON_LIST = [
  { label: '商品需要维修', value: 6 },
  { label: '收到商品破损', value: 7 },
  { label: '商品错发/漏发', value: 8 },
  { label: '收到商品不符合描述', value: 9 },
  { label: '商品质量问题', value: 10 },
  { label: '长时间未发货', value: 11 },
  { label: '未收到货', value: 12 }
]

// 售后退货退款原因
export const AFTERSALES_REASON_LIST = REFUND_REASON_LIST.concat(RETURN_REASON_LIST)

// 快递公司列表
export const EXPRESS_LIST = [
  { label: '顺丰快递', value: 1 },
  { label: '圆通快递', value: 2 },
  { label: '中通快递', value: 3 },
  { label: '天天快递', value: 4 },
  { label: '德邦物流', value: 5 }
]

// 售后状态
export const RETURN_STATUS_MAP = {
  1: '申请中',
  2: '已取消',
  3: '已结束',
  4: '待审核',
  5: '审核中',
  7: '已完成'
}

// 商品类型
// export const GOODS_TYPE = [
//   { label: '普通商品', value: 1 },
//   { label: '赠品', value: 2 },
//   { label: '活动商品', value: 3 }
// ]
// 商品类型
export const GOODS_TYPE = {
  1: '普通商品',
  2: '赠品',
  3: '活动商品'
}
