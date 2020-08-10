<template>
  <div>
    <el-tabs type="border-card">
      <el-tab-pane
        :lazy="lazy"
        label="全部">
        <list />
      </el-tab-pane>
      <el-tab-pane
        :lazy="lazy"
        label="待审核">
        <list type="0" />
      </el-tab-pane>
      <el-tab-pane
        :lazy="lazy"
        label="待发放">
        <list type="2" />
      </el-tab-pane>
      <el-tab-pane
        :lazy="lazy"
        label="已发放">
        <list type="1" />
      </el-tab-pane>
      <el-tab-pane
        :lazy="lazy"
        label="已驳回">
        <list type="3" />
      </el-tab-pane>
      <el-tab-pane
        :lazy="lazy"
        label="已撤销">
        <list type="5" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import List from './list/ApplicationForCash'

export default {
  name: 'SellerManagement',
  components: { List },
  data () {
    return {
      lazy: true
    }
  },
  created () {
  },
  methods: {}
}
</script>

<style lang="scss">
</style>
