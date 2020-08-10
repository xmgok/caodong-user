<template>
  <div class="template-components-preview-slide">
    <el-carousel
      :height="defaultValue.height/2+'px'"
      indicator-position="outside">
      <el-carousel-item
        v-for="(item, index) in defaultValue.list"
        :key="index">
        <div
          :style="`background-image:url(${ item.imgUrl })`"
          class="item" />
      </el-carousel-item>
    </el-carousel>
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
  .template-components-preview-slide {
    position: relative;

    .item {
      width: 100%;
      height: 200px;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    }
  }
</style>
