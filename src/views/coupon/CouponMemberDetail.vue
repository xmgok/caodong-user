<template>
  <div class="page-coupon-member-detail">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      class="form"
      label-width="100px">
      <el-card>
        <div slot="header">基础信息</div>
        <div>
          <el-form-item
            prop="name"
            label="任务名称"
            class="w500">
            <el-input
              :disabled="see"
              v-model="form.name"
              :maxlength="30">
              <template slot="append">{{ form.name.length }}/30</template>
            </el-input>
          </el-form-item>
          <el-form-item label="发放时间" >
            <div style="display: -webkit-box; -webkit-box-align: center">
              <el-radio-group v-model="form.issueType">
                <el-radio
                  :label="1"
                  :disabled="see">立即发放
                </el-radio>
                <el-radio
                  :label="2"
                  :disabled="see">定时发放
                </el-radio>
              </el-radio-group>
              <template v-if="form.issueType > 1">
                <div class="pl5 pr5">
                  <el-form-item prop="issueTime">
                    <el-date-picker
                      :disabled="see"
                      v-model="form.issueTime"
                      :picker-options="pickerOptions"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      type="datetime"
                      placeholder="选择日期时间"/>
                  </el-form-item>
                </div>
              </template>
            </div>
          </el-form-item>
        </div>
      </el-card>
      <el-card class="mt10">
        <div slot="header">选择会员</div>
        <div>
          <el-form-item
            label="发放会员"
            prop="issueObject">
            <el-input
              :disabled="see"
              v-model="form.issueObject"
              class="w500"
              rows="6"
              maxlength="500"
              placeholder="输入会员手机号,多个手机号间用英文逗号&quot;,&quot;隔开"
              type="textarea" />
            <div><span
              v-if="form.issueNumber"
              class="f12"
              style="color:red">发放人数{{ form.issueNumber }}人</span>
            <span class="grey f12 ml5">单次发放人数不可超过500人</span></div>
          </el-form-item>
        </div>
      </el-card>
      <el-card class="mt10">
        <div slot="header">选择优惠券</div>
        <div>
          <el-form-item >
            <div>
              <el-button
                v-if="!see"
                :loading="loading"
                :disabled="form._tableData.length >=10"
                size="mini"
                type="primary"
                icon="el-icon-plus"
                @click="showCouponSelector = true">添加优惠券
              </el-button>
              <span class="grey f12 ml5">最多选择10种优惠券</span>
              <el-table
                :data="form._tableData"
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
                    {{ CouponTypesList[scope.row.type] }}
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
                  label="发放优惠券数量"
                  width="160"
                  align="center">
                  <template slot-scope="scope">
                    <el-form-item
                      :prop="'_tableData.' + scope.$index + '.number'"
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
                <el-table-column
                  label="操作"
                  fixed="right"
                  width="80"
                  align="center">
                  <template slot-scope="scope">
                    <el-button
                      :disabled="see"
                      type="text"
                      size="small"
                      @click="couponDel(scope.$index,scope.row)">删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-form-item>
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
import CouponSelector from '@/components/CouponSelector'
import * as ApiCoupon from '@/api/coupon'
import { CouponTypes } from '@/config/const'
import * as Validate from '@/utils/validate'

export default {
  name: 'CouponMemberDetail',
  components: {
    CouponSelector
  },
  data () {
    return {
      CouponTypesList: {
        ...CouponTypes
      },
      form: {
        _tableData: [],
        name: '', // 任务名称
        issueType: 1, // 发放类型 1立即发送 2定时发送
        issueTime: '',
        issueObject: '',
        couponList: [],
        id: ''
      },
      rules: {
        couponNumber: [
          { required: true, message: '请输入数量', trigger: 'blur' },
          {
            validator: (rule, value, callback) => Validate.limitNumber(rule, value, callback, { min: 1 }),
            trigger: 'blur'
          }
        ],
        name: [
          { required: true, message: '请输入任务名称', trigger: 'blur' }
        ],
        issueTime: [
          { required: true, message: '请输入定时发放时间', trigger: 'blur' }
        ],
        issueObject: [
          { required: true,
            message: '请输入发放会员',
            trigger: 'blur'
          }
        ]

      },
      see: false,
      loading: false,
      showCouponSelector: false,
      saveIng: false
    }
  },
  computed: {
    couponSelector () {
      return this.form._tableData.map((item) => item.couponId || item.id)
    },
    pickerOptions () {
      return ({ disabledDate: time => time ? (time.getTime() < (this.form.issueTime.startDate ? new Date(this.form.issueTime.startDate) : new Date() - '8.64e7')) : false })
    }
  },
  created () {
    const id = this.$route.query.id || ''
    this.see = Boolean(this.$route.query.see) || false
    this.form.id = id
    id && this.getCouponInfo()
  },

  methods: {
    getCouponInfo () {
      ApiCoupon.couponIssueInfo({ id: this.form.id }).then(({ data }) => {
        this.form = Object.assign(this.form, data)
        data.couponIssueInfoDetailList = data.couponIssueInfoDetailList || []
        this.form._tableData = data.couponIssueInfoDetailList
        if (this.couponSelector.length > 0) {
          ApiCoupon.list({
            ids: this.couponSelector.join(','),
            pageNum: 1,
            pageSize: this.couponSelector.length
          }).then(({ data }) => {
            // 去重
            this.form._tableData = data.dataList.map(v => {
              const obj = this.form._tableData.find(v2 => v2.couponId === v.id) || {}
              return {
                ...v,
                ...obj
              }
            })
          })
        }
      })
    },
    couponSelectorChanged (data) {
      data.forEach(v => {
        v.number = ''
      })
      console.log(this.form._tableData, 'old')
      console.log(data, 'new')
      this.form._tableData = data.map(v => {
        const obj = this.form._tableData.find(v2 => v2.couponId === v.id || v2.id === v.id) || {}
        return {
          ...v,
          number: obj.number || ''
        }
      })
    },
    couponDel (idx, row) {
      this.form._tableData.splice(idx, 1)
    },
    submit () {
      this.$refs['form'].validate((valid) => {
        if (!valid) return
        this.saveIng = true
        const couponList = this.form._tableData.map(v => ({ number: v.number, couponId: v.couponId ? v.couponId : v.id }))
        ApiCoupon.couponIssueEditOrAdd({
          ...this.form,
          couponList
        }).then(({ code, message }) => {
          this.$message({ type: (code === 'SUCCESS' ? 'success' : 'error'), message: message })
          if (code === 'SUCCESS') {
            this.$router.go(-1)
          }
          this.saveIng = false
        }, () => {
          this.saveIng = false
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-table--reset {
    /deep/ .cell {
      overflow: visible;
      padding: 10px 0;
    }
  }
</style>
