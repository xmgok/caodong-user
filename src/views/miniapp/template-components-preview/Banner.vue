<template>
  <div class="template-components-preview-banner">
    <img
      :src="defaultValue.imgUrl"
      class="img" >
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
  .template-components-preview-banner {
    .img {
      width: 100%;
      height: auto;
    }
  }
</style>
