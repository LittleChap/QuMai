<!-- 图片模块 -->
<template>
    <!--  style 0: 轮播 1:大图平铺 2:横向滑动 3:图文导航 -->
    <!--轮播模块-->
    <swiperBanner v-if="data.style ===0 && data.config && data.config.length"  :listData="data.config"/>
    <!--大图平铺-->
    <tileBanner v-else-if="data.style ===1 && data.config && data.config.length"  :listData="data.config"/>
</template>

<script>
import swiperBanner from './swiperBanner'
import tileBanner from './tileBanner'
export default {
  name: 'index',
  components: {swiperBanner, tileBanner},
  props: {
    data: {
      type: Object,
      default: () => {
      }
    }
  },
  data () {
    return {}
  }
}
</script>

<style scoped>

</style>
