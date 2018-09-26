<template>
  <div class="v-wrap detailWrap">
    <div>
      <h3 class="v-title">账号管理</h3>
    </div>
    <el-form class="formBox" ref="ruleForm" :rules="formRules" :model="formData" label-width="110px" v-loading="mainLoading">
      <el-form-item v-if="accountId>-1">
        <el-button type="danger" class="v-button" icon="el-icon-delete" :loading="deleteLoading" @click="deleteAccount">删除</el-button>
      </el-form-item>
      <el-form-item label="账号id" class="inputItem"  v-if="accountId>-1">
        <span>{{accountId}}</span>
      </el-form-item>
      <el-form-item label="账号" class="inputItem" prop="username">
        <el-input v-model="formData.username" placeholder="请输入用户名，不可重复" :maxlength="20"> </el-input>
      </el-form-item>
      <el-form-item label="姓名" class="inputItem" prop="name">
        <el-input v-model="formData.name" placeholder="请输入姓名" :maxlength="20"> </el-input>
      </el-form-item>
      <el-form-item label="角色" class="inputItem" prop="roleId">
        <el-select v-model="formData.roleId" filterable placeholder="请选择">
          <el-option v-for="(item, index) in roleList" :key="index" :label="item.roleName" :value="item.roleId">{{item.roleName}}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item  v-if="accountId === -1"  label="密码" class="inputItem" prop="password">
        <el-input v-model="formData.password" type="password" placeholder="请输入密码" :maxlength="20"> </el-input>
      </el-form-item>
      <el-form-item  v-if="accountId !== -1"  label="密码" class="inputItem" prop="password">
        <el-button class="v-button" type="warning" plain @click="toResetPwd"  :loading="resetLoading">重置密码</el-button>
      </el-form-item>
      <el-form-item class="timeBox" v-if="formData.createTime || formData.modifyTime ">
        <p v-if="formData.lastLogin"><span>最后登录时间：</span>{{$moment(formData.lastLogin).format('YYYY-MM-DD  hh:mm:ss')}}</p>
        <p><span>共计登录次数：</span>{{formData.loginCount || 0}}</p>
        <p v-if="formData.lastLoginIp"><span>上次登录IP：</span>{{formData.lastLoginIp}}</p>
        <p v-if="formData.createTime"><span>创建时间：</span>{{$moment(formData.createTime).format('YYYY-MM-DD  hh:mm')}}</p>
        <p v-if="formData.modifyTime"><span>最后修改时间：</span>{{$moment(formData.modifyTime).format('YYYY-MM-DD  hh:mm')}}</p>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="v-button" @click="onSubmit" :loading="saveLoading">保存</el-button>
        <el-button  plain class="v-button" @click="$router.go(-1)">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

export default {
  name: 'account-detail',
  data () {
    return {
      mainLoading: false,
      saveLoading: false,
      deleteLoading: false,
      resetLoading: false,
      accountId: Number(this.$route.query.accountId),
      formData: {
        name: '', // 姓名
        username: '', // 用户名
        roleId: '',
        password: ''
      },
      formRules: {
        username: [
          {
            required: true, message: '请输入账号', trigger: 'blur'
          }
        ],
        name: [
          {
            required: true, message: '请输入姓名', trigger: 'blur'
          }
        ],
        roleId: [
          {
            required: true, message: '请选择角色', trigger: 'change'
          }
        ],
        password: [
          {
            required: true, message: '请输入密码', trigger: 'blur'
          }
        ]
      },
      roleList: []
    }
  },
  created () {
    if (this.accountId > -1) {
      this.getDetail()
    }
    this.getRoleList()
  },
  methods: {
    // 获得详情
    async getDetail () {
      this.mainLoading = true
      let res = await this.$post('user/userDetail.do', {userId: this.accountId})
      this.mainLoading = false
      if (parseInt(res.code) === 1) {
        this.formData = res.data.user
        if (res.data.user.username === 'admin') {
          this.$message.error('该账号不支持编辑')
          setTimeout(() => {
            this.$router.replace('/system/permission/accountList')
          }, 1500)
        }
      } else {
        this.$message.error(res.message)
      }
    },
    // 获得角色列表
    async getRoleList () {
      let reqData = {
        currentPage: 1,
        showCount: 1000
      }
      let res = await this.$post('role/list.do', reqData)
      if (parseInt(res.code) === 1) {
        this.roleList = res.data.roleList
      } else {
        this.$message.error(res.message)
      }
    },
    // 保存数据
    onSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let reqData = {
            username: this.formData.username,
            name: this.formData.name,
            roleId: this.formData.roleId,
            password: this.formData.password
          }
          let url = 'user/save.do'
          if (this.accountId > -1) {
            reqData.userId = this.accountId
            url = 'user/edit.do'
            delete reqData.password
          }
          this.toSaveData(url, reqData)
        } else {
          return false
        }
      })
    },
    // 保存
    async toSaveData (url, reqData) {
      this.saveLoading = true
      let res = await this.$post(url, reqData, true)
      this.saveLoading = false
      if (parseInt(res.code) === 1) {
        this.$message.success('保存成功')
        setTimeout(() => {
          this.$router.go(-1)
        }, 1500)
      } else if (parseInt(res.code) === -111) {
        this.$message.success('保存成功')
        setTimeout(() => {
          this.$router.go(-1)
          this.$router.go(0)
        }, 1500)
      } else {
        this.$message.error(res.message)
      }
    },
    // 删除角色
    deleteAccount () {
      this.$confirm('是否确认删除？', '确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.deleteLoading = true
        let res = await this.$post('user/deleted.do', {userId: this.accountId})
        this.deleteLoading = false
        if (parseInt(res.code) === 1) {
          this.$message.success('删除成功')
          setTimeout(() => {
            this.$router.go(-1)
          }, 1500)
        } else {
          this.$message.error(res.message)
        }
      }).catch(() => {
        return false
      })
    },
    // 重置密码
    toResetPwd () {
      this.$confirm('是否确认将用户密码重置为123456？', '确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.resetLoading = true
        let res = await this.$post('user/initPassword.do', {userId: this.accountId})
        this.resetLoading = false
        if (parseInt(res.code) === 1) {
          this.$message.success('重置成功')
        } else {
          this.$message.error(res.message)
        }
      }).catch(() => {
        return false
      })
    }
  }
}
</script>
<style lang="scss" scoped rel="stylesheet/scss">
  @import '~@/styles/common.scss';
  .detailWrap {
    .formBox{
      margin: 30px 0;
      .inputItem{
        width: 700px;
        .el-select {
          width: 100%;
        }
      }
      .timeBox{
        p{
          margin: 0;
          font-size: $font-size-base;
          color: $text-second;
          line-height: 40px;
          &:first-of-type {
            margin-top: 10px;
            border-top: 1px solid $border-base;
          }
          span{
            display: inline-block;
            margin-right: 10px;
            width: 100px;
            text-align: right;
          }
        }
      }
    }
  }

</style>
