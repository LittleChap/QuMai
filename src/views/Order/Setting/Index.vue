<!-- 订单设置 -->
<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>订单</el-breadcrumb-item>
      <el-breadcrumb-item>订单设置</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="v-wrap listWrap" v-loading="mainLoading">
      <div>
        <h3 class="v-title">订单设置</h3>
      </div>
      <el-form :model="setting" :rules="rules" ref="formDataRef" label-width="150px" @submit.native.prevent>
        <el-form-item label="订单待付款时间" prop="order_wait_pay_time">
          <el-input v-model="setting.order_wait_pay_time" :maxlength="14" size="small" style="width: 400px"
                    @input="checkInput(arguments[0], 'order_wait_pay_time')">
            <template slot="append">
              <div class="slotAppend">分钟</div>
            </template>
          </el-input>
          默认30分钟，超过设置时间订单关闭
        </el-form-item>

        <el-form-item label="订单确认收货时间" prop="order_wait_receive_time">
          <el-input v-model="setting.order_wait_receive_time" :maxlength="14" size="small" style="width: 400px"
                    @input="checkInput(arguments[0], 'order_wait_receive_time')">
            <template slot="append">
              <div class="slotAppend">天</div>
            </template>
          </el-input>
          默认15天，超过设置时间订单确认收货
        </el-form-item>

        <el-form-item label="订单自动好评时间" prop="order_auto_valuate_time">
          <el-input v-model="setting.order_auto_valuate_time" :maxlength="14" size="small" style="width: 400px"
                    @input="checkInput(arguments[0], 'order_auto_valuate_time')">
            <template slot="append">
              <div class="slotAppend">小时</div>
            </template>
          </el-input>
          默认72小时，超过设置时间系统自动5星好评
        </el-form-item>

        <el-form-item label="订单关闭追评时间" prop="order_auto_close_valuate_time">
          <el-input v-model="setting.order_auto_close_valuate_time" :maxlength="14" size="small" style="width: 400px"
                    @input="checkInput(arguments[0], 'order_auto_close_valuate_time')">
            <template slot="append">
              <div class="slotAppend">小时</div>
            </template>
          </el-input>
          默认72小时，订单评价后超过设置时间订单无法追评并无法申请售后
        </el-form-item>

        <el-form-item label="订单发货时间" prop="order_deliver_time">
          <el-input v-model="setting.order_deliver_time" :maxlength="14" size="small" style="width: 400px"
                    @input="checkInput(arguments[0], 'order_deliver_time')">
            <template slot="append">
              <div class="slotAppend">小时</div>
            </template>
          </el-input>
          默认48小时，用户客户端展示
        </el-form-item>

        <!--<el-form-item label="停止售后时间" prop="name">-->
        <!--<el-input v-model="setting.name" :maxlength="14" size="small" style="width: 400px"-->
        <!--@input="checkInput(arguments[0], 'order_wait_pay_time')">-->
        <!--<template slot="prepend">确认收货后</template>-->
        <!--<template slot="append">-->
        <!--<div class="slotAppend">天</div>-->
        <!--</template>-->
        <!--</el-input>-->
        <!--默认15天，超过设置时间无法发起售后-->
        <!--</el-form-item>-->
      </el-form>
      <el-button type="primary" @click="toSave">保存</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'order-detail',
  components: {},
  data () {
    return {
      mainLoading: false,
      setting: {},
      rules: {}
    }
  },
  created () {
    this.loadSetting()
  },
  methods: {
    // 检查输入合法性
    checkInput (num, keyName) {
      let n = num.replace(/[^\d]/g, '')
      this.$nextTick(() => {
        this.setting[keyName] = n
      })
    },
    async loadSetting () {
      let url = 'setting/input.do'
      let body = {plugin_id: 'timerSettingPlugin'}
      let res = await this.$post(url, body)
      if (+res.code === 1) {
        this.setting = JSON.parse(res.data.configValueMap.order_timer_setting)
        // console.log('控制台打印:', this.setting)
      } else {
        this.$message.error('系统出错:' + res.message)
      }
    },
    async toSave () {
      let url = 'setting/save.do'
      let body = {
        plugin_id: 'timerSettingPlugin',
        'order_timer_setting.order_wait_pay_time': this.setting.order_wait_pay_time,
        'order_timer_setting.order_wait_receive_time': this.setting.order_wait_receive_time,
        'order_timer_setting.order_deliver_time': this.setting.order_auto_valuate_time,
        'order_timer_setting.order_auto_close_valuate_time': this.setting.order_auto_close_valuate_time,
        'order_timer_setting.order_auto_valuate_time': this.setting.order_deliver_time
      }
      let res = await this.$post(url, body)
      if (+res.code === 1) {
        // console.log(res)
        this.$message.success('保存成功!')
      } else {
        this.$message.error('系统出错:' + res.message)
      }
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import '~@/styles/common.scss';

  .w400 {
    width: 400px;
  }

  .slotAppend {
    width: 25px;
    text-align: center;
  }
</style>
