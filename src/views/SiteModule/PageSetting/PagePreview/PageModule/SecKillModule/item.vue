<template>
  <div class="item-wrap" @click.stop="toDetail">
    <div class="img-box">
      <img class="item-img" :src="itemData.goodsImage" alt="">
    </div>
    <div class="item-con" >
      <h3><p class="labelBox" v-if="itemData.activityTitleArray && itemData.activityTitleArray.length">
        <span v-for="(item, i) in itemData.activityTitleArray" :key="i" class="v-label">{{item.promotionTitle}}</span>
      </p>{{itemData.goodsName}}</h3>
      <p class="price-main" v-format-price-num="itemData.activityPriceMin"></p>
      <p class="price-box flexBox">
        <span class="price-line" v-format-price="itemData.price || 0"></span>
        <span class="num">销量：{{itemData.activitySaleNum || 0}}</span>
      </p>
      <div class="btn" :class="{'disabled': btnStatus===3 || btnStatus===4 || btnStatus===5}">
        <span v-if="btnStatus===1">秒杀即将开始</span>
        <span v-else-if="btnStatus===2">秒杀中</span>
        <span v-else-if="btnStatus===3">秒杀已结束</span>
        <span v-else>已抢光</span>
        <div class="timeBox" v-if="btnStatus=== 1 || btnStatus===2"><span>{{timeInfo.hour}}</span><span>{{timeInfo.min}}</span><span>{{timeInfo.sec}}</span></div>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  name: 'item',
  props: {
    itemData: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      btnText: '秒杀即将开始',
      btnStatus: 1, // 1 秒杀即将开始 2 秒杀中 3 秒杀已结束 4 已抢光
      timeInfo: {
        hour: '00',
        min: '00',
        sec: '00'
      },
      timer: null
    }
  },
  mounted () {
    this.getTime()
  },
  methods: {
    getTime () {
      this.getTimeStatus()
      this.timer = setInterval(() => {
        this.getTimeStatus()
      }, 1000)
    },
    getTimeStatus () {
      let time = 0
      if (this.itemData.activityStartTime > new Date().getTime()) {
        this.btnStatus = 1
        time = this.itemData.activityStartTime - new Date().getTime()
      } else if (new Date().getTime() <= this.itemData.activityEndTime) {
        this.btnStatus = 2
        time = this.itemData.activityEndTime - new Date().getTime()
      } else {
        this.btnStatus = 3
        clearInterval(this.timer)
        return false
      }
      if (this.itemData.goodsStore <= 0) {
        this.btnStatus = 4
        clearInterval(this.timer)
        return false
      }
      this.timeInfo.hour = Math.floor(time / 1000 / 60 / 60)
      this.timeInfo.min = Math.floor(time / 60 / 1000) % 60
      this.timeInfo.sec = Math.floor(time / 1000) % 60
      this.timeInfo.hour = this.timeInfo.hour > 9 ? this.timeInfo.hour : '0' + this.timeInfo.hour
      this.timeInfo.min = this.timeInfo.min > 9 ? this.timeInfo.min : '0' + this.timeInfo.min
      this.timeInfo.sec = this.timeInfo.sec > 9 ? this.timeInfo.sec : '0' + this.timeInfo.sec
    },
    toDetail () {
      // this.$router.push(`/goodsDetail/${this.itemData.goodsId}`)
    }
  },
  beforeDestroy () {
    clearInterval(this.timer)
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import '../assets/styles/index.scss';
  .item-wrap{
    display: flex;
    padding: pr(24);
    border-bottom: 1px solid $lineColor;
    background: $footerBackgroundColor;
    font-size: $importantFontSize;
    align-items: center;
    /*justify-content: space-between;*/
  }
  .img-box{
    width: pr(252);
    height: pr(252);
    margin-right: pr(40);
    border-radius: 4px;
    /*border: 1px solid $lineColor;*/
    overflow: hidden;
    .item-img{
      width: 100%;
      height: 100%;
    }
  }
  .item-con{
    flex: 1;
    h3 {
      height: pr(78);
      //width: pr(370);
      line-height: pr(40);
      font-size: $headerTextFontSize;
      font-weight: normal;
      overflow: hidden;
      word-break: break-all;
      white-space: normal;
      text-overflow: ellipsis;
      word-wrap: break-word;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .labelBox{
      margin: 0;
      display: inline-block;
      span {
        margin-right: pr(10);
      }
    }
    p{
      margin-top: pr(22);
    }
    .price-box{
      align-items: center;
      justify-content: space-between;
      .num{
        font-size: $normalFontSize;
        color: $importantInfoAndTitleColor;
      }
    }
  }
  .btn{
    display: inline-block;
    /*display: flex;*/
    /*align-items: center;*/
    /*justify-content: flex-start;*/
    padding: 0 pr(20);
    width: auto;
    height: pr(62);
    line-height: pr(62);
    border-radius: pr(20) pr(30) pr(30) 0;
    background: linear-gradient(90deg, rgb(255,153,126), rgb(254,68,84));
    /*line-height: pr(62);*/
    margin-top: pr(20);
    color: #fff;
    span{
      line-height: pr(62);
      font-size: $normalFontSize;
    }
    &.disabled{
      background: #ccc;
    }
  }
  .timeBox{
    display: inline-block;
    margin-left: pr(5);
    /*font-style: normal;*/
    /*align-items: flex-start;*/
    span{
      display: inline-block;
      height: pr(32);
      min-width: pr(32);
      line-height: pr(32);
      margin-left: pr(10);
      padding: 0 pr(4);
      background: #fff;
      border-radius: 2px;
      font-size: $smallFontSize;
      color: $importantInfoAndTitleColor;
    }
  }
  .price-main {
    color: $mainFontColor;
    font-size: $titleFontSize;
    &:before {
      content: '￥';
      font-size: $normalFontSize;
    }
  }
  .price-line {
    font-size: $normalFontSize;
    text-decoration: line-through;
    color: $paragraphColor;
    line-height: pr(20);
  }

</style>
