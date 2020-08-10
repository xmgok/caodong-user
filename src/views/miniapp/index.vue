<template>
  <div class="page-miniapp-index">

    <div class="goods-ware-house-container">
      <div class="mb10">
        <router-link
          :to="{ name: 'miniappAdd'}">
          <el-button
            type="primary"
            icon="el-icon-plus">新增模板
          </el-button>
        </router-link>
      </div>
    </div>

    <div class="ui-search-header-block mb10">
      <el-form
        ref="form"
        :inline="true"
        :model="searchForm"
        label-width="80px">
        <div>
          <select-store
            style="display: inline-block; margin-bottom: 10px"
            labelwidth="80px"
            selectwidth="250px"
            @change="changeSelectStore" />
          <el-form-item label="模板名称">
            <el-input
              v-model="searchForm.name"
              class="w250"/>
          </el-form-item>
        </div>
        <el-button
          class="btn-search"
          type="primary"
          icon="el-icon-search"
          @click="getList()"
        >搜索
        </el-button>
      </el-form>
    </div>

    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        align="center"
        prop="name"
        label="模板名称"
      />
      <el-table-column
        align="center"
        prop="updateTime"
        label="更新时间"
      />
      <el-table-column
        align="center"
        prop="address"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <div v-if="scope.row.isEdit === 1 ">
            <router-link
              :to="{name: 'miniappEdit', query: {id:scope.row.id} }"
              class="pr10">
              <el-button
                size="mini"
                type="text">编辑
              </el-button>
            </router-link>
            <el-button
              size="mini"
              type="text"
              @click="del(scope.row.id)">删除
            </el-button>
          </div>
          <router-link
            v-else
            :to="{name: 'miniappLook', query: {id:scope.row.id}}"
            class="pr10">
            <el-button
              class="ml10"
              size="mini"
              type="text">查看
            </el-button>
          </router-link>

        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
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
import SelectStore from '@/components/SelectStore'
import * as ApiMinapp from '@/api/minapp2'
import { dateFormat } from '@/utils'
export default {
  components: { SelectStore },
  data () {
    return {
      searchForm: {
        name: '', // 模板名称
        storeId: '',
        companyId: ''
      },
      tableData: [],
      search: {
        pageNum: 1,
        totalCount: 0,
        pageSize: 10
      }

    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      ApiMinapp.getHomeTemplate({ ...this.searchForm, ...this.search }).then(({ data }) => {
        this.tableData = (data.dataList || []).map((item) => {
          return {
            ...item,
            updateTime: item.updateTime ? dateFormat(item.updateTime) : '--'
          }
        })
        this.search.totalCount = data.totalCount || 0
      })
    },
    changeSelectStore (val) {
      this.searchForm.storeId = val.storeId || ''
      this.searchForm.companyId = val.companyId || ''
    },
    sizeChange (e) {
      this.search.pageSize = e
      this.getList()
    },
    pageChange (e) {
      this.search.pageNum = e
      this.getList()
    },
    del (id) {
      ApiMinapp.delTemplate({ id: id, type: 1 }).then(({ data }) => {
        const h = this.$createElement
        this.$msgbox({
          title: '提示',
          message: h('p', null, [
            h('span', null, `有${data}家门店正在使用当前模板，是否确认删除？`)
          ]),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true
              ApiMinapp.delTemplate({ id: id, type: 2 }).then(({ code, message = '' }) => {
                done()
                this.getList()
              }).catch(() => {
              })
              setTimeout(() => {
                instance.confirmButtonLoading = false
              }, 300)
            } else {
              done()
            }
          }
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
        })
      })
    }

  }

}
</script>
<style lang="scss" scoped>
.page-miniapp-index{

}

</style>
