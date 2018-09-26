<template>
  <div v-if="!formLoading">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>商品</el-breadcrumb-item>
      <el-breadcrumb-item>商品查看</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="v-wrap listWrap">
      <div>
          <h3 class="v-title">商品查看</h3>
      </div>
      <!-- 表单-头 -->
      <el-form :model="formData" ref="formDataRef" label-position='left' label-width="120px" v-loading='formLoading' size="small" class="v-form detailForm" @submit.native.prevent>
        <el-form-item label="商品分类:" >
          <span>{{formData.allParentCatName}}</span>
        </el-form-item>
        <el-form-item label="商家名称:" >
          <span>{{formData.goods.shop_name}}</span>
        </el-form-item>
        <el-form-item label="商品名称:" >
          <span>{{formData.goods.name}}</span>
        </el-form-item>
        <el-form-item label="商品简介:" >
          <span>{{formData.goods.brief}}</span>
        </el-form-item>
        <el-form-item label="商品品牌:" >
          <span>{{formData.goods.brand_name}}</span>
        </el-form-item>
        <el-form-item label="自定义增加销量:" >
          <span>{{formData.goods.buy_num_virtual}}</span>
        </el-form-item>
        <el-form-item label="商品总销量:" >
          <span>{{formData.goods.buy_num}}</span>
        </el-form-item>
        <el-form-item label="商品库存:" >
          <span>{{formData.goods.store}}</span>
        </el-form-item>
        <el-form-item label="会员折扣:" >
          <span>{{formData.productList[0].open_member_discount | checDisc}}</span>
        </el-form-item>
        <el-form-item label="优惠券使用:" >
          <span>{{formData.productList[0].use_coupon | checDisc}}</span>
        </el-form-item>
        <el-form-item label="商品状态:" >
          <span>{{formData.goods.is_putaway | checkPutaway}}</span>
        </el-form-item>
        <el-form-item label="货号:" >
          <span>{{formData.goods.sn}}</span>
        </el-form-item>
        <el-form-item label="上架时间:" >
          <span>{{$moment(formData.goods.putaway_time).format('YYYY-MM-DD HH:ss:mm')}}</span>
        </el-form-item>
        <el-form-item label="添加时间:" >
          <span>{{$moment(formData.goods.create_time).format('YYYY-MM-DD HH:ss:mm')}}</span>
        </el-form-item>
        <el-form-item label="" label-width="0px">
          <span style="color:#666;">商品规格：</span>
          <div>
            <el-table :data="formData.productList"  style="width: 100%">
              <el-table-column align="center" prop="spec_name" label="商品规格" ></el-table-column>
              <el-table-column align="center" prop="sku" label="商品SKU" min-width="150px"></el-table-column>
              <el-table-column align="center" prop="price" label="销售价"></el-table-column>
              <el-table-column align="center" prop="orign_price" label="原价"></el-table-column>
              <el-table-column align="center" prop="store" label="库存"></el-table-column>
              <el-table-column align="center" prop="sale" label="销量"></el-table-column>
            </el-table>
          </div>
        </el-form-item>
        <el-form-item v-if="formData.propertyList.length > 0" label="" label-width="0px">
          <span style="color:#666;">商品属性：</span>
          <div>
            <el-table :data="formData.propertyList"  style="width: 100%">
              <el-table-column align="center" prop="propertyKey" label="属性名" ></el-table-column>
              <el-table-column align="center" prop="propertyValue" label="属性值"></el-table-column>
            </el-table>
          </div>
        </el-form-item>
        <el-form-item label="" label-width="0px">
          <span style="color:#666;">图片预览：</span>
          <div class="imgPreview">
            <vue-preview :slides="imageList" class="imgBox" @close="handleClose"></vue-preview>
          </div>
        </el-form-item>
        <el-form-item style="margin-top: 20px" label-width="0px">
          <el-button type="primary" @click="$router.go(-1)"  size="mi">返 回</el-button>
        </el-form-item>
      </el-form>
      <!-- 表单-尾 -->
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      goodsId: '', // 商品id
      formLoading: false, // 表单加载loading
      // 表单渲染数据
      formData: {
        propertyList: [],
        GoodsGalleryList: [], // 图片
        allParentCatName: '',
        productList: [{}], // 商品规格
        goods: {}
      }
    }
  },
  computed: {
    imageList () {
      return this.formData.GoodsGalleryList.map(item => {
        return {
          alt: 'picture1',
          title: 'Image Caption 1',
          w: 900,
          h: 700,
          src: item.image_original,
          msrc: item.image_original
        }
      })
      // let imageList = []
      // this.formData.GoodsGalleryList.forEach(item => {
      //   let imageListItem = {
      //     alt: 'picture1',
      //     title: 'Image Caption 1',
      //     w: 900,
      //     h: 700
      //   }
      //   imageListItem.src = item.image_original
      //   imageListItem.msrc = item.image_original
      //   imageList.push(imageListItem)
      // // })
      // return imageList
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
    this.goodsId = this.$route.query.goodsId
    this.getList()
  },
  methods: {
    handleClose (e) {
      console.log('close event', e)
    },
    // 获取数据
    async getList () {
      this.formLoading = true
      let reqData = {}
      reqData.goods_id = this.goodsId
      console.log(reqData)
      let res = await this.$post('goods/goEdit.do', reqData)
      this.formLoading = false
      if (+res.code === 1) {
        this.formData = res.data
      }
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import '~@/styles/common.scss';
  .detailForm{
    width: 700px;
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
</style>
