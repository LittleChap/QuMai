<!-- 运营 日期选择 -->
<template>
  <div>
    <el-select v-model="params.dateType" placeholder="请选择" class="typeSelection" @change="selectionChanged">
      <el-option label="日" value="date"></el-option>
      <el-option label="周" value="week"></el-option>
      <el-option label="月" value="month"></el-option>
    </el-select>

    <el-date-picker v-model="date"
                    :type="params.dateType"
                    :format="typeMap[params.dateType].format"
                    :placeholder="typeMap[params.dateType].placeholder"
                    @change="selectionChanged">
    </el-date-picker>
  </div>
</template>

<script>
export default {
  name: 'opearte-data-date-picker',
  data () {
    return {
      date: '', // 日期数组,组件只能接收数组,需要转换
      // 日期类型映射表
      typeMap: {
        date: { format: 'yyyy年 M月 d日', placeholder: '请选择日期' },
        week: { format: 'yyyy年 第W周', placeholder: '请选择周' },
        month: { format: 'yyyy年 M月', placeholder: '请选择月份' }
      }
    }
  },
  props: {
    params: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    selectionChanged () {
      // 没有选择时间,就直接退出,避免格式化错误.
      if (!this.date) return

      let m = this.$moment(this.date)
      switch (this.params.dateType) {
        case 'date':
          this.params.startTime = m.format('YYYY-MM-DD 00:00:00')
          this.params.endTime = m.format('YYYY-MM-DD 23:59:59')
          break
        case 'week':
          this.params.startTime = m.day('Sunday').format('YYYY-MM-DD 00:00:00')
          this.params.endTime = m.day('Saturday').format('YYYY-MM-DD 23:59:59')
          break
        case 'month':
          this.params.startTime = m.format('YYYY-MM-01 00:00:00')
          let days = m.daysInMonth() // 一个月的总天数,用来计算月底最后一天
          this.params.endTime = m.add(days - 1, 'days').format('YYYY-MM-DD 23:59:59')
      }

      console.log('控制台打印:', this.params.startTime, this.params.endTime)
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .typeSelection {
    width: 60px;
  }
</style>
