<template>
  <div class="page-score">
    <el-card shadow="none">
      <div class="header">
        <div class="title">
          <div class="big">微信卡券设置</div>
          <div class="small">使用此功能前，需先开通微信公众号</div>
        </div>
        <el-switch
          v-model="form.status"
          :active-value="1"
          :inactive-value="0"
          @change="submit"
        />
      </div>
      <el-form
        ref="form"
        :rules="rules"
        :model="form"
        label-width="100px">
        <el-form-item
          prop="cardColour"
          label="卡券颜色"
          class="w500">
          <el-color-picker
            v-model="form.cardColour"
            :predefine="predefineColors"
            class="my-picker"
            @change="change" />
        </el-form-item>
        <el-form-item
          prop="shareDesc"
          label="图片简介"
          class="w500">
          <el-input
            v-model="form.shareDesc"
            :rows="3"
            maxlength="80"
            type="textarea" />
          <div>{{ form.shareDesc.length }}/80</div>
        </el-form-item>
        <el-form-item
          prop="shareImg"
          label="分享图片"
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
        <el-form-item
          prop="cardLogo"
          label="LOGO"
          class="w500">
          <div class="goods">
            <el-input
              v-show="false"
              v-model="form.cardLogo" />
            <img
              v-if="form.cardLogo"
              :src="form.cardLogo"
              alt=""
              class="goods-img"
              @click="chooseMaterial2">
            <div
              v-if="!form.cardLogo"
              class="el-upload el-upload--picture-card"
              @click="chooseMaterial2">
              <i class="el-icon-plus" />
            </div>
          </div>
          <p class="ui-color3">建议尺寸为 750 x 750 像素</p>
        </el-form-item>
      </el-form>
    </el-card>

    <div
      v-if="form.status"
      class="ui-edit-btn-wrapper">
      <el-button
        :loading="submitting"
        type="primary"
        @click="submit">保存
      </el-button>
    </div>
    <!--图片库-->
    <material-selector
      :is-multi="false"
      :visible.sync="showMaterialSelector"
      @change="(val) => materialSelectorChange(val)" />
    <!--图片库-->
    <material-selector
      :is-multi="false"
      :visible.sync="showMaterialSelector2"
      @change="(val) => materialSelectorChange2(val)" />
  </div>
</template>

<script>
import { WeChatCardBagColors } from '@/config/const'
import MaterialSelector from '@/components/MaterialSelector'
import * as ApiScore from '@/api/weChatCardBag'

export default {
  name: 'WeChatCardBag',
  components: {
    MaterialSelector
  },
  data () {
    return {
      predefineColors: WeChatCardBagColors,
      showMaterialSelector: false,
      showMaterialSelector2: false,
      form: {
        cardColour: WeChatCardBagColors[WeChatCardBagColors.length - 2],
        cardLogo: '',
        shareImg: '',
        shareDesc: '',
        id: null
      },
      submitting: false,
      rules: {
        cardColour: [{ required: true, message: '本项必填' }],
        cardLogo: [{ required: true, message: '本项必填' }],
        shareImg: [{ required: true, message: '本项必填' }],
        shareDesc: [{ required: true, message: '本项必填' }]
      }
    }
  },
  async created () {
    this.getDetail()
  },
  methods: {
    change () {
      this.$refs.form.validateField(`cardColour`)
    },
    // 选择图片
    materialSelectorChange (val) {
      this.form.shareImg = val[0].imgUrl
      this.showMaterialSelector = false
    },
    chooseMaterial () {
      this.showMaterialSelector = true
    },
    // 选择图片
    materialSelectorChange2 (val) {
      this.form.cardLogo = val[0].imgUrl
      this.showMaterialSelector2 = false
    },
    chooseMaterial2 () {
      this.showMaterialSelector2 = true
    },
    async getDetail () {
      const res = await ApiScore.getDetail().catch(() => false)
      if (!res) return
      this.form = res.data || this.form
      console.log(res)
    },
    submit () {
      this.$refs.form.validate(async valid => {
        if (!valid) return
        if (!this.form.id) delete this.form.id

        this.submitting = true
        const res = await ApiScore.save(this.form).catch(() => (this.submitting = false))
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
  .el-color-dropdown__main-wrapper {
    display: none;
  }
</style>

<style lang="scss" scoped>
  .page-score {
    .header {
      display: flex;
      justify-content: space-between;
      padding-bottom: 10px;
      border-bottom: 1px solid $--border-color-base;
      margin-bottom: 20px;

      .title {
        display: flex;
        align-items: flex-end;

        .big {
          font-size: 16px;
          font-weight: bold;
          margin-right: 10px;
        }

        .small {
          font-size: 12px;
          color: $--color-danger;
        }
      }
    }

    .goods-img {
      width: 148px;
      height: 148px;
    }

    /deep/ .el-form-item__content {
      font-size: 12px;
    }

    /deep/ .el-form-items .el-form-item {
      display: inline-block;
    }
  }
</style>
