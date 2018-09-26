<template>
  <div v-if="!formLoading">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>商品</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类设置</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="v-wrap listWrap catStyle">
      <div>
          <h3 class="v-title">商品分类设置</h3>
      </div>
      <!-- 表单-头 -->
      <el-form :model="formData" :rules="rules" ref="formDataRef" label-position='top' label-width="120px" v-loading='formLoading' size="small" class="v-form detailForm" @submit.native.prevent>
        <el-form-item label="上级分类:" prop="catIdArr">
          <el-cascader @change="change" placeholder="请选择分类" clearable  expand-trigger="hover" :options="catList" :props="catProps" v-model="formData.catIdArr" change-on-select filterable></el-cascader>
        </el-form-item>
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input placeholder="请输入名称" v-model="formData.cat_name" :maxlength="20" clearable></el-input>
        </el-form-item>
        <el-form-item label="分类图标:" prop="image" v-if="+level === 2 && $route.query.saveOrEdit === 'save' || (+level === 3 && $route.query.saveOrEdit === 'edit')">
          <el-upload class="uploadWrap" drag :data="uploadReqData" :disabled="imgLoading"
          :show-file-list="false" :before-upload="beforeUpload" :on-success="uploadSuccess"
          :on-error="uploadError" action="/backend/mobileUpload/uploadImg.do">
            <div class="uploadContent" v-loading="imgLoading" element-loading-text="文件上传中...">
              <div class="imgBox smallImgBox" v-if="formData.image">
                <img v-if="formData.image" :src="formData.image" class="avatar smallImg">
                <div class="mask">
                  <div>
                    <i class="el-icon-upload"></i>
                    <p class="el-upload-text">将文件拖到此处，或<em>点击上传</em></p>
                  </div>
                </div>
              </div>
              <i class="el-icon-upload" v-if="!formData.image"></i>
              <div class="el-upload__text" v-if="!formData.image">将文件拖到此处，或<em>点击上传</em></div>
            </div>
            <div class="el-upload__tip" slot="tip">三级分类图片，建议上传尺寸140*140</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="排序:" prop="sort">
          <el-input v-model="formData.sort" clearable></el-input>
        </el-form-item>
        <el-form-item label="是否启用:" prop="is_open">
          <el-radio v-model="formData.is_open" :label="1">是</el-radio>
          <el-radio v-model="formData.is_open" :label="0">否</el-radio>
        </el-form-item>
        <el-form-item style="margin-top: 20px" label-width="0px">
          <el-button type="primary" v-if="$route.query.saveOrEdit === 'save'" @click="toSaveCat"  size="mi">保存</el-button>
          <el-button type="primary" v-if="$route.query.saveOrEdit === 'edit'" @click="toEditCat"  size="mi">保存</el-button>
          <el-button @click="$router.go(-1)"  size="mi">返 回</el-button>
        </el-form-item>
      </el-form>
      <!-- 表单-尾 -->
    </div>
  </div>
</template>

<script>
export default {
  data () {
    let validaSort = (rule, value, callback) => {
      let num = Number(value)
      if (isNaN(num)) {
        callback(new Error('请输入正确数值'))
      } else {
        callback()
      }
    }
    return {
      // 类级别
      level: '',
      goodsId: '', // 商品id
      formLoading: false, // 表单加载loading
      // 表单渲染数据
      formData: {
        cat_name: '',
        catIdArr: [],
        image: '',
        sort: 100,
        is_open: 1,
        cat_id: ''
      },
      // 图片loading
      imgLoading: false,
      // 图片额外参数
      uploadReqData: {
        from: 'other'
      },
      // 表单验证
      rules: {
        catIdArr: [{required: true, message: '请选择商品分类'}],
        cat_name: [{required: true, message: '请输入分类名称'}],
        sort: [{required: true, message: '请输入排序'}, {validator: validaSort, trigger: 'change'}]

      },
      catList: [], // 分类列表
      catProps: {
        value: 'catId',
        label: 'catName',
        children: 'goodsCatChildren'
      }
    }
  },
  filters: {
    // 过滤是否上架
    checkPutaway (val) {
      return +val ? '上架' : '下架'
    },
    // 是否开启折扣和优惠券使用
    checDisc (val) {
      return +val ? '开启' : '关闭'
    }
  },
  created () {
    if (this.$route.query.EdCatId) {
      this.getEditeList(this.$route.query.EdCatId)
    }
    // this.goodsId = this.$route.query.goodsId
    if (this.$route.query.catId) {
      this.checkParentId(this.$route.query)
    }
    this.getCatList()
  },
  methods: {
    // 获得分类列表
    async getCatList () {
      let catList = [{
        catId: 0,
        catName: '顶级',
        goodsCatChildren: []
      }]
      let res = await this.$post('goodscat/list.do', {})
      if (parseInt(res.code) === 1) {
        res.data.goodsCatList.map(first => {
          if (!first.goodsCatChildren || !first.goodsCatChildren.length) {
            delete first.goodsCatChildren
            return
          }
          first.goodsCatChildren.map(second => {
            if (!second.goodsCatChildren || !second.goodsCatChildren.length) {
              delete second.goodsCatChildren
              return
            }
            second.goodsCatChildren.map(third => {
              if (!third.goodsCatChildren || !third.goodsCatChildren.length) {
                delete third.goodsCatChildren
                return
              }
              third.goodsCatChildren.map(forth => {
                if (!forth.goodsCatChildren || !forth.goodsCatChildren.length) {
                  delete forth.goodsCatChildren
                }
              })
            })
          })
        })
        catList[0].goodsCatChildren = res.data.goodsCatList
        this.catList = catList
      }
    },
    // 初始渲染分类-判断是否有父类
    async checkParentId (obj) {
      this.formData.catIdArr.unshift(+obj.catId)
      if ((+obj.parentId)) {
        let res = await this.$post('goodscat/goEdit.do', {cat_id: obj.parentId})
        this.checkParentId({catId: res.data.goodsCat.cat_id, parentId: res.data.goodsCat.parent_id})
      } else {
        this.formData.catIdArr.unshift(0)
        // this.getList()
        this.change(this.formData.catIdArr)
      }
    },
    // 编辑获得数据
    async getEditeList (catId) {
      let res = await this.$post('goodscat/goEdit.do', {cat_id: catId})
      if (+res.code === 1) {
        let data = res.data.goodsCat
        this.formData.image = data.image
        this.formData.cat_name = data.cat_name
        this.formData.is_open = +data.is_open
        this.formData.sort = data.sort
        this.formData.cat_id = data.cat_id
      }
    },
    // 上传前回调
    beforeUpload (file) {
      this.imgLoading = true
      // return true
    },
    // 图片上传成功回调
    uploadSuccess (res) {
      // this.upImg.shopKey = true
      this.imgLoading = false
      if (parseInt(res.code) === 1) {
        this.formData.image = res.data.url
      } else {
        this.$message.error(res.message)
      }
    },
    // 图片上传失败回调
    uploadError (res) {
      this.$message.error('上传失败！')
      this.imgLoading = false
    },
    // cas选择器改变事件
    async change (val) {
      let reqData = {
        cat_id: val[val.length - 1]
      }
      let res = await this.$post('goodscat/getLevelById.do', reqData)
      if (+res.code === 1) {
        this.level = res.data.level
        // console.log('level', this.level)
      }
    },
    // 新增分类
    toSaveCat () {
      this.$refs.formDataRef.validate(async (isOk, obj) => {
        if (isOk) {
          let reqData = {
            parent_id: this.formData.catIdArr[this.formData.catIdArr.length - 1],
            cat_name: this.formData.cat_name,
            sort: this.formData.sort,
            is_open: this.formData.is_open
          }
          let res = await this.$post('goodscat/save.do', reqData)
          // console.log(res)
          if (+res.code === 1) {
            // console.log('aaa')
            this.$message.success('保存成功')
            setTimeout(() => {
              // console.log(this)
              this.$router.go(-1)
            }, 1000)
          } else {
            this.$message.error(res.message)
            // alert('ccc')
          }
        }
      })
    },
    // 编辑分类
    toEditCat () {
      this.$refs.formDataRef.validate(async (isOk, obj) => {
        if (isOk) {
          let reqData = {
            parent_id: this.formData.catIdArr[this.formData.catIdArr.length - 2],
            cat_name: this.formData.cat_name,
            sort: this.formData.sort,
            is_open: this.formData.is_open,
            cat_id: this.formData.cat_id
          }
          let res = await this.$post('goodscat/edit.do', reqData)
          // console.log(res)
          if (+res.code === 1) {
            // console.log('aaa')
            this.$message.success('保存成功')
            setTimeout(() => {
              // console.log(this)
              this.$router.go(-1)
            }, 1000)
          } else {
            this.$message.error(res.message)
            // alert('ccc')
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import '~@/styles/common.scss';
  .detailForm{
    width: 400px;
    margin-top: 20px;
  }
  .imgPreview{
    .imgBox{
      .my-gallery{
      display: flex;
      justify-content: flex-start;
     }
    }
  }
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
      max-width: 140px;
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
</style>

<style lang="scss" rel="stylesheet/scss">
  .my-gallery{
    display: flex;
    justify-content: flex-start;
    figure{
      margin:10px;
      img{
        width:100px;
        height:100px;
      }
    }
  }
  .catStyle{
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
