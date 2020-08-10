<template>
  <div class="page-seller-management">
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
        <el-form-item label="任务名称">
          <el-input
            v-model="search.taskName"
            placeholder="请输入"
            class="width1" />
        </el-form-item>
        <el-form-item label="员工姓名">
          <el-input
            v-model="search.name"
            placeholder="请输入"
            class="width1" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input
            v-model="search.mobile"
            placeholder="请输入"
            class="width1" />
        </el-form-item>
      </el-form>
      <el-button
        class="btn-search"
        type="primary"
        icon="el-icon-search"
        @click="searchFn"
      >搜索
      </el-button>
    </div>
    <div
      class="ui-search-header-block dark bt-dashed pb10 pr10 flex flex-jc-end">
      <el-date-picker
        v-model="time"
        :default-time="['00:00:00', '23:59:59']"
        value-format="yyyy-MM-dd HH:mm:ss"
        type="datetimerange"
        size="small"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期" />
      <el-button
        class="btn-export ml10"
        type="primary"
        size="small"
        @click="detailExport"
      >金币明细导出
      </el-button>
    </div>
    <el-table
      :data="dataList"
      class="mt20">
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        label="任务名称">
        <template slot-scope="{row}">
          {{ row.taskName }}
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        width="200"
        align="center"
        label="任务步骤">
        <template slot-scope="{row}">
          {{ row.taskStep }}
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        label="员工姓名">
        <template slot-scope="{row}">
          {{ row.name }}
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        label="手机号">
        <template slot-scope="{row}">
          {{ row.mobile }}
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
        :show-overflow-tooltip="true"
        align="center"
        label="获得金币">
        <template slot-scope="{row}">
          {{ row.gold }}
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        label="获得金币时间">
        <template slot-scope="{row}">
          {{ row.createTime }}
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
import { dateFormat } from '@/utils/index'
import SelectStore from '@/components/SelectStore'
import * as Api from '@/api/reward'

export default {
  components: { SelectStore },
  props: {
    type: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      time: [dateFormat(new Date(), '{y}-{m}-{d}') + ' 00:00:00', dateFormat(new Date(), '{y}-{m}-{d}') + ' 23:59:59'],
      search: {
        mobile: '',

        name: '',
        taskName: '',

        companyId: '',
        storeId: '',

        pageNum: 1,
        totalCount: 0,
        pageSize: 10
      },

      activeId: 0,
      isShowActiveData: false,
      dataList: []
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    detailExport () {
      Api.detailExport({
        beginTime: this.time[0],
        endTime: this.time[1]
      }, '金币明细导出')
    },
    changeSelectStore (val) {
      this.search.storeId = val.storeId || ''
      this.search.companyId = val.companyId || ''
    },
    getList () {
      Api.detailList({
        ...this.search
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
    },
    searchFn () {
      this.search.pageNum = 1
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
  .btn-export-wrap {
    display: flex;
    justify-content: flex-end;
  }

  .page-seller-management {
    .width1 {
      width: 250px;
    }
  }
</style>
