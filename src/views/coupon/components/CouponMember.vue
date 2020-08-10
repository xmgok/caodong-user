<template>
  <div>
    <div style="display: -webkit-box; -webkit-box-pack: justify;">
      <div>
        <router-link :to="{ name: 'CouponMemberDetail' }">
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="small">会员发券
          </el-button>
        </router-link>
      </div>
      <el-form
        :inline="true"
        :model="search"
        class="demo-form-inline">
        <el-form-item>
          <el-input
            v-model="search.name"
            placeholder="请输入任务名称">
            <el-button
              slot="append"
              class="btn-search"
              type="primary"
              icon="el-icon-search"
              @click="getList()"
            />
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      :data="dataList"
      class="mt20">
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        width="150"
        label="任务名称">
        <template slot-scope="{row}">
          {{ row.name }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="发放人数">
        <template slot-scope="{row}">
          {{ row.issueNumber }}
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        width="300"
        label="发放时间">
        <template slot-scope="{row}">
          {{ row.issueTime }}
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        label="任务状态"
        align="center">
        <template slot-scope="{row}">
          {{ +row.status == 0 ? "未发放":"已发放" }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        width="100"
        align="center">
        <!--自己门店的，可编辑-->
        <template
          v-if="scope.row.isEdit == 1"
          slot-scope="scope">
          <!--已发放只能查看-->
          <template v-if="scope.row.status == 0">
            <router-link
              :to="{ name: 'CouponMemberDetail', query: {id: scope.row.id} }"
              class="mr10 ml10">
              <el-button
                type="text"
                size="small">编辑
              </el-button>
            </router-link>
            <el-button
              type="text"
              size="small"
              @click="del(scope.row.id)">删除
            </el-button>
          </template>
        </template>
        <template slot-scope="scope">
          <router-link
            v-if="scope.row.status == 1"
            :to="{ name: 'CouponMemberDetail', query: {id: scope.row.id, see: true} }">
            <el-button
              type="text"
              size="small">查看
            </el-button>
          </router-link>
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
import * as ApiCoupon from '@/api/coupon'
export default {
  components: {
  },
  props: {
    status: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      search: {
        name: '', // 搜索
        pageNum: 1,
        totalCount: 0,
        pageSize: 10
      },
      dataList: [
      ]
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      ApiCoupon.couponIssueList({
        ...this.search,
        status: this.status
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
    },
    del (id) {
      this.$confirm('确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ApiCoupon.couponIssueDelete({ id }).then(({ message = '' }) => {
          this.pageNum = 1
          this.getList()
          this.$message({ type: 'success', message: message })
        }, () => {
        })
      }).catch(() => {
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .goods {
    display: flex;
    font-size: 12px;
    line-height: 1;

    .goods-img {
      min-width: 50px;
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

  .qr-img {
    width: 174px;
    height: 174px;
    margin: 0 auto;
    display: block;
  }
</style>
