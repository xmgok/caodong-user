<template>
  <div>
    <el-table :data="tableData">
      <!--<el-table-column label="开启状态">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status"/>
        </template>
      </el-table-column>-->
      <el-table-column
        prop="pay_way"
        align="center"
        label="支付方式"/>
      <el-table-column
        prop="account"
        align="center"
        label="支付账号"/>
      <el-table-column
        prop="type1"
        align="center"
        label="类型">
        <!--<template slot-scope="scope">{{ scope.row.type1=='geren'?'个人':'系统' }}</template>-->
      </el-table-column>
      <el-table-column
        align="center"
        label="操作">
        <template slot-scope="scope">
          <router-link to="/setting/wxpay">
            <el-button
              type="text"
              size="small"
            >设置</el-button>
          </router-link>

          <!--<el-button
            v-else
            type="text"
            size="small"
          >用户认证</el-button>-->
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'PaymentSetting',
  data () {
    return {
      tableData: [
        {
          status: true,
          pay_way: '微信支付',
          account: '--',
          type1: '--'
        }
      ]
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>

</style>
