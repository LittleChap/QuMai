<!-- 订单详情 - 申请信息 -->
<template>
  <div class="wrap">
    <div class="title">申请信息</div>
    <div class="content">
      <div class="w33">售后单号：{{data.returnOrder.return_order_code}}</div>
      <div class="w33">售后类型：{{renderAfterType(data.returnOrder.return_type)}}</div>
      <div class="w33">申请时间：{{$moment(data.returnOrder.create_time).format('YYYY-MM-DD HH:mm:ss')}}</div>

      <div class="w33">订单编号：{{data.order.order_sn}}
        <span class="blue">
          <router-link class="blue" :to="'/order/order/detail?id=' + data.order.order_sn">查看详情</router-link>
        </span>
      </div>
      <div class="w33">订单总额：￥{{data.order.price_pay}}</div>
      <div class="w33" v-if="data.returnOrder.return_type !== 2">退款金额：￥{{data.returnOrder.apply_money}}</div>

      <div class="w33">订单类型：{{data.order.order_type_text}}</div>
      <div class="w33">会员帐号：{{data.returnOrder.member.mobile}}</div>
      <div class="w33 red" v-if="data.returnOrder.return_type !== 2">
        退款方式：{{renderReturnType(data.returnOrder.order_pay_type)}}
        (￥{{data.returnOrder.apply_money}})
      </div>
    </div>
    <div class="reason">
      <div class="reasonTitle">
        原因：{{data.returnOrder.return_reason}}
      </div>
      <!--<div class="reasonImages">-->
        <!--<img :src="item" alt="" class="reasonImg" v-for="(item, index) in data.imgUrlList" :key="index">-->
      <!--</div>-->
      <div class="imgPreview">
        <vue-preview :slides="imageList()" class="imgBox"></vue-preview>
      </div>
    </div>
    <!--<LogisticsInfo v-model="showLogistics" />-->
    <!--<Delivery v-model="showDelivery" />-->
  </div>
</template>

<script>
// import LogisticsInfo from '@/views/Order/Order/Detail/LogisticsInfo'
// import Delivery from '@/views/Order/Order/Detail/Delivery'
export default {
  name: 'order-after-apply-info-com',
  components: {},
  data () {
    return {
      // showLogistics: false // 物流弹窗
      // showDelivery: true // 发货弹窗
    }
  },
  props: {
    data: {
      type: Object,
      default: () => {
      }
    }
  },
  computed: {},
  created () {
  },
  methods: {
    imageList () {
      return this.data.imgUrlList.map(item => {
        return {
          w: 900,
          h: 700,
          src: item,
          msrc: item
        }
      })
    },
    // 回显售后类型
    renderAfterType (type) {
      switch (type) {
        case 0:
          return '退款'
        case 1:
          return '退货'
        case 2:
          return '换货'
      }
    },
    // 回显退款方式
    renderReturnType (type) {
      switch (type) {
        case 0:
          return '微信退款'
        case 1:
          return '银联退款'
        default:
          return '-'
      }
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss">
  .imgPreview {
    padding-top: 10px;
    .imgBox {
      .my-gallery {
        display: flex !important;
        justify-content: flex-start;
        img{
          width: 100px;
        }
      }
    }
  }
  figure {
    display: block;
    -webkit-margin-before: 0.25em;
    -webkit-margin-after: 0.25em;
    -webkit-margin-start: 10px;
    -webkit-margin-end: 10px;
  }
</style>
<style lang="scss" rel="stylesheet/scss" scoped>
  @import '~@/styles/common.scss';

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
    display: flex;
    flex-wrap: wrap;
    padding: 20px 10px;
  }

  .reason {
    border-top: 1px solid #e5e5e5;
    padding: 20px 10px;
  }

  .reasonTitle {

  }

  .reasonImages {
    display: flex;
    flex-wrap: wrap;
  }

  .reasonImg {
    width: 100px;
    height: 100px;
    margin: 10px;
  }
</style>
