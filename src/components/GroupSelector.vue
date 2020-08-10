<template>
  <el-dialog
    :visible.sync="visible"
    :before-close="close"
    width="900px"
    append-to-body
    title="拼团选择">

    <el-tabs type="border-card">
      <!--<el-tab-pane
        :lazy="true"
        label="未开始">
        <list
          :is-multiple="isMultiple"
          :selected-ids="selectedIds"
          type="1"
          @change="change" />
      </el-tab-pane>-->
      <el-tab-pane
        :lazy="true"
        label="进行中">
        <list
          :is-multiple="isMultiple"
          :selected-ids="selectedIds"
          type="2"
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
import List from './group-selector/List'

export default {
  name: 'GroupSelector',

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
