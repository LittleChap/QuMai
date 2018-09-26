<template>
  <div class="sideMenuWrap" v-if="menuList && menuList.children.length">
    <el-menu
      v-if="menuList && menuList.children.length"
      :default-active="$route.path"
      :default-openeds="currentOpen"
      class="menuBox">
      <template v-for="(secondItem, index) in menuList.children" >
        <router-link v-if="secondItem.noDropDown" :key="index" :to="secondItem.redirect">
          <el-menu-item :index="secondItem.redirect" :class="{'is-active': isActiveSecond(secondItem)}">
            <div class="titleBox">
              <i class="icon" :class="secondItem.meta.icon ? secondItem.meta.icon : 'el-icon-star-off'"></i>
              <span class="titleTop">{{secondItem.name}}</span>
            </div>
          </el-menu-item>
        </router-link>
        <el-submenu v-else :key="index" :index="String(index)">
          <template slot="title">
            <div class="titleBox">
              <i class="icon" :class="secondItem.meta.icon ? secondItem.meta.icon : 'el-icon-star-off'"></i>
              <span class="titleTop">{{secondItem.name}}</span>
            </div>
          </template>
          <template v-for="(thirdItem, thirdIndex) in secondItem.children" v-if="!thirdItem.hidden">
            <router-link :to="menuList.path+'/' + secondItem.path + '/' +thirdItem.path" :key="thirdIndex">
              <el-menu-item :index="menuList.path+'/' + secondItem.path + '/'+thirdItem.path" :key="thirdIndex" :class="{'is-active': isActiveThird(thirdItem, index)}">
                {{thirdItem.name}}
              </el-menu-item>
            </router-link>
          </template>
        </el-submenu>
      </template>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'side-bar',
  data () {
    return {
      currentOpen: []
    }
  },
  computed: {
    menuList () {
      let index = Number(this.$store.getters.menuInfo.currentFirstMenu || 0)
      let list = {
        children: []
      }
      if (this.$store.getters.addRouters.length) {
        list = this.$store.getters.addRouters[index]
      }
      return list
    },
    cuttentOpen () {
      const list = this.menuList
      let arr = []
      list.children.map((item, i) => {
        arr.push(String(i))
      })
      return arr
    }
  },
  methods: {
    // 二级目录的选中
    isActiveSecond (data) {
      if (this.$route.path === data.redirect) {
        return true
      }
      let isActive = false
      data.children.map(item => {
        if (item.meta.menuId === this.$route.path) {
          isActive = true
        }
      })
      return isActive
    },
    // 三级目录的选中
    isActiveThird (thirdItem, index) {
      if (this.$route.path === thirdItem.meta.menuId) {
        return true
      }
      let isActive = false
      if (thirdItem.meta.childrenList && thirdItem.meta.childrenList.length) {
        thirdItem.meta.childrenList.map(item => {
          if (item === this.$route.path) {
            let isHas = false
            this.currentOpen.map(i => {
              if (i === String(index)) {
                isHas = true
              }
            })
            if (!isHas) {
              this.currentOpen.push(String(index))
            }
            isActive = true
          }
        })
      }
      return isActive
    }
  }
}
</script>

<style lang="scss" scoped rel="stylesheet/scss">
  @import '~@/styles/common.scss';
  .menuBox{
    border: none;
    .titleBox{
      margin: 0 10px;
      height: 56px;
      border-top: 1px solid $border-base;
    }
    .icon{
      line-height: 56px;
      font-size: $font-min-title;
      color: $color-primary;
    }
    .el-menu-item{
      min-width: auto;
      &.is-active{
        border-right: 3px solid $color-primary;
        background: $table-background;
      }
    }
    .el-submenu{
      .el-menu-item{
        padding-left: 64px !important;
      }
      .el-icon-arrow-down{
        font-size: 16px;
      }
      &.is-opened {
        .titleBox{
          border-bottom: 1px solid $border-base;
        }
      }
    }
  }

</style>
<style lang="scss" rel="stylesheet/scss">
  .sideMenuWrap{
    .el-submenu__icon-arrow{
      font-size: 16px;
      right: 30px;
    }
  }
</style>
