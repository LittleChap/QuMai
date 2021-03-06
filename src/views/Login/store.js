import { getToken, setToken, removeToken } from '@/utils/auth'
import fetch from '@/utils/fetch'
import {Message} from 'element-ui'

const LoginStore = {
  state: {
    userId: getToken() ? JSON.parse(getToken()) : {},
    userInfo: {
      // username: ''
    }
  },
  mutations: {
    SET_USERID: (state, userId) => {
      state.userId = userId
    },
    SET_USERINFO: (state, data) => {
      state.userInfo = Object.assign({}, state.userInfo, data)
    }
  },
  actions: {
    // 保存登录信息
    SetTokenInfo ({commit}, data) {
      let obj = {
        userValidToken: data.token,
        userValidId: data.user_id,
        roleId: data.role_id
      }
      setToken(JSON.stringify(obj))
      commit('SET_USERID', obj)
    },
    // 获取用户信息
    async GetInfo ({ commit, state }) {
      let userValidId = state.userId.userValidId

      let res = await fetch('user/goEdit.do', {user_id: userValidId})
      // let res = {
      //   code: 1,
      //   user: {
      //     roleName: '系统管理员'
      //   }
      // }
      if (parseInt(res.code) === 1) {
        commit('SET_USERINFO', res.data.user)
      } else {
        Message.error(res.message || '请求返回结果出错')
      }
      return res
    },
    // 前端 登出
    async FedLogOut ({ commit }) {
      let res = await fetch('logout.do', {})
      if (parseInt(res.code) === 1) {
        commit('SET_USERID', '')
        commit('SET_USERINFO', {})
        removeToken()
      } else {
        Message.error(res.message)
      }
      return res
    },
    // 清楚数据的登录
    ClearLogout ({commit}) {
      commit('SET_USERID', '')
      commit('SET_USERINFO', {})
      removeToken()
    }
  },
  getters: {
    userInfo: state => state.userInfo
  }
}

export default LoginStore
