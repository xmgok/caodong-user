<template>
  <div>
    <div style="display: -webkit-box; -webkit-box-pack: justify;">
      <div>
        <router-link :to="{ name: 'TaskDetail' }">
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="small">新增任务
          </el-button>
        </router-link>
      </div>
      <el-input
        v-model="search.name"
        size="small"
        placeholder="请输入任务名称搜索"
        class="">
        <el-select
          slot="prepend"
          v-model="search.type"
          style="width: 140px;"
          placeholder="请选择任务类型">
          <el-option
            :value="1"
            label="吸粉" />
          <el-option
            :value="2"
            label="转发分享" />
          <el-option
            :value="3"
            label="业绩达成" />
        </el-select>
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
        label="任务名称">
        <template slot-scope="{row}">
          {{ row.name }}
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        label="任务时间"
        width="320"
        align="center">
        <template slot-scope="scope">
          {{ scope.row.beginTime }} - {{ scope.row.endTime }}
        </template>
      </el-table-column>
      <el-table-column
        label="任务类型"
        align="center">
        <template slot-scope="scope">
          {{ scope.row.type === 1 ? '吸粉' : '' }}
          {{ scope.row.type === 2 ? '转发分享' : '' }}
          {{ scope.row.type === 3 ? '业绩达成' : '' }}
        </template>
      </el-table-column>
      <el-table-column
        label="任务步骤"
        align="center">
        <template slot-scope="scope">
          {{ scope.row.stepNumber }}
        </template>
      </el-table-column>
      <el-table-column
        label="任务状态"
        align="center">
        <template slot-scope="scope">
          {{ scope.row.status === 1 ? '未开始' : '' }}
          {{ scope.row.status === 2 ? '进行中' : '' }}
          {{ scope.row.status === 3 ? '已结束' : '' }}
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
            :to="{ name: 'TaskDetail', query: {id: scope.row.id, see: true} }">
            <el-button
              type="text"
              size="small">查看
            </el-button>
          </router-link>
          <!--自己门店的，可编辑-->
          <template v-if="scope.row.isEdit != 0">
            <!--未开始-->
            <!--<el-popover
              ref="popover"
              placement="right"
              title=""
              width="200"
              trigger="hover">
              <img
                :src="getQrCode(scope.row)"
                class="qr-img"
                alt="">
              &lt;!&ndash;需要使用slot="reference"并删掉v-popover:popover，如果预览按钮放在el-popover外部表格的最后一行会无效&ndash;&gt;
              <el-button
                v-if="scope.row.status == 1"
                slot="reference"
                type="text"
                size="small">预览
              </el-button>
            </el-popover>-->
            <router-link
              v-if="scope.row.status == 1"
              :to="{ name: 'TaskDetail', query: {id: scope.row.id} }">
              <el-button
                type="text"
                size="small">编辑
              </el-button>
            </router-link>
            <!--非进行中-->
            <!--<el-button
              v-if="scope.row.status != 2"
              class="ml10"
              type="text"
              size="small"
              @click="delStop(scope.row.id, 1)">删除
            </el-button>-->
            <!--进行中-->
            <el-button
              v-if="scope.row.status != 3"
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
    <active-data
      v-if="isShowActiveData"
      :active-id="activeId"
      :visible.sync="isShowActiveData" />
  </div>
</template>

<script>
import * as ApiTask from '@/api/task'
import { getToken } from '@/utils/auth'
import ActiveData from '@/views/task/components/Statistics'

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
      activeId: 0,
      isShowActiveData: false,
      search: {
        type: '',
        name: '',
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
      this.isShowActiveData = true
    },
    getList () {
      ApiTask.list({
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
        /* , type: type */
        ApiTask.deleteStop({ id }).then(({ code, message = '' }) => {
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
