<template>
  <div class="template-components-coupon">
    <el-form
      ref="form"
      :rules="formRules"
      :model="form"
      label-width="100px">
      <el-form-item
        label="优惠券列表">
        <div
          v-for="(item, index) in form.list"
          :key="index"
          class="mb5">
          <el-button
            :icon="item.id ? 'el-icon-edit' : 'el-icon-plus'"
            class="add-link"
            round
            size="mini"
            @click="openCouponSelector(index)">
            <template v-if="item.id">已添加优惠券: "{{ item.name }}"</template>
            <template v-else>选取优惠券</template>
          </el-button>
          <el-button
            class="f14"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="del(index)"/>
        </div>
        <div>
          <el-button
            v-if="form.list.length < 3"
            type="primary"
            size="mini"
            icon="el-icon-plus"
            @click="add">添加优惠券</el-button>
        </div>
      </el-form-item>
    </el-form>
    <coupon-selector
      v-if="showCouponSelector"
      :visible.sync="showCouponSelector"
      :multiple="false"
      :default-data="couponSelector"
      @change="couponSelectorChanged" />
  </div>
</template>

<script>
import CouponSelector from '@/components/CouponSelector'

export default {
  components: {
    CouponSelector
  },
  props: {
    defaultValue: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      showCouponSelector: false,
      currentIndex: '',
      form: {
        list: []
      },
      formRules: {}
    }
  },
  computed: {
    couponSelector () {
      const id = this.form.list[this.currentIndex].id || ''
      return id ? [id] : []
    }
  },
  created () {
    this.form.list = [].concat(this.defaultValue)
    this.emitData()
  },

  methods: {
    add () {
      this.form.list.push({ id: '', name: '' })
    },
    del (index) {
      this.form.list.splice(index, 1)
      this.emitData()
    },
    openCouponSelector (index) {
      this.currentIndex = index
      this.showCouponSelector = true
    },
    couponSelectorChanged (data) {
      data = data[0]
      this.form.list[this.currentIndex].id = data.id || ''
      this.form.list[this.currentIndex].name = data.name || ''
      this.emitData()
    },
    emitData () {
      this.$emit('change', this.form.list)
    }
  }
}
</script>

<style lang="scss">
  .template-components-coupon {
  }
</style>
