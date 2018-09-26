<!-- 轮播图 -->
<template>
  <!--<swiper :list="list" height="200" v-model="currentWeiperIndex" dots-position="center" :loop="true"-->
          <!--:show-desc-mask="false" :auto="true" dots-class="dotStyle" @on-index-change="swiperIndexChange"> </swiper>-->
  <el-carousel class="previewSwiperWrap" height="200px" arrow="never">
    <el-carousel-item v-for="(item, i) in list" :key="i">
      <!--<h3>{{ item }}</h3>-->
      <img :src="item.img" alt="">
    </el-carousel-item>
  </el-carousel>

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
    return {
      currentWeiperIndex: 0 // swiper 的当前页面
    }
  },
  computed: {
    list () {
      let newList = []
      this.listData.map((item, i) => {
        // urlType 0:不跳转 1:页面 2:商品 3:链接  4:购物车 5:个人中心
        let url = ''
        switch (item.urlType) {
          case 0 :
            url = ''
            break
          case 1 :
            url = `/pageModule?pageId=${item.url}`
            break
          case 2 :
            url = `/goodsDetail/${item.url}`
            break
          case 3 :
            url = item.url
            break
          case 4 :
            url = '/cartAndPay/cart'
            break
          case 5 :
            url = '/userCenter'
            break
        }
        newList.push({img: item.image, url: url, title: `title${i}`})
      })
      return newList
    }
  },
  methods: {
    // swiper 小按钮切换事件
    swiperIndexChange (index) {
      this.currentWeiperIndex = index
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .previewSwiperWrap{

  }

</style>
<style lang="scss" rel="stylesheet/scss">
  .previewSwiperWrap{
    .el-carousel__button{
      display: inline-block;
      vertical-align: middle;
      width: 6px;
      height: 6px;
      border-radius: 3px;
      background-color: #d0cdd1;
      opacity: 1 !important;
    }
    .el-carousel__indicator.is-active{
      .el-carousel__button{
        background-color: #d73b3c!important;
      }
    }

  }

</style>
