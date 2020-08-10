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
        label="好评">
        <list type="1" />
      </el-tab-pane>
      <el-tab-pane
        :lazy="lazy"
        label="中评">
        <list type="2" />
      </el-tab-pane>
      <el-tab-pane
        :lazy="lazy"
        label="差评">
        <list type="3" />
      </el-tab-pane>
      <el-tab-pane
        :lazy="lazy"
        label="晒图">
        <list type="4" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import List from './components/List'

export default {
  name: 'GoodsComment',
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
