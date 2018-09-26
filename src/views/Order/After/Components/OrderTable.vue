<!-- 订单表组件 -->
<template>
  <div>
    <div v-for="(item, index) in data" :key="index" class="bd mb10">
      <div class="tbSumary">
        <div class="mlr25">售后单号：{{item.return_order_code}}</div>
        <div class="mlr25">订单号：{{item.order_sn}}</div>
        <!--<div class="mlr25">下单时间：{{$moment(item.create_time).format('YYYY-MM-DD HH:mm:ss')}}</div>-->
        <!--<div class="mlr25">拼团号：111111111111111</div>-->
      </div>
      <div class="tbHeader">
        <div class="cell250">商品名称</div>
        <div class="cell100">规格</div>
        <div class="cell100">店铺名称</div>
        <div class="cell100">会员账号</div>
        <div class="cell100">订单总额</div>
        <div class="cell100">退款金额</div>
        <div class="cell150">申请时间</div>
        <div class="cell100">售后状态</div>
        <div class="cell100">操作</div>
      </div>
      <div class="tbBody">
        <div class="leftWrap">
          <div class="dsf" v-for="(i, idx) in item.returnOrderItemList" :key="idx">
            <div class="leftItem">
              <img class="goodsImg" :src="i.orderItem.item_image" />
              <div class="goodsName">{{i.orderItem.item_name}}</div>
            </div>
            <div class="cell100">{{i.orderItem.spec_name}}</div>
          </div>
        </div>

        <div class="cell100">{{item.shop_name}}</div>
        <div class="cell100">{{item.member.mobile}}</div>
        <div class="cell100">{{item.orderTotalAmount}}</div>
        <div class="cell100">{{item.apply_money}}</div>
        <div class="cell150">{{$moment(item.create_time).format('YYYY-MM-DD HH:mm:ss')}}</div>

        <div class="afterStatus">
          <div class="afterStatusItem" v-for="(i, idx) in item.returnOrderItemList" :key="idx">
            {{i.return_order_status_text}}
          </div>
        </div>
        <div class="cell100">
          <!--操作-->
          <router-link class="blue" :to="'/order/after/detail?id=' + item.return_order_id">查看</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'order-table-com',
  data () {
    return {}
  },
  props: {
    data: {
      type: Array,
      default: () => []
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
  .bd{
    border: 1px solid #409eff;
  }
  .mb10{
    margin-bottom: 10px;
  }
  .mlr25{
    margin:0 25px;
  }
  .w100{
    width: 100%;
  }
  .dsf{
    display: flex;
    align-items: center;
  }
  .cell250 {
    width: 250px;
    height: 100%;
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .cell100 {
    width: 100px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .cell50 {
    width: 50px;
    height: 100%;
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .cell150 {
    width: 150px;
    height: 100%;
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .tbHeader {
    display: flex;
    align-items: center;
    width: 100%;
    height: 40px;
    background: #f5f5f5;
  }
  .tbSumary{
    display: flex;
    align-items: center;
    width: 100%;
    height: 40px;
    /*border-bottom: 1px solid #e5e5e5;*/
    background: #409eff;
    color: #fff;
  }
  .tbBody{
    display: flex;
    align-items: center;
    width: 100%;
    border-bottom: 1px solid #e5e5e5;
  }
  .leftWrap {
    width: 350px;
    box-sizing: border-box;
  }
  .leftItem {
    width: 250px;
    height: 100%;
    display: flex;
    align-items: center;
    text-align: center;
    flex-shrink: 0;
  }
  .goodsImg{
    width: 100px;
    /*height: auto;*/
    display: block;
    margin: 10px;
    background: #e5e5e5;
  }
  .goodsName{
    text-align: left;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
  }
  .afterStatus{
    width: 100px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-self: stretch;
    flex-shrink: 0;
  }
  .afterStatusItem {
    height: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
