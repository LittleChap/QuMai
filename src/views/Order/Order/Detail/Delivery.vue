<!-- 物流信息 弹窗 -->
<template>
  <el-dialog title="确认发货" v-if="value" :visible="value" class="v-dialog " width="80%" @close="beforeClose">
    <div class="contentBox">
      <div class="w60 bdr">
        <!--表头-->
        <div class="header">
          <div class="w40">商品信息</div>
          <div class="w20">规格</div>
          <div class="w20">单价</div>
          <div class="w20">数量</div>
        </div>
        <!--表格内容-->
        <div class="content">
          <div class="item">
            <div class="w40 dsf">
              <img src="https://gss0.bdstatic.com/70cFfyinKgQIm2_p8IuM_a/daf/pic/item/d833c895d143ad4b164d6bea8f025aafa40f06bc.jpg" alt="" class="img">
              <div class="goodsName">商品名称asdf asfdas fasdfasfda sdfas dasdfasdf asdf</div>
            </div>
            <div class="w20">GG:XX</div>
            <div class="w20">¥0.00</div>
            <div class="w20">2</div>
          </div>

          <div class="item">
            <div class="w40 dsf">
              <img src="https://gss0.bdstatic.com/70cFfyinKgQIm2_p8IuM_a/daf/pic/item/d833c895d143ad4b164d6bea8f025aafa40f06bc.jpg" alt="" class="img">
              <div class="goodsName">商品名称asdf asfdas fasdfasfda sdfas dasdfasdf asdf</div>
            </div>
            <div class="w20">GG:XX</div>
            <div class="w20">¥0.00</div>
            <div class="w20">2</div>
          </div>

          <div class="item">
            <div class="w40 dsf">
              <img src="https://gss0.bdstatic.com/70cFfyinKgQIm2_p8IuM_a/daf/pic/item/d833c895d143ad4b164d6bea8f025aafa40f06bc.jpg" alt="" class="img">
              <div class="goodsName">商品名称asdf asfdas fasdfasfda sdfas dasdfasdf asdf</div>
            </div>
            <div class="w20">GG:XX</div>
            <div class="w20">¥0.00</div>
            <div class="w20">2</div>
          </div>

          <div class="item">
            <div class="w40 dsf">
              <img src="https://gss0.bdstatic.com/70cFfyinKgQIm2_p8IuM_a/daf/pic/item/d833c895d143ad4b164d6bea8f025aafa40f06bc.jpg" alt="" class="img">
              <div class="goodsName">商品名称asdf asfdas fasdfasfda sdfas dasdfasdf asdf</div>
            </div>
            <div class="w20">GG:XX</div>
            <div class="w20">¥0.00</div>
            <div class="w20">2</div>
          </div>
        </div>
      </div>
      <div class="w40">
        <div class="dsf p10 pl20">
          <el-radio v-model="radio" label="1">选择物流公司</el-radio>
          <el-radio v-model="radio" label="2">无需物流发货</el-radio>
        </div>

        <div class="dsf p10 pl20">物流公司</div>
        <div class="dsf p10 pl20">
          <el-select v-model="logisticsCompany" clearable class="w75">
            <el-option label="顺丰速递" :value="1" > </el-option>
            <el-option label="圆通快递" :value="2" > </el-option>
          </el-select>
        </div>
        <div class="dsf p10 pl20">物流单号</div>
        <div class="dsf p10 pl20">
          <el-input v-model="logisticsNumber" class="w75" @input="watchNumber" :maxlength="50" clearable=""></el-input>
        </div>
      </div>
    </div>
    <div slot="footer" class="v-dialog-footer">
      <el-button @click="toSave" type="primary">确定</el-button>
      <el-button @click="beforeClose" type="primary">取消</el-button>
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
    value: false // 显示与否
  },
  data () {
    return {
      packageId: 1,
      logisticsCompany: 1,
      logisticsNumber: '',
      radio: '1'
    }
  },
  created () {
  },
  methods: {
    // 监听单号
    watchNumber (num) {
      this.$nextTick(() => {
        this.logisticsNumber = num.replace(/[^0-9a-zA-Z]/g, '')
      })
    },
    // 关闭弹窗
    beforeClose () {
      this.$emit('input', false)
    },
    toSave () {}
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import '~@/styles/common.scss';
  .p10{
    padding: 10px;
  }
  .pl20{
    padding-left: 20px;
  }
  .contentBox{
    display: flex;
    height: 250px;
  }
  .dsf{
    display: flex;
    align-items: center;
  }
  .w20{
    width: 20%;
    text-align: center;
  }
  .w40{
    width: 40%;
    text-align: center;
    box-sizing: border-box;
  }
  .w60{
    width: 60%;
    text-align: center;
    background: #f5f5f5;
    box-sizing: border-box;
  }
  .w75{
    width: 75%;
  }
  .header{
    display: flex;
    align-items: center;
    line-height: 40px;
    border-bottom: 1px solid #e5e5e5;
  }
  .content{
    height: 210px;
    overflow-y: scroll;
  }
  .item{
    display: flex;
    align-items: center;
    padding: 5px 0;
  }
  .item:not(:last-child){
    border-bottom: 1px solid #e5e5e5;
  }
  .img{
    width: 80px;
    height: 50px;
    background: #d73b3c;
    display: block;
    margin-left: 5px;
  }
  .goodsName{
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    padding: 0 5px;
    box-sizing: border-box;
    text-align: left;
  }
</style>
