<!-- 平铺商品 -->
<template>
  <div class="boxWrap">
    <div class="item" v-for="(item, index) in listData" :key="index" @click="$goto('/goodsDetail/'+item.goodsId)">
      <img :src="item.goodsImage" alt="" class="item_img"/>
      <div class="item_text">{{item.goodsName}}</div>
      <div class="price"><span class="f24">￥</span>{{item.price.toFixed(2)}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'swiper-product',
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
    // 跳转到详情页
    toDetail (goodsId) {
      // this.$router.push(`/goodsDetail/${goodsId}`)
    }
  }
}
</script>

<style lang="scss" scoped  rel="stylesheet/scss">
  @import '../assets/styles/index.scss';
  .boxWrap{
    background: #fff;
    width: 100%;
    box-sizing: border-box;
    padding: pr(10) pr(15);
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .item{
    width: pr(340);
    margin: pr(8) calc((100% - 340px) / 4);
    box-sizing: border-box;
  }
  .item_img{
    width: pr(340);
    height: pr(340);
    /*border: 1px solid $lineColor;*/
    border-radius: pr(6);
    display: block;
  }
  .item_text{
    width: pr(340);
    font-size: $importantFontSize;
    line-height: pr(40);
    height: pr(80);
    margin: pr(10) 0;
    overflow:hidden;
    text-overflow:ellipsis;
    display:-webkit-box;
    -webkit-box-orient:vertical;
    -webkit-line-clamp:2;
  }
  .f24{
    font-size: $normalFontSize!important;
  }
  .price{
    width: pr(340);
    line-height: pr(44);
    font-size: $titleFontSize;
    color:$mainFontColor;
  }
</style>
