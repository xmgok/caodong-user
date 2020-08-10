import Vue from 'vue'
import router from './router'
import store from './store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth'

/**
 * 权限控制
 */

const whiteList = ['/login'] // 不重定向白名单

router.beforeEach((to, from, next) => {
  // console.log('beforeEach\n', 'to\n', to, '\nfrom\n', from)
  NProgress.start()

  const doNext = (path) => {
    path ? next({ path }) : next()
    NProgress.done()
  }

  // 登录权限逻辑处理
  if (getToken()) {
    if (to.path === '/login') {
      doNext('/')
    } else {
      if (store.getters.roles.length === 0 || store.getters.companyInfo === false) {
        store.dispatch('GetInfo').then(() => { // 拉取用户信息
          if (!store.getters.companyInfo) {
            to.path !== '/enterprise' ? doNext('/enterprise') : doNext()
          } else if (to.meta && to.meta.code && !store.getters.roles.includes(to.meta.code)) {
            doNext('/')
          } else {
            to.path === '/enterprise' ? doNext('/') : doNext()
          }
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            Message.error(err || 'Verification failed, please login again')
            doNext('/login')
          })
        })
      } else {
        doNext()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      doNext()
    } else {
      doNext(`/login?redirect=${to.path}`)
    }
  }
})

router.afterEach(async (to, from) => {
  // console.log('afterEach\n', 'to\n', to, '\nfrom\n', from)
  // afterEach 钩子执行之后会触发 DOM 更新（需在下次 DOM 更新循环结束之后延迟执行）
  await Vue.nextTick()
  if (to.meta.keepAlive) store.dispatch('AddKeepAliveInclude', to.name)

  NProgress.done()
})
