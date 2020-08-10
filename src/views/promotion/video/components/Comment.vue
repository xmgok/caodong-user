<template>
  <div>
    <el-dialog
      :visible="visible"
      :before-close="close"
      title="评论详情"
      width="1000px">
      <el-table
        :data="dataList"
        class="mt20">
        <el-table-column
          :show-overflow-tooltip="true"
          label="评价人"
          width="150"
          align="left">
          <template slot-scope="{row}">
            <el-row
              type="flex"
              align="middle">
              <img
                v-if="row.headImg"
                :src="row.headImg"
                style=" display:block; width: 50px; height: 50px; border-radius: 50%" >
              <p class="pl10">{{ row.nickname }}</p>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          label="评价内容"
          align="left">
          <template
            slot-scope="{row}">
            {{ row.content }}
          </template>
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          label="评价时间"
          width="150"
          align="center">
          <template slot-scope="{row}">
            {{ row.createTime }}
          </template>
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          width="100"
          label="回复数量"
          align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="replyInfo(scope.row.id)">回复({{ scope.row.replyNum }})</el-button>
          </template>
        </el-table-column>
        <el-table-column
          v-if="isEdit"
          width="80"
          label="是否展示"
          align="center">
          <template slot-scope="{row}">
            <el-switch
              v-model="row.status"
              :active-value="1"
              :inactive-value="0"
              @change="changeStatus(row.id, row.status)" />
          </template>
        </el-table-column>
      </el-table>
      <div class="g-pagination-wrap">
        <el-pagination
          :current-page="search.pageNum"
          :page-sizes="$store.state.app.pageSizes"
          :page-size="search.pageSize"
          :total="totalCount"
          :layout="$store.state.app.layout"
          @size-change="sizeChange"
          @current-change="pageChange" />
      </div>
    </el-dialog>
    <reply
      v-if="showReply"
      :id="commentId"
      :visible.sync="showReply" />
  </div>
</template>

<script>
import * as ApiVideo from '@/api/video'
import Reply from './Reply'

export default {
  components: { Reply },
  props: {
    // 是否显示
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      type: Number,
      default: 0
    },
    isEdit: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      search: { pageNum: 1, pageSize: 10 },
      totalCount: 0,
      dataList: [],
      showReply: false,
      commentId: ''
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    replyInfo (id) {
      this.commentId = id
      this.showReply = true
    },
    close () {
      this.$emit('update:visible', false)
    },
    getList () {
      ApiVideo.commentList({ ...this.search, videoId: this.id }).then(({ data }) => {
        this.dataList = data.dataList || []
        this.totalCount = data.totalCount || 0
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
    changeStatus (id, status) {
      ApiVideo.commentOperate({ id, status: status }).then(({ code, message }) => {
        this.$message({ type: (code === 'SUCCESS' ? 'success' : 'error'), message: message })
        if (code === 'SUCCESS') this.getList()
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss">

</style>
