<!-- 订单详情 - 头部信息 -->
<template>
  <div class="wrap">
    <div class="title">
      <div v-if="data.order.order_status === 0">买家剩余
        <span class="red">
          {{getReaminTime(data.remain_time || 0)}}分钟
        </span>
        付款，超时订单自动关闭
      </div>
      <div class="v-else"></div>
      <div class="buttonWrap">
        <!--<el-button type="primary" size="mini">确认发货</el-button>-->
        <!--<el-button type="primary" size="mini">取消订单</el-button>-->
        <el-button type="primary" size="mini" @click="viewLogisitcs">查看物流</el-button>
        <el-button size="mini" @click="$router.go(-1)">返回</el-button>
      </div>
    </div>
    <div class="content">
      <div class="w33">订单号：{{data.order.order_sn}}</div>
      <div class="w33">订单类型：{{renderOrderType(data.order.order_type)}}</div>
      <div class="w33">订单状态：{{renderOrderStatus(data.order.order_status)}}</div>
    </div>
    <LogisticsInfo v-model="showLogistics" v-if="showLogistics" :id="data.order.order_id"/>
    <!--<Delivery v-model="showDelivery"/>-->
  </div>
</template>

<script>
import LogisticsInfo from './LogisticsInfo'
// import Delivery from './Delivery'

export default {
  name: 'order-detail-top-info-com',
  components: {LogisticsInfo},
  data () {
    return {
      showLogistics: false // 物流弹窗
      // countDownTimer: null, // 倒计时计时器
      // remainTimeStr: '0' // 剩余时间 -- 字符串
      // showDelivery: false // 发货弹窗
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
    getReaminTime (time = 0) {
      return ~~(time / 1000 / 60)
    },
    // 回显订单类型
    renderOrderType (type) {
      switch (type) {
        case 0:
          return '普通订单'
        case 4:
          return '扫码购'
        default:
          return '-'
      }
    },
    // 回显订单状态
    renderOrderStatus (status) {
      switch (status) {
        case 0:
          return '待买家付款'
        case 2:
          return '待卖家发货'
        case 3:
          return '卖家已发货'
        case 4:
          return '交易完成'
        case 5:
          return '评价已完成'
        case 6:
          return '交易关闭'
        case 7:
          return '买家已删除订单'
        default:
          return '-'
      }
    },
    // 查看物流
    async viewLogisitcs () {
      this.showLogistics = true
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import '~@/styles/common.scss';

  .blue {
    color: #409eff;
  }

  .red {
    color: #d73b3c;
  }

  .mr10 {
    margin-right: 10px;
  }

  .w33 {
    width: 33%;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    line-height: 30px;
  }

  .wrap {
    width: 100%;
    border: 1px solid #409eff;
    margin-top: 10px;
  }

  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 10px;
    border-bottom: 1px solid #e5e5e5;
  }

  .buttonWrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .content {
    display: flex;
    flex-wrap: wrap;
    padding: 20px 10px;
  }
</style>
