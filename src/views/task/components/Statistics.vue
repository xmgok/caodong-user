<template>
  <div>
    <el-dialog
      :visible="visible"
      :before-close="close"
      width="900px"
      title="任务统计"
    >
      <div class="title">
        <div class="name">活动名称：{{ resData.name }}</div>
        <div class="time">活动时间：{{ resData.beginTime }} 至 {{ resData.endTime }}</div>
      </div>
      <div
        v-if="resData.type===1||resData.type===3"
        class="flex flex-jc-sb">
        <select-store
          class="store"
          labelwidth="60px"
          selectwidth="194px"
          @change="changeSelectStore" />
        <el-button
          size="mini"
          type="text"
          @click="showDetail()">详情
        </el-button>
      </div>
      <!--吸粉-->
      <template v-if="resData.type===1">
        <el-table
          :key="String(Math.random()).substring(2)"
          :data="dataList2"
          class="mt20">
          <el-table-column
            :show-overflow-tooltip="true"
            :key="String(Math.random()).substring(2)"
            label="转发数"
            align="center">
            <template slot-scope="scope">
              {{ scope.row.forwardNubmer }}
            </template>
          </el-table-column>
          <el-table-column
            :key="String(Math.random()).substring(2)"
            label="浏览次数"
            align="center">
            <template slot-scope="scope">
              {{ scope.row.browseNubmer }}
            </template>
          </el-table-column>
          <el-table-column
            :key="String(Math.random()).substring(2)"
            label="吸粉数"
            align="center">
            <template slot-scope="scope">
              {{ scope.row.fansNubmer }}
            </template>
          </el-table-column>
          <el-table-column
            :key="String(Math.random()).substring(2)"
            label="访客数"
            align="center">
            <template slot-scope="scope">
              {{ scope.row.allClientNubmer }}
            </template>
          </el-table-column>
        </el-table>
        <el-table
          :key="String(Math.random()).substring(2)"
          :data="dataList"
          class="mt20">
          <el-table-column
            :show-overflow-tooltip="true"
            label="吸粉目标"
            align="center">
            <template slot-scope="scope">
              {{ scope.row.target }}
            </template>
          </el-table-column>
          <el-table-column
            label="已完成员工数(人)"
            align="center">
            <template slot-scope="scope">
              {{ scope.row.finishedNubmer }}
            </template>
          </el-table-column>
          <el-table-column
            label="未完成员工数(人)"
            align="center">
            <template slot-scope="scope">
              {{ scope.row.unfinishedNubmer }}
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!--转发-->
      <template v-if="resData.type===2">
        <el-table
          :key="String(Math.random()).substring(2)"
          :data="dataList2"
          class="mt20">
          <el-table-column
            :show-overflow-tooltip="true"
            :key="String(Math.random()).substring(2)"
            label="转发数"
            align="center">
            <template slot-scope="scope">
              {{ scope.row.forwardNubmer }}
            </template>
          </el-table-column>
          <el-table-column
            :key="String(Math.random()).substring(2)"
            label="浏览次数"
            align="center">
            <template slot-scope="scope">
              {{ scope.row.browseNubmer }}
            </template>
          </el-table-column>
          <el-table-column
            :key="String(Math.random()).substring(2)"
            label="访客数"
            align="center">
            <template slot-scope="scope">
              {{ scope.row.allClientNubmer }}
            </template>
          </el-table-column>
        </el-table>
        <el-table
          :key="String(Math.random()).substring(2)"
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
            label="任务时间"
            align="center">
            <template slot-scope="scope">
              {{ scope.row.beginTime || '--' }} 至 {{ scope.row.endTime || '--' }}
            </template>
          </el-table-column>
          <el-table-column
            label="转发次数"
            align="center">
            <template slot-scope="scope">
              {{ scope.row.forwardNubmer }}
            </template>
          </el-table-column>
          <el-table-column
            label="已完成员工数(人)"
            align="center">
            <template slot-scope="scope">
              {{ scope.row.finishedNubmer }}
            </template>
          </el-table-column>
          <el-table-column
            label="打开未转发员工数"
            align="center">
            <template slot-scope="scope">
              {{ scope.row.unfinishedNubmer }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            width="50"
            fixed="right">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                @click="showDetail(scope.row,scope.$index)">详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!--业绩-->
      <template v-if="resData.type===3">
        <el-table
          :key="String(Math.random()).substring(2)"
          :data="dataList2"
          class="mt20">
          <el-table-column
            :show-overflow-tooltip="true"
            :key="String(Math.random()).substring(2)"
            label="转发数"
            align="center">
            <template slot-scope="scope">
              {{ scope.row.forwardNubmer }}
            </template>
          </el-table-column>
          <el-table-column
            :key="String(Math.random()).substring(2)"
            label="浏览次数"
            align="center">
            <template slot-scope="scope">
              {{ scope.row.browseNubmer }}
            </template>
          </el-table-column>
          <el-table-column
            :key="String(Math.random()).substring(2)"
            label="访客数"
            align="center">
            <template slot-scope="scope">
              {{ scope.row.allClientNubmer }}
            </template>
          </el-table-column>
          <el-table-column
            :key="String(Math.random()).substring(2)"
            label="成交金额"
            align="center">
            <template slot-scope="scope">
              {{ scope.row.orderAmount }}
            </template>
          </el-table-column>
        </el-table>
        <el-table
          :key="String(Math.random()).substring(2)"
          :data="dataList"
          class="mt20">
          <el-table-column
            :show-overflow-tooltip="true"
            label="业绩目标(级)"
            align="center">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            label="达成目标(元)"
            align="center">
            <template slot-scope="scope">
              {{ scope.row.target }}
            </template>
          </el-table-column>
          <el-table-column
            label="已完成员工数(人)"
            align="center">
            <template slot-scope="scope">
              {{ scope.row.finishedNubmer }}
            </template>
          </el-table-column>
          <el-table-column
            label="未完成员工数(人)"
            align="center">
            <template slot-scope="scope">
              {{ scope.row.unfinishedNubmer }}
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-dialog>
    <el-dialog
      :visible="visibleDetail"
      :before-close="closeDetail"
      width="1000px"
      title="任务统计"
    >
      <div class="title">
        <div class="name">活动名称：{{ resData.name }} <span v-if="stepIndex">(第{{ stepIndex }}步)</span></div>
        <div class="time">活动时间：
          {{ resData.type!==2?resData.beginTime:dataList[stepIndex-1].beginTime }}
          至
          {{ resData.type!==2?resData.endTime:dataList[stepIndex-1].endTime }}
        </div>
      </div>
      <div class="flex flex-jc-sb">
        <div class="store-wrap">
          <select-store
            class="store"
            labelwidth="60px"
            selectwidth="194px"
            @change="changeSelectStore2" />
          <el-select
            v-model="status"
            class="ml10"
            placeholder="请选择">
            <el-option
              v-for="(value, key) in statusArr"
              :key="key"
              :value="key"
              :label="value" />
          </el-select>
        </div>
        <div class="export">
          <el-button
            type="primary"
            class="ml5"
            @click="download3">导出
          </el-button>
        </div>
      </div>
      <!--吸粉-->
      <template v-if="resData.type===1">
        <el-table
          :data="dataList3"
          :summary-method="getSummaries1"
          show-summary
          class="mt20">
          <el-table-column
            label="序号"
            align="center">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column
            label="导购姓名"
            align="center">
            <template slot-scope="scope">
              {{ scope.row.empName }}
            </template>
          </el-table-column>
          <el-table-column
            label="是否完成"
            align="center">
            <template slot-scope="scope">
              {{ scope.row.isComple===1?'已完成':'未完成' }}
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="所属分公司"
            align="center">
            <template slot-scope="scope">
              {{ scope.row.companyName }}
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="所属门店"
            align="center">
            <template slot-scope="scope">
              {{ scope.row.storeName }}
            </template>
          </el-table-column>
          <el-table-column
            label="转发次数"
            align="center">
            <template slot-scope="scope">
              {{ scope.row.forwardNubmer }}
            </template>
          </el-table-column>
          <el-table-column
            label="浏览次数"
            align="center">
            <template slot-scope="scope">
              {{ scope.row.browseNubmer }}
            </template>
          </el-table-column>
          <el-table-column
            label="吸粉数"
            align="center">
            <template slot-scope="scope">
              {{ scope.row.fansNubmer }}
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!--转发-->
      <template v-if="resData.type===2">
        <el-table
          :data="dataList3"
          :summary-method="getSummaries2"
          show-summary
          class="mt20">
          <el-table-column
            label="序号"
            align="center">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column
            label="导购姓名"
            align="center">
            <template slot-scope="scope">
              {{ scope.row.empName }}
            </template>
          </el-table-column>
          <el-table-column
            label="是否完成"
            align="center">
            <template slot-scope="scope">
              {{ scope.row.isComple===1?'已完成':'未完成' }}
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="所属分公司"
            align="center">
            <template slot-scope="scope">
              {{ scope.row.companyName }}
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="所属门店"
            align="center">
            <template slot-scope="scope">
              {{ scope.row.storeName }}
            </template>
          </el-table-column>
          <el-table-column
            label="转发次数"
            align="center">
            <template slot-scope="scope">
              {{ scope.row.forwardNubmer }}
            </template>
          </el-table-column>
          <el-table-column
            label="浏览次数"
            align="center">
            <template slot-scope="scope">
              {{ scope.row.browseNubmer }}
            </template>
          </el-table-column>
          <el-table-column
            label="访客数"
            align="center">
            <template slot-scope="scope">
              {{ scope.row.allClientNubmer }}
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!--业绩-->
      <template v-if="resData.type===3">
        <el-table
          :data="dataList3"
          :summary-method="getSummaries3"
          show-summary
          class="mt20">
          <el-table-column
            label="序号"
            align="center">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column
            label="导购姓名"
            align="center">
            <template slot-scope="scope">
              {{ scope.row.empName }}
            </template>
          </el-table-column>
          <el-table-column
            label="是否完成"
            align="center">
            <template slot-scope="scope">
              {{ scope.row.isComple===1?'已完成':'未完成' }}
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="所属分公司"
            align="center">
            <template slot-scope="scope">
              {{ scope.row.companyName }}
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="所属门店"
            align="center">
            <template slot-scope="scope">
              {{ scope.row.storeName }}
            </template>
          </el-table-column>
          <el-table-column
            label="转发次数"
            align="center">
            <template slot-scope="scope">
              {{ scope.row.forwardNubmer }}
            </template>
          </el-table-column>
          <el-table-column
            label="浏览次数"
            align="center">
            <template slot-scope="scope">
              {{ scope.row.browseNubmer }}
            </template>
          </el-table-column>
          <el-table-column
            label="访客数"
            align="center">
            <template slot-scope="scope">
              {{ scope.row.allClientNubmer }}
            </template>
          </el-table-column>
          <el-table-column
            label="成交金额"
            align="center">
            <template slot-scope="scope">
              {{ scope.row.orderAmount }}
            </template>
          </el-table-column>
        </el-table>
      </template>
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
    </el-dialog>
  </div>
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
      statusArr: {
        '': '全部',
        '0': '未完成',
        '1': '已完成'
      },
      status: '', // '' '0' '1'
      stepIndex: 1,
      visibleDetail: false,
      storeId: 0,
      companyId: 0,
      storeId2: 0,
      companyId2: 0,
      resData: {},
      resData3: {},
      dataList: [],
      dataList2: [],
      dataList3: [],
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
    storeId2 () {
      this.search.pageNum = 1
      this.getDetail()
    },
    companyId2 () {
      this.search.pageNum = 1
      this.getDetail()
    },
    status () {
      this.search.pageNum = 1
      this.getDetail()
    }
  },
  created () {
    this.getList()
  },
  methods: {
    download3 () {
      ApiTask.exportStatisticDetail({
        companyId: this.companyId2 || undefined,
        storeId: this.storeId2 || undefined,
        isComplete: this.status,
        taskId: this.activeId,
        id: this.row.id ? this.row.id : undefined,
        pageSize: this.search.pageSize,
        pageNum: this.search.pageNum
      }, '任务详情导出')
    },
    // 吸粉
    getSummaries1 () {
      const { empNumber, forwardNubmer, browseNubmer, fansNubmer } = this.resData3
      return [`共计${empNumber}人`, '', '', '', '', `${forwardNubmer}`, `${browseNubmer}`, `${fansNubmer}`]
    },
    // 转发
    getSummaries2 () {
      const { empNumber, forwardNubmer, browseNubmer, allClientNubmer } = this.resData3
      return [`共计${empNumber}人`, '', '', '', '', `${forwardNubmer}`, `${browseNubmer}`, `${allClientNubmer}`]
    },
    // 业绩
    getSummaries3 () {
      const { empNumber, forwardNubmer, browseNubmer, allClientNubmer, orderAmount } = this.resData3
      return [`共计${empNumber}人`, '', '', '', '', `${forwardNubmer}`, `${browseNubmer}`, `${allClientNubmer}`, `${orderAmount}`]
    },
    changeSelectStore (val) {
      this.storeId = +val.storeId || 0
      this.companyId = +val.companyId || 0
    },
    changeSelectStore2 (val) {
      this.storeId2 = +val.storeId || 0
      this.companyId2 = +val.companyId || 0
    },
    getList () {
      ApiTask.statisinfo({
        ...this.search,
        storeId: this.storeId || undefined,
        companyId: this.companyId || undefined,
        id: this.activeId || undefined
      }).then(({ data }) => {
        this.resData = data
        this.dataList = data.taskStepList || []
        const obj = { ...data }
        delete obj.taskStepList
        this.dataList2 = [obj]
        this.search.totalCount = data.totalCount || 0
      })
    },
    sizeChange (e) {
      this.search.pageSize = e
      this.getDetail()
    },
    pageChange (e) {
      this.search.pageNum = e
      this.getDetail()
    },
    close () {
      this.$emit('update:visible', false)
    },
    async getDetail () {
      const res = await ApiTask.statisinfoDetail({
        companyId: this.companyId2 || undefined,
        storeId: this.storeId2 || undefined,
        isComplete: this.status,
        taskId: this.activeId,
        id: this.row.id ? this.row.id : undefined,
        pageSize: this.search.pageSize,
        pageNum: this.search.pageNum
      }).catch(() => false)
      if (!res) return
      this.resData3 = res.data
      const statisticDetail = res.data.statisticDetail
      this.dataList3 = statisticDetail.dataList
      this.search.totalCount = statisticDetail.totalCount
    },
    async showDetail (row, index) {
      this.search = {
        pageNum: 1,
        totalCount: 0,
        pageSize: 10
      }
      this.visibleDetail = true
      this.stepIndex = index !== undefined ? index + 1 : ''
      this.row = row || {}
      this.getDetail()
    },
    closeDetail () {
      this.visibleDetail = false
    }
  }
}
</script>

<style scoped lang="scss">
  .store {
    margin-left: -13px;
  }

  .store-wrap {
    display: flex;
    align-items: center;
  }

  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;

    .name {
      margin-bottom: 5px;
    }
  }
</style>
