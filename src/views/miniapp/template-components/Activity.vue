<template>
  <div class="template-components-activity">
    <el-form
      ref="form"
      :model="form"
      label-width="100px">
      <el-form-item label="活动类型">
        <el-radio-group
          v-model="form.type"
          @change="changeType">
          <el-radio :label="1">猜你喜欢</el-radio>
          <el-radio :label="2">好物拼购</el-radio>
          <el-radio :label="3">好友砍价</el-radio>
          <el-radio :label="4">秒杀</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import GoodsSelector from '@/components/GoodsSelector'
import MaterialSelector from '@/components/MaterialSelector'

export default {
  components: {
    GoodsSelector,
    MaterialSelector
  },
  props: {
    defaultValue: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      form: {
        type: 1
      }
    }
  },

  created () {
    this.form = Object.assign(this.form, this.defaultValue)
    this.emitData()
  },

  methods: {
    changeType () {
      this.emitData()
    },
    emitData () {
      this.$emit('change', this.form)
    }
  }
}
</script>

<style lang="scss">
  .template-components-activity {
  }
</style>
