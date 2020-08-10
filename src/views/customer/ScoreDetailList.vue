<template>
  <div>
    <el-tabs type="border-card">
      <list />
      <!--<el-tab-pane
        :lazy="lazy"
        label="全部">
        <list />
      </el-tab-pane>-->
      <!--<el-tab-pane
        :lazy="lazy"
        label="待入账">
        <list type="0" />
      </el-tab-pane>
      <el-tab-pane
        :lazy="lazy"
        label="已入账">
        <list type="1" />
      </el-tab-pane>-->
    </el-tabs>
  </div>
</template>

<script>
import List from './list/ScoreDetailList'

export default {
  name: 'ScoreDetailList',
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
