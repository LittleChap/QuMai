<!-- 问卷详情 弹窗 -->
<template>
  <el-dialog title="问卷详情" :visible="value" class="v-dialog" @close="close">
    <div class="contentBox">
      <div class="dsf">
        <div class="contentTitle">会员账号: {{question.mobile}}</div>
        <div class="contentTitle">会员昵称: {{question.nickname}}</div>
      </div>

      <el-table :data="listData" v-loading="mainLoading" style="width: 100%">
        <el-table-column label="问题标题" prop="title"></el-table-column>
        <el-table-column label="回答内容">
          <template slot-scope="scope">
            <div v-for="(item, index) in scope.row.answerArray" :key="index">
              {{item.answer}} {{index !== scope.row.total - 1 ? ', ' : ''}}
            </div>
          </template>
        </el-table-column>
      </el-table>

    </div>
    <div slot="footer" class="v-dialog-footer">
      <el-button type="primary" @click="close">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'question-detail-dialog',
  props: {
    question: { // 数据
      type: Object,
      default: () => {}
    },
    value: false // 显示与否
  },
  data () {
    return {
      mainLoading: false, // 加载页面
      listData: []
    }
  },
  created () {
    this.getQuestionDetail()
  },
  methods: {
    // 关闭弹窗
    close () {
      this.$emit('input', false)
    },
    // 回显数据
    async getQuestionDetail () {
      let url = 'questionnaireSurvey/resultDetail.do'
      let body = {questionId: this.question.questionId}
      let res = await this.$post(url, body)
      if (+res.code === 1) {
        res.data.result.forEach(i => {
          try {
            i.answerArray = JSON.parse(i.answer) || {}
            i.total = i.answerArray.length
          } catch (e) {}
        })
        this.listData = res.data.result
      } else {
        this.$message.error(res.message)
      }
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import '~@/styles/common.scss';
  .dsf{
    display: flex;
  }
  .contentTitle{
    width: 50%;
    line-height: 40px;
  }
</style>
