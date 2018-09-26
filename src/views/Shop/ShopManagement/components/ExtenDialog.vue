<!-- 推广弹窗 -->
<template>
  <el-dialog title="推广链接" v-if="value" :visible="value" class="v-dialog " width="650px" top="10vh" @close="beforeClose">
    <div class="contentBox">
      <div class="urlBox">
        <p><span>推广链接：</span> {{infoData.extensionUrl}}</p>
        <el-button plain size="small" class="copyBtn" :data-clipboard-text="infoData.extensionUrl" @click="copyToClipboard">复制</el-button>
      </div>
      <div class="codeImg" ref="box">
        <span>二维码：</span>
        <img class="urlImg" :src="infoData.extensionImageBase64" alt="">
        <img :src="infoData.extensionImageBase64" ref="imgRef" style="display: none">
      </div>
      <!-- <div class="goodsBox">
        <img :src="infoData.extensionImage" alt="">
        <h4>{{infoData.goodsName}}</h4>
      </div> -->
      <div class="upLogoBox">
        <span>店铺logo：</span>
        <el-upload
          class="upload-demo"
          action="/backend/mobileUpload/uploadImg.do"
          :show-file-list="false"
          :data="{from: 'other'}"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeUpload">
          <el-button size="small" type="primary">点击上传</el-button>
          <span style="margin-left:10px" slot="tip" class="el-upload__tip">建议上传尺寸50*50，100KB以内</span>
        </el-upload>
      </div>
    </div>
    <div slot="footer" class="v-dialog-footer">
      <el-button @click="toSaveImg">保存本地</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Clipboard from 'clipboard'
export default {
  name: 'extension-dialog',
  props: {
    infoData: { // 数据
      type: Object,
      default: () => {}
    },
    value: false // 显示与否
  },
  data () {
    return {
      fileList: [],
      mainLoading: false // 加载页面
    }
  },
  methods: {
    // 关闭弹窗
    beforeClose () {
      this.$emit('input', false)
      this.toClear()
    },
    // 保存数据
    toSave () {
      this.$emit('success', false)
      this.$emit('input', false)
      this.toClear()
    },
    // 清楚数据
    toClear () { },
    // 复制文本
    copyToClipboard () {
      var clipboard = new Clipboard('.copyBtn')
      clipboard.on('success', e => {
        this.$message.success('链接已复制到剪切板')
        // 释放内存
        clipboard.destroy()
      })
      clipboard.on('error', e => {
        // 不支持复制
        this.$message.success('该浏览器不支持自动复制')
        // 释放内存
        clipboard.destroy()
      })
    },
    // 图片保存本地
    toSaveImg () {
      let canvas = this.convertImageToCanvas(this.$refs.imgRef)
      let url = canvas.toDataURL('image/png') // PNG格式
      // let url = this.infoData.extensionImage
      let fileName = '推广二维码.png'
      try {
        // 生成一个a元素
        let a = document.createElement('a')
        // 创建一个单击事件
        let event = new MouseEvent('click')
        event.initEvent('click', true, true)
        console.log('url', url)

        // 将a的download属性设置为我们想要下载的图片名称，若name不存在则使用‘下载图片名称’作为默认名称
        a.download = fileName
        // 将生成的URL设置为a.href属性
        a.href = url

        // 触发a的单击事件
        a.dispatchEvent(event)
      } catch (error) {
        console.log('失败', error)
        // let canvas = this.convertImageToCanvas(this.$refs.imgRef)
        // console.log('保存', canvas)
        let blob = canvas.msToBlob()
        window.navigator.msSaveBlob(blob, fileName)
        // this.SaveAs5(url)
        // window.location.href = url
      }
      // a.click()

      // blob
      // let fileName = '推广二维码.png'
      //
      // // let blob = new Blob(this.infoData.qrcodeBase64Str, {type: 'image/png'})
      // let blob = this.base64ToBlob(this.infoData.qrcodeBase64Str)
      // console.log('blob', blob)
      // if (window.navigator.msSaveOrOpenBlob) {
      //   console.log('有数据11111')
      //   navigator.msSaveBlob(blob, fileName)
      // } else {
      //   console.log('有数据22222')
      //   let link = document.createElement('a')
      //   let event = new MouseEvent('click')
      //   event.initEvent('click', true, true)
      //   link.href = window.URL.createObjectURL(blob)
      //   link.download = fileName
      //   // link.dispatchEvent(event)
      //   link.click()
      //   window.URL.revokeObjectURL(link.href)
      // }
    },
    // base64 转 canvas
    convertImageToCanvas (image) {
      var canvas = document.createElement('canvas')
      canvas.width = image.width
      canvas.height = image.height
      canvas.getContext('2d').drawImage(image, 0, 0)
      return canvas
    },
    SaveAs5 (imgURL) {
      let oPop = window.open(imgURL, '推广二维码.png', 'width=1, height=1, top=5000, left=5000', true)
      for (; oPop.document.readyState != 'complete';) {
        if (oPop.document.readyState == 'complete') break
      }
      oPop.document.execCommand('SaveAs')
      oPop.close()
    },

    // base64 转 blob
    base64ToBlob (code) {
      let parts = code.split(';base64,')
      let contentType = parts[0].split(':')[1]
      let raw = atob(parts[1])
      let rawLength = raw.length
      console.log('rawLength', rawLength)

      let uInt8Array = new Uint8Array(rawLength)

      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i)
      }
      return new Blob([uInt8Array], {type: contentType})
    },
    beforeUpload (file) {
    //   console.log(file)
      const isLt100kb = file.size / 1024 < 100
      if (!isLt100kb) {
        this.$message.error('上传头像图片大小不能超过 100KB!')
      }
      return isLt100kb
    },
    async handleAvatarSuccess (res) {
      if (parseInt(res.code) === 1) {
        let reqData = {
          shopId: this.infoData.shopId,
          image: res.data.url
        }
        let result = await this.$post('shop/saveLogo.do', reqData)
        if (+result.code === 1) {
          this.$message.success('保存成功')
          this.$emit('refresh', this.infoData.shopId)
        } else {
          this.$message.error(result.message)
        }
      } else {
        this.$message.error(res.message)
      }
    },
    handlePictureCardPreview (file) {
      this.a = file.url
      console.log(file)
      console.log(file.url)
      this.dialogVisible = true
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import '~@/styles/common.scss';
  .contentBox{
    .urlBox{
      display: flex;
      align-items: center;
      justify-content: space-between;
      span{
        margin-right: 24px;
      }
    }
    .codeImg{
      display: flex;
      align-items: flex-start;
      img {
        width: 300px;
        height: 300px;
      }
      span{
        margin: 26px 16px 0 0;
      }
    }
    .goodsBox{
      display: flex;
      align-items: flex-start;
      margin: 0 0 10px 0;
      /*margin-left: 130px;*/
      img {
        width: 80px;
        height: 80px;
      }
      h4{
        font-weight: normal;
        margin: 0 20px;
      }
    }
    .upLogoBox{
      display: flex;
      justify-content: flex-start;
    }
  }
</style>
