<!-- 订单详情 - 协商记录 -->
<template>
  <div class="wrap">
    <div class="title">协商记录</div>
    <div class="content">
      <div class="logItem" v-for="(item, index) in data.returnOrderLogList" :key="index">
        <!--<span class="blue">{{$moment(item.create_time).format('YYYY-MM-DD HH:mm:ss')}}</span>-->
        {{item.order_log_content}}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'order-after-log-info-com',
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
