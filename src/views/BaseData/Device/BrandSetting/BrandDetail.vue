<template>
  <div class="v-wrap detailWrap">
    <div>
      <h3 class="v-title">品牌设置</h3>
    </div>
    <el-form class="formBox" ref="ruleForm" :rules="formRules" :model="formData" label-width="110px"
             v-loading="mainLoading">
      <el-form-item label="品牌名称" class="inputItem" prop="name">
        <el-input v-model="formData.name" placeholder="请输入品牌名称" :maxlength="20"> </el-input>
      </el-form-item>
      <el-form-item label="所属国家" class="inputItem" prop="country">
        <el-input v-model="formData.country" placeholder="请输入品牌所属国家" :maxlength="20"> </el-input>
      </el-form-item>
      <el-form-item label="备注" class="inputItem">
        <el-input type="textarea" resize="none" :rows="10" v-model="formData.remark" placeholder="请填写备注" :maxlength="144"> </el-input>
      </el-form-item>
      <el-form-item class="timeBox" v-if="formData.createTime || formData.modifyTime">
        <p v-if="formData.createTime"><span>创建时间：</span> {{formData.createTime ? $moment(formData.createTime).format('YYYY-MM-DD hh:mm') : ''}}</p>
        <p v-if="formData.modifyTime"><span>最后修改时间：</span> {{formData.modifyTime? $moment(formData.modifyTime).format('YYYY-MM-DD hh:mm') : ''}}</p>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="v-button" :loading="saveLoading" @click="onSubmit">保 存</el-button>
        <el-button plain class="v-button" @click="$router.go(-1)">取 消</el-button>
      </el-form-item>
    </el-form>
  </div>

</template>

<script>
export default {
  name: 'setting-detail',
  data () {
    return {
      formData: {
        name: '',
        country: '',
        remark: ''
      },
      formRules: {
        name: [
          {
            required: true, message: '请输入品牌名称', trigger: 'blur'
          }
        ],
        country: [
          {
            required: true, message: '请输入品牌所属国家', trigger: 'blur'
          }
        ]
      },
      mainLoading: false,
      brandId: Number(this.$route.query.brandId),
      saveLoading: false

    }
  },
  created () {
    console.log(this.$router.history)
    console.log(window.history)
    if (this.brandId > -1) {
      this.getDetail()
    }
  },
  methods: {
    async getDetail () {
      this.mainLoading = true
      let res = await this.$post('deviceBrand/getDeviceDetails.do', {id: this.brandId})
      this.mainLoading = false
      if (parseInt(res.code) === 1) {
        this.formData = res.data
      } else {
        this.$message.error(res.message)
      }
    },
    // 提交保存数据
    onSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.saveOrEditData()
        } else {
          return false
        }
      })
    },
    // 保存数据
    async saveOrEditData () {
      let reqData = Object.assign({}, this.formData)
      delete reqData.isDeleted
      delete reqData.version
      delete reqData.createTime
      delete reqData.modifyTime
      delete reqData.modelNums
      let url = 'deviceBrand/saveDeviceBrand.do'
      if (this.brandId > -1) {
        reqData.id = this.brandId
        url = 'deviceBrand/editDeviceBrand.do'
      }
      this.saveLoading = true
      let res = await this.$post(url, reqData, true)
      this.saveLoading = false
      if (parseInt(res.code) === 1) {
        this.$message.success('保存成功')
        setTimeout(() => {
          this.$router.go(-1)
          // this.$router.push('/baseData/device/brandList')
        }, 1500)
      } else {
        this.$message.error(res.message)
      }
    }

  }
}
</script>
<style lang="scss" scoped rel="stylesheet/scss">
  @import '~@/styles/common.scss';

  .detailWrap {
    .formBox {
      margin: 30px 0;
      .inputItem {
        width: 700px;
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

</style>
