<!-- 订单详情 - 订单日志 -->
<template>
  <div class="wrap">
    <div class="title">订单日志</div>
    <div class="content">
      <div class="logItem" v-for="(item, index) in data.order.orderLogList" :key="index">
        <!--<span class="blue">{{$moment(item.create_time).format('YYYY-MM-DD HH:mm:ss')}}</span>-->
        {{item.content}}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'order-detail-log-info-com',
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
    margin-right: 10px;
  }
  .red{
    color: #d73b3c;
  }
  .w33{
    width: 33%;
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
  .logItem {
    padding: 10px;
    width: 100%;
  }
</style>
