<template>
  <div class="page-add-fullreduce">

    <el-form
      ref="form"
      :model="form"
      :rules="formRules"
      class="form"
      label-width="100px">
      <el-card>
        <div slot="header">活动信息</div>
        <el-form-item
          prop="name"
          label="活动名称"
          class="w500">
          <el-input
            :disabled="see"
            v-model="form.name"
            :maxlength="30">
            <template slot="append">{{ form.name.length }}/30</template>
          </el-input>
        </el-form-item>
        <el-form-item
          label="起止时间"
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
        <el-form-item
          label="是否包邮">
          <el-radio-group
            v-model="form.expressFree"
            :disabled="see">
            <el-radio
              :label="1">包邮
            </el-radio>
            <el-radio
              :label="0">不包邮
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-card>

      <el-card class="mt10">
        <div slot="header">优惠类型</div>
        <div class="condition-wrap">
          <el-radio-group
            :disabled="see"
            v-model="form.discountType"
            @change="changeType">
            <el-radio
              :label="1">订单优惠
            </el-radio>
            <el-radio
              :label="2">商品优惠
              <span class="type-grey">（不与会员优惠叠加）</span>
            </el-radio>
          </el-radio-group>
          <div
            class="pt10"
            style="padding-left: 102px">
            <el-radio-group
              v-if="form.discountType > 1"
              :disabled="see"
              v-model="form.type"
              @change="changeType">
              <el-radio :label="2">满折优惠</el-radio>
              <el-radio :label="4">一口价</el-radio>
              <el-radio :label="1">满减优惠</el-radio>
              <el-radio :label="5">
                <el-popover
                  ref="popover"
                  placement="right"
                  title=""
                  width="360"
                  trigger="hover">
                  活动会优先计算售价低的商品
                  <br>
                  如：活动设置了2个优惠，消费者买了5件，则5件中价格最低的两件享受活动优惠；
                  <span slot="reference">
                    <span>第N件打折</span>
                    <span class="ml5 f16 el-icon-question" />
                  </span>
                </el-popover>
              </el-radio>
            </el-radio-group>
          </div>
        </div>
      </el-card>

      <el-card class="mt10">
        <el-row
          slot="header"
          class="flex">
          <p class="pr20">优惠条件</p>
        </el-row>
        <div class="condition-wrap">
          <div class="condition-item condition-header">
            <div class="hierarchy">层级</div>
            <div class="threshold">优惠门槛</div>
            <div class="mode pl50">优惠方式</div>
          </div>
          <div
            v-for="(item, index) in form.rules"
            :key="index"
            class="condition-item">
            <el-button
              v-if="!see"
              class="del"
              type="text"
              icon="el-icon-delete"
              @click="delRules(index)" />
            <div class="hierarchy">{{ index+1 }}</div>
            <div class="threshold">
              <el-form-item
                v-if="form.discountType > 1"
                :rules="form.unit > 1 || form.type == 4 ? formRules.rules.usePrice2 : formRules.rules.usePrice"
                :prop="'rules.' + index + '.usePrice'"
                class="w200"
                label-width="0">
                <el-input
                  :disabled="see"
                  v-model="item.usePrice">
                  <template slot="prepend">
                    {{ form.type == 1 ? '满' : '' }}
                    {{ form.type == 2 ? '满' : '' }}
                    {{ form.type == 4 ? '每' : '' }}
                    {{ form.type == 5 ? '第' : '' }}
                  </template>
                  <template
                    v-if="form.discountType <= 1"
                    slot="append">元</template>
                  <template v-else>
                    <template
                      v-if="form.type == 4 || form.type == 1 || form.type == 5"
                      slot="append">件</template>
                    <el-select
                      v-else
                      slot="append"
                      :disabled="see || index > 0"
                      v-model="form.unit"
                      style="width: 70px;"
                      @change="changeUnit">
                      <el-option
                        :value="1"
                        label="元" />
                      <el-option
                        :value="2"
                        label="件" />
                    </el-select>
                  </template>
                </el-input>
              </el-form-item>

              <el-form-item
                v-else
                :rules="formRules.rules.usePrice"
                :prop="'rules.' + index + '.usePrice'"
                label-width="0"
                class="w200">
                <el-input
                  :disabled="see"
                  v-model="item.usePrice">
                  <template slot="prepend">满</template>
                  <div slot="append">元</div>
                </el-input>
              </el-form-item>
            </div>
            <div class="mode pl20">
              <div class="flex">
                <!--订单优惠-->
                <div v-if="form.discountType===1">
                  <el-radio
                    :disabled="see"
                    v-model="defaultTrue"
                    :label="1">减现金
                  </el-radio>
                  <el-form-item
                    :rules="formRules.rules.price"
                    :prop="'rules.' + index + '.price'"
                    label-width="0"
                    style="display: inline-block;">
                    <el-input
                      :disabled="see"
                      v-model="item.price"
                      class="w200">
                      <template slot="prepend">减</template>
                      <template slot="append">元</template>
                    </el-input>
                  </el-form-item>
                </div>
                <template v-else>
                  <!--商品优惠-->
                  <div v-if="form.type == 2 || form.type == 5">
                    <el-radio
                      :disabled="see"
                      v-model="defaultTrue"
                      :label="1">打折
                    </el-radio>
                    <el-form-item
                      :rules="formRules.rules.discount"
                      :prop="'rules.' + index + '.discount'"
                      label-width="0"
                      style="display: inline-block;">
                      <el-input
                        :disabled="see"
                        v-model="item.discount"
                        class="w200">
                        <template slot="prepend">打</template>
                        <template slot="append">折</template>
                      </el-input>
                    </el-form-item>
                  </div>
                  <div v-if="form.type == 4 || form.type == 1">
                    <el-radio
                      :disabled="see"
                      v-model="defaultTrue"
                      :label="1">
                      {{ form.type == 4?'一口价':'' }}
                      {{ form.type == 1?'减现金':'' }}
                    </el-radio>
                    <el-form-item
                      :rules="formRules.rules.price"
                      :prop="'rules.' + index + '.price'"
                      label-width="0"
                      style="display: inline-block;">
                      <el-input
                        :disabled="see"
                        v-model="item.price"
                        class="w200">
                        <template slot="append">元</template>
                      </el-input>
                    </el-form-item>
                  </div>
                </template>
                <el-form-item
                  v-if="form.type != 5"
                  class="ml15 mr15"
                  label-width="0"
                  label="">
                  <!--
                  <el-checkbox
                    :disabled="see"
                    v-model="item.isOpenGift">送赠品
                  </el-checkbox>
-->
                  <!--:rules="formRules.rules.giftIds"-->
                  <!--:prop="'rules.' + index + '.giftIds'"-->
                  <el-form-item
                    style="display: inline-block;">
                    <el-button
                      :disabled="see && item.giftIds.length <= 0"
                      type="text"
                      icon="el-icon-plus"
                      size="mini"
                      @click="selectGoods(index)">{{ item.giftIds.length > 0 ? `已选${item.giftIds.length}赠品` : '添加赠品' }}
                    </el-button>
                  </el-form-item>
                </el-form-item>
                <el-radio-group
                  v-if="item.giftIds.length > 0 && form.discountType > 1"
                  v-model="item.giftRule"
                  @change="changeGift(index)">
                  <div>
                    <el-radio
                      :label="1"
                      :disabled="see">
                      <span>限领</span>
                      <el-form-item
                        v-if="item.giftRule <= 1"
                        :rules="formRules.rules.giftLimit"
                        :prop="'rules.' + index + '.giftLimit'"
                        style="display: inline-block;"
                        label-width="10px">
                        <el-input
                          :disabled="see"
                          v-model="item.giftLimit"
                          class="w150">
                          <template slot="append">件</template>
                        </el-input>
                      </el-form-item>
                    </el-radio>
                  </div>
                  <div class="pb5">
                    <el-radio
                      :label="2"
                      :disabled="see">
                      <span>限额</span>
                      <el-form-item
                        v-if="item.giftRule > 1"
                        :rules="formRules.rules.giftLimit2"
                        :prop="'rules.' + index + '.giftLimit'"
                        style="display: inline-block;"
                        label-width="10px">
                        <el-input
                          :disabled="see"
                          v-model="item.giftLimit"
                          class="w150">
                          <template slot="append">元</template>
                        </el-input>
                      </el-form-item>
                    </el-radio>
                  </div>
                </el-radio-group>
              </div>
            </div>
          </div>
          <div
            v-if="form.type==5"
            class="ui-color1 mb20">优惠规则按照活动商品售价由高到低排列</div>
          <div v-if="form.rules.length < 5 && !see">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-plus"
              @click="addRules">新增一级优惠
            </el-button>
            <span class="ui-color3 pl10">（还可添加{{ 5-form.rules.length }}个优惠，各级优惠不可叠加）</span>
          </div>
        </div>
      </el-card>

      <el-card class="mt10">
        <div slot="header">活动商品</div>
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
              :show-overflow-tooltip="true"
              width="200px;"
              prop="productCode"
              align="center"
              label="商品编号" />
            <el-table-column
              width="180px"
              align="center"
              label="规格类型">
              <template slot-scope="scope">
                <span
                  v-for="(item, index) in form.productList"
                  v-if="scope.row.id == item.productId"
                  :key="item.productId">
                  <el-radio-group
                    v-model="form.productList[index].specType"
                    :disabled="see"
                    class="pr10">
                    <el-radio :label="1">全部</el-radio>
                    <el-radio :label="2">指定规格</el-radio>
                  </el-radio-group>
                </span>
              </template>
            </el-table-column>
            <el-table-column
              header-align="center"
              label="商品规格">
              <template slot-scope="scope">
                <span
                  v-for="(item, index) in form.productList"
                  v-if="scope.row.id == item.productId && item.specType == 2"
                  :key="item.productId">
                  <el-checkbox-group
                    :disabled="see"
                    v-model="form.productList[index].specIds"
                    class="mt10">
                    <el-checkbox
                      v-for="item in scope.row._specificationList"
                      :label="item.id"
                      :key="item.id">{{ item.specContent }}
                    </el-checkbox>
                  </el-checkbox-group>
                </span>
              </template>
            </el-table-column>
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
              :current-page="currentPage"
              :page-sizes="$store.state.app.pageSizes"
              :page-size="pageSize"
              :total="total"
              :layout="$store.state.app.layout"
              @size-change="sizeChange"
              @current-change="pageChange" />
          </div>
        </div>
      </el-card>

      <el-card class="mt10">
        <div slot="header">适用门店</div>
        <div class="condition-wrap">
          <span
            v-if="storeListLength>0"
            class="pr10">已选{{ storeListLength }}家门店</span>
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
    <goods-selected
      v-if="showGoodsSelected"
      :visible.sync="showGoodsSelected"
      :default-value="goodsSelectedData"/>
    <goods-selector
      v-if="showGoodsSelector2"
      :visible.sync="showGoodsSelector2"
      :manual-data="rulesId"
      :hide-condition="true"
      :multiple="form.discountType > 1"
      type="manual"
      @change="goodsSelectorChanged2" />
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
  </div>
</template>
<script>

import * as Validate from '@/utils/validate'
import GoodsSelector from '@/components/GoodsSelector'
import GoodsSelected from '@/components/GoodsSelected'
import SelectStoreTree from '@/components/SelectStoreTree'
import * as ApiFullreduce from '@/api/fullreduce'
import ApiProduct from '@/api/product'

const defaultRulesItem = {
  giftLimit: '',
  giftRule: 1, // 1件 2元
  id: '',
  discount: '',
  isOpenGift: false, // 是否送赠品
  giftIds: [],
  price: '',
  usePrice: ''
}

export default {
  name: 'FullReduceAdd',
  components: {
    SelectStoreTree,
    GoodsSelector,
    GoodsSelected
  },
  data () {
    return {
      specIds: [],
      form: {
        storeList: [],
        activeGoods: 1,
        beginTime: '',
        endTime: '',
        expressFree: 1,
        id: '',
        name: '',
        productList: [],
        discountType: 1, // 1订单优惠 2商品优惠
        type: 2, // 1减现金 2打折 3送赠品 4一口价 5第N件打折
        unit: 1, // 1元 2件
        rules: [{ ...defaultRulesItem }],
        time: []
      },
      formRules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        time: [
          { required: true, message: '请选择起止时间', trigger: 'blur' }
        ],
        rules: {
          usePrice: [
            { required: true, message: '请输入优惠门槛', trigger: 'change' },
            { validator: Validate.money, trigger: 'change' }
          ],
          usePrice2: [
            { required: true, message: '请输入优惠门槛', trigger: 'change' },
            { validator: Validate.positiveNumber, trigger: 'change' }
          ],
          price: [
            // 请输入金额，若为满赠则输入0即可
            { required: true, message: '请输入金额', trigger: 'change' },
            { validator: Validate.money, trigger: 'change' }
          ],
          discount: [
            { required: true, message: '请输入折扣', trigger: 'change' },
            { validator: Validate.money, trigger: 'change' }
          ],
          giftIds: [
            { required: true, message: '请添加赠品', trigger: 'change' }
          ],
          giftLimit: [
            { required: true, message: '请输入限领条件', trigger: 'blur' },
            { validator: Validate.positiveNumber, trigger: 'blur' }
          ],
          giftLimit2: [
            { required: true, message: '请输入限额条件', trigger: 'blur' },
            { validator: Validate.money, trigger: 'blur' }
          ]
        }
      },
      tableData: [],
      currentPage: 1,
      total: 0,
      pageSize: 10,
      showGoodsSelected: false,
      goodsSelectedData: [],
      showGoodsSelector: false,
      loading: false,
      showGoodsSelector2: false,
      rulesCurrent: 0,
      rulesGoods: [],
      see: false,
      type: '', // copy
      defaultTrue: 1,
      isShowStore: false,
      saveIng: false
    }
  },
  computed: {
    productIds () {
      return this.form.productList.map((item) => item.productId)
    },
    storeListLength () {
      return this.form.storeList.filter(v => v.type === 0).length
    },
    rulesId () {
      const ids = this.form.rules[this.rulesCurrent].giftIds
      return ids || []
    }
  },
  created () {
    const id = this.$route.query.id || ''
    this.type = this.$route.query.type || ''
    this.see = Boolean(this.$route.query.see) || false
    this.form.id = id
    id && this.getInfo()
  },
  methods: {
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
        pageNum: this.currentPage,
        pageSize: this.pageSize
      }).then(({ data }) => {
        this.total = data.totalCount || 0
        this.tableData = data.dataList || []
        this.tableData.forEach((item) => this.getProductDetail(item.id, item))
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
        const _index = this.productIds.indexOf(id)
        _index > -1 && this.form.productList.splice(_index, 1)
        this.$message({ type: 'success', message: '删除成功' })
        this.pageChange(1)
      }).catch(() => { })
    },
    changeType () {
      if (+this.form.type === 4 || +this.form.type === 1 || +this.form.type === 5) {
        this.form.unit = 2
      }
      this.form.rules = [{ ...defaultRulesItem }]
    },
    changeUnit () {
      this.form.rules.forEach((item) => {
        item.usePrice = ''
      })
    },
    changeGift (index) {
      this.form.rules[index].giftLimit = ''
    },
    addRules () {
      this.form.rules.push({ ...defaultRulesItem })
    },
    delRules (index) {
      this.form.rules.splice(index, 1)
    },
    submit () {
      this.$refs['form'].validate((valid) => {
        if (!valid) return
        this.saveIng = true
        this.form.beginTime = this.form.time[0] || ''
        this.form.endTime = this.form.time[1] || ''
        ApiFullreduce.save(this.form).then(({ code, message }) => {
          this.$message({ type: (code === 'SUCCESS' ? 'success' : 'error'), message: message })
          code === 'SUCCESS' && this.$router.go(-1)
          this.saveIng = false
        }, () => { this.saveIng = false })
      })
    },
    confirmCheckedStore (data) {
      this.form.storeList = data
    },
    selectGoods (index) {
      if (this.see) {
        this.goodsSelectedData = this.form.rules[index].giftIds
        this.showGoodsSelected = true
        return
      }
      this.showGoodsSelector2 = true
      this.rulesCurrent = index
    },
    goodsSelectorChanged2 ({ data }) {
      this.$refs['form'].clearValidate()
      this.form.rules[this.rulesCurrent].giftIds = data
    },
    getInfo () {
      ApiFullreduce.info({ discountId: this.form.id }).then(({ data }) => {
        data.time = [data.beginTime, data.endTime]
        data.rules = data.rules.map((item) => {
          // discountType: 1, // 1订单优惠 2商品优惠
          //   type: 2, // 1减现金 2打折 3送赠品 4一口价
          //   unit: 1, // 1元 2件

          if ((data.type === 2 && data.unit === 2) || data.type === 4 || data.type === 1 || data.type === 5) item.usePrice = parseInt(item.usePrice)
          if (item.giftRule <= 1) item.giftLimit = parseInt(item.giftLimit)
          // item.isOpenGift = Boolean(item.giftIds)

          return item
        })
        if (this.type === 'copy') {
          data.id = ''
          data.time = ''
          data.name = ''
          data.beginTime = ''
          data.endTime = ''
          data.rules.forEach((item) => { item.id = '' })
        }
        this.form = Object.assign(this.form, data)
        if (this.form.productList && this.form.productList.length > 0) {
          this.getProductList()
        }
      })
    }
  }
}
</script>

<style lang="scss">
  .page-add-fullreduce {
    .type-grey {
      color: $--color-text-secondary;
    }

    .el-form-item__content {
      font-size: 12px;
    }

    .condition-wrap {
      .condition-item {
        border-bottom: 1px solid #ebeef5;
        display: -webkit-box;
        margin-bottom: 20px;
        position: relative;

        .hierarchy {
          width: 60px;
          text-align: center;
          line-height: 38px;
          font-size: 14px;
        }
        &.condition-header {
          line-height: 28px;
          font-size: 14px;
          font-weight: bold;
          padding-bottom: 10px;

          .threshold, .mode {
            width: 250px;
            text-align: center;
          }
        }

        .del {
          position: absolute;
          right: 5px;
          top: 0;
        }
      }
    }
  }
</style>
