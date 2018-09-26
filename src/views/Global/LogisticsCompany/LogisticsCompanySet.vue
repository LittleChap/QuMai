<!-- 问卷调查 编辑 -->
<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/'}">全局</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/global/logisticscompany/set' }">物流配置管理</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="v-wrap" v-loading="mainLoading">
      <div>
        <h3 class="v-title">物流配置管理</h3>
      </div>
      <el-form label-position='top' :rules="rules" :model="form" ref="logisticsForm" label-width="100px" size="small" class="v-form detailForm"
               @submit.native.prevent>
        <el-form-item label="是否开启物流">
          <el-radio v-model="form.is_open" :label="1">开启</el-radio>
          <el-radio v-model="form.is_open" :label="0">关闭</el-radio>
        </el-form-item>

        <el-form-item label="物流名称" prop="logistics_name">
          <el-input v-model="form.logistics_name" rows="4" :maxlength="50" size="small" class="w400"></el-input>
        </el-form-item>

        <el-form-item label="物流编码" prop="encipher">
          <el-input v-model="form.encipher" rows="4" :maxlength="50" size="small" class="w400"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="form.sort" rows="4" :maxlength="5" size="small" class="w400"></el-input>
        </el-form-item>

        <!--操作按钮-->
        <el-form-item label-width="30px">
          <el-button type="primary" v-if="isEdit" @click="toSave" :loading="saveLoading" size="1">保 存</el-button>
          <el-button type="primary" v-if="!isEdit" @click="toAdd" :loading="saveLoading" size="1">保 存</el-button>
          <el-button @click="$router.go(-1)" size="1">返 回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  // components: {Modules},
  data () {
    let validaSort = (rule, value, callback) => {
      let num = Number(value)
      if (isNaN(num)) {
        callback(new Error('请输入正确数值'))
      } else {
        callback()
      }
    }
    return {
      isEdit: '', // 判断是编辑还是添加
      mainLoading: false, // 全局加载状态
      saveLoading: false, // 保存时候的加载状态
      form: {
        // 数据格式
        is_open: '',
        logistics_name: '',
        encipher: '',
        sort: 100
      },
      rules: {
        logistics_name: [{required: true, message: '请输入物流名称'}],
        encipher: [{required: true, message: '请输入物流编码'}],
        sort: [{required: true, message: '请输入排序'}, {validator: validaSort, trigger: 'change'}]
      }
    }
  },
  created () {
    this.form = this.$route.query.logistics ? JSON.parse(this.$route.query.logistics) : {is_open: 1, sort: 100}
    this.isEdit = this.$route.query.logistics ? 1 : 0
  },
  methods: {
    // 编辑保存
    toSave () {
      // console.log('aaa')
      this.$refs.logisticsForm.validate(async (isOk, validObj) => {
        // console.log(isOk)
        // console.log(validObj)
        if (isOk) {
          // console.log('bbb')
          let reqData = {}
          reqData.logistics_name = this.form.logistics_name
          reqData.is_open = this.form.is_open
          reqData.encipher = this.form.encipher
          reqData.sort = this.form.sort
          reqData.logistics_id = +this.form.logistics_id
          // console.log(reqData)
          let res = await this.$post('logisticscompany /edit.do', reqData)
          if (+res.code === 1) {
            this.$message.success('修改成功')
            setTimeout(() => {
              this.$router.go(-1)
            }, 1500)
          } else {
            this.$message.Error(res.message)
          }
        }
      })
    },
    // 添加保存
    toAdd () {
      this.$refs.logisticsForm.validate(async (isOk, validObj) => {
        // console.log(isOk)
        // console.log(validObj)
        if (isOk) {
        //   console.log('bbb')
          let reqData = {}
          reqData.logistics_name = this.form.logistics_name
          reqData.is_open = this.form.is_open
          reqData.encipher = this.form.encipher
          reqData.sort = +this.form.sort
          // console.log(reqData)
          let res = await this.$post('logisticscompany/save.do', reqData)
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
