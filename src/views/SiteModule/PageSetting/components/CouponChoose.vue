<!-- 优惠券选择弹窗 -->
<template>
  <el-dialog title="选择优惠券" :visible="value" class="v-dialog v-max-height-body" append-to-body width="1000px" top="10vh" @close="beforeClose">
    <el-form :model="formData" :inline="true" label-width="90px" class="searchForm" @submit.native.prevent>
      <el-form-item label="优惠券名称">
        <el-input size="small" v-model=" formData.couponName" :maxlength="50"  @keyup.enter.native="toSearch"> </el-input>
      </el-form-item>
      <el-form-item label="优惠券号">
        <el-input size="small" v-model=" formData.couponSn" :maxlength="50"  @keyup.enter.native="toSearch"> </el-input>
      </el-form-item>
      <el-form-item label="发放时间">
        <el-date-picker size="small" v-model="formData.timeArr" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
      </el-form-item>
      <el-form-item label-width="10px">
        <el-button size="small"  @click="toSearch">查询</el-button>
      </el-form-item>
    </el-form>
    <p class="v-red" style="margin: 0 0 10px 0">温馨提示：只显示发放类型为领取发放的优惠券。</p>
    <el-table :data="listData" style="width: 100%; margin-bottom: 20px" v-loading="mainLoading">
      <el-table-column align="center" prop="couponSn" label="优惠券号"> </el-table-column>
      <el-table-column align="center" prop="couponName" label="优惠券名称"> </el-table-column>
      <el-table-column align="center" prop="goodsPrice" label="优惠券类型" width="100px">
        <template slot-scope="scope">
          <span v-if="scope.row.couponType === 0">满减券</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="发放主体" width="100px">
        <template slot-scope="scope">
          <span>{{scope.row.couponMainType ? `${scope.row.shopName || '店铺'}` : '平台'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" header-align="center" label="发放时间" width="174px">
        <template slot-scope="scope">
          {{$moment(scope.row.grantStartTime).format('YYYY-MM-DD HH:ss:mm')}} ~ {{$moment(scope.row.grantEndTime).format('YYYY-MM-DD HH:ss:mm')}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" width="70px">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 1">未开始</span>
          <span v-if="scope.row.status === 2">进行中</span>
          <span v-if="scope.row.status === 4">已结束</span>
          <span v-if="scope.row.status === 8">已停止</span>
          <span v-if="scope.row.status === 16">已撤回</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="modify_time" label="操作" width="80px">
        <template slot-scope="scope">
          <span class="chooseBtn active" v-show="isCheck(scope.row)" @click="toCheck(scope.row, false)">已选</span>
          <span class="chooseBtn" v-show="!isCheck(scope.row)" @click="toCheck(scope.row, true)">未选</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="v-pageBox" v-if="formData.totalResult">
      <el-pagination
        :current-page.sync="formData.currentPage"
        layout="total, prev, pager, next, jumper"
        :page-size="formData.showCount"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :total="formData.totalResult">
      </el-pagination>
    </div>
    <div class="v-dialog-footer">
      <el-button type="primary" @click="toSave">确 定</el-button>
      <el-button @click="beforeClose">取 消</el-button>
    </div>
    <div slot="footer"></div>
  </el-dialog>
</template>

<script>
export default {
  name: 'coupon-choose',
  props: {
    chooseId: { // 选中的id ，用逗号隔开
      type: String,
      default: ''
    },
    value: false // 显示与否
  },
  data () {
    return {
      mainLoading: false, // 加载页面
      listData: [], // 列表
      chooseIdArr: new Map(), // 选中的优惠券号的数组
      formData: { // 请求参数
        status: 2, // 进行中的状态
        couponName: '',
        couponSn: '',
        timeArr: [],
        grantStartTime: '',
        grantEndTime: '',
        currentPage: 1,
        showCount: 5,
        totalResult: 0
      }
    }
  },
  created () {},
  methods: {
    // 获得列表
    async getList () {
      let reqData = Object.assign({}, this.formData)
      reqData.catId = reqData.catIdArr && reqData.catIdArr.length ? reqData.catIdArr[reqData.catIdArr.length - 1] : ''
      reqData.shopIds = reqData.shopId
      delete reqData.totalResult
      delete reqData.catIdArr
      this.mainLoading = true
      let res = await this.$post('selector/goSelectCoupon.do', reqData)
      this.mainLoading = false
      if (parseInt(res.code) === 1) {
        this.listData = res.data.couponArray || []
        this.formData.totalResult = res.data.totalResult
      }
    },
    // 判断是否选中
    isCheck (row) {
      if (this.chooseIdArr.has(row.couponSn)) {
        this.chooseIdArr.set(row.couponSn, row)
      }
      return this.chooseIdArr.has(row.couponSn)
    },
    // 点击选中
    toCheck (item, isChecked) {
      if (!isChecked) { // 取消选中
        this.chooseIdArr.delete(item.couponSn)
        this.listData = JSON.parse(JSON.stringify(this.listData))
        return
      }
      // 选中
      if (this.chooseSingle) { // 单选 清掉其他数据
        this.chooseIdArr.clear()
      }
      this.chooseIdArr.set(item.couponSn, item)
      this.listData = JSON.parse(JSON.stringify(this.listData))
    },
    // 关闭弹窗
    beforeClose () {
      this.$emit('input', false)
      // this.toClear()
    },
    // 保存数据
    toSave () {
      if (!this.chooseIdArr.size) {
        this.$message.error('请选择数据')
        return
      }
      // console.log('数据', this.chooseIdArr.entries())
      let chooseArr = [] // 对象数组
      let chooseIds = [] // couponSn 数组
      this.chooseIdArr.forEach((value, key) => {
        chooseIds.push(key)
        chooseArr.push(value)
      })
      this.$emit('success', chooseIds, chooseArr)
      this.$emit('input', false)
      // this.toClear()
    },
    // 清楚数据
    toClear () {
      this.chooseIdArr.clear()
      this.formData = { // 请求参数
        status: 2, // 进行中的状态
        couponName: '',
        couponSn: '',
        timeArr: [],
        grantStartTime: '',
        grantEndTime: '',
        currentPage: 1,
        showCount: 5,
        totalResult: 0
      }
      this.getList()
    },
    // 查询
    toSearch () {
      this.formData.currentPage = 1
      this.getList()
    },
    // 当前页-页码修改
    handleCurrentChange (val) {
      this.formData.currentPage = val
      this.getList()
    },
    // 当前显示数量修改
    handleSizeChange (size) {
      this.formData.showCount = size
      this.formData.currentPage = 1
      this.getList()
    }
  },
  watch: {
    value (newValue, oldValue) {
      if (newValue) {
        this.toClear()
      }
      if (newValue && this.chooseId && this.chooseId !== '') { // 显示的时候
        let chooseArr = this.chooseId.split(',')
        this.chooseIdArr = new Map()
        chooseArr.map(data => {
          this.chooseIdArr.set(data, {couponSn: data})
        })
      }
    }
  }
}
</script>

<style scoped  lang="scss" rel="stylesheet/scss">
  @import '~@/styles/common.scss';
  .searchForm {
    .el-input {
      width: 300px !important;
    }
    .el-date-editor{
      width: 390px !important;
    }
    .el-form-item{
      margin-bottom: 10px;
    }
  }
  .chooseBtn{
    display: block;
    width: 50px;
    height: 26px;
    margin: 0 auto;
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

</style>
