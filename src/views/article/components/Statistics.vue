<template>
  <el-dialog
    :visible="visible"
    :before-close="close"
    width="900px"
    title="文章统计"
  >
    <div class="title">
      <div class="name">活动名称：{{ resData.name }}</div>
      <div class="time">活动时间：{{ resData.beginTime }} 至 {{ resData.endTime }}</div>
    </div>
    <!--<select-store
      class="store"
      labelwidth="60px"
      selectwidth="194px"
      @change="changeSelectStore" />-->
    <el-table
      :data="dataList"
      class="mt20">
      <el-table-column
        :show-overflow-tooltip="true"
        label="任务步骤"
        align="center">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column
        width="320"
        label="可完成时间"
        align="center">
        <template slot-scope="scope">
          {{ scope.row.beginTime }} 至 {{ scope.row.endTime }}
        </template>
      </el-table-column>
      <el-table-column
        label="已完成人数"
        align="center">
        <template slot-scope="scope">
          {{ scope.row.finishCount }}
        </template>
      </el-table-column>
    </el-table>
    <!--<div class="g-pagination-wrap">
      <el-pagination
        :current-page="search.pageNum"
        :page-sizes="$store.state.app.pageSizes"
        :page-size="search.pageSize"
        :total="search.totalCount"
        :layout="$store.state.app.layout"
        @size-change="sizeChange"
        @current-change="pageChange" />
    </div>-->
  </el-dialog>
</template>

<script>
import * as ApiTask from '@/api/task'
import SelectStore from '@/components/SelectStore'

export default {
  name: 'Statistics',
  components: {
    SelectStore
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    activeId: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      storeId: 0,
      companyId: 0,
      resData: {},
      dataList: [],
      search: {
        pageNum: 1,
        totalCount: 0,
        pageSize: 10
      }
    }
  },
  watch: {
    storeId () {
      this.search.pageNum = 1
      this.getList()
    },
    companyId () {
      this.search.pageNum = 1
      this.getList()
    },
    visible (newVal) {
      if (newVal) {
        // this.getDetail()
        this.getList()
      }
    }
  },
  created () {
  },
  methods: {
    changeSelectStore (val) {
      this.storeId = +val.storeId || 0
      this.companyId = +val.companyId || 0
    },
    getList () {
      ApiTask.statisinfo({
        ...this.search,
        storeId: this.storeId || undefined,
        companyId: this.companyId || undefined,
        id: this.activeId || undefined
      }).then(({ data }) => {
        this.resData = data
        this.dataList = data.taskRuleList || []
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
    async getDetail () {
      if (this.activeId) {
        const res = await ApiTask.info({ id: this.activeId }).catch(() => false)
        if (!res) return
        this.resData = res.data
      }
    },
    close () {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped lang="scss">
  .store {
    margin-left: -13px;
  }

  .title {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;

    .name {
      margin-bottom: 5px;
    }
  }
</style>
