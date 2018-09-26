<!-- 凑团设置 -->
<template>
  <el-dialog title="凑团设置" v-if="value" :visible="value" class="v-dialog" width="600px" top="20vh" @close="beforeClose"  :close-on-click-modal="false">
    <el-form :model="formData" :rules="formRules" ref="formRef" label-position="left" label-width="190px" class="searchForm" v-loading="mainLoading" @submit.native.prevent>
      <el-form-item label="虚拟人数" prop="gatherMemberNum">
        <el-input size="small" v-model="formData.gatherMemberNum"  :maxlength="10" @input="numberSet(formData.gatherMemberNum, formData, 'gatherMemberNum', false)"> </el-input>
        <el-tooltip class="item" effect="dark" content="每个凑团的初始人数" placement="right">
          <i class="el-icon-question toolTip" ></i>
        </el-tooltip>
      </el-form-item>
      <el-form-item :label="`凑团数量${hadGatherGroupNum ? `(已发布${hadGatherGroupNum}个)` : ''}`" prop="gatherGroupNum">
        <el-input size="small" v-model="formData.gatherGroupNum"  :maxlength="10" @input="numberSet(formData.gatherGroupNum, formData, 'gatherGroupNum', false)"> </el-input>
        <el-tooltip class="item" effect="dark" content="所要发起凑团的总数" placement="right">
          <i class="el-icon-question toolTip" ></i>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="凑团显示数量" prop="showGatherNum">
        始终
        <el-input size="small" v-model="formData.showGatherNum"  :maxlength="10" @input="numberSet(formData.showGatherNum, formData, 'showGatherNum', false)" style="width: 80px"> </el-input>
        个
        <el-tooltip class="item" effect="dark" content="只要还有凑团数量，前端始终显示凑团的个数" placement="right">
          <i class="el-icon-question toolTip" ></i>
        </el-tooltip>
      </el-form-item>
    </el-form>
    <div slot="footer" class="v-dialog-footer">
      <el-button type="primary" @click="toOpen">开启凑团</el-button>
      <el-button @click="toClose">关闭凑团</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'setting-to-group-dialog',
  props: {
    groupId: { // 拼团的id // 没有就是新增
      type: Number,
      default: null
    },
    maxNum: { // 总成团人数
      type: Number,
      default: null
    },
    value: { // 显示与否
      type: Boolean,
      default: false
    }
  },
  data () {
    let validateNum = (rule, value, callback) => {
      if (value <= 0) {
        callback(new Error('请输入大于0的自然数'))
        return false
      }
      callback()
    }
    let validateGatherMemberNum = (rule, value, callback) => {
      if (value <= 0) {
        callback(new Error('请输入大于0的自然数'))
        return false
      }
      if (this.groupMemberNum && this.groupMemberNum <= Number(value)) {
        callback(new Error(`凑团虚拟人数需小于成团人数（${this.groupMemberNum}人）`))
        return false
      }
      callback()
    }
    return {
      mainLoading: false, // 加载页面
      formData: { // 请求参数
        gatherMemberNum: '', // 凑团人数
        gatherGroupNum: '', // 发起的凑团数
        showGatherNum: '' // 前端显示的凑团数
      },
      groupMemberNum: 0,
      hadGatherGroupNum: 0,
      formRules: {
        gatherMemberNum: [{required: true, message: '请输入成团人数', trigger: 'blur'}, {validator: validateNum, trigger: 'blur'}, {validator: validateGatherMemberNum, trigger: 'blur'}],
        gatherGroupNum: [{required: true, message: '请输入凑团数量', trigger: 'blur'}, {validator: validateNum, trigger: 'blur'}],
        showGatherNum: [{required: true, message: '请输入凑团显示数量', trigger: 'blur'}, {validator: validateNum, trigger: 'blur'}]
      }
    }
  },
  created () {
  },
  methods: {
    // 获得拼团详情
    async getDetail () {
      this.mainLoading = true
      let res = await this.$post('group/detail.do', {groupId: this.groupId})
      this.mainLoading = false
      if (parseInt(res.code) === 1) {
        this.formData.gatherMemberNum = res.data.gatherMemberNum || ''
        this.formData.gatherGroupNum = res.data.gatherGroupNum || ''
        this.formData.showGatherNum = res.data.showGatherNum || ''
        this.groupMemberNum = res.data.groupMemberNum || ''
        this.hadGatherGroupNum = res.data.hadGatherGroupNum || ''
      }
    },
    // 关闭弹窗
    beforeClose () {
      this.$emit('input', false)
      // this.toClear()
    },
    // 开启凑团
    toOpen () {
      this.$refs.formRef.validate(async valid => {
        if (!valid) {
          // this.$message.error('请输入正确的数据！')
          return false
        }
        this.toSave(1)
      })
    },
    // 关闭凑团
    toClose () {
      this.toSave(0)
    },
    // 保存数据
    async toSave (isGatherFalsegroup) {
      let reqData = {
        groupId: this.groupId,
        isGatherFalsegroup
      }
      reqData = Object.assign({}, reqData, this.formData)
      let res = await this.$post('group/isOpenAccessGroup.do', reqData)
      if (parseInt(res.code) === 1) {
        let text = isGatherFalsegroup ? '成功开启凑团' : '成功关闭凑团'
        this.$message.success(text)
        this.$emit('confirm', isGatherFalsegroup)
        this.$emit('input', false)
        // this.toClear()
      } else {
        this.$message.error(res.message)
      }
    },
    // 清楚数据
    toClear () {
      this.formData = { // 请求参数
        gatherMemberNum: '', // 凑团人数
        gatherGroupNum: '', // 发起的凑团数
        showGatherNum: '' // 前端显示的凑团数
      }
    },
    // 限制输入数字、金额
    numberSet (value, item, itemName, isMoney) {
      this.$numInput(value, item, itemName, isMoney, this)
    }
  },
  watch: {
    value (newValue, oldValue) {
      if (newValue) {
        this.toClear()
        this.getDetail()
      }
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import '~@/styles/common.scss';

  .searchForm {
    .el-input{
      width: 250px;
    }
    .el-form-item{
      line-height: 32px;
      height: 32px;
    }
  }
  .toolTip{
    font-size: 20px;
    margin-left: 10px;
    vertical-align: middle;
  }
</style>
