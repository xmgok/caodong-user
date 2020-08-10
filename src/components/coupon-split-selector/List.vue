<template>
  <div>
    <div style="display: -webkit-box; -webkit-box-pack: justify;">
      <div />
      <el-input
        v-model="search.productCode"
        size="small"
        placeholder="输入商品编码查询"
        class="">
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="searchFn" />
      </el-input>
    </div>
    <el-table
      ref="table"
      :data="dataList"
      row-key="id"
      class="mt20"
      @row-click="rowClick"
      @selection-change="change">
      <!--多选-->
      <el-table-column
        v-if="isMultiple"
        :show-overflow-tooltip="true"
        reserve-selection
        type="selection"
        width="60"
        align="center" />
      <!--单选-->
      <el-table-column
        v-if="!isMultiple"
        :show-overflow-tooltip="true"
        width="55"
        align="center">
        <template slot-scope="scope">
          <el-radio
            v-model="mySelectedId"
            :label="scope.row.id"
            :disabled="see">&nbsp;
          </el-radio>
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        label="瓜分券名称">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        label="瓜分券方式"
        align="center">
        <template slot-scope="scope">
          {{ scope.row.distTypeDesc }}
        </template>
      </el-table-column>
      <el-table-column
        label="发放总量"
        align="center">
        <template slot-scope="scope">
          {{ scope.row.total }}
        </template>
      </el-table-column>
      <el-table-column
        label="剩余券数"
        align="center">
        <template slot-scope="scope">
          {{ scope.row.surplusNum }}
        </template>
      </el-table-column>
      <el-table-column
        label="活动时间"
        width="320"
        align="center">
        <template slot-scope="scope">
          {{ scope.row.issueTime }} - {{ scope.row.issueEndTime }}
        </template>
      </el-table-column>
      <el-table-column
        label="活动状态"
        min-width="100"
        align="center">
        <template slot-scope="scope">
          {{ scope.row.statusDesc }}
        </template>
      </el-table-column>
      <el-table-column
        label="成功瓜分券数"
        align="center">
        <template slot-scope="scope">
          {{ scope.row.receivedTotal }}
        </template>
      </el-table-column>
      <el-table-column
        label="参与人数"
        align="center">
        <template slot-scope="scope">
          {{ scope.row.joinNum }}
        </template>
      </el-table-column>
      <el-table-column
        label="已使用人数"
        align="center">
        <template slot-scope="scope">
          {{ scope.row.usedTotal }}
        </template>
      </el-table-column>
    </el-table>

    <div class="g-pagination-wrap">
      <el-pagination
        :current-page="search.pageNum"
        :page-sizes="$store.state.app.pageSizes"
        :page-size="search.pageSize"
        :total="search.totalCount"
        :layout="$store.state.app.layout"
        @size-change="sizeChange"
        @current-change="pageChange" />
    </div>
  </div>
</template>

<script>
import * as ApiGroup from '@/api/coupon-split'
import * as Validate from '@/utils/validate'

export default {
  props: {
    type: {
      type: String,
      default: ''
    },
    isMultiple: {
      type: Boolean,
      default: false
    },
    see: {
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
      mySelectedId: +this.selectedIds[0],
      mySelectedIds: this.selectedIds,
      showEditItem: false,
      editItemForm: {
        id: '',
        num: ''
      },
      editItemFormRules: {
        num: [
          { required: true, message: '本项必填' },
          {
            validator: (rule, value, callback) => Validate.limitNumber(rule, value, callback, { min: 1 }),
            trigger: 'blur'
          }
        ]
      },
      activeId: 0,
      isShowActiveData: false,
      search: {
        productCode: '',
        pageNum: 1,
        totalCount: 0,
        pageSize: 10
      },
      dataList: []
    }
  },

  watch: {
    selectedIds (newVal) {
      if (!this.isMultiple) {
        this.mySelectedId = +newVal[0] // 单选
      } else {
        this.mySelectedIds = newVal // 多选
      }
    },
    mySelectedId (newValue) { // 单选
      if (!this.isMultiple) {
        this.$emit('change', [+newValue])
      }
    }
  },

  mounted () {
    this.getList()
  },
  methods: {
    rowClick (row) {
      if (!this.isMultiple) {
        this.mySelectedId = +row.id // 单选
      } else {
        this.$refs['table'].toggleRowSelection(row) // 多选
      }
    },
    change (item) { // 多选
      if (this.mySelectedIds.length) { // 编辑
        // const itemIds = [...new Set(item.map(v => v.id))] // 手动触发选中时，item会越来越多。所以要去重。
        const itemIds = item.map(v => v.id)
        const noSelectedData = []
        this.dataList.forEach((v) => {
          if (itemIds.indexOf(v.id) === -1) { // 找到当前页没被选中的数据
            noSelectedData.push(v.id)
          }
        })
        // 过滤掉当前页没被选中的。
        this.mySelectedIds.forEach((v1, i1, a1) => {
          noSelectedData.forEach(v2 => {
            if (v1 === v2) {
              a1[i1] = -1
            }
          })
        })
        this.mySelectedIds = this.mySelectedIds.filter(v => v !== -1)
        this.mySelectedIds = [...new Set(this.mySelectedIds.concat(item.map(v => v.id)))] // 把当前被选中的，和之前被选中的进行合并。并去重。
        this.$emit('change', this.mySelectedIds)
      } else { // 新增
        this.$emit('change', item.map(v => v.id))
      }
    },
    itemSave () {
      this.$refs['editItemFormRef'].validate((valid) => {
        if (!valid) return
        ApiGroup.updatenum(this.editItemForm).then(() => {
          this.getList()
          this.showEditItem = false
        })
      })
    },
    getList () {
      ApiGroup.list({
        ...this.search,
        status: this.type
      }).then(({ data }) => {
        this.dataList = data.dataList || []
        this.search.totalCount = data.totalCount || 0
        // 多选回显处理
        if (this.isMultiple) {
          const selected = this.dataList.filter(v => {
            return this.mySelectedIds.indexOf(v.id) !== -1
          })
          selected.forEach((v) => {
            if (!this.test) {
              this.test = {}
            }
            if (!this.test[v.id]) {
              this.test[v.id] = true // 防止change时的item越来越多。
              this.$refs['table'].toggleRowSelection(v)
            }
          })
        }
      })
    },
    sizeChange (e) {
      this.search.pageSize = e
      this.getList()
    },
    pageChange (e) {
      this.search.pageNum = e
      this.getList()
    },
    searchFn () {
      this.search.pageNum = 1
      this.getList()
    }
  }
}
</script>

<style scoped lang="scss">
  .goods {
    display: flex;
    font-size: 12px;
    line-height: 1;

    .goods-img {
      min-width: 50px;
      width: 50px;
      height: 50px;
    }

    .goods-label {
      font-weight: bold;
    }

    .goods-content {
      margin-left: 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .goods-content-name {
      display: flex;
      margin-bottom: 5px;
    }

    .goods-content-spec {
      display: flex;
      flex-wrap: wrap;
    }

    .goods-content-spec-item {
      margin-right: 10px;
      margin-bottom: 10px;
    }
  }

  .qr-img {
    width: 174px;
    height: 174px;
    margin: 0 auto;
    display: block;
  }
</style>
