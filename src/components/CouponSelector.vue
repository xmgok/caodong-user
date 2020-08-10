<template>
  <div class="component-coupon-selector">
    <el-dialog
      :visible="visible"
      :before-close="close"
      width="900px"
      append-to-body
      title="优惠券选择">
      <div class="top-func">
        <el-input
          v-model="name"
          style="width: 400px;"
          size="small"
          placeholder="请输入优惠券名称搜索"
          class="">
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="searchFn"/>
        </el-input>
        <div class="text">已选<span>{{ multipleSelectionAll.length }}</span>件</div>
      </div>

      <el-table
        ref="multipleTable"
        :data="listData"
        tooltip-effect="dark"
        @selection-change="handleSelectionChange">
        <el-table-column
          v-if="multiple"
          type="selection"
          width="60"/>
        <el-table-column
          v-if="!multiple"
          label=""
          width="45">
          <template slot-scope="scope">
            <el-radio
              v-model="radioValue"
              :label="scope.row.id"
              @change.native="getTemplateRow(scope.$index,scope.row)"><span/></el-radio>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="name"
          min-width="150"
          label="名称"/>
        <el-table-column
          show-overflow-tooltip
          prop="price"
          label="面值"
          align="center"/>
        <el-table-column
          show-overflow-tooltip
          prop="usePrice"
          min-width="100"
          label="使用条件">
          <template slot-scope="scope">
            <template v-if="scope.row.useRule > 0">满{{ scope.row.usePrice }}元可使用</template>
            <template v-else>无门槛使用</template>
          </template>
        </el-table-column>
        <el-table-column
          label="领取条件"
          min-width="100">
          <template slot-scope="scope">
            <template v-if="scope.row.receiveRule > 0">限每人{{ scope.row.receiveTotal }}张</template>
            <template v-else>不限制领取</template>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="total"
          label="优惠券总数"
          min-width="100"
          align="center"/>
        <el-table-column
          show-overflow-tooltip
          label="有效期"
          width="320"
          align="center">
          <template slot-scope="scope">
            <template v-if="scope.row.useTime===1">{{ scope.row.beginTime }} - {{ scope.row.endTime }}</template>
            <template v-if="scope.row.useTime===2">领取后{{ scope.row.laterDay }}日内有效</template>
          </template>
        </el-table-column>
      </el-table>

      <div class="g-pagination-wrap">
        <el-pagination
          :current-page="currentPage"
          :page-sizes="$store.state.app.pageSizes"
          :page-size="pageSize"
          :total="total"
          :layout="$store.state.app.layout"
          @size-change="sizeChange"
          @current-change="pageChange"/>
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
import * as ApiCoupon from '@/api/coupon'

export default {
  name: 'CouponSelector',

  props: {
    type: {
      type: Number,
      default: 2
    },
    visible: {
      type: Boolean,
      default: false
    },
    defaultData: {
      type: Array,
      default: () => []
    },
    multiple: {
      type: Boolean,
      default: true
    }
  },

  data () {
    return {
      name: '',
      currentPage: 1,
      total: 0,
      pageSize: 10,
      listData: [],
      radioValue: '',
      multipleSelectionAll: [], // 所有选中的数据包含跨页数据
      multipleSelection: [], // 当前页选中的数据
      idKey: 'id' // 标识列表数据中每一行的唯一键的名称
    }
  },

  created () {
    this.getList()
    this.multipleSelectionAll = [].concat(this.defaultData)
    this.radioValue = this.defaultData[0] || ''
  },

  methods: {
    getList () {
      ApiCoupon.list({ name: this.name, type: this.type, pageNum: this.currentPage, pageSize: this.pageSize }).then(({ data }) => {
        this.listData = data.dataList || []
        this.total = data.totalCount || 0
        setTimeout(() => this.setSelectRow(), 50)
      })
    },
    sizeChange (e) {
      this.pageSize = e
      this.getList()
    },
    pageChange (e) {
      this.currentPage = e
      this.getList()
    },
    searchFn () {
      this.currentPage = 1
      this.getList()
    },

    handleSelectionChange (val) {
      this.multipleSelection = val.map((item) => item[this.idKey])
      setTimeout(() => this.changePageCoreRecordData(), 50)
    },
    getTemplateRow (index, val) {
      this.multipleSelection = [val[this.idKey]]
      this.multipleSelectionAll = [val[this.idKey]] // 修复单选可以选多个的bug。
      setTimeout(() => this.changePageCoreRecordData(), 50)
    },
    changePageCoreRecordData () {
      let idKey = this.idKey
      if (this.multipleSelectionAll.length <= 0) {
        this.multipleSelectionAll = this.multipleSelection
        return
      }

      this.multipleSelectionAll = Array.from(new Set(this.multipleSelectionAll.concat(this.multipleSelection)))

      let noSelectIds = []
      // 得到当前页没有选中的id
      this.listData.forEach(item => {
        if (this.multipleSelection.indexOf(item[idKey]) < 0) {
          noSelectIds.push(item[idKey])
        }
      })
      console.log(noSelectIds)
      this.multipleSelectionAll = this.multipleSelectionAll.filter((item) => noSelectIds.indexOf(item) <= -1)
    },
    setSelectRow () {
      if (!this.multipleSelectionAll || this.multipleSelectionAll.length <= 0) return

      // 标识当前行的唯一键的名称
      this.$refs.multipleTable && this.$refs.multipleTable.clearSelection()
      this.listData.forEach((item, index) => {
        if (this.multipleSelectionAll.indexOf(item[this.idKey]) >= 0) {
          this.$refs.multipleTable.toggleRowSelection(this.listData[index], true)
        }
      })
    },
    close () {
      this.$emit('update:visible', false)
    },
    submit () {
      const multipleSelectionAll = this.multipleSelectionAll
      if (multipleSelectionAll.length <= 0) {
        this.$emit('change', [])
        this.close()
        return
      }
      ApiCoupon.list({ ids: multipleSelectionAll.join(','), pageNum: 1, pageSize: multipleSelectionAll.length }).then(({ data }) => {
        this.$emit('change', data.dataList)
        this.close()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-dialog__body {
  padding: 5px 20px;
}

.top-func {
  padding-bottom: 20px;
  display: -webkit-box;
  -webkit-box-align: center;
  .text {
    -webkit-box-flex: 1;
    text-align: right;
    /*font-size: 18px;*/
    font-weight: bold;
    color: #333;
    span {
      font-size: 28px;
      padding: 0 5px;
    }
  }
}
</style>
