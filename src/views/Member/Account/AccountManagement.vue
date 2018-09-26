<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>会员</el-breadcrumb-item>
      <el-breadcrumb-item>会员账号管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="v-wrap listWrap">
      <div>
        <h3 class="v-title">会员账号管理</h3>
      </div>
      <!-- 表单-头 -->
      <el-form :model="formData" label-width="90px" class="v-form v-form-bg" @submit.native.prevent>
        <el-row>
          <el-col :span="10">
            <el-form-item label="注册时间" >
              <el-date-picker v-model="formData.timeArr" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="启用" >
              <el-select v-model="formData.is_open" clearable  placeholder="" filterable>
                <el-option  label="是" :value="1" ></el-option>
                <el-option  label="否" :value="0" ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="会员账号" >
              <el-input v-model="formData.mobile" @keyup.native.enter="toSearch"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5" >
            <el-form-item label="会员昵称" >
              <el-input v-model="formData.nickname" @keyup.native.enter="toSearch"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="会员等级" >
              <el-select v-model="formData.member_level_id" clearable  placeholder="" filterable>
                <el-option  label="普通会员" :value="1" ></el-option>
                <el-option  label="银卡会员" :value="2" ></el-option>
                <el-option  label="金卡会员" :value="3" ></el-option>
                <el-option  label="白金会员" :value="4" ></el-option>
                <el-option  label="钻石会员" :value="5" ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4" :offset="1">
            <div class="btnBox">
              <el-button type="primary" icon="el-icon-search" @click="toSearch">查询</el-button>
              <!-- <el-button type="primary" :loading="excelLoading" icon="el-icon-download"  @click="toExcel">导出</el-button> -->
            </div>
          </el-col>
        </el-row>
      </el-form>
      <!-- 表单-尾 -->
      <!-- 表格-头 -->
      <div class="detailTable">
        <el-table :data="listData" v-loading="mainLoading" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column align="center" type="selection" width="55"> </el-table-column>
          <el-table-column align="center" prop="mobile" label="会员账号" min-width="150px"></el-table-column>
          <el-table-column align="center" prop="nickname" label="会员昵称" min-width="150px">
            <template slot-scope="scope">
              <div class="shopBox">
                <div class="shopImg">
                  <img :src="scope.row.avatar" alt="图片">
                </div>
                <span>{{scope.row.nickname}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="month_login_count" label="本月登陆" min-width="120px"> </el-table-column>
          <el-table-column align="center" prop="level_point" label="积分" min-width="120px"> </el-table-column>
          <el-table-column align="center" prop="consumption_amount" label="消费金额" min-width="120px">
            <template slot-scope="scope">
              ￥{{scope.row.consumption_amount}}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="member_level_str" label="会员等级" min-width="120px"> </el-table-column>
          <el-table-column align="center" label="注册&登陆" min-width="200px">
            <template slot-scope="scope">
              注册时间：{{$moment(scope.row.create_time).format('YYYY-MM-DD HH:ss:mm')}}
              <br>
              最后登录：{{$moment(scope.row.last_login).format('YYYY-MM-DD HH:ss:mm')}}
            </template>
          </el-table-column>
          <el-table-column  label="启用" align='center' width="100">
            <template slot-scope="scope">
              <div class="hotCheck">
                <el-checkbox v-model="scope.row.is_open" @change="toOpen($event, scope.row)"></el-checkbox>
              </div>
            </template>
        </el-table-column>
          <el-table-column align="center" label="操作" width="120px">
            <template slot-scope="scope">
              <span class="v-blue v-text-cursor" @click="toSee(scope.row)">查看</span>
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
    <!-- 会员信息弹出框 -->
    <el-dialog title="会员信息" :visible.sync="dialogShow" width="35%" center class="v-dialog">
      <el-form :model="dialogFormData" label-width="90px" v-loading="dialogFormLoading" class="v-form v-form-bg" @submit.native.prevent size="mini">
        <el-form-item label="会员账号：" >
          <span>{{dialogFormData.mobile}}</span>
        </el-form-item>
        <el-form-item label="会员昵称：" >
          <span>{{dialogFormData.nickname}}</span>
        </el-form-item>
        <el-form-item label="注册时间：" >
          <span>{{$moment(dialogFormData.create_time).format('YYYY-MM-DD HH:ss:mm')}}</span>
        </el-form-item>
        <el-form-item label="会员等级：" >
          <span>{{dialogFormData.member_level_str}}</span>
        </el-form-item>
        <el-form-item label="积分：" >
          <span>￥{{dialogFormData.level_point}}</span>
        </el-form-item>
        <el-form-item label="消费金额：" >
          <span>￥{{dialogFormData.consumption_amount}}</span>
        </el-form-item>
        <el-form-item label="平台币：" >
          <span>{{dialogFormData.consumption_point}}</span>
        </el-form-item>
        <el-form-item label="性别：" >
          <span>{{dialogFormData.sex | sexFilter}}</span>
        </el-form-item>
        <el-form-item label="生日：" >
          <span>{{dialogFormData.birthday}}</span>
        </el-form-item>
        <el-form-item label="状态：" >
          <span>{{dialogFormData.is_open | isOpenFilter}}</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <router-link :to="`/order/order/list?username=${dialogFormData.mobile}`">
          <!-- <el-button type="primary">查看订单</el-button> -->
        </router-link>
        <router-link :to="`/order/after/list?username=${dialogFormData.mobile}`">
          <!-- <el-button type="primary">查看售后单</el-button> -->
        </router-link>
        <el-button type="primary" @click="dialogShow = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'memberAccount-list',
  data () {
    return {
      formData: {
        timeArr: [],
        beginTime: '',
        endTime: '',
        is_open: 1,
        mobile: '',
        member_level_id: 1,
        nickname: ''
      },
      // 弹出框信息
      dialogFormData: {},
      pageInfo: {
        currentPage: 1,
        showCount: 10,
        totalResult: 0
      },
      dialogShow: false,
      listData: [{}], // 列表数据-会员
      excelLoading: false, // 导出加载
      dialogFormLoading: false, // 弹出框加载
      mainLoading: false, // 列表的加载
      multiSelect: []
    }
  },
  created () {
    this.getList()
  },
  filters: {
    sexFilter (val) {
      if (+val === 0) {
        return '女'
      } else if (+val === 1) {
        return '男'
      } else {
        return '保密'
      }
    },
    isOpenFilter (val) {
      return +val ? '启用' : '禁用'
    }
  },
  methods: {
    // 获得列表
    async getList () {
      this.mainLoading = true
      let reqData = Object.assign({}, this.pageInfo, this.formData)
      // reqData.cat_id = reqData.catIdArr && reqData.catIdArr.length ? reqData.catIdArr[reqData.catIdArr.length - 1] : ''
      reqData.beginTime = reqData.timeArr && reqData.timeArr.length ? reqData.timeArr[0] : ''
      reqData.endTime = reqData.timeArr && reqData.timeArr.length ? reqData.timeArr[1] : ''
      delete reqData.timeArr
      // console.log(reqData)
      let res = await this.$post('member/list.do', reqData)
      this.mainLoading = false
      if (parseInt(res.code) === 1) {
        res.data.memberList.forEach(item => {
          item.is_open = !!(+item.is_open)
        })
        this.listData = res.data.memberList
        this.pageInfo.totalResult = res.data.page.totalResult
      } else {
        this.$message.error(res.message)
      }
    },
    // 弹出框-信息
    async toSee (member) {
      this.dialogShow = true
      this.dialogFormLoading = true
      let res = await this.$post('member/goEdit.do', {member_id: member.member_id})
      this.dialogFormLoading = false
      if (+res.code === 1) {
        this.dialogFormData = res.data.member
      } else {
        this.$message.error(res.message)
      }
    },
    // 导出Excel
    async toExcel () {
      this.excelLoading = true
      let reqData = Object.assign({}, this.formData)
      reqData.beginTime = reqData.timeArr && reqData.timeArr.length ? reqData.timeArr[0] : ''
      reqData.endTime = reqData.timeArr && reqData.timeArr.length ? reqData.timeArr[1] : ''
      delete reqData.timeArr
      let res = await this.$post('member/excel.do', reqData)
      this.excelLoading = false
      if (+res.code === 1) {
        let url = res.data.url
        this.downloadFile(url)
      } else {
        this.$message.error(res.message)
      }
    },
    // 是否启用
    async toOpen (val, member) {
      let reqData = {
        member_id: member.member_id,
        is_open: Number(val)
      }
      let res = await this.$post('member/isOpen.do', reqData)
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
<style lang="scss" rel="stylesheet/scss">
  .hotCheck{
    .el-checkbox{
      .el-checkbox__input{
        .el-checkbox__inner{
          width:34px;
          height:28px;
        }
        .el-checkbox__inner::after{
          width:6px;
          height:17px;
          left:13px;
          top:1px;
        }
      }
    }
  }
</style>
