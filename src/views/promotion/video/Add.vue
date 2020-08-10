<template>
  <div class="page-add-video">

    <el-form
      ref="form"
      :model="form"
      :rules="formRules"
      class="form"
      label-width="100px">
      <el-card>
        <div slot="header">视频详情</div>
        <el-form-item
          prop="videoName"
          label="视频名称"
          class="w500">
          <el-input
            v-model="form.videoName"
            :maxlength="30">
            <template slot="append">{{ form.videoName.length }}/30</template>
          </el-input>
        </el-form-item>
        <el-form-item
          ref="videoUrlForm"
          label="视频"
          prop="videoUrl">
          <div
            class="ui-img-uploader"
            @click="showVideoSelector = true">
            <img
              v-if="form.videoUrl"
              :src="`${form.videoUrl}?vframe/jpg/offset/2`"
              class="img" >
            <p
              v-else
              class="ui-img-uploader-plus"><i class="icons el-icon-plus"/> 添加视频</p>
          </div>
        </el-form-item>
      </el-card>

      <el-card class="mt10">
        <div slot="header">关联普通商品</div>
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="showGoodsSelector = true">添加普通商品
        </el-button>
        <el-table
          :data="videoProductList"
          class="mt10">
          <el-table-column
            width="70"
            align="center"
            label="缩略图">
            <template slot-scope="scope">
              <img
                :src="scope.row.imgUrl"
                style="width: 50px; height: 50px; display: block; margin: 0 auto;" >
            </template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="name"
            label="商品名称"/>
          <el-table-column
            prop="productCode"
            align="center"
            label="商品编号"/>
          <el-table-column
            label="操作"
            fixed="right"
            width="50"
            align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="del('videoProductList', scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <el-card class="mt10">
        <div slot="header">关联优惠券</div>
        <el-button
          class="mb10"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="showCouponSelector = true">添加优惠券
        </el-button>
        <el-table
          :data="videoCouponList"
          style="width: 100%">
          <el-table-column
            align="left"
            prop="name"
            label="优惠券名称"/>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="price"
            label="面值"
            align="center"/>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="usePrice"
            min-width="150"
            label="使用条件">
            <template slot-scope="scope">
              <template v-if="scope.row.useRule > 0">满{{ scope.row.usePrice }}元可使用</template>
              <template v-else>无门槛使用</template>
            </template>
          </el-table-column>
          <el-table-column
            label="领取条件"
            min-width="150">
            <template slot-scope="scope">
              <template v-if="scope.row.receiveRule > 0">限每人{{ scope.row.receiveTotal }}张</template>
              <template v-else>不限制领取</template>
            </template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            label="有效期"
            width="320"
            align="center">
            <template slot-scope="scope">
              {{ scope.row.beginTime }} - {{ scope.row.endTime }}
            </template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="total"
            label="优惠券总数"
            align="center"/>
          <el-table-column
            label="操作"
            fixed="right"
            width="50"
            align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="del('videoCouponList', scope.$index)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <el-card class="mt10">
        <div slot="header">视频分享</div>
        <el-form-item
          prop="shareTitle"
          label="分享标题"
          class="w500">
          <el-input
            v-model="form.shareTitle"
            maxlength="40" />
        </el-form-item>
        <el-form-item
          ref="shareImgForm"
          label="分享封面"
          prop="shareImg">
          <div
            class="ui-img-uploader"
            @click="showMaterialSelector = true">
            <img
              v-if="form.shareImg"
              :src="form.shareImg"
              class="img" >
            <p
              v-else
              class="ui-img-uploader-plus"><i class="icons el-icon-plus"/> 添加图片</p>
          </div>
          <p class="ui-color3 f12">建议尺寸为 600 x 600 像素</p>
        </el-form-item>
        <el-form-item
          prop="shareDesc"
          class="w500"
          label="分享描述">
          <el-input
            :autosize="{ minRows: 2}"
            v-model="form.shareDesc"
            maxlength="80"
            type="textarea"
            placeholder=""/>
        </el-form-item>
      </el-card>

      <el-card class="mt10">
        <div slot="header">适用门店</div>
        <span
          v-if="storeListLength>0"
          class="pr10">已选{{ storeListLength }}家门店</span>
        <el-button
          type="text"
          size="mini"
          @click="isShowStore=true">
          {{ storeListLength>0?'修改':'添加' }}门店
        </el-button>
      </el-card>
    </el-form>

    <div class="ui-edit-btn-wrapper">
      <!--
      <el-button
        v-if="see"
        type="primary"
        @click="$router.go(-1)">确定
      </el-button>
-->
      <template>
        <el-button
          @click="$router.go(-1)">取消
        </el-button>
        <el-button
          :loading="saveIng"
          type="primary"
          @click="submit">保存
        </el-button>
      </template>
    </div>
    <!--商品选择-->
    <goods-selector
      v-if="showGoodsSelector"
      :visible.sync="showGoodsSelector"
      :manual-data="goodsSelector"
      :hide-condition="true"
      type="manual"
      @change="goodsSelectorChanged" />
    <coupon-selector
      v-if="showCouponSelector"
      :visible.sync="showCouponSelector"
      :default-data="couponSelector"
      @change="couponSelectorChanged" />
    <!--门店选择，多选-->
    <select-store-tree
      :visible.sync="isShowStore"
      :default-value="form.storeList"
      @confirm="confirmCheckedStore"
    />
    <material-selector
      :visible.sync="showMaterialSelector"
      :is-multi="false"
      @change="(val) => materialSelectorChanged(1, val)" />
    <material-selector
      :visible.sync="showVideoSelector"
      :is-multi="false"
      type="video"
      @change="(val) => materialSelectorChanged(2, val)" />
  </div>
</template>
<script>
import MaterialSelector from '@/components/MaterialSelector'
import GoodsSelector from '@/components/GoodsSelector'
import CouponSelector from '@/components/CouponSelector'
import SelectStoreTree from '@/components/SelectStoreTree'
import ApiProduct from '@/api/product'
import * as ApiVideo from '@/api/video'
import * as ApiCoupon from '@/api/coupon'

export default {
  name: 'PromotionVideoAdd',
  components: {
    MaterialSelector,
    SelectStoreTree,
    GoodsSelector,
    CouponSelector
  },
  data () {
    return {
      showVideoSelector: false,
      showMaterialSelector: false,
      isShowStore: false,
      showGoodsSelector: false,
      showCouponSelector: false,
      form: {
        id: 0,
        videoName: '',
        videoUrl: '',
        productType: 1,
        videoProductList: [
          // { type: 1, productId: '' }
        ],
        videoCouponList: [
          // { couponId: '' }
        ],
        shareTitle: '',
        shareImg: '',
        shareDesc: '',
        storeList: []
      },
      formRules: {
        videoName: [
          { required: true, message: '请输入视频名称', trigger: 'blur' }
        ],
        videoUrl: [
          { required: true, message: '请选择视频', trigger: 'blur' }
        ],
        shareTitle: [
          { required: true, message: '请输入分享标题', trigger: 'blur' }
        ],
        shareImg: [
          { required: true, message: '请选择分享封面图', trigger: 'blur' }
        ],
        shareDesc: [
          { required: true, message: '请输入分享描述', trigger: 'blur' }
        ]
      },
      saveIng: false,
      videoProductList: [],
      videoCouponList: []
    }
  },
  computed: {
    goodsSelector () {
      return this.form.videoProductList.map((item) => item.productId)
    },
    couponSelector () {
      return this.form.videoCouponList.map((item) => item.couponId)
    },
    storeListLength () {
      return this.form.storeList.filter(v => v.type === 0).length
    }
  },
  created () {
    const id = this.$route.query.id || ''
    this.form.id = id
    id && this.getInfo()
  },
  mounted () {
  },
  methods: {
    materialSelectorChanged (type, val) {
      const typeName = ['', 'shareImg', 'videoUrl'][type]
      this.form[typeName] = (val[0] && val[0].imgUrl) || ''
      this.$refs[`${typeName}Form`].clearValidate()
      this[type <= 1 ? 'showMaterialSelector' : 'showVideoSelector'] = false
    },
    submit () {
      this.$refs['form'].validate((valid) => {
        if (!valid) return
        this.saveIng = true
        ApiVideo.save(this.form).then(({ code, message }) => {
          this.$message({ type: (code === 'SUCCESS' ? 'success' : 'error'), message: message })
          if (code === 'SUCCESS') {
            this.$router.go(-1)
          }
          this.saveIng = false
        }, () => {
          this.saveIng = false
        })
      })
    },
    goodsSelectorChanged ({ data }) {
      if (data.length > 0) {
        this.getPriductListInfo(data)
      } else {
        this.videoProductList = []
        this.form.videoProductList = []
      }
    },
    couponSelectorChanged (data) {
      console.log(data)
      this.form.videoCouponList = data.map((item) => {
        return { couponId: item.id }
      })
      this.videoCouponList = data
    },
    del (name, index) {
      this.form[name].splice(index, 1)
      this[name].splice(index, 1)
    },
    confirmCheckedStore (data) {
      this.form.storeList = data
    },
    getInfo () {
      ApiVideo.info({ id: this.form.id }).then(({ data }) => {
        this.form = Object.assign(this.form, data)
        if (this.goodsSelector.length > 0) this.getPriductListInfo(this.goodsSelector)
        if (this.couponSelector.length > 0) {
          ApiCoupon.list({ ids: this.couponSelector.join(','), pageNum: 1, pageSize: this.couponSelector.length }).then(({ data }) => {
            this.videoCouponList = data.dataList
          })
        }
      })
    },
    getPriductListInfo (list) {
      ApiProduct.productCouponlist({ pids: list.join(','), pageNum: 1, pageSize: list.length }).then(({ data }) => {
        this.videoProductList = data.dataList
        this.form.videoProductList = data.dataList.map((item) => {
          return { type: 1, productId: item.id }
        })
      })
    }
  }
}
</script>

<style lang="scss">
  .page-add-video {

  }
</style>
