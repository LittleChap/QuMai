<template>
  <div class="appWrapper">
    <nav-bar class="navBar"></nav-bar>
    <div class="mainContainer">
      <transition name="fade" mode="out-in">
        <router-view :key="key"></router-view>
      </transition>
    </div>
  </div>
</template>

<script>
import NavBar from '@/views/Layout/NavBar'
import SideBar from '@/views/Layout/SideBar'
export default {
  name: 'layout',
  components: {
    NavBar,
    SideBar
  },
  computed: {
    key () {
      return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    }
  }
}
</script>

<style lang="scss" scoped rel="stylesheet/scss">
  @import '~@/styles/common.scss';
  .appWrapper{
    width: 100%;
    height: 100vh;
    background: $background-color;
    .navBar{
      height: 60px;
      width: 100%;
    }
    .mainContainer{
      height: calc( 100vh - 60px );
      width: 100%;
      box-sizing: border-box;
      overflow: auto;
      padding: 0 30px;
      .mainContent{
        width: 100%;
        height: 100%;
      }
    }

  }
</style>
