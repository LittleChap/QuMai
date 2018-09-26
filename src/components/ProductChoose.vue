<!-- 商品选择器 -->
<template>
  <!--  商品选择器弹窗 -->
  <el-dialog :title="`选择商品${chooseSingle ?'（单选）' : ''}`" :visible="value" class="v-dialog v-max-height-body" append-to-body width="1000px" top="10vh" @close="beforeClose">
    <el-form :model="formData" :inline="true" label-width="70px" class="searchForm" @submit.native.prevent>
      <el-form-item label="分类">
        <el-cascader size="small" placeholder="请选择分类" clearable  expand-trigger="hover" :options="catList" :props="catProps" v-model="formData.catIdArr" change-on-select filterable > </el-cascader>
      </el-form-item>
      <el-form-item label="店铺">
        <el-select size="small" v-model="formData.shopId" clearable  placeholder="请选择店铺" filterable>
          <el-option v-for="(item, i) in shopList" :key="i" :label="item.shopName" :value="item.shopId" > </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品名">
        <el-input size="small" v-model=" formData.goodsName" :maxlength="50"  @keyup.enter.native="toSearch"> </el-input>
      </el-form-item>
      <el-form-item label="商品SKU">
        <el-input size="small" v-model=" formData.productSku" :maxlength="50"  @keyup.enter.native="toSearch"> </el-input>
      </el-form-item>
      <el-form-item label-width="10px">
        <el-button size="small"  @click="toSearch">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="listData" style="width: 100%; margin-bottom: 20px" v-loading="mainLoading">
      <el-table-column align="center" prop="page_id" label="商品名" width="260px">
        <template slot-scope="scope">
          <div class="goodsBox">
            <img :src="scope.row.goodsImage">
            <h4 class="textName">{{scope.row.goodsName}}</h4>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="规格">
        <template slot-scope="scope">
          <div class="textName">
            <span class="specName" v-for="(item, i) in scope.row.specArray" :key="i">{{item.specName}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="goodsPrice" label="价格" width="120px"> </el-table-column>
      <el-table-column align="center" prop="shopName" label="店铺" width="120px"> </el-table-column>
      <el-table-column align="center" prop="goodsStore" label="库存" width="70px"> </el-table-column>
      <el-table-column align="center" prop="modify_time" label="状态" width="80px">
        <template slot-scope="scope">
          <div v-if="showActivity">
            <span v-if="scope.row.activityType === 1">已参加秒杀活动</span>
            <span v-else-if="scope.row.activityType === 3">已参加拼团活动</span>
            <span class="chooseBtn active" v-show="scope.row.activityType === 0 && isCheck(scope.row)" @click="toCheck(scope.row, false)">已选</span>
            <span class="chooseBtn"  v-show="scope.row.activityType === 0 && !isCheck(scope.row)" @click="toCheck(scope.row, true)">未选</span>
          </div>
          <div v-if="!showActivity">
            <span class="chooseBtn active" v-show="isCheck(scope.row)" @click="toCheck(scope.row, false)">已选</span>
            <span class="chooseBtn"  v-show="!isCheck(scope.row)" @click="toCheck(scope.row, true)">未选</span>
          </div>
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
      <el-button type="primary" @click="toSave">{{saveBtnText}}</el-button>
      <el-button @click="beforeClose">取 消</el-button>
    </div>
    <div slot="footer"></div>
  </el-dialog>
</template>

<script>
export default {
  name: 'product-choose',
  props: {
    chooseId: { // 选中的id ，用逗号隔开
      type: String,
      default: ''
    },
    chooseSingle: { // 是否单选
      type: Boolean,
      default: false
    },
    saveBtnText: { // 确定按钮的文本
      type: String,
      default: '确 定'
    },
    showActivity: { // 是否显示已参加其他活动的、禁用
      type: Boolean,
      default: false
    },
    reqUrl: { // 请求商品列表的接口
      type: String,
      default: 'selector/goSelectGoods.do'
    },
    value: false // 显示与否
  },
  data () {
    return {
      mainLoading: false, // 加载页面
      listData: [], // 商品列表
      shopList: [], // 店铺列表
      catList: [], // 分类列表
      catProps: {
        value: 'catId',
        label: 'catName',
        children: 'goodsCatChildren'
      },
      chooseIdArr: new Map(), // 选中的商品的id数组
      formData: { // 请求参数
        catId: '',
        catIdArr: [],
        shopId: '',
        goodsName: '',
        goodsSn: '',
        productSku: '',
        currentPage: 1,
        showCount: 5,
        totalResult: 0
      }
    }
  },
  created () {
    this.getCatList()
  },
  methods: {
    // 获得列表
    async getList () {
      let reqData = Object.assign({}, this.formData)
      reqData.catId = reqData.catIdArr && reqData.catIdArr.length ? reqData.catIdArr[reqData.catIdArr.length - 1] : ''
      reqData.shopIds = reqData.shopId
      delete reqData.totalResult
      delete reqData.catIdArr
      this.mainLoading = true
      let res = await this.$post(this.reqUrl, reqData)
      this.mainLoading = false
      if (parseInt(res.code) === 1) {
        this.listData = res.data.goodsArray || []
        this.shopList = res.data.shopArray || []
        this.formData.totalResult = res.data.totalResult
      }
    },
    // 获得分类列表
    async getCatList () {
      let res = await this.$post('goodscat/list.do', {})
      if (parseInt(res.code) === 1) {
        res.data.goodsCatList.map(first => {
          if (!first.goodsCatChildren || !first.goodsCatChildren.length) {
            delete first.goodsCatChildren
            return
          }
          first.goodsCatChildren.map(second => {
            if (!second.goodsCatChildren || !second.goodsCatChildren.length) {
              delete second.goodsCatChildren
              return
            }
            second.goodsCatChildren.map(third => {
              if (!third.goodsCatChildren || !third.goodsCatChildren.length) {
                delete third.goodsCatChildren
                return
              }
              third.goodsCatChildren.map(forth => {
                if (!forth.goodsCatChildren || !forth.goodsCatChildren.length) {
                  delete forth.goodsCatChildren
                }
              })
            })
          })
        })
        this.catList = res.data.goodsCatList
      }
    },
    // 判断是否选中
    isCheck (row) {
      if (this.chooseIdArr.has(row.goodsId)) {
        this.chooseIdArr.set(row.goodsId, row)
      }
      return this.chooseIdArr.has(row.goodsId)
    },
    // 点击选中
    toCheck (item, isChecked) {
      if (!isChecked) { // 取消选中
        this.chooseIdArr.delete(item.goodsId)
        this.listData = JSON.parse(JSON.stringify(this.listData))
        return
      }
      // 选中
      if (this.chooseSingle) { // 单选 清掉其他数据
        this.chooseIdArr.clear()
      }
      this.chooseIdArr.set(item.goodsId, item)
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
      let chooseIds = [] // goodsId 数组
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
        catId: '',
        catIdArr: [],
        shopId: '',
        goodsName: '',
        goodsSn: '',
        productSku: '',
        currentPage: 1,
        showCount: 5
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
          this.chooseIdArr.set(Number(data), {goodsId: +data})
        })
      }
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import '~@/styles/common.scss';
  .searchForm {
    .el-input, .el-select, .el-cascader {
      width: 300px !important;
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
    line-height: 22px;
    max-height: 44px;
  }
  .specName{
    &+.specName{
      &:before{
        content: '、';
      }
    }
  }

</style>
