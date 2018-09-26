<!-- 横向滑动商品 -->
<template>
  <div class="main">
    <div class="boxWrap">
      <div class="item" v-for="(item, index) in listData" :key="index" @click="toDetail(item.goodsId)">
        <img :src="item.goodsImage" alt="" class="img"/>
        <div class="text">{{item.goodsName}}</div>
        <div class="price"><span class="f24">￥</span>{{item.price.toFixed(2)}}</div>
      </div>
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
  .main{
    width:100%;
    overflow-x: auto;
    background: #fff;
  }

  .boxWrap {
    width:100%;
    /*overflow-x: auto;*/
    padding:pr(20) pr(10) 0;
    display: flex;
    box-sizing: border-box;
  }
  .boxWrap::-webkit-scrollbar {display:none;}
  .triangle {
    width: 0;
    height: 0;
    border-left: pr(20) solid transparent;
    border-right: pr(20) solid transparent;
    border-bottom: pr(25) solid #fff;
    position: absolute;
    bottom:0;
    right:pr(80);
    z-index: 9;
  }
  .item{
    width:pr(210);
    box-sizing: border-box;
    overflow: hidden;
    flex-shrink: 0;
    flex-grow: 0;
    margin:0 pr(10);
    &:last-of-type {
      width: pr(230);
      padding-right: pr(20);
    }
  }
  .img{
    width: pr(210);
    height: pr(210);
    display: block;
    border-radius: pr(10);
    border:1px solid $lineColor;
  }
  .text{
    margin-top: pr(18);
    width: pr(210);
    line-height: pr(32);
    height: pr(64);
    font-size: pr(26);
    color:#333;
    overflow:hidden;
    text-overflow:ellipsis;
    display:-webkit-box;
    -webkit-box-orient:vertical;
    -webkit-line-clamp:2;
    /*border:1px solid #f00;*/
  }
  .f24{
    font-size: $normalFontSize!important;
  }
  .price{
    width: pr(174);
    line-height: pr(64);
    font-size: $importantFontSize;
    color:$mainFontColor;
  }
</style>
