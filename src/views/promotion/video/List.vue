<template>
  <div class="page-video-list">
    <div style="display: -webkit-box; -webkit-box-pack: justify;">
      <div>
        <router-link :to="{ name: 'PromotionVideoAdd' }">
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="small">新增视频
          </el-button>
        </router-link>
      </div>
      <el-input
        v-model="search.videoName"
        size="small"
        placeholder="输入视频名称查询"
        class="">
        <el-select
          slot="prepend"
          v-model="search.status"
          style="width: 100px;"
          placeholder="请选择">
          <el-option
            :value="1"
            label="已上线" />
          <el-option
            :value="0"
            label="已下线" />
        </el-select>
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="searchFn" />
      </el-input>
    </div>
    <el-table
      :data="listData"
      class="mt20">
      <el-table-column
        width="60"
        label="视频">
        <template slot-scope="{row}">
          <div
            class="goods">
            <img
              :src="`${row.videoUrl}?vframe/jpg/offset/2`"
              style="width: 50px; height: 50px; display: block;"
              @click="handlePreview(row.videoUrl)">
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        align="center">
        <template slot-scope="scope">
          <p
            v-if="scope.row.status > 0"
            class="ui-color2">已上线</p>
          <p v-else>已下线</p>
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="videoName"
        min-width="200"
        label="视频名称"
        align="center"/>
      <el-table-column
        prop="watchNum"
        label="观看次数"
        align="center"/>
      <el-table-column
        :show-overflow-tooltip="true"
        width="150"
        prop="createTime"
        label="发布时间"
        align="center"/>
      <el-table-column
        prop="receiveCoupons"
        label="领劵数量"
        align="center"/>
      <el-table-column
        prop="shareNum"
        label="分享次数"
        align="center"/>
      <el-table-column
        prop="orderNum"
        label="成交单数"
        align="center"/>
      <el-table-column
        header-align="center"
        width="180px"
        label="关联信息">
        <template slot-scope="scope">
          <p>关联商品数：{{ scope.row.productNum }}</p>
          <p>关联优惠券数：{{ scope.row.couponNum }}</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="orderAmount"
        label="交易额"
        align="center"/>
      <el-table-column
        label="操作"
        fixed="right"
        width="190"
        align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="commentInfo(scope.row.id, scope.row.isEdit)">评论({{ scope.row.commentNum }})</el-button>
          <el-button
            :disabled="!scope.row.isEdit ? true : false"
            type="text"
            size="small"
            @click="online(scope.row.id, scope.row.status)">{{ scope.row.status ? '下线' : '上线' }}</el-button>
          <router-link
            v-if="scope.row.isEdit"
            :to="{ name: 'PromotionVideoAdd', query: {id: scope.row.id} }"
            class="ml10">
            <el-button
              type="text"
              size="small">编辑</el-button>
          </router-link>
          <el-button
            class="ml10"
            type="text"
            size="small"
            @click="getReport(scope.row.id, scope.row.videoName)">统计</el-button>
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
    <comment
      v-if="showCommentInfo"
      :id="commentId"
      :is-edit="isEdit"
      :visible.sync="showCommentInfo" />
    <el-dialog
      :visible.sync="showDataInfo"
      title="数据统计"
      width="670px"
      @close="showDataInfo = false">
      <el-form
        v-loading="reportLoading"
        label-width="200px">
        <el-form-item
          style="margin-bottom: 0"
          label="时间范围:"
          prop="time">
          <el-date-picker
            v-model="reportTime"
            :default-time="['00:00:00', '23:59:59']"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="getReport()" />
        </el-form-item>
        <el-form-item
          label="活动名称:"
          style="margin-bottom: 0">{{ reportInfo.name }}</el-form-item>
        <el-form-item
          label="分享次数:"
          style="margin-bottom: 0">{{ reportInfo.forwordNum }}</el-form-item>
        <el-form-item
          label="导购转发人数:"
          style="margin-bottom: 0">{{ reportInfo.empForwordUsers }}</el-form-item>
        <el-form-item
          label="二次转发人数:"
          style="margin-bottom: 0">{{ reportInfo.secondForwordUsers }}</el-form-item>
        <el-form-item
          label="观看次数:"
          style="margin-bottom: 0">{{ reportInfo.watchNum }}</el-form-item>
        <el-form-item
          label="观看人数:"
          style="margin-bottom: 0">{{ reportInfo.watchUsers }}</el-form-item>
        <el-form-item
          label="领劵人数:"
          style="margin-bottom: 0">{{ reportInfo.couponUsers }}</el-form-item>
        <el-form-item
          label="领劵数量:"
          style="margin-bottom: 0">{{ reportInfo.couponNum }}</el-form-item>
        <el-form-item
          label="下单数量:"
          style="margin-bottom: 0">{{ reportInfo.orderNum }}</el-form-item>
        <el-form-item
          label="退款单数:"
          style="margin-bottom: 0">{{ reportInfo.refundNum }}</el-form-item>
        <el-form-item
          label="成交单数:"
          style="margin-bottom: 0">{{ reportInfo.buyNum }}</el-form-item>
        <el-form-item
          label="领劵转化（领劵人数/观看人数）:"
          style="margin-bottom: 0">{{ reportInfo.couponRate }}%</el-form-item>
        <el-form-item
          label="成单转化（成交订单/领劵人数）:"
          style="margin-bottom: 0">{{ reportInfo.orderRate }}%</el-form-item>
        <el-form-item
          label="业绩（元）:"
          style="margin-bottom: 0">{{ reportInfo.buyAmount - reportInfo.refundAmount }}</el-form-item>
        <!--
        <el-form-item
          label="汇总:"
          style="margin-bottom: 0">0</el-form-item>
-->
        <el-form-item style="margin-bottom: 0">
          <el-button
            type="primary"
            size="small"
            @click="reportExport">导出数据
          </el-button>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button
          type="primary"
          size="small"
          @click="showDataInfo = false">确定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="previewVisible"
      width="1000px">
      <template>
        <video-player
          ref="videoPlayer"
          :options="playerOptions"
          :playsinline="true"/>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import * as ApiVideo from '@/api/video'
import Comment from './components/Comment'
import { videoPlayer } from 'vue-video-player'
import 'video.js/dist/video-js.css'

export default {
  name: 'PromotionVideo',
  components: { Comment, videoPlayer },
  data () {
    return {
      showDataInfo: false,
      showCommentInfo: false,
      showEditItem: false,
      previewVisible: false,
      playerOptions: {
        muted: true,
        language: 'en',
        playbackRates: [0.7, 1.0, 1.5, 2.0],
        sources: [{
          type: 'video/mp4',
          src: ''
        }, {
          type: 'video/webm',
          src: ''
        }],
        poster: ''
      },
      search: {
        status: '',
        videoName: '',
        pageNum: 1,
        totalCount: 0,
        pageSize: 10
      },
      listData: [],
      reportTime: [],
      reportInfo: {},
      reportLoading: false,
      commentId: '',
      isEdit: false
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    handlePreview (url) {
      this.previewVisible = true
      this.playerOptions.sources[0].src = url
      this.playerOptions.poster = `${url}?vframe/jpg/offset/2`
    },
    getList () {
      ApiVideo.list({ ...this.search }).then(({ data }) => {
        this.listData = data.dataList || []
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
    online (id, status) {
      ApiVideo.upLine({ id, status: Math.abs(status - 1) }).then(({ code, message }) => {
        this.$message({ type: (code === 'SUCCESS' ? 'success' : 'error'), message: message })
        if (code === 'SUCCESS') this.getList()
      }).catch(() => {})
    },
    commentInfo (id, isEdit) {
      this.commentId = id
      this.isEdit = Number(isEdit)
      this.showCommentInfo = true
    },
    getReport (id, name) {
      id = id || this.reportInfo.id || ''
      name = name || this.reportInfo.name || ''
      this.showDataInfo = true
      this.reportLoading = true
      this.reportTime = this.reportTime || []
      ApiVideo.report({ videoId: id, beginTime: this.reportTime[0], endTime: this.reportTime[1] }).then(({ data }) => {
        this.reportInfo = data || {}
        this.reportInfo.id = id
        this.reportInfo.name = name
        this.reportLoading = false
      }).catch(() => { this.reportLoading = false })
    },
    reportExport () {
      this.reportTime = this.reportTime || []
      ApiVideo.reportExport({ videoId: this.reportInfo.id, beginTime: this.reportTime[0], endTime: this.reportTime[1], name: this.reportInfo.name }, '视频统计导出')
    }
  }
}
</script>

<style lang="scss">
  .page-video-list {
    .video-js {
      width: 962px !important;
      .vjs-big-play-button {
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
</style>
