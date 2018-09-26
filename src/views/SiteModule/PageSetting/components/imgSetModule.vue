<!-- 图片的跳转设置 -->
<template>
  <div>
    <div class="imgSetWrap" v-if="listData && listData.length">
      <div class="imgSetItem" v-for="(item, i) in listData" :key="i">
        <upload :item="item" :index="i" :list="listData" />
        <!--<el-upload class="imgUploadWrap" :data="uploadReqData" :show-file-list="false"
                   :before-upload="beforeItemPicUpload"
                   :on-success="handleItemUploadSuccess"
                   :on-error="handleItemUploadError"
                   action="/backend/mobileUpload/uploadImg.do">
          <div class="leftPart">
            <img :src="item.image">
            <span>更换图片</span>
          </div>
        </el-upload>-->
        <div class="rightPart">
          <div class="rightItem">
            <span class="rightTitle">跳转设置：</span>
            <el-select v-model="item.urlType" clearable   placeholder="请选择要跳转的页面" class="chooseSet" :class="{ 'is-error' : item.error && item.error !== ''}" style="width: 250px"  size="small" @change="changeSetWay(item.urlType, i)">
              <el-option :label="item.label" :value="1">页面</el-option>
              <el-option :label="item.label" :value="2">商品</el-option>
              <el-option :label="item.label" :value="3">链接</el-option>
              <el-option label="不跳转" :value="0"> </el-option>
              <el-option label="购物车" :value="4"> </el-option>
              <el-option label="个人中心" :value="5"> </el-option>
            </el-select>
            <el-button type="text" v-if="item.urlType===1 || item.urlType===2 || item.urlType===3" style="margin-left: 10px" @click="changeSetWay(item.urlType, i, true)">修改</el-button>
            <p v-if="item.error" style="position: absolute; left: 80px; top: 24px" class="v-red">{{item.error}}</p>
          </div>
          <div class="rightItem" v-if="showIconText">
            <span class="rightTitle">图标文本：</span>
            <el-input v-model="item.title" :maxlength="10" style="width: 250px"  size="small"> </el-input>
          </div>
          <div class="rightItem">
            <span class="rightTitle">排序：</span>
            <div class="rightContent">
              <span class="v-blue v-text-cursor" @click="toMove(i, -1)">上移</span> <i class="v-blue v-separator">|</i>
              <span class="v-blue v-text-cursor" @click="toMove(i, 1)">下移</span> <i class="v-blue v-separator">|</i>
              <span class="v-blue v-text-cursor" @click="toMoveTop(i, -1)">置顶</span> <i class="v-blue v-separator">|</i>
              <span class="v-blue v-text-cursor" @click="toMoveTop(i, 1)">置底</span>
            </div>
          </div>
        </div>
        <i class="el-icon-close closeBtn" @click="toDelete(i)"> </i>
      </div>
      <p v-if="desc" class="tip">{{desc}}</p>
    </div>

    <!--  选择页面弹窗 -->
    <pageChooseDialog v-model="pageChoose.dialogVisible" chooseSingle :chooseId="pageChoose.choosePageId" @success="toSaveChoosePage" />
    <!--  选择链接地址 -->
    <linkDialog  v-model="linkChoose.dialogVisible" :url="linkChoose.url"  @success="toSaveLink"/>
    <!-- 选择商品弹窗 -->
    <ProductChoose v-model="productChoose.dialogVisible" chooseSingle :chooseId="productChoose.goodsId" @success="saveChooseGoods"/>
  </div>
</template>

<script>
import upload from './upload'
import pageChooseDialog from './pageChooseDialog'
import linkDialog from './linkDialog'
import ProductChoose from '@/components/ProductChoose'
export default {
  name: 'img-set-module',
  components: {upload, pageChooseDialog, linkDialog, ProductChoose},
  props: {
    listData: {
      type: Array,
      default: () => []
    },
    desc: {
      type: String,
      default: ''
    },
    showIconText: { // 是否是要显示图标 （导航）
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // 添加页面模块
      pageChoose: {
        dialogVisible: false,
        currentIndex: -1,
        choosePageId: '' // 选中的pageId
      },
      // 添加链接
      linkChoose: {
        dialogVisible: false,
        url: '', // 输入的地址
        currentIndex: -1 // 当前index
      },
      // 选择商品弹窗
      productChoose: {
        dialogVisible: false,
        goodsId: '', // 当前选中的商品id
        currentIndex: -1 // 当前index
      }
    }
  },
  methods: {
    // 图片列表删除
    toDelete (index) {
      this.listData.splice(index, 1)
    },
    // 点击选择 跳转设置
    changeSetWay (val, index, isChange) {
      let currOBj = this.listData[index]
      currOBj.error = null
      switch (val) {
        case 0:
          currOBj.label = '不跳转'
          break
        case 1:
          currOBj.label = '页面'
          break
        case 2:
          currOBj.label = '商品'
          break
        case 3:
          currOBj.label = '链接'
          break
        case 4:
          currOBj.label = '购物车'
          break
        case 5:
          currOBj.label = '个人中心'
          break
      }
      this.listData.splice(index, 1, currOBj)

      // 0:不跳转 1:页面 2:商品 3:链接  4:购物车 5:个人中心
      if (val === 1) { // 页面
        currOBj.label = '页面'
        this.pageChoose.currentIndex = index
        this.pageChoose.choosePageId = ''
        if (isChange) { // 修改
          this.pageChoose.choosePageId = this.listData[index].url
        }
        this.pageChoose.dialogVisible = true
        return false
      }
      if (val === 2) { // 商品
        this.productChoose.currentIndex = index
        this.productChoose.goodsId = ''
        if (isChange) { // 修改
          this.productChoose.goodsId = this.listData[index].url
        }
        this.productChoose.dialogVisible = true
        return false
      }
      if (val === 3) { // 链接
        this.linkChoose.currentIndex = index
        this.linkChoose.url = ''
        if (isChange) { // 修改
          this.linkChoose.url = this.listData[index].url || ''
        }
        this.linkChoose.dialogVisible = true
        return false
      }
      return false
    },
    // 保存选中的页面id
    toSaveChoosePage (pageIds, pageArray) {
      console.log(pageIds, pageArray)
      let obj = this.listData[this.pageChoose.currentIndex]
      obj.url = pageIds.join(',')
      obj.name = pageArray[0].name
      obj.label = `页面：${obj.name}`
      obj.error = null
      this.listData.splice(this.pageChoose.currentIndex, 1, obj)
    },
    // 保存填入的连接
    toSaveLink (url) {
      let obj = this.listData[this.linkChoose.currentIndex]
      obj.url = url
      obj.name = url
      obj.label = `链接：${obj.name}`
      obj.error = null
      this.listData.splice(this.linkChoose.currentIndex, 1, obj)
    },
    // 保存选中的商品
    saveChooseGoods (goodsIdArr, goodsArr) {
      let obj = this.listData[this.productChoose.currentIndex]
      obj.url = goodsIdArr.join(',')
      obj.error = null
      obj.name = goodsArr[0].goodsName
      obj.label = `商品：${obj.name}`
      this.listData.splice(this.productChoose.currentIndex, 1, obj)
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
      let moveObj = this.listData.splice(index, 1)[0]
      this.listData.splice(newIndex, 0, moveObj)
    },
    // 置顶 / 置底
    toMoveTop (index, step) { // step -1 置顶1 置底
      let newIndex = step > 0 ? this.listData.length - 1 : 0
      let moveObj = this.listData.splice(index, 1)[0]
      this.listData.splice(newIndex, 0, moveObj)
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import '~@/styles/common.scss';
  .imgSetWrap{
    margin: 20px 0;
    padding: 14px 14px 4px;
    background: $table-background-hover;
  }
  .imgSetItem{
    display: flex;
    position: relative;
    padding: 20px;
    align-items: center;
    border: 1px solid $border-base;
    border-radius: 6px;
    background-color: #fff;
    margin-bottom: 10px;
    .rightPart{
      flex: 1;
      margin: 0 20px;
      .rightItem{
        position: relative;
        display: flex;
        align-items: center;
        &+.rightItem{
          margin-top: 10px;
        }
      }
      .rightTitle{
        width: 80px;
        font-size: 14px;
        color: #666;
        line-height: 40px;
      }
      .rightContent{
        flex: 1;
      }
    }
    .closeBtn{
      position: absolute;
      top: 10px ;
      right: 10px;
      font-size: 22px;
      color: $text-third;
      cursor: pointer;
      &:hover{
        opacity: 0.8;
      }
    }
  }

</style>
