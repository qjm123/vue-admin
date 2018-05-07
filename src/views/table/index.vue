<template>
  <div class="app-container">
    <!--引入基础表单搜索控件-->
    <base-searchform @createItem="clickCreate" :listQuery="listQuery"></base-searchform>
    <!--引入基础表格组件-->
    <base-table :list="list"
                :columns="columns"
                :listLoading="listLoading"
                :buttons="buttons"
                @select="clickRowBtn"
                :listQuery = "listQuery"
                :pageTotal = "pageTotal"
                @pageSizeChange = "pageSizeChange"
                @currentChange = "currentChange"
    >
    </base-table>
    <!--引入dialog基础组件-->
    <base-dialog :title="dialogTitle" ref="dialog" @confirm="confirm">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
        <!--<el-form-item label="选择" prop="type">-->
          <!--<el-select class="filter-item" v-model="temp.type" placeholder="Please select">-->
            <!--<el-option v-for="(item, index) in  calendarTypeOptions" :key="index" :label="item.display_name" :value="item.key">-->
            <!--</el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <el-form-item label="时间" prop="display_time">
          <el-date-picker v-model="temp.display_time" type="datetime" placeholder="请选择时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="temp.title"></el-input>
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="temp.author"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select class="filter-item" v-model="temp.status" placeholder="请选择">
            <el-option v-for="item in  statusOptions" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </base-dialog>
  </div>
</template>

<script>
import BaseTable from '@/components/base-table/base-table'
import BaseDialog from '@/components/base-dialog/base-dialog'
import BaseSearchform from '@/components/base-searchform/base-searchform'

import { getList } from '@/api/table'
import { editArray } from '@/common/js/catch'

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      columns: [
        {
          index: 0,
          key: 'id',
          value: 'ID',
          width: '',
          show: false
        },
        {
          index: 1,
          key: 'title',
          value: '标题',
          width: '',
          show: true
        },
        {
          index: 2,
          key: 'author',
          value: '作者',
          width: '110',
          show: true
        },
        {
          index: 3,
          key: 'pageviews',
          value: '浏览数',
          width: '110',
          show: true
        },
        {
          index: 4,
          key: 'status',
          value: '状态',
          width: '110',
          show: true
        },
        {
          index: 5,
          key: 'display_time',
          value: '时间',
          width: '200',
          show: true
        }
      ],
      buttons: [
        {
          key: 'edit',
          value: '编辑',
          type: 'primary'
        },
        {
          key: 'publish',
          value: '发布',
          type: 'success'
        },
        {
          key: 'delete',
          value: '删除',
          type: 'danger'
        }
      ],
      dialogTitle: '',
      // 每一行的对象，初始状态，
      temp: {
        author: '',
        display_time: new Date(),
        id: undefined,
        pageviews: 0,
        status: 'draft',
        title: ''
      },
      // 搜索参数，分页参数
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      statusOptions: ['published', 'draft', 'deleted'],
      // 表单规则
      rules: {
        title: [{ required: true, message: 'title is required', trigger: 'blur' }],
        display_time: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        author: [{ required: true, message: 'author is required', trigger: 'blur' }]
      },
      addType: true,
      currentRow: {},
      pageTotal: 0
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    pageSizeChange(val) {
      this.listQuery.limit = val
      this.fetchData()
    },
    currentChange(val) {
      this.listQuery.page = val
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        console.log(response)
        this.list = response.data.items
        this.pageTotal = response.data.total
        this.listLoading = false
      })
    },
    // 重置填充添加表单
    resetTemp() {
      this.temp = {
        id: undefined,
        display_time: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    // 添加一行数据
    clickCreate() {
      this.addType = true
      this.resetTemp()
      this.dialogTitle = '登记项目'
      this.$refs.dialog.show()
    },
    // 点击本行按钮，判断行为
    clickRowBtn(row, type) {
      console.log(type)
      if (type === 'edit') {
        this.addType = false
        this.currentRow = row
        this.temp = Object.assign({}, this.temp, row)
        this.temp.display_time = new Date(row.display_time)
        console.log(this.temp)
        this.dialogTitle = '模态框标题'
        this.$refs.dialog.show()
      } else if (type === 'publish') {
        this.$confirm('此操作将提交本条数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '提交成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消提交'
          })
        })
      } else if (type === 'delete') {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    },
    confirm() {
      this.$refs['dataForm'].validate((valid) => {
        console.log(valid)
        if (valid) {
          console.log(this.temp)
          if (this.addType) {
            this.list.unshift(this.temp)
          } else {
            const value = Object.assign({}, this.currentRow, this.temp)
            editArray(this.list, value)
          }
          this.$refs.dialog.hide()
          this.$notify({
            title: '成功',
            message: '创建成功',
            type: 'success',
            duration: 2000
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  },
  components: {
    BaseTable,
    BaseDialog,
    BaseSearchform
  }
}
</script>
