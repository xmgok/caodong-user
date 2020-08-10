<template>
  <div class="page-test">
    <el-button
      type="primary"
      @click="showDialog = true">条件选择商品</el-button>
    <el-button
      type="primary"
      @click="showDialog2 = true">手动选择商品</el-button>

    <div class="mt20">
      <el-button
        type="primary"
        @click="showDialog3 = true">添加链接</el-button>
      <el-button
        type="primary"
        @click="showDialog4 = true">选取图片</el-button>
      <el-button
        type="primary"
        @click="showDialog5 = true">选取商品</el-button>

      <!--
      <link-selector
        v-if="showDialog3"
        :visible.sync="showDialog3"
        @change="linkSelectorChanged"/>
-->
      <material-selector
        :visible.sync="showDialog4"
        @change="materialSelectorChanged"/>
      <goods-selector
        :visible.sync="showDialog5"
        @change="goodsSelectorChanged"/>
      <link-selector
        :current-value="linkSelected"
        :visible.sync="showDialog3"
        @change="linkSelectorChanged($event)"/>
    </div>
  </div>
</template>

<script>
import GoodsSelector from '@/components/GoodsSelector'
import LinkSelector from '@/components/LinkSelector'
import MaterialSelector from '@/components/MaterialSelector'

export default {
  name: 'Test',
  components: {
    GoodsSelector,
    LinkSelector,
    MaterialSelector
  },
  data () {
    return {
      showDialog3: false,
      showDialog4: false,
      showDialog5: false,
      formData: {
        priceMin: 1,
        priceMax: 100,
        categorySelected: [1, 3, 4, 5, 6],
        tagSelected: [1]
      },
      chooseArr: [],
      linkSelected: {
        url: '/pages/category/category',
        name: '商品分类页'
      }
    }
  },
  methods: {
    linkSelectorChanged (val) {
      console.log(val)
    },
    materialSelectorChanged (val) {
      // console.log(val)
      this.showDialog4 = false
    },
    goodsSelectorChanged (val) {
      // console.log(val)
    }
  }
}
</script>

<style lang="scss">
  .page-test {

  }
</style>
