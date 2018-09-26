<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>店铺</el-breadcrumb-item>
      <el-breadcrumb-item>店铺管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="v-wrap listWrap">
      <div>
        <h3 class="v-title">店铺管理</h3>
      </div>
      <!-- 表单-头 -->
      <el-form :model="formData" label-width="90px" class="v-form v-form-bg" @submit.native.prevent>
        <el-row>
          <el-col :span="4">
            <el-form-item label="卖家账号" >
              <el-input v-model="formData.mobile" @keyup.native.enter="toSearch"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="店铺名称" >
              <el-input v-model="formData.shop_name" @keyup.native.enter="toSearch"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <!-- <el-form-item label="归属地" >
              <el-select v-model="formData.attribution_name" clearable placeholder="请选择">
                <el-option v-for="item in listAttribution" :key="item.attribution_id"
                :label="item.attribution_name" :value="item.attribution_name"></el-option>
              </el-select> -->
              <!-- <el-input v-model="formData.attribution_name" @keyup.native.enter="toSearch"></el-input> -->
            <!-- </el-form-item> -->
          </el-col>
          <el-col :span="3">
            <el-form-item label="启用状态" >
              <el-select v-model="formData.is_open" clearable  placeholder="" filterable>
                <el-option  label="是" :value="1" ></el-option>
                <el-option  label="否" :value="0" ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <div class="btnBox">
              <el-button type="primary" icon="el-icon-search" @click="toSearch">查询</el-button>
              <!-- <el-button type="primary" :loading="excelLoading"  @click="toExcel">导出</el-button> -->
            </div>
          </el-col>
        </el-row>
      </el-form>
      <!-- 表单-尾 -->
      <!-- 表格-头 -->
      <div class="detailTable">
        <el-row class="btn-Wrap">
          <router-link to="/shop/shopManagement/set">
            <el-button type="primary" plain icon="el-icon-plus">添加</el-button>
          </router-link>
        </el-row>
        <el-table :data="listData" v-loading="mainLoading" style="width: 100%" @selection-change="handleSelectionChange">
          <!-- <el-table-column align="center" type="selection" width="55"> </el-table-column> -->
          <el-table-column align="center" prop="mobile" label="卖家账号" min-width="150px"></el-table-column>
          <el-table-column align="center" prop="shop_name" label="店铺名称" min-width="120px"> </el-table-column>
          <el-table-column align="center" prop="login_number" label="登录次数" width="80px"> </el-table-column>
          <!-- <el-table-column align="center" prop="address" label="归属地" width="80px"></el-table-column> -->
          <el-table-column align="center" label="最后登录时间" min-width="200px">
            <template slot-scope="scope">
             {{$moment(scope.row.last_login_time).format('YYYY-MM-DD HH:ss:mm')}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="申请时间" min-width="200px">
            <template slot-scope="scope">
             {{$moment(scope.row.create_time).format('YYYY-MM-DD HH:ss:mm')}}
            </template>
          </el-table-column>
          <el-table-column  label="启用" align='center' width="50">
            <template slot-scope="scope">
              <div class="hotCheck">
                <el-checkbox @change="toOpen($event, scope.row)" v-model="scope.row.is_open"></el-checkbox>
              </div>
            </template>
        </el-table-column>
          <el-table-column align="center" label="操作" min-width="500px">
            <template slot-scope="scope">
              <router-link :to="`/shop/shopManagement/set?shopId=${scope.row.shop_id}`">
                <span class="v-blue v-text-cursor">编辑</span>
              </router-link>
              <i class="v-blue v-separator" >|</i>
              <span class="v-red v-text-cursor" @click="siggleDelete(scope.row)">删除</span>
              <i class="v-blue v-separator" >|</i>
              <span class="v-blue v-text-cursor" @click="initPsw(scope.row)">重置密码</span>
              <i class="v-blue v-separator" >|</i>
              <span class="v-blue v-text-cursor" @click="addChild(scope.row)">添加子账号</span>
              <i class="v-blue v-separator" >|</i>
              <span class="v-blue v-text-cursor" @click="seeChildAccount(scope.row, scope.row.shop_id, scope.$index)">子账号列表</span>
              <i class="v-blue v-separator" >|</i>
              <span class="v-blue v-text-cursor" @click="toExtension(scope.row, scope.row.shop_id)">二维码</span>
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
        <router-link to="">
          <el-button type="primary">查看订单</el-button>
        </router-link>
        <router-link to="">
          <el-button type="primary">查看售后单</el-button>
        </router-link>
        <el-button type="primary" @click="dialogShow = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 删除弹出框 -->
    <el-dialog class="v-dialog" title="请输入登录密码" :visible.sync="isShowDele" width="400px">
      <span>确认删除{{DelShopName}}店铺？请输入登录密码</span>
      <div class="flexBox">
        <span class="labWidth">密码：</span>
        <el-input type="password" v-model.number="DelShopPassWorld"></el-input>
      </div>
      <span class="labWidth">警告：</span><span>
        删除店铺后信息将不可恢复
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowDele = false">取 消</el-button>
        <el-button type="primary" :loading="DelButtonLoading" @click="DeleShop">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加子账号弹出框 -->
    <el-dialog class="v-dialog" title="添加子账号" :visible.sync="addChildAccountShow" width="800px">
      <el-form :model="addChildAccountFormData" ref="addChildForm" :rules="AddChildRules" label-width="90px" @submit.native.prevent>
        <el-form-item label="店铺名" >
            <span>{{addChildAccountFormData.shop_name}}</span>
        </el-form-item>
        <el-form-item label="子账号" prop="mobile">
          <el-input v-model="addChildAccountFormData.mobile" @keyup.native.enter="addChildAccount" style="width: 300px"></el-input>
          <span style="margin-left: 30px" class="v-red">卖家帐号为手机号，密码默认为123456</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addChildAccountShow = false">取 消</el-button>
        <el-button type="primary" :loading="addChidButtonLoading" @click="addChildAccount">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 推广弹出框 -->
    <exten-dialog @refresh="refresh" v-model="extensionInfo.showDialog" :infoData="extensionInfo.infoData"></exten-dialog>
    <!-- 子账号列表 -->
    <child-account v-on:getChildList="getChildList" v-model="childAccountInfo.showDialog" :idx="childAccountInfo.idx" :formData="childAccountInfo.infoData.shop" :tableData="childAccountInfo.infoData.shopChidrenList"></child-account>
  </div>
</template>

<script>
import extenDialog from './components/ExtenDialog'
import childAccount from './components/ChildAccountList'
export default {
  data () {
    var checkNum = (rule, value, callback) => {
      var telReg = /^[1][3,4,5,7,8][0-9]{9}$/
      if (!telReg.test(value)) {
        return callback(new Error('请输入正确的手机格式'))
      } else {
        callback()
      }
    }
    return {
      formData: {
        mobile: '',
        shop_name: '',
        // attribution_name: '',
        is_open: null
      },
      // 添加子账号数据
      addChildAccountShow: false,
      addChidButtonLoading: false,
      addChildAccountFormData: {
        shop_id: '',
        shop_name: '',
        mobile: ''
      },
      AddChildRules: {
        mobile: [{required: true, message: '请输入子账号'}, {validator: checkNum}]
      },
      // 弹出框信息
      dialogFormData: {},
      // 推广弹窗数据
      extensionInfo: {
        showDialog: false,
        infoData: {}
      },
      // 子账号数据
      childAccountInfo: {
        showDialog: false,
        idx: null,
        infoData: {}
      },
      // 归属地列表
      listAttribution: [],
      pageInfo: {
        currentPage: 1,
        showCount: 10,
        totalResult: 0
      },
      dialogShow: false,
      // 删除弹框数据
      isShowDele: false,
      DelShopName: '',
      DelShopPassWorld: '',
      DelShopId: '',
      DelButtonLoading: false,
      //
      listData: [{}], // 列表数据-店铺
      excelLoading: false, // 导出加载
      dialogFormLoading: false, // 弹出框加载
      mainLoading: false, // 列表的加载
      multiSelect: []
    }
  },
  components: {
    extenDialog,
    childAccount
  },
  created () {
    this.getList()
    this.getAttribution()
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
      let res = await this.$post('shop/list.do', reqData)
      this.mainLoading = false
      if (parseInt(res.code) === 1) {
        res.data.shopList.forEach(item => {
          item.is_open = !!(+item.is_open)
        })
        this.listData = res.data.shopList
        this.pageInfo.totalResult = res.data.page.totalResult
      } else {
        this.$message.error(res.message)
      }
    },
    // 获取归属地列表
    async getAttribution () {
      let res = await this.$post('mobileBaseData/listAttribution.do')
      if (+res.code === 1) {
        this.listAttribution = res.data.attributionArray
      } else {
        this.$message.error(res.message)
      }
    },
    // // 弹出框-信息
    // async toSee (member) {
    //   this.dialogShow = true
    //   this.dialogFormLoading = true
    //   let res = await this.$post('member/goEdit.do', {member_id: member.member_id})
    //   this.dialogFormLoading = false
    //   if (+res.code === 1) {
    //     this.dialogFormData = res.data.member
    //   } else {
    //     this.$message.error(res.message)
    //   }
    // },
    // 是否启用
    async toOpen (val, shop) {
      let reqData = {
        shop_id: shop.shop_id,
        is_open: Number(val)
      }
      let res = await this.$post('shop/isOpen.do', reqData)
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
    // 单个删除
    siggleDelete (shop) {
      this.isShowDele = true
      this.DelShopName = shop.shop_name
      this.DelShopId = shop.shop_id
      this.DelShopPassWorld = ''
    },
    // 删除店铺
    async DeleShop () {
      this.DelButtonLoading = true
      let res = await this.$post('shop/falseDelete.do', {id: this.DelShopId})
      this.isShowDele = false
      this.DelButtonLoading = false
      if (+res.code === 1) {
        this.$message.success('删除成功')
      } else {
        this.$message.error(res.message)
      }
    },
    // 重置密码
    async initPsw (shop) {
      this.$confirm('确定将该店铺密码重置为“123456”？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '重置中...'
            let res = await this.$post('shop/initShopPwd.do', {id: shop.shop_id})
            instance.confirmButtonLoading = false
            instance.confirmButtonText = '确定'
            if (parseInt(res.code) === 1) {
              this.$message.success('重置成功')
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
    // 打开添加子账号框
    addChild (shop) {
      if (this.$refs.addChildForm) {
        this.$refs.addChildForm.resetFields()
      }
      this.addChildAccountShow = true
      this.addChildAccountFormData.shop_id = shop.shop_id
      this.addChildAccountFormData.shop_name = shop.shop_name
    },
    // 添加子账号
    addChildAccount () {
      this.addChidButtonLoading = true
      let reqData = Object.assign({}, this.addChildAccountFormData)
      delete reqData.shop_name
      this.$refs.addChildForm.validate(async (isOk, obj) => {
        if (isOk) {
          let res = await this.$post('shop/addChidren.do', reqData)
          this.addChildAccountShow = false
          this.addChidButtonLoading = false
          if (+res.code === 1) {
            this.$message.success('添加成功')
          } else {
            this.$message.error(res.message)
          }
        } else {
          this.addChidButtonLoading = false
          this.$message.error(obj[Object.keys(obj)[0]][0].message)
        }
        this.$refs.addChildForm.resetFields()
      })
    },
    // 推广
    async toExtension (item, shopId) {
      // if (item.extensionInfo) {
      //   this.extensionInfo.infoData = item.extensionInfo
      //   this.extensionInfo.showDialog = true
      //   return false
      // }
      let res = await this.$post('shop/detailExtension.do', {shopId: shopId})
      if (parseInt(res.code) === 1) {
        // item.extensionInfo = res.data
        this.extensionInfo.infoData = res.data
        this.extensionInfo.showDialog = true
      } else {
        this.$message.error(res.message)
      }
    },
    // 刷新推广
    refresh (shopId) {
      this.toExtension('', shopId)
    },
    // 查看子账号列表
    async seeChildAccount (item, id, idx) {
      this.childAccountInfo.idx = idx
      // if (item.childAccountInfo) {
      //   this.childAccountInfo.infoData = item.childAccountInfo
      //   this.childAccountInfo.showDialog = true
      //   return false
      // }
      let res = await this.$post('shop/goShopChidrenList.do', {shop_id: id})
      if (+res.code === 1) {
        res.data.shopChidrenList.forEach(item => {
          item.is_open = !!(+item.is_open)
        })
        item.childAccountInfo = res.data
        this.childAccountInfo.showDialog = true
        this.childAccountInfo.infoData = res.data
      } else {
        this.$message.error(res.message)
      }
    },
    // 刷新子账号列表
    async getChildList (obj) {
      let res = await this.$post('shop/goShopChidrenList.do', {shop_id: obj.id})
      if (+res.code === 1) {
        res.data.shopChidrenList.forEach(item => {
          item.is_open = !!(+item.is_open)
        })
        // console.log(res.data.shopChidrenList[obj.index])
        this.listData[obj.index].childAccountInfo = res.data
        this.childAccountInfo.showDialog = true
        this.childAccountInfo.infoData = res.data
      } else {
        this.$message.error(res.message)
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
  .flexBox{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 20px 0;
  }
  .labWidth{
    width: 70px;
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
