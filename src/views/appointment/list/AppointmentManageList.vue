<template>
  <div class="page-seller-management">
    <!--条件筛选-->
    <div
      class="ui-search-header-block dark">
      <el-form
        :inline="true"
        label-width="80px">
        <select-store
          style="display: inline-block; margin-bottom: 10px"
          labelwidth="80px"
          selectwidth="250px"
          @change="changeSelectStore" />
        <el-form-item label="接待导购">
          <el-select
            :disabled="!search.storeId && userInfo.storeType !== 2"
            v-model="search.empId"
            clearable
            class="width1"
            placeholder="请选择">
            <el-option
              v-for="item in allempList"
              :key="item.id"
              :label="item.name"
              :value-key="item.name"
              :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="客户姓名">
          <el-input
            v-model="search.userName"
            placeholder="请输入"
            class="width1" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input
            v-model="search.mobile"
            placeholder="请输入"
            class="width1" />
        </el-form-item>
        <el-form-item label="到店时间">
          <el-date-picker
            v-model="daodianshijianArr"
            :default-time="['00:00:00', '23:59:59']"
            style="width: 250px"
            type="datetimerange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期" />
        </el-form-item>
        <el-form-item label="预约项目">
          <el-input
            v-model="search.serviceNames"
            placeholder="请输入"
            class="width1" />
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
    <div
      class="ui-search-header-block dark bt-dashed pb10 pr10 flex flex-jc-end">
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
        class="btn-export ml10"
        type="primary"
        size="small"
        @click="detailExport"
      >导出预约单
      </el-button>
    </div>
    <el-table
      :data="dataList"
      class="mt20">
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        label="预约项目">
        <template slot-scope="{row}">
          {{ row.serviceNames }}
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        label="客户姓名">
        <template slot-scope="{row}">
          {{ row.userName }}
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        width="110"
        label="手机号">
        <template slot-scope="{row}">
          {{ row.mobile }}
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        label="分公司">
        <template slot-scope="{row}">
          {{ row.companyName }}
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        label="门店">
        <template slot-scope="{row}">
          {{ row.storeName }}
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        width="150"
        label="到店时间">
        <template slot-scope="{row}">
          {{ row.enterTime }}
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        label="预约状态">
        <template slot-scope="{row}">
          {{ statusOBJ[row.status] }}
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        label="所属导购">
        <template slot-scope="{row}">
          {{ row.curEmpName || '--' }}
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        label="接待导购">
        <template slot-scope="{row}">
          {{ row.empName }}
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        width="120"
        label="操作人">
        <template slot-scope="{row}">
          {{ row.updateAt }}
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        width="140"
        label="操作时间">
        <template slot-scope="{row}">
          {{ row.updateTime }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="120"
        align="center"
        fixed="right">
        <template v-slot="{row, $index}">
          <el-button
            type="text"
            size="small"
            @click="fnShowInfo(row)">
            查看
          </el-button>
          <el-button
            v-if="row.status == 1 || row.status == 2"
            class="ml10"
            type="text"
            size="small"
            @click="fnShowClose(row)">
            关闭
          </el-button>
          <el-button
            v-if="row.status == 1"
            class="ml10"
            type="text"
            size="small"
            @click="fnShowSplit(row)">
            分配
          </el-button>
        </template>
      </el-table-column>
    </el-table>
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

    <!--查看-->
    <el-dialog
      :visible.sync="showInfo"
      title="预约单详情"
      width="800px">
      <el-form :inline="true">
        <div class="title mb10">基本信息</div>
        <el-form-item
          label="预约单号:"
          style="width: 45%; margin-bottom: 0;">{{ infoForm.code }}
        </el-form-item>
        <el-form-item
          label="预约状态:"
          style="width: 45%; margin-bottom: 0;">{{ statusOBJ[infoForm.status ] }}
        </el-form-item>
        <el-form-item
          label="分公司:"
          style="width: 45%; margin-bottom: 0;">{{ infoForm.companyName }}
        </el-form-item>
        <el-form-item
          label="门店:"
          style="width: 45%; margin-bottom: 0;">{{ infoForm.storeName }}
        </el-form-item>
        <el-form-item
          label="客户姓名:"
          style="width: 45%; margin-bottom: 0;">{{ infoForm.userName }}
        </el-form-item>
        <el-form-item
          label="手机号:"
          style="width: 45%; margin-bottom: 0;">{{ infoForm.mobile }}
        </el-form-item>
        <el-form-item
          label="到店时间:"
          style="width: 45%; margin-bottom: 0;">{{ infoForm.enterTime }}
        </el-form-item>
        <el-form-item
          label="接待导购:"
          style="width: 45%; margin-bottom: 0;">{{ infoForm.empName }}
        </el-form-item>
        <el-form-item
          label="客户备注:"
          style="width: 45%; margin-bottom: 0;">{{ infoForm.remarks }}
        </el-form-item>
        <el-form-item
          :label="`${infoForm.status == 5?'关闭原因:':infoForm.status == 4?'取消原因:':''}`"
          style="width: 45%; margin-bottom: 0;">{{ infoForm.cancelReason }}
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--关闭-->
    <el-dialog
      :visible.sync="showClose"
      title="确认关闭预约单吗？"
      width="800px">
      <el-form>
        <el-form-item label="关闭原因：">
          <el-input
            v-model="closeForm.reason"
            :rows="3"
            placeholder="请填写"
            maxlength="80"
            style="width: 400px;"
            type="textarea">
            <template slot="append">{{ closeForm.reason.length }}/80</template>
          </el-input>
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button
          size="small"
          @click="showClose = false">取 消
        </el-button>
        <el-button
          type="primary"
          size="small"
          @click="fnClose">确认
        </el-button>
      </div>
    </el-dialog>

    <!--分配-->
    <el-dialog
      :visible.sync="showSplit"
      title="分配接待导购"
      width="800px">
      <el-form :inline="true">
        <el-form-item label="选择导购：">
          <el-select
            v-model="splitForm.empId"
            clearable
            class="width1"
            placeholder="请选择">
            <el-option
              v-for="item in splitFormAllempList"
              :key="item.id"
              :label="item.name"
              :value-key="item.name"
              :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button
          size="small"
          @click="showSplit = false">取 消
        </el-button>
        <el-button
          type="primary"
          size="small"
          @click="fnSplit">确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { dateFormat } from '@/utils/index'
import * as ApiCustomer from '@/api/customer'
import SelectStore from '@/components/SelectStore'
import * as ApiBooking from '@/api/booking'
import { mapGetters } from 'vuex'

export default {
  components: { SelectStore },
  props: {
    status: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      showClose: false,
      showSplit: false,
      showInfo: false,
      infoForm: {},
      splitFormAllempList: [],
      splitForm: {
        empId: '',
        code: ''
      },
      closeForm: {
        reason: '',
        code: ''
      },
      time: [dateFormat(new Date(), '{y}-{m}-{d}') + ' 00:00:00', dateFormat(new Date(), '{y}-{m}-{d}') + ' 23:59:59'],
      allempList: [],
      daodianshijianArr: [],
      search: {
        userName: '',
        mobile: '',

        empId: '',
        serviceNames: '',

        companyId: '',
        storeId: '',

        startTime: '',
        endTime: '',

        // 预约状态
        pageNum: 1,
        totalCount: 0,
        pageSize: 10

      },

      activeId: 0,
      isShowActiveData: false,
      dataList: [],
      // 预约状态
      statusOBJ: { 1: '待分配', 2: '待服务', 3: '已完成', 4: '已取消', 5: '已关闭' }
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  mounted () {
    console.log(this.status)
    this.getList()
    if (this.userInfo.storeType === 2) {
      this.getAllempList(this.userInfo.storeIds[0])
    }
  },
  methods: {
    fnShowInfo ({ id }) {
      this.showInfo = true
      ApiBooking.detail({ id }).then((res = {}) => {
        this.infoForm = res.data
      })
    },
    fnShowSplit ({ storeId, code }) {
      this.showSplit = true
      this.splitForm.empId = ''
      this.splitForm.code = code
      this.getAllempList(storeId, 'split')
    },
    fnSplit () {
      if (!this.splitForm.empId) {
        this.$message({ type: 'warning', message: '请选择接待导购' })
        return
      }
      ApiBooking.split(this.splitForm).then(res => {
        this.showSplit = false
        this.getList()
      })
    },
    fnShowClose ({ code }) {
      this.showClose = true
      this.closeForm.reason = ''
      this.closeForm.code = code
    },
    fnClose () {
      if (this.closeForm.reason.trim() === '') {
        this.$message({ type: 'warning', message: '请输入关闭原因' })
        return
      }
      ApiBooking.close(this.closeForm).then(res => {
        this.showClose = false
        this.getList()
      })
    },
    detailExport () {
      ApiBooking.detailExport({
        startTime: this.time && this.time.length ? this.time[0] : '',
        endTime: this.time && this.time.length ? this.time[1] : ''
      }, '预约单')
    },
    changeSelectStore (val) {
      this.search.storeId = val.storeId || ''
      this.search.companyId = val.companyId || ''
      this.getAllempList(val.storeId)
    },
    getAllempList (val, type) {
      if (!val) return
      this.search.empId = ''
      ApiCustomer.getAllempList({ storeId: val }).then(({ data }) => {
        this.allempList = data
        type === 'split' && (this.splitFormAllempList = data)
      })
    },
    getList () {
      this.search.startTime = this.daodianshijianArr && this.daodianshijianArr.length ? this.daodianshijianArr[0] : ''
      this.search.endTime = this.daodianshijianArr && this.daodianshijianArr.length ? this.daodianshijianArr[1] : ''
      ApiBooking.detailList({
        ...this.search,
        status: this.status
      }).then(({ data }) => {
        this.dataList = data.dataList || []
        this.search.totalCount = data.totalCount || 0
      })
    },
    sizeChange (e) {
      this.search.pageSize = e
      this.getList()
    },
    pageChange (e) {
      this.search.pageNum = e
      this.getList()
    },
    searchFn () {
      this.search.pageNum = 1
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
  .title {
    font-size: 16px;
    color: #303133;
    font-weight: bold;
    line-height: 18px;
    border-left: 4px solid #5889ff;
    padding-left: 12px;
  }

  .btn-export-wrap {
    display: flex;
    justify-content: flex-end;
  }

  .page-seller-management {
    .width1 {
      width: 250px;
    }
  }
</style>
