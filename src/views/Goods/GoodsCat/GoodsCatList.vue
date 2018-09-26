<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">全局</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/global/region/RegionList' }">商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="v-wrap detailWrap">
      <div>
        <h3 class="v-title">商品分类</h3>
        <div class="regionsLIst">
          <el-row class="btn-Wrap">
            <el-button icon="el-icon-plus" type="primary" plain @click="addCat">添加</el-button>
          </el-row>
          <!-- 表单-头 -->
          <el-table
            v-loading='tableLoading'
            :data="catList"
            style="width: 100%">
            <el-table-column label="名称" align='center' width="">
                <template slot-scope="scope">
                  <div class='nameBox'>
                    <div class="nameStyle" :style="{marginLeft:scope.row.lay * 80 - 80 + 'px'}">
                      <el-button v-if="scope.row.goodsCatChildren" @click="getChildList(scope.row,scope.$index)" style="width:50px" type="text"><span>【<i :class="[!scope.row.isExpansion ? 'el-icon-plus' : 'el-icon-minus']"></i>】</span></el-button><span>{{scope.row.catName}}</span>
                    </div>
                    <el-button v-if="scope.row.lay <= 2" type="text" @click="toAddChirldCat(scope.row)" border icon='el-icon-circle-plus'>添加下级分类</el-button>
                  </div>
                </template>
            </el-table-column>
            <el-table-column  prop="sort" label="排序" align='center' width="100"></el-table-column>
            <el-table-column  prop="isOpen" label="启用" align='center' width="100">
              <template slot-scope="scope">
                <div class="hotCheck">
                  <el-checkbox @change="toOpen($event, scope.row)" v-model="scope.row.isOpen"></el-checkbox>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="热门分类" align='center' width="100">
              <template slot-scope="scope">
                <div v-if="scope.row.lay > 2" class="hotCheck">
                  <el-checkbox @change="toHot($event, scope.row)" v-model="scope.row.is_hot"></el-checkbox>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" align='center' width="300px">
              <template slot-scope="scope">
                <span class="v-blue v-text-cursor" @click="goEdit(scope.row)">编辑</span>
                <i class="v-blue v-separator" >|</i>
                <span class="v-red v-text-cursor" @click="toDel(scope.row)">删除</span>
                <i class="v-blue v-separator" v-if="+scope.row.lay === 2">|</i>
                <span v-if="+scope.row.lay === 2" class="v-blue v-text-cursor" @click="goAppraise(scope.row)">评价引导词设置</span>
              </template>
            </el-table-column>
          </el-table>
          <!-- 表单-尾 -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      tableLoading: false,
      // 分类列表
      catList: []
    }
  },
  created () {
    // this.getList()
    this.getCatList()
  },
  methods: {
    // 获得分类列表
    async getCatList () {
      this.tableLoading = true
      let res = await this.$post('goodscat/list.do', {})
      this.tableLoading = false
      if (parseInt(res.code) === 1) {
        res.data.goodsCatList.map((first, index) => {
          // 设置是否热门
          first.is_hot = ''
          first.isExpansion = false
          first.isOpen = !!(+first.isOpen)
          first.lay = 1
          first.path = index + ''
          if (!first.goodsCatChildren || !first.goodsCatChildren.length) {
            delete first.goodsCatChildren
            return
          }
          first.goodsCatChildren.map((second, index2) => {
            // 设置是否热门
            second.is_hot = ''
            second.isOpen = !!(+second.isOpen)
            second.lay = first.lay + 1
            second.isExpansion = false
            second.path = first.path + '-' + index2
            if (!second.goodsCatChildren || !second.goodsCatChildren.length) {
              delete second.goodsCatChildren
              return
            }
            second.goodsCatChildren.map((third, index3) => {
              // 设置是否热门
              third.is_hot = ''
              third.isOpen = !!(+third.isOpen)
              third.lay = second.lay + 1
              third.isExpansion = false
              third.path = second.path + '-' + index3
              if (!third.goodsCatChildren || !third.goodsCatChildren.length) {
                delete third.goodsCatChildren
                return
              }
              third.goodsCatChildren.map((forth, index4) => {
                // 设置是否热门
                forth.is_hot = ''
                forth.isOpen = !!(+forth.isOpen)
                forth.lay = third.lay + 1
                forth.isExpansion = false
                forth.path = third.path + '-' + index4
                if (!forth.goodsCatChildren || !forth.goodsCatChildren.length) {
                  delete forth.goodsCatChildren
                }
              })
            })
          })
        })
        this.catList = res.data.goodsCatList
      }
    },
    // 是否启用
    async toOpen (val, cat) {
      // console.log(val)
      // console.log(cat)
      let reqData = {
        cat_id: cat.catId,
        is_open: Number(val)
      }
      let res = await this.$post('goodscat/isOpen.do', reqData)
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
    // 是否开启热门
    async toHot (val, cat) {
      console.log(val)
      console.log(cat)
      let reqData = {
        cat_id: cat.catId,
        is_hot: Number(val)
      }
      let res = await this.$post('goodscat/isHot.do', reqData)
      if (+res.code === 1) {
        if (val) {
          this.$message.success('开启热门成功')
        } else {
          this.$message.success('关闭热门成功')
        }
      } else {
        this.$message.error(res.message)
      }
    },
    // 获取子列表-实现层次呈现
    getChildList (child, index) {
      if (!child.isExpansion) {
        if (child.goodsCatChildren && child.goodsCatChildren.length > 0) {
          // console.log('aaa')
          this.catList[index].isExpansion = true
          child.goodsCatChildren.forEach((item, index2) => {
            this.catList.splice(index + 1 + index2, 0, item)
          })
        }
      } else {
        var rg = new RegExp('^' + child.path + '-')
        this.catList[index].isExpansion = false
        var arr = this.catList.filter((child, idx) => {
          return !rg.test(child.path)
        })
        var delArr = this.catList.filter((child, idx) => {
          return rg.test(child.path)
        })
        delArr.forEach(item => {
          item.isExpansion = false
        })
        this.catList = arr
      }
    },
    // 删除
    async toDel (val) {
      // console.log(val)
      let reqData = {}
      reqData.cat_id = val.catId
      this.$confirm('分类删除不可恢复，请确定', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let res = await this.$post('goodscat/falseDelete.do', reqData)
        if (+res.code === 1) {
          this.$message.success('删除成功')
        } else {
          this.$confirm(res.message, '提示', {
            cancelButtonText: '确定',
            confirmButtonText: '查看商品',
            type: 'warning'
          }).then(() => {
            this.$router.push(`/goods/goods/goodsList?catId=${val.catId}&parentId=${val.parentId}`)
          })
        }
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    // 添加分类
    addCat () {
      this.$router.push('/goods/goodsCat/goodsCatSet?saveOrEdit=save')
    },
    // 保存
    toAdd () {
      let reqData = {}
      reqData = {
        short_name: this.dialogData.parent_name,
        name: this.dialogData.regions.name
      }
      this.$confirm('分类删除不可恢复，请确定', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let res = await this.$post('regions/save.do', reqData)
        if (parseInt(res.code) === 1) {
          this.$message.success('保存成功')
          this.getList()
        } else {
          this.$message.error(res.data.message)
        }
      }).catch(() => {
        this.$message.info('已取消删除')
      })
      // console.log(reqData)
    },
    // 新增下级（新增）
    toAddChirldCat (val) {
      this.$router.push(`/goods/goodsCat/goodsCatSet?saveOrEdit=save&catId=${val.catId}&parentId=${val.parentId}`)
    },
    // 编辑分类
    goEdit (val) {
      this.$router.push(`/goods/goodsCat/goodsCatSet?saveOrEdit=edit&EdCatId=${val.catId}&catId=${val.catId}&parentId=${val.parentId}`)
    },
    // 评价引导设置
    goAppraise (val) {
      this.$router.push(`/goods/goodsCat/appraiseSet?catId=${val.catId}`)
    },
    // 编辑上传修改
    async toEdit () {
      let reqData = {id: this.dialogData.regions.id, name: this.dialogData.regions.name}
      let res = await this.$post('regions/edit.do', reqData)
      if (parseInt(res.code) === 1) {
        this.$message.success('修改成功')
        this.getList()
      } else {
        this.$message.error(res.data.message)
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
    // padding: 0 50px;
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
  .nameStyle{
      display: flex;
      align-items: center;
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
