<template>
  <div>
    <el-dialog
      :visible.sync="visible"
      :before-close="close"
      title="添加直播员工"
      width="1200px">
      <el-form
        :inline="true"
        label-width="80px">
        <el-form-item>
          <select-store
            style="display: inline-block;"
            labelwidth="80px"
            selectwidth="250px"
            @change="changeSelectStore"/>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="searchVal"
            placeholder="请输入内容"
            style="width:400px">
            <el-select
              slot="prepend"
              v-model="searchKey"
              style="width:100px"
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
      </el-form-item></el-form>
      <el-table
        :data="list"
        :loading="loading"
        size="small"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55"/>
        <el-table-column
          align="center"
          prop="name"
          show-overflow-tooltip
          label="员工姓名"
          min-width="150"/>
        <el-table-column
          align="center"
          label="员工类型"
          show-overflow-tooltip
          min-width="120">
          <template slot-scope="{row}">
            {{ row.subType === 1?'虚拟导购':'门店导购' }}
        </template></el-table-column>
        <el-table-column
          align="center"
          prop="storeName"
          show-overflow-tooltip
          label="所属门店"
          width="150"/>
        <el-table-column
          align="center"
          prop="mobile"
          label="手机号"
          show-overflow-tooltip
          min-width="120"/>
        <el-table-column
          align="center"
          prop="createTime"
          min-width="120"
          show-overflow-tooltip
          label="加入时间"/>
        <el-table-column
          align="center"
          prop="nickName"
          show-overflow-tooltip
          label="昵称"
          min-width="200"/>
      </el-table>

      <!-- 分页 -->
      <div class="g-pagination-wrap">
        <el-pagination
          :current-page="searchForm.pageNum"
          :page-sizes="$store.state.app.pageSizes"
          :page-size="searchForm.pageSize"
          :total="totalCount"
          :layout="$store.state.app.layout"
          @size-change="sizeChange"
          @current-change="pageChange"
        />

        <div class="ui-edit-btn-wrapper">
          <template >
            <el-button
              @click="close()">取消
            </el-button>
            <el-button
              :disabled="multipleSelection.length<=0"
              :loading="saveIng"
              type="primary"
              @click="submit">保存
            </el-button>
          </template>
        </div>

      </div>

    </el-dialog>
  </div>
</template>
<script>
import SelectStore from '@/components/SelectStore'
import * as ApiEmployee from '@/api/employee'
import * as ApiBroadcast from '@/api/broadcast'
export default {
  components: { SelectStore },
  props: {
    // select
    // 是否显示
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      list: [], // 数据
      searchForm: {
        pageNum: 1,
        pageSize: 10,
        videoName: ' ',
        status: 0,
        storeId: '',
        companyId: ''
      },
      searchVal: '',
      searchKey: 'mobile',
      totalCount: 0,
      loading: false,
      multipleSelection: [], // 选择项
      saveIng: false
    }
  },
  watch: {
    visible: function (val) {
      this.searchForm.pageNum = 1
      this.getList()
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.loading = false
      ApiEmployee.getList({
        [this.searchKey]: this.searchVal,
        companyId: this.searchForm.companyId,
        pageNum: this.searchForm.pageNum,
        storeId: this.searchForm.storeId,
        pageSize: this.searchForm.pageSize
      }).then(({ data }) => {
        console.log(data)
        this.list = (data.dataList || []).map(item => {
          item.nickName = item.nickName || '--'
          item.name = item.name || '--'
          return item
        })
        this.loading = true
        this.totalCount = data.totalCount || 0
      }).catch(() => {
        this.loading = false
      })
    },
    submit () {
      this.saveIng = true
      let broadcastRoomSaveDTOList = []
      this.multipleSelection.forEach(e => {
        broadcastRoomSaveDTOList.push(
          {
            companyId: e.companyId,
            companyName: e.companyName,
            empId: e.id,
            empName: e.name,
            empPhone: e.mobile,
            headImg: e.headUrl, // 员工图像
            imgUrl: '', // 直播房
            nickname: e.nickName, // 员工昵称
            openId: e.wxOpenid,
            storeId: e.storeId,
            storeName: e.storeName
          }
        )
      })
      ApiBroadcast.addStaff(
        {
          broadcastRoomSaveDTOList: broadcastRoomSaveDTOList
        }
      ).then(res => {
        this.$message.success('操作成功')
        this.saveIng = false
        this.$emit('childNumber')
        this.close()
      }).catch(() => {
        this.saveIng = false
      })
    },
    changeSelectStore (val) {
      this.searchForm.storeId = val.storeId || ''
      this.searchForm.companyId = val.companyId || ''
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    sizeChange (e) {
      this.searchForm.pageSize = e
      this.getList()
    },
    pageChange (e) {
      this.searchForm.pageNum = e
      this.getList()
    },
    close () {
      this.$emit('update:visible', false)
    },
    searchFn () {
      this.searchForm.pageNum = 1
      this.getList()
    }
  }
}
</script>
