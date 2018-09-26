import axios from 'axios'
import store from '../store'
import {getToken} from '@/utils/auth'
// import { Message } from 'element-ui'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 60000 // 请求超时时间
})

/**
 * 拦截request，加上用户信息
 */
service.interceptors.request.use(config => {
  // const userInfo = getUser()
  // const userInfo = {}
  // if (userInfo) {
  //   if (userInfo.unionId) {
  //     // 第三方登录时加上unionId和type
  //     const data = config.params || {}
  //     config.params = Object.assign({
  //       unionId: userInfo.unionId,
  //       type: '0',
  //       memberId: userInfo.memberId
  //     }, data)
  //   }
  // }
  return config
}, error => {
  console.log(error)
  Promise.reject(error)
})

/**
 * 拦截response，处理全局异常
 */
service.interceptors.response.use(
  response => {
    const res = response.data
    if (parseInt(res.code) === -666 || parseInt(res.code) === 5 || res.message.indexOf('token值错误') > -1) {
      // 登出
      // Message({
      //   message: '登录超时，请重新登录！',
      //   type: 'error',
      //   duration: 2 * 1000
      // })
      setTimeout(async () => {
        // let res = await store.dispatch('FedLogOut')
        // if (parseInt(res.code) === 1) {
        //   location.reload()
        // }
        store.dispatch('ClearLogout')
        location.reload()
      }, 1500)
      return {code: -666, data: null, message: '登录超时，请重新登录！'}
    }
    return response.data
  },
  error => {
    const errorData = {
      code: -2,
      message: error.message
    }
    return errorData
  }
)

/**
 *  @params url: 请求的url地址
 *          data: 请求参数
 *          json: 是否用json的形式
 * */
export default function post (url, data = {}, json) {
  try {
    let contentType = json ? 'application/json' : 'application/x-www-form-urlencoded'
    let config = {
      url: url,
      method: 'post',
      headers: {'Content-Type': contentType},
      withCredentials: true
    }
    const userInfo = getToken() ? JSON.parse(getToken()) : {}
    if (json) {
      config.data = Object.assign({}, userInfo, data)
    } else {
      config.params = Object.assign({}, userInfo, data)
    }
    return service(config)
  } catch (e) {
    return {code: -1, message: '网络异常'}
  }
}

/**
 *  长数据的请求
 *  @params url: 请求的url地址
 *          data: 请求参数
 * */
export function longPost (url, data = {}) {
  try {
    let config = {
      url: url,
      method: 'post',
      headers: {'Content-Type': 'multipart/form-data'},
      withCredentials: true,
      data: data
    }
    return service(config)
  } catch (e) {
    return {code: -1, message: '网络异常'}
  }
}
