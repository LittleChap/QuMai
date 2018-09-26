<!-- 链接输入弹窗 -->
<template>
  <!--  链接输入弹窗 -->
  <el-dialog title="请输入链接地址" :visible="value" class="v-dialog" width="500px" top="30vh" :close-on-click-modal="false" @close="beforeClose">
    <el-form :model="formData" :rules="formRules" ref="formRef"  label-width="80px" class="v-form" @submit.native.prevent>
      <el-form-item label="链接地址" prop="url">
        <el-input v-model="formData.url" placeholder="http/https" :maxlength="200" style="width: 360px"> </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="v-dialog-footer">
      <el-button type="primary" @click="toSave">确 定</el-button>
      <el-button @click="beforeClose">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'page-choose-dialog',
  props: {
    url: { // 输入的url
      type: String,
      default: ''
    },
    value: false // 显示与否
  },
  data () {
    let validateUrl = (rule, value, callback) => {
      // let reg = /^http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?$/
      let reg = /^http(s)?.*?$/
      if (!reg.test(value)) {
        callback(new Error('请输入http和https开头的链接地址'))
        return false
      }
      callback()
    }
    return {
      formData: { // 请求参数
        url: ''
      },
      formRules: {
        url: [
          {required: true, message: '请输入链接地址', trigger: 'blur'},
          {validator: validateUrl, trigger: 'blur'}
        ]
      }
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
      this.$refs.formRef.validate(valid => {
        if (!valid) {
          return
        }
        this.$emit('success', this.formData.url)
        this.$emit('input', false)
        this.toClear()
      })
    },
    // 清楚数据
    toClear () {
      this.formData = {}
    }
  },
  watch: {
    value (newValue, oldValue) {
      if (newValue && this.url && this.url !== '') { // 显示的时候
        this.formData.url = this.url + ''
      }
    }
  }
}
</script>

<style scoped>

</style>
