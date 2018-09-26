<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">全局</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/global/log/sysLog' }">系统日志</el-breadcrumb-item>
      <el-breadcrumb-item >登录日志</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="v-wrap ListWrap">
      <div>
        <h3 class="v-title">登录日志</h3>
      </div>
      <div class="detailTable">
        <el-table
          class="listTable"
          :data="listData"
          v-loading="mainLoading"
          style="width: 100%">
          <el-table-column
            align="center"
            label="时间"
            prop="create_time">
            <template slot-scope="scope">
              {{ format(scope.row.create_time) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="username"
            align="center"
            label="用户名">
          </el-table-column>
          <el-table-column
            align="center"
            prop="login_ip"
            label="登录IP">
          </el-table-column>
        </el-table>
        <div class="pageBox" v-if="pageInfo.totalResult">
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
  </div>
</template>

<script>
export default {
  name: 'permission-list',
  data () {
    return {
      mainLoading: false,
      listData: [],
      pageInfo: {
        currentPage: 1,
        showCount: 10,
        totalResult: 0
      }
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
      let res = await this.$post('userloginlog/list.do', reqData)
      this.mainLoading = false
      if (parseInt(res.code) === 1) {
        this.listData = res.data.userLoginLogList
        this.pageInfo.totalResult = res.data.page.totalResult
      } else {
        this.$message.error(res.message)
      }
    },
    // 格式化时间
    format (str) {
      return this.$moment(str).format('YYYY-MM-DD HH:mm:ss')
    },
    handleCurrentChange (val) {
      this.pageInfo.currentPage = val
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

  .detailTable {
    /*width: 70%;*/
    margin-top: 20px;
    line-height: 24px;
    .el-table {
      border: 1px solid $border-base;
      border-bottom: none
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
  }

  .btnBox {
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
  .pageBox {
      text-align: center;
      margin: 20px 30px;
  }
</style>
