<template>
  <div>
    <div style="display: -webkit-box; -webkit-box-pack: justify;">
      <div>
        <router-link :to="{ name: 'PromotionSeckillDetail' }">
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="small">新增秒杀
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
        label="秒杀商品">
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
        label="市场价"
        align="center">
        <template slot-scope="scope">
          {{ scope.row.productPrice }}
        </template>
      </el-table-column>
      <el-table-column
        label="秒杀价"
        align="center">
        <template slot-scope="scope">
          {{ scope.row.activePrice }}
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        label="秒杀时间"
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
          {{ statusOBJ[scope.row.status] }}
        </template>
      </el-table-column>
      <el-table-column
        label="已抢件数"
        align="center">
        <template slot-scope="scope">
          {{ scope.row.virtualNumber }}
        </template>
      </el-table-column>
      <el-table-column
        label="订单金额"
        min-width="100"
        align="center">
        <template slot-scope="scope">
          ￥{{ scope.row.sellAmount }}
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
            v-if=" scope.row.status !==1"
            :to="{ name: 'PromotionSeckillDetail', query: {id: scope.row.id, see: true} }">
            <el-button
              type="text"
              size="small">查看
            </el-button>
          </router-link>
          <!--自己门店的，可编辑-->
          <template v-if="scope.row.isEdit == 1">
            <!--未开始-->
            <!-- <el-popover
              v-if="scope.row.status == 1"
              ref="popover"
              placement="right"
              title=""
              width="200"
              trigger="hover">
              <img
                :src="getQrCode(scope.row)"
                class="qr-img"
                alt="">
              需要使用slot="reference"并删掉v-popover:popover，如果预览按钮放在el-popover外部表格的最后一行会无效
              <el-button
                slot="reference"
                type="text"
                size="small">预览
              </el-button>
            </el-popover> -->
            <!--  -->
            <router-link
              v-if=" scope.row.status == 1 && scope.row.isEdit == 1"
              :to="{ name: 'PromotionSeckillDetail', query: {id: scope.row.id} }"
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
              @click="itemEdit(scope.row)">修改已抢件数
            </el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>

    <!--修改已抢件数-->
    <el-dialog
      :visible.sync="showEditItem"
      title="修改已抢件数"
      width="500px">
      <el-form
        ref="editItemFormRef"
        :model="editItemForm"
        :rules="editItemFormRules"
        label-width="120px"
        label-position="right"
        class="edit-form">
        <el-form-item
          label="件数:"
          prop="virtualNumber">
          <el-input v-model="editItemForm.virtualNumber" />
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
    <statistic-seckill
      :active-id="activeId"
      :visible.sync="isShowStatisticSeckill" />
  </div>
</template>

<script>
import * as ApiSeckill from '@/api/seckill'
import { getToken } from '@/utils/auth'
import statisticSeckill from './statisticSeckill'
import * as Validate from '@/utils/validate'
import { dateFormat } from '@/utils'
export default {
  components: {
    statisticSeckill
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
        virtualNumber: ''
      },
      editItemFormRules: {
        virtualNumber: [
          { required: true, message: '本项必填' },
          {
            validator: (rule, value, callback) => Validate.limitNumber(rule, value, callback, { min: 1 }),
            trigger: 'blur'
          }
        ]
      },
      activeId: 0,
      isShowStatisticSeckill: false,
      search: {
        productCode: '',
        pageNum: 1,
        totalCount: 0,
        pageSize: 10,
        companyId: '',
        storeId: ''

      },
      dataList: [],
      statusOBJ: {
        1: '未开始',
        2: '进行中',
        3: '已结束'
      }
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
        ApiSeckill.editvirtualNumber(this.editItemForm).then(() => {
          this.getList()
          this.showEditItem = false
        })
      })
    },
    getQrCode (item) {
      /*
      门店商品id【id】 简写为【i】 转发带的一定是门店商品id。
      商品查询方式【type】简写为【t】type为1表示以商品库的id去门店商品表中查询商品，返回的id是门店商品id，门店无商品接口报错。所以转发不用带type。因为转发带的一定是门店商品id。
      活动id【activeId】 简写为【a】当值为1时，表示活动类型是拼团(group)。
      活动类型【activeType】 简写为【b】。
      【empid】 简写为【e】。
      */
      return `${window.VUE_APP_API_URL + window.VUE_APP_BASE_API}product/qrcode?token=${getToken()}&width=750&scene=${encodeURIComponent(`i=${item.productId}&a=${item.id}&b=1&t=1`)}`
    },
    showActivityStatistics (item) {
      this.activeId = item.id
      this.isShowStatisticSeckill = true
    },
    getList () {
      ApiSeckill.list({
        ...this.search,
        status: this.type
      }).then(({ data }) => {
        this.dataList = (data.dataList || []).map((item) => {
          return {
            ...item,
            startTime: item.startTime ? dateFormat(item.startTime) : '--',
            endTime: item.endTime ? dateFormat(item.endTime) : '--'
          }
        })
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
        ApiSeckill.deleteStop({ id, type: type }).then(({ code, message = '' }) => {
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
