<template>
  <el-dialog
    :visible="visible"
    :before-close="close"
    width="900px"
    append-to-body
    title="拼团效果数据"
  >
    <div class="search">
      <select-store
        class="store"
        labelwidth="60px"
        selectwidth="194px"
        @change="changeSelectStore" /><!--<div>数据截止至前一日晚24:00</div>--></div>
    <div
      class="goods">
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
    <div class="data">
      <div class="data-item">
        <div class="data-item-text">订单销售金额（元）</div>
        <div class="data-item-num">¥{{ resData.orderAmount }}</div>
      </div>
      <div class="data-item">
        <div class="data-item-text">成团订单数</div>
        <div class="data-item-num">{{ resData.orderNumber }}</div>
      </div>
      <div class="data-item">
        <div class="data-item-text">成团客户数</div>
        <div class="data-item-num">{{ resData.customerNumber }}</div>
      </div>
      <div class="data-item">
        <div class="data-item-text">购买商品件数</div>
        <div class="data-item-num">{{ resData.sumBuyNum }}</div>
      </div>
    </div>
    <el-tabs type="border-card">
      <el-tab-pane
        :lazy="lazy"
        label="门店交易数据">
        <store-list
          :active-id="activeId"
          :store-id="storeId"
          :company-id="companyId" />
      </el-tab-pane>
      <el-tab-pane
        :lazy="lazy"
        label="导购交易数据">
        <staff-list
          :active-id="activeId"
          :store-id="storeId"
          :company-id="companyId" />
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
import * as ApiGroup from '@/api/group'
import SelectStore from '@/components/SelectStore'
import StoreList from '@/components/active-data/StoreList'
import StaffList from '@/components/active-data/StaffList'

export default {
  name: 'ActiveData',
  components: {
    SelectStore,
    StoreList,
    StaffList
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
      companyId: 0
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        this.getDetail()
      }
    }
  },
  created () {
    this.getDetail()
  },
  methods: {
    async getDetail () {
      if (this.activeId) {
        const res = await ApiGroup.statisinfo({ id: this.activeId }).catch(() => false)
        if (!res) return
        this.resData = res.data
      }
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
