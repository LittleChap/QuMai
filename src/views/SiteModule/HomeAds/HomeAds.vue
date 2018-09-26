<!-- 首页广告 -->
<template>
  <div class="pageAdsWrap">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/siteModule/pageSetting/pageList' }">站点</el-breadcrumb-item>
      <el-breadcrumb-item>首页广告</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="v-wrap listWrap" >
      <div>
        <h3 class="v-title">首页广告</h3>
      </div>
      <el-form :model="formData" :rules="formRules" ref="formDataRef" label-width="80px" class="v-form detailForm" v-loading="mainLoading" @submit.native.prevent>
        <el-form-item label="上传图片" prop="image">
          <el-upload class="uploadWrap" drag :data="uploadReqData" :disabled="uploading" :show-file-list="false"
                     :before-upload="beforePicUpload"
                     :on-success="handleUploadSuccess"
                     :on-error="handleUploadError"
                     accept=".gif,.jpeg,.jpg,.png,.bmp"
                     action="/backend/mobileUpload/uploadImg.do">
            <div class="uploadContent" v-loading="uploading" element-loading-text="文件上传中...">
              <div class="imgBox" v-if="formData.image">
                <img v-if="formData.image" :src="formData.image" class="avatar">
                <div class="mask">
                  <div style="line-height: 20px">
                    <i class="el-icon-upload"></i>
                    <p class="el-upload-text">将文件拖到此处<br>或<em>点击上传</em></p>
                  </div>
                </div>
              </div>
              <i class="el-icon-upload" v-if="!formData.image"></i>
              <div class="el-upload__text" style="line-height: 20px" v-if="!formData.image">将文件拖到此处<br>或<em>点击上传</em></div>
            </div>
            <div class="el-upload__tip" slot="tip" style="line-height: 20px">首页广告图片，建议上传尺寸600*800，仅支持 gif、 jpeg、 png、 bmp 4种格式，3MB以内</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="跳转页面" prop="urlType" style="margin-bottom: 0"> </el-form-item>
        <el-form-item label="" class="radioBox" label-width="10px" style="margin-bottom: 40px">
          <div>
            <el-radio v-model="formData.urlType" :label="1" @change="changeType">页面（仅显示发布中的页面）</el-radio>
            <el-select v-show="formData.urlType === 1" filterable  v-model="formData.pageId" placeholder="请选择页面">
              <el-option v-for="item in pageList" :key="item.page_id" :label="item.name" :value="item.page_id"> </el-option>
            </el-select>
          </div>
          <div>
            <el-radio v-model="formData.urlType" :label="3" @change="changeType">链接</el-radio>
            <el-input v-show="formData.urlType === 3" v-model="formData.url" :maxlength="200" @blur="toValidText(formData.url)"> </el-input>
          </div>
          <div>
            <el-radio v-model="formData.urlType" :label="2" @change="changeType">商品（单个）</el-radio>
            <div class="detailTable" v-show="formData.urlType===2">
              <ProductChooseTable :listData="goodsList" chooseSingle :showSort="false" @getList="getGoodsId"/>
            </div>
          </div>
          <div>
            <el-radio v-model="formData.urlType" :label="0" @change="changeType">不跳转</el-radio>
          </div>
          <div v-if="formData.typeError && showError" class="el-form-item__error" > {{formData.typeError}} </div>
        </el-form-item>

        <!--<el-form-item v-show="formData.urlType !== 1" label=""  label-width="10px" class="radioBox">-->
          <!--<el-radio v-model="formData.urlType" :label="1" @change="changeType">页面（仅显示发布中的页面）</el-radio>-->
        <!--</el-form-item>-->
        <!--<el-form-item v-if="formData.urlType === 1" label="" prop="pageId" label-width="10px" class="radioBox">-->
          <!--<el-radio v-model="formData.urlType" :label="1" @change="changeType">页面（仅显示发布中的页面）</el-radio>-->
          <!--<el-select filterable  v-model="formData.pageId" placeholder="请选择页面">-->
            <!--<el-option v-for="item in pageList" :key="item.page_id" :label="item.name" :value="item.page_id"> </el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->

        <!--<el-form-item v-show="formData.urlType !== 3" label="" label-width="10px" class="radioBox">-->
          <!--<el-radio v-model="formData.urlType" :label="3" @change="changeType">链接</el-radio>-->
        <!--</el-form-item>-->
        <!--<el-form-item v-if="formData.urlType === 3" label="" prop="url" label-width="10px" class="radioBox">-->
          <!--<el-radio v-model="formData.urlType" :label="3" @change="changeType">链接</el-radio>-->
          <!--<el-input v-model="formData.url" :maxlength="20"> </el-input>-->
        <!--</el-form-item>-->

        <!--<el-form-item v-if="formData.urlType !== 2" label="" label-width="10px" class="radioBox">-->
          <!--<el-radio v-model="formData.urlType" :label="2" @change="changeType">商品（单个）</el-radio>-->
        <!--</el-form-item>-->
        <!--<el-form-item v-if="formData.urlType === 2" label="" prop="goodsId" label-width="10px" class="radioBox">-->
          <!--<el-radio v-model="formData.urlType" :label="2" @change="changeType">商品（单个）</el-radio>-->
          <!--<div class="detailTable">-->
            <!--<productChooseTable :listData="goodsList" chooseSingle :showSort="false" @getList="getGoodsId"/>-->
          <!--</div>-->
        <!--</el-form-item>-->

        <!--<el-form-item label="" label-width="10px" class="radioBox">-->
          <!--<el-radio v-model="formData.urlType" :label="0" @change="changeType">不跳转</el-radio>-->
        <!--</el-form-item>-->
        <el-form-item label="" label-width="10px" class="submitBtnWrap">
          <el-button  type="primary" :loading="saveLoading" @click="toSave">保存</el-button>
          <el-button  @click="toClearData">清除广告</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import ProductChooseTable from '../components/ProductChooseTable'
export default {
  name: 'home-ads',
  components: {ProductChooseTable},
  data () {
    return {
      pageId: Number(this.$route.query.pageId || -1), // 页面id
      pageRandomId: '', // 新增时需要随机页面id
      formData: { // 请求参数
        image: '',
        urlType: 0, // urlType 0:不跳转 1:页面 2:商品 3:链接  4:购物车 5:个人中心
        pageId: '',
        url: '',
        typeError: null
      }, // 表单请求数据
      formRules: {
        image: [{required: true, message: '请上传图片', trigger: 'blur, change'}]
        // urlType: [{required: true, message: '请选择跳转类型', trigger: 'change'}],
        // pageId: [{required: true, message: '请选择页面', trigger: 'change'}],
        // url: [{required: true, message: '请输入链接', trigger: 'blur'}]
      },
      mainLoading: false, // 数据的加载
      saveLoading: false, // 保存
      uploading: false,
      uploadReqData: {
        from: 'banner'
      },
      pageList: [], // 页面列表
      goodsList: [] // 选中的商品
    }
  },
  computed: {
    showError () {
      if (this.formData.urlType === 1 && this.formData.pageId) {
        return false
      } else if (this.formData.urlType === 3 && this.formData.url) {
        return this.toValidText(this.formData.url)
        // return false
      } else if (this.formData.urlType === 2 && this.formData.goodsId) {
        return false
      }
      return true
    }
  },
  created () {
    this.getDetail()
    this.getPageList()
  },
  methods: {
    // 获得详情
    async getDetail () {
      this.mainLoading = true
      let res = await this.$post('pagemodulecontent/getAdvertisingInfo.do')
      this.mainLoading = false
      if (parseInt(res.code) === 1) {
        if (res.data.adverst) {
          this.formData.pageModuleContentId = res.data.adverst.pageModuleContentId
          if (res.data.adverst.config && res.data.adverst.config.length) {
            this.formData.image = res.data.adverst.config[0].image
            this.formData.urlType = res.data.adverst.config[0].urlType
            if (this.formData.urlType === 2) {
              this.goodsList.push(res.data.adverst.config[0])
            }
            if (this.formData.urlType === 1) {
              this.formData.pageId = res.data.adverst.config[0].url
            }
            if (this.formData.urlType === 3) {
              this.formData.url = res.data.adverst.config[0].url
            }
          }
        }
      } else {
        this.$message.error(res.message)
      }
    },
    // 获得页面列表
    async getPageList () {
      let reqData = {
        isPublish: 1,
        currentPage: 1,
        showCount: 1000
      }
      this.mainLoading = true
      let res = await this.$post('pages/list.do', reqData)
      this.mainLoading = false
      if (parseInt(res.code) === 1) {
        this.pageList = res.data.pagesList
      }
    },
    changeType () {
      this.formData.typeError = null
    },
    // -- 上传图片
    beforePicUpload (file) {
      const isLt2M = file.size / 1024 / 1024 < 3
      if (!isLt2M) {
        this.$message.error('上传的图片大小不能超过 3MB!')
        return false
      }
      let fileType = file.type === 'image/gif' || file.type === 'image/jpeg' || file.type === 'image/bmp' || file.type === 'image/png'
      if (!fileType) {
        this.$message.error('上传的图片仅支持 gif、 jpeg、 png、 bmp 4种格式！')
        return false
      }
      this.uploading = true
      return true
    },
    handleUploadSuccess (res) {
      this.uploading = false
      if (parseInt(res.code) === 1) {
        this.formData.image = res.data.url
      } else {
        this.formData.image = ''
        this.$message.error(res.message)
      }
    },
    handleUploadError () {
      this.$message.error('上传失败！')
      this.uploading = false
      this.formData.image = ''
    },
    // -- 上传图片---end

    // 获得商品id
    getGoodsId (val) {
      if (val && val.length) {
        this.formData.goodsId = val[0].goodsId
      } else {
        this.formData.goodsId = null
      }
    },
    // 校验链接的格式
    toValidText (value) {
      if (value === '') {
        this.formData.typeError = '请输入链接'
        return true
      }
      let reg = /^http(s)?.*?$/
      if (!reg.test(value)) {
        this.formData.typeError = '请输入http和https开头的链接地址'
        return true
      }
      return false
    },

    // 保存 -上线 / 下线
    toSave () {
      this.$refs.formDataRef.validate(async valid => {
        if (this.goodsList && this.goodsList.length) {
          this.formData.goodsId = this.goodsList[0].goodsId
        } else {
          this.formData.goodsId = null
        }
        // urlType 0:不跳转 1:页面 2:商品 3:链接  4:购物车 5:个人中心
        if (this.formData.urlType === 1 && !this.formData.pageId) {
          this.formData.typeError = '请选择页面'
        } else if (this.formData.urlType === 3 && !this.formData.url) {
          this.formData.typeError = '请输入链接'
        } else if (this.formData.urlType === 2 && !this.formData.goodsId) {
          this.formData.typeError = '请选择商品'
        } else {
          this.formData.typeError = null
        }
        if (this.formData.urlType === 3 && this.formData.url) {
          this.toValidText(this.formData.url)
        }
        if (!valid || this.formData.typeError) {
          return false
        }
        console.log('结果呀 保存啦啦啦')
        let config = {
          image: this.formData.image,
          urlType: this.formData.urlType,
          sort: 1
        }
        if (config.urlType === 1) {
          config.url = this.formData.pageId
        }
        if (config.urlType === 3) {
          config.url = this.formData.url
        }
        if (config.urlType === 2) {
          config.goodsId = this.formData.goodsId
        }
        let dataConfig = {
          config: []
        }
        dataConfig.config.push(config)
        let reqData = {
          pageModuleContentId: this.formData.pageModuleContentId,
          dataConfig: JSON.stringify(dataConfig),
          status: 1
        }
        this.saveLoading = true
        let res = await this.$post('pagemodulecontent/saveAdvertising.do', reqData)
        this.saveLoading = false
        if (parseInt(res.code) === 1) {
          this.$message.success('保存成功')
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 清空广告
    toClearData () {
      this.$confirm('确定清空首页广告设置？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '执行中...'
            let reqData = {
              pageModuleContentId: this.formData.pageModuleContentId,
              dataConfig: '',
              status: 0
            }
            let res = await this.$post('pagemodulecontent/saveAdvertising.do', reqData)
            instance.confirmButtonLoading = false
            instance.confirmButtonText = '确定'
            if (parseInt(res.code) === 1) {
              this.formData.image = ''
              this.formData.urlType = 0
              this.formData.pageId = ''
              this.formData.url = ''
              this.formData.typeError = null
              this.$message.success('首页广告清除成功')
            } else {
              this.$message.error(res.message)
            }
            done()
          } else {
            done()
          }
        }
      }).then(() => {
        return false
      }).catch(() => {
        return false
      })
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import '~@/styles/common.scss';
  .detailForm{
    width: 600px;
    margin-top: 20px;
  }
  .radioBox{
    .el-radio{
      margin-right: 30px;
    }
    .el-input, .el-select {
      width: 300px;
    }
  }
  .detailTable{
    width: 900px;
    line-height: 24px;
    .el-table {
      border: 1px solid $border-base;
      border-bottom: none
    }
  }
  .submitBtnWrap{
    margin: 10px 0 0;
    .el-button{
      width: 100px;
    }
  }
  .uploadWrap{
    min-width: 300px;
    min-height: 300px;
    .uploadContent {
      height: 100%;
      min-height: 300px;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .imgBox {
      width: 100%;
      min-height: 300px;
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
<style lang="scss" rel="stylesheet/scss">
  .pageAdsWrap{
    .uploadWrap{
      .el-upload {
        width: 300px;
        /*height: 100%;*/
        vertical-align: top;
      }
      .el-upload-dragger {
        width: 300px;
        height: auto;
        min-height: 300px;
        max-height: 500px;
        /*.el-upload__text{*/
        /*padding-bottom: 20px;*/
        /*}*/
      }
    }
  }
</style>
