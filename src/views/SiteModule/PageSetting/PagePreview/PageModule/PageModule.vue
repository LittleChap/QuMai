<!--页面-->
<template>
  <div class="previewWrap">
    <div class="topBar">{{pageTitle}}</div>

    <div id="scrollwrap" ref="mainWrap">
      <div v-for="(module, index) in pageContentList" :key="index">
        <!-- moduleType  1:图片编辑 2:商品编辑 3:导航编辑 4:拼团编辑 5:秒杀编辑-->
        <!-- style 0: 轮播 1:大图平铺 2:横向滑动 3:图文导航-->
        <!-- 图片模块 -->
        <BannerModule v-if="module.moduleType === 1" :data="module"/>
        <!-- 商品模块 -->
        <ProductModule v-if="module.moduleType === 2" :data="module" class="moduleBox"/>
        <!-- 导航模块 -->
        <NavigationModule v-if="module.moduleType === 3" :data="module" class="moduleBox"/>
        <!-- 拼团模块 -->
        <FightGroupModule v-if="module.moduleType === 4" :data="module" class="moduleBox"/>
        <!-- 秒杀模块 -->
        <SecKillModule v-if="module.moduleType === 5" :data="module" class="moduleBox"/>
        <!-- 优惠券模块 -->
        <CouponModule v-if="module.moduleType === 6" :data="module" class="moduleBox" :bgColor="bgColor"/>
      </div>
      <div class="tipText" v-if="mainLoading">加载中...</div>
      <div class="tipText" v-if="!mainLoading && !pageContentList.length">
        <img src="./assets/empty.png"/>
        <p>该页面暂无数据</p>
      </div>
    </div>
  </div>
</template>

<script>
import BannerModule from './BannerModule/index'
import NavigationModule from './NavigationModule/index'
import ProductModule from './ProductModule/index'
import SecKillModule from './SecKillModule/index'
import FightGroupModule from './FightGroupModule/index'
import CouponModule from './CouponModule/index'

export default {
  components: {NavigationModule, BannerModule, ProductModule, SecKillModule, FightGroupModule, CouponModule},
  props: {
    url: { // 请求参数
      type: String,
      default: 'pages/preview.do'
    },
    pageReqInfo: { // 请求数据
      type: Object,
      default: () => {}
    },
    pageInfo: { // 填写的数据
      type: Object,
      default: null
    }
  },
  data () {
    return {
      mainLoading: false,
      bgColor: '#f5f5f5',
      pageContentList: [], // 首页的全部数据
      pageTitle: '观前街1号'
    }
  },
  created () {
    this.getList()
  },
  mounted () {
    if (this.pageInfo) {
      this.bgColor = this.pageInfo.color || '#f5f5f5'
      this.$nextTick(() => {
        this.$refs.mainWrap.style.background = this.bgColor
      })
      this.pageTitle = this.pageInfo.name || '观前街1号'
    }
  },
  methods: {
    // 获得数据
    async getList () {
      this.mainLoading = true
      let res = await this.$post(this.url, this.pageReqInfo)
      this.mainLoading = false
      if (parseInt(res.code) === 1) {
        this.pageContentList = res.data.pageModuleContentList.filter(item => {
          if (item.config && item.config.length) {
            item.config = item.config.filter(configItem => {
              // 过滤活动停止的， 商品下架的 和 结束的
              // <!-- moduleType  1:图片编辑 2:商品编辑 3:导航编辑 4:拼团编辑 5:秒杀编辑 6：优惠券-->
              return ((item.moduleType === 5 || item.moduleType === 4 || item.moduleType === 6) && !configItem.isStop && !configItem.isRemove) || (item.moduleType === 2 && configItem.isPutaway === 1) || item.moduleType === 1 || item.moduleType === 3
            })
          }
          return item.config && item.config.length
        })
        // 页面设置
        if (!this.pageInfo) {
          this.bgColor = res.data.pages.color || '#f5f5f5'
          this.$nextTick(() => {
            this.$refs.mainWrap.style.background = this.bgColor
          })
          this.pageTitle = res.data.pages.pageName || '观前街1号'
        }
      } else {
        // this.$toast(res.message)
      }
    }
  }
}
</script>

<style lang="scss" scoped rel="stylesheet/scss">
  @import './assets/styles/index.scss';
  ::-webkit-scrollbar-thumb {
    background-color: #bbb;
    border-radius: 2px;
  } /* 滑块颜色 */
  .previewWrap{
    width: 377px;
    height: 667px;
    border: 1px solid #ccc;
    box-sizing: border-box;
  }
  .topBar{
    box-sizing: border-box;
    height: pr(128);
    width: 100%;
    padding: pr(60) pr(100) 0 pr(130);
    background: #1c1c20 url("./assets/topBar.png") no-repeat top center ;
    background-size: pr(750) pr(128);
    color: #fff;
    text-align: center;
    font-size: pr(36);
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  #scrollwrap{
    width: 375px;
    height: 600px;
    overflow-y: auto;
  }
  .tipText{
    margin: pr(80) 0 ;
    text-align: center;
    line-height: pr(42);
    font-size: $importantFontSize;
    color: $importantInfoAndTitleColor;
    img {
      width: pr(400);
      height: pr(400);
    }
  }
  .moduleBox{
    margin-bottom: pr(10);
  }
</style>
