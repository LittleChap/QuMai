<template>
  <div class="item-wrap" @click.stop.prevent="toDetail">
    <div class="img-box">
      <img class="item-img" :src="itemData.goodsImage" alt="">
      <div class="timeBox" v-if="btnStatus=== 1">
        活动即将开始
        {{timeInfo.hour}}:{{timeInfo.min}}:{{timeInfo.sec}}
      </div>
      <div class="timeBox disabled" v-else-if="btnStatus=== 3">活动已结束</div>
      <div class="timeBox disabled" v-else-if="btnStatus=== 4">已售罄</div>
    </div>
    <div class="item-con" >
      <h3><p class="labelBox" v-if="itemData.activityTitleArray && itemData.activityTitleArray.length">
          <span v-for="(item, i) in itemData.activityTitleArray" :key="i" class="v-label">{{item.promotionTitle}}</span>
        </p>{{itemData.goodsName}}</h3>
      <p class="price-main" v-format-price-num="itemData.activityPriceMin"></p>
      <p class="price-box flexBox">
        <span class="price-line" v-format-price="itemData.price || 0"></span>
        <span class="num">已团{{itemData.activitySaleNum || 0}}件</span>
      </p>
      <div class="flexBox btnBox">
        <span class="leftPart">
          {{itemData.groupMemberNum}} 人团
        </span>
        <div class="v-button btn">
          <span v-if="btnStatus===1 || btnStatus===2">去开团 <i class="icon-details-left"></i></span>
          <!--<span v-else-if="btnStatus===2">去开团 <i class="icon-details-left"></i></span>-->
          <!--<span v-else-if="btnStatus===3">拼团详情</span>-->
          <span v-else>拼团详情</span>
        </div>
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
        console.log('结束', this.itemData.activityStartTime, new Date().getTime(), this.itemData.activityEndTime)
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
      // this.$router.push(`/fightGroupDetail/${this.itemData.goodsId}`)
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
    position: relative;
    width: pr(252);
    height: pr(252);
    margin-right: pr(40);
    border-radius: pr(4);
    /*border: 1px solid $lineColor;*/
    overflow: hidden;
    .item-img{
      width: 100%;
      height: 100%;
    }
    .timeBox{
      position: absolute;
      bottom: 0;
      left: 0;
      /*height: pr(38);*/
      line-height: pr(38);
      padding: 0 pr(10);
      background: linear-gradient(90deg, rgb(255,153,126), rgb(254,68,84));
      font-size: pr(18);
      color: #fff;
      border-radius: 0 pr(6) pr(6) 0;
      &.disabled{
        background: rgba(0, 0, 0, 0.5);
      }
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
  .btnBox{
    margin-top: pr(20);
    justify-content: space-between;
    align-items: center;
    .btn{
      display: flex;
      align-items: center;
      justify-content: center;
      width: pr(170);
      height: pr(62);
      border-radius: pr(20) pr(30) pr(30) 0;
      /*line-height: pr(62);*/
      i{
        font-size: pr(20);
      }
    }
    .leftPart{
      line-height: pr(62);
      padding-left: pr(54);
      background: url("./assets/icon-group.png") no-repeat left center;
      background-size: pr(36) pr(30);
      font-size: $normalFontSize;
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
