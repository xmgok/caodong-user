<template>
  <div class="template-components-preview-activity">
    <div class="title">
      <p v-if="defaultValue.type == 1">猜你喜欢</p>
      <p v-if="defaultValue.type == 2">好物拼购</p>
      <p v-if="defaultValue.type == 3">好友砍价</p>
      <p v-if="defaultValue.type == 4">秒杀</p>
    </div>
    <div class="goods-wrap">
      <div
        v-for="(item, index) in goodsList"
        :key="index"
        class="goods-item">
        <img
          class="img"
          src="http://cdqn.zhimeiplus.com/100_1552305792834_35603547.jpg" >
        <p class="name">商品名称</p>
        <p class="price">￥ 99.99</p>
      </div>
    </div>
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
  computed: {
    goodsList () {
      return [1, 2, 3, 4]
    }
  },
  created () {
  },

  methods: {
  }
}
</script>

<style lang="scss">
  .template-components-preview-activity {
    .title {
      text-align: center;
      line-height: 60px;
      font-size: 24px;
      background: white;
      margin-bottom: 10px;
    }
    .title-img {
      width: 100%;
      height: auto;
      display: block;
    }
    .goods-wrap {
      font-size: 0;
      padding-left: 10px;
      .goods-item {
        background: white;
        display: inline-block;
        width: 172px;
        margin-right: 10px;
        margin-bottom: 10px;
        border-radius: 5px;
        font-size: 12px;
        .img {
          display: block;
          width: 100%;
          height: auto;
        }
        .name {
          padding: 5px 10px;
        }
        .price {
          padding-left: 5px;
          padding-bottom: 10px;
          color: red;
        }
      }
    }
  }
</style>
