<!-- 退款 弹窗 -->
<template>
  <el-dialog title="退款" v-if="value" :visible="value" class="v-dialog " width="600px" @close="beforeClose">
    <div class="contentBox">
      <div class="mtb10">退款金额：￥{{data.returnOrder.apply_money}}</div>
      <div class="mtb10 red">退款方式：
        {{renderReturnType(data.returnOrder.order_pay_type)}}
        (￥{{data.returnOrder.apply_money}})
      </div>
      <div class="mtb10">扣除积分：
        <el-input v-model="pointNum" :maxlength="14" size="small" class="w200"  @input="watchNumber"></el-input>分
      </div>
    </div>
    <div slot="footer" class="v-dialog-footer">
      <el-button @click="toSave" type="primary">退款</el-button>
      <el-button @click="beforeClose" type="primary">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'order-after-payback-dialog',
  props: {
    data: { // 数据
      type: Object,
      default: () => {
      }
    },
    value: false // 显示与否
  },
  data () {
    return {
      pointNum: 0
    }
  },
  mounted () {
    this.pointNum = ~~this.data.returnOrder.apply_money
  },
  methods: {
    // 监听单号
    watchNumber (num) {
      this.$nextTick(() => {
        this.pointNum = num.replace(/[^0-9]/g, '')
      })
    },
    // 关闭弹窗
    beforeClose () {
      this.$emit('input', false)
    },
    async toSave () {
      let url = 'returnorder/agreeOrRefuse.do'
      let body = {
        return_order_item_id: this.data.returnOrder.return_order_id,
        point_deducted: this.pointNum
      }
      let res = await this.$post(url, body)
      if (+res.code === 1) {
        this.beforeClose()
      } else {
        this.$message.error(res.message)
      }
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
  .red{
    color: #d73b3c;
  }
  .mtb10{
    margin: 10px 0;
  }
  .w200{
    width: 200px;
    margin-right: 10px;
  }
</style>
