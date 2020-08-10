<template>
  <div class="page-customer">
    <!--搜索-->
    <div class="ui-search-header-block mb10">
      <el-form
        :inline="true"
        label-width="120px">
        <select-store
          style="display: inline-block;margin-bottom: 10px;"
          labelwidth="120px"
          @change="changeSelectStore" />
        <div
          class="mb10 ml10 mr10"
          style="display: inline-block; vertical-align: top;">
          <el-input
            v-model="searchVal"
            style="width: 290px;"
            placeholder="请输入内容"
            class="input-with-select">
            <el-select
              slot="prepend"
              v-model="searchKey"
              class="w100"
              placeholder="请选择">
              <!--
              <el-option
                label="用户账号"
                value="wxOpenid"/>
-->
              <el-option
                label="手机号"
                value="mobile" />
              <el-option
                label="昵称"
                value="nickName" />
            </el-select>
          </el-input>
        </div>
        <el-form-item
          label="距离上次登录超过">
          <el-select
            v-model="lastLoginTime"
            style="width: 179px">
            <el-option
              value=""
              label="不限" />
            <el-option
              value="7"
              label="7天" />
            <el-option
              value="15"
              label="15天" />
            <el-option
              value="30"
              label="30天" />
          </el-select>
        </el-form-item>
        <el-form-item
          label="距离上次购买超过">
          <el-select
            v-model="lastBuyTime"
            style="width: 179px">
            <el-option
              value=""
              label="不限" />
            <el-option
              value="7"
              label="7天" />
            <el-option
              value="15"
              label="15天" />
            <el-option
              value="30"
              label="30天" />
          </el-select>
        </el-form-item>
      </el-form>
      <el-button
        class="btn-search"
        type="primary"
        icon="el-icon-search"
        @click="searchFn"
      >搜索
      </el-button>
    </div>
    <div class="btn-export-wrap">
      <el-date-picker
        v-model="time"
        :default-time="['00:00:00', '23:59:59']"
        value-format="yyyy-MM-dd HH:mm:ss"
        type="datetimerange"
        size="small"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期" />
      <el-button
        class="btn-export mb10 ml10"
        type="primary"
        size="small"
        @click="userExport"
      >导出
      </el-button>
    </div>

    <el-form
      label-width="120px"
      style="display: none">
      <el-row
        type="flex"
        justify="space-between">
        <el-row type="flex">
          <el-form-item
            label="距离上次登录超过">
            <el-select
              v-model="lastLoginTime">
              <el-option
                value=""
                label="不限" />
              <el-option
                value="7"
                label="7天" />
              <el-option
                value="15"
                label="15天" />
              <el-option
                value="30"
                label="30天" />
            </el-select>
          </el-form-item>
          <el-form-item
            label="距离上次购买超过">
            <el-select
              v-model="lastBuyTime">
              <el-option
                value=""
                label="不限" />
              <el-option
                value="7"
                label="7天" />
              <el-option
                value="15"
                label="15天" />
              <el-option
                value="30"
                label="30天" />
            </el-select>
          </el-form-item>
        </el-row>
        <el-row type="flex">
          <el-input
            v-model="searchVal"
            placeholder="请输入内容"
            class="input-with-select select-w">
            <el-select
              slot="prepend"
              v-model="searchKey"
              placeholder="请选择">
              <el-option
                label="用户账号"
                value="wxOpenid" />
              <el-option
                label="昵称"
                value="nickName" />
              <el-option
                label="手机号"
                value="mobile" />
            </el-select>
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchFn" />
          </el-input>
        </el-row>
      </el-row>
    </el-form>
    <!--列表-->
    <el-table
      :data="listData">
      <!--
      <el-table-column
        prop="wxOpenid"
        label="用户账号"
        width="240"
        align="center"/>
-->
      <el-table-column
        prop="mobile"
        label="手机号"
        align="center" />
      <el-table-column
        prop="createTime"
        label="注册时间"
        width="160"
        align="center" />
      <!--
      <el-table-column
        prop="wechatNumber"
        label="微信"
        align="center"/>
-->
      <el-table-column
        prop="nickName"
        label="昵称"
        align="center" />
      <el-table-column
        prop="orderAmount"
        label="订单金额"
        align="center" />
      <!--
      <el-table-column
        prop="_channel"
        label="渠道"
        align="center"/>
-->
      <el-table-column
        prop="userName"
        label="所属员工"
        align="center" />
      <!--fixed="right"-->
      <!--v-if="false"-->
      <el-table-column
        label="操作"
        width="110px"
        align="center">
        <template slot-scope="scope">
          <!--不?允许手动修改所属门店-->
          <el-button
            type="text"
            size="small"
            @click="modifyFn1(scope.row)">修改所属员工
          </el-button>
          <!--<el-button
            type="text"
            size="small">查看
          </el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <div class="g-pagination-wrap">
      <el-pagination
        :current-page="currentPage"
        :page-sizes="$store.state.app.pageSizes"
        :page-size="pageSize"
        :total="total"
        :layout="$store.state.app.layout"
        @size-change="sizeChange"
        @current-change="pageChange"
      />
    </div>
    <!--分配弹层-->
    <el-dialog
      :visible.sync="showModify"
      title="分配所属员工"
      width="400px"
      @close="closeDialog">
      <el-form
        ref="dialogInfo"
        :model="dialogInfo"
        :rules="rules"
        label-width="100px"
        class="pl20">
        <el-form-item label="用户:">{{ nickName }}</el-form-item>
        <el-form-item label="现所属员工:">{{ userName }}</el-form-item>
        <el-form-item
          label="新所属门店:"
          prop="stores">
          <el-cascader
            :props="storeListProps"
            :options="storeList1"
            v-model="dialogInfo.stores"
            class="width2"
            @change="getAllempList" />
        </el-form-item>
        <el-form-item
          label="新所属员工:"
          prop="userId">
          <el-select
            v-model="dialogInfo.userId"
            placeholder="请选择所属员工">
            <el-option
              v-for="item in allempList"
              :key="item.id"
              :label="item.name || item.mobile"
              :value-key="item.name"
              :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>

      <span
        slot="footer"
        class="dialog-footer">
        <el-button
          size="small"
          @click="closeDialog">取 消</el-button>
        <el-button
          :loading="saveIng"
          type="primary"
          size="small"
          @click="save">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as ApiCustomer from '@/api/customer'
import { dateFormat } from '@/utils/index'
import SelectStore from '@/components/SelectStore'
import * as ApiStores from '@/api/stores'

export default {
  name: 'Customer',

  components: { SelectStore },

  data () {
    return {
      time: [dateFormat(new Date(), '{y}-{m}-{d}') + ' 00:00:00', dateFormat(new Date(), '{y}-{m}-{d}') + ' 23:59:59'],
      storeId: '',
      companyId: '',
      showModify: false,
      dialogInfo: {
        id: '',
        userId: '',
        storeId: '',
        companyId: '',
        stores: []
      },
      lastLoginTime: '',
      lastBuyTime: '',
      searchVal: '',
      searchKey: 'mobile',
      currentPage: 1,
      total: 0,
      pageSize: 10,
      listData: [],
      saveIng: false,
      allempList: [],
      nickName: '',
      userName: '',
      rules: {
        userId: [
          { required: true, message: '请选择所属员工', trigger: 'blur' }
        ],
        stores: [
          { required: true, message: '请选择所属门店', trigger: 'change' }
        ]
      },
      storeList: [],
      storeList1: [],
      storeListProps: {
        value: 'id',
        label: 'name',
        children: 'list'
      }
    }
  },
  mounted () {
  },
  created () {
    ApiStores.getSysuserStoreTree().then(({ data }) => {
      this.storeList1 = data || []
    })
    this.getList()
    ApiStores.getList().then(({ data }) => {
      this.storeList = data || []
    })
  },
  methods: {
    userExport () {
      ApiCustomer.userExport({
        beginTime: this.time[0],
        endTime: this.time[1],
        companyId: this.companyId,
        storeId: this.storeId,
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        [this.searchKey]: this.searchVal,
        lastLoginTime: this.lastLoginTime,
        lastBuyTime: this.lastBuyTime
      }, '会员列表导出')
    },
    getAllempList (val) {
      if (!val) return
      ApiCustomer.getAllempList({ storeId: val[1] }).then(({ data }) => {
        this.allempList = data
      })
    },
    changeSelectStore (val) {
      this.storeId = val.storeId || ''
      this.companyId = val.companyId || ''
    },
    getList () {
      ApiCustomer.getList({
        companyId: this.companyId,
        storeId: this.storeId,
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        [this.searchKey]: this.searchVal,
        lastLoginTime: this.lastLoginTime,
        lastBuyTime: this.lastBuyTime
      }).then(({ data = {} }) => {
        data.dataList = data.dataList || []
        data.dataList.forEach((item) => {
          item.wechatNumber = item.wechatNumber || '--'
          item.nickName = item.nickName || '--'
          item.userName = item.userName || '--'
          item.mobile = item.mobile || '--'
          item['_channel'] = item.channel ? '渠道' : '本地'
        })
        this.listData = data.dataList
        this.total = data.totalCount || 0
      })
    },
    searchFn () {
      this.currentPage = 1
      this.getList()
    },
    modifyFn1 (data) {
      this.dialogInfo = {
        id: data.id
      }
      this.nickName = data.nickName
      this.userName = data.userName
      this.showModify = true
    },
    closeDialog () {
      this.showModify = false
      this.$refs['dialogInfo'].resetFields()
      this.$refs['dialogInfo'].clearValidate()
    },
    save () {
      this.$refs['dialogInfo'].validate((valid) => {
        if (!valid) return
        this.saveIng = true
        const data = this.allempList.filter((item) => Number(item.id) === Number(this.dialogInfo.userId))[0]
        this.dialogInfo.companyId = this.dialogInfo.stores[0]
        this.dialogInfo.storeId = this.dialogInfo.stores[1]
        ApiCustomer.updateemp({ ...this.dialogInfo, userName: data.name }).then(({ code, message }) => {
          this.showModify = false
          this.saveIng = false
          this.$message({ type: 'success', message: message })
          this.searchFn()
        }, () => {
          this.saveIng = false
        })
      })
    },
    sizeChange (e) {
      this.pageSize = e
      this.getList()
    },
    pageChange (val) {
      this.currentPage = val
      this.getList()
    }
  }
}
</script>
<style lang="scss">
  .btn-export-wrap {
    display: flex;
    justify-content: flex-end;
  }

  .page-customer {
    .input-with-select .el-input-group__prepend {
      background-color: #fff;
    }
  }
</style>
