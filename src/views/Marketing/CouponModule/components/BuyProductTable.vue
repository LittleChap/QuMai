<!-- 购买指定商品的表格 -->
<template>
  <div class="detailTable">
    <el-row class="btn-Wrap" v-if="!readonly">
      <el-button icon="el-icon-plus" size="medium" @click="toShowDialog">选择商品</el-button>
    </el-row>
    <el-table :data="listData" style="width: 100%">
      <el-table-column align="center" label="商品名称" width="300px">
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
      <el-table-column align="center" label="购买数量" width="126px" class-name="v-input-box">
        <template slot-scope="scope">
          <div class="v-input-item">
            <el-input size="small" :maxlength="9"  v-model="scope.row.num" :class="{'v-border-red': scope.row.buyNumError && scope.row.buyNumError !== '' }"
                      @input="numberSet(scope.row.num, scope.row, 'num', true)"
                      @blur="compareBuyNum(scope.row, scope.$index)"> </el-input>
            <span class="v-input-error el-form-item__error" v-if="scope.row.buyNumError">{{scope.row.buyNumError}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="price" label="价格" width="100px"> </el-table-column>
      <el-table-column align="center" label="操作" width="100px" v-if="!readonly">
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
  name: 'buy-product-table',
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
    moduleType: { // 类型 2:普通商品 4:拼团商品 5:秒杀商品
      type: Number,
      default: 2
    },
    url: {
      type: String,
      default: 'selector/goSelectGoods.do'
    },
    readonly: { // 是否是只读的
      type: Boolean,
      default: false
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
    // 删除
    toDelete (index) {
      this.listData.splice(index, 1)
      this.$emit('getList', this.listData, null)
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
        this.$emit('getList', this.listData, goodsIds)
      } else {
        this.$message.error(res.message)
      }
    },
    // 判断是否输入购买数量
    compareBuyNum (item, index) {
      if (Number(item.num) === 0) {
        item.buyNumError = '购买数量必须大于0'
      } else if ((!item.num || item.num === '') && Number(item.num) !== 0) {
        item.buyNumError = '请输入购买数量'
      } else {
        item.buyNumError = ''
      }
      // if (!all) {
      this.listData.splice(index, 1, item)
      // }
      return item.buyNumError === ''
    },
    // 校验表格的数据是否有填写
    validTable () {
      let valid = true
      this.listData.map((item, i) => {
        let priceError = this.compareBuyNum(item, i)
        if (!priceError) valid = false
      })
      this.$emit('getList', this.listData)
      return valid
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import '~@/styles/common.scss';
  .detailTable {
    width: 800px;
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
