<template>
  <div>
    <el-form
      :inline="true"
      label-width="80px"
      class="demo-form-inline">
      <el-form-item label="公司：">
        <el-cascader
          :options="options2"
          :props="props"
          :style="{width:inputW}"
          @active-item-change="handleItemChange"/>
      </el-form-item>
      <el-form-item label="门店：">
        <el-cascader
          :options="options2"
          :props="props"
          :style="{width:inputW}"
          @active-item-change="handleItemChange"/>
      </el-form-item>
      <el-form-item label="订单编号：">
        <el-input
          v-model="code"
          :style="{width:inputW}"
          type="text"/>
      </el-form-item>
      <el-form-item label="交易时间：">
        <el-date-picker
          v-model="date"
          type="datetimerange"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          prefix-icon="el-icon-date"
          style="width:360px;"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          round
          type="primary"
          icon="el-icon-search"
          class="fr"
        >搜索
        </el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="listData">
      <!--tradeType (integer, optional): 类型 1订单入账 2手续费-->
      <el-table-column
        width="200"
        prop="orderCode"
        label="订单编号"
        align="center"/>
      <el-table-column
        prop="tradeTime"
        label="交易时间"
        align="center"/>
      <el-table-column
        prop="_tradeType"
        label="类型"
        align="center"/>
      <el-table-column
        prop="balance"
        label="金额"
        align="center"/>
      <el-table-column
        prop="payMent"
        label="支付方式"
        align="center"/>
    </el-table>

    <div class="g-pagination-wrap">
      <el-pagination
        :current-page="currentPage"
        :page-sizes="$store.state.app.pageSizes"
        :page-size="pageSize"
        :total="total"
        :layout="$store.state.app.layout"
        @size-change="sizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <organization-category-selector :visible="OrgCategoryShow"/>
  </div>
</template>

<script>
import * as ApiAssets from '@/api/assets'
import OrganizationCategorySelector from '@/components/OrganizationCategorySelector'

export default {
  name: 'AccountStatement',
  components: {
    OrganizationCategorySelector
  },
  data () {
    return {
      loading: false,
      inputW: '200px',
      code: '',
      options2: [{
        label: '总部',
        cities: []
      }, {
        label: '分公司',
        cities: []
      }],
      props: {
        value: 'label',
        children: 'cities'
      },
      OrgCategoryShow: false,
      date: [],
      currentPage: 1,
      total: 0,
      pageSize: 10,
      listData: []
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    handleItemChange (val) {
      setTimeout(_ => {
        if (val.indexOf('总部') > -1 && !this.options2[0].cities.length) {
          this.options2[0].cities = [{
            label: '分公司'
          }]
        } else if (val.indexOf('分公司') > -1 && !this.options2[1].cities.length) {
          this.options2[1].cities = [{
            label: '门店'
          }]
        }
      }, 300)
    },
    getList () {
      this.loading = true
      ApiAssets.getList({
        pageNum: this.currentPage,
        pageSize: this.pageSize
      }).then(({ data = {} }) => {
        data.dataList = data.dataList || []
        data.dataList.forEach((item) => {
          item._tradeType = { 1: '入账', 2: '退款' }[item.tradeType]
          item.incomeAmount = `￥${item.incomeAmount}`
          item.expendAmount = `￥${item.expendAmount}`
          item.balance = `￥${item.balance}`
          item.payMent = +item.payType === 1 ? '微信' : '支付宝'
        })
        this.listData = data.dataList
        this.total = data.totalCount || 0
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    sizeChange (e) {
      this.pageSize = e
      this.getList()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getList()
    }
  }
}
</script>

<style lang="scss" >
</style>
