<template>
  <div class="page-seller-management">
    <!--条件筛选-->
    <div
      v-if="sellerConfig.dtype===1"
      class="ui-search-header-block dark">
      <el-form
        :inline="true"
        label-width="80px">
        <!--分销商-->
        <el-form-item label="手机号">
          <el-input
            v-model="search.mobile"
            placeholder="输入分销商手机号"
            class="width1" />
        </el-form-item>
        <el-form-item label="申请时间">
          <el-date-picker
            v-model="shenqingshijian"
            :default-time="['00:00:00', '23:59:59']"
            style="width: 250px"
            type="datetimerange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期" />
        </el-form-item>
        <el-form-item label="发放时间">
          <el-date-picker
            v-model="fafangshijian"
            :default-time="['00:00:00', '23:59:59']"
            style="width: 250px"
            type="datetimerange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期" />
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
    <el-table
      :data="dataList"
      class="mt20">
      <!--分销商---------------------开始-->
      <el-table-column
        v-if="sellerConfig.dtype===1"
        key="key1"
        :show-overflow-tooltip="true"
        align="center"
        label="分销商">
        <template slot-scope="{row}">
          {{ row.nickName }}
        </template>
      </el-table-column>
      <!--分销商---------------------结束-->
      <!--虚拟导购---------------------开始-->
      <el-table-column
        v-if="sellerConfig.dtype===2"
        key="key2"
        :show-overflow-tooltip="true"
        align="center"
        label="导购姓名">
        <template slot-scope="{row}">
          {{ row.name || row.nickName }}
        </template>
      </el-table-column>
      <!--虚拟导购---------------------结束-->
      <el-table-column
        key="key3"
        :show-overflow-tooltip="true"
        align="center"
        width="110"
        label="手机号">
        <template slot-scope="{row}">
          {{ row.mobile }}
        </template>
      </el-table-column>
      <!--虚拟导购---------------------开始-->
      <el-table-column
        v-if="sellerConfig.dtype===2"
        :key="String(Math.random()).substring(2)"
        :show-overflow-tooltip="true"
        align="center"
        label="所属门店">
        <template slot-scope="{row}">
          {{ row.storeName }}
        </template>
      </el-table-column>
      <!--虚拟导购---------------------结束-->
      <el-table-column
        :show-overflow-tooltip="true"
        :key="String(Math.random()).substring(2)"
        align="center"
        label="申请金额">
        <template slot-scope="{row}">
          {{ row.amount }}
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        :key="String(Math.random()).substring(2)"
        align="center"
        width="300"
        label="收款人/开户银行/银行账号">
        <template slot-scope="{row}">
          {{ row.accountName }}/{{ row.bankBranchName }}/{{ row.bankCard }}
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        :key="String(Math.random()).substring(2)"
        align="center"
        width="200"
        label="申请时间">
        <template slot-scope="{row}">
          {{ row.time }}
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        :key="String(Math.random()).substring(2)"
        align="center"
        width="200"
        label="发放时间">
        <template slot-scope="{row}">
          {{ row.modTime }}
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        :key="String(Math.random()).substring(2)"
        align="center"
        label="状态">
        <template slot-scope="{row}">
          {{ row.state===0?'待审核':'' }}
          {{ row.state===1?'已发放':'' }}
          {{ row.state===2?'待发放':'' }}
          {{ row.state===3?'已驳回':'' }}
          {{ row.state===4?'提现中':'' }}
          {{ row.state===5?'已撤销':'' }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        width="160"
        align="center">
        <template slot-scope="{row}">
          <!--待审核-->
          <template v-if="row.state===0">
            <el-button
              class="ml10"
              type="text"
              size="small"
              @click="changeCashApplyState(row,2,'通过')">通过
            </el-button>
            <el-button
              class="ml10"
              type="text"
              size="small"
              @click="changeCashApplyState(row,3,'驳回')">驳回
            </el-button>
          </template>
          <!--待发放-->
          <template v-if="row.state===2">
            <el-button
              class="ml10"
              type="text"
              size="small"
              @click="pinganwithdraw(row)">发放
            </el-button>
            <el-button
              class="ml10"
              type="text"
              size="small"
              @click="changeCashApplyState(row,5,'撤销')">撤销
            </el-button>
          </template>
          <!--已驳回，已撤销，已发放均不可操作-->
          <template v-if="row.state===3">
            <!--<el-button
              class="ml10"
              type="text"
              size="small"
              @click="changeCashApplyState(row,2,'通过')">通过
            </el-button>-->
          </template>
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
import SelectStore from '@/components/SelectStore'
import * as ApiSeller from '@/api/seller'
import { mapGetters } from 'vuex'

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
      shenqingshijian: [],
      fafangshijian: [],
      search: {
        mobile: '',

        pageNum: 1,
        totalCount: 0,
        pageSize: 10
      },

      // sellerConfig: {},

      activeId: 0,
      isShowActiveData: false,
      dataList: []
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    sellerConfig () {
      return { dtype: this.$store.getters.userInfo._dtype }
    }
  },
  mounted () {
    // this.getConfig()
    this.getList()
  },
  methods: {
    changeCashApplyState (item, state, text) {
      // state 状态，0 、待审核，1、已发放，2、待发放，3、已驳回，4、提现中
      this.$confirm(`确认${text}么？`, {
        type: 'warning'
      }).then(() => {
        ApiSeller.changeCashApplyState({ id: item.id, state }).then(() => {
          this.getList()
        })
      })
    },
    pinganwithdraw (item) {
      this.$confirm('确认发放么？', {
        type: 'warning'
      }).then(() => {
        ApiSeller.pinganwithdraw({ id: item.id }).then(() => {
          this.getList()
        })
      })
    },
    getConfig () {
      ApiSeller.getDistriSettings().then(({ data }) => {
        this.sellerConfig = data
      })
    },
    changeSelectStore (val) {
      this.search.storeId = val.storeId || ''
      this.search.companyId = val.companyId || ''
    },
    getList () {
      this.search.startTime = ''
      this.search.endTime = ''
      this.search.gstartTime = ''
      this.search.gendTime = ''
      if (this.shenqingshijian) {
        this.search.startTime = this.shenqingshijian[0] || ''
        this.search.endTime = this.shenqingshijian[1] || ''
      }
      if (this.fafangshijian) {
        this.search.gstartTime = this.fafangshijian[0] || ''
        this.search.gendTime = this.fafangshijian[1] || ''
      }
      ApiSeller.getCashApplys({
        ...this.search,
        state: this.type || undefined
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

<style lang="scss">
  .page-seller-management {
    .width1 {
      width: 250px;
    }
  }
</style>
