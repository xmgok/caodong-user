<!-- svg 雪碧图图标 https://juejin.im/post/59bb864b5188257e7a427c09 -->
<template>
  <svg
    :class="svgClass"
    aria-hidden="true">
    <use :xlink:href="iconName"/>
  </svg>
</template>

<script>
export default {
  name: 'SvgIcon',

  props: {
    // 图标名，即对应svg文件名
    iconClass: {
      type: String,
      required: true
    },
    // 扩展样式类名
    className: {
      type: String,
      default: ''
    }

  },

  computed: {
    iconName () {
      return `#icon-${this.iconClass}`
    },
    svgClass () {
      if (this.className) return `svg-icon ${this.className}`
      return 'svg-icon'
    }
  }
}
</script>

<style scoped>
  .svg-icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
</style>
