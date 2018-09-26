<!-- 订单详情 - 金额信息 -->
<template>
  <div class="wrap">
    <div class="title">应付订单总额：¥{{data.needPay}}</div>
    <div class="content">
      <div class="w25">商品总额：¥{{data.order.price_original}}</div>
      <div class="w25" v-if="data.order.order_type !== 4">运费：¥{{data.order.shipping_pay}}</div>
      <div class="w25" v-if="data.order.order_type !== 4">优惠券：¥{{data.order.price_coupon}}</div>
      <!--<div class="w25">积分抵扣：¥{{data.order.shipping_pay}}没字段</div>-->
      <!--<div class="w25">满减优惠：¥{{data.order.shipping_pay}}没字段</div>-->
      <div class="w25" v-if="data.order.order_type !== 4">
        会员优惠：¥{{data.order.price_discount}}
        <span v-if="data.order.orderItemList && data.order.orderItemList.length">
          ({{renderDiscount(data.order.orderItemList[0].discount)}}折)
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'order-detail-amount-info-com',
  components: {},
  data () {
    return {
    }
  },
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  created () {
  },
  methods: {
    renderDiscount (num = 0) {
      let n = +num * 10
      if (n >= 10 || n <= 0) {
        return 0
      } else {
        return n.toFixed(1)
      }
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import '~@/styles/common.scss';
  .blue{
    color: #409eff;
  }
  .red{
    color: #d73b3c;
  }
  .w25{
    width: 25%;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    line-height: 30px;
  }
  .wrap{
    width: 100%;
    border: 1px solid #409eff;
    margin-top: 10px;
  }
  .title {
    line-height: 40px;
    padding-left: 10px;
    border-bottom: 1px solid #e5e5e5;
  }
  .content{
    display: flex;
    flex-wrap: wrap;
    padding: 20px 10px;
  }
</style>
