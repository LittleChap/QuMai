<template>
  <div class="box">
    <Item v-for="(item, i) in listData" :key="i" :itemData="item"/>
  </div>
</template>

<script>
import Item from './item'
export default {
  name: 'index',
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  components: {Item},
  computed: {
    listData () {
      return this.data.config.filter(item => {
        return !item.isStop
      })
    }
  }
}
</script>

<style scoped>
</style>
