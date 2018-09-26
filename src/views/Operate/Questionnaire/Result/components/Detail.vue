<!-- 问卷调查 详细结果 -->
<template>
  <div class="detail-wrap">
    <div class="detailTable">
      <el-row class="btn-Wrap">
        <el-button icon="el-icon-download" type="primary" plain @click="exportToExcel">导出</el-button>

      </el-row>
      <!--表格正文-->
      <el-table :data="listData" v-loading="mainLoading" style="width: 100%">
        <el-table-column align="center" label="会员账号">
          <template slot-scope="scope">{{scope.row.mobile || '匿名用户'}}</template>
        </el-table-column>
        <el-table-column align="center" label="会员昵称" prop="nickname"></el-table-column>
        <el-table-column align="center" label="本月登录" prop="monthLoginCount"></el-table-column>
        <el-table-column align="center" label="积分" prop="memberId"></el-table-column>
        <el-table-column align="center" label="消费金额" prop="consumption"></el-table-column>
        <el-table-column align="center" label="会员等级" prop="level"></el-table-column>
        <el-table-column align="center" label="投票时间" prop="create_time">
          <template slot-scope="item">{{format(item.row.create_time)}}</template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <span class="v-blue v-text-cursor" @click="viewQuestionDtail(scope.row)">问卷详情</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
    <QuestionDetail v-model="showDialog" v-if="showDialog" :question="currentQuestion"></QuestionDetail>
  </div>
</template>
<script>
import QuestionDetail from './QuestionDetail'

export default {
  components: {QuestionDetail},
  name: 'questionnaire-summary',
  data () {
    return {
      pageInfo: {
        currentPage: 1,
        showCount: 10,
        totalResult: 0
      },
      listData: [], // 列表数据
      currentQuestion: '',
      mainLoading: false, // 列表的加载
      showDialog: false
    }
  },
  props: {
    id: {
      type: String,
      default: ''
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
    // 查看问题详情
    viewQuestionDtail (item) {
      this.currentQuestion = item
      this.showDialog = true
    },
    // 导出到 excel
    async exportToExcel () {
      let url = 'questionnaireSurvey/export.do'
      let body = {id: this.id}
      let res = await this.$post(url, body)
      if (+res.code === 1 && res.data.url) {
        this.downloadFile(res.data.url)
      } else {
        this.$message.error(res.message)
      }
    },
    // 下载文件
    downloadFile (url) {
      let isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1
      let isSafari = navigator.userAgent.toLowerCase().indexOf('safari') > -1
      if (/(iP)/g.test(navigator.userAgent)) {
        alert('Your device does not support files downloading. Please try again in desktop browser.')
        return false
      }
      if (isChrome || isSafari) {
        var link = document.createElement('a')
        link.href = url
        if (link.download !== undefined) {
          var fileName = url.substring(url.lastIndexOf('/') + 1, url.length)
          link.download = fileName
        }
        if (document.createEvent) {
          var e = document.createEvent('MouseEvents')
          e.initEvent('click', true, true)
          link.dispatchEvent(e)
          return true
        }
      }
      // Force file download (whether supported by server).
      if (url.indexOf('?') === -1) {
        url += '?download'
      }

      window.open(url, '_self')

      // var form = document.createElement('form')
      // form.style.display = 'none'
      // form.target = ''
      // form.method = 'get'
      // form.action = url
      // document.body.appendChild(form)
      // form.submit()
      // document.body.removeChild(form)
      this.$message.success('正在下载...')
    },
    // 获取详情数据
    async getList () {
      let url = 'questionnaireSurvey/memberResult.do'
      let body = {id: this.id}
      this.mainLoading = true
      let res = await this.$post(url, body)
      this.mainLoading = false
      if (+res.code === 1) {
        this.listData = res.data.result
        this.pageInfo.totalResult = res.data.totalResult
      } else {
        this.$message.error(res.message)
      }
      // console.log('控制台打印:', res)
    },
    // 当前页-页码修改
    handleCurrentChange (val) {
      this.pageInfo.currentPage = val
      this.getList()
    },
    // 当前显示页数量修改
    handleSizeChange (size) {
      this.pageInfo.showCount = size
      this.pageInfo.currentPage = 1
      this.getList()
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import '~@/styles/common.scss';

  .detail-wrap {
    padding: 10px 20px;
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

  .detailTable {
    /*width: 70%;*/
    margin-top: 20px;
    line-height: 24px;
    .el-table {
      border: 1px solid $border-base;
      border-bottom: none
    }
  }

</style>
