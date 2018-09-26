<!-- 问卷调查 编辑 -->
<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/'}">全局</el-breadcrumb-item>
      <el-breadcrumb-item >用户管理设置</el-breadcrumb-item>
      <!-- <el-breadcrumb-item>问卷调查编辑</el-breadcrumb-item> -->
    </el-breadcrumb>

    <div class="v-wrap" v-loading="mainLoading">
      <div>
        <h3 class="v-title">用户管理设置</h3>
      </div>
      <el-form label-position='top' :rules="rules" :model="form" ref="userForm" label-width="100px" size="small" class="v-form detailForm"
               @submit.native.prevent>
        <!-- <el-form-item label="是否开启物流">
          <el-radio v-model="form.is_open" :label="1">开启</el-radio>
          <el-radio v-model="form.is_open" :label="0">关闭</el-radio>
        </el-form-item> -->

        <el-form-item label="角色名" prop="username">
          <el-input v-model="form.username" :maxlength="200" size="small" class="w400"></el-input>
        </el-form-item>

        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" :maxlength="10" size="small" class="w400"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" :maxlength="200" size="small" class="w400"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="againPassword">
          <el-input v-model="form.againPassword" type="password" :maxlength="200" size="small" class="w400"></el-input>
        </el-form-item>
        <el-form-item label="角色组" prop="role_id">
          <!-- <el-input v-model="form.role.role_name" rows="4" :maxlength="200" size="small" class="w400"></el-input> -->
          <el-select v-model="form.role_id" placeholder="请选择" class="w400">
            <el-option v-for="item in roleList" :key="item.role_id" :label="item.role_name" :value="item.role_id" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机" prop="tel">
          <el-input v-model="form.tel" :maxlength="200" size="small" class="w400"></el-input>
        </el-form-item>
        <!-- <el-form-item label="排序" prop="sort">
          <el-input v-model="form.sort" rows="4" :maxlength="200" size="small" class="w400"></el-input>
        </el-form-item> -->

        <!--操作按钮-->
        <el-form-item label-width="30px">
          <el-button type="primary" v-if="isEdit" @click="toSave" :loading="saveLoading" size="1">保 存</el-button>
          <el-button type="primary" v-if="!isEdit" @click="toAdd" :loading="saveLoading" size="1">保 存</el-button>
          <el-button @click="$router.go(-1)" size="1">返 回</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- <Modules v-model="showModulesDialog" v-if="showModulesDialog" :id="currentRow.id" @success="moduleAdded"></Modules> -->
  </div>
</template>
<script>
// import Modules from './components/Modules'

export default {
  // components: {Modules},
  data () {
    // 手机验证
    var checkPhone = (rule, value, callback) => {
      console.log(rule)
      console.log(value)
      let phoneType = /^[1][3,5,8][0-9]{9}$/
      if (!value) {
        callback()
      } else {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入数字值'))
        } else {
          if (!phoneType.test(value)) {
            callback(new Error('请输入正确的手机号码格式'))
          } else {
            callback()
          }
        }
      }
    }
    // 密码验证
    let checkPassWord = (rule, value, callback) => {
      // let num = Number(value)
      let length = value.length
      let rg = /^[0-9]{6,9}$/
      if (length < 6) {
        callback(new Error('密码长度不能小于6位'))
      } else {
        if (rg.test(value)) {
          callback(new Error('密码不能是10位以下纯数字'))
        } else {
          callback()
        }
      }
    }
    // 确认密码验证
    let checkAgainPassWord = (rule, value, callback) => {
      // let num = Number(value)
      let length = value.length
      let rg = /^[0-9]{6,9}$/
      if (length < 6) {
        callback(new Error('密码长度不能小于6位'))
      } else {
        if (rg.test(value)) {
          callback(new Error('密码不能是10位以下纯数字'))
        } else {
          if (value != this.form.password) {
            callback(new Error('密码输入不一致'))
          } else {
            callback()
          }
        }
      }
    }
    return {
      isEdit: '', // 判断是编辑还是添加
      mainLoading: false, // 全局加载状态
      saveLoading: false, // 保存时候的加载状态
      form: {
        username: '',
        name: '',
        password: '',
        againPassword: '',
        role_id: '',
        role: {}
      },
      roleList: [],
      rules: {
        username: [{required: true, message: '请输入用户名'}],
        role_id: [{required: true, message: '请选择角色组'}],
        name: [{required: true, message: '请输入姓名'}],
        password: [{required: true, message: '请输入密码'}, {validator: checkPassWord}],
        againPassword: [{required: true, message: '请输入密码'}, {validator: checkAgainPassWord}],
        tel: [{validator: checkPhone}]
        // sort: [{required: true, message: '请输入排序'}, {validator: validaSort, trigger: 'change'}]
      }
    }
  },
  created () {
    // let userList = this.$route.query.user ? JSON.parse(this.$route.query.user) : {role: {}}
    // userList.password = ''
    // userList.againPassword = ''
    // userList.tel = ''
    // userList.role_id = ''
    if (this.$route.query.user) {
      let userList = JSON.parse(this.$route.query.user)
      userList.password = ''
      userList.againPassword = ''
      this.form = userList
    }
    this.isEdit = this.$route.query.user ? 1 : 0
    this.getUserList()
  },
  methods: {
    // 获取角色组列表
    async getUserList () {
      let res = await this.$post('user/goAdd.do')
      //   let roleArr = res.data.roleList
      //   this.roleList = roleArr.filter((item, index) => {
      //     return item.role_name
      //   })
      this.roleList = res.data.roleList
    },
    // 编辑保存
    toSave () {
    //   console.log(this.form)
      console.log('aaa')
      this.$refs.userForm.validate(async (isOk, validObj) => {
        // console.log(isOk)
        // console.log(validObj)
        if (isOk) {
        //   console.log('bbb')
          let reqData = {}
          reqData.confirmPassword = this.form.againPassword
          reqData.username = this.form.username
          reqData.password = this.form.password
          reqData.name = this.form.name
          reqData.role_id = this.form.role_id
          reqData.user_id = this.form.user_id
          // console.log(reqData)
          let res = await this.$post('user/edit.do', reqData)
          if (+res.code === 1) {
            this.$message.success('修改成功')
            setTimeout(() => {
              this.$router.go(-1)
            }, 1500)
          } else {
            this.$message.error(res.message)
          }
        }
      })
    },
    // 添加保存
    toAdd () {
      this.$refs.userForm.validate(async (isOk, validObj) => {
        // console.log(isOk)
        // console.log(validObj)
        if (isOk) {
        //   console.log('bbb')
          let reqData = {}
          reqData.confirmPassword = this.form.againPassword
          reqData.username = this.form.username
          reqData.password = this.form.password
          reqData.name = this.form.name
          reqData.role_id = this.form.role_id
          // console.log(reqData)
          let res = await this.$post('user/save.do', reqData)
          if (+res.code === 1) {
            this.$message.success('新增成功')
            setTimeout(() => {
              this.$router.go(-1)
            }, 1500)
          } else {
            this.$message.error(res.message)
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import '~@/styles/common.scss';

  .detailForm {
    margin-top: 20px;
  }

  .w100 {
    width: 100px !important;
  }

  .w400 {
    width: 400px !important;
  }

  .mb10 {
    margin-bottom: 10px;
  }

  .r90 {
    font-size: 17px;
    transform: rotate(90deg);
  }

  .r270 {
    font-size: 17px;
    transform: rotate(270deg);
  }

  .sortIcon {
    font-size: 20px;
  }

  .detailTable {
    /*width: 70%;*/
    margin-top: 20px;
    line-height: 20px;
    .el-table {
      border: 1px solid $border-base;
      border-bottom: none
    }
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
</style>
