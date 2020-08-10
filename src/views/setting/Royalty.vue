<template>
  <div>
    <el-card shadow="never">
      <div
        slot="header"
        class="ui-hd-title">提成设置
      </div>

      <el-tree
        ref="tree"
        :data="data2"
        :default-checked-keys="checked"
        :default-expand-all="false"
        :props="defaultProps"
        show-checkbox
        node-key="id"/>

      <div class="ui-edit-btn-wrapper">
        <el-button
          :loading="submitting"
          type="primary"
          @click="submit">保存
        </el-button>
      </div>
    </el-card>

    <el-card
      shadow="never"
      class="mt20">
      <div
        slot="header"
        class="ui-hd-title">提现设置
      </div>
      <el-form
        ref="withdrawForm"
        :model="withdrawForm"
        :rules="rules"
        class="withdraw-wrap"
        label-width="0px">
        <el-form-item>
          <p class="ui-hd-title">启用提现</p>

          <el-radio-group v-model="withdrawForm.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item prop="days">
          <p class="ui-hd-title">账期</p>

          订单完成后
          <el-input
            v-model.number="withdrawForm.days"
            class="w200"/>
          天可提现
        </el-form-item>

        <el-form-item class="give-type">
          <p class="ui-hd-title">提成发放方式</p>

          <!--<el-row :gutter="10">
            <el-radio-group
              v-model="withdrawForm.type"
              class="w-100">
              <el-col :span="2">
                <el-radio :label="1">自动发放</el-radio>
              </el-col>
              <el-col :span="2">
                <el-radio :label="2">申请发放</el-radio>
              </el-col>
            </el-radio-group>
          </el-row>-->

          <el-radio-group
            v-model="withdrawForm.applyType"
            :disabled="withdrawForm.type !== 2">
            <el-radio :label="1">申请后自动发放</el-radio>
            <el-radio :label="2">申请后手工发放</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          :rules="applyAmountRules"
          prop="applyAmount">
          <p class="ui-hd-title">
            最低申请金额
            <!--<span class="text-secondary f12">提成发放方式为“申请发放”时需填写</span>-->
          </p>

          可提现金额超过
          <el-input
            v-model.number="withdrawForm.applyAmount"
            :disabled="withdrawForm.type !== 2"
            class="w200"/>
          元可申请提现
        </el-form-item>
      </el-form>

      <div class="ui-edit-btn-wrapper">
        <el-button
          :loading="withdrawSubmitting"
          type="primary"
          @click="withdrawSave">保存
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import * as ApiRoyalty from '@/api/royalty'
import * as ApiStores from '@/api/stores'
import * as Validate from '@/utils/validate'

export default {
  name: 'SettingRoyalty',
  data () {
    return {
      submitting: false,
      checked: [],
      defaultProps: {
        children: 'list',
        label: 'name'
      },
      data2: [],
      withdrawForm: {
        type: 2, // 提成发放方式 1自动发放 2申请发放
        status: 1, // 状态 0关闭 1开启
        applyType: 0, // 申请发放类型 0自动发放 1申请后自动发放 2申请后手动发放
        days: '', // 订单完成后天数
        applyAmount: '' // 最低申请金额
      },
      withdrawSubmitting: false,
      rules: {
        days: [
          { required: true, message: '请输入账期', trigger: 'blur' },
          { validator: (r, v, cb) => Validate.number(r, v, cb), trigger: 'blur' }
        ]
      }
    }
  },

  computed: {
    applyAmountRules () {
      if (this.withdrawForm.type !== 2) return []
      return [
        { required: true, message: '请输入最低申请金额', trigger: 'blur' },
        { validator: (r, v, cb) => Validate.money(r, v, cb), trigger: 'blur' }
      ]
    }
  },

  watch: {
    'withdrawForm.type' (val) {
      if (val === 1) this.withdrawForm.applyType = 0
    }
  },

  created () {
    this.getList()
    this.getStoreList()
    this.getWithdrawSetupInfo()
  },

  methods: {
    getStoreList () {
      ApiStores.getSysuserStoreTree().then(({ data }) => {
        this.data2 = data || []
      })
    },
    getList () {
      ApiRoyalty.list().then(({ data }) => {
        this.checked = (data || []).map(item => {
          return item.storeId
        })
      })
    },
    getWithdrawSetupInfo () {
      ApiRoyalty.getWithdrawSetupInfo().then(({ data }) => {
        this.withdrawForm = data
      })
    },
    submit () {
      this.submitting = true
      const checked = this.$refs.tree.getCheckedNodes().map(item => {
        return { storeId: item.id, type: item.type, companyId: item.parentId }
      })
      ApiRoyalty.save(checked).then(({ code, message }) => {
        this.$message({ type: (code === 'SUCCESS' ? 'success' : 'error'), message: message })
        this.submitting = false
      }).catch(() => { this.submitting = false })
    },
    withdrawSave () {
      this.$refs.withdrawForm.validate(valid => {
        if (!valid) return

        const { type, applyType } = this.withdrawForm
        if (type === 2 && !applyType) {
          this.$message.warning('请选择申请发放方式')
          return
        }

        this.withdrawSubmitting = true
        ApiRoyalty.withdrawSetup(this.withdrawForm).then(({ code, message }) => {
          this.$message({ type: (code === 'SUCCESS' ? 'success' : 'error'), message: message })
          this.withdrawSubmitting = false
        }).catch(() => { this.submitting = false })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .withdraw-wrap {
    background-color: #ffffff;
  }

  /deep/ .give-type {
    .el-radio {
      /*display: block;*/
      margin-left: 0;
      line-height: 36px;
    }
  }
</style>
