
// import fetch from '@/utils/fetch'

const siteModuleStore = {
  state: {
    pageModule: {
      pageId: -1,
      listData: []
    },
    pageEditInfo: {}
  },
  mutations: {
    SET_PAGEDETAIL: (state, pageModule) => {
      state.pageModule = pageModule
    },
    SET_PAGEEDITINFO: (state, pageEditInfo) => {
      state.pageEditInfo = pageEditInfo
    }
  },
  actions: {
    // 保存登录信息
    SetPageDetail ({state, commit}, data) {
      let newObj = Object.assign({}, state.pageModule, data)
      commit('SET_PAGEDETAIL', newObj)
    },
    SetPageEditInfo ({state, commit}, data) {
      commit('SET_PAGEEDITINFO', data)
    }
  },
  getters: {
    pageModule: state => state.pageModule,
    pageEditInfo: state => state.pageEditInfo
  }
}

export default siteModuleStore
