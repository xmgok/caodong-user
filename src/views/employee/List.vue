<template>
  <div class="employee-list">
    <div
      style="display: -webkit-box;"
      class="pb10">
      <div style="-webkit-box-flex: 1;">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="small"
          @click="modifyEmp"
        >
          添加员工
        </el-button>
        <el-button
          type="primary"
          class="ml5"
          size="small"
          @click="download2">员工信息导出
        </el-button>
      </div>
      <div style="display: -webkit-box;">
        <select-store
          class="mr10"
          labelwidth="60px"
          @change="changeSelectStore" />
        <el-input
          v-model="searchVal"
          placeholder="请输入内容"
          style="width:400px"
          class="input-with-select select-w">
          <el-select
            slot="prepend"
            v-model="searchKey"
            placeholder="请选择">
            <el-option
              label="手机号"
              value="mobile" />
            <el-option
              label="姓名"
              value="userName" />
            <el-option
              label="昵称"
              value="nickName" />
          </el-select>
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="searchFn" />
        </el-input>
      </div>
    </div>
    <!--v-if="+userInfo.storeType===0"-->
    <div
      class="export">
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
        type="primary"
        class="ml5"
        size="small"
        @click="download">员工业绩导出
      </el-button>
    </div>
    <el-table
      :data="listData"
    >
      <el-table-column
        prop="name"
        label="员工姓名"
        align="center" />
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        label="员工类型">
        <template slot-scope="{row}">
          {{ row.subType === 1?'虚拟导购':'门店导购' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="storeName"
        label="所属门店"
        align="center" />
      <el-table-column
        prop="mobile"
        label="手机号"
        align="center" />
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        label="员工职位">
        <template slot-scope="{row}">
          {{ +row.jobType === 1?'店长':'店员' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="加入时间"
        width="180"
        align="center" />
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        label="最近登录时间">
        <template slot-scope="{row}">
          {{ row.lastLoginTime || '-' }}
        </template>
      </el-table-column>
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
      <!--
      <el-table-column
        prop="achievement"
        label="本月业绩"
        align="center"/>
      <el-table-column
        prop="cusNumber"
        label="客户人数"
        align="center"/>
-->

      <el-table-column
        label="操作"
        fixed="right"
        width="60"
        align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="modifyEmp(scope.row)">修改
          </el-button>
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
        @current-change="pageChange" />
    </div>
    <el-dialog
      :visible.sync="showModify"
      :title="dialogInfo.id ? '修改员工信息' : '添加员工信息'"
      width="400px"
      @close="closeDialog">
      <el-form
        ref="dialogInfo"
        :model="dialogInfo"
        :rules="rules"
        label-width="100px">
        <el-form-item
          label="姓名"
          prop="name">
          <el-input
            v-model="dialogInfo.name"
            class="width2" />
        </el-form-item>
        <el-form-item
          label="手机"
          prop="mobile">
          <el-input
            v-model="dialogInfo.mobile"
            class="width2" />
        </el-form-item>
        <el-form-item
          label="工号"
          prop="empNumber">
          <el-input
            v-model="dialogInfo.empNumber"
            class="width2" />
        </el-form-item>

        <!--不?允许手动修改所属门店-->
        <!--:disabled="!!dialogInfo.id"-->
        <el-form-item
          label="所属门店"
          prop="stores">
          <el-cascader
            :props="storeListProps"
            :options="storeList"
            v-model="dialogInfo.stores"
            filterable
            class="width2" />
        </el-form-item>
        <el-form-item
          label="是否店长"
          prop="status">
          <el-radio-group v-model="dialogInfo.jobType">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="dialogInfo.id"
          label="是否离职"
          prop="status">
          <el-radio-group v-model="dialogInfo.status">
            <el-radio :label="0">是</el-radio>
            <el-radio :label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <div
        slot="footer"
        style="display: -webkit-box; -webkit-box-pack: end">
        <el-button
          size="small"
          @click="closeDialog">取 消
        </el-button>
        <el-button
          :loading="saveIng"
          type="primary"
          size="small"
          @click="save">保 存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as ApiEmployee from '@/api/employee'
import { dateFormat } from '@/utils/index'
import * as ApiCustomer from '@/api/customer'
import SelectStore from '@/components/SelectStore'
import * as ApiStores from '@/api/stores'
import { mapGetters } from 'vuex'

export default {
  name: 'Employee',
  components: { SelectStore },
  data () {
    let checkMobile = (rule, value, callback) => {
      if (!(/^[1][0-9]{10}$/.test(value))) {
        return callback(new Error('请输入有效的手机号码'))
      } else {
        callback()
      }
    }

    return {
      time: [dateFormat(new Date(), '{y}-{m}-{d}') + ' 00:00:00', dateFormat(new Date(), '{y}-{m}-{d}') + ' 23:59:59'],
      showModify: false,
      dialogInfo: {
        id: '',
        name: '',
        mobile: '',
        empNumber: '',
        storeId: '',
        companyId: '',
        status: 1,
        stores: [],
        jobType: 0
      },
      rules: {
        name: [
          { required: true, message: '请输入真实的姓名', trigger: 'blur' },
          { max: 8, message: '最多8个字', trigger: 'blur' }
        ],
        mobile: [
          { required: true, validator: checkMobile, trigger: 'blur' }
        ],
        empNumber: [
          { required: true, message: '请输入工号', trigger: 'blur' }
        ],
        stores: [
          { required: true, message: '请选择所属门店', trigger: 'change' }
        ]
      },
      storeList: [],
      lastLoginTime: '',
      storeIdKey: '',
      companyId: '',
      searchVal: '',
      searchKey: 'mobile',
      currentPage: 1,
      total: 0,
      pageSize: 10,
      listData: [],
      saveIng: false,
      storeListProps: {
        value: 'id',
        label: 'name',
        children: 'list'
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  created () {
    this.getList()
    ApiStores.getSysuserStoreTree().then(({ data }) => {
      this.storeList = data || []
    })
  },
  methods: {
    download () {
      ApiCustomer.achievementExport({
        beginTime: this.time[0],
        endTime: this.time[1],
        companyId: this.companyId,
        storeId: this.storeIdKey,
        [this.searchKey]: this.searchVal
      }, '员工业绩导出')
    },
    download2 () {
      ApiCustomer.empExport({
        beginTime: this.time[0],
        endTime: this.time[1],
        companyId: this.companyId,
        storeId: this.storeIdKey,
        [this.searchKey]: this.searchVal
      }, '员工信息导出')
    },
    changeSelectStore (val) {
      this.storeIdKey = val.storeId || ''
      this.companyId = val.companyId || ''
    },
    getList () {
      ApiEmployee.getList({
        storeIdKey: this.storeIdKey,
        companyId: this.companyId,
        pageNum: this.currentPage,
        storeId: this.storeId,
        pageSize: this.pageSize,
        [this.searchKey]: this.searchVal
      }).then(({ data }) => {
        this.listData = (data.dataList || []).map(item => {
          item.wechatNumber = item.wechatNumber || '--'
          item.nickName = item.nickName || '--'
          return item
        })
        this.total = data.totalCount || 0
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
    closeDialog () {
      this.showModify = false
      this.$refs['dialogInfo'].resetFields()
    },
    save () {
      this.$refs['dialogInfo'].validate((valid) => {
        if (!valid) return
        this.saveIng = true
        this.dialogInfo.companyId = this.dialogInfo.stores[0]
        this.dialogInfo.storeId = this.dialogInfo.stores[1]
        ApiEmployee.add({ ...this.dialogInfo }).then(({ code, message }) => {
          this.saveIng = false
          this.$message({ type: 'success', message: message })
          this.searchFn()
          this.closeDialog()
        }, () => {
          this.saveIng = false
        })
      })
    },
    modifyEmp (data = {}) {
      this.dialogInfo = Object.assign({
        type: 1,
        id: '',
        name: '',
        mobile: '',
        empNumber: '',
        storeId: '',
        companyId: '',
        status: 1,
        stores: [],
        jobType: 0
      }, data)
      if (data.companyId) {
        this.dialogInfo.stores = [this.dialogInfo.companyId, this.dialogInfo.storeId]
      }
      this.showModify = true
      setTimeout(() => {
        this.$refs['dialogInfo'].clearValidate()
      }, 1)
    }
  }
}
</script>
<style lang="scss" scoped>
  .export {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    border-top: 1px solid #eee;
    padding-top: 15px;
    margin-top: 10px;
    margin-bottom: 15px;
    margin-left: 5px;
  }

  .employee-list {
    .el-input .el-select {
      width: 120px;
    }

    .input-with-select .el-input-group__prepend {
      background-color: #fff;
    }

    .width2 {
      width: 250px
    }
  }
</style>
