<!-- 拼团设置弹窗 -->
<template>
  <el-dialog title="拼团设置" v-if="value" :visible="value" class="v-dialog v-max-height-body settingGroupWrap" width="80%" top="10vh" @close="beforeClose"  :close-on-click-modal="false">
    <div v-for="(item, i) in goodsList" :key="i" class="goodsWrapItem">
      <div class="title">商品名称：{{item.goodsName}}</div>
      <el-table :data="item.groupItemArray" border class="tableBox" style="width: 100%" :highlight-current-row="false" :span-method="arraySpanMethod">
        <el-table-column align="center" label="拼团名称" width="160px">
          <template slot-scope="scope">
            <el-input size="small" :readonly="isOnlyReady" :maxlength="50" v-model="scope.row.groupName"> </el-input>
          </template>
        </el-table-column>
        <el-table-column align="center" label="活动标签" width="160px" :render-header="renderHeader">
          <template slot-scope="scope">
            <el-input size="small" :readonly="isOnlyReady" :maxlength="10" v-model="scope.row.groupLabel"> </el-input>
          </template>
        </el-table-column>
        <el-table-column align="center" label="拼团简介" width="160px">
          <template slot-scope="scope">
            <el-input size="small" :readonly="isOnlyReady" :maxlength="50" type="textarea" :row="2" v-model="scope.row.groupIntro"> </el-input>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="productName" label="商品规格"> </el-table-column>
        <el-table-column align="center" prop="productSku" label="商品SKU" width="130px"> </el-table-column>
        <el-table-column align="center" prop="productPrice" label="销售价" width="100px"> </el-table-column>
        <el-table-column align="center" prop="productPriceOriginal" label="原价" width="100px">
          <template slot-scope="scope">
            {{scope.row.productPriceOriginal ? scope.row.productPriceOriginal:''}}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="productStore" label="库存" width="100px"> </el-table-column>
        <el-table-column align="center" prop="groupPrice" label="拼团价" width="130px" class-name="v-input-box">
          <template slot-scope="scope">
            <div class="v-input-item">
              <el-input size="small" :readonly="isOnlyReady" :maxlength="10"  v-model="scope.row.groupPrice" :class="{'v-border-red': scope.row.groupPriceError && scope.row.groupPriceError !== '' }"
                        @input="numberSet(scope.row.groupPrice, scope.row, 'groupPrice', true)"
                        @blur="compareGroupPrice(scope.row)"> </el-input>
              <span class="v-input-error el-form-item__error" v-if="scope.row.groupPriceError">{{scope.row.groupPriceError}}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-form :model="formData" :rules="formRules" ref="formRef" label-width="140px" class="searchForm" v-loading="mainLoading" @submit.native.prevent>
      <el-form-item label="活动时间" prop="timeArr">
        <el-date-picker v-model="formData.timeArr" :readonly="isOnlyReady" size="small" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"  @change="timeChoose(0)"> </el-date-picker>
      </el-form-item>
      <el-form-item label="成团人数" prop="groupMemberNum">
        <el-input size="small" v-model="formData.groupMemberNum" :readonly="isOnlyReady" :maxlength="10" @input="numberSet(formData.groupMemberNum, formData, 'groupMemberNum', false)"> </el-input>
      </el-form-item>
      <el-form-item label="成团时间" prop="groupSuccessTime">
        <el-input size="small" v-model="formData.groupSuccessTime" :readonly="isOnlyReady" :maxlength="10" @input="numberSet(formData.groupSuccessTime, formData, 'groupSuccessTime', false)" style="margin-right: 10px"> </el-input> 小时
      </el-form-item>
      <el-form-item label="前端显示拼团数量" prop="h5ShowNum">
        <el-input size="small" v-model="formData.h5ShowNum" :readonly="isOnlyReady" :maxlength="10" @input="numberSet(formData.h5ShowNum, formData, 'h5ShowNum', false)"> </el-input>
        <el-tooltip class="item" effect="dark" content="拼团详情页显示的拼团数量" placement="right">
          <i class="el-icon-question toolTip" ></i>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="限制开团数量" prop="limitOpenGroupNum">
        <el-input size="small" v-model="formData.limitOpenGroupNum" :readonly="isOnlyReady" :maxlength="10" @input="numberSet(formData.limitOpenGroupNum, formData, 'limitOpenGroupNum', false)"> </el-input>
        <el-tooltip class="item" effect="dark" content="单帐号每种商品可以开团的数量，0代表不限制" placement="right">
          <i class="el-icon-question toolTip" ></i>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="限制参团数量" prop="limitAccessGroupNum">
        <el-input size="small" v-model="formData.limitAccessGroupNum" :readonly="isOnlyReady" :maxlength="10" @input="numberSet(formData.limitAccessGroupNum, formData, 'limitAccessGroupNum', false)"> </el-input>
        <el-tooltip class="item" effect="dark" content="单帐号每种商品可以参团的数量，0代表不限制" placement="right">
          <i class="el-icon-question toolTip" ></i>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="开启售后" prop="isOpenAftersale">
        <div class="radioItem">
          <el-radio v-model="formData.isOpenAftersale" :disabled="isOnlyReady" :label="1">开启</el-radio>
        </div>
        <el-radio v-model="formData.isOpenAftersale" :disabled="isOnlyReady" :label="0">关闭</el-radio>
      </el-form-item>
      <el-form-item label="模拟成团" prop="isOpenFalsegroup">
        <div class="radioItem">
          <el-radio v-model="formData.isOpenFalsegroup" :disabled="isOnlyReady" :label="1" @change="changeOpenFalseGroup">开启</el-radio>
          <el-input v-model="formData.falseGroupTime" size="small"  style="width: 80px"  :disabled="formData.isOpenFalsegroup!==1" @input="numberSet(formData.falseGroupTime, formData, 'falseGroupTime', false)"> </el-input>
          小时后自动成团
        </div>
        <el-radio v-model="formData.isOpenFalsegroup" :disabled="isOnlyReady" :label="0" @change="changeOpenFalseGroup">关闭</el-radio>
        <el-tooltip class="item" effect="dark" content="默认拼团时间到24小时还未成的团，系统将会模拟“匿名买家”凑满人数，使该团成团，不再触发自动退款。" placement="right">
          <i class="el-icon-question toolTip"></i>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="优惠券" prop="isOpenCoupon">
        <div class="radioItem">
          <el-radio v-model="formData.isOpenCoupon" :disabled="isOnlyReady" :label="1">开启</el-radio>
        </div>
        <el-radio v-model="formData.isOpenCoupon" :disabled="isOnlyReady" :label="0">关闭</el-radio>
        <el-tooltip class="item" effect="dark" content="开启后拼团订单可用优惠券" placement="right">
          <i class="el-icon-question toolTip"></i>
        </el-tooltip>
      </el-form-item>

      <el-form-item label="预热" prop="isOpenPreheat" class="is-required">
        <div class="radioItem">
          <el-radio v-model="formData.isOpenPreheat" :disabled="isOnlyReady" :label="1" @change="changePreheat">开启</el-radio>
          <el-date-picker v-model="formData.preheatTime" :disabled="formData.isOpenPreheat !== 1" :readonly="isOnlyReady" size="small" type="datetime"  value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间" @change="timeChoose(1)"> </el-date-picker>
          开始
        </div>
        <el-radio v-model="formData.isOpenPreheat" :disabled="isOnlyReady" :label="0" @change="changePreheat">关闭</el-radio>
      </el-form-item>
      <el-form-item label="留场" prop="isOpenStay" class="is-required">
        <div class="radioItem">
          <el-radio v-model="formData.isOpenStay" :disabled="isOnlyReady" style="margin-right: 10px" :label="1" @change="changeStay">开启</el-radio>
          显示至
          <el-date-picker v-model="formData.stayTime" :readonly="isOnlyReady" :disabled="formData.isOpenStay!==1" size="small" type="datetime"  value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间" @change="timeChoose(2)"> </el-date-picker>
        </div>
        <el-radio v-model="formData.isOpenStay" :disabled="isOnlyReady" :label="0" @change="changeStay">关闭</el-radio>
      </el-form-item>
    </el-form>
    <div class="v-dialog-footer">
      <el-button type="primary" v-if="!isOnlyReady" @click="toSave">保 存</el-button>
      <el-button @click="beforeClose">关 闭</el-button>
    </div>
    <div slot="footer"></div>
  </el-dialog>
</template>

<script>
export default {
  name: 'setting-activity-dialog',
  props: {
    groupId: { // 拼团的id // 没有就是新增
      type: Number,
      default: null
    },
    // maxGroupNum: {
    //   type: Number,
    //   default: null
    // },
    chooseGoodsList: { // 选中的商品数组
      type: Array,
      default: () => []
    },
    isOnlyReady: { // 是否只读
      type: Boolean,
      default: false
    },
    value: false // 显示与否
  },
  data () {
    let validatePreheatTime = (rule, value, callback) => {
      if (value === 1 && !this.formData.preheatTime) {
        callback(new Error('请设置预热开始时间'))
        return false
      }
      callback()
    }
    let validateStayTime = (rule, value, callback) => {
      if (value === 1 && !this.formData.stayTime) {
        callback(new Error('请设置留场结束时间'))
        return false
      }
      callback()
    }
    let validateOpenFalseGroup = (rule, value, callback) => {
      if (value === 1 && !this.formData.falseGroupTime) {
        callback(new Error('请设置模拟成团时间'))
        return false
      }
      if (value === 1 && this.formData.falseGroupTime <= 0) {
        callback(new Error('请输入大于0的正自然数'))
        return false
      }
      callback()
    }
    let validateGroupMemberNum = (rule, value, callback) => {
      if (value <= 1) {
        callback(new Error('请输入大于1的正自然数'))
        return false
      }
      if (this.maxGroupNum && value <= this.maxGroupNum) {
        callback(new Error(`成团人员需大于凑团虚拟人数（${this.maxGroupNum}人）`))
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
      mainLoading: false, // 加载页面
      goodsList: [], // 商品列表
      maxGroupNum: 0, // 凑团虚拟人数
      formData: { // 请求参数
        groupStartTime: '', // 活动开始时间
        groupEndTime: '', // 活动结束时间
        timeArr: [], // 活动结束时间
        isOpenAftersale: 0, // 是否开启售后 0：否 1：是
        isOpenCoupon: 0, // 是否开启优惠券 0：否 1：是
        isOpenPreheat: 0, // 是否开启预热 0：否 1：是
        preheatTime: '', // 预热开始时间
        isOpenStay: 0, // 是否开启留场 0：否 1：是
        stayTime: '', // 留场结束时间
        groupMemberNum: '', // 成团人数
        groupSuccessTime: '', // 成团时间
        h5ShowNum: '', // 前端显示拼团数量
        limitOpenGroupNum: '', // 限制开团数量
        limitAccessGroupNum: '', // 限制参团数量
        isOpenFalsegroup: 0, // 开启虚拟成团 0：否 1：是
        falseGroupTime: '' // 虚拟成团时间
      },
      formRules: {
        timeArr: [{required: true, message: '请选择活动时间', trigger: 'change'}],
        isOpenAftersale: [{required: true, message: '请设置是否开启售后', trigger: 'change'}],
        isOpenCoupon: [{required: true, message: '请设置是否开启优惠券', trigger: 'change'}],
        isOpenPreheat: [{validator: validatePreheatTime, trigger: 'change'}],
        isOpenStay: [{validator: validateStayTime, trigger: 'change'}],

        groupMemberNum: [{required: true, message: '请输入成团人数', trigger: 'blur'}, {validator: validateGroupMemberNum, trigger: 'blur'}],
        groupSuccessTime: [{required: true, message: '请输入成团时间', trigger: 'blur'}, {validator: validateNum, trigger: 'blur'}],
        h5ShowNum: [{required: true, message: '请输入前端显示拼团数量', trigger: 'blur'}, {validator: validateNum, trigger: 'blur'}],
        limitOpenGroupNum: [{required: true, message: '请输入限制开团数量', trigger: 'blur'}],
        limitAccessGroupNum: [{required: true, message: '请输入限制参团数量', trigger: 'blur'}],
        isOpenFalsegroup: [{required: true, message: '请设置是否开启模拟成团', trigger: 'blur'}, {validator: validateOpenFalseGroup, trigger: 'blur'}]
      }
    }
  },
  created () {
  },
  methods: {
    // 获得拼团详情
    async getDetail () {
      this.mainLoading = true
      let res = await this.$post('group/detail.do', {groupId: this.groupId})
      this.mainLoading = false
      if (parseInt(res.code) === 1) {
        this.maxGroupNum = res.data.gatherMemberNum
        this.formData.timeArr = []
        this.formData.timeArr.push(this.$moment(res.data.groupStartTime).format('YYYY-MM-DD HH:mm:ss'))
        this.formData.timeArr.push(this.$moment(res.data.groupEndTime).format('YYYY-MM-DD HH:mm:ss'))
        this.formData.isOpenAftersale = res.data.isOpenAftersale || 0
        this.formData.isOpenCoupon = res.data.isOpenCoupon || 0
        this.formData.isOpenPreheat = res.data.isOpenPreheat || 0
        this.formData.isOpenStay = res.data.isOpenStay || 0
        this.formData.stayTime = res.data.stayTime ? this.$moment(res.data.stayTime).format('YYYY-MM-DD HH:mm:ss') : ''
        this.formData.groupMemberNum = res.data.groupMemberNum || ''
        this.formData.groupSuccessTime = res.data.groupSuccessTime || ''
        this.formData.h5ShowNum = res.data.h5ShowNum || ''
        this.formData.limitOpenGroupNum = res.data.limitOpenGroupNum || ''
        this.formData.limitAccessGroupNum = res.data.limitAccessGroupNum || ''
        this.formData.isOpenFalsegroup = res.data.openFalseGroup || 0
        this.formData.falseGroupTime = res.data.falseGroupTime || ''
        this.formData.preheatTime = res.data.preheatTime ? this.$moment(res.data.preheatTime).format('YYYY-MM-DD HH:mm:ss') : ''
        this.goodsList = []
        let groupItemArray = res.data.groupItemArray
        groupItemArray[0].groupName = res.data.groupName
        groupItemArray[0].groupLabel = res.data.groupLabel
        groupItemArray[0].groupIntro = res.data.groupIntro
        this.goodsList.push({
          goodsName: res.data.goodsName,
          goodsId: res.data.goodsId,
          groupItemArray: groupItemArray
        })
      }
    },
    // 处理数据为要显示的结构
    setList (list) {
      this.goodsList = []
      list.map(item => {
        this.goodsList.push({
          goodsId: item.goodsId,
          goodsName: item.goodsName,
          groupItemArray: item.productArray
        })
      })
    },
    // 关闭弹窗
    beforeClose () {
      this.$emit('input', false)
      this.toClear()
    },
    // 保存数据
    toSave () {
      this.$refs.formRef.validate(async valid => {
        let validRes = await this.validTable()
        if (!valid || !validRes) {
          this.$message.error('请输入正确的数据！')
          return false
        }
        // 下面保存数据
        let groupArray = []
        this.goodsList.map(goodsItem => {
          let groupItemArray = []
          goodsItem.groupItemArray.map(async item => {
            groupItemArray.push({
              itemId: item.itemId, // 未知的字段
              productId: item.productId,
              itemPrice: item.groupPrice
            })
          })
          let obj = {
            goodsId: goodsItem.goodsId,
            groupId: this.groupId,
            groupName: goodsItem.groupItemArray[0].groupName,
            groupLabel: goodsItem.groupItemArray[0].groupLabel,
            groupIntro: goodsItem.groupItemArray[0].groupIntro,
            startTime: this.formData.timeArr[0],
            endTime: this.formData.timeArr[1],
            isOpenAftersale: this.formData.isOpenAftersale,
            isOpenCoupon: this.formData.isOpenCoupon || 0,
            isOpenPreheat: this.formData.isOpenPreheat,
            isOpenStay: this.formData.isOpenStay,
            stayTime: this.formData.stayTime,
            preheatTime: this.formData.preheatTime,
            groupSuccessTime: this.formData.groupSuccessTime,
            groupMemberNum: this.formData.groupMemberNum,
            h5ShowNum: this.formData.h5ShowNum,
            limitOpenGroupNum: this.formData.limitOpenGroupNum,
            limitAccessGroupNum: this.formData.limitAccessGroupNum,
            isOpenFalsegroup: this.formData.isOpenFalsegroup,
            falseGroupTime: this.formData.falseGroupTime,
            groupItemArray: groupItemArray
          }
          groupArray.push(obj)
        })
        let url = 'group/add.do'
        if (this.groupId) {
          url = 'group/edit.do'
        }
        let res = await this.$post(url, {groupArray: JSON.stringify(groupArray)})
        if (parseInt(res.code) === 1) {
          this.$emit('success', true)
          this.$emit('input', false)
          this.toClear()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 清楚数据
    toClear () {
      this.goodsList = [] // 商品列表
      this.formData = { // 请求参数
        groupStartTime: '', // 活动开始时间
        groupEndTime: '', // 活动结束时间
        timeArr: [], // 活动结束时间
        isOpenAftersale: 0, // 是否开启售后 0：否 1：是
        isOpenCoupon: 0, // 是否开启优惠券 0：否 1：是
        isOpenPreheat: 0, // 是否开启预热 0：否 1：是
        preheatTime: '', // 预热开始时间
        isOpenStay: 0, // 是否开启留场 0：否 1：是
        stayTime: '', // 留场结束时间
        groupMemberNum: '', // 成团人数
        groupSuccessTime: '', // 成团时间
        h5ShowNum: '', // 前端显示拼团数量
        limitOpenGroupNum: '', // 限制开团数量
        limitAccessGroupNum: '', // 限制参团数量
        isOpenFalsegroup: 0, // 开启虚拟成团 0：否 1：是
        falseGroupTime: '' // 虚拟成团时间
      }
    },
    // 合并单元格
    arraySpanMethod ({row, column, rowIndex, columnIndex}) {
      if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2 || columnIndex === 10) {
        if (rowIndex === 0) {
          return {
            rowspan: 1000,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    // 渲染表头 -- 跳转参数项
    renderHeader (createElement) {
      return createElement(
        'div',
        {
          'class': 'renderTableHead'
        },
        [
          createElement('span', {}, ['活动标签']
          ),
          createElement(
            'el-tooltip',
            {
              'class': 'renderTableHead',
              attrs: {
                content: '多个标签用分号隔开',
                placement: 'top'
              }
            },
            [
              createElement('i',
                {
                  'class': 'el-icon-question',
                  'style': 'font-size: 20px; margin-left: 10px'
                }, ['']
              )
            ]
          )
        ]
      )
    },
    // 限制输入数字、金额
    numberSet (value, item, itemName, isMoney) {
      this.$numInput(value, item, itemName, isMoney, this)
    },
    // 判断是否输入秒杀价
    compareGroupPrice (item, all) {
      if (Number(item.groupPrice) === 0) {
        item.groupPriceError = '拼团价必须大于0'
      } else if ((!item.groupPrice || item.groupPrice === '') && Number(item.groupPrice) !== 0) {
        item.groupPriceError = '请输入拼团价'
      } else {
        item.groupPriceError = ''
      }
      if (!all) this.renderList()
      return item.groupPriceError === ''
    },
    // 重新渲染列表
    renderList () {
      this.goodsList = JSON.parse(JSON.stringify(this.goodsList))
    },
    // 校验表格的数据是否有填写
    async validTable () {
      let valid = true
      this.goodsList.map(goodsItem => {
        goodsItem.groupItemArray.map(item => {
          let priceError = this.compareGroupPrice(item, true)
          if (!priceError) valid = false
        })
      })
      this.renderList()
      return valid
    },
    // 时间比较
    timeChoose (type) { // 0 是活动结束时间 1 是预热时间  2 是留场时间
      if (!this.formData.isOpenStay && !this.formData.isOpenPreheat) { // 没有设置留场和预热
        return false
      }
      if (!this.formData.timeArr || !this.formData.timeArr.length || this.formData.timeArr.length < 2) { // 没有设置活动时间
        return false
      }
      // 设置预热 没有设置时间
      if (this.formData.isOpenPreheat && !this.formData.preheatTime) { // 有设置预热
        return false
      }
      // 设置留场 没有设置时间
      if (this.formData.isOpenStay && !this.formData.stayTime) { // 有设置预热
        return false
      }
      // 设置预热 且 有时间
      if (type !== 2 && this.formData.isOpenPreheat && this.formData.preheatTime >= this.formData.timeArr[0]) {
        this.$alert('预热时间不能晚于活动开始时间', {
          confirmButtonText: '确 定',
          type: 'warning',
          callback: () => {
            if (type) {
              this.formData.preheatTime = ''
            } else {
              this.formData.timeArr = []
            }
          }
        })
      }
      // 设置预热 且 有时间
      if (type !== 1 && this.formData.isOpenStay && this.formData.timeArr[1] > this.formData.stayTime) {
        this.$alert('留场时间不能早于活动结束时间', {
          confirmButtonText: '确 定',
          type: 'warning',
          callback: () => {
            if (type) {
              this.formData.stayTime = ''
            } else {
              this.formData.timeArr = []
            }
          }
        })
      }
    },
    // 模拟成团 开关启用/ 关闭
    changeOpenFalseGroup (val) {
      if (val === 0) {
        this.$refs.formRef.validateField('isOpenFalsegroup')
      }
    },
    // 预热 开关启用/ 关闭
    changePreheat (val) {
      if (val === 0) {
        this.$refs.formRef.validateField('isOpenPreheat')
      }
    },
    // 留场 开关启用/ 关闭
    changeStay (val) {
      if (val === 0) {
        this.$refs.formRef.validateField('isOpenStay')
      }
    }
  },
  watch: {
    value (newValue, oldValue) {
      if (newValue && this.groupId) { // 编辑
        this.getDetail()
        return
      }
      // 新增的
      if (newValue && this.chooseGoodsList && this.chooseGoodsList.length) { // 显示的时候
        this.setList(this.chooseGoodsList)
      }
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import '~@/styles/common.scss';

  .searchForm {
    .el-input{
      width: 250px;
    }
    .el-range-editor {
       width: 400px;
    }
    .el-form-item{
      /*margin-bottom: 10px;*/
      line-height: 32px;
      height: 32px;
    }
  }
  .radioItem{
    width: 340px;
    display: inline-block;
    /*margin-right: 30px;*/
    .el-input {
      width: 80px;
    }
    .el-date-editor {
      width: 200px;
    }
  }
  .toolTip{
    font-size: 20px;
    margin-left: 10px;
    vertical-align: middle;
  }
  .goodsWrapItem{
    margin-bottom: 20px;
    .title{
      font-size: $font-size-base;
      margin-bottom: 6px;
      color: $text-second;
    }
    .tableBox{
      line-height: 24px;
    }
  }
  .chooseBtn{
    display: block;
    width: 50px;
    height: 26px;
    line-height: 24px;
    text-align: center;
    color: $text-second;
    border: 1px solid $border-base;
    font-size: $font-size-base;
    cursor: pointer;
    border-radius: 4px;
    &.active {
      color: $color-primary;
      border-color: $color-primary;
    }
  }
  .goodsBox{
    display: flex;
    align-items: center;
    img{
      width: 60px;
      height: 60px;
      margin-right: 10px;
    }
    h4{
      flex: 1;
      margin: 0;
      text-align: left;
    }
  }
  .textName{
    font-weight: normal;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  .specName{
    &+.specName{
      &:before{
        content: '、';
      }
    }
  }

</style>
<style lang="scss" rel="stylesheet/scss">
  .settingGroupWrap{
    .el-dialog__body{
      max-height: 70vh;
      overflow: auto;
    }
    .renderTableHead{
      height: 23px;
      line-height: 23px;
      vertical-align: top;
      span {
        vertical-align: top;
      }
    }
    .el-form-item__error{
      padding-top: 0;
    }
  }
</style>
