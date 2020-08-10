<template>
  <div class="page-custom-user">
    <!--
    <el-select
      v-model="type"
      class="mb10"
      placeholder="请选择">
      <el-option
        :value="1"
        label="系统固定模板"/>
      <el-option
        :value="2"
        label="自定义模板"/>
    </el-select>
-->
    <div>
      <el-form
        ref="form"
        :rules="rules"
        :model="form"
      >
        <el-card class="mb10">
          <el-form-item
            prop="templateName"
            label="模板名称">
            <el-input
              v-model="form.templateName"
              maxlength="50"
              style="width:300px;" />
          </el-form-item>
          <el-form-item
            prop="storeList"
            style="margin-bottom: 0;"
            label="适用门店">
            <template v-if="storeListLength>0"><span style="font-size: 12px;">已选{{ storeListLength }}家门店</span></template>
            <el-button
              :class="{'ml10':storeListLength>0}"
              type="text"
              size="mini"
              @click="isShowStore=true">
              {{ storeListLength>0?'修改':'添加' }}门店
            </el-button>
          </el-form-item>
        </el-card>
      </el-form>
    </div>
    <div class="ui-color3 mb10 f14">此为简约预览，真实效果以小程序为主</div>
    <el-row
      type="flex"
      style="border-bottom:1px dashed #ebeef5; padding-bottom: 30px">
      <div class="preview-block">
        <div
          v-for="(item, index) in form.list"
          :key="index"
          class="preview-block-item">
          <p class="index">模块{{ index }}</p>
          <goods-preview
            v-if="item.type == 1"
            :default-value="item.data" />
          <poster-preview
            v-if="item.type == 2"
            :default-value="item.data" />
          <slide-preview
            v-if="item.type == 3"
            :default-value="item.data" />
          <navs-preview
            v-if="item.type == 4"
            :default-value="item.data" />
          <coupon-preview
            v-if="item.type == 5"
            :default-value="item.data" />
          <activity-preview
            v-if="item.type == 6"
            :default-value="item.data" />
          <banner-preview
            v-if="item.type == 7"
            :default-value="item.data" />
        </div>
      </div>
      <el-form
        :rules="rules"
        :model="form"
        style="flex: 1;"
        label-width="100px">
        <el-card
          v-for="(item, index) in form.list"
          :key="index"
          style="position: relative;"
          class="mb10 template-edit-form">
          <div class="index">模块{{ index }}</div>
          <div style="position: absolute; right: 10px; top: 10px; z-index: 80;">
            <el-button
              v-if="index > 0"
              size="mini"
              type="text"
              @click="moveComponent(index, 1)">上移
            </el-button>
            <el-button
              v-if="index < form.list.length - 1"
              size="mini"
              type="text"
              @click="moveComponent(index, -1)">下移
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="delComponent(index)">删除
            </el-button>
          </div>
          <el-form-item label="组件类型">
            <el-select
              v-model="item.type"
              class="w200"
              @change="changeType(index)">
              <el-option
                :value="1"
                label="商品列表组件" />
              <el-option
                :value="2"
                label="海报切图组件" />
              <el-option
                :value="3"
                label="轮播图组件" />
              <el-option
                :value="4"
                label="快捷入口组件" />
              <el-option
                :value="5"
                label="优惠券组件" />
              <!--:disabled="showActivity"-->
              <el-option
                :value="6"
                label="活动组件" />
              <el-option
                :value="7"
                label="广告图组件" />
            </el-select>
          </el-form-item>
          <template v-if="form.list.length > 0">
            <goods
              v-if="item.type == 1"
              :default-value="item.data"
              @change="(data) => componentsChange(data, index)" />
            <poster
              v-if="item.type == 2"
              :default-value="item.data"
              @change="(data) => componentsChange(data, index)" />
            <slide
              v-if="item.type == 3"
              :default-value="item.data"
              @change="(data) => componentsChange(data, index)" />
            <navs
              v-if="item.type == 4"
              :default-value="item.data"
              @change="(data) => componentsChange(data, index)" />
            <coupon
              v-if="item.type == 5"
              :default-value="item.data"
              @change="(data) => componentsChange(data, index)" />
            <activity
              v-if="item.type == 6"
              :default-value="item.data"
              @change="(data) => componentsChange(data, index)" />
            <banner
              v-if="item.type == 7"
              :default-value="item.data"
              @change="(data) => componentsChange(data, index)" />
          </template>
        </el-card>
        <el-button
          icon="el-icon-plus"
          class="mt10"
          type="primary"
          @click="addComponent">新增模块
        </el-button>
      </el-form>
    </el-row>
    <div class="ui-edit-btn-wrapper">
      <el-button
        v-if="$route.name == 'miniappLook'"
        type="primary"
        @click="$router.go(-1)"
      >取消
      </el-button>
      <el-button
        v-else
        :loading="loading"
        type="primary"
        @click="submit(0)">保存为预览
      </el-button>

    </div>
    <el-dialog
      :visible.sync="showQrCodeDialog"
      width="500px"
      @close="showQrCodeDialog = false">
      <img
        :src="qrCodeUrl"
        style="margin: 0 auto; display: block;"
        width="150px"
        height="150px">
      <p class="ui-color3 tc f12 pt20">手机扫码预览</p>
      <div slot="footer">
        <el-button
          size="small"
          @click="showQrCodeDialog = false">取消使用
        </el-button>
        <el-button
          type="primary"
          size="small"
          @click="confirmSubmit">确定使用该模板
        </el-button>
      </div>
    </el-dialog>
    <!--门店选择，多选-->
    <select-store-tree
      :visible.sync="isShowStore"
      :default-value="form.storeList"
      @confirm="confirmCheckedStore"
    />
  </div>
</template>

<script>
import * as ApiMinapp from '@/api/minapp2'
import UserSystem from './user-system'
import Goods from '../template-components/Goods'
import Poster from '../template-components/Poster'
import Slide from '../template-components/Slide'
import Navs from '../template-components/Nav'
import Coupon from '../template-components/Coupon'
import Activity from '../template-components/Activity'
import Banner from '../template-components/Banner'
import CouponPreview from '../template-components-preview/Coupon'
import NavsPreview from '../template-components-preview/Nav'
import SlidePreview from '../template-components-preview/Slide'
import PosterPreview from '../template-components-preview/Poster'
import GoodsPreview from '../template-components-preview/Goods'
import ActivityPreview from '../template-components-preview/Activity'
import BannerPreview from '../template-components-preview/Banner'
import SelectStoreTree from '@/components/SelectStoreTree'

export default {
  components: {
    UserSystem,
    Goods,
    Poster,
    Slide,
    Navs,
    Coupon,
    Activity,
    Banner,
    CouponPreview,
    NavsPreview,
    SlidePreview,
    PosterPreview,
    GoodsPreview,
    ActivityPreview,
    BannerPreview,
    SelectStoreTree
  },
  data () {
    return {
      loading: false,
      form: {
        'storeList': [],
        templateName: '',
        list: []
      },
      showQrCodeDialog: false,
      qrCodeUrl: '',
      moveIndex: 0,
      isShowStore: false,
      rules: {
        templateName: [{ required: true, message: '本项必填' }],
        storeList: [{ required: true, message: '本项必填' }]
      },
      addId: ''
    }
  },
  computed: {
    showActivity () {
      const activity = this.form.list.filter((item) => item.type === 6)
      return activity.length >= 2
    },
    storeListLength () {
      return this.form.storeList.filter(v => v.type === 0).length
    }
  },

  created () {
    if (this.$route.query.id) {
      ApiMinapp.infoTemplate(this.$route.query.id).then(({ data }) => {
        this.form.templateName = data.name
        this.form.storeList = data.storeList
        this.form.list = JSON.parse(data.content)
      })
    }
  },

  methods: {
    confirmCheckedStore (data) {
      this.form.storeList = data
      this.$refs['form'].validateField(['storeList'])
    },
    componentsChange (data, index) {
      this.form.list[index].data = data
    },
    changeType (index) {
      const type = this.form.list[index].type
      const arrList = [4, 5]
      this.form.list[index].data = arrList.indexOf(type) > -1 ? [] : {}
    },
    addComponent () {
      this.form.list.push({ type: 1, data: {} })
    },
    delComponent (index) {
      this.$confirm('确定删除该组件吗?', {
        type: 'warning'
      }).then(() => {
        this.form.list.splice(index, 1)
        this.$message({ type: 'success', message: '删除成功' })
      }).catch(() => {
      })
    },
    moveComponent (index, number) {
      this.form.list[index] = this.form.list.splice(index - number, 1, this.form.list[index])[0]
      const list = this.form.list
      this.form.list = []
      this.$nextTick(() => {
        this.form.list = list
      })
      this.$message({ type: 'success', message: '移动成功，保存后生效' })
    },
    getInfo () {
      this.loading = true
      ApiMinapp.getTemplate().then(({ data }) => {
        this.loading = false
        this.form.storeList = data.storeList || []
        this.form.list = JSON.parse(data.content) || []
      })
    },
    submit (type = 0) {
      this.$refs['form'].validate((valid) => {
        if (!valid) return
        this.loading = true
        ApiMinapp.saveTemplate({
          storeList: this.form.storeList,
          content: JSON.stringify(this.form.list),
          isUsed: type,
          type: 0,
          name: this.form.templateName, // 模板名称
          id: this.$route.query.id || this.addId
        }).then(({ message, data }) => {
          this.addId = data
          this.loading = false
          if (type > 0) {
            this.showQrCodeDialog = false
            this.$message({ type: 'success', message })
            // this.getInfo()
          } else {
            this.showQrCodeDialog = true
            this.qrCodeUrl = `${window.VUE_APP_API_URL}${window.VUE_APP_BASE_API}miniapp/qrcode?token=${this.$store.getters.token}&page=pages/index/index&scene=${encodeURIComponent('preview=1')}`
          }
        }, () => {
          this.loading = false
        })
      })
    },
    confirmSubmit () {
      this.submit(1)
    }
  }
}
</script>

<style lang="scss">
  .page-custom-user {
    .preview-block {
      width: 377px;
      min-height: 500px;
      max-height: 2000px;
      overflow-y: auto;
      margin-right: 10px;
      border: 1px solid #ebeef5;
      background: #f7f8fa;

      &::-webkit-scrollbar {
        display: none;
      }

      .preview-block-item {
        /*background: white;*/
        margin-bottom: 10px;
        min-height: 10px;
        position: relative;

        .index {
          position: absolute;
          left: 0;
          top: 0;
          background: #409EFF;
          color: white;
          padding: 2px;
          z-index: 180;
        }
      }
    }

    .template-edit-form {
      .index {
        position: absolute;
        left: 0;
        top: 0;
        background: #409EFF;
        color: white;
        padding: 2px;
      }

      .el-form-item--medium {
        margin-bottom: 10px;
      }
    }
  }
</style>
