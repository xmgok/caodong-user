<!--商品分类选择器-->
<template>
  <div class="components-GoodsCategorySelector">
    <el-dialog
      :visible="visible"
      :before-close="close"
      :title="title"
      append-to-body
      width="500px">

      <el-input
        v-model="filterText"
        class="mb10"
        placeholder="输入关键字进行过滤"/>

      <div
        v-loading="loading"
        class="tree-wrap">
        <el-tree
          ref="tree"
          :data="categoryList"
          :default-checked-keys="categorySelected"
          :props="{ children: 'childList', label: 'name' }"
          :filter-node-method="filterNode"
          :default-expand-all="true"
          show-checkbox
          node-key="id"/>
      </div>

      <div
        slot="footer"
        class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button
          type="primary"
          @click="submit">确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ApiProduct from '@/api/product'

export default {
  name: 'OrganizationCategorySelector',
  props: {
    // 是否显示
    visible: {
      type: Boolean,
      default: false
    },
    // 默认值。threeLevelOnly为false时只用传id数组
    defaultValue: {
      type: Array,
      default: () => []
    },
    // 默认只是显示第三级。defaultValue需是包含level、id的对象数组
    threeLevelOnly: {
      type: Boolean,
      default: false
    },
    // 是否只返回选中的叶子节点
    leafOnly: {
      type: Boolean,
      default: false
    },
    // 是否返回包含半选节点
    includeHalfChecked: {
      type: Boolean,
      default: false
    },
    // 弹窗标题
    title: {
      type: String,
      default: ''
    }
  },

  data () {
    return {
      filterText: '',
      categorySelected: [],
      categoryList: [],
      loading: false
    }
  },

  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    },
    visible (val) {
      if (!val) return

      this.loading = true
      ApiProduct.getCategoryList().then(({ data = [] }) => {
        this.categoryList = data
        this.loading = false

        if (this.threeLevelOnly) {
          const selected = this.defaultValue.filter(i => i.level === 3).map(i => i.id)

          // IMPORTANT 选中无三级的二级分类时，也记录该二级分类
          const level2List = this.defaultValue.filter(i => i.level === 2)
          level2List.forEach(item => {
            const top = this.categoryList.find(i => i.id === item.parentId)
            const level2 = top.childList.find(i => i.id === item.id)
            if (!level2.childList.length) selected.push(item.id)
          })

          this.categorySelected = selected
        } else {
          this.categorySelected = this.defaultValue.map(i => i.id)
        }
      })
    }
  },

  created () {
    if (this.defaultValue) this.categorySelected = this.defaultValue
  },

  methods: {
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    close () {
      this.$emit('update:visible', false)
    },
    submit () {
      this.$emit('change', this.$refs.tree.getCheckedNodes(this.leafOnly, this.includeHalfChecked))
    }
  }
}
</script>

<style lang="scss">
</style>
