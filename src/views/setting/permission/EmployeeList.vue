<template>
  <div class="page-employee-list">
    <el-tabs
      type="border-card"
      @tab-click="tabClick">
      <el-tab-pane label="员工账户列表">
        <div
          class="fun-wrap pb20"
          style="display: -webkit-box; -webkit-box-pack: justify;">
          <router-link
            :to="{ name: 'EmployeePermit' }"
            class="pr10">
            <el-button
              type="primary"
              icon="el-icon-plus">创建新员工</el-button>
          </router-link>
          <div style="display: -webkit-box; -webkit-box-pack: end;">
            <el-select
              v-model="storeType"
              clearable
              class="mr10"
              style="width: 150px;"
              placeholder="请选择权限">
              <el-option
                label="总部权限"
                value="0"/>
              <el-option
                label="分公司权限"
                value="1"/>
              <el-option
                label="门店权限"
                value="2"/>
            </el-select>
            <div>
              <el-input
                v-model="searchVal"
                placeholder="请输入详细查询"
                class="input-with-select">
                <el-select
                  slot="prepend"
                  v-model="searchType"
                  style="width: 110px;"
                  placeholder="请选择">
                  <el-option
                    label="员工账号"
                    value="mobile"/>
                  <el-option
                    label="员工姓名"
                    value="name"/>
                </el-select>
                <el-button
                  slot="append"
                  icon="el-icon-search"
                  @click="onSearch"/>
              </el-input>
            </div>
          </div>
        </div>

        <el-table
          :data="listData">
          <el-table-column
            prop="mobile"
            label="员工账号" />
          <el-table-column
            prop="name"
            label="员工姓名" />
          <el-table-column
            :show-overflow-tooltip="true"
            label="角色（数量）">
            <template slot-scope="scope">
              {{ scope.row.roleNames }}({{ scope.row._roleNames.length }}个)
            </template>
          </el-table-column>
          <el-table-column label="开启状态">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                @change="changeStatus(scope.row.status, scope.row.id)"/>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="90"
            fixed="right">
            <template slot-scope="scope">
              <router-link
                :to="{ name: 'EmployeePermit', query: {id: scope.row.id} }"
                class="pr10">
                <el-button
                  type="text"
                  size="small">编辑</el-button>
              </router-link>
              <el-button
                type="text"
                size="small"
                @click="deleteItem(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
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
      </el-tab-pane>
      <el-tab-pane label="角色管理列表"/>
    </el-tabs>

  </div>
</template>

<script>
import * as ApiSysuser from '@/api/sysuser'

export default {
  name: 'PermissionEmployeeList',
  data () {
    return {
      storeType: '',
      searchVal: '',
      searchType: 'mobile',
      currentPage: 1,
      pageSize: 10,
      totalCount: 0,
      listData: []
    }
  },
  mounted () {
    this.getSysuserList()
  },
  methods: {
    tabClick ({ index }) {
      if (index === String(1)) {
        this.$router.push('/setting/permission/role')
      }
    },
    getSysuserList () {
      let params = {
        pageSize: this.pageSize,
        pageNum: this.currentPage,
        storeType: this.storeType
      }
      params[this.searchType] = this.searchVal
      ApiSysuser.getSysuserList(params).then(({ data = {} }) => {
        data.dataList = data.dataList || []
        data.dataList.forEach((item) => {
          item.status = item.status > 0
          item['_roleNames'] = (item.roleNames || '').split(',')
        })
        this.listData = data.dataList
        this.totalCount = data.totalCount || 0
      })
    },
    sizeChange (e) {
      this.pageSize = e
      this.getSysuserList()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getSysuserList()
    },
    onSearch () {
      this.currentPage = 1
      this.getSysuserList()
    },
    deleteItem (id) {
      this.$confirm('确定删除吗?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
        ApiSysuser.deleteSysuser({ id }).then(({ code, message = '' }) => {
          this.$message({ type: (code === 'SUCCESS' ? 'success' : 'error'), message: message })
          if (code === 'SUCCESS') {
            this.currentPage = 1
            this.getSysuserList()
          }
        }).catch(() => {})
      }).catch(() => {})
    },
    changeStatus (status, id) {
      status = status ? 1 : 0
      ApiSysuser.updatestatus({ status, id }).then(({ message }) => {
        this.$message({ type: 'success', message: message })
      }, () => {})
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss">
.page-employee-list {

  .el-select .el-input {
    /*width: 150px;*/
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
}
</style>
