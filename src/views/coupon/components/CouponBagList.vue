<template>
  <div>
    <div style="display: -webkit-box; -webkit-box-pack: justify;">
      <div>
        <router-link :to="{ name: 'CouponBagDetail' }">
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="small">新增券包
          </el-button>
        </router-link>
      </div>
    </div>
    <div class="ui-search-header-block dark mt10">
      <el-form
        :inline="true"
        label-width="80px">
        <el-form-item label="券包名称">
          <el-input
            v-model="search.name"
            placeholder="请输入券包名称"
            class="width1" />
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
    <el-table
      :data="listData"
      class="mt20">
      <el-table-column
        :show-overflow-tooltip="true"
        prop="name"
        label="券包名称"
        width="150" />
      <el-table-column
        :show-overflow-tooltip="true"
        label="有效期"
        min-width="280"
        align="center">
        <template slot-scope="scope">
          {{ scope.row.beginTime }} - {{ scope.row.endTime }}
        </template>
      </el-table-column>
      <!--<el-table-column
        :show-overflow-tooltip="true"
        prop="total"
        label="发放总量"
        align="center" />-->
      <el-table-column
        prop="receivedTotal"
        label="已领取"
        align="center" />
      <el-table-column
        :show-overflow-tooltip="true"
        label="操作人手机"
        min-width="120"
        align="center">
        <template slot-scope="scope">
          {{ scope.row.updateAt }}
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        label="操作时间"
        min-width="140"
        align="center">
        <template slot-scope="scope">
          {{ scope.row.updateTime }}
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        label="状态"
        align="center">
        <template slot-scope="scope">
          {{ scope.row._statusDesc }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        width="150"
        align="center">
        <template slot-scope="scope">
          <div class="flex flex-align-c flex-c">
            <!--未开始-->
            <template v-if="scope.row.status === 1">
              <el-button
                type="text"
                size="small"
                @click="toVoid(scope.row.id)">作废
              </el-button>
              <router-link
                :to="{ name: 'CouponBagDetail', query: {id: scope.row.id} }"
                class="ml10">
                <el-button
                  type="text"
                  size="small">编辑
                </el-button>
              </router-link>
            </template>
            <!--进行中-->
            <template v-if="scope.row.status === 2">
              <el-button
                type="text"
                size="small"
                @click="toVoid(scope.row.id)">作废
              </el-button>
              <router-link
                :to="{ name: 'CouponBagDetail', query: {id: scope.row.id, see: true} }"
                class="ml10">
                <el-button
                  type="text"
                  size="small">查看
                </el-button>
              </router-link>
            </template>
            <!--已结束-->
            <template v-if="scope.row.status === 3">
              <div
                style="font-size: 12px;">已结束
              </div>
              <router-link
                :to="{ name: 'CouponBagDetail', query: {id: scope.row.id, see: true} }"
                class="ml10">
                <el-button
                  type="text"
                  size="small">查看
                </el-button>
              </router-link>
            </template>
            <!--已作废-->
            <template v-if="scope.row.status === 4">
              <div
                style="font-size: 12px;">已作废
              </div>
              <router-link
                :to="{ name: 'CouponBagDetail', query: {id: scope.row.id, see: true} }"
                class="ml10">
                <el-button
                  type="text"
                  size="small">查看
                </el-button>
              </router-link>
            </template>
            <!--<el-button
              class="ml10"
              type="text"
              size="small"
              @click="download(scope.row)">导出
            </el-button>-->
          </div>
        </template>
      </el-table-column>
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
import { CouponTypes, CouponSendTypes } from '@/config/const'
import * as ApiCouponBag from '@/api/coupon-bag'
import SelectStore from '@/components/SelectStore'

export default {
  components: { SelectStore },
  props: {
    type: {
      type: String,
      default: '0'
    }
  },
  data () {
    return {
      couponList: {
        ...CouponTypes
      },
      couponSendList: {
        ...CouponSendTypes
      },
      search: {
        storeId: '',
        companyId: '',
        name: ''
      },
      name: '',
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
    changeSelectStore (val) {
      this.search.storeId = val.storeId || ''
      this.search.companyId = val.companyId || ''
    },
    download (row) {
      ApiCouponBag.couponExport({ ...row }, '优惠列表导出')
    },
    getList () {
      ApiCouponBag.list({
        ...this.search,
        status: +this.type,
        pageNum: this.currentPage,
        pageSize: this.pageSize
      }).then(({ data }) => {
        this.listData = data.dataList || []
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
    },
    toVoid (id) {
      this.$confirm('确定作废吗?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
        ApiCouponBag.del({ id }).then(({ code, message = '' }) => {
          this.$message({ type: (code === 'SUCCESS' ? 'success' : 'error'), message: message })
          if (code === 'SUCCESS') {
            this.currentPage = 1
            this.getList()
          }
        }).catch(() => {
        })
      }).catch(() => {
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .width1 {
    width: 250px;
  }
</style>
