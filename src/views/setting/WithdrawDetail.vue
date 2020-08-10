<template>
  <div class="page-withdraw-detail">
    <!--条件筛选-->
    <div class="tabs-box">
      <ul class="tabs-nav">
        <li
          v-for="item in tabList"
          :key="item.value"
          :class="['tab-item', { active: searchForm.status === item.value }]"
          @click="switchTab(item.value)">{{ item.label }}
        </li>
      </ul>

      <div
        class="tabs-body">
        <div class="ui-search-header-block">
          <el-form
            inline
            label-width="80px">
            <el-form-item label="员工姓名">
              <el-input
                v-model="searchForm.empName"
                clearable
                class="w250" />
            </el-form-item>
            <el-form-item label="手机号">
              <el-input
                v-model="searchForm.empPhone"
                clearable
                class="w250" />
            </el-form-item>
            <el-form-item label="申请时间">
              <el-date-picker
                v-model="applyTime"
                :default-time="['00:00:00', '23:59:59']"
                class="w250"
                type="datetimerange"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd HH:mm:ss"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                @change="(date) => onDateChange(date, 'apply')" />
            </el-form-item>
            <el-form-item label="发放时间">
              <el-date-picker
                v-model="grantTime"
                :default-time="['00:00:00', '23:59:59']"
                class="w250"
                type="datetimerange"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd HH:mm:ss"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                @change="(date) => onDateChange(date, 'grant')" />
            </el-form-item>
            <select-store
              class="dib mb10"
              labelwidth="80px"
              selectwidth="250px"
              @change="changeSelectStore" />
          </el-form>
          <el-button
            class="btn-search"
            type="primary"
            icon="el-icon-search"
            @click="pageChange(1)"
          >搜索
          </el-button>
        </div>
      </div>
    </div>

    <div class="export">
      <el-button
        type="primary"
        class="ml5"
        size="small"
        @click="download">导出
      </el-button>
    </div>

    <!--列表-->
    <el-table
      :data="listData"
      tooltip-effect="dark"
      class="mt10">
      <el-table-column
        prop="applyCode"
        label="申请单编号"
        show-overflow-tooltip
        align="center"
        width="250" />
      <el-table-column
        prop="empName"
        label="员工姓名"
        show-overflow-tooltip
        align="center" />
      <!--<el-table-column
        :show-overflow-tooltip="true"
        align="center"
        label="员工类型">
        <template slot-scope="{row}">
          {{ row.userType === 1?'门店导购':'虚拟导购' }}
        </template>
      </el-table-column>-->
      <el-table-column
        prop="empPhone"
        label="手机号"
        width="110"
        show-overflow-tooltip
        align="center" />
      <el-table-column
        prop="_storeName"
        label="所属门店"
        show-overflow-tooltip
        align="center" />
      <el-table-column
        prop="applyAmount"
        label="申请金额"
        show-overflow-tooltip
        align="center" />
      <el-table-column
        prop="_applyTime"
        label="申请时间"
        show-overflow-tooltip
        align="center"
        width="160" />
      <el-table-column
        prop="_grantTime"
        label="发放时间"
        show-overflow-tooltip
        align="center"
        width="160" />
      <el-table-column
        show-overflow-tooltip
        prop="_status"
        label="状态"
        width="100"
        align="center" />
      <el-table-column
        label="操作"
        align="center"
        width="150"
        fixed="right">
        <template slot-scope="{row}">
          <template v-if="row.appType === 2 && row.status === 1">
            <el-button
              type="text"
              size="small"
              @click="action(1, row)">发放
            </el-button>
            <el-button
              type="text"
              size="small"
              @click="action(2, row)">驳回
            </el-button>
          </template>
          <template v-else>--</template>
        </template>
      </el-table-column>

    </el-table>

    <!--分页-->
    <div class="g-pagination-wrap">
      <el-pagination
        :current-page="pageNum"
        :page-sizes="$store.state.app.pageSizes"
        :page-size="pageSize"
        :total="total"
        :layout="$store.state.app.layout"
        @size-change="sizeChange"
        @current-change="pageChange"
      />
    </div>
  </div>
</template>

<script>
import { dateFormat } from '@/utils'
import * as ApiRoyalty from '@/api/royalty'
import SelectStore from '@/components/SelectStore'

// 审核状态
const STATUS_MAP = { 1: '申请中', 2: '已发放', 3: '已驳回' }

export default {
  name: 'WithdrawDetail',

  components: {
    SelectStore
  },

  data () {
    return {
      tabList: [
        { label: '全部', value: 0 },
        ...Object.keys(STATUS_MAP).map(key => ({ label: STATUS_MAP[key], value: key }))
      ],
      searchForm: {
        empName: '',
        empPhone: '',
        applyBeginTime: '',
        applyEndTime: '',
        grantBeginTime: '',
        grantEndTime: '',
        storeId: '',
        companyId: '',
        status: 0
      },
      applyTime: [],
      grantTime: [],
      listData: [],
      pageNum: 1,
      total: 0,
      pageSize: 10,
      ruleForm: {
        companyId: '',
        storeId: ''
      },
      companyList: []
    }
  },

  created () {
    this.getList()
  },

  methods: {
    download () {
      ApiRoyalty.withdrawExportWithdrawFund(this.searchForm, '提现明细导出')
    },
    switchTab (status) {
      this.pageNum = 1
      this.searchForm.status = status
      this.getList()
    },
    getList () {
      if (this.applyTime) {
        const [applyBeginTime, applyEndTime] = this.applyTime
        this.searchForm.applyBeginTime = applyBeginTime || ''
        this.searchForm.applyEndTime = applyEndTime || ''
      }
      if (this.grantTime) {
        const [grantBeginTime, grantEndTime] = this.grantTime
        this.searchForm.grantBeginTime = grantBeginTime || ''
        this.searchForm.grantEndTime = grantEndTime || ''
      }

      ApiRoyalty.getWithdrawList({
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        ...this.searchForm
      }).then(({ data: { dataList, totalCount } }) => {
        this.listData = (dataList || []).map((item) => {
          return {
            ...item,
            _empPhone: item.empPhone || '--',
            _storeName: item.storeName || '--',
            _applyTime: item.applyTime ? dateFormat(item.applyTime) : '--',
            _grantTime: item.grantTime ? dateFormat(item.grantTime) : '--',
            _status: STATUS_MAP[item.status]
          }
        })
        this.total = totalCount || 0
      })
    },
    sizeChange (e) {
      this.pageSize = e
      this.getList()
    },
    pageChange (val) {
      this.pageNum = val
      this.getList()
    },
    action (operate, { id }) {
      this.$confirm(`确定${({ 1: '发放', 2: '驳回' }[operate])}吗?`, '提示', { type: 'warning' }).then(() => {
        ApiRoyalty.withdrawOperate({
          id,
          operate
        }).then(({ status }) => {
          if (status !== 200) return
          this.$message.success('操作成功')
          this.getList()
        })
      }).catch(e => e)
    },
    changeSelectStore ({ storeId, companyId }) {
      this.searchForm.storeId = storeId || ''
      this.searchForm.companyId = companyId || ''
    },
    // 清空时间
    onDateChange (date, name) {
      if (!date) {
        this.searchForm[`${name}BeginTime`] = ''
        this.searchForm[`${name}EndTime`] = ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .export {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-top: 15px;
    margin-bottom: 15px;
    margin-left: 5px;
  }

  .tabs-box {
    width: 100%;
    border-radius: 8px;
    background-color: white;

    .tabs-nav {
      box-sizing: border-box;
      padding-left: 16px;
      height: 48px;
      border-bottom: 1px solid #ebeef5;
      @include clearfix();
    }

    .tab-item {
      margin-right: 35px;
      float: left;
      height: 48px;
      line-height: 48px;
      color: #606266;
      font-size: 14px;
      cursor: pointer;

      &.active {
        position: relative;
        color: #5889ff;
        font-weight: bold;

        &::after {
          content: '';
          display: inline-block;
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 4px;
          color: #5889ff;
          background-color: #5889ff;
          border-radius: 2px;
        }
      }
    }
  }

  .w250 {
    width: 250px;
  }
</style>
