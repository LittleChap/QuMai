<template>
  <div class="v-wrap detailWrap">
    <div>
      <h3 class="v-title">品牌设置</h3>
    </div>
    <el-form label-position='top' class="formBox" ref="ruleForm" :rules="formRules" :model="formData" label-width="110px"
      size="small" v-loading="mainLoading">
      <el-form-item label="品牌名称" class="inputItem" prop="name">
        <el-input v-model="formData.name" placeholder="请输入品牌名称:" :maxlength="20"> </el-input>
      </el-form-item>
      <el-form-item label="英文名" class="inputItem" prop="name_en">
        <el-input v-model="formData.name_en" placeholder="请输入英文名:" :maxlength="20"> </el-input>
      </el-form-item>
      <el-form-item label="排序" class="inputItem" prop="sort">
        <el-input v-model="formData.sort" placeholder="请输入排序:" :maxlength="20"> </el-input>
      </el-form-item>
      <el-form-item label="是否启用:" class="inputItem" prop="is_open">
        <!-- <el-input v-model="formData.country" placeholder="请输入英文名" :maxlength="20"> </el-input> -->
        <el-radio v-model="formData.is_open" :label="1">是</el-radio>
        <el-radio v-model="formData.is_open" :label="0">否</el-radio>
      </el-form-item>
      <el-form-item label="品牌描述:" class="inputItem">
        <el-input type="textarea" resize="none" :rows="10" v-model="formData.brief" placeholder="请填写描述" :maxlength="200"> </el-input>
      </el-form-item>
      <el-form-item size="medium">
        <el-button type="primary" :loading="saveLoading" @click="onSubmit">保 存</el-button>
        <el-button plain @click="$router.go(-1)">取 消</el-button>
      </el-form-item>
    </el-form>
  </div>

</template>

<script>
export default {
  name: 'grand-set',
  data () {
    var checkEnName = (rule, value, cb) => {
      var regEnName = /^[0-9a-zA-Z]+$/
      if (value) {
        if (regEnName.test(value)) {
          cb()
        } else {
          return cb(new Error('请输入英文格式'))
        }
      } else {
        cb()
      }
    }
    let validaSort = (rule, value, callback) => {
      let num = Number(value)
      if (isNaN(num)) {
        callback(new Error('请输入正确数值'))
      } else {
        callback()
      }
    }
    return {
      formData: {
        name: '',
        name_en: '',
        sort: '',
        brief: '',
        is_open: 1
      },
      formRules: {
        name: [
          {
            required: true, message: '请输入品牌名称', trigger: 'blur'
          }
        ],
        name_en: [
          {
            validator: checkEnName
          }
        ],
        is_open: [{required: true, message: '请勾选是否启用'}],
        sort: [{validator: validaSort}]
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
      let res = await this.$post('brand/goEdit.do', {brand_id: this.brandId})
      this.mainLoading = false
      if (parseInt(res.code) === 1) {
        this.formData = res.data.brand
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
      let reqData = {
        name: this.formData.name,
        name_en: this.formData.name_en,
        sort: this.formData.sort,
        brief: this.formData.brief,
        is_open: this.formData.isOpenVal
      }
      let url = 'brand/save.do'
      if (this.brandId > -1) {
        reqData.brand_id = this.brandId
        url = 'brand/edit.do'
      }
      this.saveLoading = true
      let res = await this.$post(url, reqData)
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
        width: 400px;
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
