import Mock from 'mockjs'
import { param2Obj } from '@/utils'

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    name: '@ctitle(5, 20)',
    update_time: Mock.Random.date('yyyy-MM-dd hh:mm:ss'),
    sort: '@integer(1, 100)'
  }))
}

export default {
  getList: config => {
    const { title: name, page = 1, limit = 10, sort } = param2Obj(config.url)

    let mockList = List.filter(item => {
      if (name && item.title.indexOf(name) < 0) return false
      return true
    })

    if (sort === '-id') {
      mockList = mockList.reverse()
    }

    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

    return {
      total: mockList.length,
      list: pageList
    }
  },
  createTag: () => ({
    data: 'success'
  }),
  updateTag: () => ({
    data: 'success'
  })
}
