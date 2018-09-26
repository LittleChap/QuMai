<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">全局</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/global/site/basic' }">站点设置</el-breadcrumb-item>
      <el-breadcrumb-item >基本设置</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="v-wrap detailWrap basicWrap">
      <div>
        <h3 class="v-title">基本设置</h3>
        <el-form class="formBox" ref="ruleForm" :rules="formRules" :model="formData" label-width="150px"
            v-loading="mainLoading">
          <el-form-item label="商城名称" class="inputItem" prop="name">
            <el-input v-model="formData.shop_name" placeholder="请输入" :maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="登陆页logo" class="inputItem" prop="image">
            <el-upload class="uploadWrap" drag :data="uploadReqData" :disabled="editUploading" :show-file-list="false"
                :before-upload="editBeforePicUpload" :on-success="editLogoHandleUploadSuccess" :on-error="editHandleUploadError"
                action="/backend/mobileUpload/uploadImg.do">
              <div class="uploadContent" v-loading="editUploading" element-loading-text="文件上传中...">
                <div class="imgBox" v-if="formData.backend_login_logo">
                  <img v-if="formData.backend_login_logo" :src="formData.backend_login_logo" class="avatar">
                  <div class="mask">
                    <div>
                      <i class="el-icon-upload"></i>
                      <p class="el-upload-text">将文件拖到此处，或<em>点击上传</em></p>
                    </div>
                  </div>
                </div>
                <i class="el-icon-upload" v-if="!formData.shop_logo"></i>
                <div class="el-upload__text" v-if="!formData.shop_logo">将文件拖到此处，或<em>点击上传</em></div>
              </div>
              <div class="el-upload__tip" slot="tip">运营后台登录页图片，建议上传尺寸390*310，5MB以内</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="商城logo" class="inputItem" prop="image">
            <el-upload class="uploadWrap" drag :data="uploadReqData" :disabled="shopUploading" :show-file-list="false"
                :before-upload="shopBeforePicUpload" :on-success="shopIogoHandleUploadSuccess" :on-error="shopLogohandleUploadError"
                action="/backend/mobileUpload/uploadImg.do">
              <div class="uploadContent" v-loading="shopUploading" element-loading-text="文件上传中...">
                <div class="imgBox smallImgBox" v-if="formData.shop_logo">
                  <img v-if="formData.shop_logo" :src="formData.shop_logo" class="avatar smallImg">
                  <div class="mask">
                    <div>
                      <i class="el-icon-upload"></i>
                      <p class="el-upload-text">将文件拖到此处，或<em>点击上传</em></p>
                    </div>
                  </div>
                </div>
                <i class="el-icon-upload" v-if="!formData.shop_logo"></i>
                <div class="el-upload__text" v-if="!formData.shop_logo">将文件拖到此处，或<em>点击上传</em></div>
              </div>
              <div class="el-upload__tip" slot="tip">商城LOGO图片，用于分享链接使用，建议尺寸50*50，30kb以内</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="买家中心登录页图片" class="inputItem" prop="image">
            <el-upload class="uploadWrap" drag :data="uploadReqData" :disabled="sellerUploading" :show-file-list="false"
                :before-upload="sellerBeforePicUpload" :on-success="SellerLogoHandleUploadSuccess" :on-error="sellerHandleUploadError"
                action="/backend/mobileUpload/uploadImg.do">
              <div class="uploadContent" v-loading="sellerUploading" element-loading-text="文件上传中...">
                <div class="imgBox" v-if="formData.seller_login_logo">
                  <img v-if="formData.seller_login_logo" :src="formData.seller_login_logo" class="avatar">
                  <div class="mask">
                    <div>
                      <i class="el-icon-upload"></i>
                      <p class="el-upload-text">将文件拖到此处，或<em>点击上传</em></p>
                    </div>
                  </div>
                </div>
                <i class="el-icon-upload" v-if="!formData.shop_logo"></i>
                <div class="el-upload__text" v-if="!formData.shop_logo">将文件拖到此处，或<em>点击上传</em></div>
              </div>
              <div class="el-upload__tip" slot="tip">卖家中心登录页图片，建议上传尺寸390*310，5MB以内</div>
            </el-upload>
          </el-form-item>
          <el-button class="btn" @click="toSave" type="primary">保 存</el-button>
        </el-form>
      </div>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data () {
    return {
      // 图片上床加载开关
      editUploading: false,
      shopUploading: false,
      sellerUploading: false,
      // 其他
      saveLoading: false,
      deleteLoading: false,
      mainLoading: false,
      uploadReqData: {
        from: 'other'
      },
      customer_service_setting: {
        is_phone_service_open: '',
        customer_service_working_time: '',
        customer_service_phone_number: '',
        is_online_service_open: '',
        online_service_working_time: '',
        online_service_phone_number: ''
      },
      // 判断是否上传图片
      upImg: {
        editKey: false,
        shopKey: false,
        sellerKey: false
      },
      formData: {
        shop_name: '',
        backend_login_logo: '',
        shop_logo: '',
        seller_login_logo: ''
      },
      formRules: {
        bannerName: [
          {
            required: true, message: '请输入banner名称', trigger: 'blur'
          }
        ],
        skip: [
          {
            required: true, message: '请选择是否跳转', trigger: 'blur'
          }
        ],
        image: [
          {
            required: true, message: '请选择图片', trigger: 'blur'
          }
        ],
        url: [
          {
            required: true, message: '请输入url', trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 获取列表
    async getDetail () {
      let data = {
        plugin_id: 'siteSettingPlugin'
      }
      this.mainLoading = true
      let res = await this.$post('setting/input.do', data)
      if (parseInt(res.code) === 1) {
        console.log(JSON.parse(res.data.configValueMap.site_base_setting))
        // console.log(JSON.parse(res.data.configValueMap.customer_service_setting))
        this.formData = JSON.parse(res.data.configValueMap.site_base_setting)
        this.customer_service_setting = JSON.parse(res.data.configValueMap.customer_service_setting)
        this.mainLoading = false
      } else {
        this.mainLoading = false
        this.$message.error(res.message)
      }
    },
    // 图片上传成功回调
    editLogoHandleUploadSuccess (res) {
      this.upImg.editKey = true
      this.editUploading = false
      if (parseInt(res.code) === 1) {
        this.formData.backend_login_logo = res.data.url
      } else {
        this.formData.image = ''
        this.$message.error(res.message)
      }
    },
    shopIogoHandleUploadSuccess (res) {
      this.upImg.shopKey = true
      this.shopUploading = false
      if (parseInt(res.code) === 1) {
        this.formData.shop_logo = res.data.url
      } else {
        this.formData.image = ''
        this.$message.error(res.message)
      }
    },
    SellerLogoHandleUploadSuccess (res) {
      this.upImg.sellerKey = true
      this.sellerUploading = false
      if (parseInt(res.code) === 1) {
        this.formData.seller_login_logo = res.data.url
      } else {
        this.formData.image = ''
        this.$message.error(res.message)
      }
    },
    shopLogohandleUploadError (res) {
      this.$message.error('上传失败！')
      this.shopUploading = false
    },
    sellerHandleUploadError (res) {
      this.$message.error('上传失败！')
      this.sellerUploading = false
    },
    editHandleUploadError (res) {
      this.$message.error('上传失败！')
      this.editUploading = false
    },
    // 图片上传失败回调
    // -- 上传图片
    sellerBeforePicUpload (file) {
      const isLt2M = file.size / 1024 / 1024 < 5
      if (!isLt2M) {
        this.$message.error('上传的图片大小不能超过 5MB!')
        return false
      }
      let fileType = file.type === 'image/gif' || file.type === 'image/jpeg' || file.type === 'image/bmp' || file.type === 'image/png' || file.type === 'image/jpg'
      if (!fileType) {
        this.$message.error('上传的图片仅支持 gif、 jpeg、 png、 bmp、 jpg 5种格式！')
        return false
      }
      this.sellerUploading = true
      return true
    },
    editBeforePicUpload (file) {
      const isLt2M = file.size / 1024 / 1024 < 5
      if (!isLt2M) {
        this.$message.error('上传的图片大小不能超过 5MB!')
        return false
      }
      let fileType = file.type === 'image/gif' || file.type === 'image/jpeg' || file.type === 'image/bmp' || file.type === 'image/png' || file.type === 'image/jpg'
      if (!fileType) {
        this.$message.error('上传的图片仅支持 gif、 jpeg、 png、 bmp、 jpg 5种格式！')
        return false
      }
      this.editUploading = true
      return true
    },
    shopBeforePicUpload (file) {
      const isLt2M = file.size / 1024 < 30
      if (!isLt2M) {
        this.$message.error('上传的图片大小不能超过 30KB!')
        return false
      }
      let fileType = file.type === 'image/gif' || file.type === 'image/jpeg' || file.type === 'image/bmp' || file.type === 'image/png' || file.type === 'image/jpg'
      if (!fileType) {
        this.$message.error('上传的图片仅支持 gif、 jpeg、 png、 bmp、 jpg 5种格式！')
        return false
      }
      this.shopUploading = true
      return true
    },
    // 保存
    async toSave () {
      // if (this.upImg.sellerKey && this.upImg.shopKey && this.upImg.editKey) {
      let reqData = {
        plugin_id: 'siteSettingPlugin',
        'site_base_setting.shop_logo': this.formData.shop_logo,
        'site_base_setting.backend_login_logo': this.formData.backend_login_logo,
        'site_base_setting.seller_login_logo': this.formData.seller_login_logo,
        'site_base_setting.shop_name': this.formData.shop_name,
        'customer_service_setting.customer_service_working_time': this.customer_service_setting.customer_service_working_time,
        'customer_service_setting.is_phone_service_open': this.customer_service_setting.is_phone_service_open,
        'customer_service_setting.customer_service_phone_number': this.customer_service_setting.customer_service_phone_number,
        'customer_service_setting.is_online_service_open': this.customer_service_setting.is_online_service_open,
        'customer_service_setting.online_service_working_time': this.customer_service_setting.online_service_working_time,
        'customer_service_setting.online_service_phone_number': this.customer_service_setting.online_service_phone_number
      }
      let res = await this.$post('setting/save.do', reqData)
      if (parseInt(res.code) === 1) {
        this.$message.success('保存成功')
      } else {
        this.$message.error(res.message)
      }
      // } else {
      //   if (!this.upImg.sellerKey) {
      //     this.$message.error('请上传买家登录页面图片')
      //   }
      //   if (!this.upImg.shopKey) {
      //     this.$message.error('请上传商域logo')
      //   }
      //   if (!this.upImg.editKey) {
      //     this.$message.error('请上传登录页logo')
      //   }
      // }
    }
  },
  created () {
    this.getDetail()
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import '~@/styles/common.scss';

  .detailWrap {
    .formBox {
      margin: 30px 0;
      .inputItem {
        width: 500px;
      }
      .timeBox {
        p {
          margin: 0;
          font-size: $font-size-base;
          color: $text-second;
          line-height: 40px;
          &:first-of-type {
            margin-top: 10px;
            border-top: 1px solid $border-base;
          }
          span {
            display: inline-block;
            margin-right: 10px;
            width: 100px;
            text-align: right;
          }
        }
      }
    }
  }
  .btn{
    margin-left: 150px;
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
      .smallImg{
        max-width: 50px;
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
<style lang="scss" rel="stylesheet/scss" >
.basicWrap{
  .uploadWrap{
    .el-upload {
      width: 350px;
      /*height: 100%;*/
      vertical-align: top;
    }
    .el-upload-dragger {
      width: 350px;
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
