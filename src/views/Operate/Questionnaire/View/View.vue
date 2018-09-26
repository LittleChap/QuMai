<!-- 问卷调查 查看 -->
<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>运营</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/operate/questionniare/list' }">问卷调查管理</el-breadcrumb-item>
      <el-breadcrumb-item>问卷调查详情</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="v-wrap" v-loading="mainLoading">
      <div>
        <h3 class="v-title">问卷调查详情</h3>
      </div>
      <el-form :model="form" :rules="rules" ref="formDataRef" label-width="100px" size="small" class="v-form detailForm"
               @submit.native.prevent>
        <el-form-item label="问卷标题" prop="title">
         {{form.title}}
        </el-form-item>

        <el-form-item label="发放时间" prop="timeArr">
          {{$moment(form.startTime).format('YYYY-MM-DD HH:mm:ss')}} - {{$moment(form.endTime).format('YYYY-MM-DD HH:mm:ss')}}
        </el-form-item>

        <el-form-item label="登录状态" prop="loginStatus">
          {{form.loginStatus === 0 ? '允许不登录匿名参与' : '必须登录参与'}}
        </el-form-item>

        <el-form-item label="查看结果" prop="isVewResult">
          {{form.isViewResult === 0 ? '开启' : '关闭'}}
        </el-form-item>

        <el-form-item label="参与次数" prop="loginStatus">
          {{form.effectiveResults === 1 ? `可参与 ${form.accessNum} 次(取最后一次为结果)` : `可参与 ${form.accessNum} 次(投票结果累加)`}}
        </el-form-item>

        <el-form-item label="" label-width="30px">
          <!--题目列表 开始-->
          <div class="listWrap" style="width: 1000px">
            <div class="detailTable">
              <!--表格正文-->
              <el-table :data="form.itemArray" v-loading="mainLoading" style="width: 100%">
                <el-table-column align="center" prop="id" label="id" width="55"></el-table-column>
                <el-table-column align="center" label="问卷标题">
                  <template slot-scope="scope">
                    {{scope.row.moduleType === 1 ? '-' : scope.row.title}}
                  </template>
                </el-table-column>
                <el-table-column align="center" label="模块类型">
                  <template slot-scope="scope">
                    {{renderModuleType(scope.row.moduleType)}}
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <!--题目列表 结束-->
        </el-form-item>

        <!--操作按钮-->
        <el-form-item label-width="30px">
          <el-button @click="$router.go(-1)" size="1">返 回</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--<Modules v-model="showModulesDialog" v-if="showModulesDialog" :id="currentRow.id" @success="moduleAdded"></Modules>-->
  </div>
</template>
<script>
// import Modules from './components/Modules'

export default {
  name: 'questionnaire-edit',
  // components: {Modules},
  data () {
    return {
      mainLoading: false, // 全局加载状态
      saveLoading: false, // 保存时候的加载状态
      showModulesDialog: false, // 显示模块编辑对话框
      currentRow: {}, // 当前问题
      multiSelect: [], // 表格选中项
      pageInfo: {
        currentPage: 1,
        showCount: 10,
        totalResult: 0
      },
      form: {
        id: 0,
        title: '',
        timeArr: [],
        startTime: '',
        endTime: '',
        loginStatus: 0,
        isViewResult: 0,
        effectiveResults: 1,
        accessNum1: '',
        accessNum2: '',
        accessNum: '',
        idItemArray: '',
        itemArray: []
      },
      rules: {},
      // 模块类型
      moduleTypes: [
        {value: 1, label: '富文本模块'},
        {value: 2, label: '日期模块'},
        {value: 3, label: '文本模块'},
        {value: 4, label: '手机号模块'},
        {value: 5, label: '邮箱模块'},
        {value: 6, label: '地址模块'},
        {value: 7, label: '图片投票模块'},
        {value: 8, label: '文本投票模块'},
        {value: 9, label: '分页模块'}
      ]
    }
  },
  created () {
    this.loadDetail()
  },
  methods: {
    // 回显 模块类型
    renderModuleType (id) {
      let m = this.moduleTypes.find(i => i.value === id) || {label: ''}
      return m.label
    },
    // 获取详情
    async loadDetail () {
      this.form.id = this.$route.query.id || 0
      if (!this.form.id) return
      let url = 'questionnaireSurvey/detail.do'
      let body = {id: this.form.id}
      let res = await this.$post(url, body)
      if (+res.code === 1) {
        this.form = res.data
        // 构造数据
        this.form.timeArr = [new Date(this.form.startTime), new Date(this.form.endTime)]
        if (this.form.effectiveResults === 1) {
          this.form.accessNum1 = this.form.accessNum
          this.form.accessNum2 = ''
        }
        if (this.form.effectiveResults === 2) {
          this.form.accessNum1 = ''
          this.form.accessNum2 = this.form.accessNum
        }
        if (!this.form.itemArray) {
          this.form.itemArray = []
        }
        this.form.id = this.$route.query.id
        // 排序
        this.form.itemArray.sort((a, b) => { return a.sort - b.sort })
        // 重新整理排序
        // this.form.itemArray.map((item, index) => { item.sort = index })
      } else {
        this.$message.error(res.message)
      }
      // console.log(res)
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import '~@/styles/common.scss';

  .detailForm {
    margin-top: 20px;
  }

  .w100 {
    width: 100px !important;
  }

  .w400 {
    width: 400px !important;
  }

  .mb10 {
    margin-bottom: 10px;
  }

  .r90 {
    font-size: 17px;
    transform: rotate(90deg);
  }

  .r270 {
    font-size: 17px;
    transform: rotate(270deg);
  }

  .sortIcon {
    font-size: 20px;
  }

  .radioItem {
    /*width: 340px;*/
    display: inline-block;
    & + .radioItem {
      margin-top: 10px;
    }
    /*margin-right: 30px;*/
    .el-input {
      width: 80px;
    }
    .el-select {
      margin-left: 10px;
      width: 270px;
      vertical-align: top;
    }
    .el-range-editor {
      width: 380px;
    }
    .el-date-editor.is-disabled, .el-date-editor.is-disabled:hover, .el-date-editor.is-disabled:focus {
      border-color: $border-base !important;
    }
  }

  .detailTable {
    /*width: 70%;*/
    margin-top: 20px;
    line-height: 20px;
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
