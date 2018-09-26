<!-- 订单详情 - 售后处理 -->
<template>
  <div class="wrap">
    <div class="title">售后处理</div>
    <!--0: '退款待审核'-->
    <div class="content" v-if="data.returnOrderItem.return_order_status === 0">
      <div class="info"><i class="el-icon-info"></i> 等待卖家处理退款申请</div>
      <div class="text">收到买家退款申请，等待卖家处理。</div>
    </div>
    <!--1: '同意退款申请'-->
    <div class="content" v-if="data.returnOrderItem.return_order_status === 1">
      <div class="info"><i class="el-icon-info"></i> 卖家已同意退款申请，等待退款</div>
      <div class="text">
        <div class="mtb10">退款金额：￥{{data.returnOrder.apply_money}}</div>
        <div class="mtb10 red">退款方式：
          {{renderReturnType(data.returnOrder.order_pay_type)}}
          (￥{{data.returnOrder.apply_money}})
        </div>
        <el-button type="primary" @click="openPayBack">退款</el-button>
      </div>
    </div>
    <!--2: '退款成功'-->
    <div class="content" v-if="data.returnOrderItem.return_order_status === 2">
      <div class="info"><i class="el-icon-info"></i> 退款成功</div>
      <div class="text">
        <div class="mtb10">退款金额：￥{{data.returnOrder.apply_money}}</div>
        <div class="mtb10 red">退款方式：
          {{renderReturnType(data.returnOrder.order_pay_type)}}
          (￥{{data.returnOrder.apply_money}})
        </div>
        <div class="mtb10">扣除积分：{{data.returnOrderItem.point_deducted}}分</div>
        <div class="mtb10">到账时间：{{$moment(data.returnorderItem.update_status_time).format('YYYY-MM-DD HH:mm:ss')}}</div>
      </div>
    </div>
    <!--3: '退款关闭'-->
    <div class="content" v-if="data.returnOrderItem.return_order_status === 3">
      <div class="info"><i class="el-icon-info"></i> 退款关闭</div>
      <div class="text">卖家拒绝申请，本次售后申请关闭！</div>
    </div>
    <!--4: '退货待审核'-->
    <div class="content" v-if="data.returnOrderItem.return_order_status === 4">
      <div class="info"><i class="el-icon-info"></i> 等待卖家处理退款退货申请</div>
      <div class="text">收到买家退款退货申请，等待卖家处理。</div>
    </div>
    <!--5: '同意退货申请'-->
    <div class="content" v-if="data.returnOrderItem.return_order_status === 5">
      <div class="info"><i class="el-icon-info"></i> 卖家已同意退款退货申请，等待买家寄回退货商品</div>
      <div class="text">
        <div class="mtb10">退款金额：￥{{data.returnOrder.apply_money}}</div>
        <div class="mtb10 red">退款方式：
          {{renderReturnType(data.returnOrder.order_pay_type)}}
          (￥{{data.returnOrder.apply_money}})
        </div>
      </div>
    </div>
    <!--6: '退货卖家已签收'-->
    <div class="content" v-if="data.returnOrderItem.return_order_status === 6">
      <div class="info"><i class="el-icon-info"></i> 卖家已签收退货商品，等待退款</div>
      <div class="text">
        <div class="mtb10">退款金额：￥{{data.returnOrder.apply_money}}</div>
        <div class="mtb10 red">退款方式：
          {{renderReturnType(data.returnOrder.order_pay_type)}}
          (￥{{data.returnOrder.apply_money}})
        </div>
        <el-button type="primary" @click="openPayBack">退款</el-button>
      </div>
    </div>
    <!--7: '退货成功'-->
    <div class="content" v-if="data.returnOrderItem.return_order_status === 7">
      <div class="info"><i class="el-icon-info"></i> 退货成功</div>
      <div class="text">
        <div class="mtb10">退款金额：￥{{data.returnOrder.apply_money}}</div>
        <div class="mtb10 red">退款方式：
          {{renderReturnType(data.returnOrder.order_pay_type)}}
          (￥{{data.returnOrder.apply_money}})
        </div>
        <div class="mtb10">扣除积分：{{data.returnOrderItem.point_deducted}}分</div>
        <div class="mtb10">到账时间：{{$moment(data.returnorderItem.update_status_time).format('YYYY-MM-DD HH:mm:ss')}}</div>
      </div>
    </div>
    <!--8: '退货关闭'-->
    <div class="content" v-if="data.returnOrderItem.return_order_status === 8">
      <div class="info"><i class="el-icon-info"></i> 退货关闭</div>
      <div class="text">卖家拒绝退货，本次售后申请关闭！</div>
    </div>
    <!--9: '换货待审核'-->
    <div class="content" v-if="data.returnOrderItem.return_order_status === 9">
      <div class="info"><i class="el-icon-info"></i> 等待卖家处理换货申请</div>
      <div class="text">收到买家换货申请，等待卖家处理。</div>
    </div>
    <!--10: '同意换货申请'-->
    <div class="content" v-if="data.returnOrderItem.return_order_status === 10">
      <div class="info"><i class="el-icon-info"></i>卖家已同意换货申请，等待买家寄回换货商品</div>
      <!--<div class="text">卖家已同意换货申请，等待买家寄回换货商品</div>-->
    </div>
    <!--11: '换货卖家已签收'-->
    <div class="content" v-if="data.returnOrderItem.return_order_status === 11">
      <div class="info"><i class="el-icon-info"></i> 卖家已签收换货商品，等待卖家寄出换货商品</div>
      <!--<div class="text">卖家已签收换货商品，等待卖家寄出换货商品</div>-->
    </div>
    <!--12: '换货卖家商品寄出'-->
    <div class="content" v-if="data.returnOrderItem.return_order_status === 12">
      <div class="info"><i class="el-icon-info"></i> 卖家已寄出换货商品，等待买家签收</div>
      <div class="text">
        <el-button type="primary" @click="openLogistics">查看物流</el-button>
      </div>
    </div>
    <!--13: '换货成功'-->
    <div class="content" v-if="data.returnOrderItem.return_order_status === 13">
      <div class="info"><i class="el-icon-info"></i> 换货成功</div>
      <div class="text">
        <div class="mtb10">买家已签收，换货售后完成！</div>
        <el-button type="primary" @click="openLogistics">查看物流</el-button>
      </div>
    </div>
    <!--14: '换货关闭'-->
    <div class="content" v-if="data.returnOrderItem.return_order_status === 14">
      <div class="info"><i class="el-icon-info"></i> 换货关闭</div>
      <div class="text">卖家拒绝换货，本次售后申请关闭！</div>
    </div>

    <!--<LogisticsInfo v-model="showLogistics"/>-->
    <LogisticsInfo v-model="showLogistics" v-if="showLogistics" :id="data.order.order_id"/>
    <PayBack v-model="showPaybackDialog" v-if="showPaybackDialog" :data="data" @close="closePayBack" />
  </div>

</template>

<script>
import LogisticsInfo from '@/views/Order/Order/Detail/LogisticsInfo'
import PayBack from './PayBack'
export default {
  name: 'order-after-process-com',
  components: {LogisticsInfo, PayBack},
  data () {
    return {
      showLogistics: false, // 物流弹窗
      showPaybackDialog: false // 是否显示退款对话框
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
    // 打开 退款 弹窗
    openPayBack () {
      this.showPaybackDialog = true
    },
    // 关闭 退款 弹窗
    closePayBack () {
      this.showPaybackDialog = false
      this.$emit('reload')
    },
    // 打开 退款 弹窗
    openLogistics () {
      this.showLogistics = true
    },
    // 关闭 退款 弹窗
    closeLogistics () {
      this.showLogistics = false
    },
    // 回显退款方式
    renderReturnType (type) {
      switch (type) {
        case 0: return '微信退款'
        case 1: return '银联退款'
        default: return '-'
      }
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import '~@/styles/common.scss';
  .mtb10{
    margin: 10px 0;
  }
  .blue {
    color: #409eff;
  }

  .red {
    color: #d73b3c;
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
    line-height: 40px;
    padding-left: 10px;
    border-bottom: 1px solid #e5e5e5;
  }

  .content {
    padding: 20px 10px;
  }

  .info {
    line-height: 60px;
    font-size: 25px;
    color: #409eff;
    padding-left: 10px;
  }

  .text {
    padding-left: 40px;
  }
</style>
