<template>
  <div>
    <div style="display: -webkit-box; -webkit-box-pack: justify;">
      <div>
        <router-link :to="{ name: 'FullReduceAdd' }">
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="small">新增满减送
          </el-button>
        </router-link>
      </div>
      <el-input
        v-model="name"
        size="small"
        placeholder="请输入活动名称搜索"
        class="">
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="searchFn(1)" />
      </el-input>
    </div>
    <!--条件筛选-->
    <div
      class="ui-search-header-block dark mt15">
      <el-form
        :inline="true"
        label-width="80px">
        <select-store
          style="display: inline-block; margin-bottom: 10px"
          labelwidth="80px"
          selectwidth="250px"
          @change="changeSelectStore" />
        <!--分销商-->
        <el-form-item label="商品编码">
          <el-input
            v-model="search.productCodes"
            placeholder="请输入"
            class="width1" />
        </el-form-item>
      </el-form>
      <el-button
        class="btn-search"
        type="primary"
        icon="el-icon-search"
        @click="searchFn(2)"
      >
        查看活动
      </el-button>
    </div>
    <el-table
      :data="listData"
      class="mt20">
      <el-table-column
        :show-overflow-tooltip="true"
        prop="name"
        label="活动名称"
        min-width="150" />
      <el-table-column
        :show-overflow-tooltip="true"
        label="有效期"
        width="320"
        align="center">
        <template slot-scope="scope">
          {{ scope.row.beginTime }} - {{ scope.row.endTime }}
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        align="center">
        <template slot-scope="scope">
          <p v-if="scope.row.state == 0">未开始</p>
          <p v-if="scope.row.state == 1">进行中</p>
          <p v-if="scope.row.state == 2">已结束</p>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        width="130"
        align="center">
        <template slot-scope="scope">
          <!--非自己门店的，只能查看-->
          <router-link
            v-if="scope.row.state != 0 || scope.row.isEdit == 0"
            :to="{ name: 'FullReduceAdd', query: {id: scope.row.id, see: true} }">
            <el-button
              type="text"
              size="small">查看
            </el-button>
          </router-link>
          <!--自己门店的，可编辑-->
          <template v-if="scope.row.isEdit != 0">
            <!--未开始-->
            <router-link
              v-if="scope.row.state == 0"
              :to="{ name: 'FullReduceAdd', query: {id: scope.row.id} }">
              <el-button
                type="text"
                size="small">编辑
              </el-button>
            </router-link>
            <!--非进行中-->
            <el-button
              v-if="scope.row.state != 1"
              class="ml10"
              type="text"
              size="small"
              @click="delStop(scope.row.id, 1)">删除
            </el-button>
            <!--进行中-->
            <el-button
              v-if="scope.row.state == 1"
              class="ml10"
              type="text"
              size="small"
              @click="delStop(scope.row.id, 0)">终止
            </el-button>
          </template>
          <el-button
            class="ml10"
            type="text"
            size="small"
            @click="copy(scope.row.id)">复制
          </el-button>
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
import * as ApiFullreduce from '@/api/fullreduce'
import SelectStore from '@/components/SelectStore'

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
      searchType: 1,
      search: {
        productCodes: '',
        companyId: '',
        storeId: ''
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
    copy (id) {
      this.$router.push({ name: 'FullReduceAdd', query: { id, type: 'copy' } })
    },
    getList () {
      let data = { name: this.name, state: this.type, pageNum: this.currentPage, pageSize: this.pageSize }
      if (this.searchType === 2) {
        data = {
          ...data,
          ...this.search
        }
        delete data.name
      }
      ApiFullreduce.list(data).then(({ data }) => {
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
    searchFn (type) {
      this.searchType = type
      this.currentPage = 1
      this.getList()
    },
    delStop (id, type) {
      this.$confirm(`确定${type > 0 ? '删除' : '终止'}吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ApiFullreduce.deleteStop({ id, operate: type }).then(({ code, message = '' }) => {
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
