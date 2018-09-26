<!-- 优惠券列表 -->
<template>
  <div class="couponEditWrap">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>运营</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/marketingModule/couponModule/couponList' }">优惠券管理</el-breadcrumb-item>
      <el-breadcrumb-item>优惠券查看</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="v-wrap listWrap">
      <div>
        <h3 class="v-title">优惠券查看</h3>
      </div>
      <el-form :model="formData" ref="formDataRef" label-width="120px" label-position="left" size="small" class="v-form detailForm" v-loading="mainLoading" @submit.native.prevent>
        <el-form-item label="优惠券名称"> {{formData.couponName}} </el-form-item>
        <el-form-item label="发放数量">{{formData.grantNum}} </el-form-item>
        <el-form-item label="每人限领数量">{{formData.limitNum}}</el-form-item>
        <el-form-item label="发放时间">
          {{`${$moment(formData.grantStartTime).format('YYYY-MM-DD HH:mm:ss')} 至 ${$moment(formData.grantEndTime).format('YYYY-MM-DD HH:mm:ss')} `}}
        </el-form-item>
        <el-form-item label="发放类型">
          <!--// 发放类型 0：领取发放   1：所有会员均可领（领取发放，用于卖家中心） 2：根据会员等级领取（领取发放） 4：使用积分兑换（领取发放）)  8：注册发放; 16：小游戏 32：支付送券; 64：购买指定商品; 128：指定会员-->
          <span v-if="formData.grantType === 2 || formData.grantType === 1">会员等级</span>
          <span v-else-if="formData.grantType === 4">积分兑换（{{formData.grantMemberPoint}}积分）</span>
          <span v-else-if="formData.grantType === 8">注册发放</span>
          <span v-else-if="formData.grantType === 16">小游戏</span>
          <span v-else-if="formData.grantType === 32">支付送券（订单支付满{{formData.grantPayThreshold}}元）</span>
          <span v-else-if="formData.grantType === 64">购买指定商品</span>
          <span v-else-if="formData.grantType === 128">指定会员</span>
          <span v-else-if="formData.grantType === 512">线下发放</span>
        </el-form-item>
        <el-form-item  style="margin-top: -12px" v-if="formData.grantType === 2|| formData.grantType === 1">
          <el-checkbox-group v-model="formData.grantMemberLevelIds" :min="formData.grantMemberLevelIds.length" :max="formData.grantMemberLevelIds.length" style="display: inline-block">
            <el-checkbox label="1">普通会员</el-checkbox>
            <el-checkbox label="2">银卡会员</el-checkbox>
            <el-checkbox label="3">金卡会员</el-checkbox>
            <el-checkbox label="4">白金会员</el-checkbox>
            <el-checkbox label="5">钻石会员</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item  style="margin-top: -4px" v-else-if="formData.grantType === 64">
          <BuyProductTable ref="buyProductRef" :listData="grantGoodsList" readonly/>
        </el-form-item>
        <el-form-item  style="margin-top: -4px" v-if="formData.grantType === 128" >
          <el-input v-model="formData.grantMemberUsernames" type="textarea" readonly :rows="3" size="small" placeholder="请输入会员账号，每行一个。"> </el-input>
        </el-form-item>
        <el-form-item label="使用有效期">
          <span v-if="formData.useDateType === 1">{{`${$moment(formData.useStartTime).format('YYYY-MM-DD HH:mm:ss')} 至 ${$moment(formData.useEndTime).format('YYYY-MM-DD HH:mm:ss')} `}}</span>
          <span v-else>领到券当日开始 {{formData.useDay}} 天内有效</span>
        </el-form-item>
        <el-form-item label="同步到微信卡券"> {{formData.isOpenSyncWechat ? '开启' : '关闭'}} </el-form-item>
        <el-form-item label="分享转赠优惠券"> {{formData.isOpenGive ? '开启' : '关闭'}} </el-form-item>
        <el-form-item label="使用条件"> {{formData.priceThreshold > 0 ? `参与商品满 ${formData.priceThreshold} 元可用` : '无使用门槛'}} </el-form-item>
        <el-form-item label="面值"> {{formData.priceDiscount}} 元 </el-form-item>
        <el-form-item label="使用范围">
          <span v-if="formData.rangeUseType===0">平台</span>
          <div v-else>
            <span class="shopName" v-for="(item, i) in shopList" :key="i"> {{item.shop_name}}</span>
          </div>
        </el-form-item>
        <el-form-item label="参与商品范围" style="margin-bottom: 6px">
          <span v-if="formData.rangeGoodsType === 1">全部商品</span>
          <span v-else-if="formData.rangeGoodsType === 2">指定分类</span>
          <span v-else-if="formData.rangeGoodsType === 4">指定商品</span>
          <span v-else-if="formData.rangeGoodsType === 8">指定商品不可用</span>
        </el-form-item>
        <el-form-item v-if="formData.rangeGoodsType===2">
          <CatTable ref="catRef" :listData="catList" readonly/>
        </el-form-item>
        <el-form-item v-else-if="formData.rangeGoodsType===4">
          <ProductChooseTable :listData="rangeGoodsList" readonly/>
        </el-form-item>
        <el-form-item v-else-if="formData.rangeGoodsType===8">
          <ProductChooseTable :listData="rangeUnGoodsList" readonly/>
        </el-form-item>
        <el-form-item style="margin-top: 20px">
          <el-button @click="$router.go(-1)"  size="mi">返 回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import BuyProductTable from './components/BuyProductTable'
import CatTable from './components/CatTable'
import ProductChooseTable from './components/ProductChooseTable'
export default {
  name: 'coupon-edit',
  components: {BuyProductTable, CatTable, ProductChooseTable},
  data () {
    return {
      couponSn: this.$route.query.couponSn || '',
      mainLoading: false, // 详情的加载
      saveLoading: false, // 保存的加载
      formData: {
        couponName: '', // 优惠券名称
        grantNum: '', // 发放数量
        limitNum: '', // 限领数
        timeArr: [], // grantStartTime
        grantStartTime: '', // 发放时间最小值
        grantEndTime: '', // 发放时间最大值

        grantType: 0, // 发放类型 0：领取发放   2：根据会员等级;  4：使用积分兑换; 8：注册发放; 16：小游戏 32：支付送券; 64：购买指定商品; 128：指定会员
        grantTypeSub: 2, // 选择 领取发放时 2：根据会员等级;  4：使用积分兑换
        grantMemberLevelIds: ['1', '2', '3', '4', '5'], // 发放会员等级ID集合 grantType=2时必填
        grantMemberPoint: '', // 积分兑换数 grantType=4时必填
        grantMemberUsernames: '', // 指定的会员账号 grantType=128时必填
        grantGoodsIds: '', // 指定的商品ID集合 grantType=64时必填
        grantPayThreshold: '', // 支付满多少元送券 grantType=32时必填

        useDateType: 1, // 有效期类型  0：领取后N天可用 1：指定时间断内可用
        useDay: '', // 领取后可使用天数  useDateType=0时必填
        useTimeArr: [], // 使用有效期  useDateType=1时必填
        useStartTime: '', // 使用有效期最小值  useDateType=1时必填
        useEndTime: '', // 使用有效期最大值  useDateType=1时必填
        isOpenSyncWechat: 1, // 是否开启同步微信卡券功能 0：否 1：是
        isOpenGive: 0, // 是否开启转赠功能 0：否 1：是
        priceThreshold: 0, // 使用门槛  0 是无使用门槛  1是 有门槛
        priceThresholdNum: '', // 门槛金额
        priceDiscount: '', // 优惠券面值
        rangeUseType: 0, // 使用范围 0：平台 1：店铺
        rangeShopIds: [], // 店铺ID集合 rangeUseType=1时必填
        rangeGoodsType: 1, // 参与商品范围 1：全部商品; 2：指定分类可用 4：指定商品可用; 8：指定商品不可用
        rangeGoodsCatIds: '', // 分类ids  rangeGoodsType=2时必填
        rangeGoodsIds: '', // 商品ids  rangeGoodsType=4或8时必填
        rangeUnGoodsIds: '' // 商品ids 不可用  rangeGoodsType=4或8时必填
      },
      formRules: {},

      shopList: [], // 店铺列表
      grantGoodsList: [], // 发放类型 选中购买指定商品时的商品列表
      catList: [], // 选择指定的分类时 选中的分类
      rangeGoodsList: [], // 选择指定商品时 选中的商品列表
      rangeUnGoodsList: [] // 选择指定商品不可用时 选中的商品列表
    }
  },
  created () {
    // this.getShopList()
    if (this.couponSn) {
      this.getDetail()
    }
  },
  methods: {
    // 获得列表
    async getDetail () {
      this.mainLoading = true
      let res = await this.$post('couponFullcut/detail.do', {couponSn: this.couponSn})
      this.mainLoading = false
      if (parseInt(res.code) === 1) {
        this.formData = res.data
        // this.formData.grantTypeSub = 2
        // if (this.formData.grantType === 2 || this.formData.grantType === 4) {
        //   this.formData.grantTypeSub = Number(this.formData.grantType)
        //   this.formData.grantType = 0
        // }
        if (this.formData.grantType === 64) { // 发放类型 ---- 购买指定商品
          this.grantGoodsList = JSON.parse(JSON.stringify(this.formData.grantGoodsArray))
        }
        this.formData.grantMemberLevelIds = this.formData.grantMemberLevelIds ? this.formData.grantMemberLevelIds.split(',') : ['1', '2', '3', '4', '5']
        this.formData.rangeShopIds = this.formData.rangeShopIds ? this.formData.rangeShopIds.split(',') : []
        this.formData.rangeShopIds = this.formData.rangeShopIds.map(item => {
          return Number(item)
        })
        if (this.formData.rangeUseType === 1) {
          this.getShopList()
        }
        if (this.formData.rangeGoodsType === 8) { // 参与商品范围 --指定商品不可用
          this.formData.rangeUnGoodsIds = this.formData.rangeGoodsIds + ''
          this.formData.rangeGoodsIds = ''
          this.rangeUnGoodsList = this.formData.goodsArray.concat([])
        }
        if (this.formData.rangeGoodsType === 4) { // 参与商品范围 --指定商品
          this.rangeGoodsList = this.formData.goodsArray.concat([])
        }
        delete this.formData.goodsArray
        if (this.formData.rangeGoodsType === 2) { // 参与商品范围 --商品分类
          this.catList = this.formData.goodsCatParentPathArray.concat([])
        }
      } else {
        this.$message.error(res.message)
      }
    },
    // 获得列表
    async getShopList () {
      let reqData = {
        is_open: 1,
        showCount: 10000
      }
      let res = await this.$post('shop/list.do', reqData)
      if (parseInt(res.code) === 1) {
        res.shopList = res.data.shopList || []
        this.shopList = res.data.shopList.filter(item => {
          return this.formData.rangeShopIds.includes(item.shop_id)
        })
      }
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  /*@import '~@/styles/common.scss';*/
  .detailForm{
    margin-top: 20px;
    .el-form-item{
      margin-bottom: 8px;
    }
    .shopName{
      &+.shopName{
        &:before{
          content: '、';
        }
      }
    }
  }
</style>
