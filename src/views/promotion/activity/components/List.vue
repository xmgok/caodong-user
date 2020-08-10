<template>
  <div>
    <el-row
      type="flex"
      justify="space-between">
      <router-link :to="{ name: 'ActivityAdd' }">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="small">新增活动</el-button>
      </router-link>
      <el-row
        type="flex"
        align="middle"
        justify="end">
        <a
          :href="`${ siteUrl }/file/prize_template.xlsx`"
          class="mr10"
          download="获奖名单模板.xlsx">
          <el-button
            type="primary"
            size="mini">获奖名单模板下载</el-button>
        </a>
        <el-input
          v-model="name"
          size="small"
          placeholder="请输入活动名称搜索"
          class="w300">
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="searchFn"/>
        </el-input>
      </el-row>
    </el-row>
    <el-table
      :data="listData"
      class="mt20">
      <el-table-column
        :show-overflow-tooltip="true"
        prop="name"
        label="活动名称"
        min-width="150"/>
      <el-table-column
        :show-overflow-tooltip="true"
        label="活动时间"
        width="320"
        align="center">
        <template slot-scope="scope">
          {{ scope.row.beginTime }} - {{ scope.row.endTime }}
        </template>
      </el-table-column>
      <el-table-column
        label="活动状态"
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
        width="190"
        header-align="center"
        align="right">
        <template slot-scope="scope">
          <router-link
            v-if="scope.row.state <= 0 && scope.row.isEdit > 0"
            :to="{ name: 'ActivityAdd', query: {id: scope.row.id} }">
            <el-button
              type="text"
              size="small">编辑</el-button>
          </router-link>
          <router-link
            v-else
            :to="{ name: 'ActivityAdd', query: {id: scope.row.id, see: true} }">
            <el-button
              type="text"
              size="small">查看</el-button>
          </router-link>
          <el-button
            v-if="scope.row.state > 0"
            class="ml10"
            type="text"
            size="small"
            @click="statistics(scope.row.id)">统计
          </el-button>
          <el-button
            v-if="scope.row.state <= 1 && scope.row.isEdit > 0"
            class="ml10"
            type="text"
            size="small"
            @click="operate(scope.row.id, 1)">关闭
          </el-button>
          <el-button
            class="ml10"
            type="text"
            size="small"
            @click="previewQrCode(scope.row.id)">预览
          </el-button>
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
        @current-change="pageChange"/>
    </div>

    <el-dialog
      :visible.sync="showDialog"
      title="活动统计"
      width="500px"
      @close="closeDialog">
      <el-form label-width="120px">
        <el-form-item
          label="活动名称:"
          style="margin-bottom: 0">{{ itemData.name }}</el-form-item>
        <el-form-item
          label="活动时间:"
          style="margin-bottom: 0">{{ itemData.beginTime }} 到 {{ itemData.endTime }}</el-form-item>
        <el-form-item
          label="导购转发人数:"
          style="margin-bottom: 0">{{ itemData.guideCount }}</el-form-item>
        <el-form-item
          label="打开数:"
          style="margin-bottom: 0">{{ itemData.openCount }}</el-form-item>
        <el-form-item
          label="参与人数:"
          style="margin-bottom: 0">{{ itemData.userCount }}</el-form-item>
        <el-form-item
          label="消费者转发数:"
          style="margin-bottom: 0">{{ itemData.consumerCount }}</el-form-item>
        <el-form-item
          v-if="itemData.isPay > 0"
          label="销售总金额:"
          style="margin-bottom: 0">¥ {{ itemData.totalSales }}</el-form-item>
        <el-form-item
          v-if="itemData.isPrize > 0"
          label=""
          style="margin-bottom: 10px">
          <el-upload
            :on-success="handleSuccess"
            :headers="{ token }"
            :show-file-list="false"
            :action="`${ postUrl }${ baseUrl }prizerecord/prize_import?activityId=${itemData._activityId}`"
            name="excelFile">
            <el-button
              type="primary"
              size="small">导入获奖名单
            </el-button>
          </el-upload>
        </el-form-item>
        <el-form-item style="margin-bottom: 0">
          <el-button
            type="primary"
            size="small"
            @click="exportList">导出参与名单
          </el-button>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button
          type="primary"
          size="small"
          @click="closeDialog">确定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="showQrCodeDialog"
      title="活动小程序码"
      width="500px"
      @close="showQrCodeDialog = false">
      <img
        :src="qrCodeUrl"
        style="margin: 0 auto; display: block;"
        width="150px"
        height="150px">
      <div slot="footer">
        <el-button
          type="primary"
          size="small"
          @click="showQrCodeDialog = false">确定
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import * as ApiActivity from '@/api/activity'
import { mapGetters } from 'vuex'

export default {
  props: {
    type: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      name: '',
      currentPage: 1,
      total: 0,
      pageSize: 10,
      listData: [],
      showDialog: false,
      itemData: {},
      fileList: [],
      postUrl: window.VUE_APP_API_URL,
      baseUrl: window.VUE_APP_BASE_API,
      siteUrl: location.origin,
      showQrCodeDialog: false,
      qrCodeUrl: ''
    }
  },

  computed: {
    ...mapGetters(['token'])
  },
  mounted () {
    this.getList()
  },

  methods: {
    copy (id) {
      this.$router.push({ name: 'ActivityAdd', query: { id, type: 'copy' } })
    },
    previewQrCode (id) {
      this.showQrCodeDialog = true
      // this.qrCodeUrl = `${window.VUE_APP_API_URL}${window.VUE_APP_BASE_API}product/qrcode?token=${this.$store.getters.token}&scene=${encodeURIComponent(`id=${id}`)}`
      // this.qrCodeUrl = `${window.VUE_APP_API_URL}${window.VUE_APP_BASE_API}miniapp/qrcode?token=${this.$store.getters.token}&page=pages/activity-confirm/activity-confirm&scene=${encodeURIComponent(`id=${id}`)}`
      this.qrCodeUrl = `${window.VUE_APP_API_URL}${window.VUE_APP_BASE_API}miniapp/qrcode?token=${this.$store.getters.token}&page=pages/activity-confirm/activity-confirm&scene=${encodeURIComponent(`id=${id}&preview=1`)}`
    },
    getList () {
      ApiActivity.getList({ name: this.name, state: this.type, pageNum: this.currentPage, pageSize: this.pageSize }).then(({ data }) => {
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
    searchFn () {
      this.currentPage = 1
      this.getList()
    },
    operate (id) {
      this.$confirm(`确定关闭吗?`, '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
        ApiActivity.operate({ id, operate: 0 }).then(({ code, message = '' }) => {
          this.$message({ type: (code === 'SUCCESS' ? 'success' : 'error'), message: message })
          if (code === 'SUCCESS') {
            this.currentPage = 1
            this.getList()
          }
        }).catch(() => {})
      }).catch(() => {})
    },
    statistics (id) {
      this.showDialog = true
      ApiActivity.statistic({ activityId: id }).then(({ data }) => {
        data._activityId = id
        this.itemData = data
      }).catch(() => {})
    },
    closeDialog () {
      this.showDialog = false
    },
    exportList () {
      ApiActivity.exportList({ activityId: this.itemData._activityId }, '导出参与名单')
    },
    handleSuccess ({ status, message }, file, fileList) {
      this.$message[status === 200 ? 'success' : 'error'](message)
    }
  }
}
</script>
