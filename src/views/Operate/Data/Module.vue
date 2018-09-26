<!-- 运营 模块 -->
<template>
  <div class="moduleWrap">
    <div class="moduleTitle">{{title}}</div>
    <div class="moduleNum">{{data[titleField]}}{{unit}}</div>
    <div class="compare">
      <div class="compareTitle">较前一{{typesMap[data.dateType] || '日'}}</div>
      <div class="red" v-if="+data[rateFiled] > 0">{{ convertRate(rateFiled)}} % ↑</div>
      <div class="green" v-if="+data[rateFiled] < 0">{{convertRate(rateFiled)}} % ↓</div>
      <div v-if="+data[rateFiled] === 0 || data[rateFiled] === '-'">
        {{data[rateFiled] === '-' ? '-' : '0%'}}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'opearte-data-module',
  data () {
    return {
      typesMap: {date: '日', week: '周', month: '月'}
    }
  },
  props: {
    // 数据
    data: {
      type: Object,
      default: () => {}
    },
    // 显示标题
    title: {
      type: String,
      default: ''
    },
    // 显示单位
    unit: {
      type: String,
      default: ''
    },
    // 标题字段
    titleField: {
      type: String,
      default: ''
    },
    // 比率字段
    rateFiled: {
      type: String,
      default: ''
    }
  },
  methods: {
    convertRate (field) {
      let rate = this.data[field]
      let num = parseFloat(rate) * 100
      return num.toFixed(2)
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .moduleWrap {
    border-radius: 5px;
    margin: 10px 5px;
    width: 250px;
    height:200px;
    background: #f5f5f5;
    border: 1px solid #e5e5e5;
    padding: 20px;
    box-sizing: border-box;
  }
  .moduleTitle{

  }
  .moduleNum{
    font-size: 18px;
    line-height: 40px;
    font-weight: bold;
    padding-left: 10px;
  }
  .compare{
    display: flex;
  }
  .compareTitle{
    width: 80px;
  }
  .green{
    color: #0fb21e;
  }
  .red{
    color: #d73b3c;
  }
</style>
