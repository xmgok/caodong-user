<template>
  <div class="page-seller-management">
    <!--条件筛选-->
    <div class="ui-search-header-block dark">
      <el-form
        :inline="true"
        label-width="80px">
        <!--分销商-->
        <template v-if="sellerConfig.dtype===1">
          <el-form-item label="手机号">
            <el-input
              v-model="search.mobile"
              placeholder="输入分销商手机号"
              class="width1" />
          </el-form-item>
          <el-form-item label="店铺名称">
            <el-input
              v-model="search.shopName"
              class="width1" />
          </el-form-item>
          <el-form-item label="上级">
            <el-input
              v-model="search.parentMobile"
              placeholder="输入上级手机号"
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
          <el-form-item label="开店时间">
            <el-date-picker
              v-model="kaidianshijian"
              :default-time="['00:00:00', '23:59:59']"
              style="width: 250px"
              type="datetimerange"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd HH:mm:ss"
              start-placeholder="开始日期"
              end-placeholder="结束日期" />
          </el-form-item>
        </template>
        <!--虚拟导购-->
        <template v-if="sellerConfig.dtype===2">
          <!--<el-form-item label="导购">
            <el-input
              v-model="search.daogou"
              placeholder="输入导购姓名"
              class="width1" />
          </el-form-item>-->
          <el-form-item label="手机号">
            <el-input
              v-model="search.mobile"
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
          <select-store
            style="display: inline-block; margin-bottom: 10px"
            labelwidth="80px"
            selectwidth="250px"
            @change="changeSelectStore" />
            <!--<el-form-item label="推荐人">
<el-input
  v-model="search.tuijianren"
  placeholder="请输入导购姓名"
  class="width1" />
</el-form-item>-->
        </template>
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
        :key="String(Math.random()).substring(2)"
        :show-overflow-tooltip="true"
        align="center"
        label="分销商">
        <template slot-scope="{row}">
          {{ row.nickName }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="sellerConfig.dtype===1"
        key="headUrl"
        :show-overflow-tooltip="true"
        align="center"
        label="分销商头像">
        <template slot-scope="{row}">
          <img
            :src="row.headUrl"
            class="logo"
            alt="">
        </template>
      </el-table-column>
      <!--分销商---------------------结束-->
      <!--虚拟导购---------------------开始-->
      <el-table-column
        v-if="sellerConfig.dtype===2"
        key="staffName"
        :show-overflow-tooltip="true"
        align="center"
        label="导购姓名">
        <template slot-scope="{row}">
          {{ row.name || row.nickName }}
        </template>
      </el-table-column>
      <!--虚拟导购---------------------结束-->
      <el-table-column
        key="staffMobile"
        :show-overflow-tooltip="true"
        align="center"
        label="手机号">
        <template slot-scope="{row}">
          {{ row.mobile }}
        </template>
      </el-table-column>
      <!--分销商---------------------开始-->
      <el-table-column
        v-if="sellerConfig.dtype===1"
        key="shopName"
        :show-overflow-tooltip="true"
        align="center"
        label="店铺名称">
        <template slot-scope="{row}">
          {{ row.shopName || '-' }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="sellerConfig.dtype===1"
        key="logo"
        :show-overflow-tooltip="true"
        align="center"
        label="店铺logo">
        <template slot-scope="{row}">
          <img
            v-if="row.logo"
            :src="row.logo"
            class="logo"
            alt="">
          <span v-else>-</span>
        </template>
      </el-table-column>
      <!--分销商---------------------结束-->
      <el-table-column
        key="pNickName"
        :show-overflow-tooltip="true"
        align="center"
        label="上级">
        <template slot-scope="{row}">
          {{ row.pNickName || '-' }}
        </template>
      </el-table-column>
      <!--虚拟导购---------------------开始-->
      <!--<el-table-column
        v-if="sellerConfig.dtype===2"
        key="empType"
        :show-overflow-tooltip="true"
        align="center"
        label="导购类型">
        <template slot-scope="{row}">
          {{ row.empType }}
        </template>
      </el-table-column>-->
      <el-table-column
        v-if="sellerConfig.dtype===2"
        key="storeName"
        :show-overflow-tooltip="true"
        align="center"
        label="所属门店">
        <template slot-scope="{row}">
          {{ row.storeName }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="sellerConfig.dtype===2"
        key="referer"
        :show-overflow-tooltip="true"
        align="center"
        label="推荐人">
        <template slot-scope="{row}">
          {{ row.pNickName || '-' }}
        </template>
      </el-table-column>
      <!--虚拟导购---------------------结束-->
      <el-table-column
        v-if="sellerConfig.dtype===1"
        key="orderAmount"
        :show-overflow-tooltip="true"
        align="center"
        label="订单金额">
        <template slot-scope="{row}">
          {{ row.orderAmount }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="sellerConfig.dtype===1"
        key="commissionAmount"
        :show-overflow-tooltip="true"
        align="center"
        label="累计佣金">
        <template slot-scope="{row}">
          {{ row.commissionAmount }}
        </template>
      </el-table-column>
      <el-table-column
        key="time"
        :show-overflow-tooltip="true"
        align="center"
        width="130"
        label="申请时间">
        <template slot-scope="{row}">
          {{ row.time }}
        </template>
      </el-table-column>
      <!--虚拟导购---------------------开始-->
      <el-table-column
        v-if="sellerConfig.dtype===2"
        key="openStoreTime"
        :show-overflow-tooltip="true"
        align="center"
        width="130"
        label="开店时间">
        <template slot-scope="{row}">
          {{ row.openStoreTime }}
        </template>
      </el-table-column>
      <!--虚拟导购---------------------结束-->
      <el-table-column
        key="state"
        :show-overflow-tooltip="true"
        align="center"
        label="状态">
        <template slot-scope="{row}">
          {{ row.state === 0?'待审核':'' }}
          {{ row.state === 1?'已启用':'' }}
          {{ row.state === 2?'已禁用':'' }}
          {{ row.state === 3?'已驳回':'' }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        width="160"
        align="center">
        <template slot-scope="{row,$index}">
          <!--启用-->
          <template v-if="row.state===1&&sellerConfig.dtype===1">
            <el-button
              key="btn1"
              class="ml10"
              type="text"
              size="small"
              @click="detailShow($index)">查看详情
            </el-button>
            <el-button
              v-if="sellerConfig.dtype===1"
              key="btn2"
              class="ml10"
              type="text"
              size="small"
              @click="updateDistributorState(row,2,'禁用')">禁用
            </el-button>
          </template>
          <!--待审核-->
          <template v-if="row.state===0">
            <el-button
              key="btn3"
              class="ml10"
              type="text"
              size="small"
              @click="updateDistributorState(row,1,'通过')">通过
            </el-button>
            <el-button
              key="btn4"
              class="ml10"
              type="text"
              size="small"
              @click="rejectShow($index)">驳回
            </el-button>
          </template>
          <!--已驳回-->
          <template v-if="row.state===3">
            <el-button
              key="btn5"
              class="ml10"
              type="text"
              size="small"
              @click="updateDistributorState(row,1,'通过')">通过
            </el-button>
          </template>
          <!--禁用-->
          <template v-if="row.state===2">
            <el-button
              key="btn6"
              class="ml10"
              type="text"
              size="small"
              @click="updateDistributorState(row,1,'开启')">开启
            </el-button>
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
    <!--驳回-->
    <el-dialog
      :visible.sync="isShowRejectDialog"
      title="提示"
      width="400px"
      @close="isShowRejectDialog = false">
      <h2 class="mb24 h2">
        <i class="el-icon-warning" />
        确定驳回申请吗？
      </h2>
      <el-form
        ref="deliveryForm"
        :model="rejectForm">
        <el-form-item
          :rules="[{ required: true, message: '驳回原因不能为空'}]"
          label="驳回原因："
          prop="content">
          <el-input
            v-model="rejectForm.content"
            placeholder="请填写驳回原因"
            type="textarea"
            class="w250"
            rows="3" />
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button
          size="small"
          @click="isShowRejectDialog = false">取 消
        </el-button>
        <el-button
          type="primary"
          size="small"
          @click="rejectConfirm">确 定
        </el-button>
      </div>
    </el-dialog>
    <!--查看详情-->
    <el-dialog
      :visible.sync="isShowDetailDialog"
      title="查看详情"
      width="800px"
      @close="isShowDetailDialog = false">
      <el-form :inline="true">
        <div class="order-info-form-title mb10">基本信息</div>
        <!--分销商---------------------开始-->
        <template v-if="sellerConfig.dtype===1">
          <el-form-item
            key="detail-nickName"
            label="分销商："
            style="width: 45%; margin-bottom: 0;">{{ detailData.nickName }}
          </el-form-item>
          <el-form-item
            key="detail-pNickName"
            label="上级："
            style="width: 45%; margin-bottom: 0;">{{ detailData.pNickName }}
          </el-form-item>
        </template>
        <!--分销商---------------------结束-->
        <!--虚拟导购---------------------开始-->
        <template v-if="sellerConfig.dtype===2">
          <el-form-item
            key="detail-name-nickName"
            label="导购姓名："
            style="width: 45%; margin-bottom: 0;">{{ detailData.name || detailData.nickName }}
          </el-form-item>
          <el-form-item
            key="detail-storeName"
            label="所属门店："
            style="width: 45%; margin-bottom: 0;">{{ detailData.storeName }}
          </el-form-item>
        </template>
        <!--虚拟导购---------------------结束-->
        <el-form-item
          key="detail-accountName"
          label="账户信息："
          style="width: 45%; margin-bottom: 0;">
          {{ detailData.accountName }}/{{ detailData.bankBranchName }}/{{ detailData.bankCard }}
        </el-form-item>
        <!--分销商---------------------开始-->
        <template v-if="sellerConfig.dtype===1">
          <div class="order-info-form-title mb10 mt20">店铺信息</div>
          <el-form-item
            key="detail-shopName"
            label="店名："
            style="width: 45%; margin-bottom: 0;">{{ detailData.shopName }}
          </el-form-item>
          <!--<el-form-item
            label="商品数："
            key="detail-goodsNumber"
            style="width: 45%; margin-bottom: 0;">{{ detailData.goodsNumber }}
          </el-form-item>-->
          <!--<el-form-item
            key="detail-customerNumber"
            label="会员数："
            style="width: 45%; margin-bottom: 0;">
          </el-form-item>-->
          <el-form-item
            key="detail-secondCount"
            label="下级分销："
            style="width: 45%; margin-bottom: 0;">{{ detailData.secondCount }}
          </el-form-item>
        </template>
        <!--分销商---------------------结束-->
        <div class="order-info-form-title mb10 mt20">分销佣金</div>
        <el-form-item
          key="detail-amount"
          label="累计佣金："
          style="width: 45%; margin-bottom: 0;">{{ detailData.amount }}
        </el-form-item>
        <el-form-item
          key="detail-avcAmount"
          label="可提现："
          style="width: 45%; margin-bottom: 0;">{{ detailData.avcAmount }}
        </el-form-item>
        <el-form-item
          key="detail-wamount"
          label="待入账："
          style="width: 45%; margin-bottom: 0;">{{ detailData.wamount }}
        </el-form-item>
        <el-form-item
          key="detail-ramount"
          label="已提现："
          style="width: 45%; margin-bottom: 0;">{{ detailData.ramount }}
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button
          size="small"
          @click="isShowDetailDialog = false">关闭
        </el-button>
      </div>
    </el-dialog>
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
      kaidianshijian: [],
      search: {
        shopName: '',
        parentMobile: '',
        mobile: '',

        pageNum: 1,
        totalCount: 0,
        pageSize: 10
      },

      isShowRejectDialog: false,
      rejectDialogIndex: 0,
      rejectForm: {
        content: ''
      },

      // sellerConfig: {},

      isShowDetailDialog: false,
      detailDialogIndex: 0,
      detailData: {},

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
    updateDistributorState (item, state, text) {
      const id = item.id
      let text2 = `确定${text}分销商吗?`
      if (text === '通过') {
        text2 = '确定审核通过吗？'
      }
      this.$confirm(text2, {
        type: 'warning'
      }).then(() => {
        ApiSeller.updateDistributorState({
          ...item,
          id,
          state
        }).then(() => {
          this.getList()
        })
        this.isShowRejectDialog = false
      }).catch(() => {
        this.isShowRejectDialog = false
      })
    },
    getConfig () {
      ApiSeller.getDistriSettings().then(({ data }) => {
        this.sellerConfig = data
      })
    },
    detailShow (index) {
      this.detailDialogIndex = index
      this.isShowDetailDialog = true
      const id = this.dataList[this.detailDialogIndex].id
      ApiSeller.viewdistributor({ id }).then(({ data }) => {
        this.detailData = data
      })
    },
    rejectShow (index) {
      this.rejectDialogIndex = index
      this.isShowRejectDialog = true
    },
    rejectConfirm () {
      const id = this.dataList[this.rejectDialogIndex].id
      this.$refs.deliveryForm.validate(async valid => {
        if (!valid) return
        ApiSeller.rejectDistributor({ id, ...this.rejectForm }).then(() => {
          this.getList()
          this.isShowRejectDialog = false
        })
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
      if (this.kaidianshijian) {
        this.search.gstartTime = this.kaidianshijian[0] || ''
        this.search.gendTime = this.kaidianshijian[1] || ''
      }
      ApiSeller.getDistributors({
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

    .logo {
      width: 40px;
      height: 40px;
      vertical-align: top;
      border-radius: 50%;
    }

    .h2 {
      font-size: 16px;
    }

    .order-info-form-title {
      font-size: 16px;
      color: #303133;
      font-weight: bold;
      line-height: 18px;
      border-left: 4px solid #5889FF;
      padding-left: 12px;
    }
  }
</style>
