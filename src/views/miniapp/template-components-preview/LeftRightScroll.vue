<template>
  <div class="template-components-preview-left-right-scroll">
    <div
      :style="{height: defaultValue.height/2+'px'}"
      class="wrap">
      <img
        v-for="(item, index) in defaultValue.list"
        :key="index"
        :src="item.imgUrl"
        class="item">
    </div>
  </div>
</template>

<script>

export default {
  props: {
    defaultValue: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {}
  },
  created () {
  },

  methods: {}
}
</script>

<style lang="scss">
  .template-components-preview-left-right-scroll {
    position: relative;

    .wrap {
      white-space: nowrap;
      overflow: hidden;
      padding: 10px;
      box-sizing: border-box;
      font-size: 0;

      /*
      &::-webkit-scrollbar {
        height: 4px;
      }

      &::-webkit-scrollbar-thumb {
        background: #535353;
      }

      &::-webkit-scrollbar-track {
        background: #ccc;
      }
      */

    }

    .item {
      display: inline-block;
      vertical-align: middle;
      margin-right: 10px;
      height: 100%;
      border-radius: 10px;
      -webkit-user-drag: none;

      &:last-of-type {
        margin-right: 0;
      }
    }
  }
</style>
