<!-- 订单详情 - 订单详情 -->
<template>
  <div class="wrap">
    <div class="title">订单详情</div>
    <div class="content">
      <div class="w25">会员账号：{{data.order.username || '-'}}</div>
      <div class="w25">会员昵称：{{data.order.nickname || '-'}}</div>
      <div class="w25">可得积分：{{data.order.point }}</div>
      <!--<div class="w25 blue">分润总额：¥6.00(没有字段)</div>-->

      <div class="w25">下单时间：{{$moment(data.order.create_time).format('YYYY-MM-DD HH:mm:ss')}}</div>
      <div class="w25" v-if="data.order.order_type !== 4">成交时间：{{$moment(data.order.pay_time).format('YYYY-MM-DD HH:mm:ss')}}</div>
      <div class="w25" v-if="data.order.order_type !== 4 && data.order.deliver_time">发货时间：{{$moment(data.order.deliver_time).format('YYYY-MM-DD HH:mm:ss')}}</div>
      <div class="w25" v-if="data.order.complate_time">完成时间：{{$moment(data.order.complate_time).format('YYYY-MM-DD HH:mm:ss')}}</div>

      <div class="w100">用户留言：{{data.order.member_remark || '-'}}</div>
      <div class="w100" v-if="data.order.order_type !== 4">卖家备注：{{data.order.shop_remark || '-'}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'order-detail-detail-info-com',
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
  .w100 {
    width: 100%;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    line-height: 30px;
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
