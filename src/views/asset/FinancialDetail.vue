<template>
  <div>
    <div class="ui-search-header-block">
      <el-form
        :inline="true"
        label-width="70px">
        <select-store
          class="mb10"
          style="display: inline-block"
          labelwidth="70px"
          selectwidth="250px"
          @change="changeSelectStore" />
        <el-form-item label="订单编号">
          <el-input
            v-model="searchForm.orderCode"
            style="width: 250px;"
            type="text"/>
        </el-form-item>
        <el-form-item
          label="交易时间">
          <el-date-picker
            v-model="searchForm.date"
            :default-time="['00:00:00', '23:59:59']"
            style="width: 250px"
            type="datetimerange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
      </el-form>
      <el-button
        class="btn-search"
        type="primary"
        icon="el-icon-search"
        @click="search"
      >搜索</el-button>
    </div>

    <el-table
      v-loading="loading"
      :data="listData"
      class="mt10">
      <!--tradeType (integer, optional): 类型 1订单入账 2手续费-->
      <el-table-column
        width="240"
        prop="orderCode"
        label="订单编号"
        align="center"/>
      <el-table-column
        prop="tradeTime"
        label="交易时间"
        align="center"/>
      <!--
      <el-table-column
        prop="incomeAmount"
        label="收入"
        align="center"/>
      <el-table-column
        prop="expendAmount"
        label="支出"
        align="center"/>
-->
      <el-table-column
        prop="_tradeType"
        label="类型"
        align="center"/>
      <el-table-column
        prop="amount"
        label="金额"
        align="center"/>
      <el-table-column
        prop="_payType"
        label="支付方式"
        align="center"/>
      <el-table-column
        prop="companyName"
        label="公司名称"
        align="center"/>
      <el-table-column
        prop="storeName"
        label="门店名称"
        align="center"/>
    </el-table>

    <div class="g-pagination-wrap">
      <el-pagination
        :current-page="searchForm.pageNum"
        :page-sizes="$store.state.app.pageSizes"
        :page-size="searchForm.pageSize"
        :total="total"
        :layout="$store.state.app.layout"
        @size-change="sizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import * as ApiAssets from '@/api/assets'
import SelectStore from '@/components/SelectStore'

export default {
  name: 'FinancialDetail',
  components: { SelectStore },
  data () {
    return {
      loading: false,
      searchForm: {
        date: [],
        companyId: '',
        storeId: '',
        startTime: '',
        endTime: '',
        orderCode: '',
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      listData: []
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    changeSelectStore (val) {
      this.searchForm.storeId = val.storeId || ''
      this.searchForm.companyId = val.companyId || ''
    },
    getList () {
      this.loading = true
      const date = this.searchForm.date || []
      this.searchForm.startTime = date[0] || ''
      this.searchForm.endTime = date[1] || ''
      ApiAssets.getList(this.searchForm).then(({ data = {} }) => {
        data.dataList = data.dataList || []
        data.dataList.forEach((item) => {
          // item._tradeType = item.tradeType > 1 ? '手续费' : '订单入账'
          // item.incomeAmount = `￥${item.incomeAmount}`
          // item.expendAmount = `￥${item.expendAmount}`
          item._tradeType = { 1: '入账', 2: '退款', 3: '手续费' }[item.tradeType]
          // item._payType = { 1: '微信支付', 2: '第三方支付' }[item.payType]
          item._payType = item.payType === 1 ? '微信支付' : '第三方支付'
          item.balance = `￥${item.balance}`
        })
        this.listData = data.dataList
        this.total = data.totalCount || 0
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    sizeChange (e) {
      this.searchForm.pageSize = e
      this.getList()
    },
    handleCurrentChange (val) {
      this.searchForm.pageNum = val
      this.getList()
    },
    search () {
      this.searchForm.pageNum = 1
      this.getList()
    }
  }
}
</script>

<style lang="scss">
</style>
