<template>
  <div>
    <el-table
      v-loading="loading"
      :data="tableData">
      <el-table-column
        prop="storeName"
        label="自提门店"/>
      <el-table-column
        prop="takeCode"
        align="center"
        label="提货码"/>
      <el-table-column
        align="center"
        label="验证结果">
        <template slot-scope="{row}">
          {{ row.takeStatus > 0 ? '通过' : '未通过' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="createAt"
        align="center"
        label="操作人"/>
      <el-table-column
        prop="createTime"
        align="center"
        label="验证时间"/>
      <el-table-column
        align="center"
        label="操作">
        <template slot-scope="{row}">
          <el-button
            size="mini"
            type="text"
            @click="viewDetail(row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <div class="g-pagination-wrap">
      <el-pagination
        :current-page="pagination.pageNum"
        :page-sizes="$store.state.app.pageSizes"
        :page-size="pagination.pageSize"
        :total="pagination.total"
        :layout="$store.state.app.layout"
        @size-change="sizeChange"
        @current-change="handlePageChange"
      />
    </div>

    <el-dialog
      :visible.sync="dialogVisible"
      class="take-detail-dialog"
      width="800px"
      title="自提记录详情">
      <el-form :inline="true">
        <div class="title mb10">基本信息</div>
        <el-form-item
          label="自提门店："
          style="width: 45%; margin-bottom: 0;">{{ takeInfo.storeName }}
        </el-form-item>
        <el-form-item
          label="提货码："
          class="mb5"
          style="width: 45%; margin-bottom: 0;">{{ takeInfo.takeCode }}
        </el-form-item>
        <el-form-item
          label="操作人："
          style="width: 45%; margin-bottom: 0;">{{ takeInfo.createAt }}
        </el-form-item>
        <el-form-item
          label="验证时间："
          style="width: 45%; margin-bottom: 0;">{{ takeInfo.createTime }}
        </el-form-item>
      </el-form>

      <div class="title mb10 mt20">商品信息</div>
      <el-table :data="takeInfo.list" >
        <el-table-column
          :show-overflow-tooltip="true"
          prop="productName"
          label="商品名称"/>
        <el-table-column
          prop="productCode"
          align="center"
          label="货号"/>
        <el-table-column
          prop="specContent"
          align="center"
          label="规格"/>
        <el-table-column
          prop="number"
          align="center"
          label="商品数量"/>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import * as ApiStores from '@/api/stores'

export default {
  name: 'StoreTakeList',
  data () {
    return {
      loading: true,
      tableData: [],
      pagination: {
        pageNum: 1,
        total: 0,
        pageSize: 10
      },
      takeInfo: '',
      dialogVisible: false
    }
  },

  created () {
    this.getList()
  },

  methods: {
    sizeChange (e) {
      this.pagination.pageSize = e
      this.getList()
    },
    handlePageChange (page) {
      this.pagination.pageNum = page
      this.getList()
    },
    getList () {
      this.loading = true
      ApiStores.takeList({
        pageNum: this.pagination.pageNum,
        pageSize: this.pagination.pageSize
      }).then(({ dataList, totalCount }) => {
        this.tableData = dataList || []
        this.pagination.total = totalCount || 0
        this.loading = false
      })
    },
    viewDetail ({ takeCode }) {
      ApiStores.takeInfo({ takeCode }).then((data) => {
        this.dialogVisible = true
        this.takeInfo = data || {}
      })
    }
  }
}
</script>

<style lang="scss" scope>
  .take-detail-dialog {
    .title {
      font-size: 16px;
      color: #303133;
      font-weight: bold;
      line-height: 18px;
      border-left: 4px solid #5889ff;
      padding-left: 12px;
    }
  }
</style>
