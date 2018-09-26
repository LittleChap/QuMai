<!-- 平铺图片 -->
<template>
  <div v-if="listData && listData.length">
    <div v-for="(item, i) in listData" :key="i" class="imgWrap" @click="toDetail(item)">
      <img :src="item.image" alt="平铺大图" class="bigImg">
    </div>
  </div>

</template>

<script>
export default {
  name: 'swiper-banner',
  props: {
    listData: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {}
  },
  methods: {
    // 点击事件
    toDetail (item) {
      // // urlType 0:不跳转 1:页面 2:商品 3:链接  4:购物车 5:个人中心
      // if (item.urlType === 0) {
      //   return false
      // }
      // if (item.urlType === 3) {
      //   window.location.href = item.url
      //   return false
      // }
      // let url = ''
      // switch (item.urlType) {
      //   case 0 :
      //     url = ''
      //     break
      //   case 1 :
      //     url = `/pageModule?pageId=${item.url}`
      //     break
      //   case 2 :
      //     url = `/goodsDetail/${item.url}`
      //     break
      //   case 3 :
      //     url = item.url
      //     break
      //   case 4 :
      //     url = '/cartAndPay/cart'
      //     break
      //   case 5 :
      //     url = '/userCenter'
      //     break
      // }
      // this.$router.push(url)
    }
  }
}
</script>

<style lang="scss" scoped  rel="stylesheet/scss">
  @import '../assets/styles/index.scss';
  .imgWrap {
    width:100%;
    position: relative;
  }
  .bigImg{
    width:100%;
    height: auto;
    min-height: pr(200);
    /*height: pr(320);*/
    display: block;
    margin: 0;
    vertical-align: top;
  }

</style>
