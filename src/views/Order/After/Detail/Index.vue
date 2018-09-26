<!-- 售后详情 -->
<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/order/after/list' }"> 售后</el-breadcrumb-item>
      <el-breadcrumb-item>售后详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="v-wrap listWrap"  v-loading="mainLoading">
      <div>
        <h3 class="v-title">售后详情</h3>
      </div>
      <ProcessInfo :data="detail" @reload="getDetail" />
      <ApplyInfo :data="detail" />
      <GoodsInfo :data="detail" />
      <LogInfo :data="detail" />

      <el-button type="primary" class="mt10" @click="$router.go(-1)">返回</el-button>
    </div>
  </div>
</template>

<script>
import GoodsInfo from './GoodsInfo'
import LogInfo from './LogInfo'
import ApplyInfo from './ApplyInfo'
import ProcessInfo from './ProcessInfo'
export default {
  name: 'order-after-detail',
  components: {GoodsInfo, LogInfo, ApplyInfo, ProcessInfo},
  data () {
    return {
      detail: {
        imgUrlList: [],
        order: {},
        returnOrder: {
          member: {}
        },
        returnOrderItem: {}
      },
      mainLoading: false
    }
  },
  created () {
    this.getDetail()
  },
  methods: {
    async getDetail () {
      let id = this.$route.query.id || ''
      let url = 'returnorder/getDetail.do'
      let body = {
        return_order_id: id
      }
      let res = await this.$post(url, body)
      if (+res.code === 1) {
        // res.data.returnOrderItem.return_order_status = 12 // 手动模拟订单状态
        this.detail = res.data
      } else {
        this.$message.error(res.message)
      }
      // console.log('控制台打印:', res)
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import '~@/styles/common.scss';
  .mt10{
    margin-top: 10px;
  }
</style>
