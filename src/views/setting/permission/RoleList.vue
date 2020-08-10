<template>
  <div class="page-role-list">
    <el-tabs
      v-model="activeTabName"
      type="border-card"
      @tab-click="tabClick">
      <el-tab-pane
        label="员工账户列表"
        name="first"/>
      <el-tab-pane
        label="角色管理列表"
        name="second">
        <div
          class="fun-wrap pb20"
          style="display: -webkit-box; -webkit-box-pack: justify;">
          <router-link
            :to="{ name: 'RoleEdit' }"
            class="pr10">
            <el-button
              type="primary"
              icon="el-icon-plus">创建新角色</el-button>
          </router-link>
          <div style="width: 400px;">
            <el-input
              v-model="searchVal"
              placeholder="请输入角色名查询"
              class="input-with-select">
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="onSearch"/>
            </el-input>
          </div>
        </div>
        <el-table :data="listData">
          <el-table-column
            prop="name"
            label="角色名称" />
          <el-table-column
            label="操作"
            width="90"
            fixed="right">
            <template slot-scope="scope">
              <router-link
                :to="{ name: 'RoleEdit', query: {id: scope.row.id} }"
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
    </el-tabs>
  </div>
</template>

<script>
import * as ApiRole from '@/api/role'
export default {
  name: 'PermissionRoleList',
  data () {
    return {
      activeTabName: 'second',
      searchVal: '',
      currentPage: 1,
      pageSize: 10,
      totalCount: 0,
      listData: []
    }
  },
  mounted () {
    this.getRoleList()
  },
  methods: {
    tabClick ({ index }) {
      if (index === String(0)) {
        this.$router.push('/setting/permission')
      }
    },
    getRoleList () {
      ApiRole.getRolelist2({ name: this.searchVal, pageSize: this.pageSize, pageNum: this.currentPage }).then(({ data = {} }) => {
        this.listData = data.dataList || []
        this.totalCount = data.totalCount || 0
      })
    },
    sizeChange (e) {
      this.pageSize = e
      this.getRoleList()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getRoleList()
    },
    onSearch () {
      this.currentPage = 1
      this.getRoleList()
    },
    deleteItem (id) {
      this.$confirm('确定删除吗?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
        ApiRole.deleteRole({ id }).then(({ code, message = '' }) => {
          this.$message({ type: (code === 'SUCCESS' ? 'success' : 'error'), message: message })
          if (code === 'SUCCESS') {
            this.currentPage = 1
            this.getRoleList()
          }
        }).catch(() => {})
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss">
  .page-role-list-list {
    .el-select .el-input {
      width: 110px;
    }
    .input-with-select .el-input-group__prepend {
      background-color: #fff;
    }
  }
</style>
