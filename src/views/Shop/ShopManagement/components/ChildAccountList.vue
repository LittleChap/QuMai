<!-- 子账号列表弹窗 -->
<template>
  <el-dialog title="子账号列表" v-if="value" :visible="value" class="v-dialog " width="1000px" top="10vh" @close="beforeClose">
    <div class="contentBox">
      <el-form :inline="true" :model="formData" class="demo-form-inline">
        <el-row>
          <el-col :span="7">
            <el-form-item label="父账号：">
              <span>{{formData.username}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="店铺名：">
              <span>{{formData.shop_name}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="归属地：">
              <span></span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table :data="tableData">
        <el-table-column prop="username" label="子账号" align="center"></el-table-column>
        <el-table-column prop="login_number" label="登录次数" align="center"></el-table-column>
        <el-table-column prop="" label="最后登录时间" align="center" min-width="150px">
          <template slot-scope="scope">
            {{$moment(scope.row.last_login_time).format('YYYY-MM-DD HH:mm:ss')}}
          </template>
        </el-table-column>
        <el-table-column prop="" label="申请时间" align="center" min-width="150px">
          <template slot-scope="scope">
            {{$moment(scope.row.create_time).format('YYYY-MM-DD HH:mm:ss')}}
          </template>
        </el-table-column>
        <el-table-column prop="" label="启用" align="center">
          <template slot-scope="scope">
            <div class="hotCheck">
              <el-checkbox @change="toOpen($event, scope.row)" v-model="scope.row.is_open"></el-checkbox>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作" align="center" min-width="150px">
          <template slot-scope="scope">
            <span class="v-blue v-text-cursor" @click="resetPw(scope.row.shop_chidren_id)">重置密码</span>
            <i class="v-blue v-separator">|</i>
            <span class="v-red v-text-cursor" @click="delAccount(scope.row.shop_chidren_id, scope.row)">删除</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div slot="footer" class="v-dialog-footer">
      <el-button @click="closeDialog">关闭</el-button>
    </div>
    <!-- <img :src="a" alt=""> -->
  </el-dialog>
</template>

<script>
export default {
  name: 'childList-dialog',
  props: {
    formData: { // 数据
      type: Object,
      default: () => {}
    },
    tableData: { // 数据
      type: Array,
      default: () => []
    },
    idx: {
      type: Number
    },
    value: false // 显示与否
  },
  data () {
    return {
    }
  },
  methods: {
    // 关闭弹窗
    beforeClose () {
      this.$emit('input', false)
    },
    // 关闭
    closeDialog () {
      this.$emit('success', false)
      this.$emit('input', false)
    },
    // 密码重置
    resetPw (id) {
      this.$confirm('确定重置密码？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let res = await this.$post('shop/initShopChidrenPwd.do', {id})
        if (+res.code === 1) {
          this.$message.success('重置成功')
        } else {
          this.$message.error(res.message)
        }
      }).catch(() => {
        return false
      })
    },
    // 删除
    delAccount (id, child) {
      this.$confirm('确定删除此子账号？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let res = await this.$post('shop/falsedeleteShopChidren.do', {shop_chidren_id: id})
        if (+res.code === 1) {
          this.$message.success('删除成功')
          this.$emit('getChildList', {id: child.shop_id, index: this.idx})
        } else {
          this.$message.error(res.message)
        }
      }).catch(() => {
        return false
      })
    },
    // 是否启用
    async toOpen (val, shop) {
      let reqData = {
        shop_chidren_id: shop.shop_chidren_id,
        is_open: Number(val)
      }
      let res = await this.$post('shop/isOpenShopChidren.do', reqData)
      if (+res.code === 1) {
        if (val) {
          this.$message.success('开启成功')
        } else {
          this.$message.success('关闭成功')
        }
      } else {
        this.$message.error(res.message)
      }
    },
    // 图片保存本地
    toSaveImg () {
      let canvas = this.convertImageToCanvas(this.$refs.imgRef)
      let url = canvas.toDataURL('image/png') // PNG格式
      // let url = this.infoData.extensionImage
      let fileName = '推广二维码.png'
      try {
        // 生成一个a元素
        let a = document.createElement('a')
        // 创建一个单击事件
        let event = new MouseEvent('click')
        event.initEvent('click', true, true)
        console.log('url', url)

        // 将a的download属性设置为我们想要下载的图片名称，若name不存在则使用‘下载图片名称’作为默认名称
        a.download = fileName
        // 将生成的URL设置为a.href属性
        a.href = url

        // 触发a的单击事件
        a.dispatchEvent(event)
      } catch (error) {
        console.log('失败', error)
        // let canvas = this.convertImageToCanvas(this.$refs.imgRef)
        // console.log('保存', canvas)
        let blob = canvas.msToBlob()
        window.navigator.msSaveBlob(blob, fileName)
        // this.SaveAs5(url)
        // window.location.href = url
      }
      // a.click()

      // blob
      // let fileName = '推广二维码.png'
      //
      // // let blob = new Blob(this.infoData.qrcodeBase64Str, {type: 'image/png'})
      // let blob = this.base64ToBlob(this.infoData.qrcodeBase64Str)
      // console.log('blob', blob)
      // if (window.navigator.msSaveOrOpenBlob) {
      //   console.log('有数据11111')
      //   navigator.msSaveBlob(blob, fileName)
      // } else {
      //   console.log('有数据22222')
      //   let link = document.createElement('a')
      //   let event = new MouseEvent('click')
      //   event.initEvent('click', true, true)
      //   link.href = window.URL.createObjectURL(blob)
      //   link.download = fileName
      //   // link.dispatchEvent(event)
      //   link.click()
      //   window.URL.revokeObjectURL(link.href)
      // }
    },
    // base64 转 canvas
    convertImageToCanvas (image) {
      var canvas = document.createElement('canvas')
      canvas.width = image.width
      canvas.height = image.height
      canvas.getContext('2d').drawImage(image, 0, 0)
      return canvas
    },
    SaveAs5 (imgURL) {
      let oPop = window.open(imgURL, '推广二维码.png', 'width=1, height=1, top=5000, left=5000', true)
      for (; oPop.document.readyState != 'complete';) {
        if (oPop.document.readyState == 'complete') break
      }
      oPop.document.execCommand('SaveAs')
      oPop.close()
    },

    // base64 转 blob
    base64ToBlob (code) {
      let parts = code.split(';base64,')
      let contentType = parts[0].split(':')[1]
      let raw = atob(parts[1])
      let rawLength = raw.length
      console.log('rawLength', rawLength)

      let uInt8Array = new Uint8Array(rawLength)

      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i)
      }
      return new Blob([uInt8Array], {type: contentType})
    },
    beforeUpload (file) {
    //   console.log(file)
      const isLt100kb = file.size / 1024 < 100
      if (!isLt100kb) {
        this.$message.error('上传头像图片大小不能超过 100KB!')
      }
      return isLt100kb
    }
    // handleAvatarSuccess (a, b) {
    //   console.log(a)
    //   console.log(b.url)
    //   console.log(URL)
    //   console.log(URL.createObjectURL(b.raw))
    // //   this.a = URL.createObjectURL(b.raw)
    //   this.a = b.url
    // },
    //  handlePictureCardPreview(file) {
    //   this.a = file.url;
    //   console.log(file)
    //   console.log(file.url)
    //   this.dialogVisible = true;
    // }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import '~@/styles/common.scss';
  .contentBox{
    .urlBox{
      display: flex;
      align-items: center;
      justify-content: space-between;
      span{
        margin-right: 24px;
      }
    }
    .codeImg{
      display: flex;
      align-items: flex-start;
      img {
        width: 300px;
        height: 300px;
      }
      span{
        margin: 26px 16px 0 0;
      }
    }
    .goodsBox{
      display: flex;
      align-items: flex-start;
      margin: 0 0 10px 0;
      /*margin-left: 130px;*/
      img {
        width: 80px;
        height: 80px;
      }
      h4{
        font-weight: normal;
        margin: 0 20px;
      }
    }
    .upLogoBox{
      display: flex;
      justify-content: flex-start;
    }
  }
</style>
