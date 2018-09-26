<!-- 页面列表 -->
<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/siteModule/pageSetting/pageList' }">站点</el-breadcrumb-item>
      <el-breadcrumb-item>页面列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="v-wrap listWrap">
      <div>
        <h3 class="v-title">页面列表</h3>
      </div>
      <el-form :model="formData" label-width="70px" class="v-form v-form-bg" @submit.native.prevent>
        <el-row>
          <el-col :span="8">
            <el-form-item label="页面ID" >
              <el-input v-model="formData.pageId" :maxlength="10" @keyup.enter.native="toSearch"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="页面名称" >
              <el-input v-model="formData.name" :maxlength="50" @keyup.enter.native="toSearch"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="toSearch">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-row class="btn-Wrap">
        <router-link to="/siteModule/pageSetting/pageEdit?pageId=-1"><el-button type="primary" icon="el-icon-plus">添加</el-button></router-link>
        <el-button icon="el-icon-delete" @click="toAllDelete">删除</el-button>
      </el-row>
      <el-table :data="listData" v-loading="mainLoading" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column align="center" type="selection" width="55"> </el-table-column>
        <el-table-column align="center" prop="page_id" label="页面ID" width="120px"> </el-table-column>
        <el-table-column align="center" prop="name" label="页面名称"> </el-table-column>
        <el-table-column align="center" prop="create_time" label="创建时间">
          <template slot-scope="scope">
            {{scope.row.create_time ? $moment(scope.row.create_time).format('YYYY.MM.DD  HH:mm:ss') : ''}}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="modify_time" label="最后修改时间">
          <template slot-scope="scope">
            {{scope.row.modify_time ? $moment(scope.row.modify_time).format('YYYY.MM.DD  HH:mm:ss') : ''}}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="date" label="发布" width="120px">
          <template slot-scope="scope">
            <el-switch v-if="scope.row.page_id !== 1 && scope.row.page_id !== 2" :inactive-value="0" :active-value="1" v-model="scope.row.is_publish" @change="toPublish(scope.row)"> </el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="date" label="操作" width="300px">
          <template slot-scope="scope">
            <span class="v-blue v-text-cursor" @click="toCopyPage(scope.row.page_id)">复制</span> <i class="v-blue v-separator">|</i>
            <router-link :to="`/siteModule/pageSetting/pageEdit?pageId=${scope.row.page_id}`"><span class="v-blue v-text-cursor">编辑</span></router-link> <i class="v-blue v-separator">|</i>
            <span class="v-blue v-text-cursor" @click="toPreview(scope.row.page_id)">预览</span> <i class="v-blue v-separator" v-if="scope.row.page_id !== 1 && scope.row.page_id !== 2">|</i>
            <span v-if="scope.row.page_id !== 1 && scope.row.page_id !== 2" class="v-red v-text-cursor" @click="toSingleDelete(scope.row)">删除</span>
          </template>
        </el-table-column>
      </el-table>
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

    <!-- 引用提示弹窗 -->
    <el-dialog title="温馨提示" v-if="usedInfo.dialogVisible" :visible.sync="usedInfo.dialogVisible" class="v-dialog" width="800px" top="30vh">
      <p style="margin-top: 0">该页面被以下页面的控件引用，请先断开这些控件的引用再进行下线：</p>
      <el-table :data="usedInfo.usedList" style="width: 100%">
        <el-table-column align="center" prop="pageId" label="页面ID" width="100"> </el-table-column>
        <el-table-column align="center" prop="pageName" label="页面名称"> </el-table-column>
        <el-table-column align="center" prop="moduleType" label="模块类型" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.moduleType === 1">图片</span>
            <span v-else-if="scope.row.moduleType === 2">商品</span>
            <span v-else-if="scope.row.moduleType === 3">导航</span>
            <span v-else-if="scope.row.moduleType === 4">拼团</span>
            <span v-else-if="scope.row.moduleType === 5">秒杀</span>
            <span v-else-if="scope.row.moduleType === 5">优惠券</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="title" label="模块名称"> </el-table-column>
        <el-table-column align="center"  label="操作" width="100">
          <template slot-scope="scope">
            <span class="v-blue v-text-cursor" @click="toPageEditSet(scope.row.pageId)">前往设置</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="v-dialog-footer">
        <el-button type="primary" :loading="usedInfo.submitLoading" @click="toPublishDown">下 线</el-button>
        <el-button @click="usedInfo.dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 预览 -->
    <PagePreview v-model="previewInfo.toShowPreview" url="pages/outPreview.do" :pageReqInfo="{pageId: previewInfo.pageId}" :pageId="previewInfo.pageId"/>

  </div>
</template>

<script>
import PagePreview from './PagePreview/Index'
export default {
  name: 'page-list',
  components: {PagePreview},
  data () {
    return {
      formData: { // 表单请求数据
        pageId: '',
        name: ''
      },
      listData: [], // 列表数据
      mainLoading: false, // 列表的加载
      pageInfo: {
        currentPage: 1,
        showCount: 10,
        totalResult: 0
      },
      multiSelect: [], // 多选列表
      usedInfo: { // 引用弹窗数据
        dialogVisible: false,
        submitLoading: false,
        pageData: '', // 要下线的页面数据
        usedList: [] // 引用的页面列表
      },
      // 预览的信息
      previewInfo: {
        toShowPreview: false,
        pageId: ''
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    // 获得列表
    async getList () {
      let reqData = Object.assign({}, this.formData, this.pageInfo)
      delete reqData.totalResult
      this.mainLoading = true
      let res = await this.$post('pages/list.do', reqData)
      this.mainLoading = false
      if (parseInt(res.code) === 1) {
        this.listData = res.data.pagesList
        this.pageInfo.totalResult = res.data.page.totalResult
      }
    },
    // 查询
    toSearch () {
      this.pageInfo.currentPage = 1
      this.getList()
    },
    handleSelectionChange (data) {
      this.multiSelect = data
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
    // 单个删除
    toSingleDelete (data) {
      if (data.is_publish) {
        this.$message.error('该页面上线中，请下线后再进行删除！')
        return false
      }

      this.toDeleteData(data.page_id, 0)
    },
    // 批量删除
    toAllDelete () {
      if (!this.multiSelect || !this.multiSelect.length) {
        this.$message.error('请选择数据')
        return false
      }
      let dataIdArr = []
      let hasPublish = false
      this.multiSelect.map(item => {
        if (item.page_id === 1) {
          hasPublish = true
          return false
        }
        if (item.is_publish) {
          hasPublish = true
          return false
        }
        dataIdArr.push(item.page_id)
      })
      if (hasPublish) {
        this.$message.error('勾选的数据中含有上线中的页面，请下线后再进行删除！')
        return false
      }
      this.toDeleteData(dataIdArr.join(','), dataIdArr.length)
    },
    // 请求删除数据
    toDeleteData (dataIds, length) {
      let text = length ? `确定删除这${length}个页面？` : '确定删除此页面吗？'
      this.$confirm(text, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '删除中...'
            let res = await this.$post('pages/falseDeleteAll.do', {dataIds: dataIds})
            instance.confirmButtonLoading = false
            instance.confirmButtonText = '确定'
            if (parseInt(res.code) === 1) {
              this.$message.success('删除成功！')
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
    },
    // ----发布
    // 去发布
    async toPublish (data) {
      console.log('改变', data)
      let isPublish = Number(data.is_publish)
      data.is_publish = data.is_publish ? 0 : 1
      if (isPublish) { // 要发布
        this.toPublishData(data, isPublish)
        return false
      }
      // 取消发布
      // 检查该页面是否有被其他页面引用
      let res = await this.$post('pagemodulecontent/getUsedByOther.do', {pageId: data.page_id})
      if (parseInt(res.code) !== 1) {
        this.$message.error(res.message)
        return false
      }
      if (!res.data.used || !res.data.used.length) { // 没有被引用
        this.$confirm('确定下线此页面？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.toPublishData(data, isPublish)
        }).catch(() => {
          return false
        })
        return false
      }
      // 页面被引用--> 显示弹窗
      this.usedInfo.usedList = res.data.used
      this.usedInfo.pageData = data
      this.usedInfo.dialogVisible = true
    },
    // 请求接口发布
    async toPublishData (data, isPublish) {
      let res = await this.$post('pages/isPublish.do', {isPublish, pageId: data.page_id})
      if (parseInt(res.code) === 1) {
        data.is_publish = isPublish
        return true
      }
      this.$message.error(res.message)
      return false
    },
    // 引用页面--前往设置
    toPageEditSet (pageId) {
      let url = `/#/siteModule/pageSetting/pageEdit?pageId=${pageId}`
      window.newwindow = window.open()
      window.newwindow.location.href = url
    },
    // 引用页面-- 去下线
    async toPublishDown () {
      this.usedInfo.submitLoading = true
      let res = await this.toPublishData(this.usedInfo.pageData, 0)
      this.usedInfo.submitLoading = false
      if (res) {
        this.$message.success('下线成功')
        this.usedInfo.dialogVisible = false
      }
    },
    // ----发布--end
    // 复制
    toCopyPage (pageId) {
      this.$confirm('确定复制页面吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '复制中...'
            let res = await this.$post('pages/copyPage.do', {pageId})
            instance.confirmButtonLoading = false
            instance.confirmButtonText = '确定'
            if (parseInt(res.code) === 1) {
              this.$message.success('复制成功')
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
        return false
      }).catch(() => {
        return false
      })
    },
    // 预览
    toPreview (pageId) {
      this.previewInfo.pageId = pageId
      this.previewInfo.toShowPreview = true
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import '~@/styles/common.scss';
  .btn-Wrap{
    margin: 38px 0 16px;
  }
</style>
