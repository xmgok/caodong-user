<template>
  <div class="page-add-activity">

    <el-form
      ref="form"
      :model="form"
      :rules="formRules"
      class="form"
      label-width="100px">
      <el-card>
        <div slot="header">活动详情</div>
        <el-form-item
          ref="topImgForm"
          label="活动入口"
          prop="topImg">
          <el-checkbox
            :disabled="see"
            v-model="form.isTop"
            :true-label="1"
            :false-label="0">首页弹窗
          </el-checkbox>
          <div
            class="ui-img-uploader"
            @click="materialSelector('topImg')">
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
        <el-form-item
          ref="activeImgForm"
          label="活动详情图"
          prop="activeImg">
          <div
            class="ui-img-uploader"
            @click="materialSelector('activeImg')">
            <img
              v-if="form.activeImg"
              :src="form.activeImg"
              class="img">
            <p
              v-else
              class="ui-img-uploader-plus"><i class="icons el-icon-plus" /> 添加图片</p>
          </div>
          <p class="ui-color3">建议尺寸为 600 x 600 像素</p>
        </el-form-item>
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
          label="活动时间"
          prop="time">
          <el-date-picker
            :disabled="see"
            v-model="form.time"
            :default-time="['00:00:00', '23:59:59']"
            :picker-options="pickerOptionsStart"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期" />
        </el-form-item>
        <el-form-item
          class="w500"
          label="活动规则">
          <el-input
            :disabled="see"
            :autosize="{ minRows: 2}"
            v-model="form.activeRule"
            type="textarea"
            placeholder="可输入兑奖时间、兑奖条件、兑奖地址等文字说明" />
        </el-form-item>
      </el-card>

      <el-card class="mt10">
        <div slot="header">活动奖励<span class="ui-color3">（仅能设置一个抽奖）</span></div>
        <el-table
          :data="form.rewards"
          style="width: 100%">
          <el-table-column
            prop="date"
            align="center"
            label="奖励类型"
            width="200">
            <template slot-scope="scope">
              <el-select
                :disabled="see"
                v-model="scope.row.type"
                placeholder="请选择"
                @change="changeType(scope.$index)">
                <el-option
                  :value="1"
                  label="优惠券" />
                <el-option
                  :value="2"
                  label="赠品" />
                <el-option
                  :disabled="luckDrawDisabled"
                  :value="3"
                  label="抽奖" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="name"
            label="奖励详情">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.rewardId"
                icon="el-icon-edit-outline"
                type="text"
                size="small"
                @click="editReward(scope.$index)">{{ scope.row.rewardName }}
              </el-button>
              <el-button
                v-else-if="scope.row.rewards.length > 0"
                icon="el-icon-edit-outline"
                type="text"
                size="small"
                @click="editReward(scope.$index)">已添加奖励
              </el-button>
              <el-button
                v-else
                icon="el-icon-plus"
                type="text"
                size="small"
                @click="editReward(scope.$index)">添加奖励
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            width="180"
            label="数量"
            align="center">
            <template slot-scope="scope">
              <el-form-item
                v-if="scope.row.type <=2"
                :prop="'rewards.' + scope.$index + '.rewardNumber'"
                :rules="formRules.rewardNumber"
                label-width="0"
                style="margin-bottom: 0">
                <el-input
                  :disabled="see"
                  v-model="scope.row.rewardNumber"
                  class="w100" />
              </el-form-item>
              <p v-else> - - </p>
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
                @click="delReward(scope.$index)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          v-if="!see"
          class="mt10"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="addReward">添加奖励
        </el-button>
      </el-card>

      <el-card class="mt10">
        <div slot="header">活动分享</div>
        <el-form-item
          prop="shareTitle"
          label="分享标题"
          class="w500">
          <el-input
            :disabled="see"
            v-model="form.shareTitle" />
        </el-form-item>
        <el-form-item
          ref="shareImgForm"
          label="分享封面"
          prop="shareImg">
          <div
            class="ui-img-uploader"
            @click="materialSelector('shareImg')">
            <img
              v-if="form.shareImg"
              :src="form.shareImg"
              class="img">
            <p
              v-else
              class="ui-img-uploader-plus"><i class="icons el-icon-plus" /> 添加图片</p>
          </div>
          <p class="ui-color3">建议尺寸为 600 x 480 像素</p>
        </el-form-item>
        <el-form-item
          prop="shareDesc"
          class="w500"
          label="分享描述">
          <el-input
            :disabled="see"
            :autosize="{ minRows: 2}"
            v-model="form.shareDesc"
            type="textarea"
            placeholder="" />
        </el-form-item>
      </el-card>

      <el-card class="mt10">
        <div slot="header">参与条件</div>
        <el-radio-group
          v-model="form.type"
          :disabled="see"
        >
          <el-radio :label="1">无条件</el-radio>
          <el-radio :label="2">有条件</el-radio>
        </el-radio-group>
        <div
          v-if="form.type > 1"
          class="mt20"
          style="margin-left: 90px;">
          <el-form-item label-width="0">
            <el-row
              type="flex"
              align="middle">
              <el-checkbox
                :disabled="see"
                :true-label="1"
                :false-label="0"
                v-model="form.isInvite">
                邀请拉新
              </el-checkbox>
              <el-form-item
                v-if="form.isInvite > 0"
                prop="inviteNum"
                label-width="20px">
                邀请
                <el-input
                  :disabled="see"
                  v-model="form.inviteNum"
                  class="w100"
                  placeholder="输入人数" />
                个人填写个人信息
              </el-form-item>
            </el-row>
          </el-form-item>
          <el-form-item label-width="0">
            <el-checkbox
              :disabled="see"
              :true-label="1"
              :false-label="0"
              v-model="form.isFill">填写信息（参与者姓名、参与者手机号）
            </el-checkbox>
            <div class="fill-condition">
              <div>
                <el-checkbox
                  :disabled="!form.isFill || see"
                  v-model="form.fillExtend.address">收货信息
                </el-checkbox>
              </div>
              <div>
                <el-checkbox
                  :disabled="!form.isFill || see"
                  v-model="form.fillExtend.IDCard">身份证
                </el-checkbox>
              </div>
              <div>
                <el-checkbox
                  :disabled="!form.isFill || see"
                  v-model="form.fillExtend.awardStore">选择领奖门店
                </el-checkbox>
                <el-button
                  type="text"
                  size="mini"
                  class="ml10"
                  @click="isShowAwardStore = true">
                  <template v-if="awardStoreListLength > 0">
                    已选{{ awardStoreListLength }}家门店
                  </template>
                  <template v-else>
                    选择门店
                  </template>
                </el-button>
              </div>
              <div>
                <el-checkbox
                  :disabled="!form.isFill || see"
                  v-model="form.fillExtend.custom">自定义信息
                </el-checkbox>
                <el-input
                  :disabled="!form.isFill || see"
                  v-model="form.fillExtend.customTitle"
                  class="w200 ml20"
                  size="small"
                  placeholder="" />
              </div>
            </div>
          </el-form-item>
          <el-form-item label-width="0">
            <el-row
              type="flex"
              align="middle">
              <el-checkbox
                :disabled="see"
                :true-label="1"
                :false-label="0"
                v-model="form.isPay">支付
              </el-checkbox>
              <el-form-item
                v-if="form.isPay > 0"
                prop="payPrice"
                label-width="20px"
              >
                价格￥
                <el-input
                  :disabled="see"
                  v-model="form.payPrice"
                  class="w100"
                  placeholder="" />
                元
              </el-form-item>
            </el-row>
          </el-form-item>
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
    <goods-selector
      v-if="showGoodsSelector"
      :visible.sync="showGoodsSelector"
      :manual-data="goodsSelector"
      :hide-condition="true"
      :multiple="false"
      type="manual"
      @change="goodsSelectorChanged" />
    <coupon-selector
      v-if="showCouponSelector"
      :visible.sync="showCouponSelector"
      :multiple="false"
      :default-data="couponSelector"
      @change="couponSelectorChanged" />
    <!--门店选择，多选-->
    <select-store-tree
      :is-disabled-all="see"
      :visible.sync="isShowStore"
      :default-value="form.storeList"
      @confirm="confirmCheckedStore"
    />
    <!--领奖门店选择，多选-->
    <select-store-tree
      :is-disabled-all="see"
      :visible.sync="isShowAwardStore"
      :default-value="form.awardStoreList"
      @confirm="confirmAwardCheckedStore"
    />
    <material-selector
      :when-show-clear-selected="true"
      :visible.sync="showMaterialSelector"
      :is-multi="false"
      @change="materialSelectorChanged" />
    <!--:default-data="couponSelector"-->
    <luck-draw
      v-if="showLuckDraw"
      :visible.sync="showLuckDraw"
      :default-value="luckDrawData"
      @change="luckDrawChanged" />
  </div>
</template>
<script>
import MaterialSelector from '@/components/MaterialSelector'
import GoodsSelector from '@/components/GoodsSelector'
import CouponSelector from '@/components/CouponSelector'
import SelectStoreTree from '@/components/SelectStoreTree'
import LuckDraw from './components/LuckDraw'
import ApiProduct from '@/api/product'
import * as Validate from '@/utils/validate'
import * as ApiActivity from '@/api/activity'

const defaultReward = {
  rewardId: '', // 优惠券id/赠品id ,
  rewardImg: '', // 奖励图片
  rewardName: '', // 奖励名称 ,
  rewardNumber: '', // 奖励数量 ,
  rewardPrice: '', // 奖励价格 ,
  // 抽奖奖励 ,
  rewards: [
    // {
    //   levelImg: '', // 等级图片，传空
    //   levelName: '', // 等级名称，传空
    //   rewardId: '', // 优惠券id/赠品id ,
    //   rewardImg: '', // 奖励图片
    //   rewardName: '', // 奖励名称 ,
    //   rewardNumber: '', // 奖励数量 ,
    //   rewardPrice: 0, // 奖励价格 ,
    //   type: 2 // 奖励类型 1优惠券 2赠品 3抽奖
    // }
  ],
  type: 1 // 奖励类型 1优惠券 2赠品 3抽奖
}

export default {
  name: 'ActivityAdd',
  components: {
    MaterialSelector,
    SelectStoreTree,
    GoodsSelector,
    CouponSelector,
    LuckDraw
  },
  data () {
    return {
      currentMaterialSelector: '',
      showMaterialSelector: false,
      currentGoodsSelector: '',
      showGoodsSelector: false,
      currentCouponSelector: '',
      showCouponSelector: false,
      showLuckDraw: false,
      form: {
        id: 0,
        isTop: 0, // 首页弹窗 0否 1是 ,
        topImg: '', // 弹窗图片地址
        activeImg: '', // 活动详情图地址
        name: '', // 活动名称
        time: [],
        beginTime: '', // 开始时间
        endTime: '', // 结束时间
        activeRule: '', // 活动规则
        // 活动奖励
        rewards: [
          /*
          {
            rewardId: '', // 优惠券id/赠品id ,
            rewardImg: '', // 奖励图片
            rewardName: '', // 奖励名称 ,
            rewardNumber: '', // 奖励数量 ,
            rewardPrice: '', // 奖励价格 ,
            // 抽奖奖励 ,
            rewards: [
              {
                levelImg: '', // 等级图片，传空
                levelName: '', // 等级名称，传空
                rewardId: '', // 优惠券id/赠品id ,
                rewardImg: '', // 奖励图片
                rewardName: '', // 奖励名称 ,
                rewardNumber: '', // 奖励数量 ,
                rewardPrice: 0, // 奖励价格 ,
                type: 2 // 奖励类型 1优惠券 2赠品 3抽奖
              }
            ],
            type: 1 // 奖励类型 1优惠券 2赠品 3抽奖
          }
*/
        ],
        shareTitle: '', // 分享标题 ,
        shareImg: '', // 分享封面地址 ,
        shareDesc: '', // 分享描述
        type: 2, // 参与条件 1无条件 2有条件
        isInvite: 0, // 是否邀请拉新 0否 1是 ,
        inviteNum: '', // 邀请人数
        isFill: 0, // 是否留资 0否 1是
        isPay: 0, // 是否支付 0否 1是 ,
        payPrice: '', // 支付价格
        isQrcode: 0, // 是否有公众号图片 0否 1是 ,
        qrCode: '', // 公众号图片
        // 适用门店
        storeList: [],
        awardStoreList: [], // 领奖门店
        // 填写信息表单展示字段
        fillExtend: {
          address: false, // 收货地址
          IDCard: false, // 身份证号
          awardStore: false, // 领奖门店
          custom: false, // 自定义信息
          customTitle: '' // 自定义信息标题
        }
      },
      formRules: {
        topImg: [
          { required: true, message: '请上传活动入口图片', trigger: 'blur' }
        ],
        activeImg: [
          { required: true, message: '请上传活动详情图', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ],
        time: [
          { required: true, message: '请选择活动起止时间', trigger: 'blur' }
        ],
        shareTitle: [
          { required: true, message: '请输入分享标题', trigger: 'blur' }
        ],
        shareImg: [
          { required: true, message: '请输入分享图片', trigger: 'blur' }
        ],
        shareDesc: [
          { required: true, message: '请输入分享描述', trigger: 'blur' }
        ],
        inviteNum: [
          { required: true, message: '请输入邀请人数', trigger: 'blur' },
          {
            validator: (rule, value, callback) => Validate.limitNumber(rule, value, callback, { min: 1 }),
            trigger: 'blur'
          }
        ],
        payPrice: [
          { required: true, message: '请输入支付价格', trigger: 'blur' },
          { validator: (rule, value, callback) => Validate.min0(rule, value, callback, { min: 1 }), trigger: 'blur' }
        ],
        rewardNumber: [
          { required: true, message: '请输入奖励数量', trigger: 'blur' },
          {
            validator: (rule, value, callback) => Validate.limitNumber(rule, value, callback, { min: 1 }),
            trigger: 'blur'
          }
        ]
      },
      saveIng: false,
      isShowStore: false,
      isShowAwardStore: false,
      loading: false,
      see: false,
      type: '', // copy
      luckDrawData: [],
      qrCode: '',
      pickerOptionsStart: {
        disabledDate (time) {
          // 不能限制到当前时分秒，否则用户无法选择
          return time.getTime() < new Date(new Date().toLocaleDateString()).getTime()
        }
      }
    }
  },
  computed: {
    goodsSelector () {
      const id = this.form.rewards[this.currentGoodsSelector].rewardId || ''
      return id ? [id] : []
    },
    couponSelector () {
      const id = this.form.rewards[this.currentCouponSelector].rewardId || ''
      return id ? [id] : []
    },
    luckDrawDisabled () {
      const luckDraw = this.form.rewards.filter((item) => item.type >= 3)
      return luckDraw.length > 0
    },
    storeListLength () {
      return this.form.storeList.filter(v => v.type === 0).length
    },
    awardStoreListLength () {
      return this.form.awardStoreList.filter(v => v.type === 0).length
    }
  },
  created () {
    const id = this.$route.query.id || ''
    this.type = this.$route.query.type || ''
    this.see = Boolean(this.$route.query.see) || false
    this.form.id = id
    id && this.getInfo()
  },
  mounted () {
  },
  methods: {
    materialSelector (type) {
      if (this.see) return
      this.currentMaterialSelector = type
      this.showMaterialSelector = true
    },
    materialSelectorChanged (val) {
      const imgUrl = val[0] && val[0].imgUrl
      this.form[this.currentMaterialSelector] = imgUrl
      this.$refs[`${this.currentMaterialSelector}Form`].clearValidate()
      this.currentMaterialSelector = ''
      this.showMaterialSelector = false
    },
    addReward () {
      this.form.rewards.push({ ...defaultReward })
    },
    delReward (index) {
      this.form.rewards.splice(index, 1)
    },
    changeType (index) {
      let rewards = [].concat(this.form.rewards)
      const type = rewards[index].type
      rewards[index] = { ...defaultReward }
      rewards[index].type = type
      this.form.rewards = rewards
    },
    editReward (index) {
      if (this.see) return
      const type = ['', 'Coupon', 'Goods', 'luckDraw'][this.form.rewards[index].type]
      if (type === 'luckDraw') {
        const xx = this.form.rewards.filter((item) => Number(item.type) === 3)
        this.luckDrawData = xx[0].rewards
        this.showLuckDraw = true
        return
      }
      this[`show${type}Selector`] = true
      this[`current${type}Selector`] = index
    },
    goodsSelectorChanged ({ data }) {
      this.$refs['form'].clearValidate()
      ApiProduct.productCouponlist({ pids: data[0], pageNum: 1, pageSize: 10 }).then(({ data }) => {
        data = data.dataList[0]
        let item = this.form.rewards[this.currentGoodsSelector]
        item.rewardId = data.id
        item.rewardImg = data.imgUrl
        item.rewardName = data.name
        item.rewardNumber = data.inventory
        item.rewardPrice = data.price
      })
    },
    couponSelectorChanged (data) {
      if (data.length <= 0) return
      data = data[0]
      let item = this.form.rewards[this.currentCouponSelector]
      item.rewardId = data.id
      item.rewardNumber = data.total
      item.rewardName = data.name
    },
    luckDrawChanged (data) {
      this.showLuckDraw = false
      this.form.rewards.forEach((item) => {
        if (Number(item.type) !== 3) return
        item.rewards = data
      })
    },
    confirmCheckedStore (data) {
      this.form.storeList = data
    },
    confirmAwardCheckedStore (data) {
      this.form.awardStoreList = data
    },
    submit () {
      this.$refs['form'].validate((valid) => {
        if (!valid) return

        // 参与条件扩展字段校验
        const fillExtend = this.form.fillExtend
        if (fillExtend) {
          if (fillExtend.awardStore && this.awardStoreListLength === 0) {
            this.$message.warning('请选择领奖门店')
            return
          }
          if (fillExtend.custom && !fillExtend.customTitle) {
            this.$message.warning('请输入自定义信息名')
            return
          }
        }

        this.saveIng = true
        this.form.beginTime = this.form.time[0] || ''
        this.form.endTime = this.form.time[1] || ''
        ApiActivity.save({
          ...this.form,
          fillExtend: JSON.stringify({
            ...this.form.fillExtend,
            storeIds: this.form.awardStoreList.map(item => item.id)
          })
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
    },
    getInfo () {
      ApiActivity.getInfo({ id: this.form.id }).then(({ data }) => {
        data.time = [data.beginTime, data.endTime]
        console.log(data)

        // 留资扩展字段
        if (data.fillExtend) {
          try {
            data.fillExtend = JSON.parse(data.fillExtend)
            this.form.awardStoreList = data.fillExtend.storeIds.map(id => ({ type: 0, id })) || []
          } catch (e) {}
        }

        if (this.type === 'copy') {
          data.id = ''
          data.time = ''
          data.name = ''
          data.beginTime = ''
          data.endTime = ''
          data.rewards.forEach((item) => { item.id = '' })
        }
        this.form = Object.assign(this.form, data)
      })
    }
  }
}
</script>

<style lang="scss">
  .page-add-activity {
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
          width: 150px;
          text-align: center;
          line-height: 38px;
          font-size: 14px;
        }

        .threshold {
          width: 300px;
        }

        &.condition-header {
          line-height: 38px;
          font-size: 14px;
          font-weight: bold;
          padding-bottom: 10px;

          .threshold, .mode {
            width: 280px;
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

    .fill-condition {
      padding-left: 25px;
    }
  }
</style>
