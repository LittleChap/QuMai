<!-- 图片编辑、导航编辑的图片上传组件 -->
<template>
  <el-upload v-show="!this.limit || (this.limit && listData.length < this.limit)" class="singleUploadWrap" drag :data="uploadReqData" :disabled="uploading" :show-file-list="false"
             :before-upload="beforePicUpload"
             :on-success="handleUploadSuccess"
             :on-error="handleUploadError"
             accept=".gif,.jpeg,.jpg,.png,.bmp"
             action="/backend/mobileUpload/uploadImg.do">
    <div class="uploadContent" v-loading="uploading" element-loading-text="文件上传中...">
      <!--<div class="imgBox" v-if="formData.image">
        <img v-if="formData.image" :src="formData.image" class="avatar">
        <div class="mask">
          <div style="line-height: 20px">
            <i class="el-icon-upload"></i>
            <p class="el-upload-text">将文件拖到此处<br>或<em>点击上传</em></p>
          </div>
        </div>
      </div>-->
      <i class="el-icon-upload"></i>
      <div class="el-upload__text" style="line-height: 20px" > <i class="el-icon-plus"></i>{{title}}<br>{{desc}}</div>
    </div>
    <!--<div class="el-upload__tip" slot="tip">首页轮播图片，建议上传尺寸750*350，5MB以内</div>-->
  </el-upload>
</template>

<script>
export default {
  name: 'single-upload',
  props: {
    listData: {
      type: Array,
      default: () => []
    },
    limit: {
      type: Number,
      default: null
    },
    size: {
      type: Number,
      default: 100
    },
    title: {
      type: String,
      default: ''
    },
    desc: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      uploading: false,
      uploadReqData: {
        from: 'banner'
      }
    }
  },
  methods: {
    // -- 上传图片
    beforePicUpload (file) {
      if (this.limit && this.listData.length >= this.limit) {
        this.$message.error(`最多加入${this.limit}张图片`)
        return false
      }
      const isLt2M = file.size / 1024 / 1024 < this.size
      let fileType = file.type === 'image/gif' || file.type === 'image/jpeg' || file.type === 'image/bmp' || file.type === 'image/png'
      if (!fileType) {
        this.$message.error('上传的图片仅支持 gif、 jpeg、 png、 bmp 4种格式！')
        return false
      }
      if (!isLt2M) {
        this.$message.error(`上传的图片大小不能超过${this.size}MB!`)
        return false
      }
      this.uploading = true
      return true
    },
    handleUploadSuccess (res) {
      this.uploading = false
      if (parseInt(res.code) === 1) {
        this.listData.push({
          image: res.data.url,
          label: '页面'
        })
      } else {
        this.$message.error(res.message)
      }
    },
    handleUploadError () {
      this.$message.error('上传失败！')
      this.uploading = false
    }
    // 上传-----end
  }
}
</script>

<style scoped  lang="scss" rel="stylesheet/scss">
  @import '~@/styles/common.scss';
  .singleUploadWrap{
    width: 600px;
    min-height: 200px;
    .uploadContent {
      height: 100%;
      width: 100%;
    }
    .imgBox {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      img{
        width: 100%;
        height: auto;
        vertical-align: middle;
      }
      .mask{
        opacity: 0;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,0.3);
        transition: 0.3s;
        display: flex;
        align-items: center;
        justify-content: center;
        .el-icon-upload{
          margin: 0;
          color: #fff !important;
          vertical-align: top;
        }
        .el-upload-text{
          color: #fff;
          margin: 0;
          em{
            color: $color-primary;
            font-weight: bold;
            font-style: normal;
          }
        }
      }
      &:hover{
        .mask {
          opacity: 1;
        }
      }
    }
  }

</style>
<style  lang="scss" rel="stylesheet/scss">
  .singleUploadWrap{
    .el-upload {
      width: 100%;
      height: 100%;
      vertical-align: top;
    }
    .el-upload-dragger {
      width: 100%;
      height: 200px;
    }
  }

</style>
