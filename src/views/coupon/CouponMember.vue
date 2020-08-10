<template>
  <div class="page-coupon-member-list">
    <el-tabs type="border-card">
      <el-tab-pane
        :lazy="lazy"
        label="全部">
        <coupon-member/>
      </el-tab-pane>
      <el-tab-pane
        :lazy="lazy"
        label="未发放"><coupon-member status="0"/></el-tab-pane>
      <el-tab-pane
        :lazy="lazy"
        label="已发放"><coupon-member status="1"/></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import CouponMember from './components/CouponMember'

export default {
  name: 'CouponList',
  components: { CouponMember },
  data () {
    return {
      lazy: true
    }
  },

  created () {
  },

  methods: {
  }
}
</script>

<style lang="scss">
</style>
