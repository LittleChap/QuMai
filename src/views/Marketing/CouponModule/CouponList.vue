<!-- 优惠券列表 -->
<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>运营</el-breadcrumb-item>
      <el-breadcrumb-item>优惠券管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="v-wrap listWrap">
      <div>
        <h3 class="v-title">优惠券管理</h3>
      </div>
      <el-form :model="formData" label-width="90px" class="v-form v-form-bg" @submit.native.prevent>
        <el-row>
          <el-col :span="6">
            <el-form-item label="优惠券名称" >
              <el-input v-model="formData.couponName" :maxlength="10" @keyup.enter.native="toSearch"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="优惠券号" >
              <el-input v-model="formData.couponSn" :maxlength="50" @keyup.enter.native="toSearch"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发放时间" >
              <el-date-picker v-model="formData.timeArr" style="width: 69% " type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="发放主体" >
              <el-select v-model="formData.mainType" placeholder="请选择">
                <el-option label="全部" value="" > </el-option>
                <el-option label="店铺" :value="1" > </el-option>
                <el-option label="平台" :value="0" > </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="发放类型" >
              <el-select v-model="formData.grantType" placeholder="请选择">
                <el-option label="全部" value="" > </el-option>
                <el-option label="领取发放" :value="7" > </el-option>
                <el-option label="线下发放" :value="512" > </el-option>
                <!--<el-option label="注册发放" :value="8" > </el-option>
                <el-option label="小游戏" :value="16" > </el-option>
                <el-option label="支付送券" :value="32" > </el-option>
                <el-option label="购买指定商品" :value="64" > </el-option>
                <el-option label="指定会员" :value="128" > </el-option>-->
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态" >
              <el-select v-model="formData.status" placeholder="请选择">
                <el-option label="全部状态" value="" > </el-option>
                <el-option label="未开始" :value="1" > </el-option>
                <el-option label="进行中" :value="2" > </el-option>
                <el-option label="已结束" :value="4" > </el-option>
                <el-option label="已停止" :value="8" > </el-option>
                <el-option label="已撤回" :value="16" > </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="toSearch">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="detailTable">
        <el-row class="btn-Wrap">
          <router-link :to="`/marketingModule/couponModule/couponEdit?couponSn=`">
            <el-button icon="el-icon-plus" type="primary" plain>新增</el-button>
          </router-link>
          <el-button icon="el-icon-minus" type="warning" plain @click="toAllDelete" >删除</el-button>
          <el-button type="danger" plain @click="toStop">停止发放</el-button>
          <el-button type="warning" plain @click="toRevoke">停止发放并撤回</el-button>
        </el-row>
        <el-table :data="listData" v-loading="mainLoading" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column align="center" type="selection" width="55"> </el-table-column>
          <el-table-column align="center" prop="couponSn" label="优惠券号" min-width="120px"> </el-table-column>
          <el-table-column align="center" prop="couponName" label="优惠券名称" min-width="120px"> </el-table-column>
          <el-table-column align="center" prop="grantMain" label="发放主体" width="100px"> </el-table-column>
          <el-table-column align="center" prop="grantType" label="发放类型" width="120px">
            <template slot-scope="scope">
              <!--发放类型 领取发放 (  1：所有会员均可领（领取发放，用于卖家中心） 2：根据会员等级领取（领取发放） 4：使用积分兑换（领取发放）) 8：注册发放; 16：小游戏 32：支付送券; 64：购买指定商品; 128：指定会员-->
              <span v-if="scope.row.grantType === 1 || scope.row.grantType === 2 || scope.row.grantType === 4">领取发放</span>
              <span v-else-if="scope.row.grantType === 8">注册发放</span>
              <span v-else-if="scope.row.grantType === 16">小游戏</span>
              <span v-else-if="scope.row.grantType === 32">支付送券<br>（门槛{{scope.row.grantPayThreshold}}元）</span>
              <span v-else-if="scope.row.grantType === 64">购买指定商品</span>
              <span v-else-if="scope.row.grantType === 128">指定会员</span>
              <span v-else-if="scope.row.grantType === 512">线下发放</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="priceDiscount" label="面值" width="80px"> </el-table-column>
          <el-table-column align="center" prop="grantNum" label="发放数量" width="80px"> </el-table-column>
          <el-table-column align="center" prop="receiveNum" label="领取数量" width="80px"> </el-table-column>
          <el-table-column align="center" prop="useNum" label="使用数量" width="80px"> </el-table-column>
          <el-table-column align="center" prop="consumeNum" label="核销数量" width="80px"> </el-table-column>
          <!--<el-table-column align="center" prop="giveNum" label="分享次数" width="80px"> </el-table-column>-->
          <el-table-column align="left" header-align="center" prop="shopName" label="发放时间" width="174px">
            <template slot-scope="scope">
              {{$moment(scope.row.grantStartTime).format('YYYY-MM-DD HH:ss:mm')}} ~ {{$moment(scope.row.grantEndTime).format('YYYY-MM-DD HH:ss:mm')}}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="shopName" label="状态" width="100px">
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
              <router-link :to="`/marketingModule/couponModule/couponEdit?couponSn=${scope.row.couponSn}`"  v-if="scope.row.status === 1 && scope.row.grantMain === '平台'"> <span class="v-blue v-text-cursor" >编辑</span> </router-link>
              <router-link :to="`/marketingModule/couponModule/couponDetail?couponSn=${scope.row.couponSn}`" v-else> <span class="v-blue v-text-cursor" >查看</span> </router-link>
              <i class="v-blue v-separator" v-if="scope.row.status !== 2 && scope.row.grantMain === '平台'">|</i>
              <span class="v-red v-text-cursor" v-if="scope.row.status !== 2 && scope.row.grantMain === '平台'" @click="toSingleDelete(scope.row)">删除</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
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
  name: 'coupon-list',
  data () {
    return {
      formData: {
        couponName: '', // 优惠券号
        couponSn: '', // 优惠券名称
        timeArr: [],
        grantStartTime: '', // 发放时间最小值
        grantEndTime: '', // 发放时间最大值
        grantType: '', // 发放类型
        status: '', // 状态 1：未开始 2：进行中 4：已结束  8：已停止 16：已撤回
        mainType: '' // 发放主体类型  0：平台 1：店铺
      },
      pageInfo: {
        currentPage: 1,
        showCount: 20,
        totalResult: 0
      },
      listData: [], // 列表数据
      mainLoading: false, // 列表的加载
      multiSelect: []
    }
  },
  created () {
    this.getList()
  },
  methods: {
    // 获得列表
    async getList () {
      this.mainLoading = true
      let reqData = Object.assign({}, this.pageInfo, this.formData)
      reqData.grantStartTime = reqData.timeArr && reqData.timeArr.length ? reqData.timeArr[0] : ''
      reqData.grantEndTime = reqData.timeArr && reqData.timeArr.length ? reqData.timeArr[1] : ''
      delete reqData.totalResult
      delete reqData.timeArr
      let res = await this.$post('couponFullcut/list.do', reqData)
      this.mainLoading = false
      if (parseInt(res.code) === 1) {
        this.listData = res.data.couponArray
        this.pageInfo.totalResult = res.data.totalResult
      }
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
    },
    // 单个删除
    toSingleDelete (data) {
      // if (data.status === 2) {
      //   this.$message.error('请停止秒杀活动后再执行删除操作')
      //   return false
      // }
      let couponSnArray = []
      couponSnArray.push({couponSn: data.couponSn})
      this.deleteData(couponSnArray, true)
    },
    // 多个删除
    toAllDelete () {
      if (!this.multiSelect || !this.multiSelect.length) {
        this.$message.error('请选择数据')
        return false
      }
      let couponSnArray = []
      let hasActivity = false
      this.multiSelect.map(item => {
        if (item.status === 2) {
          hasActivity = true
          return
        }
        couponSnArray.push({
          couponSn: item.couponSn
        })
      })
      if (hasActivity) {
        this.$message.error('请停止优惠券活动后再执行该操作')
        return false
      }
      this.deleteData(couponSnArray, false)
    },
    // 删除数据
    deleteData (couponSnArray, one) {
      let text = one ? '确认删除此优惠券？' : `确认删除这 ${couponSnArray.length} 个优惠券？`
      this.$confirm(text, '确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '删除中...'
            let res = await this.$post('couponFullcut/delete.do', {couponSnArray: JSON.stringify(couponSnArray)})
            instance.confirmButtonLoading = false
            instance.confirmButtonText = '确定'
            if (parseInt(res.code) === 1) {
              this.$message.success('删除成功')
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
    },
    // 停止活动
    toStop () {
      if (!this.multiSelect || !this.multiSelect.length) {
        this.$message.error('请选择数据')
        return false
      }
      let couponSnArray = []
      let hasActivity = false
      this.multiSelect.map(item => {
        if (item.status !== 2) {
          hasActivity = true
          return
        }
        couponSnArray.push({
          couponSn: item.couponSn
        })
      })
      if (hasActivity) {
        this.$message.error('只有进行中的活动才可执行该操作')
        return false
      }
      this.$confirm('停止发放将会停止活动，但已发放的优惠券不追回，确定执行此操作？', '确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '执行中...'
            let res = await this.$post('couponFullcut/stop.do', {couponSnArray: JSON.stringify(couponSnArray)})
            instance.confirmButtonLoading = false
            instance.confirmButtonText = '确定'
            if (parseInt(res.code) === 1) {
              this.$message.success('停止成功')
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
    },
    //  停止发放并撤回
    toRevoke () {
      if (!this.multiSelect || !this.multiSelect.length) {
        this.$message.error('请选择数据')
        return false
      }
      let couponSnArray = []
      let hasActivity = false
      this.multiSelect.map(item => {
        if (item.status !== 2) {
          hasActivity = true
          return
        }
        couponSnArray.push({
          couponSn: item.couponSn
        })
      })
      if (hasActivity) {
        this.$message.error('只有进行中的活动才可执行该操作')
        return false
      }
      this.$confirm('停止发放并撤回将会撤回所有已发优惠券并停止活动，确定执行此操作？', '确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '执行中...'
            let res = await this.$post('couponFullcut/revoke.do', {couponSnArray: JSON.stringify(couponSnArray)})
            instance.confirmButtonLoading = false
            instance.confirmButtonText = '确定'
            if (parseInt(res.code) === 1) {
              this.$message.success('停止成功')
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
</style>
