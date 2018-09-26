<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">全局</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/global/region/RegionList' }">地区管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="v-wrap detailWrap">
      <div>
        <h3 class="v-title">地区管理</h3>
        <div class="regionsLIst">
          <el-row class="btn-Wrap">
            <el-button icon="el-icon-plus" type="primary" plain @click="addRegion">添加</el-button>
            <el-button type="warning" plain @click="isShowInit = true" >地区初始化</el-button>
          </el-row>
          <!-- 表单-头 -->
          <el-table
            v-loading='tableLoading'
            :data="regionsList"
            style="width: 100%">
            <el-table-column
            label="名称"
            align='center'
            width="">
                <template slot-scope="scope">
                  <div class='nameBox'>
                    <el-button :style="{marginLeft:scope.row.lay * 50 - 50 + 'px'}" v-if="!scope.row.regionLoading && scope.row.lay > 1" @click="getChildList(scope.row,scope.$index)"  type="text">
                      <span v-if="scope.row.hasChild">
                        【<i :class="[!scope.row.isOpen?'el-icon-plus':'el-icon-minus']"></i>】
                      </span>
                      <i v-show="!scope.row.loading" class="el-icon-loading"></i>
                    {{scope.row.name}}</el-button>
                    <el-button :style="{marginLeft:scope.row.lay * 50 - 50 + 'px'}" v-if="!scope.row.regionLoading && scope.row.lay <= 1" @click="getChildList(scope.row,scope.$index)"  type="text">
                      <span>【
                        <i :class="[!scope.row.isOpen?'el-icon-plus':'el-icon-minus']"></i>
                        】</span>{{scope.row.name}}
                    </el-button>
                    <el-button :style="{marginLeft:scope.row.lay * 50 - 50 + 'px'}" v-if="scope.row.regionLoading" @click="getChildList(scope.row,scope.$index)"  type="text"><i class="el-icon-loading"></i>{{scope.row.name}}</el-button>
                    <el-button type="text" @click="toAddChirld(scope.row)" border icon='el-icon-circle-plus'>添加子地区</el-button>
                  </div>
                </template>
            </el-table-column>
            <el-table-column
            prop="sort"
            label="排序"
            align='center'
            width="150">
            </el-table-column>
            <el-table-column
            label="操作"
            align='center'
            width="300px"
            >
                <template slot-scope="scope">
                  <span class="v-blue v-text-cursor" @click="goEdit(scope.row)">编辑</span>
                  <i class="v-blue v-separator">|</i>
                  <span class="v-red v-text-cursor" @click="delRegion(scope.row)">删除</span>
                </template>
            </el-table-column>
          </el-table>
          <!-- 表单-尾 -->
        </div>
      </div>
    </div>
    <!-- 添加地区弹出框-开始 -->
    <el-dialog :key="dialogData.create_time" class="v-dialog" width='500px' title="添加地区" :visible.sync="dialogShow">
      <el-form ref="dialogForm" :model="dialogData" label-position="top" :rules="rules" v-loading="dialogLoading">
        <el-form-item label="上级地区" label-width="120px">
          <el-input disabled key="2"  v-model="dialogData.parent_name"  auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="地区名称" label-width="120px" prop="regions.name">
          <el-input v-model="dialogData.regions.name" :maxlength="200"  auto-complete="off"></el-input>
        </el-form-item>
        <!-- <el-form-item label="地区英文名称" :key="dialogData.create_time" label-width="120px">
          <el-input  auto-complete="off"></el-input>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogShow = false">取 消</el-button>
        <el-button v-if="isSave == 'save'" type="primary" @click="toSave">确 定</el-button>
        <el-button v-if="isSave == 'edit'" type="primary" @click="toEdit">确 定</el-button>
        <el-button v-if="isSave == 'add'" type="primary" @click="toAdd">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加地区弹出框-结束 -->
    <!-- 初始化弹出框 -->
    <el-dialog
      class="v-dialog"
      title="提示"
      :visible.sync="isShowInit"
      width="400px"
      >
      <div class="flexBox">
        <span class="labWidth">密码：</span>
        <el-input v-model="passWorld" type="password"></el-input>
      </div>
      <span class="labWidth">警告：</span><span>
        地区信息初始化后原信息将丢失，请输入登录密码确认执行此操作
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowInit = false">取 消</el-button>
        <el-button type="primary" @click="regionInit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 密码
      passWorld: '',
      // 是否显示初始化弹出框
      isShowInit: false,
      // 判断弹出框上传路径
      isSave: '',
      // 是否显示添加地区弹出框
      dialogShow: false,
      // 添加地区dialogData
      dialogData: {
        parent_name: '',
        regions: {}
      },
      // 表格加载
      tableLoading: false,
      // 加载子地区
      regionLoading: false,
      // 弹出框加载
      dialogLoading: false,
      rules: {
        'regions.name': [{required: true, message: '内容不能为空', trigger: 'blur'}]
      },
      regionsList: [
        {
          id: 1, // 地区ID
          name: '北京', // 地区名称
          parent_id: 0, // 上级ID
          parent_path: '0|1|', // 路径
          short_name: '北京',
          area_code: null,
          zip_code: null,
          pinyin: null,
          lng: '116.405289', // 维度
          lat: '39.904987', // 经度
          level: 1, // 地区等级
          position: 'tr_0',
          sort: 33, // 排序
          create_time: null,
          modify_time: null,
          version: 0,
          is_deleted: 0,
          subRegions: null
        }
      ]
    }
  },
  created () {
    this.getList()
  },
  watch: {
    regionsList: {
      deep: true,
      handler (o, n) {
      }
    }
  },
  methods: {
    // 获得列表
    async getList () {
      this.tableLoading = true
      let res = await this.$post('regions/list.do')
      this.tableLoading = false
      if (+res.code === 1) {
        res.data.regionsList.map((child, index) => {
          this.checkChild(child)
          child.path = index
          // 设置区地为第几层
          child.lay = 1
          // 必须加上这句，因为checkChild是异步执行，regionsList数据完成时还没hasChild属性
          child.hasChild = false
          child.regionLoading = false
        })
        this.regionsList = res.data.regionsList
      }
    },
    // 判断是否还有子地区
    async checkChild (region) {
      let reqData = {parent_path: region.parent_path}
      let res = await this.$post('regions/getchild.do', reqData)
      let childList = res.data.regionsChildrenArray
      // console.log(childList)
      region.loading = true
      if (childList.length !== 0) {
        region.hasChild = true
      } else {
        // console.log('aaa')
        region.hasChild = false
      }
    },
    // 获取子列表-实现地区层次呈现
    async getChildList (region, index) {
      if (!region.isOpen) {
        this.regionsList[index].regionLoading = true
        let reqData = {parent_path: region.parent_path}
        let res = await this.$post('regions/getchild.do', reqData)
        this.regionsList[index].regionLoading = false
        let childList = res.data.regionsChildrenArray
        childList.map((child, idx) => {
          child.loading = false
          this.checkChild(child)
          // 必须加上这句，因为checkChild是异步执行，regionsList数据完成时还没hasChild属性
          child.hasChild = false
          child.regionLoading = false
          child.lay = region.lay + 1
          child.path = region.path + '-' + idx
          this.regionsList.splice(index + 1 + idx, 0, child)
        })
        this.regionsList[index].isOpen = true
      } else {
        var rg = new RegExp('^' + region.path + '-')
        this.regionsList[index].isOpen = false
        var arr = this.regionsList.filter((child, idx) => {
          return !rg.test(child.path)
        })
        this.regionsList = arr
      }
    },
    // 添加地区
    addRegion () {
      this.isSave = 'add'
      this.dialogShow = true
      this.dialogData = {
        parent_name: '顶级地区',
        regions: {}
      }
    },
    // 查看地区详情（新增）
    async toAddChirld (region) {
      this.isSave = 'save'
      this.dialogShow = true
      let reqData = {}
      reqData.id = region.id
      this.dialogLoading = true
      let res = await this.$post('regions/goAdd.do', reqData)
      this.dialogLoading = false
      this.dialogData = res.data
      this.dialogData.regions.name = ''
    },
    // 保存地区
    toAdd () {
      this.$refs.dialogForm.validate(async (isOk, obj) => {
        if (isOk) {
          let reqData = {}
          reqData = {
            short_name: this.dialogData.parent_name,
            name: this.dialogData.regions.name
          }
          // console.log(reqData)
          let res = await this.$post('regions/save.do', reqData)
          if (parseInt(res.code) === 1) {
            this.dialogShow = false
            this.$message.success('保存成功')
            this.getList()
          } else {
            this.dialogShow = false
            this.$message.error(res.message)
          }
        }
      })
    },
    initPsw () {
      this.passWorld = ''
      this.isShowInit = true
    },
    // 保存子地区
    toSave () {
      this.$refs.dialogForm.validate(async (isOk, obj) => {
        if (isOk) {
          let reqData = {}
          reqData = {
            short_name: this.dialogData.parent_name,
            name: this.dialogData.regions.name,
            parent_path: this.dialogData.regions.parent_path,
            parent_id: this.dialogData.regions.parent_id,
            id: this.dialogData.regions.id
          }
          // }
          // console.log(reqData)
          let res = await this.$post('regions/save.do', reqData)
          if (parseInt(res.code) === 1) {
            this.dialogShow = false
            this.$message.success('保存成功')
            this.getList()
          } else {
            this.dialogShow = false
            this.$message.error(res.message)
          }
        }
      })
    },
    // 编辑上传修改
    toEdit () {
      this.$refs.dialogForm.validate(async (isOk, obj) => {
        if (isOk) {
          let reqData = {id: this.dialogData.regions.id, name: this.dialogData.regions.name}
          let res = await this.$post('regions/edit.do', reqData)
          if (parseInt(res.code) === 1) {
            this.dialogShow = false
            this.$message.success('修改成功')
            this.getList()
          } else {
            this.dialogShow = false
            this.$message.error(res.message)
          }
        }
      })
    },
    // 编辑地区
    async goEdit (region) {
      this.dialogShow = true
      this.isSave = 'edit'
      let reqData = {id: region.id}
      this.dialogLoading = true
      let res = await this.$post('regions/goEdit.do', reqData)
      this.dialogLoading = false
      // console.log(res)
      if (parseInt(res.code) === 1) {
        this.dialogData = res.data
      } else {
        this.$message.error(res.message)
      }
    },
    // 删除地区
    async delRegion (region) {
      // console.log(region)
      let res = await this.$post('regions/isUsedOfRegions.do', {id: region.id})
      if (+res.code === 1) {
        if (res.data.isUsed) {
          this.$message.warning('该地区使用中，不能删除！')
          return false
        }
      }
      let reqData = {id: region.id}
      this.$confirm('是否删除此地区？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let res = await this.$post('regions/falseDeleteAll.do', reqData)
        if (parseInt(res.code) === 1) {
          this.$message.success('删除成功')
          this.getList()
        } else {
          this.$message.error(res.message)
        }
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    // 地区初始化
    async regionInit  () {
      let reqData = {password: this.passWorld}
      this.isShowInit = false
      // console.log(reqData)
      let res = await this.$post('regions/init.do', reqData)
      if (res.code == 1) {
        this.$message.success('初始化成功！')
      } else {
        this.$message.error(res.message)
      }
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  @import '~@/styles/common.scss';
  .el-select .el-input {
    width: 130px;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
  .nameBox{
    // width: 400px;
    display: flex;
    padding: 0 50px;
    justify-content: space-between;
  }
  .regionsLIst{
    margin-top: 20px;
  }
  .flexBox{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  .labWidth{
    width: 70px;
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
