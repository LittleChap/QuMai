<!-- 推荐商品管理 -->
<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>运营</el-breadcrumb-item>
      <el-breadcrumb-item>推荐商品管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="v-wrap">
      <h3 class="v-title">推荐商品管理</h3>
      <div class="detailTable">
        <el-row class="btn-Wrap">
          <el-button icon="el-icon-plus" type="primary" plain @click="toAdd">添加</el-button>
          <el-button icon="el-icon-minus" type="warning" plain @click="multiDelete">删除</el-button>
          <div class="tips">小提示：客户端显示前15个商品</div>
        </el-row>
        <!--表格正文-->
        <el-table :data="listData" v-loading="mainLoading" style="width: 100%"
                  @selection-change="handleSelectionChange">
          <el-table-column align="center" type="selection" width="55"></el-table-column>
          <el-table-column align="center" type="index" label="序号" width="50"></el-table-column>
          <el-table-column align="center" prop="sort" label="排序"></el-table-column>
          <el-table-column align="center" label="商品名称" width="250">
            <template slot-scope="item">
              <div class="goodsWrap">
                <img :src="item.row.goods_image" alt="" class="goodsImg">
                <div class="goodsName">{{item.row.goods_name}}</div>
              </div>
            </template>
          </el-table-column>

          <el-table-column align="center" prop="brand_name" label="品牌"></el-table-column>
          <el-table-column align="center" prop="shop_name" label="店铺名称"></el-table-column>
          <el-table-column align="center" prop="goods_price" label="价格"></el-table-column>
          <el-table-column align="center" prop="goods_store" label="库存"></el-table-column>
          <el-table-column align="center" prop="goods_putaway_time" label="上架时间" width="150px">
            <template slot-scope="item">
              {{format(item.row.start_time)}}
            </template>
          </el-table-column>

          <el-table-column align="center" prop="goods_is_putaway" label="状态">
            <template slot-scope="item">
              <div v-if="item.row.goods_is_putaway === 1">上架</div>
              <div v-else class="red">下架</div>
            </template>
          </el-table-column>

          <el-table-column align="center" label="操作">
            <template slot-scope="item">
              <span class="v-blue v-text-cursor" @click="toView(item.row)">查看</span>
              <span class="v-red v-text-cursor" @click="singleDelete(item.row)">删除</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <ProductChoose v-model="showDialog" :chooseId="existIds" @success="getSelectedGoods"/>
  </div>
</template>

<script>
import ProductChoose from '@/components/ProductChoose'
export default {
  name: 'recommend-manage',
  components: {ProductChoose},
  data () {
    return {
      pageInfo: {
        currentPage: 1,
        showCount: 9999999,
        totalResult: 0
      },
      listData: [], // 列表数据
      mainLoading: false, // 列表的加载
      multiSelect: [],
      // 是否显示编辑弹窗
      showDialog: false,
      existIds: '' // 已经选过的id列表(拼接字符串)
    }
  },
  created () {
    this.getList()
  },
  methods: {
    // 格式化时间
    format (str) {
      return this.$moment(str).format('YYYY-MM-DD HH:mm:ss')
    },
    // 跳转到新增页
    toAdd () {
      let ids = this.listData.map(i => {
        return i.goods_id
      })
      this.existIds = ids.join(',')
      // console.log('控制台打印:', this.existIds)
      this.showDialog = true
    },
    // 跳转到编辑页
    toView (item) {
      this.$router.push('/goods/goods/goodsEdit?goodsId=' + item.id)
    },
    // 选中商品后
    async getSelectedGoods (arr) {
      let existArr = this.existIds.split(',')
      let diff = arr.filter(item => !existArr.includes(item + ''))
      // let url = 'goodsrecommend/save.do'
      let url = 'goodsrecommend/addGoods.do '
      let body = {
        goods_ids: diff.join(',')
      }
      let res = await this.$post(url, body)
      this.mainLoading = false
      if (+res.code === 1) {
        this.getList()
      } else {
        this.$message.error(res.message)
      }
      console.log('控制台打印:', res)
    },
    // 获得列表
    async getList () {
      this.mainLoading = true
      let res = await this.$post('goodsrecommend/list.do', this.pageInfo)
      this.mainLoading = false
      if (+res.code === 1) {
        this.listData = res.data.goodsRecommendList
      } else {
        this.$message.error(res.message)
      }
    },
    // 选中项 变化
    handleSelectionChange (val) {
      this.multiSelect = val
    },
    // 删除
    toDelete (rows) {
      if (!rows.length) {
        this.$message.error('请选择数据')
        return
      }
      let num = rows.length === 1 ? '' : rows.length
      this.$confirm(`确认删除这${num}个商品？`).then(async () => {
        let url = 'goodsrecommend/deleteAll.do'
        let ids = rows.map(item => {
          return item.id
        })
        // let body = {goods_ids: ids.join(',')}
        let body = {data_ids: ids.join(',')}
        let res = await this.$post(url, body)
        if (+res.code === 1) {
          this.$message.success('已删除!')
          this.getList()
        } else {
          this.$message.error(res.message)
        }
        // console.log(res)
      }).catch(() => {
      })
    },
    // 当条删除
    singleDelete (row) {
      this.toDelete([row])
    },
    // 多行删除
    multiDelete () {
      this.toDelete(this.multiSelect)
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import '~@/styles/common.scss';
  .red{
    color: #d73b3c;
  }
  .detailTable {
    /*width: 70%;*/
    margin-top: 20px;
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
  .tips{
    margin-left: 20px;
  }
  .goodsWrap{
    width: 200px;
    display: flex;
    align-items: center;
  }
  .goodsImg{
    display: block;
    flex-shrink: 0;
    width: 75px;
    height: 50px;
    background: #f5f5f5;
  }
  .goodsName{
    width: 150px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp:3;
    overflow: hidden;
    align-items: center;
    line-height: 20px;
    margin-left: 10px;
  }
</style>
