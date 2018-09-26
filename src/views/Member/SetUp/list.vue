<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item >会员</el-breadcrumb-item>
      <el-breadcrumb-item >会员设置</el-breadcrumb-item>
      <!-- <el-breadcrumb-item>客服设置</el-breadcrumb-item> -->
    </el-breadcrumb>
    <div class="v-wrap detailWrap">
      <div>
        <h3 class="v-title">会员设置</h3>
        <el-form style="max-width:800px" ref="memberForm" v-loading="formLoading" :model="formData" label-width="100px" size="mini" class="v-form v-form-bg" @submit.native.prevent>
          <div class="titleBox">
            <span>会员折扣</span>
            <el-button circle size="mini" @click="dialogShow = true" icon="el-icon-question"></el-button>
          </div>
          <div class="contenBox">
            <div class="formItemBox" v-for="(item, index) in formData.memberLevelList" :key="item.level_id">
              <el-form-item :label="item.level_name + '：'" :prop="'memberLevelList.' + index + '.level_point'" :rules="rules.ruleOne">
                <el-input :disabled="index ? false : true" class='input' style="width:150px" v-model="item.level_point"></el-input>积分以上，享受
              </el-form-item>
              <el-form-item label-width="5px" :prop="'memberLevelList.' + index + '.discount'" :rules="rules.ruleTwo">
                <el-input class='input' style="width:150px" v-model="item.discount"></el-input>折
              </el-form-item>
            </div>
            <!-- <el-form-item label="银卡会员：">
              <el-input class='input' style="width:100px" v-model.number="a"></el-input>积分以上，享受
              <el-input class='input' style="width:100px" v-model.number="a"></el-input>折
            </el-form-item>
            <el-form-item label="金卡会员：" >
              <el-input class='input' style="width:100px" v-model.number="a"></el-input>积分以上，享受
              <el-input class='input' style="width:100px" v-model.number="a"></el-input>折
            </el-form-item>
            <el-form-item label="白金会员：" >
              <el-input class='input' style="width:100px" v-model.number="a"></el-input>积分以上，享受
              <el-input class='input' style="width:100px" v-model.number="a"></el-input>折
            </el-form-item>
            <el-form-item label="钻石：" >
              <el-input class='input' style="width:100px" v-model.number="a"></el-input>积分以上，享受
              <el-input class='input' style="width:100px" v-model.number="a"></el-input>折
            </el-form-item> -->
          </div>
          <div class="titleBox">
            <span>包邮规则</span>
            <!-- <el-button circle size="mini" icon="el-icon-question"></el-button> -->
          </div>
          <div class="contenBox">
            <el-form-item v-for="(item, index) in formData.memberLevelList" :key="item.level_id + 10" :label="item.level_name + '：'"
             :prop="'memberLevelList.' + index + '.free_shipping_price'" :inline-message="true" :rules="rules.ruleOne" >
              单笔订单满<el-input class='input' style="width:100px" v-model="item.free_shipping_price"></el-input>免运费
            </el-form-item>
            <!-- <el-form-item label="银卡会员：" >
              单笔订单满<el-input class='input' style="width:100px" v-model.number="a"></el-input>免运费
            </el-form-item>
            <el-form-item label="金卡会员：" >
              单笔订单满<el-input class='input' style="width:100px" v-model.number="a"></el-input>免运费
            </el-form-item>
            <el-form-item label="白金会员：" >
              单笔订单满<el-input class='input' style="width:100px" v-model.number="a"></el-input>免运费
            </el-form-item>
            <el-form-item label="钻石：" >
              单笔订单满<el-input class='input' style="width:100px" v-model.number="a"></el-input>免运费
            </el-form-item> -->
          </div>
        </el-form>
      </div>
      <el-button type="success" @click='toSave()'>保 存</el-button>
    </div>
    <el-dialog  title="文本" :visible.sync="dialogShow" width="30%"  class="v-dialog">
        <span>
          <p>
            1.会员等级：如普通会员填写0积分以上，银卡会员填写5000积分以上，那么成为普通会员的条件为0至4999积分，其他等级以此类推；<br>
            2.折扣填写规则：85折填写85，9折填写90，无折扣填写100，以此类推。
          </p>
        </span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogShow = false">取 消</el-button>
            <el-button type="primary" @click="dialogShow = false">确 定</el-button>
        </span>
    </el-dialog>
    <!-- <el-button  @click='check'>输出</el-button> -->
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data () {
    var checkNum = (rule, value, callback) => {
      if (!isNaN(Number(value))) {
        if (value < 0) {
          return callback(new Error('输入的值不能为负'))
        } else {
          callback()
        }
      } else {
        return callback(new Error('请输入纯数字'))
      }
    }
    var checkNumLg = (rule, value, callback) => {
      if (!isNaN(Number(value))) {
        if (value > 100) {
          return callback(new Error('输入的值不能大于100'))
        } else {
          if (value < 0) {
            return callback(new Error('输入的值不能为负'))
          } else {
            callback()
          }
        }
      } else {
        return callback(new Error('请输入纯数字'))
      }
    }
    return {
      formData: {
        memberLevelList: []
      },
      rules: {
        ruleOne: [{validator: checkNum}],
        ruleTwo: [{validator: checkNumLg}]
      },
      formLoading: false,
      // value1: true,
      // value2: true,
      dialogShow: false
    }
  },
  created () {
    this.getData()
  },
  methods: {
    async getData () {
      this.formLoading = true
      let res = await this.$post('memberlevel/list.do', {})
      this.formLoading = false
      if (+res.code === 1) {
        this.formData = res.data
        // console.log(this.memberList)
      }
    },
    // 上传保存
    toSave () {
      this.$refs.memberForm.validate(async (isOk, obj) => {
        if (isOk) {
          // let reqData = {
          //   free_shipping_price: 21,
          //   free_shipping_price: 21,
          //   free_shipping_price: 21,
          //   free_shipping_price: 21,
          //   free_shipping_price: 21,
          //   level_point: 30,
          //   level_point: 30,
          //   level_point: 30,
          //   level_point: 30,
          //   level_point: 30,
          //   discount: 50,
          //   discount: 50,
          //   discount: 50,
          //   discount: 50,
          //   discount: 50
          // }
          let res = await this.$post(`memberlevel/save.do
          ?free_shipping_price=${this.formData.memberLevelList[0].free_shipping_price}
          &free_shipping_price=${this.formData.memberLevelList[1].free_shipping_price}
          &free_shipping_price=${this.formData.memberLevelList[2].free_shipping_price}
          &free_shipping_price=${this.formData.memberLevelList[3].free_shipping_price}
          &free_shipping_price=${this.formData.memberLevelList[4].free_shipping_price}
          &level_point=${this.formData.memberLevelList[0].level_point}
          &level_point=${this.formData.memberLevelList[1].level_point}
          &level_point=${this.formData.memberLevelList[2].level_point}
          &level_point=${this.formData.memberLevelList[3].level_point}
          &level_point=${this.formData.memberLevelList[4].level_point}
          &discount=${this.formData.memberLevelList[0].discount}
          &discount=${this.formData.memberLevelList[1].discount}
          &discount=${this.formData.memberLevelList[2].discount}
          &discount=${this.formData.memberLevelList[3].discount}
          &discount=${this.formData.memberLevelList[4].discount}`)
          if (+res.code === 1) {
            this.$message.success('保存成功')
            this.getData()
          } else {
            this.$message.error(res.message)
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import '~@/styles/common.scss';
  .titleBox{
    display: flex;
    justify-content: space-between;
    padding: 5px;
    margin-bottom: 30px;
    border-bottom: 2px solid #e6e6e6;
    span{
      font-size: 15px
    }
  }
  .formItemBox{
      display: flex;
      justify-content: flex-start
  }
</style>
