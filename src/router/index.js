import Vue from 'vue'
import Router from 'vue-router'

import App from '@/App'

import Layout from '@/views/Layout/Layout'
import LayoutForHome from '@/views/Layout/LayoutForHome'

import Login from '@/views/Login/LoginIndex'
import Home from '@/views/Home/HomeIndex'

// 全局
import Basic from '@/views/Global/Site/Basic'
import Service from '@/views/Global/Site/Service'
import RegionList from '@/views/Global/Region/RegionList'
import LogisticsCompanyList from '@/views/Global/LogisticsCompany/LogisticsCompanyList'
import LogisticsCompanySet from '@/views/Global/LogisticsCompany/LogisticsCompanySet'
import UserList from '@/views/Global/user/UserList.vue'
import UserSet from '@/views/Global/user/UserSet.vue'
import RoleList from '@/views/Global/Role/RoleList.vue'
import RoleSet from '@/views/Global/Role/RoleSet.vue'
import SysLog from '@/views/Global/SystemLog/SysLog.vue'
import UserLoginLog from '@/views/Global/SystemLog/UserLoginLog.vue'

// 商品
import GoodsList from '@/views/Goods/Goods/GoodsList' // 商品列表页
import GoodsEdit from '@/views/Goods/Goods/GoodsEdit' // 商品查看
import GoodsCatList from '@/views/Goods/GoodsCat/GoodsCatList' // 商品分类列表页
import GoodsCatSet from '@/views/Goods/GoodsCat/GoodsCatSet' // 商品分类设置
import AppraiseSet from '@/views/Goods/GoodsCat/AppraiseSet' // 评价引导词设置
import GoodsBrandList from '../views/Goods/Brand/BrandList' // 商品品牌列表
import GoodsBrandSet from '../views/Goods/Brand/BrandSet' // 商品品牌设置

// 订单
import OrderList from '@/views/Order/Order/List/Index' // 订单列表页
import OrderDetail from '@/views/Order/Order/Detail/Index' // 订单详情页
import Payment from '@/views/Order/Order/Payment/Index' // 扫码支付

import AfterList from '@/views/Order/After/List/Index' // 售后列表页
import AfterDetail from '@/views/Order/After/Detail/Index' // 售后详情页

import OrderSetting from '@/views/Order/Setting/Index' // 售后详情页

// 营销
import CouponList from '@/views/Marketing/CouponModule/CouponList' // 优惠券列表
import CouponEdit from '@/views/Marketing/CouponModule/CouponEdit' // 优惠券-编辑
import CouponDetail from '@/views/Marketing/CouponModule/CouponDetail' // 优惠券-查看
// import FightGroupList from '@/views/Marketing/FightGroupModule/FightGroupList' // 拼团列表
// import SeckillList from '@/views/Marketing/SeckillModule/SeckillList' // 秒杀列表
import ScanGiftList from '../views/Marketing/ScanGiftModule/ScanGiftList' // 扫码有礼列表
import ScanGiftEdit from '../views/Marketing/ScanGiftModule/ScanGiftEdit' // 扫码有礼-编辑
import ScanGiftDetail from '../views/Marketing/ScanGiftModule/ScanGiftDetail' // 扫码有礼-详情

// 运营
import Questionnaire from '@/views/Operate/Questionnaire/List/List' // 问卷调查 列表
import QuestionnaireEdit from '@/views/Operate/Questionnaire/Edit/Edit' // 问卷调查 编辑
import QuestionnaireView from '@/views/Operate/Questionnaire/View/View' // 问卷调查 查看
import QuestionnaireResult from '@/views/Operate/Questionnaire/Result/Result' // 问卷调查 结果

import OperateData from '@/views/Operate/Data/Index' // 运营数据

import HotSearch from '@/views/Operate/HotSearch/Index' // 热搜管理
import Feedback from '@/views/Operate/Feedback/Index' // 意见反馈管理
import Recommend from '@/views/Operate/Recommend/Index' // 推荐管理

// 站点
import PageList from '@/views/SiteModule/PageSetting/PageList' // 页面列表
import PageEdit from '@/views/SiteModule/PageSetting/PageEdit' // 页面列表 -编辑
import ImageEdit from '@/views/SiteModule/PageSetting/ImageEdit' // 页面列表 -图片编辑
import NavigationEdit from '@/views/SiteModule/PageSetting/NavigationEdit' // 页面列表 -导航编辑
import ProductEdit from '@/views/SiteModule/PageSetting/ProductEdit' // 页面列表 -商品编辑
import SecKillEdit from '@/views/SiteModule/PageSetting/SecKillEdit' // 页面列表 -秒杀编辑
import FightGroupEdit from '@/views/SiteModule/PageSetting/FightGroupEdit' // 页面列表 -拼团编辑
import PageCouponEdit from '@/views/SiteModule/PageSetting/CouponEdit' // 页面列表 -优惠券编辑
import HomeAds from '@/views/SiteModule/HomeAds/HomeAds' // 首页广告

// 基础数据
// import BrandList from '@/views/BaseData/Device/BrandSetting/BrandList'
// import BrandSettingDetail from '@/views/BaseData/Device/BrandSetting/BrandDetail'
// import AreaSetting from '@/views/BaseData/Area/AreaSetting'

// 会员
import AccountManagementList from '@/views/Member/Account/AccountManagement'
import SetUpList from '../views/Member/SetUp/list'
import AppraiseManagementList from '../views/Member/Appraise/Management'

// 店铺
import ShopManagementList from '@/views/Shop/ShopManagement/list'
import ShopManagementSet from '@/views/Shop/ShopManagement/set'

// 系统
// import AccountList from '@/views/System/Permissions/AccountManage/AccountList'
// import AccountDetail from '@/views/System/Permissions/AccountManage/AccountDetail'
// import PermissionList from '@/views/System/Permissions/PermissionManage/PermissionList'
// import PermissionDetail from '@/views/System/Permissions/PermissionManage/PermissionDetail'

/* error page */
import Err404 from '@/views/404'

Vue.use(Router)

export const constantRouterMap = [
  {path: '/login', component: Login},
  {path: '/404', component: Err404},
  {
    path: '/',
    component: LayoutForHome,
    redirect: '/index',
    name: 'Home',
    children: [{path: 'index', component: Home}]
  },
  {path: '*', component: Err404}
]
/**
 *  asyncRouterMap 用于做权限控制，以及对应菜单的生成
 *
 *  生成菜单的规则：（默认全部到第三级路由）
 *  1. noDropDown 为true 时， 表示不展开
 *  2. hidden 为 true 时， 表示不再菜单中显示
 *  3. 若是第三级不展开且归属于第二级，第二级必须传 childrenList
 *  4. 若是第三级不展开 但是归属于同第三级的， 第三级必须传 childrenList
 *  5. menuId 为对应的路由 ---> 以便做权限控制
 *  6. icon 为对应二级菜单要显示的图片
 * */
export const asyncRouterMap = [
  {
    path: '/global',
    name: '全局',
    component: App,
    meta: {menuId: 'global'},
    children: [
      {
        path: 'site',
        name: '站点设置',
        component: Layout,
        redirect: '/global/site/basic',
        meta: {menuId: '/global/site', icon: 'el-icon-setting', childrenList: ['/global/site/basic', '/global/site/service']},
        children: [
          {
            path: 'basic',
            name: '基本设置',
            component: Basic,
            meta: {menuId: '/global/site/basic'}
          },
          {
            path: 'service',
            name: '客服设置',
            component: Service,
            meta: {menuId: '/global/site/service'}
          }
        ]
      },
      {
        path: 'region',
        name: '地区管理',
        component: Layout,
        redirect: '/global/region/RegionList',
        noDropDown: true,
        meta: {menuId: '/global/region', icon: 'el-icon-location', childrenList: ['/global/region/RegionList']},
        children: [
          {
            path: 'RegionList',
            name: '地区管理列表',
            component: RegionList,
            hidden: true,
            meta: {menuId: '/global/region/RegionList'}
          }
        ]
      },
      {
        path: 'logisticscompany',
        name: '物流配置管理',
        component: Layout,
        redirect: '/global/logisticscompany/list',
        noDropDown: true,
        meta: {menuId: '/global/logisticscompany', childrenList: ['/global/logisticscompany/list', '/global/logisticscompany/set']},
        children: [
          {
            path: 'list',
            name: '物流管理列表',
            component: LogisticsCompanyList,
            hidden: true,
            meta: {menuId: '/global/logisticscompany/list'}
          },
          {
            path: 'set',
            name: '物流配送设置',
            component: LogisticsCompanySet,
            hidden: true,
            meta: {menuId: '/global/logisticscompany/set'}
          }
        ]
      },
      {
        path: 'user',
        name: '用户管理',
        component: Layout,
        redirect: '/global/user/list',
        noDropDown: true,
        meta: {menuId: '/global/user', childrenList: ['/global/user/list', '/global/user/set']},
        children: [
          {
            path: 'list',
            name: '用户管理列表',
            component: UserList,
            hidden: true,
            meta: {menuId: '/global/user/list'}
          },
          {
            path: 'set',
            name: '用户管理设置',
            component: UserSet,
            hidden: true,
            meta: {menuId: '/global/user/set'}
          }
        ]
      },
      {
        path: 'role',
        name: '权限管理',
        component: Layout,
        redirect: '/global/role/roleList',
        noDropDown: true,
        meta: {menuId: '/global/role', childrenList: ['/global/role/roleList', '/global/role/roleSet']},
        children: [
          {
            path: 'roleList',
            name: '权限管理列表',
            component: RoleList,
            hidden: true,
            meta: {menuId: '/global/role/roleList'}
          },
          {
            path: 'roleSet',
            name: '权限管理设置',
            component: RoleSet,
            hidden: true,
            meta: {menuId: '/global/role/roleSet'}
          }
        ]
      },
      {
        path: 'log',
        name: '系统日志',
        component: Layout,
        meta: {menuId: '/global/log', icon: 'el-icon-tickets', childrenList: ['global/log/syslog', 'global/log/userLoginLog']},
        children: [
          {
            path: 'sysLog',
            name: '操作日志',
            component: SysLog,
            meta: {menuId: 'global/log/syslog'}
          },
          {
            path: 'userLoginLog',
            name: '登陆日志',
            component: UserLoginLog,
            meta: {menuId: 'global/log/userLoginLog'}
          }
        ]
      }
    ]
  },
  // 商品
  {
    path: '/order',
    name: '订单',
    component: App,
    meta: {menuId: 'order'},
    children: [
      {
        path: 'order',
        name: '订单管理',
        component: Layout,
        noDropDown: true,
        redirect: '/order/order/list',
        meta: {menuId: '/order/order', childrenList: ['/order/order/list', '/order/order/detail', '/order/order/payment']},
        children: [
          {
            path: 'list',
            name: '订单列表',
            component: OrderList,
            hidden: true,
            meta: {menuId: '/order/order/list'}
          },
          {
            path: 'detail',
            name: '订单详情',
            component: OrderDetail,
            hidden: true,
            meta: {menuId: '/order/order/detail'}
          },
          {
            path: 'payment',
            name: '扫码支付',
            component: Payment,
            hidden: true,
            meta: {menuId: '/order/order/payment'}
          }
        ]
      },
      {
        path: 'after',
        name: '售后',
        component: Layout,
        noDropDown: true,
        redirect: '/order/after/list',
        meta: {menuId: '/order/after', childrenList: ['/after/after/list']},
        children: [
          {
            path: 'list',
            name: '售后列表',
            component: AfterList,
            hidden: true,
            meta: {menuId: '/after/after/list'}
          },
          {
            path: 'detail',
            name: '售后详情',
            component: AfterDetail,
            hidden: true,
            meta: {menuId: '/after/after/detail'}
          }
        ]
      },
      {
        path: 'setting',
        name: '订单设置',
        component: Layout,
        noDropDown: true,
        redirect: '/order/setting/index',
        meta: {menuId: '/order/setting', childrenList: ['/order/setting/index']},
        children: [
          {
            path: 'index',
            name: '订单设置.',
            component: OrderSetting,
            hidden: true,
            meta: {menuId: '/order/setting/index'}
          }
        ]
      }
    ]
  },
  {
    path: '/goods',
    name: '商品',
    component: App,
    meta: {menuId: 'goods'},
    children: [
      {
        path: 'goods',
        name: '商品列表',
        component: Layout,
        noDropDown: true,
        redirect: '/goods/goods/goodsList',
        meta: {menuId: '/goods/goods', icon: 'el-icon-goods', childrenList: ['/goods/goods/goodsList', '/goods/goods/goodsEdit']},
        children: [
          {
            path: 'goodsList',
            name: '商品列表-列表',
            component: GoodsList,
            hidden: true,
            meta: {menuId: '/goods/goods/goodsList'}
          },
          {
            path: 'goodsEdit',
            name: '查看商品',
            component: GoodsEdit,
            hidden: true,
            meta: {menuId: '/goods/goods/goodsEdit'}
          }
        ]
      },
      {
        path: 'goodsCat',
        name: '商品分类',
        component: Layout,
        noDropDown: true,
        redirect: '/goods/goodsCat/goodsCatList',
        meta: {menuId: '/goods/goodsCat', icon: 'el-icon-goods', childrenList: ['/goods/goodsCat/goodsCatList', '/goods/goodsCat/goodsCatSet', '/goods/goodsCat/appraiseSet']},
        children: [
          {
            path: 'goodsCatList',
            name: '商品分类列表',
            component: GoodsCatList,
            hidden: true,
            meta: {menuId: '/goods/goodsCat/goodsCatList'}
          },
          {
            path: 'goodsCatSet',
            name: '商品分类设置',
            component: GoodsCatSet,
            hidden: true,
            meta: {menuId: '/goods/goodsCat/goodsCatSet'}
          },
          {
            path: 'appraiseSet',
            name: '评价引导词设置',
            component: AppraiseSet,
            hidden: true,
            meta: {menuId: '/goods/goodsCat/appraiseSet'}
          }
        ]
      },
      {
        path: 'brand',
        name: '商品品牌',
        component: Layout,
        noDropDown: true,
        redirect: '/goods/brand/goodsGrandList',
        meta: {menuId: '/goods/brand', icon: 'el-icon-goods', childrenList: []},
        children: [
          {
            path: 'goodsGrandList',
            name: '商品品牌列表',
            component: GoodsBrandList,
            hidden: true,
            meta: {menuId: '/goods/brand/goodsGrandList'}
          },
          {
            path: 'goodsGrandSet',
            name: '商品品牌设置',
            component: GoodsBrandSet,
            hidden: true,
            meta: {menuId: '/goods/brand/goodsGrandSet'}
          }
        ]
      }
    ]
  },
  {
    path: '/operate',
    name: '运营',
    component: App,
    meta: {menuId: 'operate'},
    children: [
      {
        path: 'questionniare',
        name: '问卷调查',
        component: Layout,
        redirect: '/operate/questionniare/list',
        meta: {menuId: '/operate/questionniare', icon: 'el-icon-tickets', childrenList: ['/operate/questionniare/list']},
        noDropDown: true,
        children: [
          {
            path: 'list',
            name: '问卷调查列表',
            component: Questionnaire,
            hidden: true,
            meta: {menuId: '/operate/questionniare/list'}
          }, {
            path: 'edit',
            name: '问卷调查编辑',
            component: QuestionnaireEdit,
            hidden: true,
            meta: {menuId: '/operate/questionniare/edit'}
          }, {
            path: 'view',
            name: '问卷调查详情',
            component: QuestionnaireView,
            hidden: true,
            meta: {menuId: '/operate/questionniare/view'}
          }, {
            path: 'result',
            name: '问卷调查结果',
            component: QuestionnaireResult,
            hidden: true,
            meta: {menuId: '/operate/questionniare/result'}
          }
        ]
      },
      {
        path: 'data',
        name: '运营数据',
        component: Layout,
        redirect: '/operate/data/index',
        meta: {menuId: '/operate/data', icon: 'el-icon-tickets', childrenList: ['/operate/data']},
        noDropDown: true,
        children: [
          {
            path: 'index',
            name: '运营数据首页',
            component: OperateData,
            hidden: true,
            meta: {menuId: '/operate/data/index'}
          }
        ]
      },
      {
        path: 'hotsearch',
        name: '热搜管理',
        component: Layout,
        redirect: '/operate/hotsearch/index',
        meta: {menuId: '/operate/hotsearch', icon: 'el-icon-tickets', childrenList: ['/operate/hotsearch']},
        noDropDown: true,
        children: [
          {
            path: 'index',
            name: '热搜管理首页',
            component: HotSearch,
            hidden: true,
            meta: {menuId: '/operate/hotsearch/index'}
          }
        ]
      },
      {
        path: 'recommend',
        name: '推荐商品管理',
        component: Layout,
        redirect: '/operate/recommend/index',
        meta: {menuId: '/operate/recommend', icon: 'el-icon-tickets', childrenList: ['/operate/recommend']},
        noDropDown: true,
        children: [
          {
            path: 'index',
            name: '推荐商品管理首页',
            component: Recommend,
            hidden: true,
            meta: {menuId: '/operate/recommend/index'}
          }
        ]
      },
      {
        path: 'feedback',
        name: '意见反馈管理',
        component: Layout,
        redirect: '/operate/feedback/index',
        meta: {menuId: '/operate/feedback', icon: 'el-icon-tickets', childrenList: ['/operate/feedback']},
        noDropDown: true,
        children: [
          {
            path: 'index',
            name: '意见反馈管理首页',
            component: Feedback,
            hidden: true,
            meta: {menuId: '/operate/feedback/index'}
          }
        ]
      }
    ]
  },
  {
    path: '/marketingModule',
    name: '营销',
    component: App,
    meta: {menuId: 'marketingModule'},
    children: [
      {
        path: 'couponModule',
        name: '优惠券管理',
        component: Layout,
        redirect: '/marketingModule/couponModule/couponList',
        meta: {menuId: '/marketingModule/couponModule', icon: 'el-icon-tickets', childrenList: ['/marketingModule/couponModule/couponList', '/marketingModule/couponModule/couponEdit', '/marketingModule/couponModule/couponDetail']},
        noDropDown: true,
        children: [
          {
            path: 'couponList',
            name: '优惠券管理-列表',
            component: CouponList,
            hidden: true,
            meta: {menuId: '/marketingModule/couponModule/couponList'}
          },
          {
            path: 'couponEdit',
            name: '优惠券编辑',
            component: CouponEdit,
            hidden: true,
            meta: {menuId: '/marketingModule/couponModule/couponEdit'}
          },
          {
            path: 'couponDetail',
            name: '优惠券查看',
            component: CouponDetail,
            hidden: true,
            meta: {menuId: '/marketingModule/couponModule/couponDetail'}
          }
        ]
      },
      {
        path: 'scanGiftModule',
        name: '扫码有礼管理',
        component: Layout,
        redirect: '/marketingModule/scanGiftModule/scanGiftList',
        meta: {menuId: '/marketingModule/scanGiftModule', icon: 'el-icon-sold-out', childrenList: ['/marketingModule/scanGiftModule/scanGiftList', '/marketingModule/scanGiftModule/scanGiftEdit', '/marketingModule/scanGiftModule/scanGiftDetail']},
        noDropDown: true,
        children: [
          {
            path: 'scanGiftList',
            name: '扫码有礼管理-列表',
            component: ScanGiftList,
            hidden: true,
            meta: {menuId: '/marketingModule/scanGiftModule/scanGiftList'}
          },
          {
            path: 'scanGiftEdit',
            name: '扫码有礼管理-编辑',
            component: ScanGiftEdit,
            hidden: true,
            meta: {menuId: '/marketingModule/scanGiftModule/scanGiftEdit'}
          },
          {
            path: 'scanGiftDetail',
            name: '扫码有礼管理-详情',
            component: ScanGiftDetail,
            hidden: true,
            meta: {menuId: '/marketingModule/scanGiftModule/scanGiftDetail'}
          }
        ]
      }
      /* {
        path: 'fightGroupModule',
        name: '拼团管理',
        component: Layout,
        redirect: '/marketingModule/fightGroupModule/fightGroupList',
        meta: {menuId: '/marketingModule/fightGroupModule', icon: 'el-icon-sold-out', childrenList: ['/marketingModule/fightGroupModule/fightGroupList']},
        noDropDown: true,
        children: [
          {
            path: 'fightGroupList',
            name: '拼团管理-列表',
            component: FightGroupList,
            hidden: true,
            meta: {menuId: '/marketingModule/fightGroupModule/fightGroupList'}
          }
        ]
      },
      {
        path: 'seckillModule',
        name: '秒杀管理',
        component: Layout,
        redirect: '/marketingModule/seckillModule/seckillList',
        meta: {menuId: '/marketingModule/seckillModule', icon: 'el-icon-time', childrenList: ['/marketingModule/seckillModule/seckillList']},
        noDropDown: true,
        children: [
          {
            path: 'seckillList',
            name: '秒杀管理-列表',
            component: SeckillList,
            hidden: true,
            meta: {menuId: '/marketingModule/seckillModule/seckillList'}
          }
        ]
      } */
    ]
  },
  {
    path: '/siteModule',
    name: '站点',
    component: App,
    meta: {menuId: 'siteModule'},
    children: [
      {
        path: 'pageSetting',
        name: '页面列表',
        component: Layout,
        redirect: '/siteModule/pageSetting/pageList',
        meta: {menuId: '/siteModule/pageSetting', icon: 'el-icon-tickets', childrenList: ['/siteModule/pageSetting/pageList', '/siteModule/pageSetting/pageEdit', '/siteModule/pageSetting/imageEdit', '/siteModule/pageSetting/navigationEdit', '/siteModule/pageSetting/productEdit', '/siteModule/pageSetting/secKillEdit', '/siteModule/pageSetting/fightGroupEdit', '/siteModule/pageSetting/couponEdit']},
        noDropDown: true,
        children: [
          {
            path: 'pageList',
            name: '页面列表-列表',
            component: PageList,
            hidden: true,
            meta: {menuId: '/siteModule/pageSetting/pageList'}
          },
          {
            path: 'pageEdit',
            name: '页面列表-编辑',
            component: PageEdit,
            hidden: true,
            meta: {menuId: '/siteModule/pageSetting/pageEdit'}
          },
          {
            path: 'imageEdit',
            name: '页面列表-图片编辑',
            component: ImageEdit,
            hidden: true,
            meta: {menuId: '/siteModule/pageSetting/imageEdit'}
          },
          {
            path: 'navigationEdit',
            name: '页面列表-导航编辑',
            component: NavigationEdit,
            hidden: true,
            meta: {menuId: '/siteModule/pageSetting/navigationEdit'}
          },
          {
            path: 'productEdit',
            name: '页面列表-商品编辑',
            component: ProductEdit,
            hidden: true,
            meta: {menuId: '/siteModule/pageSetting/productEdit'}
          },
          {
            path: 'secKillEdit',
            name: '页面列表-秒杀编辑',
            component: SecKillEdit,
            hidden: true,
            meta: {menuId: '/siteModule/pageSetting/secKillEdit'}
          },
          {
            path: 'fightGroupEdit',
            name: '页面列表-拼团编辑',
            component: FightGroupEdit,
            hidden: true,
            meta: {menuId: '/siteModule/pageSetting/fightGroupEdit'}
          },
          {
            path: 'couponEdit',
            name: '页面列表-优惠券编辑',
            component: PageCouponEdit,
            hidden: true,
            meta: {menuId: '/siteModule/pageSetting/couponEdit'}
          }
        ]
      },
      {
        path: 'pageAds',
        name: '首页广告',
        component: Layout,
        redirect: '/siteModule/pageAds/pageAdsSetting',
        meta: {menuId: '/siteModule/pageAds', icon: 'el-icon-picture-outline', childrenList: ['/siteModule/pageAds/pageAdsSetting']},
        noDropDown: true,
        children: [
          {
            path: 'pageAdsSetting',
            name: '首页广告-内容',
            component: HomeAds,
            hidden: true,
            meta: {menuId: '/siteModule/pageAds/pageAdsSetting'}
          }
        ]
      }
    ]
  },
  // {
  //   path: '/baseData',
  //   name: '基础数据',
  //   component: App,
  //   meta: {menuId: 'baseData'},
  //   children: [
  //     {
  //       path: 'device',
  //       name: '设备相关设置',
  //       component: Layout,
  //       redirect: '/baseData/device/brandSetting',
  //       meta: {menuId: '/baseData/device', icon: 'el-icon-tickets'},
  //       children: [
  //         {
  //           path: 'brandList',
  //           name: '品牌设置',
  //           component: BrandList,
  //           meta: {menuId: '/baseData/device/brandList', childrenList: ['/baseData/device/brandDetail']} // childrenList 记录需要归属于同一个菜单项的---> 处理菜单选中
  //         },
  //         {
  //           path: 'brandDetail',
  //           name: '品牌设置/新增',
  //           component: BrandSettingDetail,
  //           meta: {menuId: '/baseData/device/brandDetail', parentName: '品牌设置'}, // menuId 是唯一的标识， 也是对应的路由
  //           hidden: true // hidden 为 true 时 表示不再菜单中显示
  //         }
  //       ]
  //     },
  //     {
  //       path: 'area',
  //       name: '地区设置',
  //       component: Layout,
  //       redirect: '/baseData/area/areaSetting',
  //       meta: {menuId: '/baseData/area', childrenList: ['/baseData/area/areaSetting'], icon: 'el-icon-location-outline'}, // 若是第三级不展开 必须传 childrenList
  //       noDropDown: true, // noDropDown 为true 时 表示不展开
  //       children: [
  //         {
  //           path: 'areaSetting',
  //           name: '地区设置详情',
  //           component: AreaSetting,
  //           meta: {menuId: '/baseData/area/areaSetting'}, // menuId 是唯一的标识， 也是对应的路由
  //           hidden: true // hidden 为 true 时 表示不再菜单中显示
  //         }
  //       ]
  //     }
  //   ]
  // },
  // {
  //   path: '/system',
  //   name: '系统',
  //   component: App,
  //   meta: {menuId: 'system'},
  //   children: [
  //     {
  //       path: 'permission',
  //       name: '账号、权限设置',
  //       component: Layout,
  //       redirect: '/system/permission/accountList',
  //       meta: {menuId: '/system/permission', icon: 'el-icon-setting'},
  //       children: [
  //         {
  //           path: 'accountList',
  //           name: '账号管理',
  //           component: AccountList,
  //           meta: {menuId: '/system/permission/accountList', childrenList: ['/system/permission/accountDetail']} // childrenList 记录需要归属于同一个菜单项的---> 处理菜单选中
  //         },
  //         {
  //           path: 'accountDetail',
  //           name: '账号详情',
  //           component: AccountDetail,
  //           meta: {menuId: '/system/permission/accountDetail', parentName: '账号管理'}, // menuId 是唯一的标识， 也是对应的路由
  //           hidden: true
  //         },
  //         {
  //           path: 'permissionList',
  //           name: '权限列表',
  //           component: PermissionList,
  //           meta: {menuId: '/system/permission/permissionList', childrenList: ['/system/permission/permissionDetail']} // childrenList 记录需要归属于同一个菜单项的---> 处理菜单选中
  //         },
  //         {
  //           path: 'permissionDetail',
  //           name: '权限详情',
  //           component: PermissionDetail,
  //           meta: {menuId: '/system/permission/permissionDetail', parentName: '权限管理'}, // menuId 是唯一的标识， 也是对应的路由
  //           hidden: true
  //         }
  //       ]
  //     }
  //   ]
  // },
  {
    path: '/member',
    name: '会员',
    component: App,
    meta: {menuId: 'member'},
    children: [
      {
        path: 'accountManagement',
        name: '会员账号管理',
        component: Layout,
        redirect: '/member/accountManagement/List',
        noDropDown: true,
        meta: {menuId: '/member/accountManagement', children: ['/member/accountManagement/List']},
        children: [
          {
            path: 'List',
            hidden: true,
            name: '会员账号管理列表',
            component: AccountManagementList,
            meta: {menuId: '/member/accountManagement/List'}
          }
        ]
      },
      {
        path: 'setUp',
        name: '会员设置',
        component: Layout,
        noDropDown: true,
        redirect: '/member/setUp/List',
        meta: {menuId: '/member/setUp', children: ['/member/setUp/List']},
        children: [
          {
            path: 'List',
            hidden: true,
            name: '会员设置列表',
            component: SetUpList,
            meta: {menuId: '/member/setUp/List'}
          }
        ]
      },
      {
        path: 'appraise',
        name: '评论管理',
        component: Layout,
        noDropDown: true,
        redirect: '/member/appraise/List',
        meta: {menuId: '/member/appraise', children: ['/member/appraise/List']},
        children: [
          {
            path: 'List',
            hidden: true,
            name: '评论管理列表',
            component: AppraiseManagementList,
            meta: {menuId: '/member/appraise/List'}
          }
        ]
      }
    ]
  },
  {
    path: '/shop',
    name: '店铺',
    component: App,
    meta: {menuId: 'shop'},
    children: [
      {
        path: 'shopManagement',
        name: '店铺管理',
        component: Layout,
        redirect: '/shop/shopManagement/List',
        noDropDown: true,
        meta: {menuId: '/shop/shopManagement', children: ['/shop/shopManagement/List', '/shop/shopManagement/set']},
        children: [
          {
            path: 'List',
            hidden: true,
            name: '店铺管理列表',
            component: ShopManagementList,
            meta: {menuId: '/shop/shopManagement/List'}
          },
          {
            path: 'set',
            hidden: true,
            name: '店铺管理设置',
            component: ShopManagementSet,
            meta: {menuId: '/shop/shopManagement/set'}
          }
        ]
      }
    ]
  }
]

export default new Router({
  // mode: 'history',
  scrollBehavior: () => ({y: 0}),
  routes: constantRouterMap
})
