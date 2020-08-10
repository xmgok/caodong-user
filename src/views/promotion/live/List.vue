<template>
  <div class="page-employee-message">
    <el-tabs type="border-card">
      <el-tab-pane
        :lazy="lazy"
        label="全部">
        <!--条件筛选-->
        <div
          class="ui-search-header-block"
          style="padding-right: 0;">
          <el-form
            :inline="true"
            style="width:100%"
            label-width="80px">
            <el-form-item>
              <el-button
                class="ml10"
                type="primary"
                icon="el-icon-plus"
                @click="dialogaddStaffVisible = true"
              >直播员工
              </el-button>
            </el-form-item>
            <el-form-item class="fr">
              <el-input
                v-model="searchForm.name"
                size="small"
                placeholder="输入视频名称查询"
                class="">
                <el-select
                  slot="prepend"
                  v-model="searchForm.status"
                  style="width: 100px;"
                  placeholder="请选择">
                  <el-option
                    value=""
                    label="全部" />
                  <el-option
                    :value="1"
                    label="启用" />
                  <el-option
                    :value="0"
                    label="停用" />
                </el-select>
                <el-button
                  slot="append"
                  icon="el-icon-search"
                  @click="searchFn" />
              </el-input>
            </el-form-item>
          </el-form>
        </div>
        <!-- table -->
        <el-table
          :data="list"
          class="mt20">
          <el-table-column
            prop="name"
            show-overflow-tooltip
            align="center"
            label="直播间名称"/>
          <el-table-column
            prop="empName"
            show-overflow-tooltip
            align="center"
            label="员工"/>
          <el-table-column
            prop="createTime"
            show-overflow-tooltip
            align="center"
            label="首次开播时间"/>
          <el-table-column
            prop="broadcastTime"
            show-overflow-tooltip
            align="center"
            label="直播时长"/>
          <el-table-column
            label="操作"
            fixed="right"
            width="300"
            align="center">
            <template slot-scope="scope">
              <el-button
                class="ml10"
                type="text"
                size="small"
                @click="sureRoomId('dialogaddProductVisible',scope.row.id)"
              >直播商品
              </el-button>
              <el-button
                class="ml10"
                type="text"
                size="small"
                @click="sureRoomId('dialogStoreVisible',scope.row.id)"
              >参与门店
              </el-button>
              <el-button
                class="ml10"
                type="text"
                size="small"
                @click="sureRoomId('showMaterialVisible',scope.row.id)"
              >装扮
              </el-button>
              <el-button
                class="ml10"
                type="text"
                size="small"
                @click="changeStatus(scope.row.id,scope.row.status)">{{ +scope.row.status === 0? '启用': '停用' }}
              </el-button>
              <el-button
                class="ml10"
                type="text"
                size="small"
                @click="sureRoomId('showDataInfo',scope.row.id)">
                统计
              </el-button>
          </template></el-table-column>
        </el-table>
      </el-tab-pane>

      <!-- 分页 -->
      <div class="g-pagination-wrap">
        <el-pagination
          :current-page="searchForm.pageNum"
          :page-sizes="$store.state.app.pageSizes"
          :page-size="searchForm.pageSize"
          :total="totalCount"
          :layout="$store.state.app.layout"
          @size-change="sizeChange"
          @current-change="pageChange" />
      </div>
    </el-tabs>

    <!--直播员工-->
    <add-staff
      :visible.sync="dialogaddStaffVisible"
      @childNumber="childNumberValue"/>

    <!-- 活动商品 -->
    <active-product
      :visible.sync="dialogaddProductVisible"
      :product-room-id="productRoomId"/>

    <!--门店选择，多选-->
    <select-store-tree
      ref="selectStoreTree"
      :visible.sync="dialogStoreVisible"
      :default-value="searchForm.storeList"
      @confirm="confirmCheckedStore"/>

    <!-- 统计 -->
    <el-dialog
      :visible.sync="showDataInfo"
      title="数据统计"
      width="670px"
      @close="showDataInfo = false">
      <el-form
        v-loading="reportLoading"
        label-width="200px">
        <el-form-item
          style="margin-bottom: 0"
          label="时间范围:"
          prop="time">
          <el-date-picker
            v-model="reportTime"
            :default-time="['00:00:00', '23:59:59']"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="getReport()" />
        </el-form-item>
        <!-- <el-form-item
          label="活动名称:"
          style="margin-bottom: 0">{{ reportInfo.name }}</el-form-item> -->
        <el-form-item
          label="分享次数:"
          style="margin-bottom: 0">{{ reportInfo.forwordNum }}</el-form-item>
        <el-form-item
          label="导购分享人数:"
          style="margin-bottom: 0">{{ reportInfo.empForwordUsers }}</el-form-item>
        <el-form-item
          label="二次分享人数:"
          style="margin-bottom: 0">{{ reportInfo.secondForwordUsers }}</el-form-item>
        <el-form-item
          label="观看次数:"
          style="margin-bottom: 0">{{ reportInfo.watchNum }}</el-form-item>
        <el-form-item
          label="观看人数:"
          style="margin-bottom: 0">{{ reportInfo.watchUsers }}</el-form-item>
        <el-form-item
          label="下单单数:"
          style="margin-bottom: 0">{{ reportInfo.orderNum }}</el-form-item>
        <el-form-item
          label="退款单数:"
          style="margin-bottom: 0">{{ reportInfo.refundNum }}</el-form-item>
        <el-form-item
          label="成交单数:"
          style="margin-bottom: 0">{{ reportInfo.buyNum }}</el-form-item>
        <el-form-item
          label="业绩（元）:"
          style="margin-bottom: 0">{{ reportInfo.buyAmount - reportInfo.refundAmount || '' }}</el-form-item>
        <el-form-item style="margin-bottom: 0">
          <el-button
            type="primary"
            size="small"
            @click="reportExport">导出数据
          </el-button>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button
          type="primary"
          size="small"
          @click="showDataInfo = false">确定
        </el-button>
      </div>
    </el-dialog>

    <!-- 装扮 -->
    <el-dialog
      :visible.sync="showMaterialVisible"
      title="装扮"
      width="400px">
      <el-form
        ref="searchForm"
        :inline="true"
        :model="searchForm"
        :rules="formRules"
        style="width:100%"
        label-width="100px">
        <el-form-item
          prop="shareTitle"
          label="直播间名称"
          class="w500">
          <el-input
            v-model="searchForm.shareTitle"
            maxlength="40" />
        </el-form-item>
        <el-form-item
          ref="shareImgForm"
          label="直播间导图"
          prop="shareImg">
          <div
            class="ui-img-uploader"
            @click="showMaterialSelector = true">
            <img
              v-if="searchForm.shareImg"
              :src="searchForm.shareImg"
              class="img" >
            <p
              v-else
              class="ui-img-uploader-plus"><i class="icons el-icon-plus"/> 添加图片</p>
          </div>
          <p class="ui-color3 f12">建议尺寸为 600 x 600 像素</p>
        </el-form-item>
      </el-form
      >
      <div slot="footer">
        <el-button
          type="primary"
          size="small"
          @click="MaterialSubmit">确定
        </el-button>
      </div>
    </el-dialog>
    <material-selector
      :visible.sync="showMaterialSelector"
      :is-multi="false"
      @change="(val) => materialSelectorChanged(1, val)" />
  </div>
</template>

<script>
import SelectStore from '@/components/SelectStore'
import * as ApiBroadcast from '@/api/broadcast'
import addStaff from './components/add-staff'
import SelectStoreTree from '@/components/SelectStoreTree'
import activeProduct from './components/active-product'
import MaterialSelector from '@/components/MaterialSelector'
import * as date from '@/utils/index'

export default {
  name: 'EmployeeMessage',
  components: { SelectStore, addStaff, SelectStoreTree, activeProduct, MaterialSelector },
  data () {
    return {
      lazy: true,
      searchForm: {
        // 直播间列表
        pageNum: 1,
        pageSize: 10,
        name: '',
        status: '',

        storeId: '',
        companyId: '',
        'storeList': [],
        shareImg: '',
        shareTitle: ''
      },
      totalCount: 0,
      dialogaddStaffVisible: false, // 新增员工
      dialogaddProductVisible: false, // 活动商品
      dialogStoreVisible: false, // 适用门店
      showDataInfo: false, // 统计
      reportLoading: false,
      showMaterialSelector: false, // 装扮添加图片
      showMaterialVisible: false,
      productRoomId: 0, // 活动商品id
      storeRoomId: 0, // 门店id
      MateriaRoomId: '', // 装扮id
      DataInfoRoomId: '', // 统计id
      // 数据
      list: [

      ],
      reportInfo: {}, // 统计
      reportTime: [],
      beginTime: '',
      endTiem: '',
      formRules: {
        shareTitle: [
          { required: true, message: '请输入直播间名称', trigger: 'blur' }
        ],
        shareImg: [
          { required: true, message: '请选择直播间导图', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    storeListLength () {
      return this.form.storeList.filter(v => v.type === 0).length
    }

  },
  created () {
    this.getList()
  },
  methods: {
    childNumberValue (val) {
      this.getList()
    },
    getList () {
      ApiBroadcast.getList({
        name: this.searchForm.name,
        status: this.searchForm.status,
        pageNum: this.searchForm.pageNum,
        pageSize: this.searchForm.pageSize
      }).then(({ data }) => {
        this.list = data.dataList.map(item => {
          return {
            ...item,
            createTime: date.dateFormat(item.createTime)
          }
        })
        this.totalCount = data.totalCount || 0
      })
    },
    sureRoomId (type, id) {
      switch (type) {
        // 直播商品
        case 'dialogaddProductVisible':
          this.productRoomId = id
          this.dialogaddProductVisible = true

          break
          // 参与门店
        case 'dialogStoreVisible':
          this.storeRoomId = id
          // 清除选中项
          this.seestore(id)
          this.dialogStoreVisible = true
          break
          // 装扮
        case 'showMaterialVisible':
          this.MateriaRoomId = id
          this.getdecorate()
          this.showMaterialVisible = true
          break
          // 统计
        case 'showDataInfo':
          this.DataInfoRoomId = id
          this.getReport()
          this.showDataInfo = true
          break
        default:
          break
      }
    },
    // 查看门店
    seestore (id) {
      ApiBroadcast.seestore({
        roomId: this.storeRoomId
      }).then(({ data }) => {
        this.$refs['selectStoreTree'].noSelect()
        this.$refs['selectStoreTree'].isSelectedAll = false
        this.searchForm.storeList = []
        this.searchForm.storeList = data.storeList
      }).catch(() => { })
    },
    // 装扮
    materialSelectorChanged (type, val) {
      const typeName = ['', 'shareImg', 'videoUrl'][type]
      this.searchForm[typeName] = (val[0] && val[0].imgUrl) || ''
      this.$refs[`${typeName}Form`].clearValidate()
      this[type <= 1 ? 'showMaterialSelector' : 'showVideoSelector'] = false
    },
    getdecorate () {
      ApiBroadcast.getdecorate({
        roomId: this.MateriaRoomId
      }).then(({ data }) => {
        this.searchForm.shareImg = data.imgUrl
        this.searchForm.shareTitle = data.roomName
      }).catch(() => { })
    },
    // 提交装扮
    MaterialSubmit () {
      this.$refs.searchForm.validate(valid => {
        if (!valid) return
        ApiBroadcast.decorateSave({
          roomId: this.MateriaRoomId,
          imgUrl: this.searchForm.shareImg,
          roomName: this.searchForm.shareTitle
        }).then(({ data }) => {
          this.$message.success('操作成功')
          this.getList()
          this.showMaterialVisible = false
        }).catch(() => { })
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
    // 筛选条件，门店/分公司
    changeSelectStore (val) {
      this.searchForm.storeId = val.storeId || ''
      this.searchForm.companyId = val.companyId || ''
    },
    //  适用门店
    confirmCheckedStore (data) {
      this.searchForm.storeList = data
      ApiBroadcast.addstore({
        roomId: this.storeRoomId,
        storeList: this.searchForm.storeList
      }).then(() => {
        this.$message.success('操作成功')
      })
    },
    // 统计数据查询
    getReport () {
      this.reportTime = this.reportTime || []
      ApiBroadcast.statisticsList({ roomId: this.DataInfoRoomId, beginTime: this.reportTime[0] || '', endTime: this.reportTime[1] || '' }).then(({ data }) => {
        this.reportInfo = data || {}
      }).catch(() => { })
    },
    // 导出
    reportExport () {
      this.reportTime = this.reportTime || []
      ApiBroadcast.statisticsListExport({
        roomId: this.DataInfoRoomId, beginTime: this.reportTime[0] || '', endTime: this.reportTime[1] || ''
      }, '直播统计导出')
    },
    // 1启用 and 0停用
    changeStatus (id, status) {
      ApiBroadcast.changStatus({
        roomId: id,
        status: status === 0 ? 1 : 0
      }).then(() => {
        if (status === 0) {
          this.$message.success('启用成功')
        } else if (status === 1) {
          this.$message.success('停用成功')
        }
        this.getList()
      })
    }
  }
}
</script>

<style lang="scss">
</style>
