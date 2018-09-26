<!-- 热搜 管理 -->
<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>运营</el-breadcrumb-item>
      <el-breadcrumb-item>热搜管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="v-wrap">
      <h3 class="v-title">热搜管理</h3>
      <div class="detailTable">
        <el-row class="btn-Wrap">
          <el-button icon="el-icon-plus" type="primary" plain @click="toAdd">添加</el-button>
          <el-button icon="el-icon-minus" type="warning" plain @click="multiDelete">删除</el-button>
        </el-row>
        <!--表格正文-->
        <el-table :data="listData" v-loading="mainLoading" style="width: 100%"
                  @selection-change="handleSelectionChange">
          <el-table-column align="center" type="selection" width="55"></el-table-column>
          <el-table-column align="center" prop="sort" label="排序"></el-table-column>
          <el-table-column align="center" prop="name" label="关键词"></el-table-column>
          <el-table-column align="center" prop="type_name" label="跳转"></el-table-column>

          <!--<el-table-column align="center" label="跳转">-->
            <!--<template slot-scope="item">-->
            <!--</template>-->
          <!--</el-table-column>-->

          <el-table-column align="center" label="高亮">
            <template slot-scope="item">
              <el-checkbox v-model="item.row.is_highlight" :true-label="1" :false-label="0" @change="changeHighLight(item.row)"></el-checkbox>
            </template>
          </el-table-column>

          <el-table-column align="center" label="启用">
            <template slot-scope="item">
              <el-checkbox v-model="item.row.is_open"  :true-label="1" :false-label="0"  @change="changeOpened(item.row)" ></el-checkbox>
            </template>
          </el-table-column>

          <el-table-column align="center" label="操作">
            <template slot-scope="item">
              <span class="v-blue v-text-cursor" @click="toEdit(item.row)">编辑</span>
              <span class="v-red v-text-cursor" @click="singleDelete(item.row)">删除</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--<div class="v-pageBox" v-if="pageInfo.totalResult">-->
        <!--<el-pagination-->
          <!--:current-page.sync="pageInfo.currentPage"-->
          <!--layout="total, sizes, prev, pager, next, jumper"-->
          <!--:page-size="pageInfo.showCount"-->
          <!--:page-sizes="[10, 20, 40, 50]"-->
          <!--@current-change="handleCurrentChange"-->
          <!--@size-change="handleSizeChange"-->
          <!--:total="pageInfo.totalResult">-->
        <!--</el-pagination>-->
      <!--</div>-->
      <Edit v-model="showDialog" :data="currentItem" @close="closeEditDialog" :pages="pageList" />
    </div>
  </div>
</template>

<script>
import Edit from './components/Edit'
export default {
  name: 'hot-search-manage',
  components: {Edit},
  data () {
    return {
      pageInfo: {
        currentPage: 1,
        showCount: 30,
        totalResult: 0
      },
      listData: [], // 列表数据
      pageList: [], // 页面列表
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
    this.getPageList()
  },
  methods: {
    // 关闭对话框
    closeEditDialog () {
      this.showDialog = false
      this.currentItem = {}
      this.getList()
    },
    // 跳转到新增页
    toAdd () {
      this.currentItem = undefined
      this.showDialog = true
    },
    // 跳转到编辑页
    toEdit (item) {
      switch (item.type_name) {
        case '搜索列表':
          item.type = 0
          break
        case '跳转二级页面':
          item.type = 1
          break
        case '跳转店铺':
          item.type = 2
          break
      }
      this.currentItem = item
      this.showDialog = true
    },
    // 获得列表
    async getList () {
      this.mainLoading = true
      let res = await this.$post('keyowrds/list.do', this.pageInfo)
      this.mainLoading = false
      if (+res.code === 1) {
        this.listData = res.data.new_keyoredsList
        this.pageInfo.totalResult = res.data.totalResult
      } else {
        this.$message.error(res.message)
      }
    },
    // 获得页面列表
    async getPageList () {
      let url = 'pages/list.do'
      let body = {
        currentPage: 1,
        showCount: 99999
      }
      let res = await this.$post(url, body)
      if (+res.code === 1) {
        this.pageList = res.data.pagesList
        console.log('控制台打印:', res)
      } else {
        this.$message.error(res.message)
      }
    },
    // 高亮 切换
    async changeHighLight (item) {
      let url = 'keyowrds/isOpen.do'
      let body = {
        id: item.id,
        is_open: item.is_highlight,
        type: 2
      }
      this.mainLoading = true
      let res = await this.$post(url, body)
      this.mainLoading = false
      if (+res.code !== 1) {
        this.$message.error('切换失败:' + res.message)
      }
    },
    // 启用/禁用 切换
    async changeOpened (item) {
      let url = 'keyowrds/isOpen.do'
      let body = {
        id: item.id,
        is_open: item.is_open,
        type: 1
      }
      this.mainLoading = true
      let res = await this.$post(url, body)
      this.mainLoading = false
      if (+res.code !== 1) {
        this.$message.error('切换失败:' + res.message)
      }
    },
    // // 当前页-页码修改
    // handleCurrentChange (val) {
    //   this.pageInfo.currentPage = val
    //   this.getList()
    // },
    // // 当前显示页数量修改
    // handleSizeChange (size) {
    //   this.pageInfo.showCount = size
    //   this.pageInfo.currentPage = 1
    //   this.getList()
    // },
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
      this.$confirm(`确认删除这${num}个关键词？`).then(async () => {
        let url = 'keyowrds/falseDeleteAll.do'
        let ids = rows.map(item => { return item.id })
        let body = {data_ids: ids.join(',')}
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
