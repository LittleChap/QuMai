<!-- 问卷调查 编辑 -->
<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>运营</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/operate/questionniare/list' }">问卷调查管理</el-breadcrumb-item>
      <el-breadcrumb-item>问卷调查编辑</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="v-wrap" v-loading="mainLoading">
      <div>
        <h3 class="v-title">问卷调查编辑</h3>
      </div>
      <el-form :model="form" :rules="rules" ref="formDataRef" label-width="100px" size="small" class="v-form detailForm"
               @submit.native.prevent>
        <el-form-item label="问卷标题" prop="title">
          <el-input type="textarea" v-model="form.title" rows="4" :maxlength="200" size="small" class="w400"></el-input>
        </el-form-item>

        <el-form-item label="发放时间" prop="timeArr">
          <el-date-picker v-model="form.timeArr" size="small" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
                          range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" class="w400">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="登录状态" prop="loginStatus">
          <el-radio v-model="form.loginStatus" :label="0">允许不登录匿名参与</el-radio>
          <el-radio v-model="form.loginStatus" :label="1">必须登录参与</el-radio>
        </el-form-item>

        <el-form-item label="查看结果" prop="isVewResult">
          <el-radio v-model="form.isViewResult" :label="1">开启</el-radio>
          <el-radio v-model="form.isViewResult" :label="0">关闭</el-radio>
        </el-form-item>

        <el-form-item label="参与次数" prop="loginStatus">
          <div class="mb10">
            <el-radio v-model="form.effectiveResults" :label="1">
              可参与
              <el-input type="number" v-model="form.accessNum1" class="w100" size="mini" min="0"></el-input>
              次(取最后一次为结果)
            </el-radio>
          </div>
          <div>
            <el-radio v-model="form.effectiveResults" :label="2">
              可参与
              <el-input type="number" v-model="form.accessNum2" class="w100" size="mini" min="0"></el-input>
              次(投票结果累加)
            </el-radio>
          </div>
        </el-form-item>

        <el-form-item label="" label-width="30px">
          <!--题目列表 开始-->
          <div class="listWrap" style="width: 1000px">
            <QuestionList :data="form.itemArray" />
          </div>
          <!--题目列表 结束-->
        </el-form-item>

        <!--操作按钮-->
        <el-form-item label-width="30px">
          <el-button type="primary" @click="toSave" :loading="saveLoading" size="1">保 存</el-button>
          <el-button @click="$router.go(-1)" size="1">返 回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import QuestionList from './components/QuestionList'

export default {
  name: 'questionnaire-edit',
  components: {QuestionList},
  data () {
    return {
      mainLoading: false, // 全局加载状态
      saveLoading: false, // 保存时候的加载状态
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
      rules: {}
    }
  },
  created () {
    this.loadDetail()
  },
  methods: {
    // 验证表单
    validateForm () {
      if (!this.form.title) {
        this.$message.error('请输入问卷标题')
        return false
      }
      if (this.form.timeArr.length !== 2) {
        this.$message.error('请选择发放时间')
        return false
      }
      if (this.form.effectiveResults === 1 && (!this.form.accessNum1 || this.form.accessNum1 < 1)) {
        this.$message.error('请输入参与次数')
        return false
      }
      if (this.form.effectiveResults === 2 && (!this.form.accessNum2 || this.form.accessNum2 < 1)) {
        this.$message.error('请输入参与次数')
        return false
      }
      return true
    },
    // 保存
    async toSave () {
      if (!this.validateForm()) return
      let url = this.form.id ? 'questionnaireSurvey/edit.do' : 'questionnaireSurvey/add.do'
      // 构造数据
      this.form.startTime = this.$moment(this.form.timeArr[0]).format('YYYY-MM-DD HH:mm:ss')
      this.form.endTime = this.$moment(this.form.timeArr[1]).format('YYYY-MM-DD HH:mm:ss')
      if (this.form.effectiveResults === 1) {
        this.form.accessNum = this.form.accessNum1
      }
      if (this.form.effectiveResults === 2) {
        this.form.accessNum = this.form.accessNum2
      }
      this.form.idItemArray = this.form.itemArray.map(i => {
        return {id: i.id, sort: i.sort}
      })
      // console.log('控制台打印:', this.form.idItemArray)
      let body = {stringJSON: JSON.stringify(this.form)}
      let res = await this.$post(url, body)
      if (+res.code === 1) {
        this.$message.success('修改成功')
        // this.$router.back()
      } else {
        this.$message.error(res.message)
      }
      // console.log('保存修改', res)
    },
    /**
     * 获取详情
     * @param assign 是全量加载(false),还是只更新问题列表(true)
     **/
    async loadDetail (assign = false) {
      this.form.id = this.$route.query.id || 0
      if (!this.form.id) return
      let url = 'questionnaireSurvey/detail.do'
      let body = {id: this.form.id}
      let res = await this.$post(url, body)
      if (+res.code === 1) {
        // 判断是否是更新列表数据
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
        this.form.itemArray.map((item, index) => { item.sort = index })
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
</style>
