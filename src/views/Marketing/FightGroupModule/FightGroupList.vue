<!-- 拼团列表 -->
<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>运营</el-breadcrumb-item>
      <el-breadcrumb-item>拼团管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="v-wrap listWrap">
      <div>
        <h3 class="v-title">拼团管理</h3>
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
          <el-table-column align="center" prop="goodsName" label="商品名称" min-width="250px">
            <template slot-scope="scope">
              <div class="goodsBox">
                <img :src="scope.row.goodsImage">
                <h4 class="textName">{{scope.row.goodsName}}</h4>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="shopName" label="店铺" width="120px"> </el-table-column>
          <el-table-column align="center" prop="groupMemberNum" label="成团人数" width="90px"> </el-table-column>
          <el-table-column align="center" prop="groupSuccessTime" label="成团时间" width="90px"> </el-table-column>
          <el-table-column align="center" prop="groupPriceMin" label="拼团价" width="100px">
            <template slot-scope="scope">
              <span>{{scope.row.groupPriceMin}}</span> <span v-if="scope.row.groupPriceMin !== scope.row.groupPriceMax"> ~ {{scope.row.groupPriceMax}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="groupSaleNum" label="活动销量" width="100px"> </el-table-column>
          <el-table-column align="center" prop="store" label="库存" width="100px"> </el-table-column>
          <el-table-column align="left" header-align="center"  label="活动时间" width="174px">
            <template slot-scope="scope">
              {{$moment(scope.row.groupStartTime).format('YYYY-MM-DD HH:ss:mm')}} ~{{$moment(scope.row.groupEndTime).format('YYYY-MM-DD HH:ss:mm')}}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="shopName" label="凑团" width="80px">
            <template slot-scope="scope">
              <!-- isGatherFalseGroup  0:否  1:是  -->
              <el-switch :inactive-value="0" :active-value="1" v-model="scope.row.isGatherFalseGroup" @change="toShowGroup(scope.row)"> </el-switch>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="groupStatus" label="状态" width="80px">
            <template slot-scope="scope">
              <span v-if="scope.row.groupStatus === 1">未开始</span>
              <span v-if="scope.row.groupStatus === 2">进行中</span>
              <span v-if="scope.row.groupStatus === 4">已结束</span>
              <span v-if="scope.row.groupStatus === 8">已停止</span>
              <span v-if="scope.row.groupStatus === 16">预热中</span>
              <span v-if="scope.row.groupStatus === 32">留场中</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="180px">
            <template slot-scope="scope">
              <span class="v-blue v-text-cursor" @click="toExtension(scope.row, scope.row.groupId)">推广</span> <i class="v-blue v-separator">|</i>
              <span class="v-blue v-text-cursor" v-if="scope.row.groupStatus === 1 || scope.row.groupStatus === 16" @click="toSetActive(scope.row, false)">设置</span>
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
    <!-- 拼团设置弹窗 -->
    <SettingActivityDialog  v-model="chooseInfo.showSettingDialog" :isOnlyReady="chooseInfo.isOnlyReady" :groupId="chooseInfo.groupId" :chooseGoodsList="chooseInfo.goodsList"  @success="settingSuccess"/>
    <!-- 推广弹窗 -->
    <ExtensionDialog v-model="extensionInfo.showDialog" :infoData="extensionInfo.infoData"/>
    <!-- 凑团设置弹窗 -->
    <SettingToGroupDialog v-model="toGroupInfo.showDialog" :groupId="toGroupInfo.itemData.groupId" :maxNum="toGroupInfo.itemData.groupMemberNum" @confirm="toSaveSetToGroup"/>
  </div>
</template>

<script>
import ProductChoose from '@/components/ProductChoose'
import ExtensionDialog from '@/components/ExtensionDialog'
import SettingActivityDialog from './components/SettingActivityDialog'
import SettingToGroupDialog from './components/SettingToGroupDialog'
export default {
  name: 'fight-group-list',
  components: {ProductChoose, ExtensionDialog, SettingActivityDialog, SettingToGroupDialog},
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
        showSettingDialog: false, // 是否显示 拼团设置弹窗
        groupId: null, // 要修改的 拼团id
        isOnlyReady: false // 是否只读
      },
      // 推广弹窗数据
      extensionInfo: {
        showDialog: false,
        infoData: {}
      },
      // 凑团设置弹窗数据
      toGroupInfo: {
        showDialog: false,
        itemData: {}
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
      let res = await this.$post('group/list.do', this.pageInfo)
      this.mainLoading = false
      if (parseInt(res.code) === 1) {
        res.data.groupArray.map(item => {
          if (!item.sort && item.sort !== 0) {
            item.sort = ''
          }
          item.oldSort = item.sort
        })
        this.listData = res.data.groupArray
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
        groupId: item.groupId,
        sort: item[itemName]
      }
      let res = await this.$post('group/editSort.do', reqData)
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
      this.chooseInfo.groupId = data.groupId
      this.chooseInfo.goodsList = []
      this.chooseInfo.showSettingDialog = true
      this.chooseInfo.isOnlyReady = isRead
    },
    // 保存选中的商品
    saveChooseGoods (goodsIdArr, goodsArray) {
      console.log('商品数据', JSON.stringify(goodsArray))
      this.chooseInfo.goodsList = goodsArray
      this.chooseInfo.groupId = null
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
      if (data.groupStatus === 2) {
        this.$message.error('请停止拼团活动后再执行删除操作')
        return false
      }
      let groupIdArray = []
      groupIdArray.push({groupId: data.groupId})
      this.deleteData(groupIdArray, true)
    },
    // 多个删除
    toAllDelete () {
      if (!this.multiSelect || !this.multiSelect.length) {
        this.$message.error('请选择数据')
        return false
      }
      let groupIdArray = []
      let hasActivity = false
      this.multiSelect.map(item => {
        if (item.groupStatus === 2) {
          hasActivity = true
          return
        }
        groupIdArray.push({
          groupId: item.groupId
        })
      })
      if (hasActivity) {
        this.$message.error('请停止拼团活动后再执行该操作')
        return false
      }
      this.deleteData(groupIdArray, false)
    },
    // 删除数据
    deleteData (groupIdArray, one) {
      let text = one ? '确认删除这个拼团活动？' : `确认删除这 ${groupIdArray.length} 个拼团活动？`
      this.$confirm(text, '确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '删除中...'
            let res = await this.$post('group/del.do', {groupIdArray: JSON.stringify(groupIdArray)})
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
      let groupIdArray = []
      let hasActivity = false
      this.multiSelect.map(item => {
        if (item.groupStatus !== 2) {
          hasActivity = true
          return
        }
        groupIdArray.push({
          groupId: item.groupId
        })
      })
      if (hasActivity) {
        this.$message.error('只有进行中的活动才可执行该操作')
        return false
      }
      this.$confirm('停止活动将会关闭所有待成团订单并设置拼团活动时间过期，确定执行此操作？', '确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '执行中...'
            let res = await this.$post('group/stop.do', {groupIdArray: JSON.stringify(groupIdArray)})
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
    async toExtension (item, groupId) {
      if (item.extensionInfo) {
        this.extensionInfo.infoData = item.extensionInfo
        this.extensionInfo.showDialog = true
        return false
      }
      let res = await this.$post('group/detailExtension.do', {groupId})
      if (parseInt(res.code) === 1) {
        item.extensionInfo = res.data
        this.extensionInfo.infoData = res.data
        this.extensionInfo.showDialog = true
      } else {
        this.$message.error(res.message)
      }
    },
    // 显示 设置凑团
    toShowGroup (item) {
      item.isGatherFalseGroup = item.isGatherFalseGroup === 0 ? 1 : 0
      this.toGroupInfo.showDialog = true
      this.toGroupInfo.itemData = item
    },
    // 保存设置 凑团
    toSaveSetToGroup (val) {
      this.toGroupInfo.itemData.isGatherFalseGroup = val
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
