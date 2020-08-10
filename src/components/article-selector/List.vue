<template>
  <div>
    <el-input
      v-model="search.title"
      placeholder="请输入文章标题" >
      <el-button
        slot="append"
        class="btn-search"
        type="primary"
        icon="el-icon-search"
        @click="getList()"
      >搜索</el-button>
    </el-input>
    <el-table
      :data="dataList"
      class="mt20"
      @row-click="rowClick">
      <el-table-column
        v-if="!isMultiple"
        :show-overflow-tooltip="true"
        width="55"
        align="center">
        <template slot-scope="scope">
          <el-radio
            v-model="mySelectedId"
            :label="scope.row.id"
            :disabled="see">&nbsp;
          </el-radio>
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        label="文章标题">
        <template slot-scope="{row}">
          {{ row.title }}
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        label="创建时间"
        width="320"
        align="center">
        <template slot-scope="scope">
          {{ scope.row.createTime }}
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
      :active-id="activeId"
      :visible.sync="isShowActiveData" />
  </div>
</template>

<script>
import * as ApiArticle from '@/api/article'
import { getToken } from '@/utils/auth'
import ActiveData from '@/views/article/components/Statistics'

export default {
  components: {
    ActiveData
  },
  props: {
    type: {
      type: String,
      default: ''
    },
    isMultiple: {
      type: Boolean,
      default: false
    },
    see: {
      type: Boolean,
      default: false
    },
    selectedIds: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      mySelectedId: +this.selectedIds[0],
      activeId: 0,
      isShowActiveData: false,
      search: {
        productCode: '',
        title: '',
        pageNum: 1,
        totalCount: 0,
        pageSize: 10
      },
      dataList: [],
      form: {
        title: ''
      }
    }
  },
  watch: {
    selectedIds (newVal) {
      if (!this.isMultiple) {
        this.mySelectedId = +newVal[0] // 单选
      }
    },
    mySelectedId (newValue) { // 单选
      if (!this.isMultiple) {
        this.$emit('change', [+newValue])
      }
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    rowClick (row) {
      if (!this.isMultiple) {
        this.mySelectedId = +row.id // 单选
      }
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
      this.isShowActiveData = true
    },
    getList () {
      ApiArticle.list({
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
        ApiArticle.deleteStop({ id }).then(({ code, message = '' }) => {
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
