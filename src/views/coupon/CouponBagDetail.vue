<template>
  <div class="page-add-coupon">

    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      class="form"
      label-width="100px">
      <el-card>
        <div slot="header">券包信息</div>
        <div>
          <el-form-item
            prop="name"
            label="券包名称"
            class="w500">
            <el-input
              :disabled="see"
              v-model="form.name"
              :maxlength="8">
              <template slot="append">{{ form.name.length }}/8</template>
            </el-input>
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
                      <template slot="append">次</template>
                    </el-input>
                  </el-form-item>
                </div>
              </template>
            </div>
          </el-form-item>
          <el-form-item label="优惠券">
            <div>
              <el-button
                v-if="!see"
                :loading="loading"
                size="mini"
                type="primary"
                icon="el-icon-plus"
                @click="showCouponSelector = true">添加优惠券
              </el-button>
              <el-table
                :data="tableData"
                max-height="500"
                class="mt10 el-table--reset">
                <el-table-column
                  :show-overflow-tooltip="true"
                  prop="name"
                  label="优惠券名称"
                  width="150" />
                <el-table-column
                  :show-overflow-tooltip="true"
                  prop="price"
                  label="优惠金额"
                  align="center" />
                <el-table-column
                  :show-overflow-tooltip="true"
                  label="优惠券类型"
                  align="center">
                  <template slot-scope="scope">
                    {{ couponList[scope.row.type] }}
                  </template>
                </el-table-column>
                <el-table-column
                  :show-overflow-tooltip="true"
                  prop="usePrice"
                  width="150"
                  label="使用条件"
                  align="center">
                  <template slot-scope="scope">
                    <template v-if="scope.row.useRule > 0">满{{ scope.row.usePrice }}元可使用</template>
                    <template v-else>无门槛使用</template>
                  </template>
                </el-table-column>
                <el-table-column
                  :show-overflow-tooltip="true"
                  label="优惠券总数"
                  align="center">
                  <template slot-scope="scope">
                    {{ scope.row.total }}
                  </template>
                </el-table-column>
                <el-table-column
                  :show-overflow-tooltip="true"
                  label="有效期"
                  width="320"
                  align="center">
                  <template slot-scope="scope">
                    <template v-if="scope.row.useTime===1">{{ scope.row.beginTime }} - {{ scope.row.endTime }}</template>
                    <template v-if="scope.row.useTime===2">领取后{{ scope.row.laterDay }}日内有效</template>
                  </template>
                </el-table-column>
                <el-table-column
                  :show-overflow-tooltip="true"
                  label="券包内含优惠券数量"
                  width="160"
                  align="center">
                  <template slot-scope="scope">
                    <el-form-item
                      :prop="'couponList.' + scope.$index + '.number'"
                      :rules="rules.couponNumber"
                    >
                      <el-input
                        :disabled="see"
                        v-model="scope.row.number"
                        size="small"
                        placeholder="请输入"
                        class="w140">
                        <div slot="append">张</div>
                      </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-form-item>
        </div>
      </el-card>

      <el-card class="mt10">
        <div slot="header">券包分享</div>
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
        <el-form-item
          prop="storeList"
          label="适用门店">
          <template v-if="storeListLength>0">已选{{ storeListLength }}家门店</template>

          <!--已选门店可查看，所以不允许被禁用-->
          <el-button
            type="text"
            size="mini"
            @click="isShowStore=true">
            {{ storeListLength>0?'修改':'添加' }}门店
          </el-button>
        </el-form-item>
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
    <!--转发优惠券-->
    <coupon-selector
      v-if="showCouponSelector"
      :type="4"
      :visible.sync="showCouponSelector"
      :multiple="true"
      :default-data="couponSelector"
      @change="couponSelectorChanged" />
  </div>
</template>

<script>
import { CouponTypes } from '@/config/const'
import * as Validate from '@/utils/validate'
import CouponSelector from '@/components/CouponSelector'
import GoodsSelector from '@/components/GoodsSelector'
import SelectStoreTree from '@/components/SelectStoreTree'
import MaterialSelector from '@/components/MaterialSelector'
import * as ApiCoupon from '@/api/coupon'
import * as ApiCouponBag from '@/api/coupon-bag'

export default {
  name: 'CouponBagDetail',
  components: {
    CouponSelector,
    GoodsSelector,
    SelectStoreTree,
    MaterialSelector
  },
  data () {
    return {
      couponList: {
        ...CouponTypes
      },
      showCouponSelector: false,
      showMaterialSelector: false,
      isShowStore: false,
      saveIng: false,
      form: {
        couponList: [],
        shareImg: '',
        shareDesc: '',
        id: '',
        name: '',
        time2: [],
        receiveRule: 0,
        receiveTotal: '',
        endTime: '',
        beginTime: '',
        storeList: []
      },
      rules: {
        storeList: [{ required: true, message: '本项必填', trigger: 'blur' }],
        shareImg: [{ required: true, message: '本项必填' }],
        shareDesc: [{ required: true, message: '本项必填' }],
        couponNumber: [
          { required: true, message: '请输入数量', trigger: 'blur' },
          {
            validator: (rule, value, callback) => Validate.limitNumber(rule, value, callback, { min: 1 }),
            trigger: 'blur'
          }
        ],
        name: [
          { required: true, message: '请输入券包名称', trigger: 'blur' }
        ],
        time2: [
          { required: true, message: '请选择领取时间', trigger: 'blur' }
        ],
        receiveTotal: [
          { required: true, message: '请输入可以领取的数量', trigger: 'blur' },
          { validator: Validate.positiveNumber, trigger: 'blur' }
        ]
      },
      tableData: [],

      loading: false,
      see: false
    }
  },
  computed: {
    couponSelector () {
      return this.form.couponList.map((item) => item.couponId)
    },
    storeListLength () {
      return this.form.storeList.filter(v => v.type === 0).length
    }
  },
  watch: {
    tableData: {
      handler (newVal) {
        this.form.couponList.forEach(v => {
          const obj = newVal.find(v2 => +v2.id === +v.couponId) || {}
          v.number = obj.number || ''
        })
      },
      deep: true
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
      this.$refs['form'].validateField(['storeList'])
    },
    submit () {
      this.$refs['form'].validate((valid) => {
        if (!valid) return
        this.saveIng = true
        this.form.beginTime = this.form.time2[0] || ''
        this.form.endTime = this.form.time2[1] || ''
        ApiCouponBag.save(this.form).then(({ code, message }) => {
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
    del (id, index) {
      this.$confirm('确定删除该商品吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tableData.splice(index, 1)
        const _index = this.form.couponList.indexOf(id)
        if (_index > -1) {
          this.form.couponList.splice(_index, 1)
        }
        this.$message({ type: 'success', message: '删除成功' })
      }).catch(() => {
      })
    },
    couponSelectorChanged (data) {
      console.log(data)
      data.forEach(v => {
        v.number = ''
      })
      this.form.couponList = data.map((item) => ({ couponId: item.id, number: item.number }))
      this.tableData = data
    },
    getCouponInfo () {
      ApiCouponBag.info({ id: this.form.id }).then(({ data }) => {
        data.time2 = [data.beginTime, data.endTime]
        this.form = Object.assign(this.form, data)
        if (this.couponSelector.length > 0) {
          ApiCoupon.list({
            ids: this.couponSelector.join(','),
            pageNum: 1,
            pageSize: this.couponSelector.length
          }).then(({ data }) => {
            data.dataList.forEach(v => {
              v.number = this.form.couponList.find(v2 => v2.couponId === v.id).number || ''
            })
            this.tableData = data.dataList
          })
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

  .el-table--reset {
    /deep/ .cell {
      overflow: visible;
    }
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
