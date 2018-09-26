<!-- 订单列表 -->
<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>订单</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="v-wrap listWrap" v-loading="mainLoading">
      <div class="subTitle">
        <h3 class="v-title">订单管理</h3>
        <div class="orderStatusWrap">
          <div class="orderStatusItem" :class="{orderStatusItemActivity: formData.order_status === undefined}"
               @click="setOrderStatus(undefined)">全部订单
          </div>
          <div class="orderStatusItem" :class="{orderStatusItemActivity: formData.order_status === 0}"
               @click="setOrderStatus(0)">待付款
          </div>
          <div class="orderStatusItem" :class="{orderStatusItemActivity: formData.order_status === 2}"
               @click="setOrderStatus(2)">待发货
          </div>
          <div class="orderStatusItem" :class="{orderStatusItemActivity: formData.order_status === 3}"
               @click="setOrderStatus(3)">已发货
          </div>
          <div class="orderStatusItem" :class="{orderStatusItemActivity: formData.order_status === 4}"
               @click="setOrderStatus(4)">待评价
          </div>
          <div class="orderStatusItem" :class="{orderStatusItemActivity: formData.order_status === 5}"
               @click="setOrderStatus(5)">已完成
          </div>
          <div class="orderStatusItem" :class="{orderStatusItemActivity: formData.order_status === 6}"
               @click="setOrderStatus(6)">已关闭
          </div>
        </div>
      </div>
      <!-- 表单-头 -->
      <el-form :model="formData" label-width="90px" class="v-form v-form-bg" @submit.native.prevent>
        <el-row>
          <el-col :span="5">
            <el-form-item label="订单编号">
              <el-input v-model="formData.order_sn" @keyup.native.enter="toSearch"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="下单时间">
              <el-date-picker
                v-model="formData.time"
                type="daterange"
                align="right"
                unlink-panels
                clearable
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="5">
            <el-form-item label="支付方式">
              <el-select v-model="formData.pay_type" clearable>
                <el-option label="全部" value=""></el-option>
                <el-option label="微信支付" :value="0"></el-option>
                <el-option label="银联支付" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="5">
            <el-form-item label="会员帐号">
              <el-input v-model="formData.username" @keyup.native.enter="toSearch"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="5">
            <el-form-item label="收货人姓名">
              <el-input v-model="formData.ship_name" @keyup.native.enter="toSearch"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="5">
            <el-form-item label="发票">
              <el-select v-model="formData.orderInvoice_type" clearable>
                <el-option label="全部" value=""></el-option>
                <el-option label="个人" :value="0"></el-option>
                <el-option label="公司" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="5">
            <el-form-item label="订单类型">
              <el-select v-model="formData.orderInvoice_type" clearable>
                <el-option label="普通订单" :value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="5">
            <el-form-item label="收货人手机">
              <el-input v-model="formData.ship_mobile" @keyup.native.enter="toSearch"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <div class="btnBox">
              <el-button type="primary" icon="el-icon-search" @click="toSearch" v-loading="mainLoading">搜索</el-button>
              <el-button type="primary" @click="toExcel" v-loading="excelLoading">导出</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <!-- 表单-尾 -->
      <!-- 表格-头 -->
      <div style="padding-top: 10px">
        <OrderTable :data="listData"/>
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
import OrderTable from '../Components/OrderTable'

export default {
  name: 'order-list',
  components: {OrderTable},
  data () {
    return {
      mainLoading: false, // 加载状态
      excelLoading: false, // 导出 excel 状态
      pageInfo: { // 分页数据
        currentPage: 1,
        showCount: 10,
        totalResult: 0
      },
      listData: [], // 订单列表数据
      formData: {
        time: [], // 绑定到组件的时间
        end_time: '', // 开始时间
        begin_time: '', // 结束时间
        pay_type: '', // 支付类型
        order_sn: '', // 订单号
        ship_name: '', // 收货人姓名
        order_type: '', // 订单类型
        username: '', // 会员账号
        ship_mobile: '', // 收货人手机号码
        orderInvoice_type: '', // 发票类型
        order_status: undefined, // 订单状态 0:待付款 2:待发货 3:已发货 4:待评价 5:已完成  6:已关闭
        shop_name: '' // 店铺名称
      }, // 表单数据
      pickerOptions: { // 日期 快捷选项
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  created () {
    this.formData.username = this.$route.query.username || ''
    this.getList()
  },
  methods: {
    // 切换订单状态
    setOrderStatus (status) {
      this.formData.order_status = status
      this.pageInfo = { // 分页数据
        currentPage: 1,
        showCount: 10,
        totalResult: 0
      }
      this.getList()
    },
    // 获得订单列表
    async getList () {
      this.mainLoading = true
      let body = Object.assign(this.pageInfo, this.formData)
      body.begin_time = body.time.length ? this.$moment(body.time[0]).format('YYYY-MM-DD 00:00:00') : ''
      body.end_time = body.time.length ? this.$moment(body.time[1]).format('YYYY-MM-DD 23:59:59') : ''
      let url = 'order/list.do'
      let res = await this.$post(url, body)
      this.mainLoading = false
      if (+res.code === 1) {
        this.listData = res.data.orderArray
        this.pageInfo.totalResult = res.data.totalResult
      }
      // console.log('控制台打印:', res)
    },
    // 导出Excel
    async toExcel () {
      if (this.formData.time.length) {
        this.formData.begin_time = this.$moment(this.formData.time[0]).format('YYYY-MM-DD 00:00:00')
        this.formData.end_time = this.$moment(this.formData.time[1]).format('YYYY-MM-DD 23:59:59')
        let diff = this.$moment(this.formData.time[1]) - this.$moment(this.formData.time[0])
        if (diff > 90 * 24 * 60 * 60 * 1000) {
          this.$message.error('请输入下单时间，时间间隔90天内')
          return
        }
      } else {
        this.$message.error('请输入下单时间，时间间隔90天内')
        return
      }

      this.excelLoading = true
      let res = await this.$post('order/excel.do', this.formData)
      this.excelLoading = false
      if (+res.code === 1) {
        this.downloadFile(res.data.url)
      } else {
        this.$message.error(res.data.message)
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

  .subTitle {
    display: flex;
    align-items: center;
  }

  .orderStatusWrap {
    height: 30px;
    margin-left: 30px;
    padding-left: 10px;
    border-left: 1px solid #409eff;
    display: flex;
    align-items: center;
  }

  .orderStatusItem {
    cursor: pointer;
    border: 1px solid #409eff;
    color: #409eff;
    margin: 0 10px;
    padding: 5px 10px;
    border-radius: 3px;
    box-sizing: border-box;
  }

  .orderStatusItemActivity {
    background: #409eff;
    color: #fff;
  }
</style>
