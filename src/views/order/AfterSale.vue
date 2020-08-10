<template>
  <div class="page-after-sale-order">
    <!--条件筛选-->
    <div class="tabs-box">
      <ul class="tabs-nav">
        <li
          v-for="item in tabList"
          :key="item.value"
          :class="['tab-item', { active: filterForm.status === item.value }]"
          @click="switchTab(item.value)">{{ item.label }}
        </li>
      </ul>
      <div class="tabs-body">
        <div class="ui-search-header-block">
          <el-form
            :inline="true"
            label-width="80px">
            <select-store
              style="display: inline-block; margin-bottom: 10px"
              labelwidth="80px"
              selectwidth="250px"
              @change="changeSelectStore" />
            <el-form-item label="申请时间">
              <el-date-picker
                v-model="filterForm.searchTime"
                :default-time="['00:00:00', '23:59:59']"
                style="width: 250px"
                type="datetimerange"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd HH:mm:ss"
                start-placeholder="开始日期"
                end-placeholder="结束日期" />
            </el-form-item>
            <el-form-item label="订单号">
              <el-input
                v-model="filterForm.orderCode"
                class="width1" />
            </el-form-item>
            <el-form-item label="退款编号">
              <el-input
                v-model="filterForm.returnCode"
                class="width1" />
            </el-form-item>
            <el-form-item label="收货人">
              <el-input
                v-model="filterForm.receiver"
                class="width1" />
            </el-form-item>
          </el-form>
          <el-button
            class="btn-search"
            type="primary"
            icon="el-icon-search"
            @click="searchList"
          >搜索
          </el-button>
        </div>
      </div>
    </div>

    <div class="mt10 flex flex-align-c flex-jc-end">
      <el-button
        type="primary"
        size="small"
        @click="exportOrder">导出
      </el-button>
    </div>

    <!--列表-->
    <el-table
      :data="listData"
      tooltip-effect="dark"
      class="mt10">
      <el-table-column
        prop="returnCode"
        label="退款编号"
        align="center"
        min-width="220"
        show-overflow-tooltip />
      <el-table-column
        prop="orderCode"
        label="订单编号"
        align="center"
        min-width="220"
        show-overflow-tooltip />
      <el-table-column
        prop="createTime"
        label="申请时间"
        align="center"
        min-width="180"
        show-overflow-tooltip />
      <el-table-column
        prop="_type"
        label="退款类型"
        align="center"
        show-overflow-tooltip />
      <el-table-column
        prop="realAmount"
        label="退款金额"
        align="center"
        show-overflow-tooltip />
      <el-table-column
        prop="receiverPhone"
        label="收货人手机"
        align="center"
        min-width="150"
        show-overflow-tooltip />
      <el-table-column
        prop="_returnStatus"
        label="审核状态"
        align="center"
        min-width="150"
        show-overflow-tooltip />
      <el-table-column
        label="操作"
        align="center"
        width="215"
        fixed="right">
        <template slot-scope="scope">
          <div style="display: -webkit-box; -webkit-box-pack: end">
            <!-- 申请中 -->
            <div v-if="scope.row.checkStatus == '1'">
              <el-button
                type="text"
                size="small"
                @click="editOperationForm(scope.row, scope.row.type, 1)">同意申请
              </el-button>
              <el-button
                type="text"
                size="small"
                @click="editOperationForm(scope.row, scope.row.type, 2)">拒绝申请
              </el-button>
            </div>

            <div v-else>
              <div v-if="scope.row.type != '1' && scope.row.checkStatus == '5'">
                <el-button
                  type="text"
                  size="small"
                  @click="editOperationForm(scope.row, scope.row.type, 3)">已收货，同意退款
                </el-button>
                <el-button
                  type="text"
                  size="small"
                  @click="editOperationForm(scope.row, scope.row.type, 4)">拒绝退款
                </el-button>
              </div>
            </div>
            <el-button
              class="ml10"
              type="text"
              size="small"
              @click="editOrderDetail(scope.row)">查看
            </el-button>
            <!--// type (integer, optional): 退款类型(1.仅退款 2.退货退款) ,-->
            <!--// 1申请中，2已取消，3申请未通过，4申请通过，等待寄回，5已寄回，等待审核，6审核通过，等待退款，7审核未通过，8已退款-->
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <div class="g-pagination-wrap">
      <el-pagination
        :current-page="filterForm.pageNum"
        :page-sizes="$store.state.app.pageSizes"
        :page-size="filterForm.pageSize"
        :total="total"
        :layout="$store.state.app.layout"
        @size-change="sizeChange"
        @current-change="pageChange"
      />
    </div>

    <!-- 售后流程 -->
    <el-dialog
      :visible.sync="showOperationForm"
      :title="dialogFormData.title"
      width="500px"
      class="dialog-form"
      @close="closeOperationForm">
      <div
        v-if="dialogFormData.tip.length > 0"
        class="alert-wrap mb20">
        <i class="el-alert__icon el-icon-info" />
        <div class="content">
          <p
            v-for="item in dialogFormData.tip"
            :key="item">{{ item }}</p>
        </div>
      </div>
      <el-form
        ref="operationForm"
        :model="operationForm"
        label-width="120px">

        <el-form-item label="售后类型:">{{ operationForm._type }}</el-form-item>
        <el-form-item label="退款金额:">{{ operationForm.amount }}元</el-form-item>

        <div v-if="dialogFormData.showModel == 2">
          <el-form-item
            :rules="[{ required: true, message: '请输入详细拒绝理由', trigger: 'blur' }]"
            label="拒绝理由:"
            prop="rejectReason">
            <div class="flex">
              <el-input
                :rows="2"
                v-model="operationForm.rejectReason"
                class="flex1"
                type="textarea"
                maxlength="100"
                placeholder="请输入详细拒绝理由" />
              <div class="ml10">{{ operationForm.rejectReason.length }}/100</div>
            </div>
          </el-form-item>
        </div>

        <div v-if="dialogFormData.showModel == 3">
          <el-form-item
            :rules="[{ required: true, message: '请输入退货退款地址', trigger: 'blur' }]"
            label="退货地址:"
            prop="returnAddress"
            style="margin-bottom: 14px;">
            <el-input
              :rows="2"
              v-model="operationForm.returnAddress"
              type="textarea"
              max-length="100"
              placeholder="请输入退货退款地址" />
          </el-form-item>
          <el-form-item label="">地址格式：上海市徐汇区桂林路396号，张三，136****9827</el-form-item>
        </div>

        <div v-if="dialogFormData.showModel == 4 || dialogFormData.showModel == 5">
          <!-- <el-form-item label="退款账户:">{{ operationForm.returnAccount }}</el-form-item> -->
          <el-form-item label="配送物流:">{{ operationForm.expressName }}</el-form-item>
          <el-form-item label="物流单号:">{{ operationForm.expressCode }}</el-form-item>
        </div>

        <div v-if="dialogFormData.showModel == 5">
          <el-form-item
            :rules="[{ required: true, message: '请选择收货状态', trigger: 'change' }]"
            label="收货状态:"
            prop="receiveStatus"
            style="margin-bottom: 22px;">
            <el-radio-group v-model="operationForm.receiveStatus">
              <el-radio label="1">已收货</el-radio>
              <el-radio label="0">未收货</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            :rules="[{ required: true, message: '请输入详细拒绝理由', trigger: 'blur' }]"
            label="拒绝理由:"
            prop="rejectReason">
            <el-input
              :rows="2"
              v-model="operationForm.rejectReason"
              type="textarea"
              max-length="100"
              placeholder="请输入详细拒绝理由" />
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer">
        <el-button
          size="small"
          @click="closeOperationForm">取 消
        </el-button>
        <el-button
          type="primary"
          size="small"
          @click="saveOperationForm">{{ dialogFormData.btnText }}
        </el-button>
      </div>
    </el-dialog>

    <!-- 退款详情 -->
    <el-dialog
      :visible.sync="showOrderDetail"
      title=""
      width="800px"
      @close="closeOrderDetail">

      <el-tabs
        v-model="activeName2"
        type="card">
        <el-tab-pane
          label="退款信息"
          name="first">
          <div class="order-info-form-title mb15">基本信息</div>
          <el-row :gutter="20">
            <el-col
              :span="12"
              class="mb15">订单编号:<span class="ml20">{{ orderDetailForm.orderCode }}</span></el-col>
            <el-col
              :span="12"
              class="mb15">退款编号:<span class="ml20">{{ orderDetailForm.returnCode }}</span></el-col>
            <el-col
              :span="12"
              class="mb15">退款类型:<span class="ml20">{{ ['', '仅退款', '退货退款', '退货'][orderDetailForm.type] }}</span></el-col>
            <el-col
              :span="12"
              class="mb15">退还积分:<span class="ml20">{{ orderDetailForm.integral || '0' }}</span></el-col>
            <el-col
              :span="12"
              class="mb15">退款原因:<span class="ml20">{{ orderDetailForm._reason || '--' }}</span></el-col>
            <el-col
              :span="12"
              class="mb15">实际退款金额:<span class="ml20">{{ orderDetailForm.realAmount || '--' }}</span></el-col>
            <el-col
              :span="12"
              class="mb15">退款说明:<span class="ml20">{{ orderDetailForm.explain || '--' }}</span></el-col>
            <el-col
              v-if="orderDetailForm._evidencePic && orderDetailForm._evidencePic.length"
              :span="24"
              class="mb15">
              <div class="evidence-pic-wrap">
                <span class="title">图片说明</span>
                <div class="ml30">
                  <img
                    v-for="(item, index) in orderDetailForm._evidencePic"
                    :key="index"
                    :src="item"
                    class="img-item">
                </div>
              </div>
            </el-col>
          </el-row>
          <div class="order-info-form-title mb15 mt20">退款商品</div>
          <el-table :data="orderDetailForm['_list']">
            <el-table-column
              :show-overflow-tooltip="true"
              prop="productName"
              label="商品名称"
              align="center" />
            <el-table-column
              prop="productCode"
              label="货号"
              align="center" />
            <el-table-column
              prop="specContent"
              label="规格"
              align="center" />
            <el-table-column
              prop="price"
              label="商品单价"
              align="center" />
            <el-table-column
              prop="returnNumber"
              label="退款数量"
              align="center" />
            <el-table-column
              prop="realAmount"
              label="退款总额"
              align="center" />
            <el-table-column
              prop="returnStatus"
              label="退款状态"
              align="center" />
          </el-table>
          <!-- footer -->
          <div
            v-if="orderDetailRow.checkStatus == '1'"
            class="ui-edit-btn-wrapper"
          >
            <template>
              <el-button
                @click="editOperationForm(orderDetailRow, orderDetailRow.type, 2)"
              >
                拒绝申请
              </el-button>
              <el-button
                type="primary"
                @click="editOperationForm(orderDetailRow, orderDetailRow.type, 1)"
              >
                同意申请
              </el-button>
            </template>
          </div>
          <div
            v-else
            class="ui-edit-btn-wrapper"
          >
            <div v-if="orderDetailRow.type != '1' && orderDetailRow.checkStatus == '5'">
              <el-button
                @click="editOperationForm(orderDetailRow, orderDetailRow.type, 3)">已收货，同意退款
              </el-button>
              <el-button
                type="primary"
                @click="editOperationForm(orderDetailRow, orderDetailRow.type, 4)">拒绝退款
              </el-button>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane
          label="订单详情"
          name="second">
          <div class="order-info-form-title mb10">基本信息</div>
          <div class="base-info">
            <div class="order-info-form-webkit">
              <p style="width: 80px;">订单编号:</p>
              <p>{{ orderInfoForm.orderCode }}</p>
            </div>
            <div class="order-info-form-webkit">
              <p style="width: 80px;">商品总额:</p>
              <p>¥{{ orderInfoForm.productTotalPrice }}</p>
            </div>
            <div class="order-info-form-webkit">
              <p style="width: 80px;">+ 运费:</p>
              <p>¥{{ orderInfoForm.expressAmount }}</p>
            </div>
            <div class="order-info-form-webkit">
              <p style="width: 80px;">- 优 惠 券:</p>
              <p>¥{{ orderInfoForm.couponAmount }}</p>
            </div>
            <div class="order-info-form-webkit">
              <p style="width: 80px;">- 促销立减:</p>
              <p>¥{{ orderInfoForm.reduceAmount }}</p>
            </div>
            <div class="order-info-form-webkit">
              <p style="width: 80px;">- 优惠金额:</p>
              <p>¥{{ orderInfoForm.discountAmount }}</p>
            </div>
            <div class="order-info-form-webkit">
              <p style="width: 80px;">- 积分抵扣:</p>
              <p>¥{{ orderInfoForm.integralAmount || '0.00' }}</p>
            </div>
            <div class="order-info-form-webkit">
              <p style="width: 80px;">= 实付金额:</p>
              <p>¥{{ orderInfoForm.orderRealAmount }}</p>
            </div>
          </div>
          <div class="order-info-form-title mb15 mt20">商品信息</div>
          <el-table :data="orderInfoForm['_list']">
            <el-table-column
              :show-overflow-tooltip="true"
              prop="productName"
              label="商品名称"
              align="center" />
            <el-table-column
              prop="specCode"
              label="货号"
              align="center" />
            <el-table-column
              prop="specName"
              label="规格"
              align="center" />
            <el-table-column
              prop="productPrice"
              label="商品单价"
              align="center" />
            <el-table-column
              prop="productNum"
              label="购买数量"
              align="center" />
            <el-table-column
              prop="productTotalPrice"
              label="商品总额"
              align="center" />
            <el-table-column
              prop="returnStatus"
              label="售后状态"
              align="center" />
            <el-table-column
              prop="returnNumber"
              label="退款数量"
              align="center" />
          </el-table>

          <div class="order-info-form-title mb15 mt30">收货人信息</div>
          <div class="order-info-form-webkit">
            <div
              class="order-info-form-webkit"
              style="width: 250px;"><p>姓名：</p>
            <p>{{ orderInfoForm.receiverName }}</p></div>
            <div class="order-info-form-webkit"><p>收货人地址：</p>
            <p>{{ orderInfoForm.receiverArea }}{{ orderInfoForm.receiverAddress }}</p></div>
          </div>
          <div class="order-info-form-webkit">
            <div
              class="order-info-form-webkit"
              style="width: 250px;"><p>电话：</p>
            <p>{{ orderInfoForm.receiverPhone }}</p></div>
            <div class="order-info-form-webkit"><p>&nbsp;&nbsp;&nbsp;邮政编码：</p>
            <p>{{ orderInfoForm.receiverPostcode || '--' }}</p></div>
          </div>
        </el-tab-pane>
        <el-tab-pane
          label="协商记录"
          name="third">
          <div
            v-for="item in afterSaleConsultlist"
            :key="item.id"
            class="pb10 mb20"
            style="border-bottom: 1px solid #e4e7ed;">
            <div class="mb10"><span style="font-weight: bold">{{ item._role }}</span> {{ item.createTime }}</div>
            <p class="mb15"><strong>{{ item.operateDesc }}</strong></p>

            <el-row :gutter="20">
              <template v-if="item.checkStatus === 3 || item.checkStatus === 7">
                <el-col
                  :span="10"
                  class="mb15">拒绝原因：{{ item.rejectReason }}
                </el-col>
              </template>
              <template v-if="item.checkStatus === 5">
                <el-col
                  :span="10"
                  class="mb15">物流公司：{{ item.expressName }}
                </el-col>
                <el-col
                  :span="10"
                  class="mb15">物流单号：{{ item.expressCode }}
                </el-col>
              </template>
              <template v-if="item.returnStatus === 1">
                <el-col
                  :span="10"
                  class="mb15">退款类型：{{ ['', '退款', '退款退货'][item.type] }}
                </el-col>
                <el-col
                  :span="10"
                  class="mb15">退款原因：{{ item._reason }}
                </el-col>
                <el-col
                  :span="10"
                  class="mb15">退款金额：{{ item.amount }}元
                </el-col>
                <el-col
                  :span="10"
                  class="mb15">退款说明：{{ item.explain }}
                </el-col>
                <el-col
                  :span="10"
                  class="mb15">售后单号：{{ item.returnCode }}
                </el-col>
                <el-col
                  v-if="item._evidencePic && item._evidencePic.length"
                  :span="24"
                  class="mb15">
                  <div class="evidence-pic-wrap">
                    <span class="title">图片说明</span>
                    <div class="ml30">
                      <img
                        v-for="(item, index) in item._evidencePic"
                        :key="index"
                        :src="item"
                        class="img-item">
                    </div>
                  </div>
                </el-col>
              </template>
            </el-row>
          </div>
        </el-tab-pane>
      </el-tabs>

    </el-dialog>
  </div>
</template>

<script>
import * as ApiOrder from '@/api/order'
import { AFTERSALES_REASON_LIST, EXPRESS_LIST, RETURN_STATUS_MAP } from '@/config/const'
import SelectStore from '@/components/SelectStore'

export default {
  name: 'AfterSaleOrder',
  components: { SelectStore },
  data () {
    return {
      activeName2: 'first',
      showOrderDetail: false,
      showOperationForm: false,
      operationForm: {
        receiveStatus: '', // 收货状态 0未收货 1已收货
        rejectReason: '', // 拒绝理由
        returnAddress: '', // 退货地址
        returnId: '' // 售后退货ID
      },
      dialogFormData: {
        title: '',
        tip: [],
        btnText: '',
        showModel: 1
      },
      // returnStatus 1申请中, 2已取消, 3已结束, 4待审核, 5审核中, 6退款中, 7已退款
      // 【改为 returnStatus 1待审核 2处理中 3退款结束（已结束）】
      tabList: [
        { label: '全部', value: '' },
        { label: '待审核', value: 1 },
        { label: '处理中', value: 2 },
        { label: '退款结束', value: 3 }
      ],
      total: 0,
      listData: [],
      filterForm: {
        companyId: '',
        storeId: '',
        beginTime: '', // 最小申请时间
        endTime: '', // 最大申请时间
        searchTime: '',
        orderCode: '', // 订单编号
        pageNum: 1,
        pageSize: 10,
        receiver: '', // 收货人
        returnCode: '', // 退款编号
        status: '' // 退款状态
      },
      orderDetailRow: {},
      orderDetailForm: {},
      orderInfoForm: {},
      afterSaleConsultlist: [],
      expressList: EXPRESS_LIST,
      // 防重复提交
      clicking: false
    }
  },

  computed: {
    expressCo () {
      const item = this.expressList.find(i => i.value === this.operationForm.expressId)
      return (item || { label: '' }).label
    }
  },

  created () {
    this.resetForm()
    this.getList()
  },

  methods: {
    changeSelectStore (val) {
      this.filterForm.storeId = val.storeId || ''
      this.filterForm.companyId = val.companyId || ''
    },
    sizeChange (e) {
      this.filterForm.pageSize = e
      this.getList()
    },
    pageChange (val) {
      this.filterForm.pageNum = val
      this.getList()
    },
    getList () {
      if (this.filterForm.searchTime) {
        this.filterForm.beginTime = this.filterForm.searchTime[0]
        this.filterForm.endTime = this.filterForm.searchTime[1]
      } else {
        this.filterForm.beginTime = ''
        this.filterForm.endTime = ''
      }

      // checkStatus 1申请中，2已取消，3申请未通过，4申请通过，等待寄回，5已寄回，等待审核，6审核通过，等待退款，7审核未通过，8已退款
      // 注：checkStatus 部分方案前端显示有变
      // type: 退款类型(1.仅退款 2.退货退款 3.换货) ,
      // const returnStatusMap = ['', '申请中', '已取消', '已结束', '待审核', '审核中', '', '已完成']
      // const checkStatus = ['', '申请中', '已取消', '申请未通过', '申请通过，等待寄回', '已寄回，等待审核', '', '审核未通过', '已退款']
      const type = ['', '仅退款', '退货退款']
      ApiOrder.getAfterSaleList(this.filterForm).then(({ data = {} }) => {
        data.dataList = data.dataList || []
        data.dataList.forEach((item) => {
          // item._checkStatus = checkStatus[item.checkStatus]
          item._returnStatus = RETURN_STATUS_MAP[item.returnStatus]
          item._type = type[item.type]
        })
        this.listData = data.dataList
        this.total = data.totalCount || 0
      }, () => {
      })
    },
    switchTab (val) {
      this.filterForm.status = val
      this.searchList()
    },
    searchList () {
      this.filterForm.pageNum = 1
      this.getList()
    },
    exportOrder () {
      ApiOrder.afterSaleOrderExport(this.filterForm, '售后订单列表导出')
    },
    /**
     * @param type （1：退款 2：退货退款）
     * @param btnType （1：同意申请 2：拒绝申请 3：已收货，同意退款 4：拒绝退款）
     */
    editOperationForm (row, type, btnType) {
      this.showOrderDetail = false
      this.showOperationForm = true

      ApiOrder.getConsultDetail({ returnId: row.id }).then(({ data }) => {
        const title = ['', '退款', '退货退款'][type]
        const text1 = [`请您仔细查看${title}申请，无误后再点击“同意申请”按钮`]
        const text2 = [`建议您先与买家协商后，再决定是否拒绝${title}；`, `若您拒绝退款，买家可修改退款申请，并重新申请${title}。`]
        this.operationForm = Object.assign(this.operationForm, data)
        this.operationForm.type = type
        this.operationForm._type = title
        this.operationForm.rejectReason = data.rejectReason || ''
        this.dialogFormData.title = `${title}审核`
        this.dialogFormData.btnType = btnType

        // 退款+同意申请
        if (btnType === 1 && type === 1) {
          this.dialogFormData.tip = text1
          this.dialogFormData.showModel = 1
          this.dialogFormData.btnText = '同意申请'
        }
        // 退款+拒绝申请
        if (btnType === 2 && type === 1) {
          this.dialogFormData.tip = text2
          this.dialogFormData.showModel = 2
          this.dialogFormData.btnText = '拒绝申请'
        }
        // 退货退款+同意申请
        if (btnType === 1 && type === 2) {
          this.dialogFormData.tip = []
          this.dialogFormData.showModel = 3
          this.dialogFormData.btnText = '同意申请'
        }
        // 退货退款+拒绝申请
        if (btnType === 2 && type === 2) {
          this.dialogFormData.tip = text2
          this.dialogFormData.showModel = 2
          this.dialogFormData.btnText = '拒绝申请'
        }
        // 退货退款+已收货，同意申请
        if (btnType === 3 && type === 2) {
          this.dialogFormData.tip = text1
          this.dialogFormData.showModel = 4
          this.dialogFormData.btnText = '同意申请'
        }
        // 退货退款+拒绝退款
        if (btnType === 4 && type === 2) {
          this.dialogFormData.tip = text2
          this.dialogFormData.showModel = 5
          this.dialogFormData.btnText = '拒绝申请'
        }
      })
    },
    closeOperationForm () {
      this.showOperationForm = false
      // this.$refs['operationForm'].resetFields()
      // this.resetForm()
    },
    saveOperationForm () {
      const data = this.operationForm

      this.$refs['operationForm'].validate((valid) => {
        if (!valid) return

        const params = {
          returnId: data.returnId
        }

        switch (this.dialogFormData.showModel) {
          // 退款+同意申请
          case 1:
            params.status = 8 // 直接退款
            break
          // 退款+拒绝申请
          case 2:
            params.status = 3
            params.rejectReason = data.rejectReason
            break
          // 退货退款+同意申请
          case 3:
            params.status = 4
            params.returnAddress = data.returnAddress
            break
          // 退货退款+已收货，同意申请
          case 4:
            params.status = 6
            if (this.dialogFormData.btnType === 3) {
              params.status = 8 // 已退款
            }
            params.expressCode = data.expressCode
            params.expressId = data.expressId
            break
          // 退货退款+拒绝退款
          case 5:
            params.status = 7
            params.expressCode = data.expressCode
            params.expressId = data.expressId
            params.receiveStatus = data.receiveStatus
            params.rejectReason = data.rejectReason
            break
        }

        if (this.clicking) return
        this.clicking = true

        ApiOrder.check(params).then((res) => {
          this.clicking = false
          this.$message.success('操作成功')
          this.getList()
          this.closeOperationForm()
        }).catch(() => {
          this.clicking = false
        })
      })
    },
    resetForm () {
      this.operationForm = {
        rejectReason: '',
        returnAddress: '',
        receiveStatus: ''
      }
    },
    editOrderDetail (row) {
      this.showOrderDetail = true
      this.orderDetailRow = row
      this.orderInfo(row.orderCode, row.connectPhone)
      this.getOrderReturnInfo(row.id)
      this.getAfterSaleConsultlist(row)
    },
    closeOrderDetail () {
      this.showOrderDetail = false
      this.orderInfoForm = {}
      this.afterSaleConsultlist = []
      this.orderDetailForm = {}
    },
    getOrderReturnInfo (id) {
      ApiOrder.getAfterSaleInfo({ id }).then((res) => {
        if (res.reason) {
          res._reason = AFTERSALES_REASON_LIST.find(i => i.value === res.reason).label
        }
        res['_list'] = [
          {
            productName: res.productName || '-',
            productCode: res.productCode || '-',
            specContent: res.specContent || '-',
            price: res.price || '-',
            returnNumber: res.returnNumber || '-',
            realAmount: res.realAmount || '-',
            returnStatus: ['', '申请中', '已取消', '已结束', '待审核', '审核中', '退款中', '已完成'][res.returnStatus]
          }
        ]

        this.orderDetailForm = res
      })
    },
    orderInfo (orderCode, userPhone) {
      ApiOrder.orderInfo({ orderCode }).then((res = {}) => {
        const orderStatus = ['', '待付款', '待发货', '已发货', '已完成', '已取消', '已退款']
        res['_orderStatus'] = orderStatus[res.orderStatus]
        console.log(res)
        res['_list'] = (res.productList || []).map((item) => {
          item.productTotalPrice = item.productAmount || '-'
          item.returnStatus = ['', '正常', '换货', '退货', '部分退货', '退款'][item.status]
          return item
        })
        res['_userPhone'] = userPhone
        this.orderInfoForm = res
      })
    },
    // 协商列表
    getAfterSaleConsultlist ({ orderCode, returnCode }) {
      ApiOrder.getAfterSaleConsultlist({ orderCode, returnCode }).then(({ data = [] }) => {
        this.afterSaleConsultlist = data.map(item => {
          if (item.reason) {
            item._reason = AFTERSALES_REASON_LIST.find(i => i.value === item.reason).label
          }
          item._role = ['', '商家', '买家'][item.role]
          // 快递直接使用后端给的。
          // if (item.expressId) {
          //   item._express = EXPRESS_LIST.find(i => i.value === item.expressId).label
          // }
          item._evidencePic = item.evidencePic ? item.evidencePic.split(',') : []
          return item
        })
      }, () => {
      })
    }
  }
}
</script>

<style lang="scss">
  .page-after-sale-order {
    .base-info {
      display: flex;
      flex-wrap: wrap;

      .order-info-form-webkit {
        width: 50%;
      }
    }

    .dialog-form {
      font-size: 12px;

      .el-form-item {
        margin-bottom: 0;

        .el-form-item__content {
          font-size: 12px;
        }
      }
    }

    .like-tab .el-radio-button__inner {
      border-bottom: 0;
    }

    .width1 {
      width: 250px;
    }

    .tabs-box {
      margin-top: 10px;
      width: 100%;
      border-radius: 8px;
      background-color: white;

      .tabs-nav {
        box-sizing: border-box;
        padding-left: 16px;
        height: 48px;
        border-bottom: 1px solid #ebeef5;
        @include clearfix();
      }

      .tab-item {
        margin-right: 35px;
        float: left;
        height: 48px;
        line-height: 48px;
        color: #606266;
        font-size: 14px;
        cursor: pointer;

        &.active {
          position: relative;
          color: #5889ff;
          font-weight: bold;

          &::after {
            content: '';
            display: inline-block;
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 4px;
            color: #5889ff;
            background-color: #5889ff;
            border-radius: 2px;
          }
        }
      }
    }

    .order-info-form-title {
      font-size: 16px;
      color: #303133;
      font-weight: bold;
      line-height: 18px;
      border-left: 4px solid #5889FF;
      padding-left: 12px;
    }

    .order-info-form-webkit {
      display: -webkit-box;
      color: #606266;
      line-height: 20px;
      padding: 5px 0;
    }

    .alert-wrap {
      background-color: #f4f7fd;
      padding: 10px 0;
      display: flex;
      justify-content: center;

      .el-icon-info {
        color: #909399 !important;
      }

      .content {
        padding-left: 10px;

        p {
          font-size: 12px;
          line-height: 17px;
          color: #909399;
        }
      }
    }

    .evidence-pic-wrap {
      display: flex;

      .img-item {
        flex: 1;
        width: 160px;
        height: 160px;
        margin-right: 20px;
      }
    }
  }
</style>
