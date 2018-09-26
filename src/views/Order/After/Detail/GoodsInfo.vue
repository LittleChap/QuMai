<!-- 订单详情 - 商品信息 -->
<template>
  <div class="wrap">
    <div class="title">商品信息</div>
    <!--表头-->
    <div class="header">
      <div class="w60">
        <div class="goods">
          <div class="w66 bdr">商品信息</div>
          <div class="w16 bdr">单价</div>
          <div class="w16 bdr">数量</div>
        </div>
      </div>
      <div class="w10 bdr">优惠</div>
      <div class="w10 bdr">实付金额</div>
      <div class="w10 bdr">售后状态</div>
      <div class="w10">退款数量</div>
    </div>
    <!--表体-->
    <div class="content" v-for="(item, index) in data.returnOrder.returnOrderItemList" :key="index">
      <div class="w60">
        <div class="goods">
          <img :src="item.orderItem.item_image" alt="" class="img">
          <div class="w50">
            <div class="goodsName">{{item.orderItem.item_name}}</div>
            <div class="goodsAttr">{{item.orderItem.spec_name}}</div>
          </div>
          <div class="w16">¥{{item.orderItem.price_unit}}</div>
          <div class="w16">{{item.orderItem.num}}</div>
        </div>
      </div>
      <div class="w10">¥{{item.orderItem.price_discount}}</div>
      <div class="w10">¥{{item.orderItem.price_cost}}</div>
      <div class="w10 blue">{{item.orderItem.return_order_status_str || ''}}</div>
      <div class="w10">{{item.apply_num}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'order-detail-goods-info-com',
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
  .bdr{
    border-right: 1px solid #e5e5e5;
  }
  .bdb{
    border-bottom: 1px solid #e5e5e5;
  }
  .c999 {
    color: #999;
  }
  .w10{
    width: 10%;
    /*height: 60px;*/
    height: 100%;
    min-width: 50px;
    text-align: center;
    box-sizing: border-box;
    padding: 0 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .w16{
    width: 16.666667%;
    height: 60px;
    padding: 0 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
  }
  .w50{
    width: 50%;
    padding: 0 10px;
  }
  .w60{
    width: 60%;
  }
  .w66{
    width: 66.666667%;
    height: 60px;
    min-width: 200px;
    padding: 0 10px;
    display: flex;
    align-items: center;
    justify-content: center;
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
  .header{
    display: flex;
    align-items: center;
    border-bottom: 1px solid #e5e5e5;
  }
  .content{
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #e5e5e5;
  }
  .goods{
    width: 100%;
    display: flex;
    align-items: center;
  }
  .goods:not(:last-child){
    border-bottom: 1px solid #e5e5e5;
  }
  .goodsName{
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp:1;
    overflow: hidden;
    margin-bottom: 5px;
  }
  .goodsAttr{
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp:2;
    overflow: hidden;
    color: #999;
  }
  .img{
    width: 16.666667%;
    height: auto;
    padding-left: 10px;
    display: block;
    box-sizing: border-box;
  }
</style>
