<!-- 扫码有礼-详情 -->
<template>
  <div class="couponEditWrap">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>运营</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/marketingModule/scanGiftModule/scanGiftList' }">扫码有礼管理</el-breadcrumb-item>
      <el-breadcrumb-item>扫码有礼设置</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="v-wrap listWrap"  v-loading="mainLoading">
      <div>
        <h3 class="v-title">扫码有礼设置</h3>
      </div>
      <el-form :model="formData" ref="formDataRef" label-width="130px" label-position="left" size="small" class="v-form detailForm" @submit.native.prevent>
        <el-form-item label="活动名称" prop="activityName"> {{formData.activityName}} </el-form-item>
        <el-form-item label="活动有效期" prop="timeArr">
          {{`${$moment(formData.startTime).format('YYYY-MM-DD HH:mm:ss')} 至 ${$moment(formData.endTime).format('YYYY-MM-DD HH:mm:ss')} `}}
        </el-form-item>
        <el-form-item label="使用范围" prop="rangeType">
          <span v-if="formData.rangeType===0">全部店铺</span>
          <div v-else>
            <span class="shopName" v-for="(item, i) in formData.shopArray" :key="i"> {{item.shopName}}</span>
          </div>
          <!--<el-radio v-model="formData.rangeType" :label="0" style="margin-right: 30px">全部店铺</el-radio>
          <div class="radioItem">
            <el-radio v-model="formData.rangeType" :label="1">店铺</el-radio>
            <el-select v-model="formData.rangeShopIds" multiple collapse-tags filterable :disabled="formData.rangeType !== 1"  placeholder="请选择" size="small">
              <el-option v-for="(item, i) in shopList" :key="i" :label="item.shop_name" :value="item.shop_id" > </el-option>
            </el-select>
          </div>-->
        </el-form-item>
        <el-form-item label="广告语" prop="activityAdv"> {{formData.activityAdv}} </el-form-item>
        <el-form-item label="活动设置"  prop="itemArray">
          <ActivitySetting ref="activitySettingRef" :listData="formData.itemArray" readonly :formData="formData"/>
        </el-form-item>
        <el-form-item style="margin-top: 60px">
          <!--<el-button  type="primary" @click="toSave" :loading="saveLoading" size="mi">保 存 </el-button>-->
          <el-button @click="$router.go(-1)"  size="mi">返 回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import ActivitySetting from './Components/ActivitySetting'
export default {
  name: 'scan-gift-edit',
  components: {ActivitySetting},
  data () {
    return {
      activityId: this.$route.query.activityId || null,
      mainLoading: false, // 详情的加载
      saveLoading: false, // 保存的加载
      formData: {
        activityName: '', // 活动名称
        rangeType: 0, // 店铺类型  0：全部店铺 1：指定店铺
        rangeShopIds: [], // 指定店铺ID集合 指定店铺ID集合，不同ID用逗号隔开 rangeType=1时此字段必填
        activityAdv: '', // 广告语
        timeArr: [], // 活动时间
        startTime: '', // 活动开始时间
        endTime: '', // 活动结束时间
        itemArray: [] // 活动项设置
      },
      // formRules: {
      //   activityName: [{required: true, message: '请输入活动名称', trigger: 'blur'}],
      //   timeArr: [{required: true, message: '请选择活动有效期', trigger: 'change'}],
      //   rangeType: [{required: true, message: '请选择使用范围', trigger: 'change'}],
      //   activityAdv: [{required: true, message: '请输入广告语', trigger: 'blur'}],
      //   itemArray: [{required: true, message: '请添加活动设置', trigger: 'change'}]
      // },

      shopList: [] // 店铺列表
    }
  },
  beforeRouteEnter (to, from, next) {
    // 获得上一级的路径
    if (from.path === '/marketingModule/couponModule/couponEdit') {
      // 从优惠券新增页面
    } else {
      sessionStorage.removeItem('scanGiftInfo')
    }
    next()
  },
  created () {
    let info = sessionStorage.getItem('scanGiftInfo') ? JSON.parse(sessionStorage.getItem('scanGiftInfo')) : null
    sessionStorage.removeItem('scanGiftInfo')
    if (info) {
      this.formData = info
      return false
    }
    if (this.activityId) {
      this.getDetail()
    }
  },
  methods: {
    // 获得列表
    async getDetail () {
      this.mainLoading = true
      let res = await this.$post('scanActivity/detail.do', {activityId: this.activityId})
      this.mainLoading = false
      if (parseInt(res.code) === 1) {
        this.formData = res.data
        // this.formData.timeArr = []
        // this.formData.timeArr.push(this.$moment(this.formData.startTime).format('YYYY-MM-DD HH:mm:ss'))
        // this.formData.timeArr.push(this.$moment(this.formData.endTime).format('YYYY-MM-DD HH:mm:ss'))
        this.formData.rangeType = this.formData.activityRangeType
        this.formData.rangeShopIds = this.formData.rangeShopIds || []
        delete this.formData.activityRangeType
        delete this.formData.totalOrderNum
        delete this.formData.totalOrderPrice
        delete this.formData.status
        this.formData = JSON.parse(JSON.stringify(this.formData))
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
    /*width: 600px;*/
    margin-top: 20px;
    .tip{
      position: absolute;
      left: 92%;
      top: 0;
      display: inline-block;
      width: 200px;
    }
  }
  .shopName{
    &+.shopName{
      &:before{
        content: '、';
      }
    }
  }
  .radioItem{
    /*width: 340px;*/
    display: inline-block;
    .el-select {
      margin-left: 10px;
      width: 270px;
      vertical-align: top;
    }
  }

</style>
