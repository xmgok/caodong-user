// 设置 dateFormat 到过滤器
export { dateFormat } from '@/utils'

/**
 * 截取给定字符串
 * example: {{ msg | truncate(10) }} // 'lorem ipsum dolor' => 'lorem ipsu...'
 */
export function truncate (value = 15, length) {
  if (!value || typeof value !== 'string') return ''
  if (value.length <= length) return value
  return value.substring(0, length) + '...'
}
