<template>
  <el-form
    ref="form"
    :model="form"
    :rules="rules"
    class="form"
    label-width="100px">
    <el-card>
      <div slot="header">拼团详情</div>
      <el-form-item
        prop="title"
        label="拼团标题"
        class="w500">
        <el-input
          :disabled="see"
          v-model="form.title"
          :maxlength="30">
          <template slot="append">{{ form.title.length }}/30</template>
        </el-input>
      </el-form-item>
    </el-card>
    <el-card class="mt10">
      <div slot="header"><span class="ui-require">*</span>拼团商品</div>
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
      <div slot="header"><span class="ui-require">*</span>活动主图</div>
      <div
        class="goods">
        <img
          v-if="form.activeImg"
          :src="form.activeImg"
          alt=""
          class="goods-img"
          @click="showMaterialSelector = true">
        <div
          v-if="!form.activeImg"
          class="el-upload el-upload--picture-card"
          @click="showMaterialSelector = true">
          <i class="el-icon-plus" />
        </div>
      </div>
      <p
        class="ui-color3"
        style="line-height: 36px;">建议尺寸为 750 x 380 像素</p>
    </el-card>
    <el-card class="mt10">
      <div slot="header">拼团设置</div>
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
        prop="activePrice"
        label="活动价格"
        class="w500">
        <el-input
          :disabled="see"
          v-model="form.activePrice">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <!--<el-form-item
        label="活动库存">
        <el-radio-group
          v-model="form.isLimitStock"
          :disabled="see">
          <el-radio
            :label="0">不限量
          </el-radio>
          <el-radio
            :label="1">限量
          </el-radio>
        </el-radio-group>
        <el-input
          v-if="form.isLimitStock"
          :disabled="see"
          v-model="form.limitStock"
          style="width: 238px;"
          class="ml24">
          <template slot="append">件</template>
        </el-input>
      </el-form-item>-->
      <el-form-item
        prop="groupNumber"
        label="成团人数"
        class="w500">
        <el-input
          :disabled="see"
          v-model.number="form.groupNumber">
          <template slot="append">人</template>
        </el-input>
      </el-form-item>
      <el-form-item
        prop="validHour"
        label="成团时效"
        class="w500">
        <el-input
          :disabled="see"
          v-model.number="form.validHour">
          <template slot="append">小时</template>
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
        <span
          class="ml24"
          style="color: #ccc;">不限量则活动库存与商品库存共享</span>
      </el-form-item>
      <el-form-item
        prop="autoGroup"
        label="是否自动成团">
        <el-radio-group
          v-model="form.autoGroup"
          :disabled="see">
          <el-radio
            :label="0">否
          </el-radio>
          <el-radio
            :label="1">是
          </el-radio>
        </el-radio-group>
        <span
          class="ml24"
          style="color: #ccc;">活动结束前自动成团</span>
      </el-form-item>
      <!--<el-form-item
        prop="activeRule"
        label="活动规则"
        class="w500">
        <el-input
          :disabled="see"
          v-model="form.activeRule"
          :rows="3"
          maxlength="150"
          type="textarea" />
        <div>{{ form.activeRule.length }}/150</div>
      </el-form-item>-->
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
import * as ApiGroup from '@/api/group'
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
        _productIds: [],
        'autoGroup': 0, // 是否自动成团
        'activeImg': '', // 活动主图
        'activePrice': '', // 拼团价
        'activeRule': '', // 活动规则
        'endTime': '', // 活动结束时间
        'groupNumber': '', // 成团人数
        'id': null, // 拼团ID
        'isLimitNum': 0, // 是否限制购买数量 0否 1是
        'isLimitStock': 0, // 库存是否限量 0否 1是
        'limitNum': '', // 限制购买数量
        'limitStock': '', // 库存限量
        'storeList': [], // 许可门店列表
        'productCode': '', // 商品编码
        'productId': '', // 商品ID
        'productImg': '', // 商品图片
        'productName': '', // 商品名称
        'productPrice': '', // 商品售价
        'startTime': '', // 活动开始时间
        'title': '', // 拼团标题
        'validHour': '', // 成团时效(小时)
        specIds: [], // 规格ids，用逗号拼接
        specType: 1 // 规格类型 1全部 2指定规格
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
        title: [{ required: true, message: '本项必填', trigger: 'blur' }],
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
      ApiGroup.info({ id: this.form.id }).then(res => {
        const data = res.data
        data._time = [data.startTime, data.endTime]
        data._productIds = [data.productId]
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
        ApiGroup.save(this.form).then(({ code, message }) => {
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
