<template>
  <div class="page-setting-global">
    <el-form
      ref="form"
      :rules="rules"
      :model="form"
      class="form"
      label-width="160px">
      <el-card class="mt10">
        <div slot="header">消费者进店设置</div>
        <el-form-item
          label="自选门店：">
          <el-radio-group
            v-model="form.changeStore.subVal"
            :disabled="see">
            <el-radio
              :label="0">禁用
            </el-radio>
            <el-radio
              :label="1">启用
              <span
                v-if="form.changeStore.subVal === 1"
                class="grey ml10">启用后，消费者端可在小程序端切换门店</span>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="换店规则"
        >
          <el-radio-group
            v-model="form.changeRule.subVal">
            <div>
              <el-radio
                :label="0"
                class="mt10">
                <span>固定门店</span>
                <span class="grey ml10">消费者进入门店后,只有通过导购分享的二维码/链接才能换店</span>
              </el-radio>
            </div>
            <div>
              <el-radio
                :label="1"
                class="mt10">
                <span>LBS定位换店</span>
                <span
                  v-if="form.changeRule.subVal === 1"
                  class="grey ml10">
                  超过
                  <el-form-item
                    style="display:inline-block;"
                    prop="changeRule.subExt">
                    <el-input
                      v-model.number="form.changeRule.subExt"
                      min="1"
                      step="1"
                      class="w200"
                      type="text">
                      <template slot="append">公里</template>
                    </el-input>
                  </el-form-item>
                  自动换店
                </span>
                <span class="grey ml10">消费者每次进入小程序,根据授权定位,进入身边最近的门店</span>
              </el-radio>
            </div>
          </el-radio-group>
        </el-form-item>
      </el-card>
      <!--<el-card class="mt10">
        <div slot="header">订单跟踪字段设置</div>
        <el-form-item
          label="单件批次号：">
          <el-radio-group
            v-model="form.danjianpicihao.subVal"
            :disabled="see">
            <el-radio
              :label="0">禁用
            </el-radio>
            <el-radio
              :label="1">启用
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="sku唯一码：">
          <el-radio-group
            v-model="form.skuweiyima.subVal"
            :disabled="see">
            <el-radio
              :label="0">禁用
            </el-radio>
            <el-radio
              :label="1">启用
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-card>-->
      <div
        class="ui-edit-btn-wrapper">
        <el-button
          :loading="submitting"
          type="primary"
          @click="submit">保存
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { COMMON_SETTING } from '@/config/const'
import * as Validate from '@/utils/validate'
import * as ApiGlobal from '@/api/global'

export default {
  name: 'SettingGlobal',
  data () {
    return {
      form: COMMON_SETTING,
      see: false,
      rules: {
        'changeRule.subExt': [
          { required: true, message: '本项必填' },
          {
            validator: Validate.number, trigger: 'blur'
          }
        ]
      },
      submitting: false
    }
  },

  created () {
    this.getDetail()
  },

  methods: {
    async getDetail () {
      const res = await ApiGlobal.getDetail().catch(() => false)
      const obj = {}
      res.data.forEach(v => {
        obj[v.subKey] = v
      })
      this.form = obj
    },
    submit () {
      this.$refs.form.validate(async valid => {
        if (!valid) return
        this.submitting = true
        const list = Object.keys(this.form).map(key => this.form[key])
        const res = await ApiGlobal.save(list).catch(() => false)
        this.submitting = false
        if (!res) return
        this.$message.success('操作成功')
      })
    }
  }
}
</script>

<style lang="scss">
</style>
