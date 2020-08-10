<template>
  <div class="page-appointment">
    <router-link
      :to="{ name: 'AppointmentDetail' }">
      <el-button
        type="primary"
        icon="el-icon-plus">新增服务项目
      </el-button>
    </router-link>
    <!--搜索-->
    <div class="ui-search-header-block mt10">
      <el-form
        :inline="true"
        label-width="70px">
        <div>
          <select-store
            style="display: inline-block; margin-bottom: 10px"
            labelwidth="70px"
            selectwidth="200px"
            @change="changeSelectStore" />
          <el-form-item label="名称">
            <el-input
              v-model="search.name"
              class="w200"
              placeholder="请输入项目名称" />
          </el-form-item>
        </div>
      </el-form>
      <el-button
        class="btn-search"
        type="primary"
        icon="el-icon-search"
        @click="pageChange(1)">搜索
      </el-button>
    </div>
    <el-table
      v-loading="loading"
      :data="listData"
      class="mt10">
      <el-table-column
        align="center"
        label="项目图片">
        <template slot-scope="scope">
          <el-image
            :src="scope.row.imgUrl"
            fit="contain"
            style="width: 60px; height: 60px; display: block; margin: 0 auto;"/>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="项目名称"
        show-overflow-tooltip
        align="center" />
      <el-table-column
        prop="price"
        align="center"
        label="价格" />
      <el-table-column
        prop="updateAt"
        align="center"
        label="操作人" />
      <el-table-column
        prop="updateTime"
        align="center"
        label="操作时间" />
      <el-table-column
        label="操作"
        fixed="right"
        width="120"
        align="center">
        <template slot-scope="scope">
          <router-link
            :to="{ name: 'AppointmentDetail', query: {id: scope.row.id} }">
            <el-button
              type="text"
              size="small">编辑
            </el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <div class="g-pagination-wrap">
      <el-pagination
        :current-page="search.pageNum"
        :page-sizes="$store.state.app.pageSizes"
        :page-size="search.pageSize"
        :total="totalCount"
        :layout="$store.state.app.layout"
        @size-change="sizeChange"
        @current-change="pageChange"
      />
    </div>
  </div>
</template>

<script>
import * as ApiAppointment from '@/api/appointment'
import SelectStore from '@/components/SelectStore'

export default {
  name: 'Appointment',

  components: {
    SelectStore
  },

  data () {
    return {
      loading: true,
      listData: [],
      search: {
        storeId: '',
        companyId: '',
        name: '',
        pageNum: 1,
        pageSize: 10
      },
      totalCount: 0
    }
  },
  computed: {
  },
  mounted () {
  },
  created () {
    this.getList()
  },
  methods: {
    changeSelectStore (val) {
      this.search.storeId = val.storeId || ''
      this.search.companyId = val.companyId || ''
    },
    getList () {
      this.loading = true
      ApiAppointment.list({ ...this.search }).then(({ data }) => {
        this.listData = data.dataList || []
        this.totalCount = data.totalCount || 0
        this.loading = false
      })
    },
    sizeChange (e) {
      this.search.pageSize = e
      this.searchFn()
    },
    pageChange (e) {
      this.search.pageNum = e
      this.getList()
    }
  }
}
</script>
<style lang="scss">
</style>
