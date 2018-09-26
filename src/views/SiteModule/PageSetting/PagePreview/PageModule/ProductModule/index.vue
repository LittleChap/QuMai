<!-- 图片模块 -->
<template>
    <!--  style 0: 轮播 1:大图平铺 2:横向滑动 3:图文导航 -->
    <!--轮播模块-->
    <swiperProduct v-if="data.style ===2 && listData.length"  :listData="listData"/>
    <!--大图平铺-->
    <tileProduct v-else-if="data.style ===1 && listData.length"  :listData="listData"/>
</template>

<script>
import swiperProduct from './swiperProduct'
import tileProduct from './tileProduct'
export default {
  name: 'index',
  components: {swiperProduct, tileProduct},
  props: {
    data: {
      type: Object,
      default: () => {
      }
    }
  },
  computed: {
    listData () {
      // return this.data.config.filter(item => {
      //   return item.isPutaway === 1
      // })
      return this.data.config
    }
  }
}
</script>

<style scoped>

</style>
