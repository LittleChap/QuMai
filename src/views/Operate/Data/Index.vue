<!-- 问卷调查列表 -->
<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>运营</el-breadcrumb-item>
      <el-breadcrumb-item>运营数据统计</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="v-wrap">
      <h3 class="v-title">运营数据统计</h3>
      <div class="mainWrap">
        <div class="headerWrap">
          <!--流量统计 开始-->
          <div class="mr30 fb">流量统计</div>
          <div class="mr30">更新时间：{{$moment().format('YYYY-MM-DD HH:mm:ss')}}</div>
          <el-select v-model="flow.shopId" placeholder="请选择" class="mr30">
            <el-option key="0" label="商城(含全部店铺)" :value="0"></el-option>
            <el-option v-for="item in shops" :key="item.shop_id" :label="item.shop_name" :value="item.shop_id"></el-option>
          </el-select>
          <DatePicker :params="flow" />
          <el-button type="primary" size="mini" class="btn" @click="getFlowDetail">查询</el-button>
        </div>
        <div class="contentWrap">
          <Module :data="flowData" title="访客数" titleField="vistorNum" rateFiled="vistorRate" />
          <Module :data="flowData" title="人均停留时长(没数据)" titleField="vistorNum" rateFiled="vistorRate" unit="s" />
          <Module :data="flowData" title="浏览量" titleField="scanNum" rateFiled="scanRate" />
          <Module :data="flowData" title="会员数" titleField="memberCount" rateFiled="memberRate" />
          <Module :data="flowData" title="新增会员数" titleField="newMemberCount" rateFiled="newMemberRate" />
        </div>
        <!--流量统计 结束-->

        <!--交易统计 开始-->
        <div class="headerWrap">
          <div class="mr30 fb">流量统计</div>
          <div class="mr30">更新时间：{{$moment().format('YYYY-MM-DD HH:mm:ss')}}</div>
          <el-select v-model="transaction.shopId" placeholder="请选择" class="mr30">
            <el-option key="0" label="商城(含全部店铺)" :value="0"></el-option>
            <el-option v-for="item in shops" :key="item.shop_id" :label="item.shop_name" :value="item.shop_id"></el-option>
          </el-select>
          <DatePicker :params="transaction" />
          <el-button type="primary" size="mini" class="btn" @click="getTransactionDetail">查询</el-button>
        </div>
        <div class="contentWrap">
          <Module :data="transactionData" title="下单金额" titleField="orderMoney" rateFiled="orderMoneyRate" unit="元" />
          <Module :data="transactionData" title="付款金额" titleField="orderPayMoney" rateFiled="orderPayMoneyRate" unit="元" />

          <Module :data="transactionData" title="微信付款金额(没数据)" titleField="orderMoney" rateFiled="orderMoneyRate" unit="元" />
          <Module :data="transactionData" title="礼品卡付款金额(没数据)" titleField="orderMoney" rateFiled="orderMoneyRate" unit="元" />
          <Module :data="transactionData" title="电子钱包付款金额(没数据)" titleField="orderMoney" rateFiled="orderMoneyRate" unit="元" />

          <Module :data="transactionData" title="客单价" titleField="avgSalesPrice" rateFiled="avgSalesPriceRate" unit="元" />
          <Module :data="transactionData" title="付款订单数" titleField="hadPayOrderCount" rateFiled="hadPayOrderRate" unit="元" />
          <Module :data="transactionData" title="商品销售数量" titleField="sellerGoodsCount" rateFiled="sellerGoodsRate" unit="件" />

          <Module :data="transactionData" title="退款金额(没数据)" titleField="orderMoney" rateFiled="orderMoneyRate" unit="元" />
          <Module :data="transactionData" title="退款件数(没数据)" titleField="orderMoney" rateFiled="orderMoneyRate" unit="件" />

          <Module :data="transactionData" title="下单转化率" titleField="cover" rateFiled="coverRate" unit="%" />
          <Module :data="transactionData" title="付款转化率" titleField="payCover" rateFiled="payCoverRate" unit="%" />
          <Module :data="transactionData" title="复购率" titleField="repeat" rateFiled="repeatRate" unit="%" />

          <Module :data="transactionData" title="微信扫码支付金额(没数据)" titleField="repeat" rateFiled="repeatRate" unit="元" />
          <Module :data="transactionData" title="支付宝扫码支付金额(没数据)" titleField="repeat" rateFiled="repeatRate" unit="元" />
        </div>
        <!--交易统计 结束-->
      </div>
    </div>
  </div>
</template>

<script>
import DatePicker from './DatePicker'
import Module from './Module'

export default {
  name: 'operate-data',
  components: {DatePicker, Module},
  data () {
    return {
      shops: [], // 店铺列表
      flow: {
        dateType: 'date', // 日期类型(日 周 月)
        startTime: this.$moment().format('YYYY-MM-DD 00:00:00'), // 开始时间
        endTime: this.$moment().format('YYYY-MM-DD 23:59:59'), // 结束时间
        shopId: 0 // 店铺 id
      },
      flowData: {}, // 流量数据
      transaction: {
        dateType: 'date', // 日期类型(日 周 月)
        startTime: this.$moment().format('YYYY-MM-DD 00:00:00'), // 开始时间
        endTime: this.$moment().format('YYYY-MM-DD 23:59:59'), // 结束时间
        shopId: 0 // 店铺 id
      },
      transactionData: {} // 交易数据
    }
  },
  created () {
    this.getShopList()
    this.getFlowDetail()
    this.getTransactionDetail()
  },
  methods: {
    // 获取店铺列表
    async getShopList () {
      let url = 'shop/list.do'
      let body = {}
      let res = await this.$post(url, body)
      if (+res.code === 1) {
        this.shops = res.data.shopList
      } else {
        this.$message.error(res.message)
      }
    },
    // 获得流量统计
    async getFlowDetail () {
      let url = 'dataAnalysis/flowStatistics.do'
      let res = await this.$post(url, this.flow)
      if (+res.code === 1) {
        this.flowData = res.data.result
        this.flowData.dateType = this.flow.dateType
      } else {
        this.$message.error(res.message)
      }
    },
    async getTransactionDetail () {
      let url = 'dataAnalysis/tradeStatistics.do'
      let res = await this.$post(url, this.transaction)
      if (+res.code === 1) {
        this.transactionData = res.data.result
        this.transactionData.dateType = this.transaction.dateType
      } else {
        this.$message.error(res.message)
      }
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import '~@/styles/common.scss';
  .fb{font-weight: bold;}
  .ml10{ margin-left: 10px;}
  .mr30{margin-right: 30px;}
  .mainWrap{
    padding: 10px;
    font-size: 14px;
  }
  .headerWrap{
    padding: 10px 0;
    display: flex;
    align-items: center;
  }
  .contentWrap{
    display: flex;
    flex-wrap: wrap;
  }
  .btn{
    margin-left: 10px;
    height: 40px;
  }
</style>
