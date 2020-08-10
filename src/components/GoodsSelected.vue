<!--商品查看-->
<template>
  <div>
    <el-dialog
      :visible="visible"
      :before-close="close"
      append-to-body
      width="900px"
      title="查看商品">
      <el-table
        :data="listData"
        tooltip-effect="dark">
        <el-table-column
          label="图片"
          align="center"
          width="110">
          <template slot-scope="scope">
            <img
              :src="scope.row.imgUrl"
              style="height: 35px; display: block">
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="名称">
          <template slot-scope="scope">
            <p class="name">{{ scope.row.name }}</p>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="productCode"
          label="编码"
          width="160"/>
      </el-table>

      <div class="g-pagination-wrap">
        <el-pagination
          :current-page="currentPage"
          :page-sizes="$store.state.app.pageSizes"
          :page-size="pageSize"
          :total="totalCount"
          :layout="$store.state.app.layout"
          @size-change="sizeChange"
          @current-change="handleCurrentChange"/>
      </div>

      <div
        slot="footer"
        class="dialog-footer">
        <el-button
          type="primary"
          @click="close">确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ApiProduct from '@/api/product'

export default {
  props: {
    defaultValue: {
      type: Array,
      default: () => []
    },
    visible: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      pageSize: 10,
      currentPage: 1,
      totalCount: 0,
      listData: []
    }
  },

  created () {
    this.getProduct()
  },

  methods: {
    getProduct () {
      if (this.defaultValue && this.defaultValue.length <= 0) return
      ApiProduct.productCouponlist({
        pids: this.defaultValue.join(','),
        pageNum: this.currentPage,
        pageSize: this.pageSize
      }).then(({ data }) => {
        this.listData = data.dataList || []
        this.totalCount = data.totalCount || 0
      })
    },

    sizeChange (e) {
      this.pageSize = e
      this.getProduct()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getProduct()
    },
    close () {
      this.$emit('update:visible', false)
    }
  }
}
</script>
