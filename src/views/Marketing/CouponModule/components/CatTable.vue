<!-- 购买指定商品的表格 -->
<template>
  <div class="detailTable">
    <el-row class="btn-Wrap" v-if="!readonly">
      <el-button icon="el-icon-plus" size="medium" @click="toAddCat">添加分类</el-button>
    </el-row>
    <el-table :data="listData" style="width: 100%">
      <el-table-column align="center" label="分类"  v-if="readonly">
        <template slot-scope="scope">
          {{scope.row.parentPath}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="分类" class-name="v-input-box" v-if="!readonly">
        <template slot-scope="scope">
          <div class="v-input-item">
            <el-cascader size="small" placeholder="请选择分类" clearable separator="》" expand-trigger="hover"
                         :class="{'v-border-red': scope.row.catIdError && scope.row.catIdError !== '' }"
                         :options="catList" :props="catProps" v-model="scope.row.catIdArr" change-on-select filterable
                         @blur="submitList"
                         @change="compareBuyNum(scope.row, scope.$index)"> </el-cascader>
            <!--<el-input size="small" :maxlength="9"  v-model="scope.row.buyNum" :class="{'v-border-red': scope.row.buyNumError && scope.row.buyNumError !== '' }"-->
                      <!--@input="numberSet(scope.row.buyNum, scope.row, 'buyNum', true)"-->
                      <!--@blur="compareBuyNum(scope.row, scope.$index)"> </el-input>-->
            <span class="v-input-error el-form-item__error" v-if="scope.row.catIdError">{{scope.row.catIdError}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="140px"  v-if="!readonly">
        <template slot-scope="scope">
          <span class="v-red v-text-cursor" @click="toDelete(scope.$index)">移除</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

export default {
  name: 'cat-table',
  components: {},
  props: {
    listData: {
      type: Array,
      default: () => []
    },
    readonly: { // 是否是只读的
      type: Boolean,
      default: false
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
      catList: [], // 分类列表
      catProps: {
        value: 'catId',
        label: 'catName',
        children: 'goodsCatChildren'
      }
    }
  },
  created () {
    this.getCatList()
  },
  methods: {
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
    // 添加
    toAddCat () {
      if (this.rangeUseType === 1 && (!this.shopIds || !this.shopIds.length)) {
        this.$message.error('请先选择店铺')
        return false
      }
      this.listData.push({
        catIdArr: []
      })
      this.submitList()
    },
    // 删除
    toDelete (index) {
      this.listData.splice(index, 1)
      this.submitList()
    },
    submitList () {
      this.$emit('getList', this.listData)
    },
    // 判断是否输入购买数量
    compareBuyNum (item, index) {
      if (!item.catIdArr || !item.catIdArr.length) {
        item.catIdError = '请选择分类'
      } else {
        item.catIdError = ''
      }
      this.listData.splice(index, 1, item)
      return item.catIdError === ''
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
    width: 600px;
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
  .el-cascader{
    width: 100% !important;
  }
</style>
