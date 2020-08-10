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
        label="待分配">
        <list status="1" />
      </el-tab-pane>
      <el-tab-pane
        :lazy="lazy"
        label="待服务">
        <list status="2" />
      </el-tab-pane>
      <el-tab-pane
        :lazy="lazy"
        label="已完成">
        <list status="3" />
      </el-tab-pane>
      <el-tab-pane
        :lazy="lazy"
        label="已取消">
        <list status="4" />
      </el-tab-pane>
      <el-tab-pane
        :lazy="lazy"
        label="已关闭">
        <list status="5" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import List from './list/AppointmentManageList'

export default {
  name: 'AppointmentManageList',
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
