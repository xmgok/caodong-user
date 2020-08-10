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
        label="启用">
        <list type="1" />
      </el-tab-pane>
      <el-tab-pane
        :lazy="lazy"
        label="已驳回">
        <list type="3" />
      </el-tab-pane>
      <el-tab-pane
        :lazy="lazy"
        label="禁用">
        <list type="2" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import List from './list/SellerManagement'

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
