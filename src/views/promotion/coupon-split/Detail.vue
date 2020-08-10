<template>
  <el-form
    ref="form"
    :model="form"
    :rules="rules"
    class="form"
    label-width="100px">
    <el-card class="mt10">
      <div slot="header">瓜分券设置</div>
      <el-form-item
        prop="name"
        label="瓜分券名称"
        class="w500">
        <el-input
          :disabled="see"
          v-model="form.name"
          :maxlength="30">
          <template slot="append">{{ form.name.length }}/30</template>
        </el-input>
      </el-form-item>
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
        :rules="rules.limitNumber"
        prop="total"
        label="发放总量"
        class="w500">
        <el-input
          :disabled="see"
          v-model="form.total">
          <template slot="append">张</template>
        </el-input>
      </el-form-item>
      <el-form-item
        label="瓜分方式">
        <div
          class="flex flex-align-c">
          <el-radio-group v-model="form.distType">
            <div class="fs12">
              <div
                style="display:flex;height: 36px;"
                class="mb20">
                <el-radio
                  :label="1"
                  :disabled="see"
                  class="mt10"
                >
                  平均分配金额（每人可得券额相同）
                </el-radio>
                <template v-if="form.distType===1">
                  <div class="flex flex-align-c">
                    <el-form-item prop="distNum">
                      <el-input
                        :disabled="see"
                        v-model="form.distNum"
                        style="width: 270px;">
                        <template slot="append">人</template>
                      </el-input>
                    </el-form-item>
                    <span class="f12 ml10 mr10">每人</span>
                    <el-form-item prop="price">
                      <el-input
                        :disabled="see"
                        v-model="form.price"
                        style="width: 270px;">
                        <template slot="append">元</template>
                      </el-input>
                    </el-form-item>
                  </div>
                </template>
              </div>
              <div
                style="display:flex;height: 36px;">
                <el-radio
                  :label="2"
                  :disabled="see"
                  class="mt10"
                >
                  随机分配金额（每人可得券额随机）
                </el-radio>
                <template v-if="form.distType===2">
                  <div class="flex flex-align-c">
                    <el-form-item prop="distNum">
                      <el-input
                        :disabled="see"
                        v-model="form.distNum"
                        style="width: 270px;">
                        <template slot="append">人</template>
                      </el-input>
                    </el-form-item>
                    <span class="f12 ml10 mr10">瓜分</span>
                    <el-form-item prop="price">
                      <el-input
                        :disabled="see"
                        v-model="form.price"
                        style="width: 270px;">
                        <template slot="append">元</template>
                      </el-input>
                    </el-form-item>
                  </div>
                </template>
              </div>
            </div>
          </el-radio-group>
          <div
            class="grey ml24 f12"
            style="line-height: 1.8;">
            <div>优惠券金额仅限整数</div>
            <div>每张瓜分券从打开起24小时内有效，超过瓜分失败；</div>
          </div>
        </div>
      </el-form-item>
      <el-form-item
        prop="usePrice"
        label="满减条件">
        <el-radio-group
          v-model="form.useRule"
          :disabled="see">
          <el-radio
            :label="0">无条件
          </el-radio>
          <el-radio
            :label="1">满减条件
          </el-radio>
        </el-radio-group>
        <template v-if="form.useRule">
          <el-input
            v-if="form.useRule"
            :disabled="see"
            v-model="form.usePrice"
            style="width: 238px;"
            class="ml24">
            <span slot="prepend">满</span>
            <template slot="append">元</template>
          </el-input>
          <span
            class="ml24"
            style="color: #ccc;">可用</span>
        </template>
      </el-form-item>
      <el-form-item
        prop="receiveTotal"
        label="限参与活动次数">
        <el-radio-group
          v-model="form.receiveRule"
          :disabled="see">
          <el-radio
            :label="0">不限
          </el-radio>
          <el-radio
            :label="1">限次数
          </el-radio>
        </el-radio-group>
        <template v-if="form.receiveRule">
          <el-input
            :disabled="see"
            v-model="form.receiveTotal"
            style="width: 238px;"
            class="ml24">
            <span slot="prepend">限</span>
            <template slot="append">次</template>
          </el-input>
          <span
            class="ml24"
            style="color: #ccc;">用户必须瓜分成功后，才能再一次参加同一个瓜分券活动；</span>
        </template>
      </el-form-item>
      <el-form-item
        label="可用券时间">
        <el-radio-group v-model="form.useTime">
          <div
            style="display:flex"
            class="mb20">
            <el-radio
              :label="1"
              :disabled="see"
              class="mt10"
            >
              统一使用时间
            </el-radio>
            <el-form-item
              v-if="form.useTime===1"
              prop="_time2">
              <el-date-picker
                :disabled="see"
                v-model="form._time2"
                :default-time="['00:00:00', '23:59:59']"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期" />
            </el-form-item>
          </div>
          <div style="display:flex">
            <el-radio
              :label="2"
              :disabled="see"
              class="mt10"
            >
              成功瓜分券后
            </el-radio>
            <el-form-item
              v-if="form.useTime===2"
              prop="laterDay"
            >
              <el-input
                :disabled="see"
                v-model="form.laterDay"
                style="width: 270px;"
              >
                <template slot="append">日</template>
              </el-input>
              <span class="f12 ml10">内可用</span>
            </el-form-item>
          </div>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        prop="autoDist"
        label="模拟好友">
        <el-checkbox
          v-model="form.autoDist"
          :disabled="see"
          :true-label="1"
          :false-label="0">
          <span>开启模拟好友</span>
        </el-checkbox>
        <span
          class="ml10"
          style="color: #ccc;font-size: 14px;">（开启后24小时内如果未满足瓜分条件，系统自动模拟好友完成瓜分）</span>
      </el-form-item>
      <!--<el-form-item
        prop="remindDay"
        label="过期提醒">
        <el-checkbox
          v-model="form.isRemind"
          :disabled="see"
          :true-label="1"
          :false-label="0">
          <span>优惠券过期前</span>
        </el-checkbox>
        <el-input
          :disabled="see"
          v-model="form.remindDay"
          style="width: 270px;"
          class="ml10">
          <template slot="append">日</template>
        </el-input>
        <span class="ml10 f12">提醒</span>
        <span
          class="ml10"
          style="color: #ccc;font-size: 14px;">（设置的天数需小于优惠券结束日期减开始日期的天数）</span>
      </el-form-item>-->
      <el-form-item
        ref="topImgForm"
        label="首页弹窗"
        prop="topImg">
        <el-checkbox
          :disabled="see"
          v-model="form.isTop"
          :true-label="1"
          :false-label="0">开启弹窗
        </el-checkbox>
        <div
          class="ui-img-uploader"
          @click="materialSelector2('topImg')">
          <img
            v-if="form.topImg"
            :src="form.topImg"
            class="img">
          <p
            v-else
            class="ui-img-uploader-plus"><i class="icons el-icon-plus" /> 添加图片</p>
        </div>
        <p class="ui-color3">建议尺寸为 600 x 800 像素</p>
      </el-form-item>
      <el-form-item label="使用说明">
        <el-input
          :disabled="see"
          v-model="form.explain"
          class="w500"
          rows="6"
          maxlength="240"
          type="textarea" />
        <div>{{ form.explain.length }}/240</div>
      </el-form-item>
      <el-form-item label="活动商品">
        <el-radio-group
          v-model="form.activeGoods"
          :disabled="see">
          <el-radio
            :label="1">全店商品
          </el-radio>
          <el-radio
            :label="2">指定商品
          </el-radio>
        </el-radio-group>
        <div
          v-show="form.activeGoods > 1"
          class="pt10">
          <el-button
            v-if="!see"
            size="mini"
            type="primary"
            icon="el-icon-plus"
            @click="showGoodsSelector = true">添加商品
          </el-button>
          <el-table
            :data="tableData"
            class="mt10">
            <el-table-column
              width="70"
              align="center"
              label="缩略图">
              <template slot-scope="scope">
                <img
                  :src="scope.row.imgUrl"
                  style="width: 50px; height: 50px; display: block; margin: 0 auto;">
              </template>
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="name"
              label="商品名称" />
            <el-table-column
              :show-overflow-tooltip="true"
              width="200px;"
              prop="productCode"
              align="center"
              label="商品编号" />
            <el-table-column
              label="操作"
              fixed="right"
              width="50"
              align="center">
              <template slot-scope="scope">
                <el-button
                  v-if="!see"
                  type="text"
                  size="small"
                  @click="del(scope.row.id, scope.$index)">删除
                </el-button>
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
        </div>
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
    <goods-selector
      v-if="showGoodsSelector"
      :visible.sync="showGoodsSelector"
      :manual-data="productIds"
      :hide-condition="true"
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
    <!--首页弹窗上传图片-->
    <material-selector
      :when-show-clear-selected="true"
      :visible.sync="showMaterialSelector2"
      :is-multi="false"
      @change="materialSelectorChanged2" />
  </el-form>
</template>

<script>
import * as Validate from '@/utils/validate'
import ApiProduct from '@/api/product'
import * as ApiGroup from '@/api/coupon-split'
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
      search: {
        pageNum: 1,
        totalCount: 0,
        pageSize: 10
      },
      currentMaterialSelector: '',
      showMaterialSelector2: false,
      tableData: [],
      form: {
        _time: [],
        _time2: [],
        explain: '',
        useTime: 1,
        laterDay: '',
        activeGoods: 1,
        productList: [],
        isTop: 0, // 首页弹窗 0否 1是
        topImg: '', // 弹窗图片地址
        'autoDist': '',
        'total': '',
        'endTime': '', // 活动结束时间
        'id': null, // 瓜分券ID
        distType: 2,
        price: '',
        distNum: '',
        usePrice: '',
        useRule: 0,
        'receiveRule': 0, // 是否限制购买数量 0否 1是
        'receiveTotal': '', // 限制购买数量
        'isRemind': '', // 瓜分券是否开启过期提醒
        'remindDay': '', // 瓜分券过期提醒
        'storeList': [], // 许可门店列表
        'startTime': '', // 活动开始时间
        'name': '' // 瓜分券名称
      },
      rules: {
        limitNumber: [
          { required: true, message: '本项必填', trigger: 'blur' },
          {
            validator: (rule, value, callback) => Validate.limitNumber(rule, value, callback, { min: 1 }),
            trigger: 'blur'
          }
        ],
        topImg: [
          { required: true, message: '请上传图片', trigger: 'blur' }
        ],
        laterDay: [
          { required: true, message: '本项必填', trigger: 'blur' },
          {
            validator: (rule, value, callback) => Validate.limitNumber(rule, value, callback, { min: 1 }),
            trigger: 'blur'
          }
        ],
        distNum: [
          { required: true, message: '本项必填', trigger: 'blur' },
          {
            validator: (rule, value, callback) => Validate.limitNumber(rule, value, callback, { min: 1 }),
            trigger: 'blur'
          }
        ],
        price: [
          { required: true, message: '本项必填', trigger: 'blur' },
          {
            validator: (rule, value, callback) => Validate.limitNumber(rule, value, callback, { min: 1 }),
            trigger: 'blur'
          }
        ],
        _time: [{ required: true, message: '本项必填', trigger: 'blur' }],
        _time2: [{ required: true, message: '本项必填', trigger: 'blur' }],
        receiveTotal: [
          {
            validator: (rule, value, callback) => {
              if (+this.form.receiveRule === 1) {
                return Validate.limitNumber(rule, value, callback, { min: 1 })
              }
              callback()
            }
          }
        ],
        usePrice: [
          {
            validator: (rule, value, callback) => {
              if (+this.form.useRule === 1) {
                return Validate.min0(rule, value, callback, { min: 0 })
              }
              callback()
            }
          }
        ],
        remindDay: [
          {
            validator: (rule, value, callback) => {
              if (+this.form.isRemind === 1) {
                return Validate.limitNumber(rule, value, callback, { min: 1 })
              }
              callback()
            }
          }
        ],
        name: [{ required: true, message: '本项必填', trigger: 'blur' }],
        storeList: [{ required: true, message: '本项必填', trigger: 'blur' }]
      },
      see: false,
      isShowStore: false,
      showGoodsSelector: false,
      showMaterialSelector: false,
      submitting: false
    }
  },
  computed: {
    productIds () {
      return this.form.productList.map((item) => item.productId)
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
    materialSelector2 (type) {
      if (this.see) return
      this.currentMaterialSelector = type
      this.showMaterialSelector2 = true
    },
    materialSelectorChanged2 (val) {
      const imgUrl = val[0] && val[0].imgUrl
      this.form[this.currentMaterialSelector] = imgUrl
      this.$refs[`${this.currentMaterialSelector}Form`].clearValidate()
      this.currentMaterialSelector = ''
      this.showMaterialSelector2 = false
    },
    // 商品详情图片选择
    detailMaterialSelectorChanged (val) {
      this.showMaterialSelector = false
    },
    getProductDetail (id, item) {
      ApiProduct.getDetail({ id }).then(({ data }) => {
        item._specificationList = data.specificationList
        this.tableData = [].concat(this.tableData)
      })
    },
    goodsSelectorChanged ({ data }) {
      this.form.productList = data.map((item) => {
        return { productId: item, specIds: [], specType: 1 }
      })
      this.getProductList()
    },
    getProductList () {
      ApiProduct.productCouponlist({
        pids: this.productIds.join(','),
        pageNum: this.search.pageNum,
        pageSize: this.search.pageSize
      }).then(({ data }) => {
        this.search.totalCount = data.totalCount || 0
        this.tableData = data.dataList || []
        this.tableData.forEach((item) => this.getProductDetail(item.id, item))
      })
    },
    sizeChange (e) {
      this.search.pageSize = e
      this.getProductList()
    },
    pageChange (e) {
      this.search.pageNum = e
      this.getProductList()
    },
    del (id, index) {
      this.$confirm('确定删除该商品吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tableData.splice(index, 1)
        const _index = this.productIds.indexOf(id)
        _index > -1 && this.form.productList.splice(_index, 1)
        this.$message({ type: 'success', message: '删除成功' })
        this.pageChange(1)
      }).catch(() => {
      })
    },
    confirmCheckedStore (data) {
      this.form.storeList = data
      this.$refs['form'].clearValidate()
    },
    getInfo () {
      ApiGroup.info({ id: this.form.id }).then(res => {
        const data = res.data
        data._time = [data.issueTime, data.issueEndTime]
        data._time2 = [data.beginTime, data.endTime]
        this.form = data
        if (this.form.productList && this.form.productList.length > 0) {
          this.getProductList()
        }
      })
    },
    submit () {
      this.$refs['form'].validate((valid) => {
        if (!valid) return
        this.submitting = true
        this.form.issueTime = this.form._time[0] || ''
        this.form.issueEndTime = this.form._time[1] || ''
        this.form.beginTime = this.form._time2[0] || ''
        this.form.endTime = this.form._time2[1] || ''
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
