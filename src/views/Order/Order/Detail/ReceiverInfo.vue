<!-- 订单详情 - 收货人信息 -->
<template>
  <div class="wrap">
    <div class="title">收货人信息</div>
    <div class="content">
      <div class="w25">收货人姓名：{{data.order.ship_name}}</div>
      <div class="w25">电话号码：{{data.order.ship_mobile}}</div>
      <div class="w50">详细地址：
        {{data.order.ship_province}} {{data.order.ship_city}} {{data.order.ship_region}} {{data.order.ship_street}}
        {{data.order.ship_address}}</div>

      <div class="w25" v-if="data.order.orderInvoice">
        发票类型：{{renderInvoiceType(data.order.orderInvoice.type)}}
      </div>
      <div class="w25" v-if="data.order.orderInvoice">
        纳税人识别号：{{data.order.orderInvoice.id_no}}
      </div>
      <div class="w50" v-if="data.order.orderInvoice">
        发票抬头：{{data.order.orderInvoice.title}}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'order-detail-receiver-info-com',
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
    renderInvoiceType (type) {
      switch (type) {
        case 0: return '个人'
        case 1: return '公司'
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
  .w25{
    width: 25%;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    line-height: 30px;
  }
  .w50{
    width: 50%;
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
