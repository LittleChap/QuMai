import Vue from 'vue'
import Vuex from 'vuex'

/**
 * 模块store引入
 */
import mainStore from '@/views/MainStore'
import permission from '@/store/permission'

import login from '@/views/Login/store'
import siteModuleStore from '@/views/SiteModule/store'

Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    mainStore,
    permission,
    login,
    siteModuleStore
  }
})

export default store
