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
        label="未开始">
        <list type="1" />
      </el-tab-pane>
      <el-tab-pane
        :lazy="lazy"
        label="进行中">
        <list type="2" />
      </el-tab-pane>
      <el-tab-pane
        :lazy="lazy"
        label="已结束">
        <list type="3" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import List from './components/List'

export default {
  name: 'PromotionGroupList',
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
