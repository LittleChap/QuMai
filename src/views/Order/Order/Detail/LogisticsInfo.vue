<!-- 物流信息 弹窗 -->
<template>
  <el-dialog title="查看物流信息" v-if="value && logistics.length" :visible="value" class="v-dialog " width="800px" top="10vh" @close="beforeClose">
    <div class="contentBox">
      <div class="header">
        <div class="mr30">
          包裹
          <el-select v-model="currentLogistic">
            <el-option :label="'包裹' + index" :value="item" v-for="(item, index) in logistics" :key="index"></el-option>
          </el-select>
        </div>
        <div class="mr30">物流公司：{{currentLogistic.companyName}}</div>
        <div>物流单号：{{currentLogistic.logisticsDistributionSn}}</div>
      </div>
      <div v-if="currentLogistic.logisticsDetail.length">
        <div class="item" v-for="(item, index) in currentLogistic.logisticsDetail" :key="index">
          {{item.time}} {{item.context}}
        </div>
      </div>
      <div class="empty" v-else>
        该商品为无物流发货，无物流信息。
      </div>
    </div>
    <div slot="footer" class="v-dialog-footer">
      <el-button @click="beforeClose" type="primary">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'order-detail-logistics-dialog',
  props: {
    data: { // 数据
      type: Object,
      default: () => {
      }
    },
    id: '',
    value: false // 显示与否
  },
  data () {
    return {
      packageId: 1,
      logistics: [],
      currentLogistic: {}
    }
  },
  created () {
    this.getLogisitcs()
  },
  methods: {
    // 关闭弹窗
    beforeClose () {
      this.$emit('input', false)
    },
    // 获取物流信息
    async getLogisitcs () {
      let url = 'order/toCheckLogistics.do'
      let body = {
        order_id: this.id
      }
      let res = await this.$post(url, body)
      if (+res.code === 1) {
        this.logistics = res.data.logistics
        if (this.logistics.length) {
          this.currentLogistic = this.logistics[0]
        }
      } else {
        this.$message.error(res.message)
      }
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import '~@/styles/common.scss';
  .mr30{
    margin-right: 30px;
  }
  .header{
    border-bottom: 1px solid #e5e5e5;
    display: flex;
    align-items: center;
    padding-bottom: 10px;
    border-bottom: 1px solid #e5e5e5;
  }
  .item{
    padding: 10px 0;
  }
  .empty{
    width: 100%;
    text-align: center;
    line-height: 100px;
  }
</style>
