<template>
  <div>
    <el-dialog
      :visible="visible"
      :before-close="close"
      width="900px"
      append-to-body
      title="秒杀统计">
      <div class="search">
        <select-store
          class="store"
          labelwidth="60px"
          selectwidth="194px"
          @change="changeSelectStore"
        />
        <!--<div>数据截止至前一日晚24:00</div>-->
      </div>
      <div class="goods">
        <img
          :src="resData.productImg"
          alt
          class="goods-img" >
        <div class="goods-content">
          <div class="goods-content-name">
            <div class="goods-label">商品名称：</div>
            <div>{{ resData.productName }}</div>
          </div>
          <div class="goods-content-spec">
            <div class="goods-label">商品编码：</div>
            <div>{{ resData.productCode }}</div>
          </div>
        </div>
        <div class="goods-content">
          <div class="goods-content-name">
            <div class="goods-label">开始时间：</div>
            <div>{{ resData.startTime }}</div>
          </div>
          <div class="goods-content-spec">
            <div class="goods-label">结束时间：</div>
            <div>{{ resData.endTime }}</div>
          </div>
        </div>
      </div>
      <!-- 秒杀统计 -->
      <el-table
        :data="dataList"
        :summary-method="getSummaries"
        show-summary
        class="mt20">
        <el-table-column
          :show-overflow-tooltip="true"
          label="门店"
          align="center">
          <template slot-scope="scope">{{ scope.row.storeName }}</template>
        </el-table-column>
        <el-table-column
          label="抢购人数"
          prop="customerNumber"
          align="center">
          <template slot-scope="scope">{{ scope.row.customerNumber }}</template>
        </el-table-column>
        <el-table-column
          prop="sumSellNumber"
          label="已抢件数"
          align="center">
          <template slot-scope="scope">{{ scope.row.sumSellNumber }}</template>
        </el-table-column>
        <el-table-column
          label="订单金额"
          prop="orderAmount"
          align="center">
          <template slot-scope="scope">￥{{ scope.row.orderAmount }}</template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center">
          <template slot-scope="scope">
            <el-button
              class="ml10"
              type="text"
              size="small"
              @click="statisticDetail(scope.row)">详情</el-button>
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
          @current-change="pageChange"
        />
      </div>
    </el-dialog>
    <!-- 统计详情 -->
    <statistic-detail
      :visible.sync="statisticDetailVisible"
      :statistic-detail-id="statisticDetailId"
      :store-id-detail="storeIdDetail"
      @childNumber="childNumberValue"
    />
  </div>
</template>

<script>
import SelectStore from '@/components/SelectStore'
import statisticDetail from './statisticDetail'
import * as ApiSeckill from '@/api/seckill'
export default {
  name: 'ActiveData',
  components: {
    SelectStore,
    statisticDetail
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    activeId: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      resData: {},
      lazy: true,
      storeId: 0,
      companyId: 0,
      statisticDetailId: 0,
      storeIdDetail: 0,
      // 秒杀统计
      dataList: [],
      search: {
        pageNum: 1,
        totalCount: 0,
        pageSize: 10
      },

      statisticDetailVisible: false, // 统计详情展示
      statisticsDetailList: [], // 统计详情数据
      // 小计总数据
      statisinfoTotalData: {}
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        this.getDetail()
        this.getList()
      }
    },
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
    this.getDetail()
  },
  methods: {
    async getDetail () {
      if (this.activeId) {
        const res = await ApiSeckill.seckillInfo({ id: this.activeId }).catch(
          () => false
        )
        if (!res) return
        this.resData = res.data
      }
    },
    // 小计统计
    async statisinfoTotal () {
      const res = await ApiSeckill.statisinfoDataTotal({
        ...this.search,
        storeId: this.storeId || undefined,
        companyId: this.companyId || undefined,
        seckillId: this.activeId || undefined
      })
      this.statisinfoTotalData = res.data
    },
    childNumberValue (val) {
      this.getList()
    },
    statisticDetail (item) {
      this.statisticDetailId = this.activeId
      this.storeIdDetail = item.storeId
      this.statisticDetailVisible = true
    },
    getList () {
      ApiSeckill.seckillStatisinfo({
        ...this.search,
        storeId: this.storeId || undefined,
        companyId: this.companyId || undefined,
        seckillId: this.activeId || undefined
      }).then(({ data }) => {
        this.dataList = data.dataList || []
        this.search.totalCount = data.totalCount || 0
      })
      this.statisinfoTotal()
    },
    getSummaries () {
      const { sumSellNumber, customerNumber, orderAmount } = this.statisinfoTotalData || {}
      return [`小计`, `${customerNumber}`, `${sumSellNumber}`, `￥${orderAmount}`]
    },
    sizeChange (e) {
      this.search.pageSize = e
      this.getList()
    },
    pageChange (e) {
      this.search.pageNum = e
      this.getList()
    },
    changeSelectStore (val) {
      this.storeId = +val.storeId || 0
      this.companyId = +val.companyId || 0
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
