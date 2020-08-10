<template>
  <div class="page-employee-message">
    <el-tabs type="border-card">
      <el-tab-pane
        :lazy="lazy"
        label="全部">
        <!--条件筛选-->
        <div
          class="ui-search-header-block dark">
          <el-form
            :inline="true"
            label-width="80px">
            <el-form-item>
              <router-link
                :to="{ name: 'EmployeeMessageDetail', query: {} }">
                <el-button
                  class="ml10"
                  type="primary"
                  icon="el-icon-plus"
                >添加通知
                </el-button>
              </router-link>
            </el-form-item>
            <el-form-item>
              <select-store
                style="display: inline-block;"
                labelwidth="80px"
                selectwidth="250px"
                @change="changeSelectStore" />
            </el-form-item>
            <el-form-item label="通知名称">
              <el-input
                v-model="searchForm.name"
                placeholder="请输入通知名称"
                style="width:250px"
              />
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

        <!-- table -->
        <el-table
          :data="list"
          class="mt20">
          <el-table-column
            prop="title"
            show-overflow-tooltip
            align="center"
            label="通知名称"/>
          <el-table-column
            prop="sendTime"
            show-overflow-tooltip
            align="center"
            label="发送时间"/>
          <el-table-column
            label="操作"
            fixed="right"
            width="160"
            align="center">
            <template slot-scope="scope">
              <!-- <el-button
                  class="ml10"
                  type="text"
                  size="small"
                  @click="changeState(row.id,'cancel')">撤回
                </el-button> -->
              <el-button
                class="ml10"
                type="text"
                size="small"
                @click="$router.push({path:'/employee/message-detail',query: {id:scope.row.id}})"
              >查看
              </el-button>
              <el-button
                class="ml10"
                type="text"
                size="small"
                @click="changeState(scope.row.id,'del')">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <!-- 分页 -->
      <div class="g-pagination-wrap">
        <el-pagination
          :current-page="searchForm.pageNum"
          :page-sizes="$store.state.app.pageSizes"
          :page-size="searchForm.pageSize"
          :total="searchForm.totalCount"
          :layout="$store.state.app.layout"
          @size-change="sizeChange"
          @current-change="pageChange" />
      </div>
    </el-tabs>
  </div>
</template>

<script>
import SelectStore from '@/components/SelectStore'
import * as ApiEmployee from '@/api/employee'
export default {
  name: 'EmployeeMessage',
  components: { SelectStore },
  data () {
    return {
      lazy: true,
      searchForm: {
        name: '',
        storeId: '',
        companyId: '',
        pageNum: 1,
        pageSize: 10
      },
      totalCount: 0,
      // 数据
      list: [
      ]
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      ApiEmployee.getMessageList(
        this.searchForm
      ).then(({ data }) => {
        this.list = (data.dataList || []).map(item => {
          item.title = item.title || '--'
          item.sendTime = item.sendTime || '--'
          item.sendType = +item.sendType === 1 ? '立即发送' : '定时发送' || '--'
          return item
        })
        this.totalCount = data.totalCount || 0
      })
    },
    sizeChange (e) {
      this.searchForm.pageSize = e
      this.getList()
    },
    pageChange (e) {
      this.searchForm.pageNum = e
      this.getList()
    },
    searchFn () {
      this.searchForm.pageNum = 1
      this.getList()
    },
    changeSelectStore (val) {
      this.searchForm.storeId = val.storeId || ''
      this.searchForm.companyId = val.companyId || ''
    },
    changeState (id, type) {
      switch (type) {
        case 'cancel':
          // ApiOrder.check(params).then((res) => {
          //   this.clicking = false
          //   this.$message.success('操作成功')
          //   this.getList()
          //   this.closeOperationForm()
          // }).catch(() => {
          // })
          break
        case 'del':
          console.log(id)
          this.$confirm('确定删除吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            ApiEmployee.delMessageList({ id: id }).then(({ message = '' }) => {
              this.searchForm.pageNum = 1
              this.getList()
              this.$message({ type: 'success', message: message })
            }, () => {
            })
          }).catch(() => {
          })
          break

        default:
          break
      }
    }
  }
}
</script>

<style lang="scss">
</style>
