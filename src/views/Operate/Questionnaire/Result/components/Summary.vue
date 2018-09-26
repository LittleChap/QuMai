<!-- 问卷调查 汇总结果 -->
<template>
  <div class="summary-wrap" v-if="list.length">
    <div class="total-title">
      汇总结果<span class="total-subtitle">仅包含投票部分</span>
    </div>

    <div class="joinNum">参与人数：{{memberCount}}人</div>

    <div class="item" v-for="(item, index) in list" :key="index">
      <div class="itemTitle">
        {{index + 1}} . {{item.title}} {{item.answerNum ? '(多选)' : '(单选)'}}
      </div>
      <el-table :data="item.result" style="width: 100%;">
        <el-table-column label="选项内容" prop="answer"></el-table-column>
        <el-table-column label="票数" prop="num"></el-table-column>
        <el-table-column label="比例">
          <template slot-scope="scope">
            <el-progress :text-inside="true" :stroke-width="18" :percentage="getPercentage(item, scope.row)"></el-progress>
          </template>
        </el-table-column>
      </el-table>
      <div class="total">本题总票数: {{item.total}}</div>
    </div>
  </div>
  <div v-else class="emptySlogan">
    本问卷调查无投票问题，无法汇总。
  </div>
</template>
<script>

export default {
  name: 'questionnaire-summary',
  data () {
    return {
      list: [],
      memberCount: 0 // 总投票人数
    }
  },
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  created () {
    this.loadDetail()
  },
  methods: {
    // 计算百分比
    getPercentage (item, row) {
      let rate = row.num / item.total * 100
      return parseFloat(rate.toFixed(2))
    },
    // 获取详情数据
    async loadDetail () {
      let url = 'questionnaireSurvey/results.do'
      let body = {id: this.id}
      let res = await this.$post(url, body)
      if (+res.code === 1) {
        res.data.result.forEach(item => {
          item.total = 0
          item.result.forEach(i => { item.total += i.num })
        })
        this.list = res.data.result
        this.memberCount = res.data.memberCount || 0
      }
      // console.log('控制台打印:', res)
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import '~@/styles/common.scss';
  .summary-wrap{
    padding: 10px 20px;
  }
  .total-title {
    color: #333;
    font-size: 16px;
    line-height: 40px;
  }
  .total-subtitle{
    font-size: 14px;
    line-height: 40px;
    color: #888;
    padding-left: 10px;
  }
  .joinNum{
    font-size: 14px;
    color: #333;
    line-height: 40px;
  }
  .item{
    border: 1px solid #e5e5e5;
    margin-bottom: 20px;
  }
  .itemTitle{
    /*display: -webkit-box;*/
    /*-webkit-box-orient: vertical;*/
    /*-webkit-line-clamp: 1;*/
    /*overflow: hidden;*/
    line-height: 50px;
    padding-left: 10px;
    font-size: 14px;
  }
  .total{
    line-height: 40px;
    padding-left: 10px;
    font-size: 14px;
  }
  .emptySlogan{
    width: 100%;
    text-align: center;
    margin-top: 100px;
    font-size: 14px;
    color: #999;
  }
</style>
