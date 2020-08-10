<template>
  <div class="template-components-preview-goods">
    <div
      v-if="defaultValue.name && defaultValue.nameType ==1"
      class="title">{{ defaultValue.name }}</div>
    <img
      v-if="defaultValue.nameImgUrl && defaultValue.nameType ==2"
      :src="defaultValue.nameImgUrl"
      class="title-img" >
    <div
      v-if="showGoods"
      class="goods-wrap">
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
      return this.defaultValue.searchType === 1 ? [1, 2, 3, 4] : this.defaultValue.productList
    },
    showGoods () {
      if (!this.defaultValue.searchType) return false
      const { productList, search, searchType } = this.defaultValue
      return searchType === 1 ? !!((search.startPrice || search.endPrice || search.categoryList.length > 0 || search.labelList.length > 0)) : productList.length > 0
    }
  },
  created () {
  },

  methods: {
  }
}
</script>

<style lang="scss">
  .template-components-preview-goods {
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
