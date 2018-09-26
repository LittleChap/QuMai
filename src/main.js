// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Element from 'element-ui'
import './styles/theme.scss'
import App from './App'
import router from './router'
import store from './store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import 'normalize.css/normalize.css'

import {getToken} from '@/utils/auth'
import fetch from './utils/fetch'
import {numInput} from './utils/auth'
import moment from 'moment'

// 预览插件
import VuePreview from 'vue-preview'
// 注册全局异步请求方法
Vue.prototype.$post = fetch
Vue.prototype.$moment = moment
Vue.prototype.$numInput = numInput

Vue.directive('format-price', function (el, binding) {
  let price = 0
  if (parseFloat(binding.value) < 0) {
    el.innerHTML = '¥' + price.toFixed(2)
  } else {
    el.innerHTML = '¥' + parseFloat(binding.value).toFixed(2)
  }
})
Vue.directive('format-price-num', function (el, binding) {
  if (!binding.value && binding.value !== 0) {
    return ''
  }
  let price = 0
  if (parseFloat(binding.value) < 0) {
    el.innerHTML = price.toFixed(2)
  } else {
    el.innerHTML = parseFloat(binding.value).toFixed(2)
  }
})
// 预览插件
// Vue.use(VuePreview)
Vue.use(VuePreview, {
  mainClass: 'pswp--minimal--dark',
  barsSize: {top: 0, bottom: 0},
  captionEl: false,
  fullscreenEl: false,
  shareEl: false,
  bgOpacity: 0.85,
  tapToClose: true,
  tapToToggleControls: false
})
Vue.config.productionTip = false
Vue.use(Element)

const whiteList = ['/login']

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  if (getToken()) {
    if (to.path === '/login') {
      next({path: '/'})
    } else {
      if (!store.getters.userInfo.username || store.getters.userInfo.username.length === 0) { // 判断当前用户是否已拉取完user_info信息
        let res = await store.dispatch('GetInfo')
        if (parseInt(res.code) === 1 && res.data.user) {
          const roles = res.data.user.role.role_name || '系统管理组'
          const menuList = res.data.user.role.rights_str ? res.data.user.role.rights_str.split(';') : []
          await store.dispatch('GenerateRoutes', {roles, menuList})
          router.addRoutes(store.getters.addRouters)
          next({path: to.fullPath, replace: true})
        } else {
          NProgress.done()
        }
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})
router.afterEach(() => {
  NProgress.done()
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: {App},
  template: '<App/>'
})
