<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">全局</el-breadcrumb-item>
      <el-breadcrumb-item>商品品牌</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="v-wrap brandListWrap">
      <div>
        <h3 class="v-title">商品品牌</h3>
      </div>
      <!-- 表单-头 -->
      <el-form :model="formData" label-width="90px" class="v-form v-form-bg" @submit.native.prevent>
        <el-row>
          <el-col :span="5">
            <el-form-item label="中文名">
              <el-input v-model="formData.name" @keyup.native.enter="toSearch"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="英文名">
              <el-input v-model="formData.name_en" @keyup.native.enter="toSearch"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <div class="btnBox">
              <el-button type="primary" icon="el-icon-search" @click="toSearch">搜索</el-button>
              <!-- <el-button type="primary"  @click="toExcel">导出</el-button> -->
            </div>
          </el-col>
        </el-row>
      </el-form>
      <!-- 表单-尾 -->
      <div class="detailTable">
        <el-row class="btn-Wrap">
          <router-link to="/goods/brand/goodsGrandSet?brandId=-1">
            <el-button type="primary" class="" icon="el-icon-plus" plain>新 增</el-button>
          </router-link>
          <el-button type="danger" class="" icon="el-icon-minus" @click="allDelete" plain>删除</el-button>
        </el-row>
        <el-table  v-loading="mainLoading" class="listTable" :data="listData"
         tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column  label="排序" align="center" width="80" prop="sort"> </el-table-column>
          <el-table-column  prop="name"  align="center" label="品牌名称"></el-table-column>
          <el-table-column prop="name_en" label="英文名"  align="center"> </el-table-column>
          <el-table-column prop="brief" label="品牌描述" width="200" align="center">
            <template slot-scope="scope">
              <p class="brandBrief">
                {{scope.row.brief}}
              </p>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" align="center" label="添加时间">
            <template slot-scope="scope">
              <span v-if="scope.row.create_time">{{$moment(scope.row.create_time).format('YYYY-MM-DD HH:ss:mm')}}</span>
              <span v-else> - </span>
            </template>
          </el-table-column>
          <el-table-column prop="modifyTime" align="center" label="启用">
            <template slot-scope="scope">
              <div class="hotCheck">
                <el-checkbox v-model="scope.row.is_open"  @change="toOpen($event, scope.row)"></el-checkbox>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <!-- <router-link :to="`/baseData/device/brandDetail?brandId=${scope.row.id}`"> <el-button size="small" type="primary" plain icon="el-icon-edit">编辑</el-button> </router-link> -->
              <!-- <el-button size="small" type="danger" plain icon="el-icon-delete" @click="singeDelete(scope.row.id)">删除</el-button> -->
              <!-- <span class="v-blue v-text-cursor" @click="goEdit(scope.row)">编辑</span> -->
              <router-link :to="`/goods/brand/goodsGrandSet?brandId=${scope.row.brand_id}`"> <span class="v-blue v-text-cursor">编辑</span> </router-link>
              <i class="v-blue v-separator" >|</i>
              <span class="v-red v-text-cursor" @click="singeDelete(scope.row.brand_id)">删除</span>
              <!-- <i class="v-blue v-separator" v-if="+scope.row.lay === 2">|</i> -->
              <!-- <span v-if="+scope.row.lay === 2" class="v-blue v-text-cursor" @click="delRegion(scope.row)">评价引导词设置</span> -->
            </template>
          </el-table-column>
        </el-table>
      </div>
        <div class="pageBox" v-if="pageInfo.totalResult">
          <el-pagination
            :current-page.sync="pageInfo.currentPage"
            :page-size="pageInfo.showCount"
            layout="total, sizes, prev, pager, next, jumper"
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
  name: 'brand-list',
  data () {
    return {
      mainLoading: false,
      pageInfo: {
        currentPage: 1,
        showCount: 10,
        totalResult: 0
      },
      // formData
      formData: {
        name: '',
        name_en: ''
      },
      listData: [],
      multiSelect: [] // 选中的数据
    }
  },
  created () {
    this.getList()
  },
  methods: {
    async getList () {
      let reqData = {
        currentPage: this.pageInfo.currentPage,
        showCount: this.pageInfo.showCount
      }
      this.mainLoading = true
      let res = await this.$post('brand/list.do', Object.assign({}, reqData, this.formData))
      if (parseInt(res.code) === 1) {
        res.data.brandList.forEach(item => {
        //   console.log(typeof item.is_open,item.is_open)
          item.is_open = !!(+item.is_open)
        })
        this.listData = res.data.brandList
        this.pageInfo.totalResult = res.data.page.totalResult || 0
        // this.isOpen = res.data.
        this.mainLoading = false
      } else {
        this.mainLoading = false
        this.$message.error(res.message)
      }
    },
    // 查询
    toSearch () {
      this.pageInfo.currentPage = 1
      this.getList()
    },
    singeDelete (id) {
      this.$confirm('是否确认删除？', '确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteData(id)
      }).catch(() => {
        return false
      })
    },
    allDelete () {
      if (!this.multiSelect.length) {
        this.$message.error('请选择数据')
        return false
      }
      this.$confirm(`确认删除这${this.multiSelect.length}个商品？`, '确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let idArray = []
        this.multiSelect.map(item => {
          idArray.push(item.brand_id)
        })
        this.deleteData(idArray.join(','))
      }).catch(() => {
        return false
      })
    },
    async deleteData (ids) {
      let reqData = {
        data_ids: ids
      }
      let res = await this.$post('brand/falseDeleteAll.do', reqData)
      if (parseInt(res.code) === 1) {
        this.$message.success('删除成功')
        this.getList()
      } else {
        this.$message.error(res.message)
      }
    },
    // 是否启用
    async toOpen (val, brand) {
      let reqData = {
        brand_id: brand.brand_id,
        is_open: Number(val)
      }
      let res = await this.$post('brand/isOpen.do', reqData)
      if (+res.code === 1) {
        if (val) {
          this.$message.success('开启成功')
        } else {
          this.$message.success('关闭成功')
        }
      } else {
        this.$message.error(res.message)
      }
    },
    handleSelectionChange (data) {
      this.multiSelect = data
    },
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
    }
  }
}
</script>

<style lang="scss" scoped rel="stylesheet/scss">
  @import '~@/styles/common.scss';
  .pageBox{
      text-align: center;
      margin: 20px 30px;
  }
  .detailTable{
    /*width: 70%;*/
    margin-top: 20px;
    line-height: 24px;
    .el-table {
      border: 1px solid $border-base;
      border-bottom: none
    }
    .brandBrief{
      width: 100%;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
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
</style>

<style lang="scss" rel="stylesheet/scss">
  .hotCheck{
    .el-checkbox{
      .el-checkbox__input{
        .el-checkbox__inner{
          width:34px;
          height:28px;
        }
        .el-checkbox__inner::after{
          width:6px;
          height:17px;
          left:13px;
          top:1px;
        }
      }
    }
  }
</style>
