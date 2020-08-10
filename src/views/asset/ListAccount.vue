<template>
  <div class="employee-list">
    <div class="ui-search-header-block mb10">
      <el-form
        :inline="true"
        label-width="80px">
        <el-form-item label="员工姓名">
          <el-input
            v-model="name"
            class="w250" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input
            v-model="mobile"
            class="w250" />
        </el-form-item>
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
    <div class="export">
      <el-button
        type="primary"
        class="ml5"
        size="small"
        @click="download">导出
      </el-button>
    </div>
    <el-table
      :data="listData"
    >
      <el-table-column
        prop="userName"
        label="员工姓名"
        align="center" />
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        label="员工类型">
        <template slot-scope="{row}">
          {{ row.userType === 1?'门店导购':'虚拟导购' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="storeName"
        label="所属门店"
        align="center" />
      <el-table-column
        prop="userPhone"
        label="手机号"
        align="center" />
      <el-table-column
        prop="allCommission"
        label="累计佣金总额"
        align="center" />
      <el-table-column
        prop="cashAmount"
        label="已提现金额"
        align="center" />
      <el-table-column
        prop="frozenAmount"
        label="冻结金额"
        align="center" />
      <el-table-column
        prop="settlementAmount"
        label="待结算金额"
        align="center" />
      <el-table-column
        prop="withdrawAmount"
        label="可提现金额"
        align="center" />
    </el-table>
    <div class="g-pagination-wrap">
      <el-pagination
        :current-page="currentPage"
        :page-sizes="$store.state.app.pageSizes"
        :page-size="pageSize"
        :total="total"
        :layout="$store.state.app.layout"
        @size-change="sizeChange"
        @current-change="pageChange" />
    </div>
  </div>
</template>

<script>
import * as ApiEmployee from '@/api/employee'
import * as ApiRoyalty from '@/api/royalty'
import SelectStore from '@/components/SelectStore'
import { mapGetters } from 'vuex'

export default {
  name: 'ListAccount',
  components: { SelectStore },
  data () {
    return {
      name: '',
      mobile: '',
      storeId: '',
      companyId: '',
      currentPage: 1,
      total: 0,
      pageSize: 10,
      listData: []
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  created () {
    this.getList()
  },
  methods: {
    download () {
      ApiRoyalty.withdrawExport({
        userName: this.name,
        userPhone: this.mobile,
        companyId: this.companyId,
        storeId: this.storeId
      }, '员工账户导出')
    },
    changeSelectStore (val) {
      this.storeId = val.storeId || ''
      this.companyId = val.companyId || ''
    },
    getList () {
      ApiEmployee.accountList({
        userName: this.name,
        userPhone: this.mobile,
        storeId: this.storeId,
        companyId: this.companyId,
        pageNum: this.currentPage,
        pageSize: this.pageSize
      }).then(({ data }) => {
        this.listData = (data.dataList || []).map(item => {
          item.wechatNumber = item.wechatNumber || '--'
          item.nickName = item.nickName || '--'
          return item
        })
        this.total = data.totalCount || 0
      })
    },
    sizeChange (e) {
      this.pageSize = e
      this.getList()
    },
    pageChange (e) {
      this.currentPage = e
      this.getList()
    },
    searchFn () {
      this.currentPage = 1
      this.getList()
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
</style>
