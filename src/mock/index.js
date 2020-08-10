import Mock from 'mockjs'
import loginAPI from './login'
// import goodsAPI from './goods'
import tagAPI from './tag'
import remoteSearchAPI from './remoteSearch'

Mock.setup({
  timeout: '350-600'
})

// 登录相关
Mock.mock(/\/user\/login/, 'post', loginAPI.loginByUsername)
Mock.mock(/\/user\/logout/, 'post', loginAPI.logout)
Mock.mock(/\/user\/info\.*/, 'get', loginAPI.getUserInfo)

// 商品相关
// Mock.mock(/\/goods\/list/, 'get', goodsAPI.getList)
// Mock.mock(/\/goods\/detail/, 'get', goodsAPI.getGoods)
// Mock.mock(/\/article\/create/, 'post', goodsAPI.createGoods)
// Mock.mock(/\/article\/update/, 'post', goodsAPI.updateGoods)

// 标签相关
Mock.mock(/\/tag\/list/, 'get', tagAPI.getList)
Mock.mock(/\/tag\/create/, 'post', tagAPI.createGoods)
Mock.mock(/\/tag\/update/, 'post', tagAPI.updateGoods)

// 搜索相关
Mock.mock(/\/search\/user/, 'get', remoteSearchAPI.searchUser)

export default Mock
