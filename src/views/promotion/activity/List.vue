<template>
  <div>
    <el-tabs type="border-card">
      <el-tab-pane
        :lazy="true"
        label="全部">
        <list/>
      </el-tab-pane>
      <el-tab-pane
        :lazy="true"
        label="未开始"><list type="0" /></el-tab-pane>
      <el-tab-pane
        :lazy="true"
        label="进行中"><list type="1" /></el-tab-pane>
      <el-tab-pane
        :lazy="true"
        label="已结束"><list type="2" /></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import List from './components/List'

export default {
  name: 'Activity',
  components: { List },
  data () {
    return {
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
