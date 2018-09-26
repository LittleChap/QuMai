<!-- 横向滑动优惠券 -->
<template>
  <div class="boxWrap">
    <div class="itemBox" v-for="(item, index) in listData" :key="index">
      <div class="itemContent">
        <div class="itemTop">
          <div class="leftPart">
            <strong class="o-hidden">{{item.priceDiscount}}</strong>
            <p class="o-hidden">{{item.priceThreshold > 0 ? '满' + item.priceThreshold + '元可用' : '无门槛'}}</p>
          </div>
          <div class="rightPart">
            <h3>{{item.couponName}}</h3>
            <p class="o-hidden" v-if="item.grantMemberPoint">消耗{{item.grantMemberPoint}}积分</p>
          </div>
        </div>
        <p class="itemDate">{{item.useDateType === 1 ? `${$moment(item.useStartTime).format('YYYY.MM.DD')} - ${$moment(item.useStartTime).format('YYYY.MM.DD')}` : `领取后${item.useDay}天有效`}}</p>
      </div>
      <button class="btn disabled" v-if="item.hasOut">已<br>抢<br>光</button>
      <button class="btn disabled" v-else-if="item.isHaveNotUseCoupon || item.isExceedReceive">已<br>领<br>取</button>
      <button class="btn" v-else-if="!item.isExceedReceive && !item.isHaveNotUseCoupon">
        待<br>领<br>取
        <!--<getCoupon text="待<br>领<br>取" :item="item" :memberInfo="memberInfo"/>-->
      </button>
    </div>
    <!--<couponItem v-for="(item, index) in listData" :key="index" :item="item"/>-->
  </div>
</template>

<script>
export default {
  name: 'swiper-coupon',
  props: {
    listData: {
      type: Array,
      default: () => []
    },
    memberInfo: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {}
  },
  methods: {}
}
</script>

<style lang="scss" scoped  rel="stylesheet/scss">
  @import '../assets/styles/index.scss';

  .boxWrap {
    width:100%;
    overflow-x: scroll;
    padding:0 pr(10);
    display: flex;
    box-sizing: border-box;
  }
  /*.boxWrap::-webkit-scrollbar {display:none;}*/
  .itemBox{
    width:pr(430);
    height: pr(188);
    box-sizing: border-box;
    margin:0 pr(10);
    overflow: hidden;
    flex-shrink: 0;
    flex-grow: 0;
    border-radius: pr(10);
    display: flex;
    &:last-of-type {
      width: pr(450);
      padding-right: pr(20);
    }
    .btn{
      flex: 0 0 pr(48);
      width: pr(48);
      height: 100%;
      border-radius: 0 pr(10) pr(10) 0;
      background: #ea7c7b;
      font-size: $normalFontSize;
      line-height: pr(32);
      color: #fff;
      border: none;
      &.disabled {
        background: #999;
      }
    }
  }
  .itemContent{
    flex: 1;
    background: #fff;
    overflow: hidden;
    .itemTop{
      height: pr(150);
      display: flex;
      align-items: center;
    }
    .itemDate{
      padding-left: pr(24);
      line-height: pr(36);
      border-top: 1px dashed $lineColor;
      font-size: $smallFontSize;
      color: $supportTextColor;
    }
  }
  .leftPart{
    height: 100%;
    width: pr(140);
    overflow: hidden;
    text-align: center;
    padding: pr(40) 0 0;
    border-right: 1px dashed $lineColor;
    strong{
      width: 100%;
      margin-left: - pr(16);
      font-size: pr(48);
      line-height: pr(40);
      color: $mainFontColor;
      &:before{
        content: '￥';
        font-size: pr(24);
      }
    }
    p{
      width: 100%;
      margin-top: pr(16);
      font-size: $smallFontSize;
      color: $paragraphColor;
    }
  }
  .rightPart{
    flex: 1;
    /*min-height: pr(100);*/
    overflow: hidden;
    padding: 0 pr(20);
    h3{
      /*height: pr(58);*/
      //width: pr(370);
      line-height: pr(30);
      font-size: $normalFontSize;
      color: $importantInfoAndTitleColor;
      overflow: hidden;
      word-break: break-all;
      white-space: normal;
      text-overflow: ellipsis;
      word-wrap: break-word;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }
    p{
      margin-top: pr(10);
      font-size: $smallFontSize;
      line-height: pr(32);
      color: $supportTextColor;
    }
  }
</style>
