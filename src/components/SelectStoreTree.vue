<template>
  <el-dialog
    :visible="visible"
    :before-close="close"
    width="900px"
    append-to-body
    title="门店选择">
    <!--
    <div class="flex mb18">
      <el-button
        class="mr5"
        size="mini"
        @click="selectAll">全选
      </el-button>
      <el-button
        class="mr5"
        size="mini"
        @click="selectReserve">反选
      </el-button>
      <el-button
        class="mr5"
        size="mini"
        @click="selectNo">不选
      </el-button>
    </div>
    -->
    <div class="flex flex-align-c flex-jc-sb">
      <el-checkbox
        v-model="isSelectedAll"
        :disabled="isDisabledAll"
        @change="change"
      >
        <span>全选</span>
        <span class="grey ml10">会选择全部门店，和右侧过滤不相关</span>
      </el-checkbox>
      <el-input
        v-model="filterText"
        class="width1"
        clearable
        placeholder="输入关键字进行过滤" />
    </div>
    <el-tree
      ref="tree"
      :filter-node-method="filterNode"
      :data="data2"
      :default-checked-keys="checked"
      :props="defaultProps"
      show-checkbox
      node-key="id"
      @check="check" />
    <div class="ui-edit-btn-wrapper">
      <el-button
        type="primary"
        @click="submit">确认
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import * as ApiStores from '@/api/stores'

export default {
  name: 'SelectStoreTree',
  props: {
    isDisabledAll: { // 是否全部禁用。
      type: Boolean,
      default: false
    },
    visible: {
      type: Boolean,
      default: false
    },
    defaultValue: {
      type: Array,
      default () {
        return []
      }
    },
    partInfo: {
      type: Object,
      default () {
        return {}
      }
    },
    isSetTimeout: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      filterText: '',
      isSelectedAll: false,
      checked: [],
      defaultProps: {
        children: 'list',
        label: 'name'
      },
      data2: [],
      data2FlatLength: ''
    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    },
    defaultValue (newValue) {
      this.checked = newValue.map(v => v.id)
    },
    partInfo: {
      handler (newValue, oldValue) {
        this.partInfo.isSetDefault = newValue.isSetDefault
        this.getStoreList()
      },
      deep: true
    }
  },
  created () {
    this.checked = this.defaultValue.map(v => v.id)
    this.getStoreList()
  },
  methods: {
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    check (a, b) {
      // :indeterminate="isIndeterminate"
      // indeterminate 属性用以表示 checkbox 的不确定状态，一般用于实现全选的效果
      this.isSelectedAll = b.checkedKeys.length === this.data2FlatLength
    },
    change (val) {
      if (val) {
        this.checked = []
        this.selectAll(this.data2)
      } else {
        this.noSelect()
      }
    },
    noSelect () {
      this.checked.forEach(v => {
        this.$refs.tree.setChecked(v, false)
      })
    },
    selectAll (data) {
      data.forEach(v => {
        if (!v.disabled) {
          this.checked.push(v.id)
        }
        if ((v.list || []).length) {
          this.selectAll(v.list)
        }
      })
    },
    disabledAll (data) {
      data.forEach(v => {
        v.disabled = true
        if ((v.list || []).length) {
          this.disabledAll(v.list)
        }
      })
    },
    close () {
      this.$emit('update:visible', false)
    },
    getStoreList () {
      if (this.partInfo.isSetDefault) {
        // 修复 - 运费模板-设为默认 时而全部门店，时而部分门店。原因：全门店接口响应太慢。覆盖了部分门店的响应数据。
        // 方案1：使用组件时，<select-store-tree上加v-if，如此，每次显示时都重新渲染。走created钩子。
        // 方案2：使用下述定时器。经测试1200毫秒，就难以复现了。
        if (this.isSetTimeout) {
          setTimeout(() => {
            ApiStores.getStoresListTree(this.partInfo.storeTreeList).then(({ data }) => {
              this.fnCommon(data)
            })
          }, 1200)
        } else {
          ApiStores.getStoresListTree(this.partInfo.storeTreeList).then(({ data }) => {
            this.fnCommon(data)
          })
        }
      } else {
        ApiStores.getSysuserStoreTree().then(({ data }) => {
          this.fnCommon(data)
        })
      }
    },
    fnCommon (data) {
      this.data2 = data || []
      if (this.isDisabledAll) {
        this.disabledAll(this.data2)
      }
      this.getData2IsSelectedAll(this.data2)
    },
    getData2FlatLength (data) {
      data.forEach(v => {
        this.data2FlatLength++
        if ((v.list || []).length) {
          this.getData2FlatLength(v.list)
        }
      })
    },
    getData2IsSelectedAll (data) {
      this.data2FlatLength = 0
      if (this.checked.length === 0) {
        this.isSelectedAll = false
        this.getData2FlatLength(data)
      } else {
        let num2 = 0
        const fn = (data) => {
          data.forEach(v => {
            this.data2FlatLength++
            if (v.type === 0) {
              num2++
            }
            if ((v.list || []).length) {
              fn(v.list)
            }
          })
        }
        fn(data)
        this.isSelectedAll = num2 === this.checked.length
      }
    },
    submit () {
      const checked = this.$refs.tree.getCheckedNodes().map(item => {
        return { id: item.id, type: item.type, parentId: item.parentId }
      })
      this.$emit('confirm', checked)
      this.close()
    }
  }
}
</script>

<style lang="scss">
</style>
