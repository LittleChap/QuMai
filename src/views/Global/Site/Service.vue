<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">全局</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/global/site/basic' }">站点设置</el-breadcrumb-item>
      <el-breadcrumb-item>客服设置</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="v-wrap detailWrap">
      <div>
        <h3 class="v-title">客服设置</h3>
        <!-- <el-from label-position="top" label-width="80px" > -->
          <div class="telWrap">
            <div class="telContent">
              <div class="telContentHead">
                <span class="title">电话客服</span>
                <el-switch
                  v-model="isPhoneOpen"
                  active-color="#13ce66"
                  inactive-color="#e6e6e6">
                </el-switch>
              </div>
              <div class="telContentBody">
                <el-form label-position="top" :rules='rules' ref="telForm" label-width="80px" :model="formData" @submit.native.prevent>
                  <el-form-item label="工作时间：">
                    <el-input class="input" v-model="formData.customer_service_working_time"></el-input>
                    <br>
                    <span class="v-red">请输入格式："周一至周日9:00~17:00"</span>
                  </el-form-item>
                  <el-form-item label="客服电话：" prop='customer_service_phone_number'>
                    <el-input class='input' v-model="formData.customer_service_phone_number"></el-input>
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </div>
          <div class="lineWrap">
            <div class="lineContent">
              <div class="lineContentHead">
                <span class="title">在线客服</span>
                <el-switch
                  v-model="isOnlineOpen"
                  active-color="#13ce66"
                  inactive-color="#e6e6e6">
                </el-switch>
              </div>
              <div class="lineContentBody">
                <el-form label-position="top" label-width="80px" :model="formData" @submit.native.prevent>
                  <el-form-item label="工作时间：">
                    <el-input class="input" v-model="formData.online_service_working_time"></el-input>
                    <br>
                    <span class="v-red">请输入格式："周一至周日9:00~17:00"</span>
                  </el-form-item>
                  <!-- <el-form-item label="在线电话："
                  prop='phone'
                  >
                    <el-input class='input' v-model.number="formData.online_service_phone_number"></el-input>
                  </el-form-item> -->
                </el-form>
              </div>
            </div>
          </div>
        <!-- </el-from> -->
      </div>
      <el-button type="success" @click='toSave()'>保 存</el-button>
    </div>
    <!-- <el-button  @click='check'>输出</el-button> -->
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data () {
    var checkPhone = (rule, value, callback) => {
      let phoneType = /^[1][3,5,8][0-9]{9}$/
      if (!value) {
        return callback(new Error('电话号码不能为空'))
      } else {
        if (isNaN(Number(value))) {
          callback(new Error('请输入数字值'))
        } else {
          if (!phoneType.test(value)) {
            callback(new Error('请输入正确的手机号码格式'))
          } else {
            callback()
          }
        }
      }
    }
    return {
      isPhoneOpen: false,
      isOnlineOpen: false,
      // value1: true,
      // value2: true,
      // 验证格式
      rules: {
        customer_service_phone_number: [
          {validator: checkPhone, type: 'number'}
          // { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ]
      },
      formData: {
        customer_service_phone_number: '',
        customer_service_working_time: '',
        is_online_service_open: '',
        is_phone_service_open: '',
        online_service_phone_number: '',
        online_service_working_time: ''
      },
      site_base_setting: {}
    }
  },
  methods: {
    async getDetail () {
      let data = {
        plugin_id: 'siteSettingPlugin'
      }
      this.mainLoading = true
      let res = await this.$post('setting/input.do', data)
      if (parseInt(res.code) === 1) {
        this.mainLoading = false
        this.formData = JSON.parse(res.data.configValueMap.customer_service_setting)
        this.site_base_setting = JSON.parse(res.data.configValueMap.site_base_setting)
        this.isPhoneOpen = this.transSwitch(this.formData.is_phone_service_open)
        this.isOnlineOpen = this.transSwitch(this.formData.is_online_service_open)
      } else {
        this.mainLoading = false
        this.$message.error(res.message)
      }
    },
    // 开关转换
    transSwitch (val) {
      if (val == 'on') {
        return true
      } else {
        return false
      }
    },
    // 开关转换为字符-上传
    SwitchTrans (val) {
      if (val) {
        return 'on'
      } else {
        return 'off'
      }
    },
    // 上传保存
    toSave () {
      let reqData = {
        plugin_id: 'siteSettingPlugin',
        'site_base_setting.shop_logo': this.site_base_setting.shop_logo,
        'site_base_setting.backend_login_logo': this.site_base_setting.backend_login_logo,
        'site_base_setting.seller_login_logo': this.site_base_setting.seller_login_logo,
        'site_base_setting.shop_name': this.site_base_setting.shop_name,
        'customer_service_setting.customer_service_working_time': this.formData.customer_service_working_time,
        'customer_service_setting.is_phone_service_open': this.SwitchTrans(this.formData.isPhoneOpen),
        'customer_service_setting.customer_service_phone_number': this.formData.customer_service_phone_number,
        'customer_service_setting.is_online_service_open': this.SwitchTrans(this.formData.isOnlineOpen),
        'customer_service_setting.online_service_working_time': this.formData.online_service_working_time,
        'customer_service_setting.online_service_phone_number': this.formData.online_service_phone_number
      }
      this.$refs.telForm.validate(async (isOk, obj) => {
        if (isOk) {
          let res = await this.$post('setting/save.do', reqData)
          if (parseInt(res.code) === 1) {
            this.$message.success('保存成功')
          } else {
            this.$message.error(res.message)
          }
        } else {
          this.$message.warning('请输入正确格式')
        }
      })
    }
  },
  created () {
    this.getDetail()
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import '~@/styles/common.scss';
  .input{
    width: 300px;
  }
  .telWrap,.lineWrap{
    width: 1000px;
    border: 1px solid #e6e6e6;
    margin-bottom: 30px;
  }
  .title{
    font-size: 15px;
  }
  .telContentHead,.lineContentHead{
    display: flex;
    justify-content: space-between;
    border-bottom: 3px solid #e6e6e6;
  }
  .telContentHead,.lineContentHead,.telContentBody,.lineContentBody{
    padding: 15px;
  }
</style>
