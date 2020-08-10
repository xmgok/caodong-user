/**
 * 时间选择器
 * 增加快捷选项 - 最近x天
 * 导出 - 选取范围限制最大为31天
 * */

import shortcuts from './_shortcuts'

export default {
  data () {
    return {
      pickerMinDate: '',
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.pickerMinDate = minDate.getTime()
          if (maxDate) {
            this.pickerMinDate = ''
          }
        },
        disabledDate: (time) => {
          if (this.pickerMinDate !== '') {
            let one = (31 - 1) * 24 * 3600 * 1000 // 31天比较合适 因为一个月最多31天
            let minTime = this.pickerMinDate - one
            let maxTime = this.pickerMinDate + one
            // 不能选取大于当前日期的日期
            // if (maxTime > new Date()) {
            //   maxTime = new Date()
            // }
            return time.getTime() < minTime || time.getTime() > maxTime
          }
          return false
          // 不能选取大于当前日期的日期
          // return time.getTime() > Date.now()
        },
        shortcuts
      }
    }
  }
}
