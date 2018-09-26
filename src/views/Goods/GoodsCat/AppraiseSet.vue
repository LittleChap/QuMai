<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">商品</el-breadcrumb-item>
      <el-breadcrumb-item>评价引导词设置</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="v-wrap brandListWrap">
      <div>
        <h3 class="v-title">评价引导词设置</h3>
      </div>
      <div class="detailTable">
        <el-row class="btn-Wrap">
          <el-button type="primary" class="" icon="el-icon-plus" @click="toAdd()" plain>新 增</el-button>
          <el-button type="danger" class="" icon="el-icon-minus" @click="allDelete" plain>删除</el-button>
        </el-row>
        <!-- 表单-头 -->
        <el-table  v-loading="mainLoading" class="listTable" :data="listData"
         tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column  label="排序" align="center" width="80" prop="sort"> </el-table-column>
          <el-table-column  prop="evalution_label_name"  align="center" label="评价引导词"></el-table-column>
          <el-table-column prop="createTime" align="center" label="添加时间">
            <template slot-scope="scope">
              <span v-if="scope.row.create_time">{{$moment(scope.row.create_time).format('YYYY-MM-DD HH:ss:mm')}}</span>
              <span v-else> - </span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="200px">
            <template slot-scope="scope">
               <span class="v-blue v-text-cursor" @click="toEdit(scope.row)">编辑</span>
              <i class="v-blue v-separator" >|</i>
              <span class="v-red v-text-cursor" @click="singeDelete(scope.row.evalution_label_id)">删除</span>
            </template>
          </el-table-column>
        </el-table>
        <!-- 表单-尾 -->
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
    <!-- 弹出框-头 -->
    <el-dialog  class="v-dialog" width='500px' :title="dialogTitle" :visible.sync="dialogShow">
      <el-form :model="dialogData" label-position="top" :rules="rules" ref="appraiseForm">
        <el-form-item label="评级引导词" label-width="120px" prop="evalution_label_name">
          <el-input  v-model="dialogData.evalution_label_name"  auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序" label-width="120px" prop="sort">
          <el-input v-model="dialogData.sort"  auto-complete="off"></el-input>
        </el-form-item>
        <!-- <el-form-item label="地区英文名称" :key="dialogData.create_time" label-width="120px">
          <el-input  auto-complete="off"></el-input>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogShow = false">取 消</el-button>
        <el-button  type="primary" @click="toSave">{{dialogTitle === '添加' ? '确定' : '保存'}}</el-button>
        <!-- <el-button v-if="isSave == 'edit'" type="primary" @click="toEdit">确 定</el-button> -->
        <!-- <el-button v-if="isSave == 'add'" type="primary" @click="toAdd">确 定</el-button> -->
      </div>
    </el-dialog>
    <!-- 弹出框-结束 -->
  </div>
</template>

<script>
export default {
  name: 'brand-list',
  data () {
    let validaSort = (rule, value, callback) => {
      let num = Number(value)
      if (isNaN(num)) {
        callback(new Error('请输入正确数值'))
      } else {
        callback()
      }
    }
    return {
      mainLoading: false,
      pageInfo: {
        currentPage: 1,
        showCount: 10,
        totalResult: 0
      },
      rules: {
        evalution_label_name: [{required: true, message: '请输入评价引导词'}],
        sort: [{validator: validaSort}]
      },
      // formData
      listData: [],
      multiSelect: [], // 选中的数据
      // 弹出显示数据
      dialogData: {
        evalution_label_name: '',
        sort: '',
        evalution_label_id: '',
        cat_id: this.$route.query.catId
      },
      dialogTitle: '',
      // 弹出显示
      dialogShow: false
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
      let res = await this.$post('evaluationlabel/list.do', Object.assign({cat_id: this.$route.query.catId}, reqData))
      if (parseInt(res.code) === 1) {
        this.mainLoading = false
        this.listData = res.data.evaluationLabelList
        this.pageInfo.totalResult = res.data.totalResult || 0
        // this.isOpen = res.data.
        this.mainLoading = false
      } else {
        this.mainLoading = false
        this.$message.error(res.message)
      }
    },
    // 保存数据
    toSave () {
      this.$refs.appraiseForm.validate(async (isOk, obj) => {
        if (isOk) {
          let reqData = Object.assign({}, this.dialogData)
          let url = 'evaluationlabel/save.do'
          if (this.dialogTitle === '编辑') {
            url = 'evaluationlabel/edit.do'
            delete reqData.cat_id
          } else {
            delete reqData.evalution_label_id
          }
          this.dialogShow = false
          let res = await this.$post(url, reqData)
          if (+res.code === 1) {
            this.$message.success('保存成功')
            this.getList()
          } else {
            this.$message.error(res.message)
          }
        }
      })
    },
    // 编辑弹窗
    toEdit (val) {
    //   this.dialogData.key = new Date()
      this.dialogData.sort = val.sort
      this.dialogData.evalution_label_name = val.evalution_label_name
      this.dialogData.evalution_label_id = val.evalution_label_id
      this.dialogShow = true
      this.dialogTitle = '编辑'
    },
    // 新增弹出框
    toAdd () {
      this.dialogShow = true
      this.dialogTitle = '添加'
      this.$refs.appraiseForm.resetFields()
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
      this.$confirm(`确认删除这${this.multiSelect.length}个评价引导？`, '确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let idArray = []
        this.multiSelect.map(item => {
          idArray.push(item.evalution_label_id)
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
      let res = await this.$post('evaluationlabel/falseDeleteAll.do', reqData)
      if (parseInt(res.code) === 1) {
        this.$message.success('删除成功')
        this.getList()
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
