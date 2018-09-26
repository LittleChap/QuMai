<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>会员</el-breadcrumb-item>
      <el-breadcrumb-item>评论管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="v-wrap listWrap">
      <div>
        <h3 class="v-title">评论管理</h3>
      </div>
      <!-- 表单-头 -->
      <el-form :model="formData" label-width="90px" class="v-form v-form-bg" @submit.native.prevent>
        <el-row>
          <el-col :span="5">
            <el-form-item label="商品名称" >
              <el-input v-model="formData.goods_name" @keyup.native.enter="toSearch"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="评论时间" >
              <el-date-picker v-model="formData.timeArr" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="商品SKU" >
              <el-input v-model="formData.product_sku" @keyup.native.enter="toSearch"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <el-form-item label="店铺名" >
              <el-select v-model="formData.shop_name" clearable  placeholder="请选择店铺" filterable>
                <el-option v-for="(item, i) in shopList" :key="i" :label="item" :value="item" > </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5" >
            <el-form-item label="会员昵称" >
              <el-input v-model="formData.nickname" @keyup.native.enter="toSearch"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="订单编号" >
              <el-input v-model="formData.order_sn" @keyup.native.enter="toSearch"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4" :offset="1">
            <div class="btnBox">
              <el-button type="primary" icon="el-icon-search" @click="toSearch">查询</el-button>
              <!-- <el-button type="primary" :loading="excelLoading"  @click="toExcel">导出</el-button> -->
            </div>
          </el-col>
        </el-row>
      </el-form>
      <!-- 表单-尾 -->
      <!-- 表格-头 -->
      <div class="detailTable">
        <el-row class="btn-Wrap">
          <!-- <el-button icon="el-icon-minus" type="warning" plain @click="toAllDelete" >删除</el-button> -->
          <el-button type="danger" plain @click="toAllDelete">删除</el-button>
          <!-- <el-button type="warning" plain @click="toRevoke">停止发放并撤回</el-button> -->
        </el-row>
        <el-table :data="listData" v-loading="mainLoading" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column align="center" type="selection" width="55"> </el-table-column>
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="top" size="mini" class="demo-table-expand">
                <el-form-item label="评分：">
                    <el-rate v-model="props.row.grade" disabled></el-rate>
                </el-form-item>
                <el-form-item label="评价：">
                    <span>{{ props.row.comtent }}</span>
                    <div class="imgPreview" v-if="props.row.comment_images && props.row.comment_images.length">
                      <!-- <vue-preview :slides="seeCommenImage(props.row.comment_images)" class="imgBox" @close="handleClose"></vue-preview> -->
                      <img v-for="item in props.row.comment_images" :key="item" :src="item">
                    </div>
                </el-form-item>
                <el-form-item label="追评：">
                    <span>{{ props.row.content_append}}</span>
                </el-form-item>
                <el-form-item label="卖家回复：">
                    <span>{{ props.row.seller_reply_append}}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="order_sn" label="订单编号" min-width="120px"> </el-table-column>
          <el-table-column align="center" prop="goods_name" label="评价商品" min-width="150px">
            <template slot-scope="scope">
              <div class="shopBox">
                <div class="shopImg">
                  <img :src="scope.row.image_thumbnail" alt="图片">
                </div>
                <span>{{scope.row.goods_name}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="spec_name" label="规格" min-width="120px"> </el-table-column>
          <el-table-column align="center" prop="shop_name" label="店铺名" min-width="120px"> </el-table-column>
          <el-table-column align="center" label="会员昵称" min-width="120px">
            <template slot-scope="scope">
              {{scope.row.nickname}}
            </template>
          </el-table-column>
          <!-- <el-table-column align="center" prop="member_level_str" label="会员等级" min-width="120px"> </el-table-column> -->
          <el-table-column align="center" label="评价时间" min-width="200px">
            <template slot-scope="scope">
              {{$moment(scope.row.comment_time).format('YYYY-MM-DD HH:ss:mm')}}
            </template>
          </el-table-column>
          <el-table-column  label="显示" align='center' width="100">
            <template slot-scope="scope">
                <el-button type="text" :class="[+scope.row.is_open ? 'el-icon-check' : 'el-icon-close']" @click="toOpen(scope.row)"></el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="120px">
            <template slot-scope="scope">
              <span class="v-blue v-text-cursor" @click="siggleDelete(scope.row)">删除</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 表格-尾 -->
      <!-- 分页 -->
      <div class="v-pageBox" v-if="pageInfo.totalResult">
        <el-pagination
           :current-page.sync="pageInfo.currentPage"
           layout="total, sizes, prev, pager, next, jumper"
           :page-size="pageInfo.showCount"
           :page-sizes="[10, 20, 40, 50]"
           @current-change="handleCurrentChange"
           @size-change="handleSizeChange"
           :total="pageInfo.totalResult">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'goods-list',
  data () {
    return {
      formData: {
        timeArr: [],
        begin_time: '',
        end_time: '',
        goods_name: '',
        product_sku: '',
        shop_name: '',
        nickname: '',
        order_sn: ''
      },
      shopList: [], // 店铺列表
      // 弹出框信息
      dialogFormData: {},
      pageInfo: {
        currentPage: 1,
        showCount: 10,
        totalResult: 0
      },
      dialogShow: false,
      listData: [{}], // 列表数据-评论
      excelLoading: false, // 导出加载
      mainLoading: false, // 列表的加载
      multiSelect: []
    }
  },
  created () {
    this.getList()
  },
  methods: {
    handleClose () {
      console.log('close event')
    },
    // 获得列表
    async getList () {
      this.mainLoading = true
      let reqData = Object.assign({}, this.pageInfo, this.formData)
      reqData.begin_time = reqData.timeArr && reqData.timeArr.length ? reqData.timeArr[0] : ''
      reqData.end_time = reqData.timeArr && reqData.timeArr.length ? reqData.timeArr[1] : ''
      delete reqData.timeArr
      let res = await this.$post('orderitemcomment/list.do', reqData)
      this.mainLoading = false
      if (parseInt(res.code) === 1) {
        this.shopList = res.data.shopNameList
        res.data.commentList.forEach(item => {
          item.grade = +item.grade
        })
        this.listData = res.data.commentList
        this.pageInfo.totalResult = res.data.page.totalResult
      } else {
        this.$message.error(res.message)
      }
    },
    // 评价图片预览
    seeCommenImage (arr) {
    //   console.log(arr)
      var preImgObj = arr.map((item, index) => {
        return {
          alt: 'picture' + index,
          title: 'Image Caption 1',
          w: 900,
          h: 700,
          src: item,
          msrc: item
        }
      })
      console.log(preImgObj)
      return preImgObj
    },
    // 切换显示
    async toOpen (comment) {
      comment.is_open = Number(!(+comment.is_open))
      let reqData = {
        id: comment.item_comment_id,
        is_open: comment.is_open
      }
      let res = await this.$post('orderitemcomment/isOpen.do', reqData)
      if (+res.code === 1) {
        this.$message.success('切换成功')
      } else {
        this.$message.error(res.message)
        comment.is_open = Number(!(+comment.is_open))
      }
    },
    // 查询
    toSearch () {
      this.pageInfo.currentPage = 1
      this.getList()
    },
    // 当前页-页码修改
    handleCurrentChange (val) {
      this.pageInfo.currentPage = val
      document.querySelector('.mainContent').scrollTo(0, 0)
      this.getList()
    },
    // 当前显示页数量修改
    handleSizeChange (size) {
      this.pageInfo.showCount = size
      this.pageInfo.currentPage = 1
      document.querySelector('.mainContent').scrollTo(0, 0)
      this.getList()
    },
    handleSelectionChange (val) {
      this.multiSelect = val
    },
    // 单个删除
    siggleDelete (comment) {
      this.deleteComment([comment.item_comment_id])
    },
    // 多个删除
    toAllDelete () {
      if (!this.multiSelect || !this.multiSelect.length) {
        this.$message.error('请选择数据')
        return false
      }
      let dataIdArray = []
      //  let hasActivity = false
      this.multiSelect.map(item => {
        dataIdArray.push(item.item_comment_id)
      })
      this.deleteComment(dataIdArray)
    },
    // 删除评价
    deleteComment (couponSnArray) {
      let num = couponSnArray.length
      let text = `确认删除这 ${num} 个评价？`
      this.$confirm(text, '确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '删除中...'
            let res = await this.$post('orderitemcomment/falseDelete.do', {id: couponSnArray.join(',')})
            instance.confirmButtonLoading = false
            instance.confirmButtonText = '确定'
            if (parseInt(res.code) === 1) {
              this.$message.success('删除成功')
              this.getList()
            } else {
              this.$message.error(res.message)
            }
            done()
          } else {
            done()
          }
        }
      }).then(() => {
        return true
      }).catch(() => {
        return false
      })
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import '~@/styles/common.scss';
  .detailTable{
    /*width: 70%;*/
    margin-top: 20px;
    line-height: 24px;
    .el-table {
      border: 1px solid $border-base;
      border-bottom: none
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
  .btn-Wrap{
    display: flex;
    align-items: center;
    justify-content: flex-start;
    border: 1px solid $border-base;
    border-bottom: none;
    .el-button{
      border-radius: 0;
      margin: -1px 0 -1px -1px;
    }
  }
  .btnBox{
    display: flex;
    justify-content: space-around;
  }
  .shopBox{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .shopImg{
      margin-right: 15px;
      width: 50px;
      height: 50px;
      img{
        height: 100%;
        width: 100%
      }
    }
  }
   .imgPreview{
    display: flex;
    justify-content: flex-start;
    img{
      width:100px;
      height:100px;
    }
  }
</style>
