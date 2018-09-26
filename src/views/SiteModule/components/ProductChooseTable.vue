<!-- 商品添加的表格 -->
<template>
  <div class="detailTable">
    <el-row class="btn-Wrap">
      <el-button icon="el-icon-plus" @click="toShowDialog">选择商品</el-button>
    </el-row>
    <el-table :data="listData" style="width: 100%">
      <el-table-column align="center" prop="title" label="排序" width="100px" v-if="showSort">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.sort" :maxlength="4"
                    @input="numberSet(scope.row.sort, scope.row, 'sort')"
                    @blur="blurSort(scope.row.sort, scope.row, 'sort')"> </el-input>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="page_id" label="商品名称" width="260px">
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
      <el-table-column align="center" prop="shopName" label="店铺名称"> </el-table-column>
      <el-table-column align="center" prop="price" label="价格" width="100px"> </el-table-column>
      <el-table-column align="center" prop="goodsStore" label="库存" width="100px"> </el-table-column>
      <el-table-column align="center" label="操作" width="100px">
        <template slot-scope="scope">
          <span class="v-red v-text-cursor" @click="toDelete(scope.$index)">移除</span>
        </template>
      </el-table-column>
    </el-table>
    <ProductChoose v-model="showDialog" :chooseId="chooseId" :chooseSingle="chooseSingle" :reqUrl="url"
                   @success="saveChooseGoods"/>
  </div>
</template>

<script>
import ProductChoose from '@/components/ProductChoose'

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
    showActivity: { // 是否显示已参加其他活动的、禁用
      type: Boolean,
      default: false
    },
    showSort: { // 是否显示排序
      type: Boolean,
      default: true
    },
    moduleType: { // 类型 2:普通商品 4:拼团商品 5:秒杀商品
      type: Number,
      default: 2
    },
    url: {
      type: String,
      default: 'selector/goSelectGoods.do'
    }
  },
  data () {
    return {
      chooseId: '', // 当前列表的goodsId
      showDialog: false // 是否打开商品选择器弹窗
    }
  },
  methods: {
    numberSet (value, item, itemName, isMoney = false) {
      this.$numInput(value, item, itemName, isMoney, this)
    },
    // 排序鼠标移开
    blurSort (value, item, itemName) {
      if (!value) {
        item[itemName] = 0 + ''
      }
      this.listData.sort(this.compare('sort'))
    },
    // 降序排序
    compare (property) {
      return (a, b) => {
        let value1 = Number(a[property] || 0)
        let value2 = Number(b[property] || 0)
        return value2 - value1
      }
    },
    // 删除
    toDelete (index) {
      this.listData.splice(index, 1)
      this.$emit('getList', this.listData)
    },
    // 显示添加的选择商品弹窗
    toShowDialog () {
      let goodsArr = []
      this.listData.map(item => {
        goodsArr.push(item.goodsId)
      })
      this.chooseId = goodsArr.join(',')
      this.showDialog = true
    },
    // 获得选中的商品数组
    saveChooseGoods (goodsIdArr, goodsArr) {
      console.log(goodsIdArr, goodsArr)
      // this.listData = this.listData.concat(goodsArr)
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
        this.listData.sort(this.compare('sort'))
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
