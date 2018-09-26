<!-- 推广弹窗 -->
<template>
  <el-dialog :title="data.id ? '热搜编辑' : '热搜新增'" v-if="value" :visible="value" class="v-dialog " width="650px" top="10vh"
             @close="beforeClose">
    <div class="contentBox">
      <el-form :model="data" :rules="rules" ref="formDataRef" label-width="100px" size="small" class="v-form"
               @submit.native.prevent>
        <el-form-item label="关键词" prop="name">
          <el-input type="text" v-model="data.name" :maxlength="14" size="small" class="w400"></el-input>
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input type="number" v-model="data.sort" :maxlength="10" size="small" class="w400"></el-input>
        </el-form-item>

        <el-form-item label="高亮" prop="highlight">
          <el-radio v-model="data.is_highlight" :label="0">否</el-radio>
          <el-radio v-model="data.is_highlight" :label="1">是</el-radio>
        </el-form-item>

        <el-form-item label="查看结果" prop="isVewResult">
          <el-radio v-model="data.is_open" :label="1">开启</el-radio>
          <el-radio v-model="data.is_open" :label="0">关闭</el-radio>
        </el-form-item>

        <el-form-item label="跳转">
          <div>
            <el-radio v-model="data.type" :label="0">搜索列表</el-radio>
          </div>
          <div class="dsf">
            <el-radio v-model="data.type" :label="1">页面</el-radio>
            <div class="pageId">
              <div class="pageIdTitle">页面ID:</div>

              <el-select v-model="data.page_id" placeholder="请选择" size="small">
                <el-option key="0" label="商城(含全部店铺)" :value="0"></el-option>
                <el-option v-for="item in pages" :key="item.page_id" :label="item.name" :value="item.page_id"></el-option>
              </el-select>

            </div>
          </div>
        </el-form-item>

      </el-form>
    </div>
    <div slot="footer" class="v-dialog-footer">
      <el-button @click="toSave">保存</el-button>
      <el-button @click="beforeClose">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'hot-search-dialog',
  props: {
    data: { // 数据
      type: Object,
      default: () => {
        return {
          name: '',
          sort: 100,
          is_highlight: 0,
          is_open: 1,
          type: 0,
          page_id: ''
        }
      }
    },
    pages: {
      type: Array,
      default: () => []
    },
    value: false // 显示与否
  },
  data () {
    return {
      rules: {},
      mainLoading: false // 加载页面
    }
  },
  created () {
  },
  methods: {
    // 关闭弹窗
    beforeClose () {
      this.$emit('close')
    },
    // 保存新增
    async toSave () {
      if (!this.data.name) {
        this.$message.error('请输入关键词')
        return
      }
      if (this.data.type === 1 && !this.data.page_id) {
        this.$message.error('请输入页面ID')
        return
      }
      let url = this.data.id ? 'keyowrds/edit.do' : 'keyowrds/save.do'
      let res = await this.$post(url, this.data)
      if (+res.code === 1) {
        let msg = this.data.id ? '修改成功!' : '添加成功!'
        this.$message.success(msg)
        this.$emit('close')
      } else {
        this.$message.error('失败:' + res.message)
      }
      console.log('控制台打印:', res)
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import '~@/styles/common.scss';

  .pageId {
    width: 200px;
    margin-left: 50px;
    display: flex;
  }

  .pageIdTitle {
    width: 60px;
    line-height: 30px;
  }

  .dsf {
    display: flex;
    align-items: center;
  }
</style>
