<!--活动图标-->
<template>
    <div class="activeIconWrap" v-if="data.config && data.config.length">
      <div class="item" v-for="(item, index) in data.config" :key="index" @click="toDetail(item)">
        <img :src="item.image" alt="" class="img" />
        <div class="text">{{item.title}}</div>
      </div>
    </div>
</template>

<script>
export default {
  components: {},
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      text: '',
      itemList: []
    }
  },
  methods: {
    // 点击事件
    toDetail (item) {
      // urlType 0:不跳转 1:页面 2:商品 3:链接  4:购物车 5:个人中心
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
  .activeIconWrap {
    background:#fff;
    width:100%;
    /*height: pr(164);*/
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    border-bottom: 1px solid $lineColor;
  }
  .item{
    display: flex;
    flex-direction: column;
    width: 25%;
    justify-content: center;
    align-items: center;
    height: pr(164);
    box-sizing: border-box;
    overflow: hidden;
  }
  .img{
    width: pr(90);
    height: pr(90);
    border-radius: pr(90);
    border: none;
  }
  .text{
    width: 100%;
    line-height: 0.93867rem;
    font-size: 0.512rem;
    color: #333;
    text-align: center;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
</style>
