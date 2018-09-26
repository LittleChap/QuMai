<!-- 问卷调查 编辑 -->
<template>
  <div>

    <div class="detailTable">
      <el-row class="btn-Wrap">
        <el-button icon="el-icon-plus" type="primary" plain @click="toAddModule">添加</el-button>
        <el-button icon="el-icon-minus" type="warning" plain @click="multiDelete">删除</el-button>
      </el-row>
      <!--表格正文-->
      <el-table :data="data" v-loading="mainLoading" style="width: 100%"
                @selection-change="handleSelectionChange">
        <el-table-column align="center" type="selection" width="55"></el-table-column>
        <el-table-column align="center" prop="id" label="id" width="55"></el-table-column>
        <el-table-column align="center" label="问卷标题">
          <template slot-scope="scope">
            {{scope.row.moduleType === 1 || scope.row.moduleType === 9 ? '-' : scope.row.title}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="模块类型">
          <template slot-scope="scope">
            {{renderModuleType(scope.row.moduleType)}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="排序">
          <template slot-scope="scope">
            <i class="el-icon-back r90" v-if="scope.$index !== 0"
               @click="editSort(scope.$index, 'up')"></i>
            <i class="sortIcon el-icon-download r180" v-if="scope.$index !== 0"
               @click="editSort(scope.$index, 'top')"></i>
            <i class="el-icon-back r270" v-if="scope.$index !== data.length - 1"
               @click="editSort(scope.$index, 'down')"></i>
            <i class="sortIcon el-icon-download" v-if="scope.$index !== data.length - 1"
               @click="editSort(scope.$index, 'bottom')"></i>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <span class="v-blue v-text-cursor" @click="toEditModule(scope.row)">编辑</span>
            <span class="v-red v-text-cursor" @click="singleDelete(scope.row)">删除</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <Modules v-model="showModulesDialog" v-if="showModulesDialog" :id="currentRow.id" @success="moduleAdded"></Modules>
  </div>
</template>
<script>
import Modules from './Modules'

export default {
  name: 'questionnaire-edit',
  components: {Modules},
  data () {
    return {
      mainLoading: false, // 全局加载状态
      showModulesDialog: false, // 显示模块编辑对话框
      currentRow: {}, // 当前问题
      multiSelect: [], // 表格选中项
      // 模块类型
      moduleTypes: [
        {value: 1, label: '富文本模块'},
        {value: 2, label: '日期模块'},
        {value: 3, label: '文本模块'},
        {value: 4, label: '手机号模块'},
        {value: 5, label: '邮箱模块'},
        {value: 6, label: '地址模块'},
        {value: 7, label: '图片投票模块'},
        {value: 8, label: '文本投票模块'},
        {value: 9, label: '分页模块'}
      ]
    }
  },
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  created () {
  },
  methods: {
    // 跳转到新增页
    toAddModule () {
      this.currentRow = {}
      this.showModulesDialog = true
    },
    // 跳转到编辑页
    toEditModule (row) {
      this.currentRow = row
      this.showModulesDialog = true
    },
    // 模块添加成功回调
    moduleAdded (module) {
      if (module.isEdit) {
        delete module.isEdit
        this.data.map((i, idx) => {
          if (i.id === module.id) this.data.splice(idx, 1, module)
        })
        this.updateList(module)
      } else {
        module.sort = this.data.length
        this.data.push(module)
      }
      this.showModulesDialog = false
    },
    // 回显 模块类型
    renderModuleType (id) {
      let m = this.moduleTypes.find(i => i.value === id) || {label: ''}
      return m.label
    },
    // 编辑序号
    async editSort (idx, method) {
      switch (method) {
        case 'up':
          if (idx > 0) {
            let tmp = this.data[idx].sort
            this.data[idx].sort = this.data[idx - 1].sort
            this.data[idx - 1].sort = tmp
          }
          break
        case 'down':
          if (idx < this.data.length - 1) {
            let tmp = this.data[idx].sort
            this.data[idx].sort = this.data[idx + 1].sort
            this.data[idx + 1].sort = tmp
          }
          break
        case 'top':
          if (idx > 0) {
            this.data[idx].sort = this.data[0].sort - 1
          }
          break
        case 'bottom':
          if (idx < this.data.length - 1) {
            this.data[idx].sort = this.data[this.data.length - 1].sort + 1
          }
          break
      }
      // 排序
      this.data.sort((a, b) => { return a.sort - b.sort })
    },
    // 列表项选择
    handleSelectionChange (val) {
      this.multiSelect = val
    },
    // 删除
    toDelete (rows) {
      if (!rows.length) {
        this.$message.error('请选择数据')
        return
      }
      let num = rows.length === 1 ? '' : rows.length
      this.$confirm(`确认删除这${num}个问题？`).then(async () => {
        let url = 'questionnaireSurveyItem/del.do'
        let ids = rows.map(item => {
          return item.id
        })
        let body = {ids: ids.join(',')}
        let res = await this.$post(url, body)
        if (+res.code === 1) {
          this.$message.success('已删除!')
          // 更新列表(过滤掉已被删除的选项)
          let tmp = Array.from(this.data)
          this.data.length = 0
          tmp.forEach(item => {
            let result = true
            rows.forEach(i => {
              if (i.id === item.id) result = false
            })
            if (result) this.data.push(item)
          })
        }
      }).catch(() => {
      })
    },
    // 单条删除
    singleDelete (row) {
      this.toDelete([row])
    },
    // 多行删除
    multiDelete () {
      this.toDelete(this.multiSelect)
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import '~@/styles/common.scss';
  .r90 {
    font-size: 17px;
    transform: rotate(90deg);
  }
  .r180 {
    transform: rotate(180deg);
  }
  .r270 {
    font-size: 17px;
    transform: rotate(270deg);
  }
  .sortIcon {
    font-size: 20px;
  }
  .detailTable {
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
