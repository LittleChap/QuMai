<template>
  <el-dialog title="手机版" class="v-dialog" :visible="value" width="800px" top="8vh" @close="beforeClose" :close-on-click-modal="false">
    <div class="contentWrap">
      <Preview v-if="value" :url="url" :pageReqInfo="pageReqInfo" :pageInfo="pageInfo"/>
      <div class="codeWrap">
        <p>微信扫一扫：</p>
        <!--<img alt="">-->

        <VueQrCode :value="linkUrl" :options="{ size: 200}" tag="img" />
        <p class="linkUrl" :class="{'overText': this.pageInfo}">{{linkUrl}}</p>
        <el-button class="copyBtn" plain :data-clipboard-text="linkUrl" @click="copyToClipboard">复制链接</el-button>
      </div>
    </div>
    <div slot="footer"></div>
  </el-dialog>
</template>

<script>
import Preview from './PageModule/PageModule'
import Clipboard from 'clipboard'
import {mobileClientUrl} from '@/utils/config'
import VueQrCode from '@xkeshi/vue-qrcode'

export default {
  name: 'index',
  components: {Preview, VueQrCode},
  props: {
    pagesToken: '',
    pageId: '',
    url: { // 请求参数
      type: String,
      default: 'pages/preview.do'
    },
    pageReqInfo: { // 请求数据
      type: Object,
      default: () => {}
    },
    value: false,
    pageInfo: { // 填写的数据
      type: Object,
      default: null
    }
  },
  data () {
    return {
      // linkUrl: 'https://www.baidu.com'
    }
  },
  created () {
    // if (this.pageInfo) {
    //   this.linkUrl = `${mobileClientUrl}/pagePreview?pagesToken=${this.pagesToken}&pageInfo=${encodeURIComponent(JSON.stringify(this.pageInfo))}`
    // } else {
    //   this.linkUrl = `${mobileClientUrl}/pagePreview?pagesToken=${this.pagesToken}`
    // }
  },
  computed: {
    linkUrl () {
      if (this.pageInfo) { // 从编辑页面进入
        let string = JSON.stringify(this.pageInfo)
        string = string.replace(/%/g, '%25')
        return `${mobileClientUrl}/pagePreview?pagesToken=${this.pagesToken}&pageInfo=${encodeURIComponent(string)}`
      } else { // 页面列表进入
        return `${mobileClientUrl}/pagePreview?pageId=${this.pageId}`
      }
    }
  },
  methods: {
    beforeClose () {
      this.$emit('input', false)
    },
    // 复制文本
    copyToClipboard () {
      let clipboard = new Clipboard('.copyBtn')
      clipboard.on('success', e => {
        this.$message.success('链接已复制到剪切板')
        // 释放内存
        clipboard.destroy()
      })
      clipboard.on('error', e => {
        // 不支持复制
        this.$message.error('该浏览器不支持自动复制')
        // 释放内存
        clipboard.destroy()
      })
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .contentWrap{
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .codeWrap{
    width: 350px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    p{
      word-break: break-all;
    }
    .linkUrl{
      position: relative;
      line-height: 22px;
      height: 44px;
      overflow: hidden;
      word-break: break-all;
      white-space: normal;
      text-overflow: ellipsis;
      word-wrap: break-word;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      &.overText:after{
        content: '…';
        position:absolute;
        bottom:0;
        right: 0;
        background:#FFF;
        padding-left:2px;
      }
    }
    /*img {*/
      /*width: 250px;*/
      /*height: 250px;*/
      /*border: 1px solid #333;*/
    /*}*/
  }

</style>
