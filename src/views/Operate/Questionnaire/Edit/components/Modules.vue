<!-- 模块编辑弹窗 -->
<template>
  <el-dialog title="模块编辑" :visible="value" class="v-dialog" @close="close" top="2.5%">
    <div class="contentBox">
      <el-form :model="form" :rules="rules" ref="moduleForm" label-position="left" label-width="100px">
        <el-form-item prop="moduleType" label="模块选择">
          <el-select v-model="form.moduleType" placeholder="请选择" @change="initializeModuleData">
            <el-option v-for="item in moduleTypes" :key="item.value" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="moduleType" label="模块选择" v-if="form.moduleType === 1">
          <Tinymce id="tinymce" :height="200" v-model="form.content"/>
        </el-form-item>

        <el-form-item prop="title" label="问题标题" v-if="form.moduleType !== 1 && form.moduleType !== 9">
          <el-input type="text" v-model="form.title" maxlength="200" class="w400"></el-input>
        </el-form-item>

        <el-form-item prop="subTitle" label="副标题" v-if="form.moduleType !== 1 && form.moduleType !== 9">
          <el-input type="text" v-model="form.subTitle" maxlength="200" class="w400"></el-input>
        </el-form-item>

        <el-form-item prop="answerBoxHeight" label="答题框高度" v-if="form.moduleType === 3">
          <el-radio v-model="form.answerBoxHeight" :label="0">单行</el-radio>
          <el-radio v-model="form.answerBoxHeight" :label="1">多行</el-radio>
        </el-form-item>

        <el-form-item prop="answerNum" label="单选/多选" v-if="form.moduleType === 7 || form.moduleType === 8">
          <el-radio v-model="form.answerNum" :label="0">单选</el-radio>
          <el-radio v-model="form.answerNum" :label="1">多选</el-radio>
        </el-form-item>

        <el-form-item prop="isMandatory" label="是否必填" v-if="form.moduleType !== 1 && form.moduleType !== 9">
          <el-radio v-model="form.isMandatory" :label="1">是</el-radio>
          <el-radio v-model="form.isMandatory" :label="0">否</el-radio>
        </el-form-item>

        <!--图片投票选项-->
        <el-form-item label="选项" v-if="form.moduleType === 7">
          <div class="detailTable">
            <div class="pic-text-item" v-for="(item, index) in form.content" :key="index">
              <el-upload action="backend/mobileUpload/uploadImg.do"
                         class="uploadModule"
                         :data="{from: 'admin'}"
                         name="file"
                         :show-file-list="false"
                         :on-success="uploadSuccess"
                         :before-upload="beforeImgUpload.bind(arguments[0], item)">
                <img :src="item.image" v-if="item.image">
                <i class="el-icon-plus uploadIcon" v-else></i>
              </el-upload>
              <div style="display: flex; justify-content: space-between;align-items: center;">
                <div>
                  标题:
                  <el-input type="text" v-model="item.title" maxlength="200" class="w400"></el-input>
                </div>
                <i class="el-icon-delete" @click="deleteRowItem(index)"></i>
              </div>

            </div>
            <el-button class="pic-text-add-btn" type="success" icon="el-icon-plus" plain @click="addPicRowItem">
              增加选项
            </el-button>
          </div>
        </el-form-item>

        <!--文本投票选项-->
        <el-form-item label="选项" v-if="form.moduleType === 8">
          <div class="detailTable">
            <el-row class="btn-Wrap">
              <el-button icon="el-icon-plus" type="primary" plain @click="addTextRowItem">添加</el-button>
            </el-row>
            <!--表格正文-->
            <div class="text-table-wrap text-table-header">
              <div class="text-table-100">序号</div>
              <div class="text-table-cell">选项内容</div>
              <div class="text-table-100">操作</div>
            </div>

            <div class="text-table-wrap" v-for="(item, index) in form.content" :key="index">
              <div class="text-table-100">{{index + 1}}</div>
              <div class="text-table-cell">
                <el-input type="text" v-model="item.content" maxlength="200"></el-input>
              </div>
              <div class="text-table-100">
                <span class="v-blue v-text-cursor" v-if="index > 1"
                      @click="deleteRowItem(scope.$index)">删除
                </span>
              </div>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="v-dialog-footer">
      <el-button type="primary" @click="toSave">保存</el-button>
      <el-button @click="close">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Tinymce from '@/components/Tinymce'

export default {
  components: {Tinymce},
  name: 'modules-edit-dialog',
  props: {
    id: { // 数据
      type: Number,
      default: 0
    },
    value: false // 显示与否
  },
  data () {
    return {
      currentQuestionItem: {}, // 当前问题
      mainLoading: false, // 加载页面
      form: {
        skip: 0, // 是否跳转,现在全部不跳转,直接传0
        moduleType: 7, // 模块类型
        content: [], // 内容
        title: '', // 标题
        subTitle: '', // 子标题
        isMandatory: 0, // 是否必填
        answerBoxHeight: 0, // 答题框高度
        answerNum: 0 // 是否单选
      },
      rules: {},
      moduleTypes: [
        {value: 1, label: '富文本模块'},
        {value: 2, label: '日期模块'},
        {value: 3, label: '文本模块'},
        {value: 4, label: '手机号模块'},
        {value: 5, label: '邮箱模块'},
        {value: 6, label: '地址模块'},
        {value: 7, label: '图片投票模块'},
        {value: 8, label: '文本投票模块'},
        {value: 9, label: '分页模块'}
      ]

    }
  },
  created () {
    this.getDetail()
  },
  methods: {
    // 关闭弹窗
    close () {
      this.$emit('input', false)
    },
    //  验证表单
    validForm () {
      // 富文本内容非空验证
      // if (this.moduleType === 1 && !this.form.content) {
      //   this.$message.error('请输入内容')
      //   return false
      // }
      // 问题标题非空验证
      let type = this.form.moduleType
      if (type !== 1 && type !== 9 && !this.form.title) {
        this.$message.error('请输入问题标题')
        return false
      }

      // 图片投票模块验证
      if (type === 7) {
        let valid = true
        let idxArr = []
        this.form.content.forEach((item, index) => {
          if (!item.image) {
            valid = false
            idxArr.push(index + 1)
          }
        })
        if (!valid) this.$message.error(`第${idxArr.join('、')}个选项的图片为空,请上传图片后再提交`)
        return valid
      }
      // 文本投票模块验证
      if (type === 8) {
        let valid = true
        let idxArr = []
        this.form.content.forEach((item, index) => {
          if (!item.content) {
            valid = false
            idxArr.push(index + 1)
          }
        })
        if (!valid) this.$message.error(`第${idxArr.join('、')}个选项的内容为空,请填写后再提交`)
        return valid
      }
      return true
    },
    // 保存数据
    async toSave () {
      if (!this.validForm()) return
      let url = 'questionnaireSurveyItem/addOrEdit.do'
      let body = JSON.parse(JSON.stringify(this.form))
      body.skip = 0
      body = {strArray: JSON.stringify(body)}
      let res = await this.$post(url, body)
      if (+res.code === 1) {
        if (this.form.id) {
          this.$message.success('修改成功')
          this.form.isEdit = true
        } else {
          this.$message.success('添加成功')
          this.form.isEdit = false
          this.form.id = res.data.id
        }
        this.$emit('success', this.form)
      } else {
        this.$message.error(res.message)
      }
      // console.log('saved', res)
    },
    // 模块切换
    initializeModuleData (moduleType) {
      // 富文本模块
      if (moduleType === 1) {
        this.form.content = ''
      }
      // 图片投票模块
      if (moduleType === 7) {
        this.form.content = [{title: '', image: ''}, {title: '', image: ''}]
      }
      // 文本投票模块
      if (moduleType === 8) {
        this.$nextTick(() => {
          this.form.content = [{content: ''}, {content: ''}]
        })
      }
    },
    // 删除选项(图文投票模块)
    deleteRowItem (index) {
      if (this.form.content.length < 3) {
        this.$message.error('至少要有2个选项')
        return
      }
      this.form.content.splice(index, 1)
    },
    // 添加选项(文本投票模块)
    addTextRowItem () {
      let isNotNull = true
      this.form.content.map(i => {
        if (i.content !== 0 && !i.content) {
          isNotNull = false
        }
      })
      if (isNotNull) {
        this.form.content.push({content: ''})
      } else {
        this.$message.error('列表里有空记录')
      }
    },
    // 添加选项(图文投票模块)
    addPicRowItem () {
      let isNotNull = true
      this.form.content.map(i => {
        // if ((i.title !== 0 && !i.title) || !i.image) {
        if (!i.image) {
          isNotNull = false
        }
      })
      if (isNotNull) {
        this.form.content.push({title: '', image: ''})
      } else {
        this.$message.error('列表里有空记录')
      }
    },
    // 图片上传成功的回调
    uploadSuccess (res) {
      this.currentQuestionItem.image = res.data.url
      // console.log('控制台打印:', res)
    },
    // 图片上传之前文件类型检查
    beforeImgUpload (item, file) {
      this.currentQuestionItem = item
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isGif = file.type === 'image/gif'
      if (!isJPG && !isPNG && !isGif) {
        this.$message.error('上传的图片只能是 jpg/png/gif 格式!')
        return false
      }
    },
    // 回显数据
    async getDetail () {
      if (!this.id) {
        this.initializeModuleData(this.form.moduleType)
        return
      }
      let url = 'questionnaireSurveyItem/detail.do'
      let body = {id: this.id}
      let res = await this.$post(url, body)
      if (+res.code === 1) {
        this.form = res.data
      }
      console.log('控制台打印:', res)
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import '~@/styles/common.scss';

  .w400 {
    width: 400px;
  }

  .contentBox {
    .el-form-item{
      margin: 10px 0;
    }
  }

  .uploadIcon {
    font-size: 50px;
    /*color: #409eff;*/
    color: #ccc;
  }

  .detailTable {
    margin-top: 10px;
  }

  .btn-Wrap {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    border: 1px solid $border-base;
    border-bottom: none;
    .el-button {
      border-radius: 0;
      margin: -1px 0 -1px -1px;
    }
  }

  .pic-text-item {
    width: 520px;
    padding: 10px;
    border-radius: 3px;
    background: #f5f5f5;
    border: 1px solid #e5e5e5;
    margin-bottom: 10px;
    overflow: hidden;
  }

  .pic-text-add-btn {
    width: 520px;
  }

  .text-table-wrap{
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    border: 1px solid $border-base;
    border-bottom: none
  }
  .text-table-wrap:last-child{
    border-bottom: 1px solid $border-base;
  }
  .text-table-100{
    width: 100px;
    height: 100%;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .text-table-cell{
    width: 100%;
    height: 100%;
    flex-shrink: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .text-table-header{
    background-color: #ebf2fc;
    font-weight: bold;
  }
  .uploadModule {
    width: 500px;
    min-height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
    border-radius: 5px;
    background: #fff;
    border: 1px dashed #e5e5e5;
  }
</style>
