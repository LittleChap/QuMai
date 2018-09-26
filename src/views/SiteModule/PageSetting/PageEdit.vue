<!-- 页面 编辑 -->
<template>
  <div class="pageEditWrap">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/siteModule/pageSetting/pageList' }">站点</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/siteModule/pageSetting/pageList' }">页面列表</el-breadcrumb-item>
      <el-breadcrumb-item>{{pageId && pageId!== -1 ? '编辑页面' : '添加页面'}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="v-wrap listWrap"  v-loading="mainLoading">
      <div>
        <h3 class="v-title">{{pageId && pageId!== -1 ? '编辑页面' : '添加页面'}}</h3>
      </div>
      <el-form :model="formData" :rules="formRules" ref="formDataRef" label-width="130px" class="v-form detailForm" @submit.native.prevent>
        <el-form-item label="页面ID" v-if="pageId && pageId!== -1">
          <span>{{pageId}}</span>
        </el-form-item>
        <el-form-item label="页面名称" prop="name">
          <el-input v-model="formData.name" :maxlength="50"> </el-input>
        </el-form-item>
        <el-form-item label="页面背景色" prop="color">
          <el-color-picker v-model="formData.color"> </el-color-picker>
        </el-form-item>
        <el-form-item label="页面自定义分享" prop="isShare">
          <el-radio v-model="formData.isShare" :label="1">开启</el-radio>
          <el-radio v-model="formData.isShare" :label="0">关闭</el-radio>
          <el-tooltip style="margin-left: 30px; vertical-align: middle" class="item" effect="dark" content="关闭时分享页面采用系统默认的分享规范" placement="right">
            <i class="el-icon-question" style="font-size: 20px"></i>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="微信分享图片" v-if="formData.isShare === 1" prop="shareImage">
          <el-upload class="uploadWrap" drag :data="uploadReqData" :disabled="uploading" :show-file-list="false"
                     :before-upload="beforePicUpload"
                     :on-success="handleUploadSuccess"
                     :on-error="handleUploadError"
                     accept=".gif,.jpeg,.jpg,.png,.bmp"
                     action="/backend/mobileUpload/uploadImg.do">
            <div class="uploadContent" v-loading="uploading" element-loading-text="文件上传中...">
              <div class="imgBox" v-if="formData.shareImage">
                <img v-if="formData.shareImage" :src="formData.shareImage" class="avatar">
                <div class="mask">
                  <div style="line-height: 20px">
                    <i class="el-icon-upload"></i>
                    <p class="el-upload-text">将文件拖到此处<br>或<em>点击上传</em></p>
                  </div>
                </div>
              </div>
              <i class="el-icon-upload" v-if="!formData.shareImage"></i>
              <div class="el-upload__text" style="line-height: 20px" v-if="!formData.shareImage">将文件拖到此处<br>或<em>点击上传</em></div>
              <!--<div class="el-upload__tip" slot="tip">微信分享图片，建议上传尺寸50*50，1MB以内</div>-->
            </div>
            <div class="el-upload__tip" slot="tip" style="line-height: 20px">微信分享图片，建议上传尺寸50*50，仅支持 gif、 jpeg、 png、 bmp 4种格式，1MB以内</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="微信分享标题" v-if="formData.isShare === 1" prop="shareTitle">
          <el-input v-model="formData.shareTitle" :maxlength="20"> </el-input>
        </el-form-item>
        <el-form-item label="微信分享描述" v-if="formData.isShare === 1" prop="shareDesc">
          <el-input v-model="formData.shareDesc" :maxlength="50"> </el-input>
        </el-form-item>
        <el-form-item label="页面配置" prop="isOpenRedirect">
          <div>
            <el-radio v-model="formData.isOpenRedirect" :label="1" @change="pageRadio(false)">页面重定向</el-radio>
            <el-input style="width: 300px; margin-left: 24px" v-show="formData.isOpenRedirect === 1" v-model="formData.redirectUrl" @blur="pageRadio(true)" placeholder="http/https" :maxlength="200"> </el-input>
          </div>
          <el-radio v-model="formData.isOpenRedirect" :label="0" @change="pageRadio(false)">页面模块</el-radio>
          <div class="detailTable"  v-show="formData.isOpenRedirect === 0">
            <el-row class="btn-Wrap">
              <el-button icon="el-icon-plus" type="primary" plain @click="toOpenAddModule">添加</el-button>
              <el-button icon="el-icon-minus" type="warning" plain @click="toAllDelete">删除</el-button>
              <!--<el-button icon="el-icon-refresh">刷新</el-button>-->
            </el-row>
            <el-table :data="listData" style="width: 100%" @selection-change="handleSelectionChange">
              <el-table-column align="center" type="selection" width="55"> </el-table-column>
              <el-table-column align="center" prop="moduleType" label="模块类型" width="120px">
                <template slot-scope="scope">
                  <span v-if="scope.row.moduleType === 1">图片模块</span>
                  <span v-else-if="scope.row.moduleType === 2">商品模块</span>
                  <span v-else-if="scope.row.moduleType === 3">导航模块</span>
                  <!--<span v-else-if="scope.row.moduleType === 4">拼团模块</span>-->
                  <!--<span v-else-if="scope.row.moduleType === 5">秒杀模块</span>-->
                  <span v-else-if="scope.row.moduleType === 6">优惠券模块</span>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="title" label="名称"> </el-table-column>
              <!--<el-table-column align="center" prop="date" label="跳转类型"> </el-table-column>-->
              <!--<el-table-column align="center" prop="date" label="跳转参数" :render-header="renderHeader"> </el-table-column>-->
              <el-table-column align="center" label="排序" width="350px">
                <template slot-scope="scope">
                  <span class="v-blue v-text-cursor" @click="toMove(scope.$index, -1)">上移</span> <i class="v-blue v-separator">|</i>
                  <span class="v-blue v-text-cursor" @click="toMove(scope.$index, 1)">下移</span> <i class="v-blue v-separator">|</i>
                  <span class="v-blue v-text-cursor" @click="toMoveTop(scope.$index, -1)">置顶</span> <i class="v-blue v-separator">|</i>
                  <span class="v-blue v-text-cursor" @click="toMoveTop(scope.$index, 1)">置底</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作" width="200px">
                <template slot-scope="scope">
                  <span class="v-blue v-text-cursor" @click="toPopEdit(scope.row)">编辑</span> <i class="v-blue v-separator">|</i>
                  <span class="v-red v-text-cursor" @click="toSingleDelete(scope.row)">删除</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form-item>
      </el-form>
      <el-row class="submitBtnWrap">
        <el-button  type="primary" @click="toPreview">预览</el-button>
        <el-button  type="primary" :loading="saveUpLoading"  @click="toSave(1)">保存并上线</el-button>
        <el-button  type="primary" :loading="saveDownLoading"  @click="toSave(0)">保存并下线</el-button>
        <el-button @click="$router.go(-1)">返回</el-button>
      </el-row>
    </div>

    <!-- 添加模块弹窗 -->
    <el-dialog title="添加模块" v-if="addModule.dialogVisible" :visible.sync="addModule.dialogVisible" class="v-dialog" width="550px" top="30vh">
      <el-form :model="addModule.formData" :rules="addModule.formRules" ref="addModuleFormRef" label-width="120px" class="v-form" @submit.native.prevent>
        <el-form-item label="模块选择" prop="moduleType">
          <el-select v-model="addModule.formData.moduleType" placeholder="请选择">
            <el-option label="图片模块" :value="1"> </el-option>
            <el-option label="商品模块" :value="2"> </el-option>
            <el-option label="导航模块" :value="3"> </el-option>
            <!--<el-option label="拼团模块" :value="4"> </el-option>-->
            <!--<el-option label="秒杀模块" :value="5"> </el-option>-->
            <el-option label="优惠券模块" :value="6"> </el-option>
            <!--图片模块、商品模块、导航模块、拼团模块、秒杀模块-->
          </el-select>
        </el-form-item>
        <el-form-item label="模块名称" prop="title">
          <el-input v-model="addModule.formData.title" :maxlength="50"> </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="v-dialog-footer">
        <el-button type="primary" @click="toSaveModule">确 定</el-button>
        <el-button @click="addModule.dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 预览 -->
    <PagePreview v-model="toShowPreview" url="pages/preview.do" :pageReqInfo="{pagesToken: pagesToken}" :pagesToken="pagesToken" :pageInfo="formData"/>

  </div>
</template>

<script>
import PagePreview from './PagePreview/Index'
export default {
  name: 'page-edit',
  components: {PagePreview},
  data () {
    let validatePage = (rule, value, callback) => {
      if (value === 1 && this.formData.redirectUrl === '') {
        callback(new Error('请输入重定向地址'))
        return false
      }
      let reg = /^http(s)?.*?$/
      if (value === 1 && !reg.test(this.formData.redirectUrl)) {
        callback(new Error('请输入http和https开头的链接地址'))
        return false
      }
      if (value === 0 && (!this.listData || !this.listData.length)) {
        callback(new Error('请添加页面模块'))
        return false
      }
      callback()
    }
    return {
      pageId: Number(this.$route.query.pageId || -1), // 页面id
      pagesToken: '', // 页面标识
      formData: { // 请求参数
        name: '',
        color: '#fff',
        isShare: 1,
        shareImage: '',
        shareTitle: '',
        shareDesc: '',
        isOpenRedirect: 1, // 页面配置
        redirectUrl: '' // 重定向地址
      }, // 表单请求数据
      formRules: {
        name: [{required: true, message: '请输入页面名称', trigger: 'blur'}],
        color: [{required: true, message: '请选择页面背景色', trigger: 'change'}],
        isShare: [{required: true, message: '请选择页面自定义分享', trigger: 'change'}],
        shareImage: [{required: true, message: '请上传微信分享图片', trigger: 'blur, change'}],
        shareTitle: [{required: true, message: '请输入微信分享标题', trigger: 'blur'}],
        shareDesc: [{required: true, message: '请输入微信分享描述', trigger: 'blur'}],
        isOpenRedirect: [{required: true, message: '请选择页面配置', trigger: 'blur'}, {validator: validatePage, trigger: 'change, blur'}]
      },
      mainLoading: false, // 列表的加载
      saveUpLoading: false, // 保存并上线
      saveDownLoading: false, // 保存并下线
      uploading: false,
      uploadReqData: {
        from: 'banner'
      },
      listData: [], // 模块数据
      multiSelect: [], // 多选列表
      // 添加模块
      addModule: {
        dialogVisible: false,
        formData: {
          moduleType: 1,
          title: ''
        },
        formRules: {
          moduleType: [{required: true, message: '请选择模块', trigger: 'change'}],
          title: [{required: true, message: '请输入模块名称', trigger: 'blur'}]
        }
      },
      // 是否显示预览
      toShowPreview: false
    }
  },
  created () {
    if (this.$store.getters.pageEditInfo && this.$store.getters.pageEditInfo.pagesToken) { // 从一个编辑页面保存回来
      this.getSaveDetail()
      return
    }
    this.$store.dispatch('SetPageEditInfo', {}) // 清除之前的数据
    if (this.pageId === -1 && !this.pagesToken) { // 新增 --> 生成一个随机的 id
      this.pagesToken = new Date().getTime() + '0' + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10)
    } else {
      this.getDetail()
    }
  },
  computed: {
    pageModule () {
      let pageModuleObi = this.$store.getters.pageModule
      if (pageModuleObi.listData && pageModuleObi.listData.length) {
        pageModuleObi.listData = pageModuleObi.listData.filter(item => {
          return !item.isDelete
        })
      }
      return this.$store.getters.pageModule
    }
  },
  methods: {
    // 获得详情
    async getDetail () {
      let req = {
        pageId: this.pageId !== -1 ? this.pageId : '',
        pagesToken: this.pagesToken
      }
      this.mainLoading = true
      let res = await this.$post('pages/getPageDetail.do', req)
      this.mainLoading = false
      if (parseInt(res.code) === 1) {
        this.formData = res.data.pages || {color: '#fff', isShare: 1}
        this.pagesToken = res.data.pages.pagesToken
        // this.formData.name = res.pages.name
        // this.formData.color = res.pages.color
        // this.formData.isShare = res.pages.isShare
        // this.formData.shareImage = res.pages.shareImage
        // this.formData.shareTitle = res.pages.shareTitle
        // this.formData.shareDesc = res.pages.shareDesc
        this.listData = res.data.pageModuleContent || []
      } else {
        this.$message.error(res.message)
      }
    },
    // 获得 保存本地的数据
    getSaveDetail () {
      this.pagesToken = this.$store.getters.pageEditInfo.pagesToken
      let falsePageModuleContentId = this.$store.getters.pageEditInfo.falsePageModuleContentId
      let saveData = sessionStorage.getItem(`pagesToken${this.pagesToken}`)
      if (saveData) {
        saveData = JSON.parse(saveData)
        this.formData = Object.assign({}, saveData.formData)
        saveData.listData.map(item => {
          if (String(item.falsePageModuleContentId) === String(falsePageModuleContentId)) {
            item.title = this.$store.getters.pageEditInfo.moduleTitle
          }
        })
        this.listData = JSON.parse(JSON.stringify(saveData.listData))
      }
      this.$store.dispatch('SetPageEditInfo', {})
      sessionStorage.removeItem(`pagesToken${this.pagesToken}`)
    },
    // 页面配置
    pageRadio (isSet) {
      if (isSet) {
        this.$refs.formDataRef.validateField('isOpenRedirect')
      } else {
        this.$refs.formDataRef.clearValidate('isOpenRedirect')
      }
    },

    // --- 模块内容 ---start
    // 添加模块
    toOpenAddModule () {
      this.addModule.formData = {
        moduleType: 1,
        title: ''
      }
      this.addModule.dialogVisible = true
    },
    // 保存模块
    toSaveModule () {
      this.$refs.addModuleFormRef.validate(async valid => {
        if (!valid) {
          return false
        }
        // 下面保存
        let req = {
          pageId: this.pageId !== -1 ? this.pageId : '',
          pagesToken: this.pagesToken,
          sort: this.listData.length + 1
        }
        req = Object.assign({}, req, this.addModule.formData)
        let res = await this.$post('pagemodulecontent/falseAddPageModuleContent.do', req)
        if (parseInt(res.code) === 1) {
          this.listData.push(res.data.pageModuleContent || {})
          // let newObj = Object.assign({}, this.pageModule)
          // newObj.listData.push({
          //   pageModuleContentId: res.pageModuleContentId,
          //   moduleType: res.moduleType,
          //   title: res.title
          // })
          // this.$store.dispatch('SetPageDetail', newObj)
          this.addModule.dialogVisible = false
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 单个删除
    toSingleDelete (data) {
      this.toDeleteData(data.falsePageModuleContentId)
    },
    // 批量删除
    toAllDelete () {
      if (!this.multiSelect || !this.multiSelect.length) {
        this.$message.error('请选择数据')
        return false
      }
      let dataIdArr = []
      this.multiSelect.map(item => {
        dataIdArr.push(item.falsePageModuleContentId)
      })
      this.$confirm(`确定删除这${dataIdArr.length}个控件？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '删除中...'
            await this.toDeleteData(dataIdArr.join(','))
            instance.confirmButtonLoading = false
            instance.confirmButtonText = '确定'

            done()
          } else {
            done()
          }
        }
      }).then(() => {
        return true
      }).catch(() => {
        return false
      })
    },
    // 请求删除数据
    async toDeleteData (dataIds) {
      let reqData = {
        pagesToken: this.pagesToken,
        falsePageModuleContentIds: dataIds
      }
      let res = await this.$post('pagemodulecontent/falseDeleteAll.do', reqData)
      if (parseInt(res.code) === 1) {
        this.$message.success('删除成功！')
        // 还原
        let moduleId = dataIds.split(',')
        moduleId.map(id => {
          this.listData.map(item => {
            if (String(item.falsePageModuleContentId) === String(id)) {
              item.isDelete = true
              return false
            }
          })
        })
        this.listData = this.listData.filter(item => {
          return !item.isDelete
        })
        console.log('新的数据', this.listData)
        // let newObj = this.pageModule
        // moduleId.map(id => {
        //   newObj.listData.map(item => {
        //     if (item.moduleContentId === id) {
        //       item.isDelete = true
        //       return false
        //     }
        //   })
        // })
        // this.$store.dispatch('SetPageDetail', newObj)
      } else {
        this.$message.error(res.message)
      }
    },
    // 跳转到编辑页面
    toPopEdit (data) {
      this.$store.dispatch('SetPageEditInfo', {})
      // 1:图片编辑 2:商品编辑 3:导航编辑 4:拼团编辑 5:秒杀编辑
      let params = `?pageModuleContentId=${data.pageModuleContentId || ''}&falsePageModuleContentId=${data.falsePageModuleContentId}&pagesToken=${this.pagesToken}&pageId=${this.pageId}`
      let url = ''
      switch (data.moduleType) {
        case 1:
          url = '/siteModule/pageSetting/imageEdit' + params
          break
        case 2:
          url = '/siteModule/pageSetting/productEdit' + params
          break
        case 3:
          url = '/siteModule/pageSetting/navigationEdit' + params
          break
        case 4:
          url = '/siteModule/pageSetting/fightGroupEdit' + params
          break
        case 5:
          url = '/siteModule/pageSetting/secKillEdit' + params
          break
        case 6:
          url = '/siteModule/pageSetting/couponEdit' + params
          break
        default:
          url = ''
          break
      }
      console.log(url)
      // 保存之前填写的数据
      // let pageInfo = Object.assign({}, this.formData)
      // pageInfo.listData = this.listData
      // pageInfo.pageId = this.pageId
      // pageInfo.pagesToken = this.pagesToken
      let pageInfo = {
        formData: this.formData,
        listData: this.listData,
        pageId: this.pageId,
        pagesToken: this.pagesToken
      }
      sessionStorage.setItem(`pagesToken${this.pagesToken}`, JSON.stringify(pageInfo))
      if (url) {
        this.$router.push(url)
      }
      // let url = `/#/siteModule/pageSetting/imageEdit?pageId=${this.pageId}moduleContentId=${data.moduleContentId}`
      // window.newwindow = window.open()
      // window.newwindow.location.href = url
    },
    // 选中多个模块
    handleSelectionChange (data) {
      this.multiSelect = data
    },
    // 上移 下移
    toMove (index, step) { // step -1 上移 1 下移
      if (index === 0 && step === -1) { // 本来是最上面的
        return false
      }
      if (index === this.listData.length - 1 && step === 1) { // 本来是最下面的
        return false
      }
      let newIndex = index + step
      let moveObj = this.listData[index]
      this.toMoveData(index, newIndex, moveObj.falsePageModuleContentId, step)
    },
    // 置顶 / 置底
    toMoveTop (index, step) { // step -1 置顶1 置底
      let newIndex = step > 0 ? this.listData.length - 1 : 0
      let moveObj = this.listData[index]
      this.toMoveData(index, newIndex, moveObj.falsePageModuleContentId, step)
    },
    // 请求接口保存移动位置
    async toMoveData (oldIndex, newIndex, falsePageModuleContentId, type) { // 排序从 1开始
      let req = {
        pagesToken: this.pagesToken,
        falsePageModuleContentId: falsePageModuleContentId,
        sort: newIndex + 1,
        type: type > 0 ? 0 : 1
      }
      let res = await this.$post('pages/falseMove.do', req)
      if (parseInt(res.code) === 1) {
        let moveObj = this.listData.splice(oldIndex, 1)[0]
        this.listData.splice(newIndex, 0, moveObj)
      } else {
        this.$message.error(res.message)
      }
    },
    // 渲染表头 -- 跳转参数项
    renderHeader (createElement) {
      return createElement(
        'div',
        {
          'class': 'renderTableHead'
        },
        [
          createElement('span', {}, ['跳转参数']
          ),
          createElement(
            'el-tooltip',
            {
              'class': 'renderTableHead',
              attrs: {
                content: '跳转类型为不跳转时显示“无”，页面时显示页面ID，商品时显示货号',
                placement: 'top'
              }
            },
            [
              createElement('i',
                {
                  'class': 'el-icon-question',
                  'style': 'font-size: 20px; margin-left: 10px'
                }, ['']
              )
            ]
          )
        ]
      )
    },
    // --- 模块内容 ---end

    // -- 上传图片
    beforePicUpload (file) {
      const isLt2M = file.size / 1024 / 1024 < 1
      if (!isLt2M) {
        this.$message.error('上传的图片大小不能超过 1MB!')
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
        this.formData.shareImage = res.data.url
      } else {
        this.formData.shareImage = ''
        this.$message.error(res.message)
      }
    },
    handleUploadError () {
      this.$message.error('上传失败！')
      this.uploading = false
      this.formData.shareImage = ''
    },
    // -- 上传图片---end

    // 保存 -上线 1 / 下线 0
    toSave (isPublish) {
      this.$refs.formDataRef.validate(async (valid, validObj) => {
        if (!valid) {
          for (let item in validObj) {
            this.$message.error(validObj[item][0].message)
            return false
          }
          return
        }
        // if (!this.listData.length) {
        //   this.$message.error('请添加模块组件')
        //   return
        // }
        let reqData = {
          pageId: this.pageId !== -1 ? this.pageId : '',
          pagesToken: this.pagesToken,
          isPublish: isPublish
        }
        reqData = Object.assign({}, this.formData, reqData)
        if (isPublish) this.saveUpLoading = true
        if (!isPublish) this.saveDownLoading = true
        let res = await this.$post('pages/saveOrEdit.do', reqData)
        if (isPublish) this.saveUpLoading = false
        if (!isPublish) this.saveDownLoading = false
        if (parseInt(res.code) === 1) {
          this.$message.success('保存成功')
          console.log(this.$router)
          // this.$router.go(-1)
          this.$router.push('/siteModule/pageSetting/pageList')
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 预览
    toPreview () {
      this.$refs.formDataRef.validate(valid => {
        if (!valid) {
          return
        }
        if (!this.listData.length) {
          this.$message.error('请添加模块组件')
          return
        }
        this.toShowPreview = true
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
  .detailTable{
    width: 70%;
    min-width: 850px;
    /*margin-top: 40px;*/
    line-height: 24px;
    .el-table {
      border: 1px solid $border-base;
      border-bottom: none
    }
  }
  .btn-Wrap{
    display: flex;
    align-items: center;
    justify-content: flex-start;
    border: 1px solid $border-base;
    border-bottom: none;
    .el-button{
      border-radius: 0;
      margin: -1px 0 -1px -1px;
    }
  }
  .submitBtnWrap{
    margin: 40px 130px;
    /*text-align: center;*/
    .el-button{
      width: 120px;
    }
  }
  .uploadWrap{
    width: 600px;
    height: 190px;
    .uploadContent {
      height: 100%;
      width: 100%;
    }
    .imgBox {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      img{
        width: 100%;
        height: 100%;
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
  .pageEditWrap{
    .renderTableHead{
      height: 23px;
      line-height: 23px;
      vertical-align: top;
    }
    .uploadWrap{
      .el-upload {
        width: 160px;
        /*height: 100%;*/
        vertical-align: top;
      }
      .el-upload-dragger {
        width: 160px;
        height: 160px;
        /*.el-upload__text{*/
        /*padding-bottom: 20px;*/
        /*}*/
      }
    }
  }
</style>
