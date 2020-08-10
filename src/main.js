import Vue from 'vue'
import Cookies from 'js-cookie'
import Big from 'big.js/big.mjs'
import 'normalize.css/normalize.css'
import Element from 'element-ui'
import '@/styles/index.scss'
import '@/assets/icons'
import '@/permission'
import App from './App.vue'
import router from './router'
import store from './store'
import * as filters from './filters'
import './directive'

// if (process.env.NODE_ENV === 'development') {
// require('./mock')
// }

Vue.use(Element, {
  size: Cookies.get('size') || 'medium'
})

// 高精度小数计算
Vue.prototype.Big = Big

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

Vue.prototype.$fnDelKeepAliveInclude = () => {
  store.dispatch('DelKeepAliveInclude')
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
