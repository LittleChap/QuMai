<!-- 订单表组件 -->
<template>
  <div>
    <div v-for="(item, index) in data" :key="index" class="mb10 bd">
      <div class="tbSumary">
        <div class="mlr25">订单号：{{item.orderSn}}</div>
        <div class="mlr25">下单时间：{{$moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')}}</div>
        <!--<div class="mlr25">拼团号：111111111111111</div>-->
      </div>
      <div class="tbHeader">
        <div class="cell250">商品名称</div>
        <div class="cell100">规格</div>
        <div class="cell100">单价</div>
        <div class="cell100">数量</div>
        <div class="cell100">店铺名称</div>
        <div class="cell100">会员账号</div>
        <div class="cell100">收件人</div>
        <div class="cell100">实付金额</div>
        <div class="cell100">订单状态</div>
        <div class="cell100">售后进度</div>
        <div class="cell100">操作</div>
      </div>
      <div class="tbBody">
        <div class="leftWrap" >
          <div class="dsf" v-for="(i, idx) in item.itemArray" :key="idx">
            <div class="goodsItem">
              <img class="goodsImg" :src="i.goodsImage" />
              <div class="goodsName">{{i.goodsName}}</div>
            </div>
            <div class="cell100">{{i.specName}}</div>
            <div class="cell100">{{i.unitPrice}}</div>
            <div class="cell100">{{i.num}}</div>
          </div>
        </div>

        <div class="cell100">{{item.shopName}}</div>
        <div class="cell100">{{item.nickname}}</div>
        <div class="cell100">{{item.shipName}}</div>
        <div class="cell100">{{item.price}}</div>
        <div class="cell100">{{renderOrderStatus(item.orderStatus || '-')}}</div>

        <div class="afterStatus">
          <div class="afterStatusItem" v-for="(i, idx) in item.itemArray" :key="idx">
            {{i.returnOrderItemStatus || '-'}}
          </div>
        </div>
        <div class="cell100">
          <!--操作-->
          <router-link class="blue" :to="'/order/order/detail?id=' + item.orderSn">查看</router-link>
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
    renderOrderStatus (num) {
      switch (num) {
        case 0: return '待付款'
        case 2: return '待发货'
        case 3: return '已发货'
        case 4: return '待评价'
        case 5: return '已完成'
        case 6: return '已关闭'
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
    border-bottom: 1px solid #e5e5e5;
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
    width: 550px;
    min-height: 50px;
    box-sizing: border-box;
  }
  .goodsImg{
    width: 80px;
    height: 80px;
    display: block;
    margin: 10px;
  }
  .goodsItem{
    width: 250px;
    height: 100%;
    display: flex;
    align-items: center;
    text-align: center;
    /*justify-content: center;*/
    flex-shrink: 0;
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
