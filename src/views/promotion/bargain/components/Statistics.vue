<template>
  <div>
    <el-dialog
      :visible="visible"
      :before-close="close"
      width="900px"
      title="砍价统计"
    >
      <div class="store-wrap">
        <select-store
          class="store"
          labelwidth="60px"
          selectwidth="194px"
          @change="changeSelectStore" />
      </div>
      <div class="goods">
        <img
          :src="resData.productImg"
          alt=""
          class="goods-img">
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
      <!--转发-->
      <el-table
        :key="String(Math.random()).substring(2)"
        :data="dataList"
        :summary-method="getSummaries1"
        show-summary
        class="mt20">
        <el-table-column
          :show-overflow-tooltip="true"
          label="门店"
          align="center">
          <template slot-scope="scope">
            {{ scope.row.storeName }}
          </template>
        </el-table-column>
        <el-table-column
          label="参与人数"
          align="center">
          <template slot-scope="scope">
            {{ scope.row.reduceNum }}
          </template>
        </el-table-column>
        <el-table-column
          label="购买人数"
          align="center">
          <template slot-scope="scope">
            {{ scope.row.peopleNum }}
          </template>
        </el-table-column>
        <el-table-column
          label="购买数量"
          align="center">
          <template slot-scope="scope">
            {{ scope.row.orderNum }}
          </template>
        </el-table-column>
        <el-table-column
          label="订单金额"
          align="center">
          <template slot-scope="scope">
            ￥{{ scope.row.orderAmount }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          width="50"
          fixed="right">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="showDetail(scope.row,scope.$index)">详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="g-pagination-wrap">
        <el-pagination
          :current-page="search2.pageNum"
          :page-sizes="$store.state.app.pageSizes"
          :page-size="search2.pageSize"
          :total="search2.totalCount"
          :layout="$store.state.app.layout"
          @size-change="sizeChange"
          @current-change="pageChange" />
      </div>
    </el-dialog>
    <el-dialog
      :visible="visibleDetail"
      :before-close="closeDetail"
      width="1000px"
      title="砍价统计"
    >
      <div class="flex flex-jc-sb">
        <div class="store-wrap">
          <select-store
            class="store"
            labelwidth="60px"
            selectwidth="194px"
            @change="changeSelectStore2" />
        </div>
        <div class="export">
          <el-button
            type="primary"
            class="ml5"
            @click="download3">导出
          </el-button>
        </div>
      </div>
      <!--转发-->
      <el-table
        :data="dataList3"
        :summary-method="getSummaries2"
        show-summary
        class="mt20">
        <el-table-column
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
          align="center">
          <template slot-scope="scope">
            {{ scope.row.forwardNum }}
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="好友砍价次数"
          align="center">
          <template slot-scope="scope">
            {{ scope.row.reduceNum }}
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="砍到"
          align="center">
          <template slot-scope="scope">
            ￥{{ scope.row.reduceToAmount }}
          </template>
        </el-table-column>
        <el-table-column
          label="购买数量"
          align="center">
          <template slot-scope="scope">
            {{ scope.row.orderNum }}
          </template>
        </el-table-column>
        <el-table-column
          label="订单金额"
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
import * as ApiTask from '@/api/bargain'
import SelectStore from '@/components/SelectStore'

export default {
  name: 'Statistics',
  components: {
    SelectStore
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
      statusArr: {
        '': '全部',
        '0': '未完成',
        '1': '已完成'
      },
      status: '', // '' '0' '1'
      visibleDetail: false,
      storeId: 0,
      companyId: 0,
      storeId2: 0,
      companyId2: 0,
      resData: {},
      resData3: {},
      dataList: [],
      dataList2: [],
      dataList3: [],
      statisinfoTotalData: {},
      statisinfoDetailTotalData: {},
      search: {
        pageNum: 1,
        totalCount: 0,
        pageSize: 10
      },
      search2: {
        pageNum: 1,
        totalCount: 0,
        pageSize: 10
      }
    }
  },
  watch: {
    storeId () {
      this.search.pageNum = 1
      this.getList()
    },
    companyId () {
      this.search.pageNum = 1
      this.getList()
    },
    storeId2 () {
      this.search.pageNum = 1
      this.getDetail()
    },
    companyId2 () {
      this.search.pageNum = 1
      this.getDetail()
    },
    status () {
      this.search.pageNum = 1
      this.getDetail()
    }
  },
  created () {
    this.getList()
  },
  methods: {
    async statisinfoTotal () {
      const res = await ApiTask.statisinfoTotal({
        companyId: this.companyId || undefined,
        storeId: this.storeId || undefined,
        reduceId: this.activeId
      })
      this.statisinfoTotalData = res.data
    },
    async exportStatisticDetail () {
      const res = await ApiTask.statisinfoDetailTotal({
        companyId: this.companyId2 || undefined,
        storeId: this.storeId2 || this.row.storeId || undefined,
        reduceId: this.activeId
      })
      this.statisinfoDetailTotalData = res.data
    },
    download3 () {
      ApiTask.exportStatisticDetail({
        companyId: this.companyId2 || undefined,
        storeId: this.storeId2 || this.row.storeId || undefined,
        pageSize: this.search.pageSize,
        pageNum: this.search.pageNum,
        reduceId: this.activeId
      }, '统计详情导出')
    },
    getSummaries1 () {
      const { reduceNum, peopleNum, orderNum, orderAmount } = this.statisinfoTotalData || {}
      return [`小计`, `${reduceNum}`, `${peopleNum}`, `${orderNum}`, `￥${orderAmount}`, ``, ``]
    },
    // 转发
    getSummaries2 () {
      const { forwardNum, reduceNum, orderNum, orderAmount } = this.statisinfoDetailTotalData || {}
      return [`小计`, ``, `${forwardNum}`, `${reduceNum}`, ``, `${orderNum}`, `￥${orderAmount}`, ``]
    },
    changeSelectStore (val) {
      this.storeId = +val.storeId || 0
      this.companyId = +val.companyId || 0
    },
    changeSelectStore2 (val) {
      this.storeId2 = +val.storeId || 0
      this.companyId2 = +val.companyId || 0
    },
    getList () {
      ApiTask.statisinfo({
        ...this.search2,
        storeId: this.storeId || undefined,
        companyId: this.companyId || undefined,
        reduceId: this.activeId
      }).then(({ data }) => {
        this.dataList = data.dataList || []
        this.search2.totalCount = data.totalCount
      })
      this.getInfo()
      this.statisinfoTotal()
    },
    getInfo () {
      ApiTask.info({ id: this.activeId }).then(({ data }) => {
        this.resData = data
      })
    },
    sizeChange2 (e) {
      this.search2.pageSize = e
      this.getList()
    },
    pageChange2 (e) {
      this.search2.pageNum = e
      this.getList()
    },
    sizeChange (e) {
      this.search.pageSize = e
      this.getDetail()
    },
    pageChange (e) {
      this.search.pageNum = e
      this.getDetail()
    },
    close () {
      this.$emit('update:visible', false)
    },
    async getDetail (hasStoreId) {
      let storeId = ''
      if (hasStoreId) {
        storeId = this.row.storeId
      } else {
        storeId = this.storeId2
      }
      const res = await ApiTask.statisinfoDetail({
        ...this.search,
        companyId: this.companyId2 || undefined,
        storeId: storeId || undefined,
        reduceId: this.activeId
      }).catch(() => false)
      if (!res) return
      this.dataList3 = res.data.dataList
      this.search.totalCount = res.data.totalCount
      this.exportStatisticDetail()
    },
    async showDetail (row, index) {
      this.search = {
        pageNum: 1,
        totalCount: 0,
        pageSize: 10
      }
      this.visibleDetail = true
      this.row = row || {}
      this.getDetail(true)
    },
    closeDetail () {
      this.visibleDetail = false
    }
  }
}
</script>

<style scoped lang="scss">
  .store {
    margin-left: -13px;
  }

  .store-wrap {
    display: flex;
    align-items: center;
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
