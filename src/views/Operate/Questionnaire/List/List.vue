<!-- 问卷调查列表 -->
<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>运营</el-breadcrumb-item>
      <el-breadcrumb-item>问卷调查</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="v-wrap listWrap">
      <div>
        <h3 class="v-title">问卷调查</h3>
      </div>
      <div class="detailTable">
        <el-row class="btn-Wrap">
          <el-button icon="el-icon-plus" type="primary" plain @click="toAdd">添加</el-button>
          <el-button icon="el-icon-minus" type="warning" plain @click="multiDelete">删除</el-button>
          <el-button type="danger" plain @click="toStop">停止活动</el-button>
        </el-row>
        <!--表格正文-->
        <el-table :data="listData" v-loading="mainLoading" style="width: 100%"
                  @selection-change="handleSelectionChange">
          <el-table-column align="center" type="selection" width="55"></el-table-column>
          <el-table-column align="center" prop="title" label="问卷标题"></el-table-column>

          <el-table-column align="center" label="发布时间">
            <template slot-scope="item">
              {{format(item.row.start_time)}} - {{format(item.row.end_time)}}
            </template>
          </el-table-column>

          <el-table-column align="center" label="状态">
            <template slot-scope="item">
              {{renderStatus(item.row.status)}}
            </template>
          </el-table-column>

          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <span class="v-blue v-text-cursor" v-if="scope.row.status === 2" @click="toEdit(scope.row)">编辑</span>
              <span class="v-blue v-text-cursor" v-if="scope.row.status !== 2" @click="toView(scope.row)">查看</span>
              <i class="v-blue v-separator" v-if="scope.row.status !== 3">|</i>
              <span class="v-red v-text-cursor" v-if="scope.row.status !== 3" @click="singleDelete(scope.row)">删除</span>
              <span class="v-blue v-text-cursor" @click="toResult(scope.row)">投票结果</span>
              <span class="v-blue v-text-cursor" @click="showExtension(scope.row)">推广</span>
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
    </div>
    <Extension v-model="extensionInfo.showDialog" :infoData="extensionInfo.infoData" />
  </div>
</template>

<script>
import Extension from './components/ExtensionDialog'
export default {
  name: 'questionnaire-list',
  components: {Extension},
  data () {
    return {
      pageInfo: {
        currentPage: 1,
        showCount: 10,
        totalResult: 0
      },
      listData: [], // 列表数据
      mainLoading: false, // 列表的加载
      multiSelect: [],
      // 推广弹窗数据
      extensionInfo: {
        showDialog: false,
        infoData: {}
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    // 跳转到新增页
    toAdd () {
      this.$router.push(`/operate/questionniare/edit`)
    },
    // 跳转到编辑页
    toEdit (item) {
      this.$router.push(`/operate/questionniare/edit?id=${item.id}`)
    },
    // 跳转到详情页
    toView (item) {
      this.$router.push(`/operate/questionniare/view?id=${item.id}`)
    },
    // 查看问卷调查结果
    toResult (item) {
      this.$router.push(`/operate/questionniare/result?id=${item.id}`)
    },
    // 获得列表
    async getList () {
      this.mainLoading = true
      let res = await this.$post('questionnaireSurvey/list.do', this.pageInfo)
      this.mainLoading = false
      if (+res.code === 1) {
        this.listData = res.data.itemArray
        this.pageInfo.totalResult = res.data.totalResult
      } else {
        this.$message.error(res.message)
      }
    },
    // 格式化时间
    format (str) {
      return this.$moment(str).format('YYYY-MM-DD HH:mm:ss')
    },
    // 回显 状态
    renderStatus (code) {
      // 1:停止 2:未开始 3:进行中 4:已结束
      switch (code) {
        case 1:
          return '停止'
        case 2:
          return '未开始'
        case 3:
          return '进行中'
        case 4:
          return '已结束'
      }
      return '未知'
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
    },
    handleSelectionChange (val) {
      this.multiSelect = val
    },
    // 停止活动
    toStop () {
      if (!this.multiSelect.length) {
        this.$message.error('请选择数据')
        return
      }
      let unActive = this.multiSelect.filter(item => item.status !== 3)
      if (!unActive) {
        this.$message.error('只有进行中的活动才可执行该操作')
        return
      }

      this.$confirm('确认停止该问卷调查活动？').then(async () => {
        let url = 'questionnaireSurvey/stop.do'
        let ids = this.multiSelect.map(item => { return item.id })
        let body = {ids: ids.join(',')}
        let res = await this.$post(url, body)
        if (+res.code === 1) {
          this.$message.success('已停止!')
          this.getList()
        } else {
          this.$message.error(res.message)
        }
        // console.log(res)
      }).catch(() => {})
    },
    // 删除
    toDelete (rows) {
      if (!rows.length) {
        this.$message.error('请选择数据')
        return
      }
      let unActives = rows.filter(item => item.status === 3)
      if (unActives && unActives.length) {
        this.$message.error('请停止问卷调查活动后再执行该操作')
        return
      }
      let num = rows.length === 1 ? '' : rows.length
      this.$confirm(`确认删除这${num}个问卷调查？`).then(async () => {
        let url = 'questionnaireSurvey/del.do'
        let ids = rows.map(item => { return item.id })
        let body = {ids: ids.join(',')}
        let res = await this.$post(url, body)
        if (+res.code === 1) {
          this.$message.success('已删除!')
          this.getList()
        } else {
          this.$message.error(res.message)
        }
        // console.log(res)
      }).catch(() => {})
    },
    // 当条删除
    singleDelete (row) {
      this.toDelete([row])
    },
    // 多行删除
    multiDelete () {
      this.toDelete(this.multiSelect)
    },
    // 获取推广详情
    async showExtension (item) {
      let url = 'questionnaireSurvey/detailExtension.do'
      let body = {surveyId: item.id}
      let res = await this.$post(url, body)
      if (+res.code === 1) {
        this.extensionInfo.infoData = res.data
        this.extensionInfo.showDialog = true
      } else {
        this.$message.error(res.message)
      }
      // console.log('控制台打印:', this.extensionInfo)
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
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
</style>
