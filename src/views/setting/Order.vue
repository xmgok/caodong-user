<template>
  <div class="page-setting-order">
    <p class="title">订单取消设置：</p>
    <div class="set-item">
      用户未付款订单超过
      <el-select
        v-model="autocancelValue"
        placeholder="请选择">
        <el-option
          v-for="item in autocancelItem"
          :key="item.value"
          :label="item.label"
          :value="item.value" />
      </el-select>
      ，系统将自动取消该笔订单
    </div>
    <p class="title">订单完成设置：</p>
    <div class="set-item">
      订单在发货后
      <el-select
        v-model="autoconfirmValue"
        placeholder="请选择">
        <el-option
          v-for="item in autoconfirmItem"
          :key="item.value"
          :label="item.label"
          :value="item.value" />
      </el-select>
      ，若用户没有确认收货，则系统自动默认已完成
    </div>
    <p class="title">售后订单设置（退款）：</p>
    <div class="set-item">
      消费者申请退款，商家未处理超过
      <el-select
        v-model="refundDay"
        placeholder="请选择">
        <el-option
          v-for="item in autoconfirmItem1"
          :key="item.value"
          :label="item.label"
          :value="item.value" />
      </el-select>
      系统将自动完成该售后订单，并自动退款
    </div>
    <p class="title">售后订单设置（退款退货）：</p>
    <div class="set-item">
      消费者申请退款退货，商家未处理超过
      <el-select
        v-model="regoodsDay"
        placeholder="请选择">
        <el-option
          v-for="item in autoconfirmItem1"
          :key="item.value"
          :label="item.label"
          :value="item.value" />
      </el-select>
      系统将自动同意申请，并发送退货地址给消费者
    </div>
    <div class="set-item">
      商家同意消费者退款申请后，消费者未寄回商品超过
      <el-select
        v-model="customerDay"
        placeholder="请选择">
        <el-option
          v-for="item in autoconfirmItem1"
          :key="item.value"
          :label="item.label"
          :value="item.value" />
      </el-select>
      系统将自动关闭该售后申请
    </div>
    <div class="set-item">
      商家同意消费者退款申请，自消费者寄还商品等待商家收货算起，商家未处理超过
      <el-select
        v-model="sellerDay"
        placeholder="请选择">
        <el-option
          v-for="item in autoconfirmItem2"
          :key="item.value"
          :label="item.label"
          :value="item.value" />
      </el-select>
      系统将自动退款给消费者
    </div>
    <template v-if="false">
      <p class="title">订单抹零设置：</p>
      <div class="set-item">
        抹零规则
        <el-select
          v-model="dingdanmoling"
          placeholder="请选择">
          <el-option
            v-for="item in dingdanmolingList"
            :key="item.value"
            :label="item.label"
            :value="item.value" />
        </el-select>
        <span class="ui-color2 ml20">
          <span>案例：</span>
          <template v-if="dingdanmoling==='1'">
            <span>100.22 -> 100.22</span>
            <span class="ml20">100.88 -> 100.88</span>
          </template>
          <template v-if="dingdanmoling==='2'">
            <span>100.22 -> 100</span>
            <span class="ml20">100.88 -> 100</span>
          </template>
          <template v-if="dingdanmoling==='3'">
            <span>100.22 -> 101</span>
            <span class="ml20">100.88 -> 101</span>
          </template>
          <template v-if="dingdanmoling==='4'">
            <span>100.22 -> 100</span>
            <span class="ml20">100.88 -> 101</span>
          </template>
          <template v-if="dingdanmoling==='5'">
            <span>100.22 -> 100.20</span>
            <span class="ml20">100.88 -> 100.80</span>
          </template>
          <template v-if="dingdanmoling==='6'">
            <span>100.22 -> 100.30</span>
            <span class="ml20">100.88 -> 100.90</span>
          </template>
          <template v-if="dingdanmoling==='7'">
            <span>100.22 -> 100.20</span>
            <span class="ml20">100.88 -> 100.90</span>
          </template>
        </span>
      </div>
    </template>

    <div class="ui-edit-btn-wrapper">
      <el-button
        @click="$router.go(-1)">取消
      </el-button>
      <el-button
        type="primary"
        @click="save">保存
      </el-button>
    </div>
  </div>
</template>

<script>
import * as ApiSetOrder from '@/api/setOrder'

export default {
  name: 'OrderSetting',
  data () {
    return {
      dingdanmoling: '1',
      dingdanmolingList: [
        { value: '1', label: '不自动抹零' },
        { value: '2', label: '往下抹零到元' },
        { value: '3', label: '往上抹零到元' },
        { value: '4', label: '四舍五入到元' },
        { value: '5', label: '往下抹零到角' },
        { value: '6', label: '往上抹零到角' },
        { value: '7', label: '四舍五入到角' }
      ],
      autocancelItem: [
        { value: '12', label: '12小时' },
        { value: '24', label: '24小时' },
        { value: '48', label: '48小时' }
      ],
      autoconfirmItem: [
        { value: '7', label: '7天' },
        { value: '15', label: '15天' },
        { value: '30', label: '30天' }
      ],
      autoconfirmItem1: [
        { value: '3', label: '3天' },
        { value: '7', label: '7天' }
      ],
      autoconfirmItem2: [
        { value: '7', label: '7天' },
        { value: '15', label: '15天' }
      ],
      autocancelValue: '12',
      autoconfirmValue: '7',
      refundDay: '7',
      regoodsDay: '7',
      customerDay: '7',
      sellerDay: '7',
      id: ''
    }
  },
  mounted () {
    ApiSetOrder.getOrderInfo().then(({ data = {} }) => {
      this.id = data.id
      this.autocancelValue = String(data.cancelHour)
      this.autoconfirmValue = String(data.finishDay)

      this.refundDay = String(data.refundDay)
      this.regoodsDay = String(data.regoodsDay)
      this.customerDay = String(data.customerDay)
      this.sellerDay = String(data.sellerDay)
    })
  },
  methods: {
    save () {
      ApiSetOrder.setOrderInfo({
        id: this.id,
        cancelHour: Number(this.autocancelValue),
        finishDay: Number(this.autoconfirmValue),
        refundDay: this.refundDay,
        regoodsDay: this.regoodsDay,
        customerDay: this.customerDay,
        sellerDay: this.sellerDay
      }).then(({ code, message }) => {
        this.$message({ type: 'success', message: message })
      }, () => {
      })
    }
  }
}
</script>

<style lang="scss">
  .page-setting-order {
    padding-top: 20px;

    .title {
      font-size: 14px;
      font-weight: bold;
      margin-top: 20px;
    }

    .set-item {
      padding-top: 10px;
      padding-bottom: 10px;
    }
  }
</style>
