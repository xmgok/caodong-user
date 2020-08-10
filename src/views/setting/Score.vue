<template>
  <div class="page-score">
    <el-card shadow="none">
      <div class="header">
        <div class="title">
          <div class="big">积分抵扣</div>
          <div class="small">积分抵现功能仅对已对接会员系统的租户有效</div>
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
        :model="form">
        <div class="score-scale">
          <div class="mr5">积分抵现比例：</div>
          <el-form-item
            prop="integral">
            <el-input
              v-model="form.integral"
              min="1"
              step="1"
              type="text">
              <template slot="append">积分</template>
            </el-input>
          </el-form-item>
          <div class="margin">等于</div>
          <el-form-item
            prop="money">
            <el-input
              v-model="form.money"
              min="1"
              step="1"
              type="text">
              <template slot="append">分</template>
            </el-input>
          </el-form-item>
          <div class="ml10">人民币</div>
          <div class="ml10">（积分抵现的数额与金额必须是兑换比例的正整数倍）</div>
        </div>
        <div class="score-scale mt20">
          <div class="mr5">积分抵现不超过订单总额的：</div>
          <el-form-item
            prop="rate">
            <el-input
              v-model="form.rate"
              type="text">
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
          <div class="ml10">抵扣的积分四舍五入为整数（例：订单总额100.87元，积分抵扣不超过5.23%，即最多可抵扣5.275501元，按照积分比例1积分：1分，本单最多可用528积分）</div>
        </div>
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
  </div>
</template>

<script>
import * as ApiScore from '@/api/score'

export default {
  name: 'Score',
  data () {
    return {
      form: {
        id: null,
        integral: 1, // 积分
        money: 1, // 金额
        status: 0, // 状态 0关闭 1开启
        rate: ''
      },
      submitting: false,
      rules: {
        integral: [{
          validator: (rule, value, callback) => {
            if (!/^[1-9]\d*$/.test(value)) callback(new Error('请输入正整数'))
            return callback()
          },
          trigger: 'blur'
        }],
        rate: [{
          validator: (rule, value, callback) => {
            if (!/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d{1,2})$/.test(value)) callback(new Error('请输入合法数字'))
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
        }]
      }
    }
  },
  async created () {
    this.getDetail()
  },
  methods: {
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

    .score-scale {
      display: flex;
      align-items: center;

      .el-form-item {
        margin-bottom: 0;
      }

      .margin {
        margin: 0 10px;
      }
    }

    .score-desc {
      line-height: 24px;
      margin-top: 20px;
    }
  }
</style>
