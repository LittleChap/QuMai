<!-- 意见反馈管理 -->
<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>运营</el-breadcrumb-item>
      <el-breadcrumb-item>意见反馈管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="v-wrap">
      <h3 class="v-title">意见反馈管理</h3>
      <div class="detailTable">
        <el-row class="btn-Wrap">
          <el-button icon="el-icon-minus" type="warning" plain @click="multiDelete">删除</el-button>
        </el-row>
        <!--表格正文-->
        <el-table :data="listData" v-loading="mainLoading" style="width: 100%"
                  @selection-change="handleSelectionChange">
          <el-table-column align="center" type="selection" width="55"></el-table-column>
          <el-table-column align="center" prop="desc" label="意见类型"></el-table-column>
          <el-table-column align="center" label="会员帐号">
            <template slot-scope="item">
              <div class="feedContent">
                {{item.row.username || '-'}}
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="联系方式">
            <template slot-scope="item">
              <div class="feedContent">
                {{item.row.contact_way || '-'}}
              </div>
            </template>
          </el-table-column>
          <!--<el-table-column align="center" prop="content" label="反馈内容" width="300px"></el-table-column>-->
          <el-table-column align="center" label="反馈内容" width="300px">
            <template slot-scope="item">
              <div class="feedContent">
                {{item.row.content}}
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="反馈时间" width="150px">
            <template slot-scope="item">
              {{format(item.row.create_time)}}
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
    <Detail v-model="showDialog" :data="currentItem" />
  </div>
</template>

<script>
import Detail from './components/Detail'
export default {
  name: 'feedback-manage',
  components: {Detail},
  data () {
    return {
      pageInfo: {
        currentPage: 1,
        showCount: 20,
        totalResult: 0
      },
      listData: [], // 列表数据
      mainLoading: false, // 列表的加载
      multiSelect: [],
      // 是否显示编辑弹窗
      showDialog: false,
      // 当前数据
      currentItem: {}
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
    // 查看详情
    toView (item) {
      try {
        item.images = JSON.parse(item.images)
      } catch (e) {
        item.images = []
      }
      this.currentItem = item
      // console.log('控制台打印:', this.currentItem)
      this.showDialog = true
    },
    // 获得列表
    async getList () {
      this.mainLoading = true
      let res = await this.$post('feedback/list.do', this.pageInfo)
      this.mainLoading = false
      if (+res.code === 1) {
        this.listData = res.data.feedbackList
        this.pageInfo.totalResult = +res.data.totalResult
      } else {
        this.$message.error(res.message)
      }
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
    // 删除
    toDelete (rows) {
      if (!rows.length) {
        this.$message.error('请选择数据')
        return
      }
      let num = rows.length === 1 ? '' : rows.length
      this.$confirm(`确认删除这${num}个反馈？`).then(async () => {
        let url = 'feedback/falseDeleteAll.do'
        let ids = rows.map(item => {
          return item.id
        })
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
  .feedContent{
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    line-height: 30px;
  }
</style>
