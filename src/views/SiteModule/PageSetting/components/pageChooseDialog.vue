<!-- 页面选择器 -->
<template>
  <!--  选择页面弹窗 -->
  <el-dialog title="选择页面" :visible="value" class="v-dialog" width="900px" top="12vh" @close="beforeClose" :close-on-click-modal="false">
    <el-form :model="formData" :inline="true" label-width="70px" class="v-form" @submit.native.prevent>
      <el-form-item label="页面ID">
        <el-input v-model=" formData.pageId" :maxlength="10" style="width: 300px" @keyup.enter.native="toSearch"> </el-input>
      </el-form-item>
      <el-form-item label="页面名称">
        <el-input v-model=" formData.name" :maxlength="50" style="width: 300px" @keyup.enter.native="toSearch"> </el-input>
      </el-form-item>
      <el-form-item label-width="10px">
        <el-button  @click="toSearch">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="pageList" style="width: 100%" v-loading="mainLoading">
      <el-table-column align="center" width="55px">
        <template slot-scope="scope">
          <label role="checkbox" aria-checked="true" class="el-checkbox" @click="toCheck(scope.row)">
            <span aria-checked="mixed" class="el-checkbox__input" :class="{'is-checked': isCheck(scope.row)}">
              <span class="el-checkbox__inner"></span>
            </span>
          </label>
          <!--<el-checkbox v-model="scope.row.isChecked" @change="toCheck(scope.row)"> </el-checkbox>-->
        </template>
      </el-table-column>
      <el-table-column align="center" prop="page_id" label="页面ID" width="120px"> </el-table-column>
      <el-table-column align="center" prop="name" label="页面名称"> </el-table-column>
      <el-table-column align="center" prop="create_time" label="创建时间">
        <template slot-scope="scope">
          {{scope.row.create_time ? $moment(scope.row.create_time).format('YYYY.MM.DD  HH:mm:ss') : ''}}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="modify_time" label="最后修改时间">
        <template slot-scope="scope">
          {{scope.row.modify_time ? $moment(scope.row.modify_time).format('YYYY.MM.DD  HH:mm:ss') : ''}}
        </template>
      </el-table-column>
    </el-table>
    <div class="v-pageBox" v-if="formData.totalResult">
      <!--:page-sizes="[5, 10, 15]"-->
      <el-pagination
         :current-page.sync="formData.currentPage"
         layout="total, prev, pager, next, jumper"
         :page-size="formData.showCount"
         @current-change="handleCurrentChange"
         @size-change="handleSizeChange"
         :total="formData.totalResult">
      </el-pagination>
    </div>
    <div slot="footer" class="v-dialog-footer">
      <el-button type="primary" @click="toSave">确 定</el-button>
      <el-button @click="beforeClose">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'page-choose-dialog',
  props: {
    chooseId: { // 选中的id ，用逗号隔开
      type: String,
      default: ''
    },
    chooseSingle: { // 是否单选
      type: Boolean,
      default: false
    },
    value: false // 显示与否
  },
  data () {
    return {
      pageList: [], // 页面列表
      mainLoading: false, // 加载页面
      choosePageIdArr: new Map(), // 选中的pageId数组
      formData: { // 请求参数
        isPublish: 1,
        name: '',
        pageId: '',
        currentPage: 1,
        showCount: 8,
        totalResult: 10
      }
    }
  },
  created () {
    if (!this.pageList.length) {
      this.getList()
    }
  },
  methods: {
    // 获得列表
    async getList () {
      let reqData = Object.assign({}, this.formData)
      delete reqData.totalResult
      this.mainLoading = true
      let res = await this.$post('pages/list.do', reqData)
      this.mainLoading = false
      if (parseInt(res.code) === 1) {
        this.pageList = res.data.pagesList
        this.formData.totalResult = res.data.page.totalResult
        // this.toSetCheck()
      }
    },
    // 点击选中
    toCheck (item) {
      let isChecked = !this.isCheck(item)
      if (!isChecked) { // 取消选中
        this.choosePageIdArr.delete(item.page_id)
        // this.toSetCheck()
        this.pageList = JSON.parse(JSON.stringify(this.pageList))
        return
      }
      // 选中
      if (this.chooseSingle) { // 单选 清掉其他数据
        this.choosePageIdArr.clear()
      }
      this.choosePageIdArr.set(item.page_id, item)
      this.pageList = JSON.parse(JSON.stringify(this.pageList))
      // this.choosePageIdArr.add(item.page_id)
      // this.toSetCheck()
    },
    // 判断是否选中
    isCheck (row) {
      if (this.choosePageIdArr.has(row.page_id)) {
        this.choosePageIdArr.set(row.page_id, row)
      }
      return this.choosePageIdArr.has(row.page_id)
    },
    // 设置选中与 未选中
    // toSetCheck () {
    //   let idArr = [...this.choosePageIdArr]
    //   this.pageList.map(item => {
    //     item.isChecked = false
    //     idArr.map(id => {
    //       if (Number(id) === Number(item.page_id)) {
    //         item.isChecked = true
    //         return false
    //       }
    //     })
    //   })
    //   this.pageList = JSON.parse(JSON.stringify(this.pageList))
    // },
    // 关闭弹窗
    beforeClose () {
      this.$emit('input', false)
      // this.toClear()
    },
    // 保存数据
    toSave () {
      if (!this.choosePageIdArr.size) {
        this.$message.error('请选择数据')
        return
      }
      // console.log('数据', this.choosePageIdArr.entries())
      let chooseArr = [] // 对象数组
      let chooseIds = [] // goodsId 数组
      this.choosePageIdArr.forEach((value, key) => {
        chooseIds.push(key)
        chooseArr.push(value)
      })
      this.$emit('success', chooseIds, chooseArr)
      this.$emit('input', false)
      // let idArr = [...this.choosePageIdArr]
      // this.$emit('success', idArr.join(','))
      // this.$emit('input', false)
      // this.toClear()
    },
    // 清楚数据
    toClear () {
      this.choosePageIdArr.clear()
      this.formData = { // 请求参数
        isPublish: 1,
        name: '',
        pageId: '',
        currentPage: 1,
        showCount: 5,
        totalResult: 10
      }
      this.getList()
      // this.toSetCheck()
    },
    // 查询
    toSearch () {
      this.formData.currentPage = 1
      this.getList()
    },
    // 当前页-页码修改
    handleCurrentChange (val) {
      this.formData.currentPage = val
      this.getList()
    },
    // 当前显示数量修改
    handleSizeChange (size) {
      this.formData.showCount = size
      this.formData.currentPage = 1
      this.getList()
    }
  },
  watch: {
    value (newValue, oldValue) {
      if (newValue) {
        this.toClear()
      }
      if (newValue && this.chooseId && this.chooseId !== '') { // 显示的时候
        let chooseArr = this.chooseId.split(',')
        this.choosePageIdArr = new Map()
        chooseArr.map(data => {
          this.choosePageIdArr.set(Number(data), {page_id: +data})
        })
      }
      // if (newValue && this.chooseId && this.chooseId !== '') { // 显示的时候
      //   let chooseArr = this.chooseId.split(',')
      //   let chooseIntArr = []
      //   chooseIntArr = chooseArr.map(data => {
      //     return +data
      //   })
      //   this.choosePageIdArr = new Set(new Set(chooseIntArr))
      //   this.toSetCheck()
      // }
    }
  }
}
</script>

<style scoped>

</style>
