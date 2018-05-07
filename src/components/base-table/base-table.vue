<template>
  <div class="app-container">
    <!--elui表格-->
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
      <!--索引区域-->
      <el-table-column align="center" label='ID' width="95">
        <template slot-scope="scope">
          {{scope.$index}}
        </template>
      </el-table-column>
      <!--内容td区域-->
      <el-table-column v-for="(item, index) in columns" :key="index"
                       :label='item.value'
                       :prop="item.key"
                        v-if="item.show"
                       :width="item.width"
      >
        <template slot-scope="scope">
          <el-tag v-if="item.key === 'status'" :type="scope.row.status | statusFilter">{{scope.row.status}}</el-tag>
          <span v-if="item.key !== 'status' && item.key !== 'display_time'">{{scope.row[item.key]}}</span>
          <span v-if="item.key === 'display_time'">{{scope.row[item.key] | formatDate('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <!--按钮区域-->
      <el-table-column v-if="buttons.length" align="center" label="操作" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-for="(item, index) in buttons"
                     :key="index"
                     :type="item.type"
                     size="mini"
                     v-html="item.value"
                     @click="selectItem(scope.row, item.key)"
          >
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="listQuery.page"
                     :page-sizes="[10,20,30, 50]"
                     :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="pageTotal">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { parseTime } from '@/utils/index'

export default {
  props: {
    list: {
      type: Array,
      default: []
    },
    columns: {
      type: Array,
      default: []
    },
    listLoading: {
      type: Boolean,
      default: true
    },
    buttons: {
      type: Array,
      default: []
    },
    listQuery: {
      type: Object,
      default: {}
    },
    pageTotal: {
      type: Number,
      default: 0
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    // 时间格式化
    formatDate(data, cFormat) {
      const timeData = new Date(data).getTime()
      return parseTime(timeData, cFormat)
    }
  },
  methods: {
    selectItem(row, type) {
      this.$emit('select', row, type)
    },
    handleSizeChange(val) {
      this.$emit('pageSizeChange', val)
    },
    handleCurrentChange(val) {
      this.$emit('currentChange', val)
    }
  }
}
</script>
