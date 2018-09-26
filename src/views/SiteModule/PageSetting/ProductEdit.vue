<!-- 页面 编辑 - 商品编辑 -->
<template>
  <div class="imageEditWrap">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/siteModule/pageSetting/pageList' }">站点</el-breadcrumb-item>
      <el-breadcrumb-item>编辑商品模块</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="v-wrap listWrap"  v-loading="mainLoading">
      <div>
        <h3 class="v-title">编辑商品模块</h3>
      </div>
      <el-form :model="formData" :rules="formRules" ref="formDataRef" label-width="80px" class="v-form detailForm" @submit.native.prevent>
        <el-form-item label="模块名称" prop="title">
          <el-input v-model="formData.title" :maxlength="50"> </el-input>
        </el-form-item>
        <el-form-item label="样式" prop="style">
          <div class="styleItem">
            <el-radio v-model="formData.style" :label="1">大图平铺</el-radio>
            <img src="./assets/goods2.png" alt="">
          </div>
          <div class="styleItem">
            <el-radio v-model="formData.style" :label="2">横向滑动</el-radio>
            <img src="./assets/goods-round.png" alt="">
          </div>
        </el-form-item>
      </el-form>
      <div class="detailTable">
        <ProductChooseTable :listData="listData"/>
        <el-row class="submitBtnWrap">
          <el-button  type="primary" :loading="saveLoading" @click="toSaveData">保存</el-button>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import ProductChooseTable from '../components/ProductChooseTable'
export default {
  name: 'page-edit',
  components: {ProductChooseTable},
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
        style: 1 // 样式
      },
      formRules: {
        title: [{required: true, message: '请输入模块名称', trigger: 'blur'}],
        style: [{required: true, message: '请选择样式', trigger: 'change'}]
      },
      listData: [] // 选中的商品数据
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
        if (res.data.pageModuleContent) {
          this.formData.title = res.data.pageModuleContent.title || ''
          if (res.data.pageModuleContent.dataConfig) {
            this.formData.style = res.data.pageModuleContent.dataConfig.style || 1
            this.listData = res.data.pageModuleContent.dataConfig.config || []
          }
        }
      } else {
        this.$message.error(res.message)
      }
    },

    // 保存数据
    toSaveData () {
      this.$refs.formDataRef.validate(async valid => {
        if (!valid) {
          if (!this.formData.title || this.formData.title) {
            this.$message.error('请输入模块名称')
          }
          return false
        }
        if (!this.listData.length) {
          this.$message.error('请添加商品')
          return false
        }
        // 下面保存
        let config = []
        this.listData.map(item => {
          let obj = {
            goodsId: item.goodsId,
            sort: item.sort
          }
          config.push(obj)
        })
        let req = {
          pageModuleContentId: this.pageModuleContentId,
          falsePageModuleContentId: this.falsePageModuleContentId,
          pagesToken: this.pagesToken,
          moduleType: 2, // 0:首页  1:图片编辑 2:商品编辑 3:导航编辑 4:拼团编辑 5:秒杀编辑
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
    width: 900px;
  }
  .submitBtnWrap{
    margin: 40px 0;
    text-align: center;
  }
  .styleItem{
    display: inline-block;
    margin-right: 20px;
    min-height: 150px;
    img{
      border: 1px solid $border-base;
      display: block;
      width: 260px;
      /*height: 100px;*/
    }
  }

</style>
