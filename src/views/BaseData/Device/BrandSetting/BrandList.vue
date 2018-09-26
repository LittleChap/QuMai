<template>
  <div class="v-wrap brandListWrap">
    <div>
      <h3 class="v-title">品牌设置</h3>
    </div>
    <el-row class="btnBox">
      <router-link to="/baseData/device/brandDetail?brandId=-1">
        <el-button type="primary" class="v-button" icon="el-icon-plus">新 增</el-button>
      </router-link>
      <el-button type="danger" class="v-button" icon="el-icon-delete" @click="allDelete">批量删除</el-button>
    </el-row>
    <el-table
      v-loading="mainLoading"
      class="listTable"
      :data="listData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        label="ID"
        align="center"
        width="80"
        prop="id">
      </el-table-column>
      <el-table-column
        prop="name"
        align="center"
        label="品牌名称">
      </el-table-column>
      <el-table-column
        prop="country"
        label="所属国家"
        align="center">
      </el-table-column>
      <el-table-column
        prop="modelNums"
        label="型号数量"
        width="100"
        align="center">
        <template slot-scope="scope">
          <router-link v-if="scope.row.modelNums" :to="`/baseData/device/modelList?brandName=${scope.row.name}`"><el-button type="text">{{scope.row.modelNums}}</el-button></router-link>
          <span v-else>{{scope.row.modelNums}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        align="center"
        label="创建时间">
        <template slot-scope="scope">
          <span v-if="scope.row.createTime">{{$moment(scope.row.createTime).format('YYYY-MM-DD')}}</span>
          <span v-else> - </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="modifyTime"
        align="center"
        label="最后修改时间">
        <template slot-scope="scope">
          <span v-if="scope.row.modifyTime">{{$moment(scope.row.modifyTime).format('YYYY-MM-DD')}}</span>
          <span v-else> - </span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作">
        <template slot-scope="scope">
          <router-link :to="`/baseData/device/brandDetail?brandId=${scope.row.id}`"> <el-button size="small" type="primary" plain icon="el-icon-edit">编辑</el-button> </router-link>
          <el-button size="small" type="danger" plain icon="el-icon-delete" @click="singeDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pageBox" v-if="pageInfo.totalResult">
      <el-pagination
        :current-page.sync="pageInfo.currentPage"
        :page-size="pageInfo.showCount"
        layout=" prev, pager, next, jumper"
        @current-change="handleCurrentChange"
        :total="pageInfo.totalResult">
      </el-pagination>
    </div>

  </div>

</template>

<script>
export default {
  name: 'brand-list',
  data () {
    return {
      mainLoading: false,
      pageInfo: {
        currentPage: 1,
        showCount: 20,
        totalResult: 0
      },
      listData: [],
      multiSelect: [] // 选中的数据
    }
  },
  created () {
    this.getList()
  },
  methods: {
    async getList () {
      let data = {
        currentPage: this.pageInfo.currentPage,
        showCount: this.pageInfo.showCount
      }
      this.mainLoading = true
      let res = await this.$post('deviceBrand/getDeviceBrandList.do', data)
      if (parseInt(res.code) === 1) {
        this.listData = res.data.deviceBrandList
        this.pageInfo.totalResult = res.data.page.totalResult || 0
        this.mainLoading = false
      } else {
        this.mainLoading = false
        this.$message.error(res.message)
      }
    },
    singeDelete (id) {
      this.$confirm('是否确认删除？', '确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteData(id)
      }).catch(() => {
        return false
      })
    },
    allDelete () {
      if (!this.multiSelect.length) {
        this.$message.error('请选择数据')
        return false
      }
      this.$confirm('是否确认删除？', '确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let idArray = []
        this.multiSelect.map(item => {
          idArray.push(item.id)
        })
        this.deleteData(idArray.join(';'))
      }).catch(() => {
        return false
      })
    },
    async deleteData (ids) {
      let reqData = {
        data_ids: ids
      }
      let res = await this.$post('deviceBrand/deleteDeviceBrands.do', reqData)
      if (parseInt(res.code) === 1) {
        this.$message.success('删除成功')
        this.getList()
      } else {
        this.$message.error(res.message)
      }
    },
    handleSelectionChange (data) {
      this.multiSelect = data
    },
    handleCurrentChange (val) {
      this.pageInfo.currentPage = val
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped rel="stylesheet/scss">
  @import '~@/styles/common.scss';
  .brandListWrap{
    .btnBox{
      margin: 10px 0 20px;
    }
    .listTable{
      margin: 20px 0 ;
    }
    .pageBox{
      text-align: center;
      margin: 20px 30px;
    }
  }

</style>
