<template>
  <div>
    <!--搜索-->
    <div style="display: -webkit-box; -webkit-box-pack: end;">
      <el-input
        v-model="input1"
        placeholder="请输入内容"
        style="width: 400px"
        class="input-with-select select-w">
        <el-select
          slot="prepend"
          v-model="select1"
          style="width: 120px"
          placeholder="请选择">
          <el-option
            label="操作人"
            value="operator"/>
          <el-option
            label="操作内容"
            value="content"/>
            <!--<el-option
            label="IP地址"
            value="ip"/>-->
        </el-select>
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="searchFn"/>
      </el-input>
    </div>
    <!--列表-->
    <el-table
      :data="tableData"
      class="mt20"
    >
      <el-table-column
        prop="createAt"
        label="操作人"
        align="center"/>
      <el-table-column
        prop="content"
        label="操作内容"
        align="center"/>
      <el-table-column
        prop="createTime"
        label="操作时间"
        align="center"/>
      <el-table-column
        prop="_status"
        label="操作状态"
        align="center"/>
        <!--<el-table-column
        prop="ip"
        label="IP地址"
        align="center"/>-->

    </el-table>
    <!--分页-->
    <div class="g-pagination-wrap">
      <el-pagination
        :current-page="pageNum"
        :page-sizes="$store.state.app.pageSizes"
        :page-size="pageSize"
        :total="total"
        :layout="$store.state.app.layout"
        @size-change="sizeChange"
        @current-change="pageChange"
      />
    </div>
  </div>
</template>

<script>
import { getList } from '@/api/logs'

export default {
  name: 'Logs',
  data () {
    return {
      select1: '',
      input1: '',
      tableData: [],
      pageNum: 1,
      pageSize: 10,
      total: 10
    }
  },
  mounted () {
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      let params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      if (this.select1) {
        params[this.select1] = this.input1
      }
      getList(params).then(({ data }) => {
        data.dataList = data.dataList || []
        data.dataList.forEach((item) => {
          item['_status'] = item.status === 200 ? '成功' : '失败'
        })
        this.tableData = data.dataList
        this.total = data.totalCount || 0
      })
    },
    searchFn () {
      this.getList()
    },
    sizeChange (e) {
      this.pageSize = e
      this.getList()
    },
    pageChange (val) {
      this.pageNum = val
      this.getList()
    }
  }
}
</script>
<style lang="scss">
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
</style>
