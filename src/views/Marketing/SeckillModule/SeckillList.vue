<!-- 秒杀列表 -->
<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>运营</el-breadcrumb-item>
      <el-breadcrumb-item>秒杀管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="v-wrap listWrap">
      <div>
        <h3 class="v-title">秒杀管理</h3>
      </div>
      <div class="detailTable">
        <el-row class="btn-Wrap">
          <el-button icon="el-icon-plus" type="primary" plain @click="chooseInfo.showChooseDialog=true">添加</el-button>
          <el-button icon="el-icon-minus" type="warning" plain @click="toAllDelete" >删除</el-button>
          <el-button type="danger" plain @click="toStop">停止活动</el-button>
        </el-row>
        <el-table :data="listData" v-loading="mainLoading" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column align="center" type="selection" width="55"> </el-table-column>
          <el-table-column align="center" prop="title" label="排序" width="100px">
            <template slot-scope="scope">
              <el-input size="mini" v-model="scope.row.sort" :maxlength="4"
                        @input="numberSet(scope.row.sort, scope.row, 'sort')"
                        @blur="blurSort(scope.row.sort, scope.row, 'sort')"> </el-input>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="page_id" label="商品名称" width="260px">
            <template slot-scope="scope">
              <div class="goodsBox">
                <img :src="scope.row.goodsImage">
                <h4 class="textName">{{scope.row.goodsName}}</h4>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="shopName" label="店铺" width="120px"> </el-table-column>
          <el-table-column align="center" prop="shopName" label="秒杀价" width="120px">
            <template slot-scope="scope">
              <span>{{scope.row.seckillPriceMin}}</span> <span v-if="scope.row.seckillPriceMin !== scope.row.seckillPriceMax"> ~ {{scope.row.seckillPriceMax}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="seckillSaleNum" label="活动销量" width="120px"> </el-table-column>
          <el-table-column align="center" prop="seckillStore" label="库存" width="120px"> </el-table-column>
          <el-table-column align="center" prop="shopName" label="活动时间">
            <template slot-scope="scope">
              {{$moment(scope.row.seckillStartTime).format('YYYY-MM-DD HH:ss:mm')}} ~
              {{$moment(scope.row.seckillEndTime).format('YYYY-MM-DD HH:ss:mm')}}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="shopName" label="状态" width="120px">
            <template slot-scope="scope">
              <span v-if="scope.row.seckillStatus === 1">未开始</span>
              <span v-if="scope.row.seckillStatus === 2">进行中</span>
              <span v-if="scope.row.seckillStatus === 4">已结束</span>
              <span v-if="scope.row.seckillStatus === 8">已停止</span>
              <span v-if="scope.row.seckillStatus === 16">预热中</span>
              <span v-if="scope.row.seckillStatus === 32">留场中</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="200px">
            <template slot-scope="scope">
              <span class="v-blue v-text-cursor" @click="toExtension(scope.row, scope.row.seckillId)">推广</span> <i class="v-blue v-separator">|</i>
              <span class="v-blue v-text-cursor" v-if="scope.row.seckillStatus === 1 || scope.row.seckillStatus === 16" @click="toSetActive(scope.row, false)">设置</span>
              <span class="v-blue v-text-cursor" v-else @click="toSetActive(scope.row, true)">查看</span>  <i class="v-blue v-separator">|</i>
              <span class="v-red v-text-cursor" @click="toSingleDelete(scope.row)">删除</span>
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
    <!-- 商品选择器 -->
    <ProductChoose  v-model="chooseInfo.showChooseDialog" saveBtnText="下一步" showActivity @success="saveChooseGoods"/>
    <!-- 秒杀设置弹窗 -->
    <SettingActivityDialog  v-model="chooseInfo.showSettingDialog" :isOnlyReady="chooseInfo.isOnlyReady" :secKillId="chooseInfo.secKillId" :chooseGoodsList="chooseInfo.goodsList"  @success="settingSuccess"/>
    <!-- 推广弹窗 -->
    <ExtensionDialog v-model="extensionInfo.showDialog" :infoData="extensionInfo.infoData"/>
  </div>
</template>

<script>
import ProductChoose from '@/components/ProductChoose'
import ExtensionDialog from '@/components/ExtensionDialog'
import SettingActivityDialog from './components/SettingActivityDialog'
export default {
  name: 'seckill-list',
  components: {ProductChoose, ExtensionDialog, SettingActivityDialog},
  data () {
    return {
      pageInfo: {
        currentPage: 1,
        showCount: 10,
        totalResult: 0
      },
      listData: [], // 列表数据
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
    this.getList()
  },
  methods: {
    // 获得列表
    async getList () {
      this.mainLoading = true
      let res = await this.$post('seckill/list.do', this.pageInfo)
      this.mainLoading = false
      if (parseInt(res.code) === 1) {
        res.data.seckillArray.map(item => {
          if (!item.sort && item.sort !== 0) {
            item.sort = ''
          }
          item.oldSort = item.sort
        })
        this.listData = res.data.seckillArray
        this.pageInfo.totalResult = res.data.totalResult
      }
    },
    // 排序值限制
    numberSet (value, item, itemName, isMoney = false) {
      this.$numInput(value, item, itemName, isMoney, this)
    },
    // 排序鼠标移开
    async blurSort (value, item, itemName) {
      if (!value) {
        item[itemName] = 0 + ''
      }
      if (String(item.oldSort) === String(item[itemName])) {
        return false
      }
      // 保存排序
      let reqData = {
        seckillId: item.seckillId,
        sort: item[itemName]
      }
      let res = await this.$post('seckill/editSort.do', reqData)
      if (parseInt(res.code) === 1) {
        item.oldSort = item[itemName]
      } else {
        this.$message.error(res.message)
        item[itemName] = item.oldSort
      }
      // this.listData.sort(this.compare('sort'))
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
    // 去设置--显示设置弹窗
    toSetActive (data, isRead) {
      this.chooseInfo.secKillId = data.seckillId
      this.chooseInfo.goodsList = []
      this.chooseInfo.showSettingDialog = true
      this.chooseInfo.isOnlyReady = isRead
    },
    // 保存选中的商品
    saveChooseGoods (goodsIdArr, goodsArray) {
      console.log('商品数据', JSON.stringify(goodsArray))
      this.chooseInfo.goodsList = goodsArray
      this.chooseInfo.secKillId = null
      this.chooseInfo.showSettingDialog = true
      this.chooseInfo.isOnlyReady = false
    },
    // 设置成功以后
    settingSuccess () {
      this.getList()
    },
    handleSelectionChange (val) {
      this.multiSelect = val
    },
    // 单个删除
    toSingleDelete (data) {
      if (data.seckillStatus === 2) {
        this.$message.error('请停止秒杀活动后再执行删除操作')
        return false
      }
      let seckillIdArray = []
      seckillIdArray.push({seckillId: data.seckillId})
      this.deleteData(seckillIdArray, true)
    },
    // 多个删除
    toAllDelete () {
      if (!this.multiSelect || !this.multiSelect.length) {
        this.$message.error('请选择数据')
        return false
      }
      let seckillIdArray = []
      let hasActivity = false
      this.multiSelect.map(item => {
        if (item.seckillStatus === 2) {
          hasActivity = true
          return
        }
        seckillIdArray.push({
          seckillId: item.seckillId
        })
      })
      if (hasActivity) {
        this.$message.error('请停止秒杀活动后再执行该操作')
        return false
      }
      this.deleteData(seckillIdArray, false)
    },
    // 删除数据
    deleteData (seckillIdArray, one) {
      let text = one ? '确认删除这个秒杀活动？' : `确认删除这 ${seckillIdArray.length} 个秒杀活动？`
      this.$confirm(text, '确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '删除中...'
            let res = await this.$post('seckill/del.do', {seckillIdArray: JSON.stringify(seckillIdArray)})
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
      let seckillIdArray = []
      let hasActivity = false
      this.multiSelect.map(item => {
        if (item.seckillStatus !== 2) {
          hasActivity = true
          return
        }
        seckillIdArray.push({
          seckillId: item.seckillId
        })
      })
      if (hasActivity) {
        this.$message.error('只有进行中的活动才可执行该操作')
        return false
      }
      this.$confirm('停止活动将会设置秒杀活动时间过期，确定执行此操作？', '确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '执行中...'
            let res = await this.$post('seckill/stop.do', {seckillIdArray: JSON.stringify(seckillIdArray)})
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
    // 去推广
    async toExtension (item, seckillId) {
      if (item.extensionInfo) {
        this.extensionInfo.infoData = item.extensionInfo
        this.extensionInfo.showDialog = true
        return false
      }
      let res = await this.$post('seckill/detailExtension.do', {seckillId})
      if (parseInt(res.code) === 1) {
        item.extensionInfo = res.data
        this.extensionInfo.infoData = res.data
        this.extensionInfo.showDialog = true
      } else {
        this.$message.error(res.message)
      }
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
