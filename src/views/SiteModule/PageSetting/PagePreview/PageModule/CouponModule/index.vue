<!-- 优惠券模块 -->
<template>
    <!--  style 0: 轮播 1:大图平铺 2:横向滑动 3:图文导航 -->
    <!--多个模块-->
    <swiperCoupon v-if="data.style ===2" :listData="listData" :memberInfo="memberInfo"/>
    <!--一个平铺 v-else-if="data.style ===1 && listData.length"-->
    <tileCoupon v-else-if="data.style ===1" :listData="listData" :memberInfo="memberInfo" :bgColor="bgColor"/>
</template>

<script>
import swiperCoupon from './swiperCoupon'
import tileCoupon from './tileCoupon'
export default {
  name: 'coupon-index',
  components: { swiperCoupon, tileCoupon },
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    bgColor: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      memberInfo: {
        isHaveWechatMemberCard: 0 // 是否已经加入会员卡
      }
    }
  },
  computed: {
    listData () {
      return this.data.config
      // return this.data.config.filter(item => {
      //   return item.isPutaway === 1
      // })
    }
  },
  created () {},
  methods: {}
}
</script>

<style scoped>

</style>
