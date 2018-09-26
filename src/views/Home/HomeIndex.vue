<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="v-wrap homeWrap">
      <h3 class="v-title">商城统计</h3>
      <div>
        <div class="info-card" style="width: 560px;">
          <div class="info-header">
            <div class="info-line">资金信息统计</div>
          </div>
          <div class="info-content dsf" style="height: 370px;">
            <div class="form-left">
              <div class="num-content sales">
                1000
              </div>
              <p class="num-text">今日销售额</p>
            </div>
            <div class="form-right">
              <div class="this-month">
                <div class="sales-left">
                  <p class="c666">本月销售额</p>
                  <p class="c999">以自然月统计</p>
                  <p>1000</p>
                </div>
                <div class="sales-right">
                  <div class="zhuzi1"></div>
                  <div class="zhuzi2"></div>
                  <div class="zhuzi3"></div>
                </div>
              </div>
              <div class="this-year">
                <div class="sales-left">
                  <p class="c666">今年销售额</p>
                  <p class="c999"> </p>
                  <p>1000</p>
                </div>
                <div class="sales-right">
                  <div class="zhuzi1"></div>
                  <div class="zhuzi2"></div>
                  <div class="zhuzi3"></div>
                </div>
              </div>
              <div class="per-price">
                <div class="sales-left">
                  <p class="c666">人均客单价</p>
                  <p class="c999"> </p>
                  <p>100</p>
                </div>
                <div class="sales-right">
                  <div class="zhuzi1"></div>
                  <div class="zhuzi2"></div>
                  <div class="zhuzi3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="info-card" style="width: 560px;margin-left: 18px;">
          <div class="info-header">
            <div class="info-line">订单信息统计</div>
          </div>
          <div class="info-content dsf" style="height: 370px;">
            <div>
              <div class="small-card">
                <div class="small-left">
                  <img src="./assets/icon1.png" alt="">
                </div>
                <div class="small-right">
                  <p>待发货订单</p>
                  <p>1000</p>
                </div>
                <div>

                </div>
              </div>
              <div class="small-card">
                <div class="small-left">
                  <img src="./assets/icon2.png" alt="">
                </div>
                <div class="small-right">
                  <p>待发货订单</p>
                  <p>1000</p>
                </div>
                <div>

                </div>
              </div>
            </div>
            <div>
              <div class="small-card">
                <div class="small-left">
                  <img src="./assets/icon3.png" alt="">
                </div>
                <div class="small-right">
                  <p>待发货订单</p>
                  <p>1000</p>
                </div>
                <div>

                </div>
              </div>
              <div class="small-card">
                <div class="small-left">
                  <img src="./assets/icon4.png" alt="">
                </div>
                <div class="small-right">
                  <p>待发货订单</p>
                  <p>1000</p>
                </div>
                <div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="info-card" style="width: 1144px;margin-top: 20px;">
        <div class="info-header">
          <div class="info-line">商城信息统计</div>
        </div>
        <div class="info-content" style="height: 300px;"></div>
      </div>
      <div>
        <h3 class="v-title" style="margin-top: 20px">商城统计</h3>
        <div>
          <div class="info-card" style="width: 560px;">
            <div class="info-header">
              <div class="info-line">资金信息统计</div>
            </div>
            <div class="info-content dsf" style="height: 370px;">
              <div class="form-left">
                <div class="num-content shop">
                  1000
                </div>
                <p class="num-text">今日销售额</p>
              </div>
              <div class="form-right">
                <div class="this-month">
                  <div class="sales-left">
                    <p class="c666">本月销售额</p>
                    <p class="c999">以自然月统计</p>
                    <p>1000</p>
                  </div>
                  <div class="sales-right">
                    <div class="zhuzi1"></div>
                    <div class="zhuzi2"></div>
                    <div class="zhuzi3"></div>
                  </div>
                </div>
                <div class="this-year">
                  <div class="sales-left">
                    <p class="c666">今年销售额</p>
                    <p class="c999"> </p>
                    <p>1000</p>
                  </div>
                  <div class="sales-right">
                    <div class="zhuzi1"></div>
                    <div class="zhuzi2"></div>
                    <div class="zhuzi3"></div>
                  </div>
                </div>
                <div class="per-price">
                  <div class="sales-left">
                    <p class="c666">人均客单价</p>
                    <p class="c999"> </p>
                    <p>100</p>
                  </div>
                  <div class="sales-right">
                    <div class="zhuzi1"></div>
                    <div class="zhuzi2"></div>
                    <div class="zhuzi3"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="info-card" style="width: 560px;margin-left: 18px;">
            <div class="info-header">
              <div class="info-line">订单信息统计</div>
            </div>
            <div class="info-content dsf" style="height: 370px;">
              <div>
                <div class="small-card">
                  <div class="small-left">
                    <img src="./assets/icon1.png" alt="">
                  </div>
                  <div class="small-right">
                    <p>待发货订单</p>
                    <p>1000</p>
                  </div>
                  <div>

                  </div>
                </div>
                <div class="small-card">
                  <div class="small-left">
                    <img src="./assets/icon2.png" alt="">
                  </div>
                  <div class="small-right">
                    <p>待发货订单</p>
                    <p>1000</p>
                  </div>
                  <div>

                  </div>
                </div>
              </div>
              <div>
                <div class="small-card">
                  <div class="small-left">
                    <img src="./assets/icon3.png" alt="">
                  </div>
                  <div class="small-right">
                    <p>待发货订单</p>
                    <p>1000</p>
                  </div>
                  <div>

                  </div>
                </div>
                <div class="small-card">
                  <div class="small-left">
                    <img src="./assets/icon4.png" alt="">
                  </div>
                  <div class="small-right">
                    <p>待发货订单</p>
                    <p>1000</p>
                  </div>
                  <div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'home-index',
  data () {
    return {
      dataObj: {}
    }
  },
  created () {
  },
  methods: {
    async getData () {
      let res = await this.$post('getAfterLoginInfo.do', {})
      if (parseInt(res.code) === 1) {
        this.dataObj = res.data
      } else {
        this.$message.error(res.message)
      }
    }
  }
}
</script>

<style lang="scss" scoped rel="stylesheet/scss">
  @import '~@/styles/common.scss';
  .dsf {
    display: flex;
  }
  .el-breadcrumb {
    width: 1200px;
    margin: 15px auto;
  }
  .homeWrap {
    width: 1200px;
    margin: 20px auto;
    padding: 0 26px 26px;
  }
  .info-card {
    display: inline-block;
    vertical-align: middle;
    .info-header {
      font-size:14px;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      padding:12px 10px;
      .info-line {
        border-left:4px solid #e6a23c;
        padding-left:10px;
      }
      background: #f8f8f8;
      height: 44px;
    }
    .info-content {
      background: #fff;
      border:1px solid #dcdfe6;
      border-top:0;
      padding:10px;
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
    }
  }
  .form-left {
    flex:1;
  }
  .form-right {
    padding-left:50px;
    flex:1;
  }
  .num-content {
    margin:88px auto 0;
    font-size:20px;
    color: #fff;
    height:130px;
    width:130px;
    line-height:140px;
    text-align: center;
    &.sales {
      background: url("./assets/progressBall1.png") no-repeat 100% 100%;
    }
    &.shop {
      background: url("./assets/progressBall2.png") no-repeat 100% 100%;
    }
  }
  .num-text {
    color: #333;
    text-align: center;
    font-size:14px;
    margin-top:18px;
  }
  .sales-left {
    p {
      height:18px;
      line-height:18px;
      width:86px;
    }
    p:last-child {
      font-size:20px;
      height:28px;
      line-height: 28px;
    }
  }
  .sales-right {
    margin-left:42px;
  }
  .this-month {
    margin-top:21px;
    p:last-child {
      color: #d4837f;
    }
    div {
      display: inline-block;
      border-radius: 2px;
    }
    .zhuzi1 {
      width: 6px;
      background: #dcafad;
      height:21px;
    }
    .zhuzi2 {
      width: 6px;
      background: #dcafad;
      height:36px;
    }
    .zhuzi3 {
      width: 6px;
      background: #dcafad;
      height:29px;
    }
  }
  .this-year {
    margin-top:50px;
    p:last-child {
      color: #5a6cdb;
    }
    div {
      display: inline-block;
      border-radius: 2px;
    }
    .zhuzi1 {
      width: 6px;
      background: #9ba5e1;
      height:21px;
    }
    .zhuzi2 {
      width: 6px;
      background: #9ba5e1;
      height:36px;
    }
    .zhuzi3 {
      width: 6px;
      background: #9ba5e1;
      height:29px;
    }
  }
  .per-price {
    margin-top:50px;
    p:last-child {
      color: #5fc3ff;
    }
    div {
      display: inline-block;
      border-radius: 2px;
    }
    .zhuzi1 {
      width: 6px;
      background: #95d1f5;
      height:21px;
    }
    .zhuzi2 {
      width: 6px;
      background: #95d1f5;
      height:36px;
    }
    .zhuzi3 {
      width: 6px;
      background: #95d1f5;
      height:29px;
    }
  }
  p {
    font-size:13px;
    margin:0;
  }
  .c333 {
    color: #333;
  }
  .c666 {
    color: #666;
  }
  .c999 {
    color: #999;
  }
  .small-card {
    border-radius:4px;
    cursor: pointer;
    display: flex;
    width:250px;
    height:140px;
    padding:40px 20px;
    margin-left:20px;
    margin-top: 20px;
    &:hover {
      padding-top:38px;
      padding-left:18px;
      box-shadow:0 2px 4px 0 rgba(0,0,0,0.20);
    }
    .small-left {
      img {
        width:60px;
        height:60px;
      }
    }
    .small-right {
      margin-left:30px;
      margin-top:4px;
      color: #666;
      p:first-child {
        height:18px;
        line-height: 18px;
        font-size:13px;
      }
      p:last-child {
        margin-top: 6px;
        height:28px;
        line-height:28px;
        font-size:20px;
      }
    }
  }

</style>
