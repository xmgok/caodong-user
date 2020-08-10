<template>
  <div>
    <div style="display: -webkit-box; -webkit-box-pack: justify;">
      <div>
        <router-link :to="{ name: 'PromotionBargainDetail' }">
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="small">新增砍价
          </el-button>
        </router-link>
      </div>
      <el-input
        v-model="search.productCode"
        size="small"
        placeholder="输入商品编码查询"
        class="">
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="searchFn" />
      </el-input>
    </div>
    <el-table
      :data="dataList"
      class="mt20">
      <el-table-column
        :show-overflow-tooltip="true"
        width="240"
        label="砍价商品">
        <template slot-scope="{row}">
          <div
            class="goods">
            <img
              :src="row.productImg"
              alt=""
              class="goods-img">
            <div class="goods-content">
              <div class="goods-content-name">
                <div class="goods-label">商品名称：</div>
                <div>{{ row.productName }}</div>
              </div>
              <div class="goods-content-spec">
                <div class="goods-label">商品编码：</div>
                <div>{{ row.productCode }}</div>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="原价"
        align="center">
        <template slot-scope="scope">
          {{ scope.row.productPrice }}
        </template>
      </el-table-column>
      <el-table-column
        label="底价"
        align="center">
        <template slot-scope="scope">
          {{ scope.row.minPrice }}
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        label="砍价时间"
        width="320"
        align="center">
        <template slot-scope="scope">
          {{ scope.row.startTime }} - {{ scope.row.endTime }}
        </template>
      </el-table-column>
      <el-table-column
        label="活动状态"
        align="center">
        <template slot-scope="scope">
          {{ scope.row.status===1?'未开始':'' }}
          {{ scope.row.status===2?'进行中':'' }}
          {{ scope.row.status===3?'已结束':'' }}
        </template>
      </el-table-column>
      <el-table-column
        label="参与人数"
        align="center">
        <template slot-scope="scope">
          {{ scope.row.joinNum }}
        </template>
      </el-table-column>
      <el-table-column
        label="购买人数"
        align="center">
        <template slot-scope="scope">
          {{ scope.row.payNum }}
        </template>
      </el-table-column>
      <el-table-column
        label="销售金额"
        min-width="100"
        align="center">
        <template slot-scope="scope">
          ￥{{ scope.row.sellAmount || '0.00' }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        width="160"
        align="center">
        <template slot-scope="scope">
          <!--非自己门店的，只能查看-->
          <router-link
            v-if="scope.row.status != 1 || scope.row.isEdit == 0"
            :to="{ name: 'PromotionBargainDetail', query: {id: scope.row.id, see: true} }">
            <el-button
              type="text"
              size="small">查看
            </el-button>
          </router-link>
          <!--自己门店的，可编辑-->
          <template v-if="scope.row.isEdit != 0">
            <router-link
              v-if="scope.row.status == 1"
              :to="{ name: 'PromotionBargainDetail', query: {id: scope.row.id} }"
              class="ml10">
              <el-button
                type="text"
                size="small">编辑
              </el-button>
            </router-link>
            <!--未开始才可以删除-->
            <el-button
              v-if="scope.row.status == 1"
              class="ml10"
              type="text"
              size="small"
              @click="delStop(scope.row.id, 1)">删除
            </el-button>
            <!--进行中-->
            <el-button
              v-if="scope.row.status == 2"
              class="ml10"
              type="text"
              size="small"
              @click="delStop(scope.row.id, 2)">关闭
            </el-button>
            <el-button
              v-if="scope.row.status != 1"
              class="ml10"
              type="text"
              size="small"
              @click="showActivityStatistics(scope.row)">统计
            </el-button>
            <el-button
              v-if="scope.row.status != 1"
              class="ml10"
              type="text"
              size="small"
              @click="itemEdit(scope.row)">修改参与人数
            </el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>

    <!--修改参与人数-->
    <el-dialog
      :visible.sync="showEditItem"
      title="修改参与人数"
      width="500px">
      <el-form
        ref="editItemFormRef"
        :model="editItemForm"
        :rules="editItemFormRules"
        label-width="120px"
        label-position="right"
        class="edit-form">
        <el-form-item
          label="参与人数:"
          prop="num">
          <el-input v-model="editItemForm.num" />
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button
          size="small"
          @click="showEditItem = false">取 消
        </el-button>
        <el-button
          type="primary"
          size="small"
          @click="itemSave">保 存
        </el-button>
      </div>
    </el-dialog>
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
    <active-data
      v-if="isShowActiveData"
      :active-id="activeId"
      :visible.sync="isShowActiveData" />
  </div>
</template>

<script>
import * as ApiGroup from '@/api/bargain'
import ActiveData from '@/views/promotion/bargain/components/Statistics'
import * as Validate from '@/utils/validate'

export default {
  components: {
    ActiveData
  },
  props: {
    type: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      showEditItem: false,
      editItemForm: {
        id: '',
        num: ''
      },
      editItemFormRules: {
        num: [
          { required: true, message: '本项必填' },
          {
            validator: (rule, value, callback) => Validate.limitNumber(rule, value, callback, { min: 1 }),
            trigger: 'blur'
          }
        ]
      },
      activeId: 0,
      isShowActiveData: false,
      search: {
        productCode: '',
        pageNum: 1,
        totalCount: 0,
        pageSize: 10
      },
      dataList: []
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    itemEdit (item) {
      this.showEditItem = true
      this.editItemForm.id = item.id
    },
    itemSave () {
      this.$refs['editItemFormRef'].validate((valid) => {
        if (!valid) return
        ApiGroup.updatenum(this.editItemForm).then(() => {
          this.getList()
          this.showEditItem = false
        })
      })
    },
    showActivityStatistics (item) {
      this.activeId = item.id
      this.isShowActiveData = true
    },
    getList () {
      ApiGroup.list({
        ...this.search,
        status: this.type
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
    delStop (id, type) {
      this.$confirm(`确定${type < 2 ? '删除' : '关闭'}吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // type 删除1 关闭2
        ApiGroup.deleteStop({ id, type: type }).then(({ code, message = '' }) => {
          this.$message({ type: (code === 'SUCCESS' ? 'success' : 'error'), message: message })
          if (code === 'SUCCESS') {
            this.search.pageNum = 1
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
