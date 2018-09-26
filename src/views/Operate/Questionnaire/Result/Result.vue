<!-- 问卷调查 结果 -->
<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>运营</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/operate/questionniare/list' }">问卷调查管理</el-breadcrumb-item>
      <el-breadcrumb-item>问卷调查结果</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="v-wrap" v-loading="mainLoading">
      <div>
        <h3 class="v-title">问卷调查结果</h3>
      </div>
      <div class="main-wrap">
        <div class="tab-wrap">
          <div class="tab-btn-wrap">
            <div class="tab-item" :class="{tabActive:showResultStyle === 'summary'}" @click="toggleResultStyle('summary')">汇总结果</div>
            <div class="tab-item" :class="{tabActive:showResultStyle === 'detail'}" @click="toggleResultStyle('detail')">详细结果</div>
          </div>
        </div>

        <Summary :id="id" v-show="showResultStyle === 'summary'" />
        <Detail :id="id" v-show="showResultStyle === 'detail'" />
      </div>
    </div>

  </div>
</template>

<script>
import Summary from './components/Summary'
import Detail from './components/Detail'
export default {
  name: 'questionnaire-result',
  components: {Summary, Detail},
  data () {
    return {
      id: '',
      // showResultStyle: 'detail', // 显示 汇总结果 还是 详细结果
      showResultStyle: 'summary', // 显示 汇总结果 还是 详细结果
      mainLoading: false // 全局加载状态
    }
  },
  created () {
    this.id = this.$route.query.id
  },
  methods: {
    // 切换  汇总结果-详细结果
    toggleResultStyle (style) {
      this.showResultStyle = style
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import '~@/styles/common.scss';
  .main-wrap{
    padding: 10px;
  }
  .tab-wrap{
    border-bottom:2px solid #f0f2f5;
  }
  .tab-btn-wrap{
    width: 200px;
    overflow-x: visible;
    display: flex;
    background: #f0f2f5;
    border-radius: 4px 4px 0 0;
    justify-content: space-around;
  }
  .tab-item{
    width: 96px;
    height: 32px;
    color: #303133;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 2px;
    border-radius: 4px 4px 0 0;
  }
  .tabActive{
    color: #1989fa;
    background: #fff;
  }
</style>
