<template>
  <div class="component-TabsBox">
    <ul class="tabs-nav">
      <li
        v-for="(item, index) in data"
        :key="index"
        :class="['tab-item', { active: currentTab === index }]"
        @click="switchTab(index)">{{ item }}
      </li>
    </ul>
    <div class="tabs-body"><slot/></div>
    <div
      v-if="$scopedSlots.footer"
      class="tabs-footer"><slot name="footer"/></div>
  </div>
</template>

<script>
export default {
  name: 'TabsBox',

  props: {
    data: {
      type: Array,
      default: () => []
    },
    current: {
      type: Number,
      default: 0
    }
  },

  data () {
    return {
      currentTab: this.current || 0
    }
  },

  methods: {
    switchTab (value) {
      this.currentTab = value
      this.$emit('change', value)
    }
  }
}
</script>

<style lang="scss">
  .component-TabsBox {
    margin-top: 10px;
    width: 100%;
    border-radius: 8px;
    background-color: white;
    .tabs-nav {
      box-sizing: border-box;
      padding-left: 16px;
      height: 48px;
      border-bottom: 1px solid #ebeef5;
      @include clearfix();
    }
    .tab-item {
      margin-right: 35px;
      float: left;
      height: 48px;
      line-height: 48px;
      color: #606266;
      font-size: 14px;
      cursor: pointer;
      &.active {
        position: relative;
        color: #5889ff;
        font-weight: bold;
        &::after {
          content: '';
          display: inline-block;
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 4px;
          color: #5889ff;
          background-color: #5889ff;
          border-radius: 2px;
        }
      }
    }
    .tabs-body {
      padding: 16px 24px 10px 0;
    }
    .tabs-footer {
      padding: 16px 24px;
      border-top: 1px solid #ebeef5;
    }
  }
</style>
