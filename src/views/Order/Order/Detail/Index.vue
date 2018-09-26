<!-- 订单详情 -->
<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/order/order/list' }">订单</el-breadcrumb-item>
      <el-breadcrumb-item>订单详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="v-wrap listWrap"  v-loading="mainLoading">
      <div>
        <h3 class="v-title">订单详情</h3>
      </div>
      <TopInfo :data="detail" />
      <DetailInfo :data="detail" />
      <AmountInfo :data="detail" />
      <GoodsInfo :data="detail" v-if="detail.order.order_type !== 4" />
      <ReceiverInfo :data="detail" v-if="detail.order.order_type !== 4" />
      <PaymentInfo :data="detail" />
      <LogInfo :data="detail" />
    </div>
  </div>
</template>

<script>
import AmountInfo from './AmountInfo'
import DetailInfo from './DetailInfo'
import GoodsInfo from './GoodsInfo'
import LogInfo from './LogInfo'
import PaymentInfo from './PaymentInfo'
import ReceiverInfo from './ReceiverInfo'
import TopInfo from './TopInfo'
export default {
  name: 'order-detail',
  components: {AmountInfo, DetailInfo, GoodsInfo, LogInfo, PaymentInfo, ReceiverInfo, TopInfo},
  data () {
    return {
      id: '', // 订单号
      detail: {
        order: {
          orderInvoice: {},
          orderItemList: [],
          orderLogList: [],
          orderPaymentLogList: []
        }
      },
      mainLoading: false,
      showLogistics: false // 显示物流弹窗
    }
  },
  created () {
    this.getDetail()
  },
  methods: {
    async getDetail () {
      let sn = this.$route.query.id || ''
      let url = 'order/goEdit.do'
      let body = {order_sn: sn}
      let res = await this.$post(url, body)
      if (+res.code === 1) {
        this.detail = res.data
      } else {
        this.$message.error(res.message)
      }
      console.log('控制台打印:', res)
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import '~@/styles/common.scss';
</style>
