<template>
  <div class="page-add-activity">
    <el-card>
      <div slot="header">活动配置</div>

      <el-form
        v-loading="loading"
        ref="form"
        :model="form"
        label-width="120px">
        <el-form-item
          prop="needNumber"
          label="打卡点亮配置">
          每
          <el-input
            v-model.number="form.needNumber"
            class="w100" />
          次打卡点亮1次
        </el-form-item>
        <el-form-item
          prop="lightenNumber"
          label="手工点亮操作">
          点亮第
          <el-input
            v-model.number="form.lightenNumber"
            class="w100" />
          双鞋
          <span class="grey ml10">请输入1-19</span>
        </el-form-item>
        <el-form-item
          label="活动时间"
          prop="time">
          <el-date-picker
            v-model="time"
            :default-time="['00:00:00', '23:59:59']"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期" />
            <!--<span class="grey ml10">小程序中间风火弹窗时间</span>-->
        </el-form-item>
        <el-form-item
          prop="coupon"
          label="优惠券">
          <el-button
            v-if="form.couponId"
            icon="el-icon-edit-outline"
            type="text"
            size="small"
            @click="showCouponSelector = true">{{ form.couponName }}
          </el-button>
          <el-button
            v-else
            icon="el-icon-plus"
            type="text"
            size="small"
            @click="showCouponSelector = true">添加奖励
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            :loading="submitting"
            type="primary"
            @click="saveInfo">保存
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="mt10">
      <div slot="header">操作</div>

      <el-form
        v-loading="loading"
        :model="opForm"
        label-width="120px">
        <el-form-item
          prop="needNumber"
          label="LED投屏场景操作">
          <el-radio-group
            v-model="opForm.scene"
            size="small">
            <el-radio
              :label="0"
              border>活动准备工作
            </el-radio>
            <el-radio
              :label="1"
              border>活动未开始
            </el-radio>
            <el-radio
              :label="2"
              border>活动开始
            </el-radio>
            <el-radio
              :label="3"
              border>鞋子集锦
            </el-radio>
            <el-radio
              :label="4"
              border>切回弹幕
            </el-radio>
            <el-radio
              :label="5"
              border>活动结束
            </el-radio>
            <el-radio
              :label="6"
              border>轮播视频
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          prop="scene"
          label="弹幕操作">
          <el-radio-group
            v-model="opForm.isStop"
            size="small">
            <el-radio
              :label="0"
              border>弹幕播放
            </el-radio>
            <el-radio
              :label="1"
              border>弹幕暂停
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button
            :loading="opSubmitting"
            type="primary"
            @click="saveOperate">保存
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-tabs
      type="border-card"
      class="mt10">
      <el-tab-pane
        lazy
        label="留言管理">
        <el-button
          class="mt10"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="addComment">添加留言
        </el-button>

        <el-table
          :data="commentList"
          class="mt20">
          <el-table-column
            label="评价人">
            <template v-slot="{ row }">
              <el-row
                type="flex"
                align="middle">
                <img
                  v-if="row.headUrl"
                  :src="row.headUrl"
                  style=" display:block; width: 50px; height: 50px; border-radius: 50%">
                <p class="pl10">{{ row.nickName }}</p>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column
            label="评价内容"
            prop="message"
            align="center" />
          <el-table-column
            label="手机号"
            prop="mobile"
            align="center" />
          <el-table-column
            label="操作"
            align="center">
            <template v-slot="{ row }">
              <el-switch
                v-model="row.isHide"
                :active-value="0"
                :inactive-value="1"
                active-text="显示"
                inactive-text="隐藏"
                @change="(isHide) => commentStatusChange(row.id, isHide)" />
            </template>
          </el-table-column>
        </el-table>

        <div class="g-pagination-wrap">
          <el-pagination
            :current-page="commentSearch.pageNum"
            :page-sizes="$store.state.app.pageSizes"
            :page-size="commentSearch.pageSize"
            :total="commentSearch.totalCount"
            :layout="$store.state.app.layout"
            @size-change="(page) => sizeChange(page, 'comment')"
            @current-change="(page) => pageChange(page, 'comment')" />
        </div>
      </el-tab-pane>

      <el-tab-pane
        lazy
        label="分享数据">
        <el-button
          class="mt10"
          size="mini"
          type="primary"
          icon="el-icon-download"
          @click="exportShareList">导出
        </el-button>

        <el-table
          :data="shareList"
          class="mt20">
          <el-table-column
            label="会员昵称"
            prop="nickName"
            align="center" />
          <el-table-column
            label="手机号"
            prop="mobile"
            align="center" />
          <el-table-column
            label="已邀请人数"
            prop="number"
            align="center" />
        </el-table>

        <div class="g-pagination-wrap">
          <el-pagination
            :current-page="shareSearch.pageNum"
            :page-sizes="$store.state.app.pageSizes"
            :page-size="shareSearch.pageSize"
            :total="shareSearch.totalCount"
            :layout="$store.state.app.layout"
            @size-change="(page) => sizeChange(page, 'share')"
            @current-change="(page) => pageChange(page, 'share')" />
        </div>
      </el-tab-pane>
    </el-tabs>

    <coupon-selector
      v-if="showCouponSelector"
      :visible.sync="showCouponSelector"
      :multiple="false"
      :default-data="couponDefaultVal"
      @change="couponSelectorChanged" />
  </div>
</template>
<script>
import CouponSelector from '@/components/CouponSelector'
import * as ApiLighten from '@/api/lighten'

const PAGINATION = { pageNum: 1, pageSize: 10, totalCount: 0 }

export default {
  name: 'ActivityAdd',
  components: {
    CouponSelector
  },

  data () {
    return {
      currentCouponSelector: '',
      showCouponSelector: false,
      form: {
        needNumber: '',
        lightenNumber: '',
        beginTime: '',
        endTime: '',
        couponId: '',
        couponName: ''
      },
      opForm: {
        isStop: 1,
        scene: 1
      },
      time: [],
      currentCoupon: '',
      commentList: [],
      shareList: [],
      commentSearch: { ...PAGINATION },
      shareSearch: { ...PAGINATION },
      loading: false,
      submitting: false,
      opSubmitting: false
    }
  },
  computed: {
    couponDefaultVal () {
      const id = this.currentCoupon.id || ''
      return id ? [id] : []
    }
  },

  created () {
    this.getInfo()
    this.getList('comment')
    this.getList('share')
  },

  methods: {
    async getInfo () {
      this.loading = true
      const { data } = await ApiLighten.infoPc().catch(() => ({ data: (this.loading = false) }))
      this.loading = false
      if (!data) return

      this.form = data
      this.time = [data.beginTime, data.endTime]

      const { isStop, scene } = data
      this.opForm = {
        isStop: isStop === null ? 1 : isStop,
        scene: scene === null ? 1 : scene
      }
    },
    async saveInfo () {
      // const confirm = await this.$confirm('确定修改提交?', '提示', { type: 'warning' }).catch(() => false)
      // if (!confirm) return

      const [beginTime, endTime] = this.time
      this.submitting = true
      const res = await ApiLighten.edit({
        ...this.form,
        beginTime,
        endTime
      }).catch(() => (this.submitting = true))
      if (!res) return

      this.submitting = false
      this.$message.success('操作成功')
    },
    async saveOperate () {
      this.opSubmitting = true
      const res = await ApiLighten.cutScene(this.opForm).catch(() => (this.opSubmitting = true))
      if (!res) return

      this.opSubmitting = false
      this.$message.success('操作成功')
    },
    async getList (type = 'comment') {
      const { data } = await ApiLighten[`${type}List`]({ ...this[`${type}Search`] })
      this[`${type}List`] = data.dataList || []
      this[`${type}Search`].totalCount = data.totalCount || 0
    },
    sizeChange (page, type) {
      this[`${type}Search`].pageSize = page
      this.getList(type)
    },
    pageChange (page, type) {
      this[`${type}Search`].pageNum = page
      this.getList(type)
    },
    async addComment () {
      const { value: message } = await this.$prompt('请输入留言', '提示', {
        inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
        inputErrorMessage: '不能输入空白留言'
      }).catch(() => '')
      if (!message) return

      await ApiLighten.sendMessage({ message })
      this.getList('comment')
    },
    async commentStatusChange (id, isHide) {
      const res = await ApiLighten.hideMessage({ id, isHide }).catch(() => false)
      if (!res) return

      this.$message.success('操作成功')
      this.getList('comment')
    },
    couponSelectorChanged ([coupon]) {
      this.form.couponId = coupon.id
      this.form.couponName = coupon.name
    },
    exportShareList () {
      ApiLighten.shareListExport({}, '分享数据')
    }
  }
}
</script>

<style lang="scss">
  .page-add-activity {
    .el-form-item__content {
      font-size: 12px;
    }
  }
</style>
