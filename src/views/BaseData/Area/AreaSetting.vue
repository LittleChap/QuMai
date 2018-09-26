<template>
  <div class="v-wrap areaWrap">
    <div>
      <h3 class="v-title">地区设置</h3>
    </div>
    <el-row class="btnBox">
      <el-col :span="12">
        <el-button class="v-button" type="primary" icon="el-icon-plus" @click="toOpenDialog()">添加地区</el-button>
      </el-col>
      <el-col :span="12" style="text-align: right">
        <el-button class="v-button"  type="warning" plain icon="el-icon-refresh" @click="initAreaData">一键初始化</el-button>
      </el-col>
    </el-row>
    <div class="areaBox" v-loading="mainLoading">
      <el-tree
        class="treeWrap"
        :props="areaTreeProps"
        :load="loadNode"
        lazy>
        <span class="treeItem" slot-scope="{ node, data }">
          <span>{{ node.label  }} — {{data.id}}</span>
          <span>
            <el-button type="primary" plain icon="el-icon-edit" @click.stop.prevent="toOpenDialog(data.id, data.name , node)"  size="mini"> 编辑 </el-button>
            <el-button type="danger" plain icon="el-icon-delete" @click.stop.prevent="toDelete(data.id, data)"  size="mini"> 删除 </el-button>
          </span>
        </span>
      </el-tree>

    </div>
    <el-dialog title="地区" :visible.sync="addAreaVisible" width="450px" v-if="addAreaVisible">
      <el-form :model="addAreaForm"  ref="addAreaForm" :rules="addAreaFormRules" label-width="70px">
        <el-form-item label="地区名" prop="name">
          <el-input v-model="addAreaForm.name" placeholder="请输入地区名称" auto-complete="off" :maxlength="20"> </el-input>
        </el-form-item>
        <el-form-item label="上级id" prop="parentId">
          <el-input v-model="addAreaForm.parentId" placeholder="不填代表是一级地区" auto-complete="off" :maxlength="9"> </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button plain @click="addAreaVisible = false">取 消</el-button>
        <el-button type="primary" @click="toAddArea" :loading="saveLoading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'area-setting',
  data () {
    let validatePass = (rule, value, callback) => {
      if (!value && value !== 0) {
        callback()
        return
      }
      let reg = /^[0-9]+$/
      if (reg.test(value)) {
        callback()
      } else {
        let text = '请输入数字'
        callback(text)
      }
    }
    return {
      mainLoading: false,
      areaTreeProps: {
        label: 'name',
        children: 'children',
        id: 'id',
        isLeaf: 'lastChildren'
      },
      addAreaVisible: false, // 添加地区弹窗
      addAreaForm: {
        name: '',
        parentId: ''
      },
      saveLoading: false,
      addAreaFormRules: {
        name: [{required: true, message: '请输入地区名称', trigger: 'blur'}],
        parentId: [{validator: validatePass, trigger: 'change'}]
      }
    }
  },
  methods: {
    // 加载每一级
    async loadNode (node, resolve) {
      if (node.level === 0) {
        this.mainLoading = true
        let first = await this.getAreaList('')
        this.mainLoading = false
        return resolve(first)
      }
      if (node.level > 0) {
        let list = await this.getAreaList(node.data.id)
        return resolve(list)
      }
    },
    // 获得 通过父级 获得子集列表
    async getAreaList (parentId) {
      let reqData = {
        parentId: parentId || 0
      }
      let areaList = []
      let res = await this.$post('regions/getchild.do', reqData)
      if (parseInt(res.code) === 1) {
        areaList = res.data.regionsList
      } else {
        this.$message.error(res.message)
      }
      return areaList
    },
    // 打开新增/编辑弹窗
    toOpenDialog (id, name, node) {
      this.addAreaForm.parentId = (node && node.parent.data) ? (node.parent.data.id || '') : ''
      this.addAreaForm.currentId = id || ''
      this.addAreaForm.name = name || ''
      this.addAreaVisible = true
      this.$nextTick(() => {
        if (!node) {
          this.$refs['addAreaForm'].resetFields()
        } else {
          this.$refs['addAreaForm'].validateField('name')
          this.$refs['addAreaForm'].validateField('parentId')
        }
      })
    },
    // 提交添加保存数据
    toAddArea () {
      this.$refs.addAreaForm.validate(valid => {
        if (valid) {
          // 保存
          let reqData = {
            parentId: this.addAreaForm.parentId,
            name: this.addAreaForm.name
          }
          let url = 'regions/saveRegions.do'
          if (this.addAreaForm.currentId) { // 修改
            url = 'regions/editRegions.do'
            reqData.id = this.addAreaForm.currentId
          }
          this.toSaveOrEdit(url, reqData)
        } else {
          return false
        }
      })
    },
    // 保存 编辑/ 新增
    async toSaveOrEdit (url, reqData) {
      this.saveLoading = true
      let res = await this.$post(url, reqData)
      this.saveLoading = false
      if (parseInt(res.code) === 1) {
        this.$message.success('保存成功')
        setTimeout(() => {
          this.$router.replace({path: '/baseData/area/areaSetting', query: {time: (new Date().getTime())}})
        }, 500)
      } else {
        this.$message.error(res.message)
      }
    },
    // 删除
    toDelete (id, data) {
      let text = data.lastChildren ? '是否确认删除？' : '子地区将会一同删除，请确认'
      // 是否确认删除（若有子集将一同删除）？
      this.$confirm(text, '确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '删除中...'
            let res = await this.$post('regions/deleteRegions.do', {id: id})
            instance.confirmButtonLoading = false
            instance.confirmButtonText = '确定'
            if (parseInt(res.code) === 1) {
              this.$message.success('删除成功')
              setTimeout(() => {
                this.$router.replace({path: '/baseData/area/areaSetting', query: {time: (new Date().getTime())}})
              }, 500)
            } else {
              this.$message.error(res.message)
            }
            done()
          } else {
            done()
          }
        }
      }).then(() => {
        console.log('成功')
      }).catch(() => {
        return false
      })
    },
    // 一键初始化
    initAreaData () {
      this.$confirm('请确认是否恢复出厂设置', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '初始化中...'
            let res = await this.$post('regions/initRegions.do', {})
            instance.confirmButtonLoading = false
            instance.confirmButtonText = '确定'
            if (parseInt(res.code) === 1) {
              this.$message.success('初始化成功')
              setTimeout(() => {
                this.$router.replace({path: '/baseData/area/areaSetting', query: {time: (new Date().getTime())}})
              }, 500)
            } else {
              this.$message.error(res.message)
            }
            done()
          } else {
            done()
          }
        }
      }).then(() => {
        // 初始化完成
      }).catch(() => {
        return false
      })
    }
  }
}
</script>

<style lang="scss" scoped rel="stylesheet/scss">
  @import '~@/styles/common.scss';
  .areaWrap{
    .btnBox{
      margin: 20px 0;
    }
    .areaBox{
      min-height: 400px;
      height: calc( 100vh - 260px );
      border: 1px solid $border-base;
      overflow: auto;
    }
    .treeWrap{
      padding: 10px 20px;
      min-height: 100%;
      .treeItem{
        width: calc( 100% - 30px);
        display: flex;
        font-size: $font-size-base;
        justify-content: space-between;
      }
    }
  }
</style>
<style lang="scss"  rel="stylesheet/scss">
  @import '~@/styles/common.scss';
  .areaWrap {
    .treeWrap{
      .el-tree-node__content{
        line-height: 40px;
        height: auto;
        align-items: center;
      }
      .el-tree-node__content > .el-tree-node__expand-icon{
        /*line-height: 20px;*/
      }
    }
  }

</style>
