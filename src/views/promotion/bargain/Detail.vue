<template>
  <el-form
    ref="form"
    :model="form"
    :rules="rules"
    class="form"
    label-width="100px">
    <el-card>
      <div slot="header">砍价详情</div>
      <el-form-item
        prop="productId"
        label="砍价商品">
        <div
          v-if="form.productId"
          class="goods">
          <img
            :src="form.productImg"
            class="goods-img">
          <div class="ml10">
            <div class="pb10">
              <span class="fb">商品名称：</span>
              <span>{{ form.productName }}</span>
            </div>
            <el-row type="flex">
              <div class="fb">商品规格：</div>
              <div>
                <el-radio-group
                  v-model="form.specType"
                  :disabled="see">
                  <el-radio :label="1">全部</el-radio>
                  <el-radio :label="2">指定规格</el-radio>
                </el-radio-group>
                <el-checkbox-group
                  v-if="form.specType == 2"
                  :disabled="see"
                  v-model="specIds"
                  class="mt10">
                  <el-checkbox
                    v-for="item in specificationList"
                    :label="item.id"
                    :key="item.id">{{ item.specContent }}
                  </el-checkbox>
                </el-checkbox-group>
              </div>
            </el-row>
          </div>
        </div>
        <el-button
          :disabled="see"
          :class="[form.productId?'w100':'']"
          type="text"
          size="mini"
          @click="showGoodsSelector=true">
          {{ form.productId?'修改':'添加' }}商品
        </el-button>
      </el-form-item>
    </el-card>
    <el-card class="mt10">
      <div slot="header">砍价设置</div>
      <el-form-item
        prop="_time"
        label="活动时间"
        class="w500">
        <el-date-picker
          :disabled="see"
          v-model="form._time"
          :default-time="['00:00:00', '23:59:59']"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期" />
      </el-form-item>
      <el-form-item
        prop="validHour"
        label="砍价时效"
        class="w500">
        <el-input
          :disabled="see"
          v-model="form.validHour">
          <template slot="append">小时</template>
        </el-input>
      </el-form-item>
      <el-form-item
        prop="productPrice"
        label="商品原价"
        class="w500">
        <el-input
          :disabled="see"
          v-model="form.productPrice">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-form-item
        prop="minPrice"
        label="商品底价"
        class="w500">
        <el-input
          :disabled="see"
          v-model="form.minPrice">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-form-item
        prop="reduceNum"
        label="砍价力度">
        <span>共</span>
        <el-input
          :disabled="see"
          v-model="form.reduceNum"
          style="width: 265px;"
          class="ml24">
          <template slot="append">人</template>
        </el-input>
        <span
          class="ml24"
          style="color: #ccc;font-size: 14px;">砍到底价，每人砍价金额随机</span>
      </el-form-item>
      <el-form-item
        prop="storeList"
        label="适用门店">
        <template v-if="storeListLength>0"><span style="font-size: 12px;">已选{{ storeListLength }}家门店</span></template>

        <!--已选门店可查看，所以不允许被禁用-->
        <el-button
          type="text"
          size="mini"
          @click="isShowStore=true">
          {{ storeListLength>0?'修改':'添加' }}门店
        </el-button>
      </el-form-item>
    </el-card>
    <div class="ui-edit-btn-wrapper">
      <el-button
        v-if="see"
        type="primary"
        @click="$router.go(-1)">确定
      </el-button>
      <template v-else>
        <el-button
          @click="$router.go(-1)">取消
        </el-button>
        <el-button
          :loading="submitting"
          type="primary"
          @click="submit">保存
        </el-button>
      </template>
    </div>
    <!--商品选择，单选-->
    <goods-selector
      v-if="showGoodsSelector"
      :visible.sync="showGoodsSelector"
      :manual-data="cProductIds"
      :hide-condition="true"
      :multiple="false"
      type="manual"
      @change="goodsSelectorChanged" />
    <!--门店选择，多选-->
    <select-store-tree
      :is-disabled-all="see"
      :visible.sync="isShowStore"
      :default-value="form.storeList"
      @confirm="confirmCheckedStore"
    />
    <!--图片库-->
    <material-selector
      :is-multi="false"
      :visible.sync="showMaterialSelector"
      @change="(val) => detailMaterialSelectorChanged(val)" />
  </el-form>
</template>

<script>
import * as Validate from '@/utils/validate'
import ApiProduct from '@/api/product'
import * as ApiGroup from '@/api/bargain'
import GoodsSelector from '@/components/GoodsSelector'
import SelectStoreTree from '@/components/SelectStoreTree'
import MaterialSelector from '@/components/MaterialSelector'

export default {
  name: 'Detail',
  components: {
    MaterialSelector,
    SelectStoreTree,
    GoodsSelector
  },
  data () {
    return {
      form: {
        _time: [],
        'validHour': '', // 每人砍价时间
        'endTime': '', // 活动结束时间
        'productPrice': '', // 商品原价
        'id': null, // 砍价ID
        'reduceNum': '', // 砍价力度 - 值
        'storeList': [], // 许可门店列表
        'productCode': '', // 商品编码
        'productId': '', // 商品ID
        'productImg': '', // 商品图片
        'productName': '', // 商品名称
        'startTime': '', // 活动开始时间
        'minPrice': '', // 商品底价
        specIds: [], // 规格ids，用逗号拼接
        specType: 1 // 规格类型 1全部 2指定规格
      },
      rules: {
        validHour: [
          { required: true, message: '本项必填', trigger: 'blur' },
          { validator: Validate.positiveNumber, trigger: 'blur' }
        ],
        reduceNum: [
          { required: true, message: '本项必填', trigger: 'blur' },
          { validator: Validate.positiveNumber, trigger: 'blur' }
        ],
        _time: [{ required: true, message: '本项必填', trigger: 'blur' }],
        productPrice: [
          { required: true, message: '本项必填', trigger: 'blur' },
          { validator: (rule, value, callback) => Validate.min0(rule, value, callback, { min: 1 }), trigger: 'blur' }
        ],
        minPrice: [
          { required: true, message: '本项必填', trigger: 'blur' },
          { validator: (rule, value, callback) => Validate.min0(rule, value, callback, { min: 0 }), trigger: 'blur' }
        ],
        productId: [{ required: true, message: '本项必选', trigger: 'blur' }],
        storeList: [{ required: true, message: '本项必填', trigger: 'blur' }]
      },
      see: false,
      isShowStore: false,
      showGoodsSelector: false,
      showMaterialSelector: false,
      submitting: false,
      specIds: [],
      specificationList: []
    }
  },
  computed: {
    cProductIds () {
      return this.form.productId ? [this.form.productId] : []
    },
    storeListLength () {
      return this.form.storeList.filter(v => v.type === 0).length
    }
  },
  created () {
    const id = this.$route.query.id || ''
    this.see = Boolean(this.$route.query.see) || false
    this.form.id = id
    id && this.getInfo()
  },
  mounted () {
  },
  methods: {
    // 商品详情图片选择
    detailMaterialSelectorChanged (val) {
      this.showMaterialSelector = false
    },
    getProductDetail () {
      ApiProduct.getDetail({ id: this.cProductIds[0] }).then(({ data }) => {
        this.form['productCode'] = data.productCode // 商品编码
        this.form['productId'] = data.id // 商品ID
        this.form['productImg'] = data.imgUrl // 商品图片
        this.form['productName'] = data.name // 商品名称
        this.form['productPrice'] = data.prePrice // 商品原价
        this.specificationList = data.specificationList.map((item) => {
          item.id = String(item.id)
          return item
        }) // 商品规格
      })
    },
    goodsSelectorChanged ({ data }) {
      this.form.productId = data[0]
      this.specIds = []
      this.getProductDetail()
      this.$refs['form'].validateField(['productId'])
    },
    confirmCheckedStore (data) {
      this.form.storeList = data
      // this.$refs['form'].clearValidate()
      this.$refs['form'].validateField(['storeList'])
    },
    getInfo () {
      ApiGroup.info({ id: this.form.id }).then(res => {
        const data = res.data
        data._time = [data.startTime, data.endTime]
        this.specIds = (data.specIds && data.specIds.split(',')) || []
        this.form = data
        this.getProductDetail()
      })
    },
    submit () {
      this.form.specIds = this.specIds.join(',')
      this.$refs['form'].validate((valid) => {
        if (!valid) return
        this.submitting = true
        this.form.startTime = this.form._time[0] || ''
        this.form.endTime = this.form._time[1] || ''
        ApiGroup[this.form.id ? 'update' : 'save'](this.form).then(({ code, message }) => {
          this.$message({ type: (code === 'SUCCESS' ? 'success' : 'error'), message: message })
          code === 'SUCCESS' && this.$router.go(-1)
          this.submitting = false
        }, () => {
          this.submitting = false
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .goods {
    display: flex;

    .goods-img {
      width: 100px;
      height: 100px;
    }
  }
</style>
