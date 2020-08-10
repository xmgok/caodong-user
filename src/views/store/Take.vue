<template>
  <div class="page-store-take">
    <div
      style="display: -webkit-box; width: 400px;">
      <div
        class="ui-hd-title pr10"
        style="line-height: 36px;">提货码验证</div>
      <el-form
        ref="form"
        :rules="formRules"
        :model="form"
        style="width: 100%;"
        label-width="0">
        <el-form-item
          prop="takeCode">
          <el-input
            v-model="form.takeCode"
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
        v-if="!info.orderCode"
        class="tip-wrap">
        <p>第一步：请消费者出示提货码，输入后进行验证</p>
        <p>第二步：验证提货码是否有效，并核对提货信息</p>
        <p>第三步：确认验证，提货码核销完成</p>
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
          <el-form-item label="订单编号:">{{ info.orderCode }}</el-form-item>
          <el-form-item label="订单金额:">{{ info.orderAmount }}元</el-form-item>
          <el-form-item label="提货人:">{{ info.userName }}</el-form-item>
          <el-form-item label="提货门店:">{{ info.storeName }}</el-form-item>
          <el-form-item label="提货商品:">
            <el-table :data="info.list" >
              <el-table-column
                :show-overflow-tooltip="true"
                prop="productName"
                label="商品名称"/>
              <el-table-column
                prop="productCode"
                align="center"
                label="货号"/>
              <el-table-column
                prop="specContent"
                align="center"
                label="规格"/>
              <el-table-column
                prop="number"
                align="center"
                label="数量"/>
              <el-table-column
                prop="price"
                align="center"
                label="单价"/>
              <el-table-column
                prop="totalPrice"
                align="center"
                label="商品金额"/>
              <el-table-column
                prop="totalPrice"
                align="center"
                label="状态">
                <template slot-scope="scope">
                  <p v-if="scope.row.status == 1">正常</p>
                  <p v-if="scope.row.status == 2">换货</p>
                  <p v-if="scope.row.status == 3">退货</p>
                  <p v-if="scope.row.status == 4">部分退货</p>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="库存">
                <template slot-scope="scope">
                  <p
                    v-if="scope.row.inventoryStatus == 0"
                    class="ui-color2">正常</p>
                  <p
                    v-else
                    class="ui-color1">不正常</p>
                </template>
              </el-table-column>
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
          <router-link :to="{ name: 'TakeList' }">
            <el-button type="primary">查看验证记录</el-button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as ApiStores from '@/api/stores'
export default {
  name: 'StoreTake',
  data () {
    return {
      form: {
        takeCode: ''
      },
      formRules: {
        takeCode: [
          { required: true, message: '请输入提货码', trigger: 'blur' }
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
        ApiStores.takeInfo({ takeCode: this.form.takeCode }).then((data) => {
          this.saveIng = false
          this.info = data || {}
        }, () => {
          this.saveIng = false
        })
      })
    },
    confirmCancellation () {
      ApiStores.takeValidate({ takeCode: this.form.takeCode }).then(({ code, message }) => {
        if (code !== 'SUCCESS') {
          this.$message.error(message)
          return
        }
        this.$confirm('已成功验证提货码', '', {
          confirmButtonText: '查看验证记录',
          cancelButtonText: '取消',
          type: 'success'
        }).then(() => {
          ApiStores.takeInfo({ takeCode: this.form.takeCode }).then((data) => {
            this.info = data || {}
          }, () => {})
          this.$router.push({ name: 'TakeList', query: { takeCode: this.form.takeCode } })
        }).catch(() => {
          this.submit()
        })
      })
    },
    cancel () {
      this.info = {}
      this.form.takeCode = ''
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
