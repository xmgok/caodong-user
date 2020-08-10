<template>
  <div class="page-store-take">
    <div
      style="display: -webkit-box; width: 400px;">
      <div
        class="ui-hd-title pr10"
        style="line-height: 36px;">预约码验证</div>
      <el-form
        ref="form"
        :rules="formRules"
        :model="form"
        style="width: 100%;"
        label-width="0">
        <el-form-item
          prop="code">
          <el-input
            v-model="form.code"
            clearable />
        </el-form-item>
      </el-form>
      <el-button
        :loading="saveIng"
        type="primary"
        class="ml10"
        @click="submit">验证</el-button>
    </div>
    <div class="result-wrap">
      <div
        v-if="!info.code"
        class="tip-wrap">
        <p>第一步：请消费者出示预约码，输入后进行验证</p>
        <p>第二步：验证预约码是否有效，并核对提货信息</p>
        <p>第三步：确认验证，预约码核销完成</p>
      </div>
      <div
        v-else
        class="verification">
        <el-form label-width="70px">
          <el-form-item label="验证状态:">
            <p
              v-if="info.validateState == 0"
              class="ui-color1"
              style="font-weight: bold">未核销</p>
            <p
              v-if="info.validateState == 1"
              class="ui-color2"
              style="font-weight: bold">已核销</p>
          </el-form-item>
          <el-form-item label="预约单号:">{{ info.code }}</el-form-item>
          <el-form-item label="金额:">{{ info.amount }}元</el-form-item>
          <el-form-item label="预约客户:">{{ info.userName }}</el-form-item>
          <el-form-item label="服务门店:">{{ info.storeName }}</el-form-item>
          <el-form-item label="服务项目:">
            <el-table :data="info.serviceList" >
              <el-table-column
                :show-overflow-tooltip="true"
                prop="serviceName"
                label="项目名称"/>
              <el-table-column
                prop="servicePrice"
                align="center"
                label="单价"/>
            </el-table>
          </el-form-item>
        </el-form>
        <div
          v-if="info.validateState == 0"
          class="tc mt20">
          <el-button
            type="info"
            @click="cancel">取消</el-button>
          <el-button
            type="primary"
            @click="confirmCancellation">确定核销</el-button>
        </div>
        <div
          v-else
          class="tc mt20">
          <router-link :to="{ name: 'AppointmentWriteOffRecord' }">
            <el-button type="primary">查看验证记录</el-button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as ApiStores from '@/api/booking'
export default {
  name: 'AppointmentWriteOff',
  data () {
    return {
      form: {
        code: ''
      },
      formRules: {
        code: [
          { required: true, message: '请输入预约码', trigger: 'blur' }
        ]
      },
      tableData: [],
      saveIng: false,
      info: {}
    }
  },
  mounted () {
  },
  methods: {
    submit () {
      this.$refs['form'].validate((valid) => {
        if (!valid) return
        this.saveIng = true
        ApiStores.takeInfo({ code: this.form.code }).then((data) => {
          this.saveIng = false
          this.info = data || {}
        }, () => {
          this.saveIng = false
        })
      })
    },
    confirmCancellation () {
      ApiStores.takeValidate({ code: this.form.code }).then(({ code, message }) => {
        if (code !== 'SUCCESS') {
          this.$message.error(message)
          return
        }
        this.$confirm('已成功验证预约码', '', {
          confirmButtonText: '查看验证记录',
          cancelButtonText: '取消',
          type: 'success'
        }).then(() => {
          ApiStores.takeInfo({ code: this.form.code }).then((data) => {
            this.info = data || {}
          }, () => {})
          this.$router.push({ name: 'AppointmentWriteOffRecord', query: { code: this.form.code } })
        }).catch(() => {
          this.submit()
        })
      })
    },
    cancel () {
      this.info = {}
      this.form.code = ''
    }
  }
}
</script>

<style lang="scss">
  .page-store-take {
    .verification {
      .el-form-item {
        margin-bottom: 0;
      }
    }
    .result-wrap {
      padding-left: 80px;
    }
    .tip-wrap {
      color: #888888;
      line-height: 24px;
      font-size: 14px;
    }
  }
</style>
