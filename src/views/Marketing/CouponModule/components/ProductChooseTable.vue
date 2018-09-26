<!-- 商品添加的表格 -->
<template>
  <div class="detailTable">
    <el-row class="btn-Wrap"  v-if="!readonly">
      <el-button icon="el-icon-plus"  size="medium" @click="toShowDialog">添加商品</el-button>
    </el-row>
    <el-table :data="listData" style="width: 100%">
      <el-table-column align="center" prop="page_id" label="商品名">
        <template slot-scope="scope">
          <div class="goodsBox">
            <img :src="scope.row.goodsImage">
            <h4 class="textName">{{scope.row.goodsName}}</h4>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="page_id" label="规格">
        <template slot-scope="scope">
          <div class="textName">
            <span class="specName" v-for="(item, i) in scope.row.specArray" :key="i">{{item.specName}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="shopName" label="店铺" width="150px"> </el-table-column>
      <el-table-column align="center" prop="price" label="价格" width="100px"> </el-table-column>
      <el-table-column align="center" prop="goodsStore" label="库存" width="100px"> </el-table-column>
      <el-table-column align="center" label="操作" width="100px" v-if="!readonly">
        <template slot-scope="scope">
          <span class="v-red v-text-cursor" @click="toDelete(scope.$index)">移除</span>
        </template>
      </el-table-column>
    </el-table>
    <ProductChoose  v-if="!readonly" v-model="showDialog" :chooseId="chooseId" :shopIds="shopIds" :chooseSingle="chooseSingle" :reqUrl="url"
                   @success="saveChooseGoods"/>
  </div>
</template>

<script>
import ProductChoose from './ProductChoose'

export default {
  name: 'product-choose-table',
  components: {ProductChoose},
  props: {
    listData: {
      type: Array,
      default: () => []
    },
    chooseSingle: { // 是否单选
      type: Boolean,
      default: false
    },
    moduleType: { // 类型 2:普通商品 4:拼团商品 5:秒杀商品
      type: Number,
      default: 2
    },
    readonly: { // 是否是只读的
      type: Boolean,
      default: false
    },
    url: {
      type: String,
      default: 'selector/goSelectGoods.do'
    },
    rangeUseType: { // 使用范围
      type: Number,
      default: 0
    },
    shopIds: { // 请求商品店铺
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      chooseId: '', // 当前列表的goodsId
      showDialog: false // 是否打开商品选择器弹窗
    }
  },
  methods: {
    // 删除
    toDelete (index) {
      this.listData.splice(index, 1)
      this.$emit('getList', this.listData)
    },
    // 显示添加的选择商品弹窗
    toShowDialog () {
      if (this.rangeUseType === 1 && (!this.shopIds || !this.shopIds.length)) {
        this.$message.error('请先选择店铺')
        return false
      }
      let goodsArr = []
      this.listData.map(item => {
        goodsArr.push(item.goodsId)
      })
      this.chooseId = goodsArr.join(',')
      this.showDialog = true
    },
    // 获得选中的商品数组
    saveChooseGoods (goodsIdArr, goodsArr) {
      this.getListById(goodsIdArr.join(','))
    },
    // 通过ids 获得商品列表
    async getListById (goodsIds) {
      let reqData = {
        goodsIds,
        moduleType: this.moduleType
      }
      let res = await this.$post('goods/getGoodsInfoByGoodsIds.do', reqData)
      if (parseInt(res.code) === 1) {
        let oldArr = [...this.listData]
        this.listData.length = 0
        res.data.goodsArray.map(item => {
          item.sort = ''
          let isSame = false
          oldArr.map(oldItem => {
            if (item.goodsId === oldItem.goodsId) {
              isSame = true
              this.listData.push(oldItem)
              return false
            }
          })
          if (!isSame) {
            this.listData.push(item)
          }
        })
        this.$emit('getList', this.listData)
      } else {
        this.$message.error(res.message)
      }
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import '~@/styles/common.scss';
  .detailTable {
    width: 900px;
    line-height: 24px;
    .el-table {
      border: 1px solid $border-base;
      border-bottom: none
    }
  }
  .btn-Wrap {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    border: 1px solid $border-base;
    border-bottom: none;
    .el-button {
      border-radius: 0;
      margin: -1px 0 -1px -1px;
    }
  }
  .goodsBox {
    display: flex;
    align-items: center;
    img {
      width: 60px;
      height: 60px;
      margin-right: 10px;
    }
    h4 {
      flex: 1;
      margin: 0;
      text-align: left;
    }
  }
  .textName {
    font-weight: normal;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    line-height: 22px;
    max-height: 44px;
  }
  .specName {
    & + .specName {
      &:before {
        content: '、';
      }
    }
  }
</style>
