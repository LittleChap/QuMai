<!--扫码有礼列表-->
<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>运营</el-breadcrumb-item>
      <el-breadcrumb-item>扫码有礼管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="v-wrap listWrap">
      <div>
        <h3 class="v-title">扫码有礼管理</h3>
      </div>
      <el-form :model="formData" label-width="90px" class="v-form v-form-bg" @submit.native.prevent>
        <el-row>
          <el-col :span="6">
            <el-form-item label="活动名称">
              <el-input v-model="formData.activityName" :maxlength="10" @keyup.enter.native="toSearch"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="活动时间">
              <el-date-picker v-model="formData.timeArr" style="width: 69% " type="datetimerange"
                              value-format="yyyy-MM-dd HH:mm:ss" range-separator="至" start-placeholder="开始日期"
                              end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="状态">
              <el-select v-model="formData.status" placeholder="请选择">
                <el-option label="全部状态" value=""> </el-option>
                <el-option label="未开始" :value="0"> </el-option>
                <el-option label="进行中" :value="1"> </el-option>
                <el-option label="已结束" :value="2"> </el-option>
                <el-option label="已停止" :value="3"> </el-option>
                <!--<el-option label="已撤回" :value="16"> </el-option>-->
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
          <router-link to="/marketingModule/scanGiftModule/scanGiftEdit">
            <el-button icon="el-icon-plus" type="primary" plain>添加</el-button>
          </router-link>
          <el-button icon="el-icon-minus" type="warning" plain @click="toAllDelete">删除</el-button>
          <el-button type="danger" plain @click="toStop">停止活动</el-button>
        </el-row>
        <el-table :data="listData" v-loading="mainLoading" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column align="center" type="selection" width="55"> </el-table-column>
          <el-table-column align="center" prop="activityName" label="活动名称" > </el-table-column>
          <el-table-column align="center" prop="totalOrderPrice" label="订单实付金额" width="120px"> </el-table-column>
          <el-table-column align="center" prop="totalOrderNum" label="付款订单数" width="100px"> </el-table-column>
          <el-table-column align="center" prop="activityRangeType" label="店铺">
            <template slot-scope="scope">
              <!--activityRangeType  0：全部店铺 1：指定店铺-->
              <span v-if="scope.row.activityRangeType === 0">全部店铺</span>
              <div v-if="scope.row.activityRangeType === 1">
                <span class="shopNameText" v-for="(item, i) in scope.row.shopArray" :key="i">{{item.shopName}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="left" header-align="center" prop="shopName" label="活动有效期" width="174px">
            <template slot-scope="scope">
              {{$moment(scope.row.grantStartTime).format('YYYY-MM-DD HH:ss:mm')}} ~
              {{$moment(scope.row.grantEndTime).format('YYYY-MM-DD HH:ss:mm')}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="状态" width="100px">
            <template slot-scope="scope">
              <!--0：未开始 1：进行中 2：已结束  3：已停止-->
              <span v-if="scope.row.status === 0">未开始</span>
              <span v-if="scope.row.status === 1">进行中</span>
              <span v-if="scope.row.status === 2">已结束</span>
              <span v-if="scope.row.status === 3">已停止</span>
              <!--<span v-if="scope.row.status === 16">已撤回</span>-->
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="120px">
            <template slot-scope="scope">
              <router-link :to="`/marketingModule/scanGiftModule/scanGiftEdit?activityId=${scope.row.activityId}`" v-if="scope.row.status === 0"><span class="v-blue v-text-cursor">编辑</span></router-link>
              <router-link :to="`/marketingModule/scanGiftModule/scanGiftDetail?activityId=${scope.row.activityId}`" v-else> <span class="v-blue v-text-cursor">查看</span></router-link>
              <i class="v-blue v-separator" v-if="scope.row.status !== 1 ">|</i>
              <span class="v-red v-text-cursor" v-if="scope.row.status !== 1" @click="toSingleDelete(scope.row)">删除</span>
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
  name: 'scan-gift-list',
  data () {
    return {
      formData: {
        activityName: '', // 活动名称
        timeArr: [], // 活动时间
        startTime: '', // 活动开始时间
        endTime: '', // 活动结束时间
        status: '' // 状态 0：未开始 1：进行中 2：已结束  3：已停止
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
      reqData.startTime = reqData.timeArr && reqData.timeArr.length ? reqData.timeArr[0] : ''
      reqData.endTime = reqData.timeArr && reqData.timeArr.length ? reqData.timeArr[1] : ''
      delete reqData.totalResult
      delete reqData.timeArr
      let res = await this.$post('scanActivity/list.do', reqData)
      this.mainLoading = false
      if (parseInt(res.code) === 1) {
        this.listData = res.data.activityArray
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
      let activityIdArray = []
      activityIdArray.push({activityId: data.activityId})
      this.deleteData(activityIdArray, true)
    },
    // 多个删除
    toAllDelete () {
      if (!this.multiSelect || !this.multiSelect.length) {
        this.$message.error('请选择数据')
        return false
      }
      let activityIdArray = []
      let hasActivity = false
      this.multiSelect.map(item => {
        if (item.status === 1) {
          hasActivity = true
          return
        }
        activityIdArray.push({
          activityId: item.activityId
        })
      })
      if (hasActivity) {
        this.$message.error('进行中的活动不可删除！')
        return false
      }
      this.deleteData(activityIdArray, false)
    },
    // 删除数据
    deleteData (activityIdArray, one) {
      let text = one ? '确认删除此促销活动？' : `确认删除这 ${activityIdArray.length} 个促销活动？`
      this.$confirm(text, '确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '删除中...'
            let res = await this.$post('scanActivity/delete.do', {activityIdArray: JSON.stringify(activityIdArray)})
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
      let activityIdArray = []
      let hasActivity = false
      this.multiSelect.map(item => {
        /* 0：未开始 1：进行中2：已结束3：已停止 */
        if (item.status !== 1) {
          hasActivity = true
          return
        }
        activityIdArray.push({
          activityId: item.activityId
        })
      })
      if (hasActivity) {
        this.$message.error('只有进行中的活动才可执行该操作')
        return false
      }
      this.$confirm('确定停止该促销活动？', '确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '执行中...'
            let res = await this.$post('scanActivity/stop.do', {activityIdArray: JSON.stringify(activityIdArray)})
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
  .shopNameText{
    &+.shopNameText{
      &:before{
        content: '、';
      }
    }
  }

</style>
