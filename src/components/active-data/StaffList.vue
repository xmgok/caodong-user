<template>
  <div>
    <el-table
      :data="dataList"
      class="mt20">
      <el-table-column
        :show-overflow-tooltip="true"
        label="导购名字"
        align="center">
        <template slot-scope="scope">
          {{ scope.row.empName }}
        </template>
      </el-table-column>
      <el-table-column
        label="所属门店"
        align="center">
        <template slot-scope="scope">
          {{ scope.row.storeName }}
        </template>
      </el-table-column>
      <el-table-column
        label="转发次数"
        align="center">
        <template slot-scope="scope">
          {{ scope.row.transferNumber }}
        </template>
      </el-table-column>
      <el-table-column
        label="打开数"
        align="center">
        <template slot-scope="scope">
          {{ scope.row.openNumber }}
        </template>
      </el-table-column>
      <el-table-column
        label="参与人数"
        align="center">
        <template slot-scope="scope">
          {{ scope.row.customerNumber }}
        </template>
      </el-table-column>
      <el-table-column
        label="成交订单数"
        align="center">
        <template slot-scope="scope">
          {{ scope.row.orderNumber }}
        </template>
      </el-table-column>
      <el-table-column
        label="销售总金额"
        align="center">
        <template slot-scope="scope">
          ￥{{ scope.row.orderAmount }}
        </template>
      </el-table-column>
    </el-table>
    <div class="g-pagination-wrap">
      <el-pagination
        :current-page="search.pageNum"
        :page-sizes="$store.state.app.pageSizes"
        :page-size="search.pageSize"
        :total="search.totalCount"
        :layout="$store.state.app.layout"
        @size-change="sizeChange"
        @current-change="pageChange" />
    </div>
  </div>
</template>

<script>
import * as ApiGroup from '@/api/group'

export default {
  name: 'StaffList',
  props: {
    storeId: {
      type: Number,
      default: 0
    },
    companyId: {
      type: Number,
      default: 0
    },
    activeId: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      dataList: [],
      search: {
        pageNum: 1,
        totalCount: 0,
        pageSize: 10
      }
    }
  },
  watch: {
    storeId () {
      this.search.pageNum = 1
      this.getList()
    },
    companyId () {
      this.search.pageNum = 1
      this.getList()
    },
    activeId () {
      this.getList()
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      ApiGroup.reportinfo({
        ...this.search,
        storeId: this.storeId || undefined,
        companyId: this.companyId || undefined,
        type: 2,
        groupId: this.activeId || undefined
      }).then(({ data }) => {
        this.dataList = data.dataList || []
        this.search.totalCount = data.totalCount || 0
      })
    },
    sizeChange (e) {
      this.search.pageSize = e
      this.getList()
    },
    pageChange (e) {
      this.search.pageNum = e
      this.getList()
    }
  }
}
</script>

<style scoped lang="scss">

</style>
