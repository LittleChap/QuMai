<template>
  <div class="v-wrap ListWrap">
    <div>
      <h3 class="v-title">账号管理</h3>
    </div>
    <el-row class="btnBox">
      <router-link to="/system/permission/accountDetail?accountId=-1">
        <el-button type="primary" class="v-button" icon="el-icon-plus" >新 增</el-button>
      </router-link>
    </el-row>
    <el-table
      class="listTable"
      :data="listData"
      v-loading="mainLoading"
      style="width: 100%">
      <el-table-column
        label="账号id"
        align="center"
        prop="userId">
      </el-table-column>
      <el-table-column
        prop="username"
        align="center"
        label="用户名">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        align="center">
      </el-table-column>
      <el-table-column
        prop="roleName"
        label="角色"
        align="center">
      </el-table-column>
      <el-table-column
        prop="lastLogin"
        align="center"
        label="最后登录时间">
        <template slot-scope="scope">
          {{scope.row.lastLogin ? $moment(scope.row.lastLogin).format('YYYY-MM-DD  hh:mm:ss') : ''}}
        </template>
      </el-table-column>
      <el-table-column
        prop="loginCount"
        align="center"
        label="共计登录次数">
      </el-table-column>
      <el-table-column
        prop="lastLoginIp"
        align="center"
        label="上次登录IP">
      </el-table-column>
      <el-table-column
        align="center"
        width="200px"
        label="操作">
        <template slot-scope="scope">
          <router-link  v-if="scope.row.username !== 'admin'" :to="`/system/permission/accountDetail?accountId=${scope.row.userId}`"> <el-button size="small" type="primary" plain icon="el-icon-edit">编辑</el-button> </router-link>
          <el-button  v-if="scope.row.username !== 'admin'" size="small" type="danger" plain icon="el-icon-delete" @click="deleteAccount(scope.row.userId)">删除</el-button>
          <span  v-if="scope.row.username === 'admin'">-</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="pageBox" v-if="pageInfo.totalResult">
      <el-pagination
        :current-page.sync="pageInfo.currentPage"
        :page-size="pageInfo.showCount"
        layout=" prev, pager, next, jumper"
        @current-change="handleCurrentChange"
        :total="pageInfo.totalResult">
      </el-pagination>
    </div>

  </div>
</template>

<script>
export default {
  name: 'account-list',
  data () {
    return {
      mainLoading: false,
      listData: [],
      pageInfo: {
        currentPage: 1,
        showCount: 20,
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
      let res = await this.$post('user/getUserList.do', reqData)
      this.mainLoading = false
      if (parseInt(res.code) === 1) {
        this.listData = res.data.user
        this.pageInfo.totalResult = res.data.page.totalResult
      } else {
        this.$message.error(res.message)
      }
    },
    // 删除角色
    deleteAccount (accountId) {
      this.$confirm('是否确认删除？', '确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let res = await this.$post('user/deleted.do', {userId: accountId})
        if (parseInt(res.code) === 1) {
          this.$message.success('删除成功')
          this.getList()
        } else {
          this.$message.error(res.message)
        }
      }).catch(() => {
        return false
      })
    },
    handleCurrentChange (val) {
      this.pageInfo.currentPage = val
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped rel="stylesheet/scss">
  @import '~@/styles/common.scss';
  .ListWrap{
    .btnBox{
      margin: 10px 0 20px;
    }
    .listTable{
      margin: 20px 0 ;
    }
    .pageBox{
      text-align: center;
      margin: 20px 30px;
    }
  }

</style>
