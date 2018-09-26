<!-- 平铺商品 -->
<template>
  <div class="boxWrap">
    <div class="itemBox" v-for="(item, index) in listData" :key="index">
      <div class="leftPart" ref="leftPart">
        <strong class="o-hidden">{{item.priceDiscount}}</strong>
        <p class="o-hidden">{{item.priceThreshold > 0 ? '满' + item.priceThreshold + '元可用' : '无门槛'}}</p>
        <i class="triangle rightTop" ref="triangle"></i>
        <i class="triangle rightBottom" ref="triangle"></i>
      </div>
      <div class="rightPart">
        <h3>{{item.couponName}}</h3>
        <div class="infoBox">
          <div class="infoContent">
            <!--<p class="o-hidden">***店铺商品使用店铺商品使用店铺商品使用</p>-->
            <p class="o-hidden" v-if="item.grantMemberPoint">消耗{{item.grantMemberPoint}}积分</p>
            <p>{{item.useDateType === 1 ? `${$moment(item.useStartTime).format('YYYY.MM.DD')} - ${$moment(item.useStartTime).format('YYYY.MM.DD')}` : `领取后${item.useDay}天有效`}}</p>
          </div>
          <div class="btnBox">
            <button class="btn disabled" v-if="item.hasOut">已抢光</button>
            <button class="btn disabled" v-else-if="item.isHaveNotUseCoupon || item.isExceedReceive">已领取</button>
            <button class="btn" v-else-if="!item.isExceedReceive && !item.isHaveNotUseCoupon">
              待领取
            </button>
          </div>
        </div>
        <i class="triangle leftTop" ref="triangle"></i>
        <i class="triangle leftBottom" ref="triangle"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tile-coupon',
  props: {
    listData: {
      type: Array,
      default: () => []
    },
    bgColor: {
      type: String,
      default: '#f5f5f5'
    },
    memberInfo: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {}
  },
  mounted () {
    // 修改三角形的颜色
    this.$refs.triangle.map(item => {
      item.style.borderColor = this.bgColor
    })
  },
  methods: {}
}
</script>

<style lang="scss" scoped  rel="stylesheet/scss">
  @import '../assets/styles/index.scss';
  .boxWrap{
    width: 100%;
    box-sizing: border-box;
    padding: 0 pr(24);
  }
  .itemBox{
    /*position: relative;*/
    height: pr(200);
    width: 100%;
    margin-bottom: pr(10);
    display: flex;
    align-items: center;
    justify-content: flex-start;
    border-radius: pr(16);
    overflow: hidden;
    /*&.active{
      .leftPart{
        background: linear-gradient(-72deg, #f17171, #ff9d67);
      }
    }*/
    .leftPart{
      position: relative;
      height: 100%;
      width: pr(190);
      background: linear-gradient(-72deg, #f17171, #ff9d67);
      color: #fff;
      overflow: hidden;
      text-align: center;
      padding: pr(60) 0 0;
      strong{
        width: 100%;
        margin-left: - pr(16);
        font-size: pr(80);
        line-height: pr(40);
        &:before{
          content: '￥';
          font-size: pr(38);
        }
      }
      p{
        width: 100%;
        margin-top: pr(20);
        font-size: $normalFontSize;
      }
    }
    .rightPart{
      position: relative;
      flex: 1;
      height: 100%;
      background: #fff;
      font-size: $normalFontSize;
      padding: pr(24) pr(20) 0;
      overflow: hidden;
      h3{
        height: pr(78);
        //width: pr(370);
        line-height: pr(40);
        font-size: $importantFontSize;
        color: $importantInfoAndTitleColor;
        overflow: hidden;
        word-break: break-all;
        white-space: normal;
        text-overflow: ellipsis;
        word-wrap: break-word;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .infoBox{
        height: pr(60);
        margin-top: pr(16);
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
      }
      .infoContent{
        flex: 1;
        overflow: hidden;
      }
      p {
        font-size: $smallFontSize;
        line-height: pr(30);
        color: $supportTextColor;
      }
      .btnBox{
        flex: 0 0 pr(146);
        .btn{
          height: pr(58);
          line-height: pr(56);
          width: pr(142);
          margin-top: pr(10);
          border-radius: pr(8);
          background: #fff;
          border: 1px solid $buttonColor;
          color: $buttonColor;
          font-size: $normalFontSize;
          &.disabled{
            border-color: $supportTextColor;
            color: $supportTextColor;
          }
        }
      }
    }

    /* 三角形切角 */
    .triangle{
      position: absolute;
      display: block;
      content: ' ';
      width: 0;
      height: 0;
      &.rightTop{
        top: 0;
        right: 0;
        border-left: pr(20) solid transparent !important;
        border-top: pr(20) solid $pageDefaultColor;
      }
      &.rightBottom{
        bottom: 0;
        right: 0;
        border-left: pr(20) solid transparent !important;
        border-bottom: pr(20) solid $pageDefaultColor;
      }
      &.leftTop{
        top: 0;
        left:0;
        border-right: pr(20) solid transparent !important;
        border-top: pr(20) solid $pageDefaultColor;
      }
      &.leftBottom{
        bottom: 0;
        left:0;
        border-right: pr(20) solid transparent !important;
        border-bottom: pr(20) solid $pageDefaultColor;
      }
    }
  }
</style>
