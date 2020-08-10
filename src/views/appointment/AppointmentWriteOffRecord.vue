<template>
  <div>
    <el-tabs type="border-card">
      <!--条件筛选-->
      <div
        class="ui-search-header-block dark">
        <el-form
          :inline="true"
          label-width="80px">
          <select-store
            style="display: inline-block; margin-bottom: 10px"
            labelwidth="80px"
            selectwidth="250px"
            @change="changeSelectStore" />
        </el-form>
        <el-button
          class="btn-search"
          type="primary"
          icon="el-icon-search"
          @click="searchFn"
        >搜索
        </el-button>
      </div>
      <el-table
        v-loading="loading"
        :data="tableData">
        <el-table-column
          :show-overflow-tooltip="true"
          width="200"
          align="center"
          label="预约码">
          <template slot-scope="{row}">
            {{ row.code }}
          </template>
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          align="center"
          label="分公司">
          <template slot-scope="{row}">
            {{ row.companyName }}
          </template>
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          align="center"
          label="门店">
          <template slot-scope="{row}">
            {{ row.storeName }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="验证结果">
          <template slot-scope="{row}">
            {{ row.result }}
          </template>
        </el-table-column>
        <el-table-column
          prop="verifyAt"
          align="center"
          label="操作人" />
        <el-table-column
          prop="verifyTime"
          align="center"
          label="验证时间" />
        <el-table-column
          align="center"
          label="操作">
          <template slot-scope="{row}">
            <el-button
              size="mini"
              type="text"
              @click="viewDetail(row)">查看
            </el-button>
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
          @current-change="pageChange"
        />
      </div>
      <el-dialog
        :visible.sync="dialogVisible"
        class="take-detail-dialog"
        width="800px"
        title="预约记录详情">
        <el-form :inline="true">
          <div class="title mb10">基本信息</div>
          <el-form-item
            label="分公司："
            style="width: 45%; margin-bottom: 0;">{{ takeInfo.companyName }}
          </el-form-item>
          <el-form-item
            label="门店："
            style="width: 45%; margin-bottom: 0;">{{ takeInfo.storeName }}
          </el-form-item>
          <el-form-item
            label="客户姓名："
            style="width: 45%; margin-bottom: 0;">{{ takeInfo.userName }}
          </el-form-item>
          <el-form-item
            label="手机号："
            style="width: 45%; margin-bottom: 0;">{{ takeInfo.mobile }}
          </el-form-item>
          <el-form-item
            label="预约码："
            style="width: 45%; margin-bottom: 0;">{{ takeInfo.code }}
          </el-form-item>
          <el-form-item
            label="操作人："
            style="width: 45%; margin-bottom: 0;">{{ takeInfo.verifyAt }}
          </el-form-item>
          <el-form-item
            label="验证时间："
            style="width: 45%; margin-bottom: 0;">{{ takeInfo.verifyTime }}
          </el-form-item>
        </el-form>

        <div class="title mb10 mt20">项目信息</div>
        <el-table :data="takeInfo.serviceList ">
          <el-table-column
            :show-overflow-tooltip="true"
            prop="serviceName"
            label="项目名称" />
          <el-table-column
            :show-overflow-tooltip="true"
            prop="servicePrice"
            align="center"
            label="项目价格" />
        </el-table>
      </el-dialog>
    </el-tabs>
  </div>
</template>

<script>
import * as ApiStores from '@/api/booking'
import SelectStore from '@/components/SelectStore'

export default {
  name: 'AppointmentWriteOffRecord',
  components: { SelectStore },
  data () {
    return {
      search: {
        companyId: '',
        storeId: ''
      },
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
    changeSelectStore (val) {
      this.search.storeId = val.storeId || ''
      this.search.companyId = val.companyId || ''
    },
    getList () {
      this.loading = true
      ApiStores.takeList({
        ...this.search,
        pageNum: this.pagination.pageNum,
        pageSize: this.pagination.pageSize
      }).then(({ dataList, totalCount }) => {
        this.tableData = dataList || []
        this.pagination.total = totalCount || 0
        this.loading = false
      })
    },
    viewDetail ({ code }) {
      ApiStores.takeInfo({ code }).then((data) => {
        this.dialogVisible = true
        this.takeInfo = data || {}
      })
    },
    sizeChange (e) {
      this.search.pageSize = e
      this.getList()
    },
    pageChange (e) {
      this.search.pageNum = e
      this.getList()
    },
    searchFn () {
      this.search.pageNum = 1
      this.getList()
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
