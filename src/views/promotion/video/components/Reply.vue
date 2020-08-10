<template>
  <div>
    <el-dialog
      :visible="visible"
      :before-close="close"
      append-to-body
      title="回复详情"
      width="700px">
      <el-table
        :data="dataList"
        class="mt20">
        <el-table-column
          :show-overflow-tooltip="true"
          label="回复人"
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
          label="回复内容"
          align="left">
          <p slot-scope="{row}">
            <template v-if="row.parentId">
              回复 <span class="ui-color2">{{ row.parentName }}:</span>
            </template>
            {{ row.content }}
          </p>
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          width="150"
          label="回复时间"
          align="center">
          <template slot-scope="{row}">
            {{ row.createTime }}
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
  </div>
</template>

<script>
import * as ApiVideo from '@/api/video'

export default {
  props: {
    // 是否显示
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      search: { pageNum: 1, pageSize: 10 },
      totalCount: 0,
      dataList: []
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    close () {
      this.$emit('update:visible', false)
    },
    getList () {
      ApiVideo.replyList({ ...this.search, commentId: this.id }).then(({ data }) => {
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
