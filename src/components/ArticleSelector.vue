<template>
  <el-dialog
    :visible.sync="visible"
    :before-close="close"
    width="900px"
    append-to-body
    title="文章选择">

    <el-tabs type="border-card">
      <el-tab-pane
        :lazy="true"
        label="全部">
        <list
          ref="List"
          :is-multiple="isMultiple"
          :selected-ids="selectedIds"
          @change="change" />
      </el-tab-pane>
    </el-tabs>

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
</template>

<script>
import List from './article-selector/List'

export default {
  name: 'ArticleSelector',

  components: {
    List
  },

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    isMultiple: {
      type: Boolean,
      default: false
    },
    selectedIds: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      selectedArr: []
    }
  },

  methods: {
    close () {
      this.$emit('update:visible', false)
      this.$refs.List.search.title = ''
    },
    change (item) {
      this.selectedArr = item
    },
    submit () {
      this.close()
      this.$emit('change', this.selectedArr)
    }
  }
}
</script>

<style scoped>

</style>
