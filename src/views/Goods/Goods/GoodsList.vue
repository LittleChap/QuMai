<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>商品</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="v-wrap listWrap">
      <div>
        <h3 class="v-title">商品列表</h3>
      </div>
      <!-- 表单-头 -->
      <el-form :model="formData" label-width="90px" class="v-form v-form-bg" @submit.native.prevent>
        <el-row>
          <el-col :span="5">
            <el-form-item label="分类" >
              <el-cascader change="change" placeholder="请选择分类" clearable  expand-trigger="hover" :options="catList" :props="catProps" v-model="formData.catIdArr" change-on-select filterable > </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="品牌" >
              <el-select v-model="formData.brand_id" clearable  placeholder="请选择店铺" filterable>
                <el-option v-for="(item, i) in brandList" :key="i" :label="item.name" :value="item.brand_id" > </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="店铺" >
              <el-select v-model="formData.shop_id" clearable  placeholder="请选择店铺" filterable>
                <el-option v-for="(item, i) in shopList" :key="i" :label="item.shop_name" :value="item.shop_id" > </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="商品名称" >
              <el-input v-model="formData.goodsName" @keyup.native.enter="toSearch"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="货号" >
              <el-input v-model.number="formData.goods_sn" @keyup.native.enter="toSearch"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <el-form-item label="商品SKU">
              <el-input v-model="formData.sku" @keyup.native.enter="toSearch"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="销售价" >
              <el-input style="width:40%" v-model.number="formData.price_min" @keyup.native.enter="toSearch"></el-input>
              <span>到</span>
              <el-input style="width:40%" v-model.number="formData.price_max" @keyup.native.enter="toSearch"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="总销售量" >
              <el-input style="width:40%" v-model="formData.buy_num_min" @keyup.native.enter="toSearch"></el-input>
              <span>到</span>
              <el-input style="width:40%" v-model="formData.buy_num_max" @keyup.native.enter="toSearch"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="库存量" >
              <el-input style="width:40%" v-model="formData.store_min" @keyup.native.enter="toSearch"></el-input>
              <span>到</span>
              <el-input style="width:40%" v-model="formData.store_max" @keyup.native.enter="toSearch"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <div class="btnBox">
              <el-button type="primary" icon="el-icon-search" @click="toSearch">查询</el-button>
              <el-button type="primary" :loading="excelLoading" icon="el-icon-download"  @click="toExcel">导出</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <!-- 表单-尾 -->
      <!-- 表格-头 -->
      <div class="detailTable">
        <el-row class="btn-Wrap">
          <!-- <el-button icon="el-icon-minus" type="warning" plain @click="toAllDelete" >删除</el-button> -->
          <el-button type="danger" plain @click="toAllOut">下架</el-button>
          <!-- <el-button type="warning" plain @click="toRevoke">停止发放并撤回</el-button> -->
        </el-row>
        <el-table :data="listData" v-loading="mainLoading" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column align="center" type="selection" width="55"> </el-table-column>
          <el-table-column align="center" prop="name" label="商品名称" min-width="170px">
            <template slot-scope="scope">
              <div class="shopBox">
                <div class="shopImg">
                  <img :src="scope.row.image_thumbnail" alt="商品图片">
                </div>
                <span>{{scope.row.name}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="brand_name" label="品牌" min-width="120px"> </el-table-column>
          <el-table-column align="center" prop="shop_name" label="商家名称" min-width="140px"> </el-table-column>
          <el-table-column align="center" prop="price" label="销售价" width="120px"> </el-table-column>
          <el-table-column align="center" prop="original_price_range" label="原价" min-width="120px"> </el-table-column>
          <el-table-column align="center" prop="store" label="库存" width="80px"> </el-table-column>
          <el-table-column align="center" prop="buy_num" label="总销量" width="80px"> </el-table-column>
          <el-table-column align="center" prop="is_putaway" label="状态" width="80px">
            <template slot-scope="scope">
              <span>{{scope.row.is_putaway | checkPutaway}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="上架时间" min-width="174px">
            <template slot-scope="scope">
              {{$moment(scope.row.putaway_time).format('YYYY-MM-DD HH:ss:mm')}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="添加时间" min-width="174px">
            <template slot-scope="scope">
              {{$moment(scope.row.create_time).format('YYYY-MM-DD HH:ss:mm')}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="120px">
            <template slot-scope="scope">
              <router-link :to="`/goods/goods/goodsEdit?goodsId=${scope.row.goods_id}`"> <span class="v-blue v-text-cursor" >查看</span> </router-link>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 表格-尾 -->
      <!-- 分页 -->
      <div class="v-pageBox" v-if="pageInfo.totalResult">
        <el-pagination
           :current-page.sync="pageInfo.currentPage"
           layout="total, sizes, prev, pager, next, jumper"
           :page-size="pageInfo.showCount"
           :page-sizes="[10, 20, 40, 50]"
           @current-change="handleCurrentChange"
           @size-change="handleSizeChange"
           :total="pageInfo.totalResult">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'goods-list',
  data () {
    return {
      formData: {
        catIdArr: [],
        cat_id: '', // 分类Id
        brand_id: '', // 品牌ID
        shop_id: '', // 店铺ID
        goodsName: '', // 商品名称
        sku: '', // 商品sku
        price_min: '', // 最低价
        price_max: '', // 最高价
        buy_num_min: '', // 最小购买量
        buy_num_max: '', // 最大购买量
        store_min: '', // 最小库存
        store_max: '', // 最大库存
        type: '', // 商品类型
        goods_ids: '',
        goods_sn: '' // 货号
      },
      pageInfo: {
        currentPage: 1,
        showCount: 10,
        totalResult: 0
      },
      catList: [], // 分类列表
      shopList: [], // 店铺列表
      brandList: [], // 品牌列表
      listData: [], // 列表数据-商品
      catProps: {
        value: 'catId',
        label: 'catName',
        children: 'goodsCatChildren'
      },
      excelLoading: false, // 导出加载
      mainLoading: false, // 列表的加载
      multiSelect: [],
      chooseInfo: {
        showChooseDialog: false, // 是否显示商品选择器
        goodsList: [], // 选中的商品数据
        showSettingDialog: false, // 是否显示 秒杀设置弹窗
        secKillId: null, // 要修改的 秒杀id
        isOnlyReady: false // 是否只读
      },
      extensionInfo: {
        showDialog: false,
        infoData: {}
      }
    }
  },
  created () {
    if (this.$route.query.catId) {
      this.checkParentId(this.$route.query)
    }
    this.getList()
    this.getCatList()
    console.log(this.formData.catIdArr)
  },
  filters: {
    // 过滤是否上架
    checkPutaway (val) {
      return +val ? '上架' : '下架'
    }
  },
  methods: {
    // 获得商品列表
    async getList () {
      this.mainLoading = true
      let reqData = Object.assign({}, this.pageInfo, this.formData)
      reqData.cat_id = reqData.catIdArr && reqData.catIdArr.length ? reqData.catIdArr[reqData.catIdArr.length - 1] : ''
      console.log(reqData)
      let res = await this.$post('goods/list.do', reqData)
      this.mainLoading = false
      if (parseInt(res.code) === 1) {
        if (this.shopList.length === 0) {
          this.shopList = res.data.shopList
        }
        this.listData = res.data.goodsList
        this.brandList = res.data.brandList
        this.pageInfo.totalResult = res.data.page.totalResult
      }
    },
    // 初始渲染分类-判断是否有父类
    async checkParentId (obj) {
      this.formData.catIdArr.unshift(+obj.catId)
      if ((+obj.parentId)) {
        let res = await this.$post('goodscat/goEdit.do', {cat_id: obj.parentId})
        this.checkParentId({catId: res.data.goodsCat.cat_id, parentId: res.data.goodsCat.parent_id})
      } else {
        this.getList()
      }
    },
    // 获得分类列表
    async getCatList () {
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
        this.catList = res.data.goodsCatList
      }
    },
    // 导出Excel
    async toExcel () {
      this.excelLoading = true
      let reqData = Object.assign({}, this.formData)
      delete reqData.catIdArr
      delete reqData.goods_sn
      reqData.parent_id = reqData.cat_id
      reqData.goodsIds = reqData.goods_ids
      delete reqData.cat_id
      delete reqData.goods_ids
      let res = await this.$post('goods/toExcel.do', reqData)
      this.excelLoading = false
      if (+res.code === 1) {
        let url = res.data.url
        this.downloadFile(url)
        console.log(url)
      } else {
        this.$message.error(res.message)
      }
    },
    // 下载文件
    downloadFile (url) {
      let isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1
      let isSafari = navigator.userAgent.toLowerCase().indexOf('safari') > -1
      if (/(iP)/g.test(navigator.userAgent)) {
        alert('Your device does not support files downloading. Please try again in desktop browser.')
        return false
      }
      if (isChrome || isSafari) {
        var link = document.createElement('a')
        link.href = url
        if (link.download !== undefined) {
          var fileName = url.substring(url.lastIndexOf('/') + 1, url.length)
          link.download = fileName
        }
        if (document.createEvent) {
          var e = document.createEvent('MouseEvents')
          e.initEvent('click', true, true)
          link.dispatchEvent(e)
          return true
        }
      }
      // Force file download (whether supported by server).
      if (url.indexOf('?') === -1) {
        url += '?download'
      }

      window.open(url, '_self')

      // var form = document.createElement('form')
      // form.style.display = 'none'
      // form.target = ''
      // form.method = 'get'
      // form.action = url
      // document.body.appendChild(form)
      // form.submit()
      // document.body.removeChild(form)
      this.$message.success('正在下载...')
    },
    // 查询
    toSearch () {
      this.pageInfo.currentPage = 1
      this.getList()
    },
    // 当前页-页码修改
    handleCurrentChange (val) {
      this.pageInfo.currentPage = val
      document.querySelector('.mainContent').scrollTo(0, 0)
      this.getList()
    },
    // 当前显示页数量修改
    handleSizeChange (size) {
      this.pageInfo.showCount = size
      this.pageInfo.currentPage = 1
      document.querySelector('.mainContent').scrollTo(0, 0)
      this.getList()
    },
    handleSelectionChange (val) {
      this.multiSelect = val
      this.formData.goods_ids = val.map(item => {
        return item.goods_id
      }).join(',')
    },
    // 下架
    toAllOut () {
      if (!this.multiSelect || !this.multiSelect.length) {
        this.$message.error('请选择数据')
        return false
      }
      let dataIdArray = []
      let hasActivity = false
      this.multiSelect.map(item => {
        if (item.is_putaway === 0) {
          hasActivity = true
          return
        }
        dataIdArray.push(item.goods_id)
      })
      if (hasActivity) {
        this.$message.error('您勾选了下架商品')
        return false
      }
      this.outShop(dataIdArray)
    },
    // 下架商品
    outShop (couponSnArray) {
      let text = `确认下架这 ${couponSnArray.length} 个商品？`
      this.$confirm(text, '确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '下架中...'
            let res = await this.$post('goods/batchDownaway.do', {data_ids: couponSnArray.join(',')})
            instance.confirmButtonLoading = false
            instance.confirmButtonText = '确定'
            if (parseInt(res.code) === 1) {
              this.$message.success('下架成功')
              this.getList()
            } else {
              this.$message.error(res.message)
            }
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
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import '~@/styles/common.scss';
  .detailTable{
    /*width: 70%;*/
    margin-top: 20px;
    line-height: 24px;
    .el-table {
      border: 1px solid $border-base;
      border-bottom: none
    }
  }
  .goodsBox{
    display: flex;
    align-items: center;
    img{
      width: 60px;
      height: 60px;
      margin-right: 10px;
    }
    h4{
      flex: 1;
      margin: 0;
      text-align: left;
    }
  }
  .textName{
    font-weight: normal;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
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
  .btnBox{
    display: flex;
    justify-content: space-around;
  }
  .shopBox{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .shopImg{
      margin-right: 15px;
      width: 50px;
      height: 50px;
      img{
        height: 100%;
        width: 100%
      }
    }
  }
</style>
