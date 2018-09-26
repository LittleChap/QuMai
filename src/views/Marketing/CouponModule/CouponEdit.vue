<!-- 优惠券列表 -->
<template>
  <div class="couponEditWrap">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>运营</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/marketingModule/couponModule/couponList' }">优惠券管理</el-breadcrumb-item>
      <el-breadcrumb-item>优惠券编辑</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="v-wrap listWrap"  v-loading="mainLoading">
      <div>
        <h3 class="v-title">优惠券编辑</h3>
      </div>
      <el-form :model="formData" :rules="formRules" ref="formDataRef" label-width="130px" size="small" class="v-form detailForm" @submit.native.prevent>
        <el-form-item label="优惠券名称" prop="couponName">
          <el-input v-model="formData.couponName" :maxlength="50" size="small"> </el-input>
          <span class="tip v-red" v-show="formData.isOpenSyncWechat">微信优惠券名称仅支持9个汉字</span>
        </el-form-item>
        <el-form-item label="发放数量" prop="grantNum">
          <el-input v-model="formData.grantNum" :maxlength="9" size="small" @input="numberSet(formData.grantNum, formData, 'grantNum', false)"> </el-input>
        </el-form-item>
        <el-form-item label="每人限领数量" prop="limitNum">
          <el-input v-model="formData.limitNum" :maxlength="9" size="small" @input="numberSet(formData.limitNum, formData, 'limitNum', false)"> </el-input>
        </el-form-item>
        <el-form-item label="发放时间" prop="timeArr">
          <el-date-picker v-model="formData.timeArr" size="small" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
        </el-form-item>
        <el-form-item label="发放类型" prop="grantType">
          <el-select v-model="formData.grantType" placeholder="请选择" size="small"  @change="changeRadio(false, ['grantTypeSub', 'grantPayThreshold', 'grantMemberUsernames'])">
            <el-option label="领取发放" :value="0" > </el-option>
            <el-option label="线下发放" :value="512" > </el-option>
            <!--<el-option label="注册发放" :value="8" > </el-option>-->
            <!--<el-option label="小游戏" :value="16" > </el-option>-->
            <!--<el-option label="支付送券" :value="32" > </el-option>-->
            <!--<el-option label="购买指定商品" :value="64" > </el-option>-->
            <!--<el-option label="指定会员" :value="128" > </el-option>-->
          </el-select>
          <el-tooltip v-if="formData.grantType===128" style="margin-left: 10px; vertical-align: middle" class="item" effect="dark" content="发放数量以指定会员数量为准" placement="right">
            <i class="el-icon-question" style="font-size: 20px"></i>
          </el-tooltip>
        </el-form-item>
        <el-form-item  style="margin-top: -12px" prop="grantTypeSub" v-if="formData.grantType === 0">
          <div class="radioItem" style="width: 660px; margin: 0">
            <el-radio v-model="formData.grantTypeSub" :label="2" style="margin-right: 20px" @change="changeRadio(false, 'grantTypeSub')">会员等级</el-radio>
            <el-checkbox-group v-model="formData.grantMemberLevelIds" :disabled="formData.grantTypeSub!==2" style="display: inline-block" @change="changeRadio(true, 'grantTypeSub')">
              <el-checkbox label="1" true-label="1" false-label="1" @change="memberLevelChange">普通会员</el-checkbox>
              <el-checkbox label="2" true-label="2" false-label="2" @change="memberLevelChange">银卡会员</el-checkbox>
              <el-checkbox label="3" true-label="3" false-label="3" @change="memberLevelChange">金卡会员</el-checkbox>
              <el-checkbox label="4" true-label="4" false-label="4" @change="memberLevelChange">白金会员</el-checkbox>
              <el-checkbox label="5" true-label="5" false-label="5" @change="memberLevelChange">钻石会员</el-checkbox>
            </el-checkbox-group>
          </div>
          <!--<div class="radioItem" style="margin: 0">
            <el-radio v-model="formData.grantTypeSub" :label="4" style="margin-right: 20px" @change="changeRadio(false, 'grantTypeSub')">积分兑换</el-radio>
            <el-input v-model="formData.grantMemberPoint" size="small" :maxlength="9"  style="width: 80px"  @blur="changeRadio(true, 'grantTypeSub')" :disabled="formData.grantTypeSub!==4"  @input="numberSet(formData.grantMemberPoint, formData, 'grantMemberPoint', false)"> </el-input>
            积分
          </div>-->
        </el-form-item>
        <el-form-item  style="margin-top: -12px" prop="grantPayThreshold" v-else-if="formData.grantType === 32" class="el-radio">
          订单支付满 <el-input v-model="formData.grantPayThreshold" size="small" :maxlength="9"  style="width: 80px"   @input="numberSet(formData.grantPayThreshold, formData, 'grantPayThreshold', true)"> </el-input> 元
        </el-form-item>
        <el-form-item  style="margin-top: -12px" prop="grantGoodsArray" v-else-if="formData.grantType === 64">
          <BuyProductTable ref="buyProductRef" :listData="grantGoodsList" @getList="getGrantGoods"/>
        </el-form-item>
        <el-form-item  style="margin-top: -12px" prop="grantMemberUsernames" v-if="formData.grantType === 128" >
          <el-input v-model="formData.grantMemberUsernames" type="textarea" :rows="3" size="small" placeholder="请输入会员账号，每行一个。"> </el-input>
        </el-form-item>
        <el-form-item label="使用有效期" prop="useDateType">
          <div class="radioItem" style="width: 520px">
            <el-radio v-model="formData.useDateType" :label="1" @change="changeRadio(false, 'useDateType')">固定时间</el-radio>
            <el-date-picker v-model="formData.useTimeArr"  :disabled="formData.useDateType!==1" size="small" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"  @change="changeRadio(true, 'useDateType')"> </el-date-picker>
          </div>
          <!--<div class="radioItem">
            <el-radio v-model="formData.useDateType" :label="0" @change="changeRadio(false, 'useDateType')">领到券当日开始</el-radio>
            <el-input v-model="formData.useDay" size="small" :maxlength="9"  style="width: 80px"  :disabled="formData.useDateType!==0"  @input="numberSet(formData.useDay, formData, 'useDay', false)" @blur="changeRadio(true, 'useDateType')"> </el-input>
            天内有效
          </div>-->
        </el-form-item>
        <!--<el-form-item label="同步到微信卡券" prop="isOpenSyncWechat">
          <el-radio v-model="formData.isOpenSyncWechat" :label="1">开启</el-radio>
          <el-radio v-model="formData.isOpenSyncWechat" :label="0">关闭</el-radio>
          <el-tooltip style="margin-left: 30px; vertical-align: middle" class="item" effect="dark" content="需开通微信公众号卡券权限才可自动同步" placement="right">
            <i class="el-icon-question" style="font-size: 20px"></i>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="分享转赠优惠券" prop="isOpenGive">
          <el-radio v-model="formData.isOpenGive" :label="1">开启</el-radio>
          <el-radio v-model="formData.isOpenGive" :label="0">关闭</el-radio>
        </el-form-item>-->
        <el-form-item label="使用条件" prop="priceThreshold">
          <el-radio v-model="formData.priceThreshold" :label="0" @change="changeRadio(false, 'priceThreshold')">无使用门槛</el-radio>
          <div class="radioItem" style="margin-left: 30px">
            <el-radio v-model="formData.priceThreshold" :label="1" @change="changeRadio(false, 'priceThreshold')">参与商品满</el-radio>
            <el-input v-model="formData.priceThresholdNum" size="small"  style="width: 80px"  :maxlength="9"  :disabled="formData.priceThreshold!==1"  @input="numberSet(formData.priceThresholdNum, formData, 'priceThresholdNum', true)"> </el-input>
            元可用
          </div>
        </el-form-item>
        <el-form-item label="面值" prop="priceDiscount">
          <el-input v-model="formData.priceDiscount" :maxlength="9" size="small"  @input="numberSet(formData.priceDiscount, formData, 'priceDiscount', true)"> </el-input>
        </el-form-item>
        <el-form-item label="使用范围" prop="rangeUseType">
          <el-radio v-model="formData.rangeUseType" :label="0" style="margin-right: 30px" @change="changeRangeUse">平台</el-radio>
          <div class="radioItem">
            <el-radio v-model="formData.rangeUseType" :label="1" @change="changeRangeUse">店铺</el-radio>
            <el-select v-model="formData.rangeShopIds" multiple collapse-tags filterable :disabled="formData.rangeUseType !== 1"  placeholder="请选择" size="small">
              <el-option v-for="(item, i) in shopList" :key="i" :label="item.shop_name" :value="item.shop_id" > </el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="参与商品范围" v-if="formData.grantType !== 512" prop="rangeGoodsType" style="margin-bottom: 6px">
          <el-radio v-model="formData.rangeGoodsType" :label="1"  @change="changeRadio(false, ['rangeGoodsCatIds', 'rangeGoodsIds', 'rangeUnGoodsIds'])">全部商品</el-radio>
          <el-radio v-model="formData.rangeGoodsType" :label="2"  @change="changeRadio(false, ['rangeGoodsCatIds', 'rangeGoodsIds', 'rangeUnGoodsIds'])">指定分类</el-radio>
          <el-radio v-model="formData.rangeGoodsType" :label="4"  @change="changeRadio(false, ['rangeGoodsCatIds', 'rangeGoodsIds', 'rangeUnGoodsIds'])">指定商品</el-radio>
          <el-radio v-model="formData.rangeGoodsType" :label="8"  @change="changeRadio(false, ['rangeGoodsCatIds', 'rangeGoodsIds', 'rangeUnGoodsIds'])">指定商品不可用</el-radio>
        </el-form-item>
        <el-form-item v-if="formData.rangeGoodsType===2" prop="rangeGoodsCatIds">
          <CatTable ref="catRef" :listData="catList" @getList="getRangeCat" :rangeUseType="formData.rangeUseType" :shopIds="formData.rangeShopIds"/>
        </el-form-item>
        <el-form-item v-else-if="formData.rangeGoodsType===4" prop="rangeGoodsIds">
          <ProductChooseTable :listData="rangeGoodsList" @getList="getRangeGoods" :rangeUseType="formData.rangeUseType" :shopIds="formData.rangeShopIds"/>
        </el-form-item>
        <el-form-item v-else-if="formData.rangeGoodsType===8" prop="rangeUnGoodsIds">
          <ProductChooseTable :listData="rangeUnGoodsList" @getList="getRangeUnGoods" :rangeUseType="formData.rangeUseType" :shopIds="formData.rangeShopIds"/>
        </el-form-item>
        <el-form-item style="margin-top: 20px">
          <el-button  type="primary" @click="toSave" :loading="saveLoading" size="mi">保 存 </el-button>
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
    let validateGrantTypeSub = (rule, value, callback) => {
      if (value === 2 && (!this.formData.grantMemberLevelIds || !this.formData.grantMemberLevelIds.length)) {
        callback(new Error('请选择会员等级'))
        return false
      }
      if (value === 4 && this.formData.grantMemberPoint === '') {
        callback(new Error('请输入积分'))
        return false
      }
      callback()
    }
    let validateUseDateType = (rule, value, callback) => {
      if (value === 0 && !this.formData.useDay) {
        callback(new Error('请输入天数'))
        return false
      }
      if (value === 0 && Number(this.formData.useDay) <= 0) {
        callback(new Error('请输入大于0的正自然数'))
        return false
      }
      if (value === 1 && (!this.formData.useTimeArr || !this.formData.useTimeArr.length)) {
        callback(new Error('请选择固定有效期时间'))
        return false
      }
      callback()
    }
    let validatePriceThreshold = (rule, value, callback) => {
      if (value === 1 && !this.formData.priceThresholdNum) {
        callback(new Error('请输入门槛金额'))
        return false
      }
      if (value === 1 && Number(this.formData.priceThresholdNum) <= 0) {
        callback(new Error('请输入大于0的正自然数'))
        return false
      }
      callback()
    }
    let validateRangeUseType = (rule, value, callback) => {
      if (value === 1 && (!this.formData.rangeShopIds || !this.formData.rangeShopIds.length)) {
        callback(new Error('请选择店铺'))
        return false
      }
      callback()
    }
    let validateRangeGoodsIds = (rule, value, callback) => {
      if (!value || value === '' || !value.length) {
        callback(new Error('请选择商品'))
        return false
      }
      callback()
    }
    let validateNum = (rule, value, callback) => {
      if (value <= 0) {
        callback(new Error('请输入大于0的正自然数'))
        return false
      }
      callback()
    }
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
        grantGoodsArray: [], // 指定的商品参数集 grantType=64时必填
        // grantGoodsIds: '', // 指定的商品ID集合 grantType=64时必填
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
        // rangeGoodsCatH5: '', // 分类ids的数组  rangeGoodsType=2时必填
        // rangeGoodsCatIdsArray: '', // 分类ids的数组  rangeGoodsType=2时必填
        rangeGoodsIds: '', // 商品ids  rangeGoodsType=4或8时必填
        rangeUnGoodsIds: '' // 商品ids 不可用  rangeGoodsType=4或8时必填
      },
      formRules: {
        couponName: [{required: true, message: '请输入优惠券名称', trigger: 'blur'}],
        grantNum: [{required: true, message: '请输入发放数量', trigger: 'blur'}, {validator: validateNum, trigger: 'blur'}],
        limitNum: [{required: true, message: '请输入每人限领数量', trigger: 'blur'}, {validator: validateNum, trigger: 'blur'}],
        timeArr: [{required: true, message: '请选择发放时间', trigger: 'change'}],
        grantType: [{required: true, message: '请选择发放类型', trigger: 'change'}],
        useDateType: [{required: true, message: '请选择使用有效期', trigger: 'change'}, {validator: validateUseDateType, trigger: 'change, blur'}],
        isOpenSyncWechat: [{required: true, message: '请选择是否同步到微信卡券', trigger: 'change'}],
        isOpenGive: [{required: true, message: '请选择是否分享转赠优惠券', trigger: 'change'}],
        priceThreshold: [{required: true, message: '请选择使用条件', trigger: 'change'}, {validator: validatePriceThreshold, trigger: 'change, blur'}],
        priceDiscount: [{required: true, message: '请输入面值', trigger: 'blur'}, {validator: validateNum, trigger: 'blur'}],
        rangeUseType: [{required: true, message: '请选择使用范围', trigger: 'change'}, {validator: validateRangeUseType, trigger: 'change, blur'}],
        rangeGoodsType: [{required: true, message: '请选择参与商品范围', trigger: 'change'}],
        rangeGoodsCatIds: [{required: true, message: '请选择分类', trigger: 'change, blur'}],
        rangeGoodsIds: [{validator: validateRangeGoodsIds, trigger: 'change, blur'}],
        rangeUnGoodsIds: [{validator: validateRangeGoodsIds, trigger: 'change, blur'}],
        // 选择领取发放 - 是否选中会员
        grantTypeSub: [{validator: validateGrantTypeSub, trigger: 'change, blur'}],
        grantPayThreshold: [{required: true, message: '请输入订单支付门槛', trigger: 'blur'}, {validator: validateNum, trigger: 'blur'}],
        grantMemberUsernames: [{required: true, message: '请输入会员账号', trigger: 'blur'}],
        grantGoodsArray: [{validator: validateRangeGoodsIds, trigger: 'change, blur'}]
      },

      shopList: [], // 店铺列表
      grantGoodsList: [], // 发放类型 选中购买指定商品时的商品列表
      catList: [], // 选择指定的分类时 选中的分类
      rangeGoodsList: [], // 选择指定商品时 选中的商品列表
      rangeUnGoodsList: [] // 选择指定商品不可用时 选中的商品列表
    }
  },
  created () {
    this.getShopList()
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
        this.formData.timeArr = []
        this.formData.timeArr.push(this.$moment(this.formData.grantStartTime).format('YYYY-MM-DD HH:mm:ss'))
        this.formData.timeArr.push(this.$moment(this.formData.grantEndTime).format('YYYY-MM-DD HH:mm:ss'))
        this.formData.grantTypeSub = 2
        // grantType: 0, // 发放类型 0：领取发放   2：根据会员等级;  4：使用积分兑换; 8：注册发放; 16：小游戏 32：支付送券; 64：购买指定商品; 128：指定会员
        if (this.formData.grantType === 2 || this.formData.grantType === 4) {
          this.formData.grantTypeSub = this.formData.grantType
          this.formData.grantType = 0
        }
        if (this.formData.grantType === 64) { // 发放类型 ---- 购买指定商品
          this.grantGoodsList = JSON.parse(JSON.stringify(this.formData.grantGoodsArray))
        }
        this.formData.grantMemberLevelIds = this.formData.grantMemberLevelIds ? this.formData.grantMemberLevelIds.split(',') : ['1', '2', '3', '4', '5']
        this.formData.useTimeArr = []
        if (this.formData.useDateType === 1) { // 使用有效期- 固定时间
          this.formData.useTimeArr.push(this.$moment(this.formData.useStartTime).format('YYYY-MM-DD HH:mm:ss'))
          this.formData.useTimeArr.push(this.$moment(this.formData.useEndTime).format('YYYY-MM-DD HH:mm:ss'))
        }
        if (this.formData.priceThreshold > 0) { // 使用门槛---有门槛
          this.formData.priceThresholdNum = Number(this.formData.priceThreshold)
          this.formData.priceThreshold = 1
        }
        this.formData.rangeShopIds = this.formData.rangeShopIds ? this.formData.rangeShopIds.split(',') : []
        this.formData.rangeShopIds = this.formData.rangeShopIds.map(item => {
          return Number(item)
        })
        if (this.formData.rangeGoodsType === 8) { // 参与商品范围 --指定商品不可用
          this.formData.rangeUnGoodsIds = this.formData.rangeGoodsIds + ''
          this.formData.rangeGoodsIds = ''
          this.rangeUnGoodsList = this.formData.goodsArray.concat([])
        }
        if (this.formData.rangeGoodsType === 4) { // 参与商品范围 --指定商品
          this.rangeGoodsList = this.formData.goodsArray.concat([])
        }
        delete this.formData.goodsArray
        if (this.formData.rangeGoodsType === 2 && this.formData.rangeGoodsCatH5) { // 参与商品范围 --商品分类
          this.catList = JSON.parse(this.formData.rangeGoodsCatH5)
        }
        delete this.formData.goodsCatParentPathArray
        this.formData = JSON.parse(JSON.stringify(this.formData))
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
        this.shopList = res.data.shopList || []
      }
    },
    // 会员等级切换 用户勾选任意等级的会员，会自动选中比这个会员级别更低的所有会员。如选中钻石会员，则其他所有会员均会选中
    memberLevelChange (val) {
      // console.log('会员等级切换', val, this.formData.grantMemberLevelIds)
      let level = Number(val)
      this.formData.grantMemberLevelIds = []
      for (let i = 0; i < level; i++) {
        this.formData.grantMemberLevelIds.push(String(i + 1))
      }
    },
    // 单选框的选择切换---> 表单的验证切换  领取发放 、 会员等级/ 积分的 选中切换
    changeRadio (isSet, validateName) {
      if (isSet) {
        this.$refs.formDataRef.validateField(validateName)
      } else {
        this.$refs.formDataRef.clearValidate(validateName)
      }
    },
    // 使用范围的切换
    changeRangeUse () {
      this.changeRadio(false, 'rangeUseType')
      // 清空参与商品范围 的数据
      this.formData.rangeGoodsType = 1
      this.formData.rangeGoodsCatIds = ''
      this.formData.rangeGoodsIds = ''
      this.formData.rangeUnGoodsIds = ''
      this.catList = [] // 选择指定的分类时 选中的分类
      this.rangeGoodsList = [] // 选择指定商品时 选中的商品列表
      this.rangeUnGoodsList = [] // 选择指定商品不可用时 选中的商品列表
    },
    // 发放类型 -- 获得指定购买商品列表
    getGrantGoods (list) {
      // let goodsIdArr = []
      this.formData.grantGoodsArray = []
      console.log('获得指定购买商品列表', list)
      list.map(item => {
        this.formData.grantGoodsArray.push({
          goodsId: item.goodsId,
          num: item.num
        })
      })
      // this.formData.grantGoodsIds = goodsIdArr.join(',')
      this.changeRadio(true, 'grantGoodsArray')
    },
    // 参与商品范围 -- 获得指定分类列表
    getRangeCat (list) {
      let goodsIdArr = []
      // this.formData.rangeGoodsCatH5 = list
      list.map(item => {
        let catId = item.catIdArr && item.catIdArr.length ? item.catIdArr[item.catIdArr.length - 1] : ''
        goodsIdArr.push(catId)
      })
      this.formData.rangeGoodsCatIds = goodsIdArr.join(',')
      if (list.length === 1) {
        return false
      }
      this.changeRadio(true, 'rangeGoodsCatIds')
    },
    // 参与商品范围 -- 获得指定商品列表
    getRangeGoods (list) {
      let goodsIdArr = []
      list.map(item => {
        goodsIdArr.push(item.goodsId)
      })
      this.formData.rangeGoodsIds = goodsIdArr.join(',')
      this.changeRadio(true, 'rangeGoodsIds')
    },
    // 参与商品范围 -- 获得指定不可用商品列表
    getRangeUnGoods (list) {
      let goodsIdArr = []
      list.map(item => {
        goodsIdArr.push(item.goodsId)
      })
      this.formData.rangeUnGoodsIds = goodsIdArr.join(',')
      this.changeRadio(true, 'rangeUnGoodsIds')
    },
    // 限制输入数字、金额
    numberSet (value, item, itemName, isMoney) {
      this.$numInput(value, item, itemName, isMoney, this)
    },
    toSave () {
      this.$refs.formDataRef.validate(async (valid, validObj) => {
        let validBuyProduct = true
        if (this.formData.grantType === 64) {
          validBuyProduct = await this.$refs.buyProductRef.validTable()
        }
        let validCat = true
        if (this.formData.rangeGoodsType === 2) {
          validCat = await this.$refs.catRef.validTable()
        }
        if (!valid) {
          for (let item in validObj) {
            this.$message.error(validObj[item][0].message)
            return false
          }
          return false
        }
        if (!validBuyProduct) {
          this.$message.error('请输入正确的购买数量')
          return false
        }
        if (!validCat) {
          this.$message.error('请选择分类')
          return false
        }
        this.toSaveData()
      })
    },
    // 保存请求
    async toSaveData () {
      let reqData = Object.assign({}, this.formData)
      reqData.grantStartTime = reqData.timeArr[0]
      reqData.grantEndTime = reqData.timeArr[1]
      delete reqData.timeArr
      if (reqData.grantType === 512) { // 线下发放的
        reqData.rangeGoodsType = 1 // 全部商品
      }
      if (reqData.grantType === 0) { // 选中领取发放
        reqData.grantType = Number(reqData.grantTypeSub)
      }
      reqData.grantGoodsArray = reqData.grantGoodsArray && reqData.grantGoodsArray.length ? JSON.stringify(reqData.grantGoodsArray) : ''
      delete reqData.grantTypeSub
      // if (reqData.grantType === 2) { // 根据会员等级
      //   reqData.grantMemberLevelIds = reqData.grantMemberLevelIds.join(',')
      // }
      reqData.grantMemberLevelIds = reqData.grantMemberLevelIds.join(',')
      if (reqData.useDateType === 1) { // 使用有效期- 固定时间
        reqData.useStartTime = reqData.useTimeArr[0]
        reqData.useEndTime = reqData.useTimeArr[1]
      }
      delete reqData.useTimeArr
      if (reqData.priceThreshold === 1) { // 使用门槛---有门槛
        reqData.priceThreshold = Number(reqData.priceThresholdNum)
      }
      delete reqData.priceThresholdNum
      // if (reqData.rangeUseType === 1) { // 使用范围 --- 店铺
      reqData.rangeShopIds = reqData.rangeShopIds.join(',')
      // }
      if (reqData.rangeGoodsType === 8) { // 参与商品范围 --指定商品不可用
        reqData.rangeGoodsIds = reqData.rangeUnGoodsIds
      }
      delete reqData.rangeUnGoodsIds
      reqData.rangeGoodsCatH5 = this.catList && this.catList.length ? JSON.stringify(this.catList) : ''
      let url = 'couponFullcut/publish.do'
      if (this.couponSn) {
        reqData.couponSn = this.couponSn
        url = 'couponFullcut/edit.do'
      }
      this.saveLoading = true
      let res = await this.$post(url, reqData)
      this.saveLoading = false
      if (parseInt(res.code) === 1) {
        this.$message.success('保存成功')
        setTimeout(() => {
          this.$router.go(-1)
        }, 1000)
      } else {
        this.$message.error(res.message)
      }
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import '~@/styles/common.scss';
  .detailForm{
    width: 600px;
    margin-top: 20px;
    .tip{
      position: absolute;
      left: 92%;
      top: 0;
      display: inline-block;
      width: 200px;
    }
  }
  .radioItem{
    /*width: 340px;*/
    display: inline-block;
    &+.radioItem{
      margin-top: 10px;
    }
    /*margin-right: 30px;*/
    .el-input {
      width: 80px;
    }
    .el-select {
      margin-left: 10px;
      width: 270px;
      vertical-align: top;
    }
    .el-range-editor{
      width: 380px;
    }
    .el-date-editor.is-disabled, .el-date-editor.is-disabled:hover, .el-date-editor.is-disabled:focus {
      border-color: $border-base !important;
    }
  }
</style>
