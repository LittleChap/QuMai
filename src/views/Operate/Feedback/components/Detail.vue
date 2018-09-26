<!-- 推广弹窗 -->
<template>
  <el-dialog title="意见反馈" v-if="value" :visible="value" class="v-dialog " width="650px" top="10vh" @close="beforeClose">
    <div class="contentBox">
      <el-form label-width="100px" size="small" class="v-form" @submit.native.prevent>
        <el-form-item label="反馈类型" prop="desc">
          <div class="grey">{{data.desc}}</div>
        </el-form-item>

        <el-form-item label="联系方式" prop="sort">
          <div class="grey">{{data.desc}}</div>
        </el-form-item>

        <el-form-item label="反馈图片" prop="sort">
          <div class="feedImgWrap">
            <img class="feedImg" :src="item.image" alt="" v-for="(item, index) in data.images" :key="index">
          </div>
        </el-form-item>

        <el-form-item label="反馈内容" prop="sort">
          <div class="grey">{{data.content}}</div>
        </el-form-item>

      </el-form>
    </div>
    <div slot="footer" class="v-dialog-footer">
      <el-button @click="beforeClose" type="primary">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'hot-search-dialog',
  props: {
    data: { // 数据
      type: Object,
      default: () => {
      }
    },
    value: false // 显示与否
  },
  data () {
    return {}
  },
  created () {
  },
  methods: {
    // 关闭弹窗
    beforeClose () {
      this.$emit('input', false)
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import '~@/styles/common.scss';

  .grey {
    color: #999;
    word-break: break-all;
  }

  .feedImgWrap {
    display: flex;
    flex-wrap: wrap;
  }

  .feedImg {
    display: block;
    width: 100px;
    height: 60px;
    background: #f5f5f5;
    margin: 5px;
  }
</style>
