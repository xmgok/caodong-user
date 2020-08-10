<template>
  <div class="page-plugin-live">
    <el-tabs type="border-card">
      <el-tab-pane
        lazy
        label="全部">
        <!--条件筛选-->
        <div class="ui-search-header-block pr0">
          <el-form
            inline
            class="w-100"
            label-width="80px">
            <el-form-item>
              <el-button
                :loading="liveRoomSyncLoading"
                class="ml10"
                type="primary"
                size="small"
                @click="liveRoomSync">同步直播室
              </el-button>
              <el-popconfirm
                title="确定要删除吗？"
                @onConfirm="removeMulti">
                <el-button
                  slot="reference"
                  :disabled="multipleSelection.length === 0"
                  :loading="liveRoomRemoveLoading"
                  type="danger"
                  size="small"
                  class="ml5">删除</el-button>
              </el-popconfirm>
              <span class="ml10 grey">(由于微信限制，同步每天调用限额500次)</span>
            </el-form-item>
            <el-form-item class="fr">
              <el-input
                v-model="searchForm.name"
                size="small"
                clearable
                placeholder="输入直播室名称查询">
                <el-button
                  slot="append"
                  icon="el-icon-search"
                  @click="getList"/>
              </el-input>
            </el-form-item>
          </el-form>
        </div>

        <el-table
          v-loading="loading"
          :data="list"
          class="mt20"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            align="center"
            width="55"/>
          <el-table-column
            prop="roomId"
            show-overflow-tooltip
            align="center"
            label="id" />
          <el-table-column
            prop="name"
            show-overflow-tooltip
            align="center"
            label="直播名称" />
          <el-table-column
            min-width="260"
            prop="createTime"
            show-overflow-tooltip
            align="center"
            label="直播时间">
            <template slot-scope="{row}">
              {{ row._startTime }}至 {{ row._endTime }}
            </template>
          </el-table-column>
          <el-table-column
            prop="storeNum"
            show-overflow-tooltip
            align="center"
            label="直播门店数"/>
          <el-table-column
            prop="_statusText"
            show-overflow-tooltip
            align="center"
            label="状态"/>
          <el-table-column
            label="操作"
            fixed="right"
            align="center">
            <template slot-scope="{row}">
              <el-button
                type="text"
                size="small"
                @click="openStoreSelector(row)">编辑
              </el-button>

              <el-popconfirm
                title="确定要删除吗？"
                @onConfirm="remove(row.id)">
                <el-button
                  slot="reference"
                  type="text"
                  size="small"
                  class="ml5">删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <!-- 分页 -->
      <div class="g-pagination-wrap">
        <el-pagination
          :layout="$store.state.app.layout"
          :page-sizes="$store.state.app.pageSizes"
          :page-size="searchForm.pageSize"
          :current-page="searchForm.pageNum"
          :total="totalCount"
          @size-change="sizeChange"
          @current-change="pageChange"/>
      </div>
    </el-tabs>

    <!--门店选择，多选-->
    <select-store-tree
      v-if="isShowStore"
      :visible.sync="isShowStore"
      :default-value="storeList"
      @confirm="confirmCheckedStore"
    />
  </div>
</template>

<script>
import SelectStore from '@/components/SelectStore'
import * as ApiBroadcast from '@/api/broadcast'
import SelectStoreTree from '@/components/SelectStoreTree'
import * as date from '@/utils/index'

// 直播室状态
const LIVE_STATUS = { 101: '直播中', 102: '未开始', 103: '已结束', 104: '禁播', 105: '暂停中', 106: '异常' }

export default {
  name: 'PluginList',

  components: {
    SelectStore,
    SelectStoreTree
  },

  data () {
    return {
      // 删除加载中
      liveRoomRemoveLoading: false,
      // 同步加载中
      liveRoomSyncLoading: false,
      // 列表加载中
      loading: false,
      // 列表搜索关键字
      searchForm: {
        pageNum: 1,
        pageSize: 10
      },
      // 列表数据
      list: [],
      totalCount: 0,
      // 显示门店选择器
      isShowStore: false,
      // 已选择门店
      storeList: [],
      currentId: '',
      // 行多选
      multipleSelection: [],
      visible: false
    }
  },

  created () {
    this.getList()
  },

  methods: {
    getList () {
      this.loading = true
      ApiBroadcast.liveRoomList({
        ...this.searchForm
      }).then(({ data: { dataList, totalCount } }) => {
        this.list = dataList.map(item => {
          return {
            ...item,
            _statusText: LIVE_STATUS[item.status],
            _startTime: date.dateFormat(item.startTime),
            _endTime: date.dateFormat(item.endTime)
          }
        })
        this.totalCount = totalCount || 0
        this.loading = false
      })
    },
    sizeChange (size) {
      this.searchForm.pageSize = size
      this.getList()
    },
    pageChange (pageNum) {
      this.searchForm.pageNum = pageNum
      this.getList()
    },
    openStoreSelector (row) {
      this.storeList = []
      ApiBroadcast.liveRoomInfo({
        LiveRoomId: row.id
      }).then(res => {
        this.isShowStore = true
        this.currentId = row.id
        this.storeList = res.data.storeList || []
      })
    },
    confirmCheckedStore (data) {
      this.storeList = data
      ApiBroadcast.liveRoomUpdate({
        id: this.currentId,
        storeList: data
      }).then(res => {
        this.$message.success('分配门店成功')
        this.getList()
      })
    },
    liveRoomSync () {
      this.liveRoomSyncLoading = true
      ApiBroadcast.liveRoomSync({}).then(() => {
        this.searchForm.pageNum = 1
        this.getList()
        this.$message.success('同步成功')
        this.liveRoomSyncLoading = false
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    remove (id) {
      ApiBroadcast.liveRoomDelete({ id }).then(() => {
        this.$message.success('删除成功')
        this.searchForm.pageNum = 1
        this.getList()
      })
    },
    removeMulti () {
      if (!this.multipleSelection.length) {
        this.$message.info('请选择要删除的直播室')
      }

      this.liveRoomRemoveLoading = true
      ApiBroadcast.liveRoomDeleteBatch({
        ids: this.multipleSelection.map(v => v.id).join(',')
      }).then(() => {
        this.liveRoomRemoveLoading = false
        this.$message.success('删除成功')
        this.searchForm.pageNum = 1
        this.getList()
      })
    }
  }
}
</script>

<style lang="scss">
  .page-plugin-live {
    .cover-img {
      width: 80px;
      height: 80px;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
      background-color: #dcdcdc;
    }
    .live-name {
      width: 180px;
      margin-left: 10px;
      display: flex;
      height: 80px;
      align-items: center;
    }
  }
</style>
