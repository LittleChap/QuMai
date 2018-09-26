<!-- 页面 编辑 - 图片编辑 -->
<template>
  <div class="imageEditWrap">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/siteModule/pageSetting/pageList' }">站点</el-breadcrumb-item>
      <el-breadcrumb-item>编辑图片模块</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="v-wrap listWrap"  v-loading="mainLoading">
      <div>
        <h3 class="v-title">编辑图片模块</h3>
      </div>
      <el-form :model="formData" :rules="formRules" ref="formDataRef" label-width="80px" class="v-form detailForm" @submit.native.prevent>
        <el-form-item label="模块名称" prop="title">
          <el-input v-model="formData.title" :maxlength="50"> </el-input>
        </el-form-item>
        <el-form-item label="样式" prop="style" class="styleBox">
          <div class="styleItem">
            <el-radio v-model="formData.style" :label="0">轮播</el-radio>
            <img src="./assets/banner1.png" alt="">
          </div>
          <div class="styleItem">
            <el-radio v-model="formData.style" :label="1">大图平铺</el-radio>
            <img src="./assets/banner2.png" alt="">
          </div>
        </el-form-item>
      </el-form>
      <div class="detailTable">
        <!-- 图片设置模块 -->
        <imgSetModule :listData="listData" desc="温馨提示：最多加入10张图片，仅支持 gif、 jpeg、 png、 bmp 4种格式"/>
        <!-- 上传图片组件 -->
        <singleUpload :listData="listData" :limit="10" :size="3" title="添加图片" desc="建议上传尺寸750*400，3MB以内"/>
        <el-row class="submitBtnWrap">
          <el-button  type="primary" :loading="saveLoading" @click="toSaveData">保存</el-button>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import singleUpload from './components/singleUpload'
import imgSetModule from './components/imgSetModule'
export default {
  name: 'page-edit',
  components: {singleUpload, imgSetModule},
  data () {
    return {
      pageModuleContentId: this.$route.query.pageModuleContentId, // 模板id
      falsePageModuleContentId: this.$route.query.falsePageModuleContentId, // 模板虚拟id
      pagesToken: this.$route.query.pagesToken, // 页面虚拟id
      pageId: this.$route.query.pageId, // 页面id
      mainLoading: false, // 总加载
      saveLoading: false, // 保存
      formData: { // 表单请求数据
        title: '', // 模块标题
        style: 0 // 样式
      },
      formRules: {
        title: [{required: true, message: '请输入模块名称', trigger: 'blur'}],
        style: [{required: true, message: '请选择样式', trigger: 'change'}]
      },
      listData: [] // 图片列表
    }
  },
  created () {
    this.getDetail()
  },
  methods: {
    // 获得详情
    async getDetail () {
      this.mainLoading = true
      let reqData = {
        pagesToken: this.pagesToken,
        falsePageModuleContentId: this.falsePageModuleContentId,
        pageModuleContentId: this.pageModuleContentId
      }
      let res = await this.$post('pagemodulecontent/getFalsePageModuleContentInfo.do', reqData)
      this.mainLoading = false
      if (parseInt(res.code) === 1) {
        // this.formData.style = res.style || 0
        // this.formData.title = res.title || ''
        if (res.data.pageModuleContent) {
          this.formData.title = res.data.pageModuleContent.title || ''
          if (res.data.pageModuleContent.dataConfig) {
            this.formData.style = res.data.pageModuleContent.dataConfig.style || 0
            this.listData = res.data.pageModuleContent.dataConfig.config || []
            this.listData.map(item => {
              switch (item.urlType) {
                case 0:
                  item.label = '不跳转'
                  break
                case 1:
                  item.label = `页面：${item.name}`
                  break
                case 2:
                  item.label = `商品：${item.name}`
                  break
                case 3:
                  item.label = `链接：${item.url}`
                  break
                case 4:
                  item.label = '购物车'
                  break
                case 5:
                  item.label = '个人中心'
                  break
              }
            })
          }
        }
        // this.listData = res.config || []
      } else {
        this.$message.error(res.message)
      }
    },
    // 校验 每一个 跳转设置是要有填写
    toValidate () {
      let hasNoType = false // 是否没有选择跳转设置的
      let hasNoUrl = false // 是否没有填写跳转设置的
      this.listData.map(item => {
        if (!item.urlType && item.urlType !== 0) {
          hasNoType = true
          item.error = '请选择跳转设置'
          return false
        }
        // 0:不跳转 1:页面 2:商品 3:链接  4:购物车 5:个人中心
        if ((item.urlType === 1 || item.urlType === 2 || item.urlType === 3) && !item.url) {
          hasNoUrl = true
          item.error = item.urlType === 1 ? '请选择页面' : (item.urlType === 2 ? '请选择商品' : '请输入链接地址')
          return false
        }
      })
      this.listData = JSON.parse(JSON.stringify(this.listData))
      if (hasNoType) {
        this.$message.error('请选择跳转设置')
        return false
      }
      if (hasNoUrl) {
        this.$message.error('请设置跳转设置对应的选项')
        return false
      }
      return true
    },
    // 保存数据
    toSaveData () {
      this.$refs.formDataRef.validate(async valid => {
        let validRes = this.toValidate()
        if (!valid) {
          if (!this.formData.title || this.formData.title) {
            this.$message.error('请输入模块名称')
          }
          return false
        }
        if (!validRes) {
          console.log('失败')
          return false
        }
        if (!this.listData.length) {
          this.$message.error('请添加图片')
          return false
        }
        // 下面保存
        let config = []
        this.listData.map(item => {
          let obj = {
            image: item.image,
            urlType: item.urlType,
            url: item.url
          }
          config.push(obj)
        })
        let req = {
          pageModuleContentId: this.pageModuleContentId,
          falsePageModuleContentId: this.falsePageModuleContentId,
          pagesToken: this.pagesToken,
          moduleType: 1, // 0:首页  1:图片编辑 2:商品编辑 3:导航编辑 4:拼团编辑 5:秒杀编辑
          title: this.formData.title,
          dataConfig: JSON.stringify({
            style: this.formData.style,
            config: config
          })
        }
        this.saveLoading = true
        let res = await this.$post('pagemodulecontent/falseEdit.do', req)
        this.saveLoading = false
        if (parseInt(res.code) === 1) {
          this.$message.success('保存成功')
          setTimeout(async () => {
            let obj = {
              pagesToken: this.pagesToken,
              moduleTitle: this.formData.title,
              falsePageModuleContentId: this.falsePageModuleContentId
            }
            await this.$store.dispatch('SetPageEditInfo', obj)
            this.$router.go(-1)
            // this.$router.push(`/siteModule/pageSetting/pageEdit?pageId=${this.pageId}&pagesToken=${this.pagesToken}&moduleTitle=${this.formData.title}`)
          })
        } else {
          this.$message.error(res.message)
        }
      })
    }

  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import '~@/styles/common.scss';
  .detailForm{
    width: 660px;
  }
  .detailTable{
    width: 600px;
  }
  .submitBtnWrap{
    margin: 40px 0;
    text-align: center;
  }
  .styleBox{
    width: 100%;
  }
  .styleItem{
    display: inline-block;
    margin-right: 20px;
    img{
      border: 1px solid $border-base;
      display: block;
      width: 260px;
      /*height: 100px;*/
    }
  }

</style>
