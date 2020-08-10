<template>
  <div class="page-add-coupon">

    <el-form
      ref="form"
      :model="form"
      :rules="formRules"
      class="form"
      label-width="100px">
      <el-card>
        <div slot="header">优惠券信息</div>
        <div>
          <el-form-item
            prop="name"
            label="优惠券名称"
            class="w500">
            <el-input
              :disabled="see"
              v-model="form.name"
              :maxlength="20" />
          </el-form-item>
          <el-form-item
            label="优惠券类型">
            <el-radio-group
              v-model="form.type"
              :disabled="see"
              @change="typeChange">
              <el-radio
                v-for="(value,key) in couponList"
                :key="key"
                :label="Number(key)">
                {{ value }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="发放总量"
            prop="total">
            <el-input
              :disabled="see"
              v-model="form.total"
              class="w200">
              <template slot="append">张</template>
            </el-input>
          </el-form-item>
          <el-form-item
            v-if="+form.type === 3"
            label="折扣额度"
            prop="discount">
            <el-input
              :disabled="see"
              v-model="form.discount"
              class="w200">
              <template slot="append">折</template>
            </el-input>
          </el-form-item>
          <el-form-item
            v-if="+form.type === 1"
            label="优惠券金额"
            prop="price">
            <el-input
              :disabled="see"
              v-model="form.price"
              class="w200">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item
            v-if="+form.type === 4"
            label="优惠券金额">
            按各门店运费模板，优惠金额不同 <span class="ml10 grey">(仅默认运费模板包邮)</span>
          </el-form-item>
          <el-form-item
            v-if="+form.type === 5"
            label="兑换面值"
            prop="price">
            <el-input
              :disabled="see"
              v-model="form.price"
              class="w200">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item
            label="发放方式">
            <el-radio-group
              v-model="form.distType"
              :disabled="see">
              <div class="mt10">
                <div
                  v-for="(value,key) in couponSendList"
                  :key="key"
                  class="mb10">
                  <el-radio
                    :label="Number(key)"
                    class="flex flex-align-c">
                    <template v-if="+key===1">
                      {{ value }}
                      <span class="grey ml10">(消费者端的商品详情页、购物车可领取)</span>
                    </template>
                    <template v-if="+key===2">
                      <div class="flex flex-align-c">
                        {{ value }}
                        <template v-if="+form.distType === 2">
                          <el-form-item
                            class="ml10"
                            prop="distNum">
                            每个导购限发放
                            <el-input
                              :disabled="see"
                              v-model.number="form.distNum"
                              class="w200">
                              <template slot="append">张</template>
                            </el-input>
                          </el-form-item>
                        </template>
                        <span class="grey ml10">(消费者端不展示，由导购转发给消费者领取，不限导购转发次数，限制消费者领取次数)</span>
                      </div>
                    </template>
                  </el-radio>
                </div>
              </div>
            </el-radio-group>
          </el-form-item>
        </div>
      </el-card>

      <el-card class="mt10">
        <div slot="header">基本规则</div>
        <div>
          <el-form-item
            label="发券时间"
            prop="time2">
            <el-date-picker
              :disabled="see"
              v-model="form.time2"
              :default-time="['00:00:00', '23:59:59']"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期" />
          </el-form-item>
          <el-form-item
            label="使用时间">
            <el-radio-group v-model="form.useTime">
              <div
                style="display:flex"
                class="mb20">
                <el-radio
                  :label="1"
                  :disabled="see"
                  class="mt10"
                >统一使用时间&nbsp;&nbsp;
                </el-radio>
                <el-form-item
                  v-if="form.useTime===1"
                  prop="time">
                  <el-date-picker
                    :disabled="see"
                    v-model="form.time"
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
                  领取后
                </el-radio>
                &nbsp;&nbsp;
                <el-form-item
                  v-if="form.useTime===2"
                  prop="laterDay"
                >
                  <el-input
                    :disabled="see"
                    v-model="form.laterDay"
                  >
                    <template slot="append">日</template>
                    内有效
                  </el-input>
                </el-form-item>
              </div>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="+form.type!==5"
            label="满减条件">
            <div style="display: -webkit-box; -webkit-box-align: center">
              <el-radio-group v-model="form.useRule">
                <el-radio
                  :label="0"
                  :disabled="see">无条件
                </el-radio>
                <el-radio
                  :label="1"
                  :disabled="see">满减条件
                </el-radio>
              </el-radio-group>
              <template v-if="form.useRule > 0">
                <span class="pl10">满</span>
                <div class="pl5 pr5">
                  <el-form-item prop="usePrice">
                    <el-input
                      :disabled="see"
                      v-model="form.usePrice"
                      class="w150">
                      <template slot="append">元</template>
                    </el-input>
                  </el-form-item>
                </div>
                可使用
              </template>
            </div>
          </el-form-item>
          <el-form-item label="领取条件">
            <div style="display: -webkit-box; -webkit-box-align: center">
              <el-radio-group v-model="form.receiveRule">
                <el-radio
                  :label="0"
                  :disabled="see">无条件
                </el-radio>
                <el-radio
                  :label="1"
                  :disabled="see">限领条件
                </el-radio>
              </el-radio-group>
              <template v-if="form.receiveRule > 0">
                <span class="pl10">每个ID可以领取</span>
                <div class="pl5 pr5">
                  <el-form-item prop="receiveTotal">
                    <el-input
                      :disabled="see"
                      v-model="form.receiveTotal"
                      class="w150">
                      <template slot="append">张</template>
                    </el-input>
                  </el-form-item>
                </div>
              </template>
            </div>
          </el-form-item>
          <!--<el-form-item
            label="前台显示">
            <div>
              <el-radio-group v-model="form.isShow">
                <el-radio
                  :label="1"
                  :disabled="see">显示
                </el-radio>
                <el-radio
                  :label="0"
                  :disabled="see">不显示
                </el-radio>
              </el-radio-group>
              <span class="pl20 ui-color3">(消费者端的商品详情页、购物车不显示，导购可发券给消费者领取)</span>
            </div>
          </el-form-item>-->
          <el-form-item label="活动商品">
            <el-radio-group v-model="form.activeGoods">
              <el-radio
                :label="1"
                :disabled="see">全店商品
              </el-radio>
              <el-radio
                :label="2"
                :disabled="see">指定商品
              </el-radio>
            </el-radio-group>
            <div v-show="form.activeGoods > 1">
              <el-button
                v-if="!see"
                :loading="loading"
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
                  prop="productCode"
                  align="center"
                  label="商品编号" />
                <el-table-column
                  v-if="!see"
                  label="操作"
                  fixed="right"
                  width="50"
                  align="center">
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      size="small"
                      @click="del(scope.row.id, scope.$index)">删除
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
                  @current-change="pageChange" />
              </div>
            </div>
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
          <!--<el-form-item
            prop="remindDay"
            label="过期提醒">
            <div>
              <el-radio-group v-model="form.isRemind">
                <el-radio
                  :label="0"
                  :disabled="see">不提醒
                </el-radio>
                <el-radio
                  :label="1"
                  :disabled="see">提醒
                </el-radio>
              </el-radio-group>
              <template v-if="form.isRemind===1">
                <span class="ml20 mr20">优惠券过期前</span>
                <el-input
                  v-model="form.remindDay"
                  class="w200">
                  <template slot="append">天</template>
                </el-input>
                <span class="pl20 ui-color3">(设置的天数需小于优惠券结束日期减开始日期的天数)</span>
              </template>
            </div>
          </el-form-item>-->
        </div>
      </el-card>

      <el-card class="mt10">
        <div slot="header">优惠券分享</div>
        <el-form-item
          prop="shareDesc"
          label="分享描述"
          class="w500">
          <el-input
            :disabled="see"
            v-model="form.shareDesc"
            :rows="3"
            maxlength="80"
            type="textarea" />
          <div>{{ form.shareDesc.length }}/80</div>
        </el-form-item>
        <el-form-item
          prop="shareImg"
          label="分享配图"
          class="w500">
          <div class="goods">
            <el-input
              v-show="false"
              v-model="form.shareImg" />
            <img
              v-if="form.shareImg"
              :src="form.shareImg"
              alt=""
              class="goods-img"
              @click="chooseMaterial">
            <div
              v-if="!form.shareImg"
              class="el-upload el-upload--picture-card"
              @click="chooseMaterial">
              <i class="el-icon-plus" />
            </div>
          </div>
          <p class="ui-color3">建议尺寸为 750 x 750 像素</p>
        </el-form-item>
      </el-card>

      <el-card class="mt10">
        <div slot="header">适用门店</div>
        <div class="condition-wrap">
          <template v-if="storeListLength>0">已选{{ storeListLength }}家门店</template>

          <!--已选门店可查看，所以不允许被禁用-->
          <el-button
            type="text"
            size="mini"
            @click="isShowStore=true">
            {{ storeListLength>0?'修改':'添加' }}门店
          </el-button>
        </div>
      </el-card>
    </el-form>

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
          :loading="saveIng"
          type="primary"
          @click="submit">保存
        </el-button>
      </template>
    </div>

    <!--商品选择-->
    <goods-selector
      v-if="!loading"
      :visible.sync="showGoodsSelector"
      :manual-data="form.productId"
      :hide-condition="hideCondition"
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
      @change="(val) => materialSelectorChange(val)" />
  </div>
</template>
<script>

import { CouponTypes, CouponSendTypes } from '@/config/const'
import * as Validate from '@/utils/validate'
import GoodsSelector from '@/components/GoodsSelector'
import SelectStoreTree from '@/components/SelectStoreTree'
import MaterialSelector from '@/components/MaterialSelector'
import * as ApiCoupon from '@/api/coupon'
import ApiProduct from '@/api/product'

export default {
  name: 'CouponAdd',
  components: {
    GoodsSelector,
    SelectStoreTree,
    MaterialSelector
  },
  data () {
    return {
      showMaterialSelector: false,
      couponList: CouponTypes,
      couponSendList: CouponSendTypes,
      isShowStore: false,
      saveIng: false,
      form: {
        shareImg: '',
        shareDesc: '',
        discount: '',
        distNum: '',
        type: 1,
        distType: 1,
        isRemind: 0,
        remindDay: '',
        id: '',
        name: '',
        total: '',
        price: '',
        explain: '',
        time: [],
        time2: [],
        usePrice: '',
        useRule: 0,
        receiveRule: 0,
        receiveTotal: '',
        isShow: 1,
        activeGoods: 1,
        productId: [],
        beginTime: '',
        endTime: '',
        issueEndTime: '',
        issueTime: '',
        storeList: [],
        useTime: 1,
        laterDay: ''
      },
      formRules: {
        // 0 - 10
        discount: [
          { required: true, message: '请输入', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value < 0 || value > 10) {
                return callback(new Error('请输入0-10之间的数'))
              }
              callback()
            }
          }
        ],
        // 0和正整数 - 自然数
        distNum: [
          { required: true, message: '请输入', trigger: 'blur' },
          {
            validator: (rule, value, callback) => Validate.limitNumber(rule, value, callback, { min: 0 }),
            trigger: 'blur'
          }
        ],
        name: [
          { required: true, message: '请输入优惠券名称', trigger: 'blur' }
        ],
        time: [
          { required: true, message: '请选择起止时间', trigger: 'blur' }
        ],
        time2: [
          { required: true, message: '请选择领取时间', trigger: 'blur' }
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
        total: [
          { required: true, message: '请输入正整数', trigger: 'blur' },
          { validator: Validate.positiveNumber, trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入', trigger: 'blur' },
          // { validator: (rule, value, callback) => Validate.limitNumber(rule, value, callback, { min: 1 }), trigger: 'blur' },
          { validator: Validate.money, trigger: 'blur' }
        ],
        usePrice: [
          { required: true, message: '请输入满减条件', trigger: 'blur' },
          { validator: Validate.money, trigger: 'blur' }
        ],
        receiveTotal: [
          { required: true, message: '请输入可以领取的数量', trigger: 'blur' },
          { validator: Validate.positiveNumber, trigger: 'blur' }
        ],
        laterDay: [{ required: true, message: '请输入领取后的天数', trigger: 'blur' },
          { validator: Validate.positiveNumber, trigger: 'blur' }]
      },
      tableData: [],
      currentPage: 1,
      total: 0,
      pageSize: 10,

      hideCondition: true,
      showGoodsSelector: false,
      loading: false,
      see: false
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
    id && this.getCouponInfo()
  },
  mounted () {
  },
  methods: {
    typeChange () {
      this.$refs['form'].clearValidate()
    },
    // 选择图片
    materialSelectorChange (val) {
      this.form.shareImg = val[0].imgUrl
      this.showMaterialSelector = false
    },
    chooseMaterial () {
      this.showMaterialSelector = true
    },
    confirmCheckedStore (data) {
      this.form.storeList = data
    },
    submit () {
      this.$refs['form'].validate((valid) => {
        if (!valid) return
        this.saveIng = true
        this.form.beginTime = this.form.time[0] || ''
        this.form.endTime = this.form.time[1] || ''
        this.form.issueTime = this.form.time2[0] || ''
        this.form.issueEndTime = this.form.time2[1] || ''
        ApiCoupon.save(this.form).then(({ code, message }) => {
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
    sizeChange (e) {
      this.pageSize = e
      this.getProductList()
    },
    pageChange (e) {
      this.currentPage = e
      this.getProductList()
    },
    del (id, index) {
      this.$confirm('确定删除该商品吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tableData.splice(index, 1)
        const _index = this.form.productId.indexOf(id)
        if (_index > -1) {
          this.form.productId.splice(_index, 1)
        }
        this.$message({ type: 'success', message: '删除成功' })
      }).catch(() => {
      })
    },
    goodsSelectorChanged ({ data }) {
      this.form.productId = data
      if (!data.length) return
      this.getProductList()
    },
    getProductList () {
      ApiProduct.productCouponlist({
        pids: this.form.productId.join(','),
        pageNum: this.currentPage,
        pageSize: this.pageSize
      }).then(({ data }) => {
        this.tableData = data.dataList || []
        this.total = data.totalCount || 0
      })
    },
    getCouponInfo () {
      ApiCoupon.info({ id: this.form.id }).then(({ data }) => {
        data.time = [data.beginTime, data.endTime]
        data.time2 = [data.issueTime, data.issueEndTime]
        this.form = Object.assign(this.form, data)
        if (this.form.productId && this.form.productId.length > 0) {
          this.getProductList()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .goods-img {
    width: 148px;
    height: 148px;
  }

  .page-add-coupon {
    /deep/ .el-form-item__content {
      font-size: 12px;
    }

    /deep/ .el-form-items .el-form-item {
      display: inline-block;
    }
  }
</style>
