<template>
  <el-form
    ref="form"
    :model="form"
    :rules="rules"
    class="form"
    label-width="100px">
    <el-card class="mt10">
      <div slot="header"><span class="ui-require">*</span>秒杀商品</div>
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
        type="text"
        size="mini"
        class="w100"
        @click="showGoodsSelector=true">
        {{ form.productId?'修改':'添加' }}商品
      </el-button>
    </el-card>
    <el-card class="mt10">
      <div slot="header">秒杀设置</div>
      <el-form-item
        prop="_time"
        label="秒杀时间"
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
        prop="activePrice"
        label="秒杀价格"
        class="w500">
        <el-input
          :disabled="see"
          v-model="form.activePrice">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-form-item
        prop="limitNum"
        label="是否限购">
        <el-radio-group
          v-model="form.isLimitNum"
          :disabled="see">
          <el-radio
            :label="0">不限购
          </el-radio>
          <el-radio
            :label="1">限购
          </el-radio>
        </el-radio-group>
        <el-input
          v-if="form.isLimitNum"
          :disabled="see"
          v-model.number="form.limitNum"
          style="width: 238px;"
          class="ml24">
          <template slot="append">件/人</template>
        </el-input>
        <!-- <span
          class="ml24"
          style="color: #ccc;">不限量则活动库存与商品库存共享</span> -->
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
      :manual-data="form._productIds"
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
import GoodsSelector from '@/components/GoodsSelector'
import SelectStoreTree from '@/components/SelectStoreTree'
import MaterialSelector from '@/components/MaterialSelector'
import * as ApiSeckill from '@/api/seckill'
import { dateFormat } from '@/utils'
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
        'activePrice': '', // 秒杀价格
        'startTime': '', // 活动开始时间
        'endTime': '', // 活动结束时间
        'id': null, // 闲时间秒杀id
        'isLimitNum': 0, // 是否限制购买数量 0否 1是
        'limitNum': '', // 限制购买数量
        'productCode': '', // 商品编码
        'productId': '', // 商品ID
        'productImg': '', // 商品图片
        'productName': '', // 商品名称
        'productPrice': '', // 商品售价
        'sellAmount': '', // 销售金额
        'sellNumber': '', // 销售件数
        specIds: [], // 规格ids，用逗号拼接
        specType: 1, // 规格类型 1全部 2指定规格
        'storeList': [], // 许可门店列表
        useCoupon: '', // 允许使用优惠券
        virtualNumber: '', // 虚拟销售
        _time: [],
        _productIds: [],

        'activeImg': '', // 活动主图
        'activeRule': '', // 活动规则
        'isLimitStock': 0, // 库存是否限量 0否 1是
        'limitStock': '' // 库存限量

      },
      rules: {
        activePrice: [
          { required: true, message: '本项必填', trigger: 'blur' },
          { validator: (rule, value, callback) => Validate.min0(rule, value, callback, { min: 1 }), trigger: 'blur' }
        ],
        _time: [{ required: true, message: '本项必填', trigger: 'blur' }],
        groupNumber: [
          { required: true, message: '本项必填', trigger: 'blur' },
          { validator: (rule, value, callback) => Validate.min0(rule, value, callback, { min: 2 }), trigger: 'blur' }
        ],
        validHour: [
          { required: true, message: '本项必填', trigger: 'blur' },
          { validator: (rule, value, callback) => Validate.min0(rule, value, callback, { min: 1 }), trigger: 'blur' }
        ],
        limitNum: [
          {
            validator: (rule, value, callback) => {
              if (+this.form.isLimitNum === 1) {
                return Validate.min0(rule, value, callback, { min: 1 })
              }
              callback()
            }
          }
        ],
        // title: [{ required: true, message: '本项必填', trigger: 'blur' }],
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
    handleValidHour () {
      this.form.validHour = this.form.validHour.replace(/\./ig, '')
    },
    // 商品详情图片选择
    detailMaterialSelectorChanged (val) {
      this.form.activeImg = val[0].imgUrl
      this.showMaterialSelector = false
    },
    getProductDetail () {
      ApiProduct.getDetail({ id: this.form._productIds[0] }).then(({ data }) => {
        this.form['productCode'] = data.productCode // 商品编码
        this.form['productId'] = data.id // 商品ID
        this.form['productImg'] = data.imgUrl // 商品图片
        this.form['productName'] = data.name // 商品名称
        this.form['productPrice'] = data.price // 商品售价
        this.specificationList = data.specificationList.map((item) => {
          item.id = String(item.id)
          return item
        }) // 商品规格
      })
    },
    goodsSelectorChanged ({ data }) {
      this.form._productIds = data
      this.form.productId = data[0]
      this.specIds = []
      this.getProductDetail()
    },
    confirmCheckedStore (data) {
      this.form.storeList = data
      this.$refs['form'].clearValidate()
    },
    getInfo () {
      ApiSeckill.seckillInfo({ id: this.form.id }).then(res => {
        const data = res.data
        data._productIds = [data.productId]
        this.specIds = (data.specIds && data.specIds.split(',')) || []
        data.endTime = data.endTime ? dateFormat(data.endTime) : ''
        data.startTime = data.startTime ? dateFormat(data.startTime) : ''
        data._time = [data.startTime, data.endTime]
        console.log(data)
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
        ApiSeckill.addSeckill(this.form).then(({ code, message }) => {
          this.$message({ type: (code === 'SUCCESS' ? 'success' : 'error'), message: message })
          code === 'SUCCESS' && this.$router.go(-1)
          this.submitting = false
        }, () => { this.submitting = false })
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
