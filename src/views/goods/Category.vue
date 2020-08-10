<!-- 商品分类 -->
<template>
  <div
    v-loading="loading"
    class="goods-category">
    <div v-if="storeType <= 0">
      <el-button
        type="primary"
        class="mb10"
        @click="() => handleAppend()">添加分类
      </el-button>
      <span class="ui-color3 pl20">（暂仅支持在小程序端展示第三级分类的图片）</span>
    </div>
    <div class="tree-header">
      <div class="node-header">分类类名
        <el-button
          type="text"
          class="ml10"
          @click="expendAll">全部{{ isExpendAll ? '折叠': '展开' }}
        </el-button>
        <i :class="isExpendCls"/>
      </div>
      <div class="node-tail">
        <div class="td-sort">排序</div>
        <div class="td-img">缩略图</div>
        <div
          v-if="storeType <= 0"
          class="td-operate">操作</div>
      </div>
    </div>

    <!--分类列表-->
    <el-tree
      ref="categoryTree"
      :data="list"
      :expand-on-click-node="false"
      :props="{ children: 'childList', label: 'name'}"
      :default-expand-all="isExpendAll"
      node-key="id"
      class="filter-tree">
      <div
        slot-scope="{ node, data }"
        class="custom-tree-node">
        <div class="node-header">
          <span>{{ node.label }}</span>
          <el-button
            v-if="node.level < 3 && storeType <= 0"
            type="primary"
            size="mini"
            class="ml50"
            @click="() => handleAppend(node)">添加子分类</el-button>
        </div>
        <div class="node-tail">
          <div class="td-sort">
            <div
              v-if="data.isEditing"
              class="sort-wrap">
              <el-input
                v-model.number="data.rank"
                :maxlength="6"
                autofocus
                class="name-input"
                @keyup.enter.native="() => handleRankEdit(node, data)" />
              <i
                class="icons el-icon-circle-close"
                @click="cancelRankEdit(data)"/>
              <i
                class="icons el-icon-circle-check"
                @click="() => handleRankEdit(node, data)"/>
            </div>
            <div
              v-else
              class="sort-wrap">
              {{ data.rank }}
              <i
                v-if="storeType <= 0"
                class="icons el-icon-edit-outline"
                @click="() => rankFiledToEdit(data)"/>
            </div>
          </div>
          <div class="td-img">
            <img
              :src="data.imgUrl"
              class="node-img">
          </div>
          <div
            v-if="storeType <= 0"
            class="td-operate">
            <el-button
              type="text"
              size="mini"
              @click="() => handleEdit(node, data)">编辑</el-button>
            <el-button
              type="text"
              size="mini"
              @click="() => handleRemove(data)">删除</el-button>
          </div>
        </div>
      </div>-->
    </el-tree>

    <!--添加/编辑分类-->
    <el-dialog
      :visible.sync="dialogFormVisible"
      :title="`${form.id ? '编辑': '添加'}分类`"
      width="400px">
      <el-form
        ref="form"
        :model="form"
        :rules="rules">
        <el-form-item
          prop="name"
          label="分类名称"
          label-width="80px">
          <div class="category-name">
            <el-input
              v-model.trim="form.name"
              maxlength="20">
              <template slot="append">{{ form.name.length }}/20</template>
            </el-input>
          </div>
        </el-form-item>
        <el-form-item
          prop="parent"
          clearable
          label="层级归属"
          label-width="80px">
          <el-cascader
            :disabled="disableParent || list.length === 0"
            :options="list"
            :props="{ children: 'childList', value: 'id', label: 'name'}"
            v-model="form.parentId"
            :show-all-levels="false"
            :clearable="!disableParent"
            placeholder="---无---"
            expand-trigger="hover"
            filterable
            change-on-select
            style="width:280px"/>
        </el-form-item>
        <el-form-item
          ref="imgUrl"
          prop="imgUrl"
          label="分类图片"
          label-width="80px">
          <div
            :class="['uploader', { uploaded: !!form.imgUrl }]"
            @click="showMaterialSelector = true">
            <img
              v-if="form.imgUrl"
              :src="form.imgUrl"
              class="avatar">
            <i
              v-else
              class="el-icon-plus uploader-icon"/>
          </div>
          <span class="upload-tips">建议图片尺寸160*160</span>
        </el-form-item>
      </el-form>

      <material-selector
        :visible.sync="showMaterialSelector"
        :is-multi="false"
        type="image"
        @change="materialSelectorChanged"/>

      <div
        slot="footer"
        class="tc">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          :submitting="submitting"
          type="primary"
          @click="submit">保 存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ApiProduct from '@/api/product'
import { removeEmptyChildren } from '@/utils'
import MaterialSelector from '@/components/MaterialSelector'

const formEmpty = { id: '', name: '', imgUrl: '', level: 1, parentId: [] }

export default {
  name: 'GoodsCategory',

  components: { MaterialSelector },

  data () {
    return {
      loading: false,
      submitting: false,
      isExpendAll: true,
      list: [],
      dialogFormVisible: false,
      showMaterialSelector: false,
      form: { ...formEmpty },
      rules: {
        name: [{ required: true, message: '请输入分类名', trigger: 'blur' }],
        imgUrl: [{ required: true, message: '请选择分类图片', trigger: 'blur' }]
      },
      imageUrl: '',
      disableParent: false // 添加子分类
    }
  },

  computed: {
    storeType () {
      // storeType   门店类型 0总部 1分公司 2门店
      return this.$store.getters.userInfo.storeType
    },
    isExpendCls () {
      return this.isExpendAll ? 'el-icon-caret-bottom' : 'el-icon-caret-top'
    }
  },

  created () {
    this.getList()
  },

  methods: {
    // 获取分类列表
    getList () {
      this.loading = true
      ApiProduct.getCategoryList().then(({ data }) => {
        // 移除空的childList属性，避免cascader展示错误
        removeEmptyChildren(data)

        // 禁用分类选择的第三层级
        this.disableThirdChild(data)

        // 数据格式化
        this.listDataFormat(data)

        this.list = data
        this.loading = false
      })
    },
    listDataFormat (list, itemFn) {
      if (!list || list.length === 0) return
      list.forEach(item => {
        item.isEditing = false
        item.rank_origin = item.rank
        itemFn && itemFn(item)
        this.listDataFormat(item.childList)
      })
    },
    // 添加分类
    handleAppend (node) {
      this.dialogFormVisible = true
      this.$refs.form && this.$refs.form.resetFields()
      this.disableParent = !!node || !!this.form.id
      // 重置编辑时的遗留数据
      this.form = { ...formEmpty }

      // 选中已有父级
      if (node) {
        // 子级分类层级
        this.form.level = node.level + 1
        this.form.parentId = this.getParentIds(node)
      } else {
        this.form.parentId = []
      }
    },
    // 获取包括当前id在内的父级id列表数组
    getParentIds (node, excludeCurrentNode) {
      const result = []
      let parent = node.parent
      if (!excludeCurrentNode) result.unshift(node.data.id)

      while (parent) {
        if (parent.level) result.unshift(parent.data.id)
        parent = parent.parent
      }
      return result
    },
    // 编辑分类
    handleEdit (node, data) {
      const { id, name, imgUrl } = data
      this.form = {
        id,
        name,
        imgUrl,
        level: node.level,
        parentId: this.getParentIds(node, true)
      }
      this.disableParent = true
      this.dialogFormVisible = true
    },
    // 删除分类
    handleRemove ({ id }) {
      this.$confirm('是否删除该分类以及其下所有子分类？', '提示').then(() => {
        ApiProduct.delCategory({ id }).then(({ message }) => {
          this.$message({ type: 'success', message })
          this.getList()
        })
      }).catch(e => e)
    },
    submit () {
      this.$refs.form.validate((valid) => {
        if (!valid) return false

        const { parentId: pids } = this.form
        const parentId = pids[pids.length - 1]
        this.submitting = true

        ApiProduct.addOrUpdateCategory({
          ...this.form,
          parentId
        }).then(({ message }) => {
          this.$message({ type: 'success', message })
          this.getList()
          this.dialogFormVisible = false
        }).finally(() => (this.submitting = false))
      })
    },
    // 展开全部
    expendAll () {
      this.isExpendAll = !this.isExpendAll
      const allNodes = this.$refs.categoryTree.store._getAllNodes()
      allNodes.forEach(item => (item.expanded = this.isExpendAll))
    },
    materialSelectorChanged (data) {
      this.$refs.imgUrl.clearValidate()
      this.form.imgUrl = data[0].imgUrl
      this.showMaterialSelector = false
    },
    disableThirdChild (list) {
      if (!list) return
      list.forEach(item => {
        if (item.level === 3) {
          item.disabled = true
        }
        if (!item.childList || item.childList.length !== 0) {} else this.disableThirdChild(item.childList)
      })
    },
    cancelRankEdit (node) {
      node.isEditing = false
      node.rank = node.rank_origin
    },
    rankFiledToEdit (data) {
      this.listDataFormat(this.list)
      data.isEditing = true
    },
    handleRankEdit (node, data) {
      node.isEditing = true
      if (this.submitting) return

      this.isEditing = true
      ApiProduct.addOrUpdateCategory({ ...data }).then(({ message }) => {
        this.$message({ type: 'success', message })
        this.submitting = false
        this.getList()
      }).finally(() => (this.submitting = false))
    }
  }
}
</script>

<style lang="scss">
  .goods-category {
    .el-tree-node__content {
      height: 50px;
      cursor: default;
    }

    .el-tree > .el-tree-node > .el-tree-node__content {
      border-bottom: 1px solid $--table-border-color;
    }

    .uploader {
      width: 128px;
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      &:hover {
        border-color: #409eff;
      }

      &.uploaded {
        border: none;
      }

      .uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 128px;
        height: 128px;
        line-height: 128px;
        text-align: center;
      }

       .avatar {
        width: 128px;
        height: 128px;
        display: block;
      }
    }

    .upload-tips {
      font-size: 12px;
      color: $--color-text-placeholder;
    }
  }
</style>

<style lang="scss" scoped>
  .tree-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: bold;
    color: $--table-header-color;
    background-color: $--table-header-background;
    line-height: 50px;
    font-size: 14px;
    padding: 0 8px;
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
    .node-img {
      width: 40px;
      height: 40px;
    }
  }

  .tree-header,
  .custom-tree-node {
    .node-header {
      max-width: 500px;
    }
    .node-tail {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      .td-sort {
        width: 200px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .td-img {
        width: 200px;
        text-align: center;
      }
      .td-operate {
        width: 200px;
        text-align: center;
      }
      .sort-wrap {
        min-width: 150px;
        display: flex;
        align-items: center;
        justify-content: center;
        .name-input {
          width: 150px;
        }
        &:hover {
          .el-icon-edit-outline {
            display: inline-block !important;
          }
        }
        .icons {
          margin-left: 5px;
          font-size: 16px;
          color: $--color-primary;
          vertical-align: -2px;
          cursor: pointer;
          &.el-icon-edit-outline {
            display: none;
          }
        }
      }
    }
  }
</style>
