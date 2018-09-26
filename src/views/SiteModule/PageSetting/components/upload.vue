<!-- 图片上传 -->
<template>
  <el-upload class="imgUploadWrap" :data="uploadReqData" :show-file-list="false"
             :before-upload="beforeItemPicUpload"
             :on-success="handleItemUploadSuccess"
             :on-error="handleItemUploadError"
             action="/backend/mobileUpload/uploadImg.do">
    <div class="leftPart">
      <img :src="item.image">
      <span>更换图片</span>
    </div>
  </el-upload>
</template>

<script>
export default {
  name: 'upload',
  props: {
    index: {
      type: Number,
      default: 0
    },
    item: {
      type: Object,
      default: () => {}
    },
    list: {
      type: Array,
      default: () => []
    },
    callBack: {
      type: Function,
      default: () => {}
    }
  },
  data () {
    return {
      uploadReqData: {
        from: 'banner'
      }
    }
  },
  methods: {
    // 单个的项的图片
    beforeItemPicUpload (file) {
      const isLt2M = file.size / 1024 / 1024 < 1
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      if (!isLt2M) {
        this.$message.error('上传的图片大小不能超过 1MB!')
        return false
      }
      if (!isJPG && !isPNG) {
        this.$message.error('上传的图片只能是 png/jpg 格式!')
        return false
      }
      return true
    },
    handleItemUploadSuccess (res) {
      console.log(res)
      if (parseInt(res.code) === 1) {
        this.item.image = res.data.url
        this.list.splice(this.index, 1, this.item)
        // this.callBack(this.index, this.item)
      } else {
        this.$message.error(res.message)
      }
    },
    handleItemUploadError () {
      this.$message.error('上传失败！')
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import '~@/styles/common.scss';
  .imgUploadWrap{
    width: 120px;
    height: 120px;
    overflow: hidden;
  }
  .leftPart{
    position: relative;
    width: 120px;
    height: 120px;
    /*margin-right: 20px;*/
     /*border: 1px solid $border-base;*/
     border-radius: 4px;
    background-color: #f5f5f5;
    overflow: hidden;
    img{
      height: 100%;
      width: 100%;
    }
    span{
      position: absolute;
      bottom: 0;
      left: 0;
      display: block;
      width: 100%;
      text-align: center;
      line-height: 36px;
      background: rgba(0,0,0,0.6);
      color: #fff;
      font-size: $font-size-base;
    }
  }
</style>
