<!-- 秒杀设置弹窗 -->
<template>
  <el-dialog title="秒杀设置" v-if="value" :visible="value" class="v-dialog v-max-height-body settingSecKillWrap" width="80%" top="10vh" @close="beforeClose"  :close-on-click-modal="false">
    <div v-for="(item, i) in goodsList" :key="i" class="goodsWrapItem">
      <div class="title">商品名称：{{item.goodsName}}</div>
      <el-table :data="item.seckillItemArray" border class="tableBox" style="width: 100%" :highlight-current-row="false" :span-method="arraySpanMethod">
        <el-table-column align="center" label="秒杀名称" width="160px">
          <template slot-scope="scope">
            <el-input size="small" :readonly="isOnlyReady" :maxlength="50" v-model="scope.row.seckillName"> </el-input>
          </template>
        </el-table-column>
        <el-table-column align="center" label="活动标签" width="160px" :render-header="renderHeader">
          <template slot-scope="scope">
            <el-input size="small" :readonly="isOnlyReady" :maxlength="10" v-model="scope.row.seckillLabel"> </el-input>
          </template>
        </el-table-column>
        <el-table-column align="center" label="秒杀简介" width="160px">
          <template slot-scope="scope">
            <el-input size="small" :readonly="isOnlyReady" :maxlength="50" type="textarea" :row="2" v-model="scope.row.seckillIntro"> </el-input>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="productName" label="商品规格"> </el-table-column>
        <el-table-column align="center" prop="productSku" label="商品SKU" width="120px"> </el-table-column>
        <el-table-column align="center" prop="productPrice" label="销售价" width="80px"> </el-table-column>
        <el-table-column align="center" prop="productPriceOriginal" label="原价" width="80px">
          <template slot-scope="scope">
            {{scope.row.productPriceOriginal ? scope.row.productPriceOriginal:''}}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="productStore" label="库存" width="80px"> </el-table-column>
        <el-table-column align="center" prop="seckillPrice" label="秒杀价" width="130px" class-name="v-input-box">
          <template slot-scope="scope">
            <div class="v-input-item">
              <el-input size="small" :readonly="isOnlyReady" :maxlength="10"  v-model="scope.row.seckillPrice" :class="{'v-border-red': scope.row.seckillPriceError && scope.row.seckillPriceError !== '' }"
                        @input="numberSet(scope.row.seckillPrice, scope.row, 'seckillPrice', true)"
                        @blur="compareSeckillPrice(scope.row)"> </el-input>
              <span class="v-input-error el-form-item__error" v-if="scope.row.seckillPriceError">{{scope.row.seckillPriceError}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="seckillStore" label="活动库存" width="130px" class-name="v-input-box">
          <template slot-scope="scope">
            <div class="v-input-item">
              <el-input size="small" :readonly="isOnlyReady" :maxlength="10" v-model="scope.row.seckillStore" :class="{'v-border-red': scope.row.seckillStoreError && scope.row.seckillStoreError !== '' }"
                        @input="numberSet(scope.row.seckillStore, scope.row, 'seckillStore')"
                        @blur="compareStore(scope.row)"
              > </el-input>
              <span class="v-input-error el-form-item__error" v-if="scope.row.seckillStoreError">{{scope.row.seckillStoreError}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="seckillLimitNum" label="活动限购" width="130px">
          <template slot-scope="scope">
            <el-input size="small" :readonly="isOnlyReady" :maxlength="10" v-model="scope.row.seckillLimitNum" @input="numberSet(scope.row.seckillLimitNum, scope.row, 'seckillLimitNum')" > </el-input>
          </template>
        </el-table-column>

      </el-table>
    </div>
    <el-form :model="formData" :rules="formRules" ref="formRef" label-width="80px" class="searchForm" v-loading="mainLoading" @submit.native.prevent>
      <el-form-item label="活动时间" prop="timeArr">
        <el-date-picker v-model="formData.timeArr" :readonly="isOnlyReady" size="small" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"  @change="timeChoose(0)"> </el-date-picker>
      </el-form-item>
      <el-form-item label="开启售后" prop="isOpenAftersale">
        <el-radio v-model="formData.isOpenAftersale" :disabled="isOnlyReady" :label="1">开启</el-radio>
        <el-radio v-model="formData.isOpenAftersale" :disabled="isOnlyReady" :label="0">关闭</el-radio>
      </el-form-item>
      <el-form-item label="预热" prop="isOpenPreheat">
        <el-radio v-model="formData.isOpenPreheat" :disabled="isOnlyReady" :label="1">开启</el-radio>
        <el-radio v-model="formData.isOpenPreheat" :disabled="isOnlyReady" :label="0">关闭</el-radio>
      </el-form-item>
      <el-form-item label="留场" prop="isOpenStay">
        <el-radio v-model="formData.isOpenStay" :disabled="isOnlyReady" :label="1">开启</el-radio>
        <el-radio v-model="formData.isOpenStay" :disabled="isOnlyReady" :label="0">关闭</el-radio>
      </el-form-item>
      <el-form-item label="留场时间" prop="stayEndTime"  v-if="formData.isOpenStay">
        <el-date-picker v-model="formData.stayEndTime" :readonly="isOnlyReady" size="small" type="datetime"  value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间" @change="timeChoose(1)"> </el-date-picker>
      </el-form-item>
      <p class="v-red">温馨提示：秒杀商品不能使用优惠券</p>
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
    secKillId: { // 秒杀的id // 没有就是新增
      type: Number,
      default: null
    },
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
    return {
      mainLoading: false, // 加载页面
      goodsList: [], // 商品列表
      formData: { // 请求参数
        startTime: '', // 活动开始时间
        endTime: '', // 活动结束时间
        timeArr: [], // 活动结束时间
        isOpenAftersale: 0, // 是否开启售后 0：否 1：是
        isOpenPreheat: 0, // 是否开启预热 0：否 1：是
        isOpenStay: 0, // 是否开启留场 0：否 1：是
        stayEndTime: '' // 留场结束时间
      },
      formRules: {
        timeArr: [{required: true, message: '请选择活动时间', trigger: 'change'}],
        isOpenAftersale: [{required: true, message: '请设置是否开启售后', trigger: 'change'}],
        isOpenPreheat: [{required: true, message: '请设置是否开启预热', trigger: 'change'}],
        isOpenStay: [{required: true, message: '请设置是否开启留场', trigger: 'change'}],
        stayEndTime: [{required: true, message: '请设置留场结束时间', trigger: 'change'}]
      }
    }
  },
  created () {
    console.log('created')
    // if (this.secKillId) {
    //   this.getDetail()
    //   return
    // }
    // if (this.chooseGoodsList && this.chooseGoodsList.length) { // 显示的时候
    //   this.setList(this.chooseGoodsList)
    // }
  },
  methods: {
    // 获得秒杀详情
    async getDetail () {
      this.mainLoading = true
      let res = await this.$post('seckill/detail.do', {seckillId: this.secKillId})
      this.mainLoading = false
      if (parseInt(res.code) === 1) {
        this.formData.timeArr = []
        this.formData.timeArr.push(this.$moment(res.data.seckillStartTime).format('YYYY-MM-DD HH:mm:ss'))
        this.formData.timeArr.push(this.$moment(res.data.seckillEndTime).format('YYYY-MM-DD HH:mm:ss'))
        this.formData.isOpenAftersale = res.data.isOpenAftersale || 0
        this.formData.isOpenPreheat = res.data.isOpenPreheat || 0
        this.formData.isOpenStay = res.data.isOpenStay || 0
        this.formData.stayEndTime = res.data.stayEndTime ? this.$moment(res.data.stayEndTime).format('YYYY-MM-DD HH:mm:ss') : ''
        this.goodsList = []
        let seckillItemArray = res.data.seckillItemArray
        seckillItemArray[0].seckillName = res.data.seckillName
        seckillItemArray[0].seckillLabel = res.data.seckillLabel
        seckillItemArray[0].seckillLimitNum = res.data.seckillLimitNum
        seckillItemArray[0].seckillIntro = res.data.seckillIntro
        this.goodsList.push({
          goodsName: res.data.goodsName,
          goodsId: res.data.goodsId,
          seckillItemArray: seckillItemArray
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
          seckillItemArray: item.productArray
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
        let seckillArray = []
        this.goodsList.map(goodsItem => {
          let seckillItemArray = []
          goodsItem.seckillItemArray.map(async item => {
            seckillItemArray.push({
              itemId: item.itemId, // 未知的字段
              productId: item.productId,
              itemPrice: item.seckillPrice,
              itemStore: item.seckillStore
            })
          })
          let obj = {
            goodsId: goodsItem.goodsId,
            seckillId: this.secKillId,
            seckillName: goodsItem.seckillItemArray[0].seckillName,
            seckillLabel: goodsItem.seckillItemArray[0].seckillLabel,
            seckillIntro: goodsItem.seckillItemArray[0].seckillIntro,
            seckillLimitNum: goodsItem.seckillItemArray[0].seckillLimitNum || 0,
            startTime: this.formData.timeArr[0],
            endTime: this.formData.timeArr[1],
            isOpenAftersale: this.formData.isOpenAftersale,
            isOpenCoupon: this.formData.isOpenCoupon || 0,
            isOpenPreheat: this.formData.isOpenPreheat,
            isOpenStay: this.formData.isOpenStay,
            stayEndTime: this.formData.stayEndTime,
            seckillItemArray: seckillItemArray
          }
          seckillArray.push(obj)
        })
        let url = 'seckill/add.do'
        if (this.secKillId) {
          url = 'seckill/edit.do'
        }
        let res = await this.$post(url, {seckillArray: JSON.stringify(seckillArray)})
        if (parseInt(res.code) === 1) {
          this.$emit('success', true)
          this.$emit('input', false)
          this.toClear()
        } else {
          this.$message.error(res.message)
        }
      })
      // let idArr = [...this.choosePageIdArr]
      // this.$emit('success', true)
      // this.$emit('input', false)
      // this.toClear()
    },
    // 清楚数据
    toClear () {
      this.goodsList = [] // 商品列表
      this.formData = { // 请求参数
        startTime: '', // 活动开始时间
        endTime: '', // 活动结束时间
        timeArr: [], // 活动结束时间
        isOpenAftersale: 0, // 是否开启售后 0：否 1：是
        isOpenPreheat: 0, // 是否开启预热 0：否 1：是
        isOpenStay: 0, // 是否开启留场 0：否 1：是
        stayEndTime: '' // 留场结束时间
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
    compareSeckillPrice (item, all) {
      if (Number(item.seckillPrice) === 0) {
        item.seckillPriceError = '秒杀价必须大于0'
      } else if ((!item.seckillPrice || item.seckillPrice === '') && Number(item.seckillPrice) !== 0) {
        item.seckillPriceError = '请输入秒杀价'
      } else {
        item.seckillPriceError = ''
      }
      if (!all) this.renderList()
      return item.seckillPriceError === ''
    },
    // 判断输入的活动库存是否大于实际库存
    compareStore (item, all) {
      if (Number(item.seckillStore) === 0 && Number(item.productStore) > 0) {
        item.seckillStoreError = '活动库存必须大于0'
      } else if ((!item.seckillStore || item.seckillStore === '') && Number(item.seckillStore) !== 0) {
        item.seckillStoreError = '请输入活动库存'
      } else if (Number(item.seckillStore) > Number(item.productStore)) {
        item.seckillStoreError = '活动库存不得大于实际库存'
      } else {
        item.seckillStoreError = ''
      }
      if (!all) this.renderList()
      return item.seckillStoreError === ''
    },
    // 重新渲染列表
    renderList () {
      this.goodsList = JSON.parse(JSON.stringify(this.goodsList))
    },
    // 校验表格的数据是否有填写
    async validTable () {
      let valid = true
      this.goodsList.map(goodsItem => {
        goodsItem.seckillItemArray.map(item => {
          let priceError = this.compareSeckillPrice(item, true)
          if (!priceError) valid = false
          let storeError = this.compareStore(item, true)
          if (!storeError) valid = false
        })
      })
      this.renderList()
      return valid
    },
    // 时间比较
    timeChoose (type) { // 1 是留场时间  0 是活动结束时间
      if (!this.formData.isOpenStay) { // 没有设置留场
        return false
      }
      if (!this.formData.stayEndTime || !this.formData.timeArr || !this.formData.timeArr.length || this.formData.timeArr.length < 2) {
        return false
      }
      if (this.formData.timeArr[1] > this.formData.stayEndTime) {
        this.$alert('留场时间不能早于活动结束时间', {
          confirmButtonText: '确 定',
          type: 'warning',
          callback: () => {
            if (type) {
              this.formData.stayEndTime = ''
            } else {
              this.formData.timeArr = []
            }
          }
        })
      }
    }
  },
  watch: {
    value (newValue, oldValue) {
      if (newValue && this.secKillId) {
        this.getDetail()
        return
      }
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
      margin-bottom: 10px;
    }
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
  .settingSecKillWrap{
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
  }
</style>
