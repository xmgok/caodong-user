<template>
  <div class="template-components-preview-coupon">
    <div
      v-for="(item, index) in defaultValue"
      :key="index"
      class="item">
      <div class="price">￥<span>20</span></div>
      <div class="name">{{ item.name }}</div>
      <div class="get-btn">领取</div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    defaultValue: {
      type: Array,
      default: () => []
    }
  },
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
  .template-components-preview-coupon {
    display: flex;
    .item {
      flex: 1;
      border-right: 1px solid #ebeef5;
      text-align: center;
      padding: 20px 0;
      &:last-child {
        border-right: 0;
      }
      .price {
        padding-bottom: 5px;
        span {
          font-size: 24px;
        }
      }
      .name {
        font-size: 14px;
        padding-bottom: 5px;
      }
      .get-btn {
        display: inline-block;
        border: 1px solid gainsboro;
        padding: 2px 10px;
      }
    }
  }
</style>
