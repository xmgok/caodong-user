export default [1, 3, 5, 7, 10, 15, 28, 29, 30, 31].map((item) => {
  return {
    text: `最近${item}天`,
    onClick (picker) {
      const end = new Date()
      end.setHours(23)
      end.setSeconds(59)
      end.setMinutes(59)
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * (item - 1))
      start.setHours(0)
      start.setSeconds(0)
      start.setMinutes(0)
      picker.$emit('pick', [start, end])
    }
  }
})
