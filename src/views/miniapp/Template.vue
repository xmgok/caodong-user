<!--小程序模板-->
<template>
  <div class="page-coupon-list">
    <!-- <el-tabs type="border-card">
      <el-tab-pane
        :lazy="lazy"
        label="消费者端"></el-tab-pane> -->
    <!-- <el-tab-pane
        :lazy="lazy"
        label="导购端">
        <staff/>
      </el-tab-pane> -->
    <!-- </el-tabs> -->
    <user/>
  </div>
</template>

<script>
import User from './components/user'
import Staff from './components/staff'

export default {
  name: 'MiniAppTemplate',
  components: { User, Staff },

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
