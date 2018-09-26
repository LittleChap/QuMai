<template>
  <div class="v-wrap detailWrap">
    <div>
      <h3 class="v-title">权限管理</h3>
    </div>
    <el-form class="formBox" ref="ruleForm" :rules="formRules" :model="formData" label-width="110px" v-loading="mainLoading">
      <el-form-item label="角色id" class="inputItem" v-if="roleId > -1">
        <span>{{roleId}}</span>
      </el-form-item>
      <el-form-item label="角色名" class="inputItem" prop="roleName">
        <el-input v-model="formData.roleName" placeholder="请输入角色名，不可重复" :maxlength="20"> </el-input>
      </el-form-item>
      <el-form-item label="角色描述" class="inputItem">
        <el-input type="textarea" :rows="5" resize="none" v-model="formData.remark" placeholder="请输入" :maxlength="144"> </el-input>
      </el-form-item>
      <el-form-item label="权限设置" class="inputItem">
        <el-tree
          class="treeWrap"
          :data="permissionList"
          show-checkbox
          node-key="id"
          ref="tree"
          :default-checked-keys="defaultChecked"
          :props="defaultProps">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
          </span>
        </el-tree>
      </el-form-item>
      <el-form-item class="timeBox" v-if="formData.createTime || formData.modifyTime">
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
import { asyncRouterMap } from '@/router/index'
export default {
  name: 'permission-detail',
  data () {
    return {
      mainLoading: false,
      saveLoading: false,
      deleteLoading: false,
      roleId: '',
      defaultProps: {
        label: 'name'
      },
      defaultChecked: ['/index'], // 默认选中的项
      formData: {
        roleName: '',
        remark: ''
      },
      formRules: {
        roleName: [
          {
            required: true, message: '请输入角色名', trigger: 'blur'
          }
        ]
      }

    }
  },
  computed: {
    permissionList () {
      let newList = [
        {
          name: '首页',
          id: '/index',
          checked: true,
          disabled: true,
          meta: {menuId: '/index'},
          level: 1
        }
      ]
      asyncRouterMap.map(firstItem => {
        let first = {
          name: firstItem.name,
          children: [],
          id: firstItem.meta.menuId,
          meta: firstItem.meta,
          level: 1
        }
        firstItem.children.map(secondItem => {
          let second = {
            name: secondItem.name,
            id: secondItem.meta.menuId,
            meta: secondItem.meta,
            level: 2
          }
          // 有三级
          if (!secondItem.noDropDown && secondItem.children && secondItem.children.length) {
            second.children = []
            secondItem.children.map(thirdItem => {
              thirdItem.level = 3
              thirdItem.id = thirdItem.meta.menuId
              if (!thirdItem.hidden) {
                second.children.push(thirdItem)
              }
            })
          } else { // 没有三级
            if (secondItem.meta.childrenList && secondItem.meta.childrenList.length) {
              second.id = secondItem.meta.childrenList[0]
            }
          }
          first.children.push(second)
        })
        newList.push(first)
      })
      return newList
    }
  },
  created () {
    this.roleId = this.$route.query.roleId
    // this.getDetail()
    if (this.roleId > -1) {
      this.getDetail()
    }
  },
  methods: {
    // 获得详情
    async getDetail () {
      this.mainLoading = true
      let res = await this.$post('role/goEdit.do', {role_id: this.roleId})
      this.mainLoading = false
      if (parseInt(res.code) === 1) {
        this.formData = res.data.role
        this.formData.roleName = res.data.role.role_name
        if (res.data.role.rights_str) {
          this.defaultChecked = res.data.role.rights_str.split(';')
          this.$refs.tree.setCheckedKeys(this.defaultChecked)
        }
        if (res.data.role.role_ame === '系统管理员') {
          this.$message.error('该账号不支持编辑')
          setTimeout(() => {
            this.$router.replace('/global/role/roleList')
          }, 1500)
        }
      } else {
        this.$message.error(res.message)
      }
    },
    // 获得选中的
    getCheckList () {
      const AllList = this.$refs.tree.getCheckedNodes()
      let checkList = []
      AllList.map(item => {
        if (item.level === 3) { // 第三层
          checkList.push(item.meta.menuId)
          if (item.meta.childrenList) {
            checkList = checkList.concat(item.meta.childrenList)
          }
        } else if (item.level === 2 && (!item.children || !item.children.length)) { // 只到第二层
          checkList = checkList.concat(item.meta.childrenList)
        } else if (item.level === 1 && (!item.children || !item.children.length)) { // 只有一层（首页）
          checkList.push(item.meta.menuId)
        }
      })
      return checkList
    },
    // 保存数据
    onSubmit () {
      // console.log(this.getCheckList())
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let arr = this.getCheckList()
          // console.log(arr)
          let reqData = {
            role_name: this.formData.roleName,
            remark: this.formData.remark,
            rights_str: arr.join(';')
          }
          let url = 'role/save.do'
          if (this.roleId > -1) { // 修改
            reqData.role_id = this.roleId
            url = 'role/edit.do'
          }
          this.toSaveData(url, reqData)
        } else {
          return false
        }
      })
    },
    async toSaveData (url, reqData) {
      this.saveLoading = true
      let res = await this.$post(url, reqData)
      this.saveLoading = false
      // console.log('上传', reqData)
      // console.log(url)
      if (parseInt(res.code) === 1) {
        this.$message.success('保存成功')
        setTimeout(() => {
          this.$router.go(-1)
        }, 1500)
      } else {
        this.$message.error(res.message)
      }
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
          span {
            display: inline-block;
            margin-right: 10px;
            width: 100px;
            text-align: right;
          }
        }
      }
    }
    .treeWrap{
      height: 300px;
      padding: 10px ;
      overflow: auto;
      border: 1px solid $border-base;
      border-radius: 4px;
    }
  }

</style>
<style lang="scss"  rel="stylesheet/scss">
  @import '~@/styles/common.scss';
  .detailWrap {
    .treeWrap{
      .el-tree-node__content{
        line-height: 30px;
        height: auto;
        align-items: stretch;
      }
      .el-tree-node__content > .el-tree-node__expand-icon{
        line-height: 20px;
      }
      .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner{
        background: $background-color;
      }
    }
  }

</style>
