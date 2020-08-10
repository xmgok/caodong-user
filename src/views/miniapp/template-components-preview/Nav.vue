<template>
  <div class="template-components-preview-nav">
    <div
      v-for="(item, index) in defaultValue"
      :key="index"
      class="item">
      <div
        :style="`background-image:url(${ item.imgUrl })`"
        class="img"/>
      <div class="name">{{ item.name }}</div>
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
  .template-components-preview-nav {
    display: flex;
    .item {
      flex: 25%;
      text-align: center;
      padding: 10px 0;
      .img {
        width: 80px;
        height: 80px;
        margin: 0 auto;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
      }
      .name {
        padding-top: 5px;
        font-size: 14px;
      }
    }
  }
</style>
