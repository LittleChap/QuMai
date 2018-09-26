<!-- 问卷调查列表 -->
<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">全局</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/global/logisticscompany/list' }">物流配置管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="v-wrap listWrap">
      <div>
        <h3 class="v-title">物流配置管理</h3>
      </div>
      <div class="detailTable">
        <el-row class="btn-Wrap">
          <el-button icon="el-icon-plus" type="primary" plain @click="toAdd">添加</el-button>
          <el-button icon="el-icon-minus" type="warning" plain @click="multiDelete">删除</el-button>
          <!-- <el-button type="danger" plain @click="toStop">停止活动</el-button> -->
        </el-row>
        <!--表格正文-->
        <el-table :data="listData" v-loading="mainLoading" style="width: 100%"
                  @selection-change="handleSelectionChange">
          <el-table-column align="center" type="selection" width="55"></el-table-column>
          <el-table-column align="center" prop="logistics_name" label="物流公司"></el-table-column>

          <el-table-column align="center" label="物流编码" prop="encipher">
            <!-- <template slot-scope="item">
              {{format(item.row.start_time)}} - {{format(item.row.end_time)}}
            </template> -->
          </el-table-column>

          <el-table-column align="center" label="排序" prop="sort">
            <!-- <template slot-scope="item">
              {{renderStatus(item.row.status)}}
            </template> -->
          </el-table-column>

          <el-table-column align="center" label="启用">
            <template slot-scope="item">
              <el-button v-if="item.row.is_open" type="text" icon="el-icon-check" @click="toOpen(item.row, 0)"></el-button>
              <el-button v-else type="text" icon="el-icon-close" @click="toOpen(item.row, 1)"></el-button>
            </template>
          </el-table-column>

          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <span class="v-blue v-text-cursor" @click="toEdit(scope.row)">编辑</span>
              <!-- <span class="v-blue v-text-cursor" v-if="scope.row.status !== 2" @click="toView(scope.row)">查看</span> -->
              <i class="v-blue v-separator" >|</i>
              <span class="v-red v-text-cursor" @click="singleDelete(scope.row)">删除</span>
              <!-- <span class="v-blue v-text-cursor" @click="toResult(scope.row)">投票结果</span> -->
              <!-- <span class="v-blue v-text-cursor" @click="showExtension(scope.row)">推广</span> -->
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
  </div>
</template>

<script>
export default {
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
    // 获得列表
    async getList () {
      this.mainLoading = true
      let res = await this.$post('logisticscompany/list.do', this.pageInfo)
      this.mainLoading = false
      if (+res.code === 1) {
        this.listData = res.data.logisticsList
        this.pageInfo.totalResult = res.data.page.totalResult
      } else {
        this.$message.error(res.message)
      }
    },
    // 启用禁用
    async toOpen (logistics, val) {
      let reqData = {
        id: logistics.logistics_id,
        is_open: val
      }
      // console.log(reqData)
      let res = await this.$post('logisticscompany/isOpen.do', reqData)
      if (+res.code === 1) {
        this.getList()
        this.$message.success('切换成功')
      } else {
        this.$message.error(res.message)
      }
    },
    // 编辑
    toEdit (logistics) {
      let editData = JSON.stringify(logistics)
      this.$router.push(`/global/logisticscompany/set?logistics=${editData}`)
    },
    // 添加
    toAdd () {
      this.$router.push(`/global/logisticscompany/set?logistics=`)
    },
    // 表格是否可以勾选
    // selectable (val, index) {
    //   if (val.is_open) {
    //     return true
    //   } else {
    //     return false
    //   }
    // },
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
    //   console.log(val)
    },
    // 删除
    toDelete (rows) {
      if (!rows.length) {
        this.$message.error('请选择数据')
        return
      }
      let num = rows.length === 1 ? '' : rows.length
      this.$confirm(`确认删除这${num}个物流公司？`).then(async () => {
        // let url = 'logisticscompany/falseDelete.do'
        let ids = rows.map(item => { return item.logistics_id })
        let body = {data_ids: ids.join(',')}
        // console.log(body)
        let res = await this.$post('logisticscompany/falseDeleteAll.do', body)
        // console.log(res)
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
