<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>店铺</el-breadcrumb-item>
      <el-breadcrumb-item>店铺设置</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="v-wrap listWrap"  v-loading="mainLoading">
      <div>
        <h3 class="v-title">店铺设置</h3>
      </div>
      <el-form label-position='left' :rules="rules" :model="form" ref="shopForm" label-width="100px" size="small" class="v-form detailForm" @submit.native.prevent>
        <el-form-item label="卖家账号：" prop="mobile">
          <el-input v-model="form.mobile" rows="4" :maxlength="200" size="small" class="w400"></el-input>
          <span style="margin-left: 30px" class="v-red">卖家帐号为手机号，密码默认为123456</span>
        </el-form-item>

        <el-form-item label="店铺名称：" prop="shop_name">
          <el-input v-model="form.shop_name" rows="4" :maxlength="50" size="small" class="w400"></el-input>
        </el-form-item>

        <el-form-item label="阿里云对象存储容量：" prop="oss_size" label-width="180px">
          <el-input v-model="form.oss_size" rows="4" :maxlength="200" size="small" class="w400"></el-input>MB
        </el-form-item>
        <el-form-item label="店铺地址：" prop="address">
          <el-input v-model="form.address" rows="4" :maxlength="200" size="small" class="w400"></el-input>
        </el-form-item>

        <!--操作按钮-->
        <el-form-item label-width="30px">
          <el-button type="primary"  @click="toSave"  size="1">保 存</el-button>
          <!-- <el-button type="primary"   size="1">保 存</el-button> -->
          <el-button @click="$router.go(-1)" size="1">返 回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'shop-set',
  components: {},
  data () {
    var checkTel = (rule, value, callback) => {
      var telReg = /^[1][3,4,5,7,8][0-9]{9}$/
      if (!telReg.test(value)) {
        return callback(new Error('请输入正确的手机格式'))
      } else {
        callback()
      }
    }
    let validaNum = (rule, value, callback) => {
      let num = Number(value)
      if (isNaN(num)) {
        callback(new Error('请输入正确数值'))
      } else {
        callback()
      }
    }
    return {
      mainLoading: false,
      // 表单数据
      form: {
        mobile: '',
        shop_name: '',
        oss_size: 5120,
        address: '',
        shop_id: ''
      },
      // 表单验证
      rules: {
        mobile: [{required: true, message: '请输入卖家账号'}, {validator: checkTel}],
        shop_name: [{required: true, message: '请输入店铺名称'}],
        oss_size: [{required: true, message: '请输入对象存储容量'}, {validator: validaNum}],
        address: [{required: true, message: '请输入店铺地址'}]
      }
    }
  },
  created () {
    if (this.$route.query.shopId) {
      this.getData()
    }
    // console.log(this.$route.query.shopId)
  },
  mounted () {
    this.$refs.shopForm.resetFields()
  },
  methods: {
    // 获取数据
    async getData () {
      let res = await this.$post('shop/getDetail.do', {shop_id: this.$route.query.shopId})
      if (+res.code === 1) {
        this.form.mobile = res.data.shop.mobile
        this.form.shop_name = res.data.shop.shop_name
        this.form.oss_size = res.data.shop.oss_size
        this.form.shop_id = res.data.shop.shop_id
        this.form.address = res.data.shop.address
      } else {
        this.$message.error(res.message)
      }
    },
    // 保存
    toSave () {
      let url = 'shop/save.do'
      let reqData = Object.assign({}, this.form)
      if (this.$route.query.shopId) {
        url = 'shop/edit.do'
      } else {
        delete reqData.shop_id
      }
      this.$refs.shopForm.validate(async (isOk, obj) => {
        if (isOk) {
          let res = await this.$post(url, reqData)
          if (+res.code === 1) {
            this.$message.success('保存成功')
            setTimeout(() => {
              this.$router.go(-1)
            }, 1000)
          } else {
            this.$message.error(res.message)
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import '~@/styles/common.scss';
  .detailForm {
    margin-top: 20px;
    .w400 {
      width: 400px !important;
    }
  }
</style>
