<template>
  <div>
    <div style="display: -webkit-box; -webkit-box-pack: justify;">
      <div>
        <router-link :to="{ name: 'CouponAdd' }">
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="small">新增优惠券
          </el-button>
        </router-link>
      </div>
      <!--<el-input
        v-model="name"
        size="small"
        placeholder="请输入优惠券名称搜索"
        class="">
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="searchFn" />
      </el-input>-->
    </div>
    <div class="ui-search-header-block dark mt10">
      <el-form
        :inline="true"
        label-width="80px">
        <!--分销商-->
        <el-form-item label="优惠券名称">
          <el-input
            v-model="search.name"
            placeholder="请输入优惠券名称"
            class="width1" />
        </el-form-item>
        <!--虚拟导购-->
        <select-store
          style="display: inline-block; margin-bottom: 10px"
          labelwidth="80px"
          selectwidth="250px"
          @change="changeSelectStore" />
        <el-form-item label="优惠券类型">
          <el-select
            v-model="search.couponType"
            class="mb10 w250"
            clearable
            placeholder="请选择">
            <el-option
              v-for="(value, key) in couponList"
              :key="key"
              :value="key"
              :label="value" />
          </el-select>
        </el-form-item>
        <el-form-item label="发放方式">
          <el-select
            v-model="search.distType"
            class="mb10 w250"
            clearable
            placeholder="请选择">
            <el-option
              v-for="(value, key) in couponSendList"
              :key="key"
              :value="key"
              :label="value" />
          </el-select>
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
      :data="listData"
      class="mt20">
      <el-table-column
        :show-overflow-tooltip="true"
        prop="name"
        label="优惠券名称"
        width="150" />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="price"
        label="优惠金额"
        align="center" />
      <el-table-column
        :show-overflow-tooltip="true"
        label="优惠券类型"
        align="center">
        <template slot-scope="scope">
          {{ couponList[scope.row.type] }}
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="usePrice"
        width="150"
        label="使用条件"
        align="center">
        <template slot-scope="scope">
          <template v-if="scope.row.useRule > 0">满{{ scope.row.usePrice }}元可使用</template>
          <template v-else>无门槛使用</template>
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        label="发放方式"
        align="center">
        <template slot-scope="scope">
          {{ couponSendList[scope.row.distType] }}
        </template>
      </el-table-column>
      <el-table-column
        label="领取条件"
        align="center">
        <template slot-scope="scope">
          <template v-if="scope.row.receiveRule > 0">限每人{{ scope.row.receiveTotal }}张</template>
          <template v-else>不限制领取</template>
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        label="发放时间"
        width="320"
        align="center">
        <template slot-scope="scope">
          {{ scope.row.issueTime }} - {{ scope.row.issueEndTime }}
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        label="操作人手机"
        align="center">
        <template slot-scope="scope">
          {{ scope.row.updateAt }}
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        label="操作时间"
        align="center">
        <template slot-scope="scope">
          {{ scope.row.updateTime }}
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="total"
        label="优惠券总数"
        align="center" />
      <el-table-column
        prop="receivedTotal"
        label="已领取"
        align="center" />
      <el-table-column
        prop="usedTotal"
        label="已使用"
        align="center" />
      <el-table-column
        label="操作"
        fixed="right"
        width="150"
        align="center">
        <template slot-scope="scope">
          <div class="flex flex-align-c flex-c">
            <template v-if="scope.row.status == 3">
              <div class="flex flex-align-c flex-c">
                <div
                  style="font-size: 12px;">已作废
                </div>
                <router-link
                  :to="{ name: 'CouponAdd', query: {id: scope.row.id, see: true} }"
                  class="ml10">
                  <el-button
                    type="text"
                    size="small">查看
                  </el-button>
                </router-link>
              </div>
            </template>
            <template v-else-if="scope.row.status == 2">
              <div class="flex flex-align-c flex-c">
                <div
                  style="font-size: 12px;">已结束
                </div>
                <router-link
                  :to="{ name: 'CouponAdd', query: {id: scope.row.id, see: true} }"
                  class="ml10">
                  <el-button
                    type="text"
                    size="small">查看
                  </el-button>
                </router-link>
              </div>
            </template>
            <div v-else>
              <template v-if="scope.row.status <= 1">
                <el-button
                  type="text"
                  size="small"
                  @click="toVoid(scope.row.id)">作废
                </el-button>
                <router-link
                  v-if="scope.row.status == 0"
                  :to="{ name: 'CouponAdd', query: {id: scope.row.id, see: true} }"
                  class="ml10">
                  <el-button
                    type="text"
                    size="small">查看
                  </el-button>
                </router-link>
              </template>
              <template v-if="scope.row.status == 1">
                <router-link
                  :to="{ name: 'CouponAdd', query: {id: scope.row.id} }"
                  class="ml10">
                  <el-button
                    type="text"
                    size="small">编辑
                  </el-button>
                </router-link>
              </template>
            </div>
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
import * as ApiCoupon from '@/api/coupon'
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
        couponType: '',
        distType: '',
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
      ApiCoupon.couponExport({ ...row }, '优惠列表导出')
    },
    getList () {
      ApiCoupon.list({
        ...this.search,
        type: this.type,
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
        ApiCoupon.discard({ id }).then(({ code, message = '' }) => {
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
