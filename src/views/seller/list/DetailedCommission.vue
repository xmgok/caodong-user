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
        <el-form-item label="订单号">
          <el-input
            v-model="search.orderNo"
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
    <el-table
      :data="dataList"
      class="mt20">
      <el-table-column
        :show-overflow-tooltip="true"
        width="200"
        align="center"
        label="订单号">
        <template slot-scope="{row}">
          {{ row.orderNo }}
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        label="订单金额">
        <template slot-scope="{row}">
          {{ row.amount }}
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        label="佣金">
        <template slot-scope="{row}">
          {{ row.commissionAmount }}
        </template>
      </el-table-column>
      <!--分销商---------------------开始-->
      <el-table-column
        v-if="sellerConfig.dtype===1"
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
        :show-overflow-tooltip="true"
        align="center"
        label="导购姓名">
        <template slot-scope="{row}">
          {{ row.name || row.nickName }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="sellerConfig.dtype===2"
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
        align="center"
        label="手机号">
        <template slot-scope="{row}">
          {{ row.mobile }}
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        label="状态">
        <template slot-scope="{row}">
          {{ row.state===0?'待入账':'' }}
          {{ row.state===1?'已入账':'' }}
          {{ row.state===2?'退货退款':'' }}
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        width="130"
        label="入账时间">
        <template slot-scope="{row}">
          {{ row.time }}
        </template>
      </el-table-column>
      <!--<el-table-column
        :show-overflow-tooltip="true"
        align="center"
        label="备注">
        <template slot-scope="{row}">
          {{ row.remarks }}
        </template>
      </el-table-column>-->
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
      search: {
        orderNo: '',
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
      ApiSeller.getcommissionlist({
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
