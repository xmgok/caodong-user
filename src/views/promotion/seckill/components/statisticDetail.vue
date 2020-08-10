<template>
  <div>
    <el-dialog
      :visible.sync="visible"
      :before-close="close"
      title="秒杀详情"
      width="900px">
      <div class="search">
        <select-store
          class="store"
          labelwidth="60px"
          selectwidth="194px"
          @change="changeSelectStore" />

        <el-button
          type="primary"
          size="small"
          @click="statisExport"
        >导出
        </el-button>
      </div>

      <el-table
        :data="dataList"
        :summary-method="getSummaries"
        show-summary
        class="mt20">
        <el-table-column
          :show-overflow-tooltip="true"
          label="客户昵称"
          align="center">
          <template slot-scope="scope">
            {{ scope.row.nickname }}
          </template>
        </el-table-column>
        <el-table-column
          label="手机号"
          align="center">
          <template slot-scope="scope">
            {{ scope.row.mobile }}
          </template>
        </el-table-column>
        <el-table-column
          label="分享次数"
          prop="forwardNum"
          align="center">
          <template slot-scope="scope">
            {{ scope.row.forwardNum }}
          </template>
        </el-table-column>
        <el-table-column
          label="已抢件数"
          prop="sumSellNumber"
          align="center">
          <template slot-scope="scope">
            {{ scope.row.sumSellNumber }}
          </template>
        </el-table-column>
        <el-table-column
          label="订单金额"
          prop="orderAmount"
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
    </el-dialog>
  </div>
</template>
<script>
import SelectStore from '@/components/SelectStore'
import * as ApiSeckill from '@/api/seckill'
export default {
  components: { SelectStore },
  props: {
    // select
    // 是否显示
    visible: {
      type: Boolean,
      default: false
    },
    statisticDetailId: {
      type: Number,
      default: 0

    },
    storeIdDetail: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      dataList: [
      ],
      search: {
        pageNum: 1,
        totalCount: 0,
        pageSize: 10
      },
      saveIng: false,
      storeId: 0,
      companyId: 0,
      statisinfoTotalData: {}
    }
  },
  watch: {
    visible: function (val) {
      this.search.pageNum = 1
      this.getList()
    },
    storeId () {
      this.search.pageNum = 1
      this.getList()
    },
    companyId () {
      this.search.pageNum = 1
      this.getList()
    },
    statisticDetailId () {
      this.getList()
    }
  },
  created () {
    // this.getList()
  },
  methods: {
    getList () {
      ApiSeckill.seckillStatisinfoDetail({
        ...this.search,
        storeId: this.storeId || this.storeIdDetail || undefined,
        companyId: this.companyId || undefined,
        seckillId: this.statisticDetailId || undefined
      }).then(({ data }) => {
        this.dataList = data.dataList || []
        this.search.totalCount = data.totalCount || 0
      })
      this.statisinfoTotal()
    },
    // 小计统计
    async statisinfoTotal () {
      const res = await ApiSeckill.statisDetailDataTotal({
        ...this.search,
        storeId: this.storeId || this.storeIdDetail || undefined,
        companyId: this.companyId || undefined,
        seckillId: this.statisticDetailId || undefined
      })
      this.statisinfoTotalData = res.data
    },
    statisExport () {
      ApiSeckill.seckillExport({
        ...this.search,
        storeId: this.storeId || this.storeIdDetail || undefined,
        companyId: this.companyId || undefined,
        seckillId: this.statisticDetailId || undefined
      }, '秒杀详情统计导出')
    },
    getSummaries () {
      const { sumSellNumber, forwardNum, orderAmount } = this.statisinfoTotalData || {}
      return [`小计`, ``, `${forwardNum}`, `${sumSellNumber}`, `￥${orderAmount}`]
    },
    changeSelectStore (val) {
      this.storeId = +val.storeId || 0
      this.companyId = +val.companyId || 0
    },
    sizeChange (e) {
      this.search.pageSize = e
      this.getList()
    },
    pageChange (e) {
      this.search.pageNum = e
      this.getList()
    },
    close () {
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style scoped lang="scss">
  .search {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;

    .store {
      margin-left: -13px;
    }
  }

  .data {
    display: flex;
    margin-bottom: 10px;

    .data-item {
      margin: 10px;
      text-align: center;
    }

    .data-item-text {
      font-size: 16px;
      font-weight: bold;
    }

    .data-item-num {
      margin-top: 5px;
      font-size: 14px;
      font-weight: bold;
      color: #ff0000;
    }
  }

  .goods {
    display: flex;
    font-size: 12px;
    line-height: 1;
    padding-top: 15px;
    padding-bottom: 10px;
    border-top: 1px solid #ddd;
    margin-top: 15px;

    .goods-img {
      width: 50px;
      height: 50px;
    }

    .goods-label {
      font-weight: bold;
    }

    .goods-content {
      margin-left: 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .goods-content-name {
      display: flex;
      margin-bottom: 5px;
    }

    .goods-content-spec {
      display: flex;
      flex-wrap: wrap;
    }

    .goods-content-spec-item {
      margin-right: 10px;
      margin-bottom: 10px;
    }
  }
</style>
