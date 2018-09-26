<!-- 页面 编辑 - 导航编辑 -->
<template>
  <div class="imageEditWrap">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/siteModule/pageSetting/pageList' }">站点</el-breadcrumb-item>
      <el-breadcrumb-item>编辑优惠券模块</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="v-wrap listWrap"  v-loading="mainLoading">
      <div>
        <h3 class="v-title">编辑优惠券模块</h3>
      </div>
      <el-form :model="formData" :rules="formRules" ref="formDataRef" label-width="80px" class="v-form detailForm" @submit.native.prevent>
        <el-form-item label="模块名称" prop="title">
          <el-input v-model="formData.title" :maxlength="50"> </el-input>
        </el-form-item>
        <el-form-item label="样式" prop="style">
          <div class="styleItem">
            <el-radio v-model="formData.style" :label="2">滑动</el-radio>
            <img src="./assets/goods2.png" alt="">
          </div>
          <div class="styleItem">
            <el-radio v-model="formData.style" :label="1">一行一个</el-radio>
            <img src="./assets/goods-round.png" alt="">
          </div>
        </el-form-item>
      </el-form>
      <div class="detailTable">
        <el-row class="btn-Wrap">
          <el-button icon="el-icon-plus" @click="toShowDialog">添加优惠券</el-button>
        </el-row>
        <el-table :data="listData" style="width: 100%">
          <el-table-column align="center" prop="couponSn" label="优惠券号"> </el-table-column>
          <el-table-column align="center" prop="couponName" label="优惠券名称"> </el-table-column>
          <el-table-column align="center" prop="couponType" label="优惠券类型" width="100px">
            <template slot-scope="scope">
              <span v-if="scope.row.couponType === 0">满减券</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="发放主体" width="100px">
            <template slot-scope="scope">
              <span>{{scope.row.couponMainType ? `${scope.row.shopName || '店铺'}` : '平台'}}</span>
            </template>
          </el-table-column>
          <el-table-column align="left" header-align="center" label="发放时间" width="174px">
            <template slot-scope="scope">
              {{$moment(scope.row.grantStartTime).format('YYYY-MM-DD HH:ss:mm')}} ~ {{$moment(scope.row.grantEndTime).format('YYYY-MM-DD HH:ss:mm')}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="状态" width="70px">
            <template slot-scope="scope">
              <span v-if="scope.row.status === 1">未开始</span>
              <span v-if="scope.row.status === 2">进行中</span>
              <span v-if="scope.row.status === 4">已结束</span>
              <span v-if="scope.row.status === 8">已停止</span>
              <span v-if="scope.row.status === 16">已撤回</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="120px">
            <template slot-scope="scope">
              <span class="v-blue v-text-cursor" @click="toShowDetail(scope.row.couponSn)">查看</span>
              <i class="v-blue v-separator">|</i>
              <span class="v-red v-text-cursor" @click="toDelete(scope.$index)">删除</span>
            </template>
          </el-table-column>
        </el-table>
        <el-row class="submitBtnWrap">
          <el-button  type="primary" :loading="saveLoading" @click="toSaveData">保存</el-button>
        </el-row>
      </div>
    </div>
    <!-- 选择优惠券弹窗 -->
    <CouponChoose v-model="dialogInfo.showDialog" :chooseId="dialogInfo.chooseId" @success="saveChoose"/>
  </div>
</template>

<script>
import CouponChoose from './components/CouponChoose'
export default {
  name: 'CouponEdit',
  components: {CouponChoose},
  data () {
    return {
      pageModuleContentId: this.$route.query.pageModuleContentId, // 模板id
      falsePageModuleContentId: this.$route.query.falsePageModuleContentId, // 模板虚拟id
      pagesToken: this.$route.query.pagesToken, // 页面虚拟id
      pageId: this.$route.query.pageId, // 页面id
      mainLoading: false, // 总加载
      saveLoading: false, // 保存
      formData: { // 表单请求数据
        title: '', // 模块标题
        style: 2 // 样式
      },
      formRules: {
        title: [{required: true, message: '请输入模块名称', trigger: 'blur'}],
        style: [{required: true, message: '请选择样式', trigger: 'change'}]
      },
      listData: [], // 选中的优惠券数据
      // 选择优惠券弹窗数据
      dialogInfo: {
        showDialog: false, // 是否打开商品选择器弹窗
        chooseId: '' // 选中的优惠券的号码
      }
    }
  },
  created () {
    let oldInfo = sessionStorage.getItem(`coupon${this.falsePageModuleContentId}_${this.pageModuleContentId}`)
    if (oldInfo) {
      this.getSaveDetail()
    } else {
      this.getDetail()
    }
  },
  methods: {
    // 获得详情
    async getDetail () {
      this.mainLoading = true
      let reqData = {
        pagesToken: this.pagesToken,
        falsePageModuleContentId: this.falsePageModuleContentId,
        pageModuleContentId: this.pageModuleContentId
      }
      let res = await this.$post('pagemodulecontent/getFalsePageModuleContentInfo.do', reqData)
      this.mainLoading = false
      if (parseInt(res.code) === 1) {
        if (res.data.pageModuleContent) {
          this.formData.title = res.data.pageModuleContent.title || ''
          if (res.data.pageModuleContent.dataConfig) {
            this.formData.style = res.data.pageModuleContent.dataConfig.style || 2
            this.listData = res.data.pageModuleContent.dataConfig.config || []
          }
        }
      } else {
        this.$message.error(res.message)
      }
    },
    // 获取去优惠券详情之前的页面保存的信息
    getSaveDetail () {
      let oldInfo = JSON.parse(sessionStorage.getItem(`coupon${this.falsePageModuleContentId}_${this.pageModuleContentId}`))
      sessionStorage.removeItem(`coupon${this.falsePageModuleContentId}_${this.pageModuleContentId}`)
      this.formData = oldInfo.formData
      this.listData = oldInfo.listData
    },
    // 保存数据
    toSaveData () {
      this.$refs.formDataRef.validate(async valid => {
        if (!valid) {
          if (!this.formData.title || this.formData.title) {
            this.$message.error('请输入模块名称')
          }
          return false
        }
        if (!this.listData.length) {
          this.$message.error('请添加商品')
          return false
        }
        // 下面保存
        let config = []
        this.listData.map(item => {
          let obj = {
            couponSn: item.couponSn
          }
          config.push(obj)
        })
        let req = {
          pageModuleContentId: this.pageModuleContentId,
          falsePageModuleContentId: this.falsePageModuleContentId,
          pagesToken: this.pagesToken,
          moduleType: 6, // 0:首页  1:图片编辑 2:商品编辑 3:导航编辑 4:拼团编辑 5:秒杀编辑
          title: this.formData.title,
          dataConfig: JSON.stringify({
            style: this.formData.style,
            config: config
          })
        }
        this.saveLoading = true
        let res = await this.$post('pagemodulecontent/falseEdit.do', req)
        this.saveLoading = false
        if (parseInt(res.code) === 1) {
          this.$message.success('保存成功')
          setTimeout(async () => {
            let obj = {
              pagesToken: this.pagesToken,
              moduleTitle: this.formData.title,
              falsePageModuleContentId: this.falsePageModuleContentId
            }
            await this.$store.dispatch('SetPageEditInfo', obj)
            this.$router.go(-1)
            // this.$router.push(`/siteModule/pageSetting/pageEdit?pageId=${this.pageId}&pagesToken=${this.pagesToken}&moduleTitle=${this.formData.title}`)
          })
        } else {
          this.$message.error(res.message)
        }
      })
    },

    // 显示添加的选择商品弹窗
    toShowDialog () {
      let goodsArr = []
      this.listData.map(item => {
        goodsArr.push(item.couponSn)
      })
      this.dialogInfo.chooseId = goodsArr.join(',')
      this.dialogInfo.showDialog = true
    },
    // 获得选中的商品数组
    saveChoose (couponSnArr, couponArr) {
      // this.listData = this.listData.concat(couponArr)
      this.getListById(couponSnArr.join(','))
    },
    // 通过ids 获得商品列表
    async getListById (couponSns) {
      let reqData = {
        couponSns,
        currentPage: 1,
        showCount: 100000
      }
      let res = await this.$post('selector/goSelectCoupon.do', reqData)
      if (parseInt(res.code) === 1) {
        let oldArr = [...this.listData]
        this.listData.length = 0
        res.data.couponArray.map(item => {
          // item.sort = ''
          let isSame = false
          oldArr.map(oldItem => {
            if (item.couponSn === oldItem.couponSn) {
              isSame = true
              this.listData.push(oldItem)
              return false
            }
          })
          if (!isSame) {
            this.listData.push(item)
          }
        })
        // this.listData.sort(this.compare('sort'))
        this.$emit('getList', this.listData)
      } else {
        this.$message.error(res.message)
      }
    },
    // 删除
    toDelete (index) {
      this.listData.splice(index, 1)
      this.$emit('getList', this.listData)
    },
    // 查看
    toShowDetail (couponSn) {
      let info = {
        listData: this.listData,
        formData: this.formData
      }
      sessionStorage.setItem(`coupon${this.falsePageModuleContentId}_${this.pageModuleContentId}`, JSON.stringify(info))
      this.$router.push(`/marketingModule/couponModule/couponDetail?couponSn=${couponSn}`)
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import '~@/styles/common.scss';
  .detailForm{
    width: 660px;
  }
  .detailTable {
    width: 900px;
    line-height: 24px;
    .el-table {
      border: 1px solid $border-base;
      border-bottom: none
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
  }
  .submitBtnWrap{
    margin: 40px 0;
    text-align: center;
  }
  .styleItem{
    display: inline-block;
    margin-right: 20px;
    min-height: 150px;
    img{
      border: 1px solid $border-base;
      display: block;
      width: 260px;
      /*height: 100px;*/
    }
  }
</style>
