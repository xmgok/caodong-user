<template>
  <div class="template-components-preview-poster">
    <img
      :src="defaultValue.imgUrl"
      class="img" >
    <div
      v-for="(item, index) in defaultValue.link"
      :key="index"
      :style="{ width: `${item.width}px`, height: `${item.height}px`, left: `${item.position[0]}px`, top: `${item.position[1]}px`}"
      class="link-item"/>
  </div>
</template>

<script>

export default {
  props: {
    defaultValue: {
      type: Object,
      default: () => {}
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
  .template-components-preview-poster {
    position: relative;
    .img {
      display: block;
      width: 100%;
      height: auto;
    }
    .link-item {
      position: absolute;
      background: rgba(36, 186, 171, 0.5);
    }
  }
</style>
