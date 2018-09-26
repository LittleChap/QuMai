<!-- 扫码支付 -->
<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>订单</el-breadcrumb-item>
      <el-breadcrumb-item>扫码支付</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="v-wrap listWrap"  v-loading="mainLoading">
      <div>
        <h3 class="v-title">扫码支付</h3>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'order-payment',
  components: {},
  data () {
    return {
      mainLoading: false
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
</style>
