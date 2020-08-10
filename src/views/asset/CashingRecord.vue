<template>
  <div>
    <el-table
      :data="tableData"
    >
      <el-table-column
        prop="time1"
        label="提现时间"
        align="center"
      />
      <el-table-column
        prop="amount"
        label="提现金额"
        align="center"
      />
      <el-table-column
        prop="liquid_no"
        label="收支流水号"
        align="center"
      />
      <el-table-column
        prop="remark"
        label="备注"
        align="center"
      />

    </el-table>
    <div class="g-pagination-wrap">
      <el-pagination
        :current-page="currentPage"
        :page-sizes="$store.state.app.pageSizes"
        :page-size="100"
        :total="400"
        :layout="$store.state.app.layout"
        @size-change="sizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'CashingRecord',
  data () {
    return {
      tableData: [
        {
          liquid_no: '232212121',
          remark: '订单入账',
          time1: '2016-11-07 15:47',
          amount: '￥23.44'
        }, {
          liquid_no: '232212121',
          remark: '订单入账',
          time1: '2016-11-07 15:47',
          amount: '￥23.44'
        }, {
          liquid_no: '232212121',
          remark: '订单入账',
          time1: '2016-11-07 15:47',
          amount: '￥23.44'
        }, {
          liquid_no: '232212121',
          remark: '订单入账',
          time1: '2016-11-07 15:47',
          amount: '￥23.44'
        }
      ],
      currentPage: 1
    }
  },
  mounted () {
    console.log('gaoke')
  },
  methods: {
    sizeChange (e) {
      console.log(e)
    },
    handleCurrentChange (e) {
      console.log(e)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
