<template>
  <div class="page-seller">
    <el-card class="mt10">
      <div slot="header">分销详情</div>
      <el-form
        ref="form"
        :rules="rules"
        :model="form"
        class="form"
        label-width="160px">
        <el-form-item
          label="启用分销：">
          <el-radio-group
            v-model="form.visible"
            :disabled="see">
            <el-radio
              :label="true">启用
            </el-radio>
            <el-radio
              :label="false">禁用
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          prop="dtype"
          label="分销类型：">
          <el-radio-group
            v-model="form.dtype"
            :disabled="dtypeIsDisabled"
            @change="dtypeChange">
            <el-radio
              :label="1">三级分销
            </el-radio>
            <el-radio
              :label="2">虚拟导购
              <span class="grey ml10">虚拟导购权限与门店导购相同</span>
              <span class="ui-color1 ml10">分销类型选定后，暂不支持修改</span>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="form.dtype!==2"
          key="store"
          prop="storeId"
          label="分销商所属门店：">
          <select-store
            :disabled="dtypeIsDisabled"
            :is-open-default-value="true"
            :default-store-id="form.storeId"
            :default-company-id="form.companyId"
            style="display: inline-block; margin-bottom: 10px; margin-left: -32px;"
            labelwidth="80px"
            selectwidth="250px"
            @change="changeSelectStore" />
          <span class="grey">所有分销商共享此门店的商品和库存</span>
          <span class="ui-color1 ml10">此项保存后不能更改</span>
        </el-form-item>
        <el-form-item
          label="申请分销商是否需要审核：">
          <el-radio-group
            v-model="form.verify"
            :disabled="see">
            <el-radio
              :label="true">需要审核
            </el-radio>
            <el-radio
              :label="false">不需要审核
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="申请分销商条件：">
          <el-radio-group
            v-model="form.isNeedCondition"
            :disabled="see"
            @change="conditionChange">
            <el-radio
              :label="false">无条件
            </el-radio>
            <el-radio
              :label="true">有条件
            </el-radio>
          </el-radio-group>
          <div
            v-if="form.isNeedCondition===true"
            class="mb24 condition">
            <div class="mb24">
              <el-form-item
                prop="minAmount"
                label="需要购物满">
                <el-input
                  v-model="form.minAmount"
                  class="w80 ml5 mr5" />
                元
                <span class="grey ml10">不填或者填0表示不限制</span>
                <!--<el-checkbox
                  v-model="form.minAmountIsChecked"
                  :disabled="see">
                  <el-input
                    v-model="form.minAmount"
                    class="w80 ml5 mr5" />
                  元
                  <span class="grey ml10">不填或者填0表示不限制</span>
                </el-checkbox>-->
              </el-form-item>
            </div>
            <div class="mb24">
              <el-form-item
                prop="minOrderNumber"
                label="需要下单满">
                <el-input
                  v-model.number="form.minOrderNumber"
                  class="w80 ml5 mr5" />
                次
                <span class="grey ml10">不填或者填0表示不限制</span>
                <!--<el-checkbox
                  v-model="form.minOrderNumberIsChecked"
                  :disabled="see">
                  <el-input
                    v-model.number="form.minOrderNumber"
                    class="w80 ml5 mr5" />
                  次
                  <span class="grey ml10">不填或者填0表示不限制</span>
                </el-checkbox>-->
              </el-form-item>
            </div>
          </div>
        </el-form-item>
        <el-form-item
          v-if="form.dtype!==2"
          label="分销层级设置：">
          <el-select
            v-model="form.rank"
            class="mb10 w80"
            placeholder="请选择"
            @change="rankChange">
            <el-option
              :value="1"
              label="1" />
            <template v-if="form.dtype!==2">
              <el-option
                :value="2"
                label="2" />
              <el-option
                :value="3"
                label="3" />
            </template>
          </el-select>
          <span class="grey ml10">最高可设为3层</span>
        </el-form-item>
        <el-form-item
          v-if="form.dtype!==2"
          label="返佣类型设置：">
          <el-radio-group
            v-model="form.crtype"
            :disabled="see">
            <el-radio
              :label="1">按比例返佣（%） <span class="grey ml10">商品实付价×佣金比例</span>
            </el-radio>
            <el-radio
              :label="2">固定金额返佣（元） <span class="grey ml10">每件商品计算</span>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="form.dtype!==2"
          label="佣金设置：">
          <el-radio-group
            v-model="form.cutype"
            :disabled="see">
            <el-radio
              :label="1">所有商品统一佣金
            </el-radio>
            <el-radio
              :label="2">按商品设置佣金
            </el-radio>
          </el-radio-group>
          <div
            v-if="form.cutype===1"
            class="mb24 cutype0">
            <el-form-item
              v-for="(item,index) in form.rank"
              :key="item"
              :prop="'distriCommissions.'+ index + '.amount'"
              :rules="rules._amount1"
              :label="`${item}级分销佣金：`"
              :class="[index!==0?'mt24':'']">
              <el-input
                v-model="form.distriCommissions[item-1].amount"
                class="w80 mr5" />
              {{ form.crtype===1?'%':'元' }}
              <span class="grey ml10">不填或者填0表示不返佣金</span>
            </el-form-item>
          </div>
          <div
            v-if="form.cutype===2"
            class="mb24 cutype1">
            <el-button
              v-if="!see"
              size="mini"
              type="primary"
              icon="el-icon-plus"
              @click="addGoods">添加商品
            </el-button>
            <div>
              <div
                v-for="item in form.rank"
                :key="item"
                class="css_amount1 inline-block mb24 mt12">
                <el-form-item
                  :label="`${item}级佣金：`"
                  :prop="'_amount'+item"
                  class="inline-block">
                  <el-input
                    v-model="form['_amount'+item]"
                    class="w80 mr5" />
                  {{ form.crtype===1?'%':'元' }}
                </el-form-item>
              </div>
              <el-button
                v-if="!see"
                class="ml10"
                size="mini"
                type="primary"
                @click="fillCommission">批量填充
              </el-button>
              <span class="grey ml10">不填或者填0表示不返佣金</span>
            </div>
            <el-table
              :data="form._arrProdCommissions"
              class="mt10 reset-cell">
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
                prop="productCode"
                align="center"
                label="商品编号" />
              <el-table-column
                :show-overflow-tooltip="true"
                align="center"
                label="1级佣金">
                <template slot-scope="scope">
                  <el-form-item
                    :rules="rules._amount1"
                    :prop="'_arrProdCommissions.'+ scope.$index + '.amount1'"
                    class="inline-block">
                    <el-input
                      v-model="scope.row.amount1"
                      class="w80 mr5" />
                    {{ form.crtype===1?'%':'元' }}
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                v-if="form.rank>=2"
                :show-overflow-tooltip="true"
                align="center"
                label="2级佣金">
                <template slot-scope="scope">
                  <el-form-item
                    :rules="rules._amount2"
                    :prop="'_arrProdCommissions.'+ scope.$index + '.amount2'"
                    class="inline-block">
                    <el-input
                      v-model="scope.row.amount2"
                      class="w80 mr5" />
                    {{ form.crtype===1?'%':'元' }}
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                v-if="form.rank>=3"
                :show-overflow-tooltip="true"
                align="center"
                label="3级佣金">
                <template slot-scope="scope">
                  <el-form-item
                    :rules="rules._amount3"
                    :prop="'_arrProdCommissions.'+ scope.$index + '.amount3'"
                    class="inline-block">
                    <el-input
                      v-model="scope.row.amount3"
                      class="w80 mr5" />
                    {{ form.crtype===1?'%':'元' }}
                  </el-form-item>
                </template>
              </el-table-column>
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
        <el-form-item
          v-if="form.dtype!==2"
          prop="closeDay"
          label="何时返佣给分销商：">
          订单完成后
          <el-input
            v-model.number="form.closeDay"
            class="w80 ml5 mr5" />
          天返佣
          <span class="grey ml10">不填或者填0表示订单完成即返佣</span>
          <span class="grey ml10">（订单完成：顾客确认收货或者发货后系统自动默认完成）</span>
        </el-form-item>
        <el-form-item
          v-if="form.dtype!==2"
          prop="minWithDraw"
          label="最小提现金额：">
          <el-input
            v-model="form.minWithDraw"
            class="w80 mr5" />
          元
          <span class="grey ml10">不填或者填0表示不限制</span>
        </el-form-item>
      </el-form>
    </el-card>

    <div class="ui-edit-btn-wrapper">
      <el-button
        :loading="submitting"
        type="primary"
        @click="submit">保存
      </el-button>
    </div>

    <!--商品选择-->
    <goods-selector
      v-if="showGoodsSelector"
      :store-id="form.storeId"
      :visible.sync="showGoodsSelector"
      :manual-data="productIds"
      :hide-condition="hideCondition"
      type="manual"
      @change="goodsSelectorChanged" />
  </div>
</template>

<script>
import SelectStore from '@/components/SelectStore'
import GoodsSelector from '@/components/GoodsSelector'
import ApiProduct from '@/api/product'
import * as ApiSeller from '@/api/seller'
import * as Validate from '@/utils/validate'
import { mapGetters } from 'vuex'

export default {
  name: 'Seller',
  components: {
    SelectStore,
    GoodsSelector
  },
  data () {
    return {
      form: {
        id: null,
        visible: false, // 是否启用分销
        dtype: '', // 分销类型
        verify: false, // 申请分销商是否需要审核
        isNeedCondition: false, // 申请分销商条件 无条件 有条件
        minAmountIsChecked: false, // 购物满多少元是否被选中
        minAmount: '', // 购物满多少元
        minOrderNumberIsChecked: false, // 最少下单次数是否被选中
        minOrderNumber: '', // 最少下单次数
        rank: 3, // 返佣层级
        crtype: 1, // 返佣类型设置 按比例 按固定金额
        cutype: 1, // 佣金设置 全部商品 指定商品
        distriCommissions: [...Array(3)].map((v, i) => ({ rank: i + 1, amount: '' })), // 全部商品设置佣金
        prodCommissions: [], // 指定商品设置佣金
        closeDay: '', // 何时返佣给分销商
        minWithDraw: '', // 最小返佣金额
        companyId: '',
        storeId: '',

        _arrProdCommissions: [], // 指定商品设置佣金 - 渲染和交互时使用的此字段
        _amount1: '', // 批量设置1级佣金
        _amount2: '', // 批量设置2级佣金
        _amount3: '' // 批量设置3级佣金
      },
      rules: {
        integral: [{
          validator: (rule, value, callback) => {
            if (!/^[1-9]\d*$/.test(value)) callback(new Error('请输入正整数'))
            return callback()
          },
          trigger: 'blur'
        }],
        money: [{
          validator: (rule, value, callback) => {
            if (!/^[1-9]\d*$/.test(value)) callback(new Error('请输入正整数'))
            return callback()
          },
          trigger: 'blur'
        }],
        amount: [
          { required: true, message: '本项必填', trigger: 'blur' },
          { validator: Validate.money, trigger: 'blur' }
        ],
        minAmount: [{ validator: Validate.money, trigger: 'blur' }],
        minOrderNumber: [{ validator: Validate.number, trigger: 'blur' }],
        closeDay: [{ validator: Validate.number, trigger: 'blur' }],
        minWithDraw: [{ validator: Validate.money, trigger: 'blur' }],
        dtype: [{ required: true, message: '本项必选' }],
        companyId: [{ required: true, message: '本项必选' }],
        storeId: [{ required: true, message: '本项必选' }],

        _amount1: [
          { validator: Validate.money, trigger: 'blur' }
        ],
        _amount2: [
          { validator: Validate.money, trigger: 'blur' }
        ],
        _amount3: [
          { validator: Validate.money, trigger: 'blur' }
        ]
      },
      dtypeIsDisabled: false,
      see: false,
      submitting: false,

      currentPage: 1,
      total: 0,
      pageSize: 10,

      productIds: [],
      hideCondition: true,
      showGoodsSelector: false,

      objProdCommissions: {}
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  watch: {
    'form._arrProdCommissions' () {
      this.form._arrProdCommissions.forEach(v => {
        this.objProdCommissions[(v.productCode || v.prodCode)] = v
      })
    }
  },
  async mounted () {
    this.getDetail()
  },
  methods: {
    addGoods () {
      if (!this.form.storeId) {
        this.$message({ type: 'warning', message: '请选择分销门店' })
        return
      }
      this.showGoodsSelector = true
    },
    changeSelectStore (val) {
      this.form.storeId = val.storeId || ''
      this.form.companyId = val.companyId || ''
    },
    del (id, index) {
      this.$confirm('确定删除该商品吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const delItem = this.form._arrProdCommissions.splice(index, 1)
        const productCode = delItem[0].productCode
        delete this.objProdCommissions[productCode]
        const _index = this.productIds.indexOf(id)
        _index > -1 && this.productIds.splice(_index, 1)
        this.$message({ type: 'success', message: '删除成功' })
        this.pageChange(1)
      }).catch(() => {
      })
    },
    conditionChange (e) {
      if (!e) {
        this.form.minAmount = ''
        this.form.minOrderNumber = ''
      }
    },
    dtypeChange (e) {
      if (+e === 2) {
        this.form.rank = 1
      }
      // this.$refs['form'].validateField(['storeId'])
    },
    rankChange () {
      this.form.distriCommissions = [...Array(this.form.rank)].map((v, i) => ({ rank: i + 1, amount: '' }))
    },
    fillCommission () {
      this.$refs['form'].validateField(['_amount1', '_amount2', '_amount3'], (e) => {
        if (e) return
        Object.keys(this.objProdCommissions).forEach(key => {
          this.objProdCommissions[key].amount1 = this.form._amount1
          this.objProdCommissions[key].amount2 = this.form._amount2
          this.objProdCommissions[key].amount3 = this.form._amount3
        })
        this.form._arrProdCommissions.forEach(v => {
          v.amount1 = this.form._amount1
          v.amount2 = this.form._amount2
          v.amount3 = this.form._amount3
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
    async getProductList () {
      if (!this.productIds.length) return
      return ApiProduct.productCouponlist({
        pids: this.productIds.join(','),
        pageNum: this.currentPage,
        pageSize: this.pageSize
      }).then(({ data }) => {
        data.dataList = data.dataList || []
        data.dataList.forEach((v, i, a) => {
          v.amount1 = ''
          v.amount2 = ''
          v.amount3 = ''
          v.prodId = v.id
          v.prodName = v.name
          v.prodCode = v.productCode
          if (this.objProdCommissions[v.productCode]) {
            a[i] = {
              ...v,
              ...this.objProdCommissions[v.productCode]
            }
          } else {
            this.objProdCommissions[v.productCode] = v
          }
        })
        this.form._arrProdCommissions = data.dataList
        this.total = data.totalCount || 0
      })
    },
    goodsSelectorChanged ({ data }) {
      this.productIds = data
      this.getProductList()
    },
    async getDetail () {
      const res = await ApiSeller.getDistriSettingsMenu().catch(() => false)
      if (!res) return
      if (!res.data.dtype) {
        return
      }
      res.data._amount1 = ''
      res.data._amount2 = ''
      res.data._amount3 = ''
      res.data._arrProdCommissions = []
      res.data.prodCommissions.forEach(v => {
        v.amount1 = v.ranks[0].amount || ''
        v.amount2 = v.ranks[1] ? (v.ranks[1].amount || '') : ''
        v.amount3 = v.ranks[2] ? (v.ranks[2].amount || '') : ''
      })
      this.productIds = res.data.prodCommissions.map(v => v.prodId)
      res.data.prodCommissions.forEach(v => {
        this.objProdCommissions[v.prodCode] = v
      })
      if (this.productIds.length) {
        await this.getProductList()
        res.data._arrProdCommissions = this.form._arrProdCommissions
      }
      this.form = res.data
      if (res.data.dtype) {
        this.dtypeIsDisabled = true
      }
    },
    submit () {
      this.$refs.form.validate(async valid => {
        if (!valid) return
        if (!this.form.id) delete this.form.id
        // 过滤productIds。
        this.form.prodCommissions = Object.keys(this.objProdCommissions).map(key => this.objProdCommissions[key]).filter(v => ~this.productIds.indexOf((v.id || v.prodId))).map(v => {
          v.ranks = []
          for (let i = 0; i < this.form.rank; i++) {
            v.ranks.push({
              rank: i + 1,
              amount: v['amount' + (i + 1)]
            })
          }
          return v
        })
        this.submitting = true
        const res = await ApiSeller.saveDistriSettings(this.form).catch(() => (this.submitting = false))
        if (!res) return
        if (!this.form.id) { // 防止点击开启之后再点击保存带不上id
          await this.getDetail()
        }
        this.submitting = false

        this.$message.success('操作成功')
      })
    }
  }
}
</script>

<style lang="scss">
  .page-seller {
    font-size: 12px;

    .el-form-item__content {
      font-size: 12px;
    }

    .condition {
      margin-left: 0;
    }

    .cutype0 {
      margin-left: -68px; // 如果必填则设置为-57px
    }

    .cutype1 {
      /*margin-left: 151px;*/
    }

    .css_amount1 {
      margin-left: -90px;
      margin-right: 20px;
    }

    .add-goods {
      margin-left: -20px;
    }

    .reset-cell .cell {
      padding-bottom: 24px;
    }

    .inline-block {
      display: inline-block;
    }
  }
</style>
