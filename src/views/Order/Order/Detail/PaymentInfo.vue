<!-- 订单详情 - 收款信息 -->
<template>
  <div class="wrap">
    <div class="title">收款信息</div>
    <div class="content">
      <div class="w20 bdb bdr ">支付方式</div>
      <div class="w20 bdb bdr">支付订单编号</div>
      <div class="w20 bdb bdr">流水号</div>
      <div class="w20 bdb bdr">付款日期</div>
      <div class="w20 bdb">支付金额</div>

      <div class="w100" v-for="(item, index) in data.order.orderPaymentLogList" :key="index">
        <div class="w20 c999 bdr">{{renderPaymentType(item.pay_type)}}</div>
        <div class="w20 c999 bdr">{{data.order.pay_order_sn || '-'}}</div>
        <div class="w20 c999 bdr">{{item.pay_sn || '-'}}</div>
        <div class="w20 c999 bdr">{{$moment(item.pay_time).format('YYYY-MM-DD HH:mm:ss')}}</div>
        <div class="w20 c999">￥{{item.pay_money}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'order-detail-payment-info-com',
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
    renderPaymentType (type) {
      switch (type) {
        case 0: return '微信支付'
        case 1: return '银联支付'
        case 2: return '免支付'
        case 3: return '支付宝支付'
        default: return '-'
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
  .bdr{
    border-right: 1px solid #e5e5e5;
    box-sizing: border-box;
  }
  .bdb{
    border-bottom: 1px solid #e5e5e5;
    box-sizing: border-box;
  }
  .c999 {
    color: #999;
  }
  .w100{
    width: 100%;
    display: flex;
  }
  .w20{
    width: 20%;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    line-height: 40px;
    box-sizing: border-box;
    text-align: center;
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
  }
</style>
