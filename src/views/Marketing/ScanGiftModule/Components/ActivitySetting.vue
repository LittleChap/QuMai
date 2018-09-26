<!-- 活动设置表格 -->
<template>
  <div class="activeTable">
    <el-table :data="listData">
      <el-table-column align="center" label="层级" width="60px">
        <template slot-scope="scope">
          {{scope.$index + 1}}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="couponName" label="活动门槛" width="180px" class-name="v-input-box">
        <template slot-scope="scope">
          <div class="v-input-item">
            订单满
            <el-input v-if="!readonly" size="mini" v-model="scope.row.thresholdPrice" :class="{'v-border-red': scope.row.moneyError && scope.row.moneyError !== '' }"
                      @input="numberSet(scope.row.thresholdPrice, scope.row, 'thresholdPrice', true)"
                      @blur="getMoney(scope.row.thresholdPrice, scope.row, scope.$index)"> </el-input>
            <span v-else>{{scope.row.thresholdPrice}}</span>
            元
            <span class="v-input-error el-form-item__error" style="left: 64px"
                  v-if="scope.row.moneyError">{{scope.row.moneyError}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column v-if="!readonly" align="left" prop="shopName" label="优惠类型" min-width="100px"  class-name="v-input-box">
        <template slot-scope="scope">
          <div class="v-input-item">
            <!--<el-select v-model="scope.row.sendType" placeholder="请选择" size="mini" style="width: 120px" @change="getNum(scope.row, scope.$index, true)">
              <el-option label="送积分" :value="0"> </el-option>
              <el-option label="送优惠券" :value="1"> </el-option>
            </el-select>-->
            <div class="radioItem">
              <el-radio v-model="scope.row.sendType" :label="0" @change="getNum(scope.row, scope.$index, true)" style="margin-right: 22px">送积分</el-radio>
              <el-input size="mini" :disabled="scope.row.sendType !== 0" v-model="scope.row.sendPoint" @input="numberSet(scope.row.sendPoint, scope.row, 'sendPoint', true)" @blur="getNum(scope.row, scope.$index)" :class="{'v-border-red': scope.row.sendType === 0 &&scope.row.typeError && scope.row.typeError !== '' }"> </el-input> 分
            </div>
            <div class="radioItem">
              <el-radio v-model="scope.row.sendType" :label="1" @change="getNum(scope.row, scope.$index, true)"  style="margin-right: 8px">送优惠券</el-radio>
              <el-select  :disabled="scope.row.sendType !== 1" v-model="scope.row.sendCouponArray" value-key="couponSn" @change="getNum(scope.row, scope.$index)" multiple collapse-tags filterable placeholder="请选择" size="mini" style="width: 250px">
                <el-option v-for="(item, i) in couponList" :key="i" :label="item.couponName" :value="item" > {{item.couponName}}
                  <span class="v-blue" v-if="item.status === 1">（未开始）</span>
                  <span class="v-blue" v-if="item.status === 2">（进行中）</span>
                  <span class="v-red" v-if="item.status === 4">（已结束）</span>
                  <span class="v-red" v-if="item.status === 8">（已停止）</span>
                  <span class="v-red" v-if="item.status === 16">（已撤回）</span>
                </el-option>
              </el-select>
              <el-button type="text" size="mini" @click="toAddCoupon">新增</el-button>
            </div>
            <!--<el-table v-show="scope.row.sendType === 1" :data="scope.row.sendCouponArray" class="tableBox">
              <el-table-column align="left" prop="couponName" label="优惠券名称"> </el-table-column>
              <el-table-column align="center" label="状态">
                <template slot-scope="scope">
                  <span v-if="scope.row.status === 1">未开始</span>
                  <span v-if="scope.row.status === 2">进行中</span>
                  <span v-if="scope.row.status === 4">已结束</span>
                  <span v-if="scope.row.status === 8">已停止</span>
                  <span v-if="scope.row.status === 16">已撤回</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                  <router-link :to="`/marketingModule/couponModule/couponDetail?couponSn=${scope.row.couponSn}`"> <span class="v-blue v-text-cursor" >查看</span> </router-link>
                  <i class="v-blue v-separator">|</i>
                  <span class="v-red v-text-cursor">删除</span>
                </template>
              </el-table-column>
            </el-table>-->
            <span class="v-input-error el-form-item__error" :style="`left:${scope.row.sendType === 1 ? 'left: 64px' : '0'}`" v-if="scope.row.typeError">{{scope.row.typeError}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column v-if="readonly" align="left" prop="shopName" label="优惠类型" min-width="100px"  class-name="v-input-box">
        <template slot-scope="scope">
          <div class="v-input-item">
            <!--<el-select v-model="scope.row.sendType" placeholder="请选择" size="mini" style="width: 120px" @change="getNum(scope.row, scope.$index, true)">
              <el-option label="送积分" :value="0"> </el-option>
              <el-option label="送优惠券" :value="1"> </el-option>
            </el-select>-->
            <div class="radioItem" v-if="scope.row.sendType === 0">
              <el-radio v-model="scope.row.sendType" :label="0" @change="getNum(scope.row, scope.$index, true)" style="margin-right: 22px">送积分</el-radio>
              {{scope.row.sendPoint}} 分
            </div>
            <div class="radioItem" v-if="scope.row.sendType === 1">
              <el-radio v-model="scope.row.sendType" :label="1" @change="getNum(scope.row, scope.$index, true)"  style="margin-right: 8px">送优惠券</el-radio>
              <div>
                <span class="couponName" v-for="(item, i) in scope.row.sendCouponArray" :key="i">
                  {{item.couponName}}
                  <i class="v-blue" v-if="item.status === 1">（未开始）</i>
                  <i class="v-blue" v-if="item.status === 2">（进行中）</i>
                  <i class="v-red" v-if="item.status === 4">（已结束）</i>
                  <i class="v-red" v-if="item.status === 8">（已停止）</i>
                  <i class="v-red" v-if="item.status === 16">（已撤回）</i>
                </span>
              </div>
            </div>
            <!--<el-table v-show="scope.row.sendType === 1" :data="scope.row.sendCouponArray" class="tableBox">
              <el-table-column align="left" prop="couponName" label="优惠券名称"> </el-table-column>
              <el-table-column align="center" label="状态">
                <template slot-scope="scope">
                  <span v-if="scope.row.status === 1">未开始</span>
                  <span v-if="scope.row.status === 2">进行中</span>
                  <span v-if="scope.row.status === 4">已结束</span>
                  <span v-if="scope.row.status === 8">已停止</span>
                  <span v-if="scope.row.status === 16">已撤回</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                  <router-link :to="`/marketingModule/couponModule/couponDetail?couponSn=${scope.row.couponSn}`"> <span class="v-blue v-text-cursor" >查看</span> </router-link>
                  <i class="v-blue v-separator">|</i>
                  <span class="v-red v-text-cursor">删除</span>
                </template>
              </el-table-column>
            </el-table>-->
            <span class="v-input-error el-form-item__error" :style="`left:${scope.row.sendType === 1 ? 'left: 64px' : '0'}`" v-if="scope.row.typeError">{{scope.row.typeError}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="120px" v-if="!readonly">
        <template slot-scope="scope">
          <span class="v-red v-text-cursor" @click="toDelete(scope.$index)">删除</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="btnWrap"  v-if="!readonly">
      <el-button type="text" @click="toAdd"><i class="el-icon-plus"></i> 添加层级</el-button>
      （最多可以设置五个层级，只会同时满足活动门槛最高的优惠类型）
    </div>
    <span class="v-input-error el-form-item__error" v-if="thresholdErr" >{{thresholdErr}}</span>
  </div>
</template>

<script>
export default {
  name: 'activity-setting',
  props: {
    listData: {
      type: Array,
      default: () => []
    },
    formData: {
      type: Object,
      default: () => {}
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      thresholdErr: '', // 层级是否是一层一层高的
      couponList: [] // 优惠券列表
    }
  },
  created () {
    this.getCouponList()
  },
  methods: {
    // 获得优惠券类别
    async getCouponList () {
      let reqData = {
        currentPage: 1,
        showCount: 100000,
        status: ''
      }
      let res = await this.$post('couponFullcut/list.do', reqData)
      if (parseInt(res.code) === 1) {
        this.couponList = res.data.couponArray
      }
    },
    numberSet (value, item, itemName, isMoney = false) {
      this.$numInput(value, item, itemName, isMoney, this)
    },
    // 订单金额的输入
    getMoney (value, item, index, isNo) {
      if ((!value && value !== 0) || value === '') {
        item.moneyError = '请输入金额'
      } else {
        item.moneyError = null
      }
      this.listData.splice(index, 1, item)
      if (!isNo) { // 需要检查排序时
        return this.getMoneyOrder(value, item, index, true) && item.moneyError
      } else {
        return item.moneyError
      }
    },
    // 订单金额的排序
    getMoneyOrder (value, item, index, showTip) {
      let list = []
      this.listData.map(item => {
        let num = item.thresholdPrice ? Number(item.thresholdPrice) : ''
        list.push(num)
      })
      let isMiddle = true
      list.map((num, itemIndex) => {
        if (num === '') {
          return false
        }
        if (itemIndex < index && num >= Number(value)) {
          isMiddle = false
          return false
        }
        if (itemIndex > index && Number(value) >= num) {
          isMiddle = false
          return false
        }
      })
      if (!isMiddle) {
        if (showTip) this.$message.error('活动门槛需逐层提升')
        this.thresholdErr = '活动门槛需逐层提升'
      } else {
        this.thresholdErr = null
      }
      return this.thresholdErr
    },
    // 优惠类型的校验
    getNum (item, index, isNo) {
      if (isNo) {
        item.typeError = null
      } else if (item.sendType === 0 && (!item.sendPoint || item.sendPoint === '')) { // 选择积分 并没有输入积分
        item.typeError = '请输入积分'
      } else if (item.sendType === 0 && Number(item.sendPoint) === 0) { // 选择积分 并积分为0
        item.typeError = '请输入大于0的积分'
      } else if (item.sendType === 1 && (!item.sendCouponArray || !item.sendCouponArray.length)) { // 选择优惠券 还没有加入优惠券时
        item.typeError = '请添加优惠券'
      } else {
        item.typeError = null
      }
      this.listData.splice(index, 1, item)
      return item.typeError
    },
    // 添加层级
    toAdd () {
      if (this.listData.length >= 5) {
        this.$message.warning('最多可以设置五个层级!')
        return false
      }
      this.listData.push({
        thresholdPrice: '',
        sendType: 0,
        sendPoint: '',
        sendCouponArray: []
      })
    },
    // 删除层级
    toDelete (index) {
      this.listData.splice(index, 1)
    },
    // 校验表格的数据是否有填写
    validTable () {
      let valid = true
      this.listData.map((item, i) => {
        let priceError = this.getMoney(item.thresholdPrice, item, i, true)
        let priceOrderError = this.getMoneyOrder(item.thresholdPrice, item, i)
        let typeError = this.getNum(item, i)
        if (priceError || priceOrderError || typeError) valid = false
      })
      if (this.thresholdErr) {
        valid = false
      }
      return valid
    },
    // 新增优惠券
    toAddCoupon () {
      sessionStorage.setItem('scanGiftInfo', JSON.stringify(this.formData))
      this.$router.push('/marketingModule/couponModule/couponEdit')
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import '~@/styles/common.scss';

  .activeTable {
    width: 800px;
    line-height: 24px;
    .el-table {
      width: 100%;
      border: 1px solid $border-base;
      border-bottom: none
    }
    .el-input {
      width: 60px !important;
    }
    .chooseItem {
      display: inline-block;
      margin-left: 20px;
    }
    .tableBox {
      margin-top: 10px;
    }
  }
  .radioItem{
    &+.radioItem{
      margin-top: 10px;
    }
  }
  .couponName{
    &+.couponName{
      &:before{
        content: '、';
      }
    }
    i{
      font-style: normal;
    }
  }

  .btnWrap {
    border: 1px solid $border-base;
    border-top: none;
    padding: 0 16px;
    font-size: $font-default;
    color: $text-third
  }

</style>
