<template>
  <div class="page-order">
    <!--条件筛选-->
    <div class="tabs-box">
      <ul class="tabs-nav">
        <li
          v-for="item in tabList"
          :key="item.value"
          :class="['tab-item', { active: searchForm.orderStatus === item.value }]"
          @click="switchTab(item.value)">{{ item.label }}
        </li>
      </ul>
      <div
        class="tabs-body">
        <div class="ui-search-header-block">
          <el-form
            :inline="true"
            label-width="80px">
            <select-store
              style="display: inline-block; margin-bottom: 10px"
              labelwidth="80px"
              selectwidth="250px"
              @change="changeSelectStore" />
            <el-form-item label="付款时间">
              <el-date-picker
                v-model="payTime"
                :default-time="['00:00:00', '23:59:59']"
                style="width: 250px"
                type="datetimerange"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd HH:mm:ss"
                start-placeholder="开始日期"
                end-placeholder="结束日期" />
            </el-form-item>
            <el-form-item
              label="订单类型">
              <el-select
                v-model="searchForm.orderType"
                clearable
                placeholder="请选择"
                style="width: 250px;">
                <el-option
                  :value="1"
                  label="普通订单">普通订单
                </el-option>
                <!-- <el-option
                  :value="2"
                  label="接龙订单">接龙订单
                </el-option> -->
                <el-option
                  :value="4"
                  label="视频订单">视频订单
                </el-option>
                <el-option
                  :value="5"
                  label="砍价订单">砍价订单
                </el-option>
                <el-option
                  :value="6"
                  label="直播订单">直播订单
                </el-option>
                <el-option
                  :value="7"
                  label="秒杀订单">秒杀订单
                </el-option>
                <el-option
                  :value="3"
                  label="拼团订单">拼团订单
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="订单号">
              <el-input
                v-model="searchForm.orderCode"
                class="width1" />
            </el-form-item>
            <el-form-item
              label="商品名称">
              <el-input
                v-model="searchForm.productName"
                class="width1" />
            </el-form-item>
            <el-form-item label="手机号">
              <el-input
                v-model="searchForm.receiverPhone"
                class="width1" />
            </el-form-item>
            <el-form-item
              label="用户名">
              <el-input
                v-model="searchForm.userName"
                class="width1" />
            </el-form-item>
            <el-form-item
              label="是否自提">
              <el-select
                v-model="searchForm.isTake"
                clearable
                placeholder="请选择"
                style="width: 250px;">
                <el-option
                  label="全部"
                  value="" />
                <el-option
                  label="是"
                  value="1" />
                <el-option
                  label="否"
                  value="0" />
              </el-select>
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
        v-if="+userInfo.storeType===0"
        type="primary"
        size="small"
        class="ml5"
        @click="download">导购销售业绩导出
      </el-button>
      <el-button
        class="ml5"
        size="small"
        type="primary"
        @click="exportOrder">订单列表导出
      </el-button>
    </div>

    <!--列表-->
    <!--ref="multipleTable"-->
    <el-table
      :data="listData"
      tooltip-effect="dark"
      class="mt10">
      <!--
      <el-table-column
        type="selection"
        align="center"
        width="60"
        fixed="left" />
-->
      <el-table-column
        prop="orderCode"
        label="订单号"
        show-overflow-tooltip
        align="center"
        width="230" />
      <el-table-column
        prop="createTime"
        label="下单日期"
        show-overflow-tooltip
        align="center"
        width="160" />
      <el-table-column
        prop="orderAmount"
        label="订单总额"
        show-overflow-tooltip
        align="center">
        <template slot-scope="{ row }">￥{{ row.orderAmount }}</template>
      </el-table-column>
      <el-table-column
        prop="receiverName"
        label="收货人"
        show-overflow-tooltip
        align="center" />
      <el-table-column
        prop="_payStatus"
        label="付款状态"
        show-overflow-tooltip
        align="center" />
      <el-table-column
        prop="_orderStatus"
        label="订单状态"
        show-overflow-tooltip
        align="center" />
      <el-table-column
        prop="groupStatusDesc"
        label="拼团状态"
        show-overflow-tooltip
        align="center" />
      <el-table-column
        prop="_expressStatus"
        label="发货状态"
        show-overflow-tooltip
        align="center" />
      <el-table-column
        prop="userPhone"
        label="用户名"
        show-overflow-tooltip
        align="center"
        width="120" />
      <el-table-column
        label="导购姓名"
        show-overflow-tooltip
        align="center">
        <template slot-scope="{ row }">{{ row.empName || '(无)' }}</template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        align="center"
        label="导购类型">
        <template slot-scope="{row}">
          {{ row.empTypeDesc }}
        </template>
      </el-table-column>
      <el-table-column
        label="导购手机号"
        width="110"
        show-overflow-tooltip
        align="center">
        <template slot-scope="{ row }">{{ row.empMobile || '(无)' }}</template>
      </el-table-column>
      <el-table-column
        label="所属门店"
        show-overflow-tooltip
        align="center">
        <template slot-scope="{ row }">{{ row.storeName || '(无)' }}</template>
      </el-table-column>
      <!--<el-table-column
        prop="_payType"
        label="支付方式"
        show-overflow-tooltip
        align="center" />-->
      <!--<el-table-column
      prop="source"
      label="订单来源"
      align="center" />-->
      <el-table-column
        label="操作"
        align="center"
        width="150"
        fixed="right">
        <template slot-scope="scope">
          <div style="text-align: right;">
            <el-button
              v-if="+userInfo.storeType===0&&+scope.row.empId===0&&scope.row.empType!==3"
              type="text"
              size="small"
              @click="staffEdit(scope.row)">选择所属导购
            </el-button>
            <!--orderStatus (integer, optional): 订单状态 1代付款 2代发货 3已发货 4已完成 5已取消 -->
            <template v-if="scope.row.orderStatus == 1">
              <el-button
                type="text"
                size="small"
                @click="orderEdit(scope.row.orderCode)">编辑
              </el-button>
              <el-button
                type="text"
                size="small"
                @click="orderCancel(scope.row.orderCode)">取消订单
              </el-button>
            </template>
            <el-button
              v-if="scope.row.isDeliver"
              type="text"
              size="small"
              @click="orderDelivery(scope.row.orderCode, scope.row.receiverName)">发货
            </el-button>
            <el-button
              type="text"
              size="small"
              @click="orderInfo(scope.row.orderCode, scope.row.userPhone)">查看
            </el-button>
          </div>
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

    <!--查看-->
    <el-dialog
      :visible.sync="showOrderInfo"
      title="订单查看"
      width="800px">
      <el-form :inline="true">
        <div class="order-info-form-title mb10">基本信息</div>
        <el-form-item
          label="订单编号:"
          style="width: 45%; margin-bottom: 0;">{{ orderInfoForm.orderCode }}
        </el-form-item>
        <el-form-item
          label="用 户 名:"
          class="mb5"
          style="width: 45%; margin-bottom: 0;">{{ orderInfoForm._userPhone }}
        </el-form-item>
        <el-form-item
          label="商品总额:"
          style="width: 45%; margin-bottom: 0;">{{ orderInfoForm.productTotalPrice }}
        </el-form-item>
        <el-form-item
          label="促销立减:"
          style="width: 45%; margin-bottom: 0;">{{ orderInfoForm.reduceAmount }}
        </el-form-item>
        <el-form-item
          label="配送费用:"
          style="width: 45%; margin-bottom: 0;">{{ orderInfoForm.expressAmount }}
        </el-form-item>
        <el-form-item
          label="优 惠 券:"
          style="width: 45%; margin-bottom: 0;">{{ orderInfoForm.couponAmount }}
        </el-form-item>
        <el-form-item
          label="优惠金额:"
          style="width: 45%; margin-bottom: 0;">{{ orderInfoForm.discountAmount }}
        </el-form-item>
        <el-form-item
          label="积分抵扣:"
          style="width: 45%; margin-bottom: 0;">{{ orderInfoForm.integralAmount }}
        </el-form-item>
        <el-form-item
          label="订单总额:"
          style="width: 45%; margin-bottom: 0;">{{ orderInfoForm.orderAmount }}
        </el-form-item>
      </el-form>

      <div class="order-info-form-title mb15 mt20">商品信息</div>
      <el-table :data="orderInfoForm['_list']">
        <el-table-column
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
          prop="productAmount"
          label="商品总额"
          align="center" />
        <el-table-column
          prop="_status"
          label="售后状态"
          align="center" />
        <el-table-column
          prop="returnNumber"
          label="退款数量"
          align="center" />
        <el-table-column
          label="操作"
          align="center">
          <template v-slot="{row, $index}">
            <el-button
              v-if="row.isRefund === 1"
              type="text"
              size="small"
              @click="handleGiftRefund(row, $index)">售后
            </el-button>
            <template v-else>--</template>
          </template>
        </el-table-column>
      </el-table>

      <div class="order-info-form-title mb15 mt20">物流信息</div>
      <div
        v-for="(item,index) in orderInfoForm['_express']"
        :key="index"
        class="mt12">
        包裹{{ index+1 }}
        <el-table :data="item">
          <el-table-column
            prop="companyName"
            label="物流公司"
            align="center" />
          <el-table-column
            prop="expressCode"
            label="物流单号"
            align="center" />
          <el-table-column
            prop="createTime"
            label="发货日期"
            align="center" />
          <el-table-column
            label="类型"
            align="center">
            <template slot-scope="scope">
              <p>{{ scope.row.type > 1 ? '退货' : '发货' }}</p>
            </template>
          </el-table-column>
        </el-table>
        <el-table :data="item[0] ? item[0].expressProductList : []">
          <el-table-column
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
            prop="deliveryNumber"
            label="发货数量"
            align="center" />
        </el-table>
      </div>

      <div class="order-info-form-title mb15 mt30">收货人信息</div>
      <div class="order-info-form-webkit">
        <div
          class="order-info-form-webkit"
          style="width: 250px;"><p>姓名：</p>
          <p>{{ orderInfoForm.receiverName }}</p>
        </div>
        <div class="order-info-form-webkit"><p>收货人地址：</p>
          <p>{{ orderInfoForm.receiverArea }}{{ orderInfoForm.receiverAddress }}</p>
        </div>
      </div>
      <div class="order-info-form-webkit">
        <div
          class="order-info-form-webkit"
          style="width: 250px;"><p>电话：</p>
          <p>{{ orderInfoForm.receiverPhone }}</p>
        </div>
        <div class="order-info-form-webkit"><p>&nbsp;&nbsp;&nbsp;邮政编码：</p>
          <p>{{ orderInfoForm.receiverPostcode }}</p>
        </div>
      </div>

    </el-dialog>

    <!--订单编辑-->
    <el-dialog
      :visible.sync="showEdit"
      title="订单编辑"
      width="500px">
      <el-form
        ref="editInfoForm"
        :rules="editInfoFormRules"
        :model="editInfoForm"
        label-width="120px"
        label-position="right"
        class="edit-form">
        <el-form-item label="订单编号:">{{ editInfoForm.orderCode }}</el-form-item>
        <el-form-item label="下单日期:">{{ editInfoForm.createTime }}</el-form-item>
        <el-form-item label="商品总额:">{{ editInfoForm.productPrice }}</el-form-item>
        <el-form-item label="促销立减:">{{ editInfoForm.reduceAmount }}</el-form-item>
        <el-form-item label="+ 配送费用:">¥ {{ editInfoForm.expressAmount }}</el-form-item>
        <el-form-item label="- 优惠券价格:">¥ {{ editInfoForm.couponAmount }}</el-form-item>
        <el-form-item label="- 积分抵扣:">¥ {{ editInfoForm.integralAmount }}</el-form-item>
        <el-form-item
          label="- 促销优惠金额:"
          prop="discountAmount">
          <el-input
            v-model="editInfoForm.discountAmount"
            style="width: 140px;"
            @blur="changeCoupon"
            @change="changeCoupon">
            <template slot="prepend">￥</template>
          </el-input>
        </el-form-item>
        <el-form-item label="= 订单总金额:">¥ {{ editInfoForm.orderAmount }}</el-form-item>
      </el-form>

      <div slot="footer">
        <el-button
          size="small"
          @click="showEdit = false">取 消
        </el-button>
        <el-button
          type="primary"
          size="small"
          @click="saveEdit">保 存
        </el-button>
      </div>
    </el-dialog>
    <!--发货-->
    <el-dialog
      :visible.sync="showDelivery"
      title="发货"
      width="800px"
      @close="closeDeliveryForm">
      <el-form
        ref="deliveryForm"
        :model="deliveryForm"
        label-width="80px">
        <el-form-item label="订单编号:">{{ deliveryForm.orderCode }}</el-form-item>
        <el-form-item label="收货人:">{{ deliveryForm.receiverName }}</el-form-item>
        <div class="grey tr">发货数量选0表示本次不发货</div>
        <el-table
          :data="deliveryForm.specCodeList"
          class="mb24">
          <el-table-column
            align="center"
            label="商品名称">
            <template v-slot="{row}">
              {{ row.productName }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="货号">
            <template v-slot="{row}">
              {{ row.specCode }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="规格">
            <template v-slot="{row}">
              {{ row.specName }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="商品数量">
            <template v-slot="{row}">
              {{ row.number }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="退货数量">
            <template v-slot="{row}">
              {{ row.returnNumber }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="已发货数量">
            <template v-slot="{row}">
              {{ row.deliverNumber }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="本次发货数量">
            <template v-slot="{row,$index}">
              <el-select
                v-model="row.count"
                class="mb10 w80"
                placeholder="请选择">
                <el-option
                  v-for="item in row.operationalNumberArr"
                  :key="item"
                  :value="item"
                  :label="item" />
              </el-select>
            </template>
          </el-table-column>
        </el-table>
        <el-form-item
          v-if="deliveryForm.isComplete===0"
          :rules="[{ required: true, message: '物流公司不能为空', trigger: 'change' }]"
          label="物流公司:"
          prop="companyId">
          <el-select
            v-model="deliveryForm.companyId"
            style="width: 200px">
            <el-option
              v-for="item in companyList"
              :key="item.id"
              :label="item.name"
              :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="deliveryForm.isComplete===0"
          :rules="[{ required: true, message: '单号不能为空'}]"
          label="物流单号:"
          prop="expressCode">
          <el-input
            v-model="deliveryForm.expressCode"
            style="width: 200px;" />
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button
          size="small"
          @click="closeDeliveryForm">取 消
        </el-button>
        <el-button
          type="primary"
          size="small"
          @click="deliverySave">{{ deliveryForm.isComplete===1?'发货完成':'发货' }}
        </el-button>
      </div>
    </el-dialog>
    <!--修改导购-->
    <el-dialog
      :visible.sync="showEditStaff"
      title="修改所属导购"
      width="500px">
      <el-form
        ref="editStaffFormRef"
        :model="editStaffForm"
        :rules="editStaffFormRules"
        label-width="120px"
        label-position="right"
        class="edit-form">
        <el-form-item
          label="新所属员工:"
          prop="empId">
          <el-select
            v-model="editStaffForm.empId"
            filterable
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

      <div slot="footer">
        <el-button
          size="small"
          @click="showEditStaff = false">取 消
        </el-button>
        <el-button
          type="primary"
          size="small"
          @click="staffSave">保 存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as ApiCustomer from '@/api/customer'
import * as ApiOrder from '@/api/order'
import * as ApiLogistics from '@/api/logistics'
import SelectStore from '@/components/SelectStore'
import * as Validate from '@/utils/validate'
import { dateFormat } from '@/utils/index'
import { mapGetters } from 'vuex'

const orderStatusArr = ['', '待付款', '待发货', '已发货', '已完成', '已取消', '已退款']

export default {
  name: 'Order',
  components: { SelectStore },
  data () {
    return {
      allempList: [],
      showEditStaff: false,
      editStaffForm: {
        orderCode: '',
        empId: ''
      },
      editStaffFormRules: {
        empId: [
          { required: true, message: '请选择所属员工' }
        ]
      },
      time: [dateFormat(new Date(), '{y}-{m}-{d}') + ' 00:00:00', dateFormat(new Date(), '{y}-{m}-{d}') + ' 23:59:59'],
      orderTime: ['', ''],
      // searchForm: {
      //   orderType: '',
      //   orderCode: '',
      //   createBeginTime: '2018-10-22T01:32:23.494Z',
      //   createEndTime: '2018-10-22T01:32:23.494Z'
      // },
      // searchFormSenir: {
      //   productName: '',
      //   userName: '',
      //   receiverName: '',
      //   receiverPhone: '',
      //   payBeginTime: '2018-10-22T01:32:23.494Z',
      //   payEndTime: '2018-10-22T01:32:23.494Z'
      // },
      loading: true,
      multipleSelection: [],
      exportIds: [],

      showOrderInfo: false,
      orderInfoForm: {},
      companyList: [],
      deliveryForm: {
        isComplete: 0,
        specCodeList: [],
        companyId: '',
        expressCode: '',
        orderCode: '',
        receiverName: ''
      },
      showDelivery: false,
      editInfoForm: {
        orderCode: '',
        productPrice: '',
        expressAmount: '',
        discountAmount: '',
        couponAmount: '',
        orderAmount: '',
        orderAmount2: '',
        createTime: ''
      },
      editInfoFormRules: {
        discountAmount: [
          { validator: Validate.money, trigger: 'blur' }
        ]
      },
      showEdit: false,
      payTime: [],
      showAdvancedSearch: false,
      tabList: [
        { label: '全部', value: 0 },
        { label: '待付款', value: 1 },
        { label: '待发货', value: 2 },
        { label: '已发货', value: 3 },
        { label: '已完成', value: 4 },
        { label: '已取消', value: 5 },
        { label: '已关闭', value: 6 },
        { label: '待自提', value: 7 }
      ],
      searchForm: {
        createBeginTime: '',
        createEndTime: '',
        orderCode: '',
        orderType: '',
        payBeginTime: '',
        payEndTime: '',
        productName: '',
        receiverName: '',
        receiverPhone: '',
        // tenantId: '',
        userName: '',
        orderStatus: 0,
        storeId: '',
        companyId: '',
        isTake: ''
      },
      currentPage: 1,
      total: 0,
      pageSize: 10,
      listData: []
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  mounted () {
    ApiLogistics.companyList().then(({ data }) => {
      this.companyList = Object.keys(data).map((index) => {
        return { id: index, name: data[index] }
      })
    }, () => {
    })
  },
  created () {
    this.searchForm.orderStatus = this.$route.query.orderStatus || 0
    this.getList()
  },
  methods: {
    getAllempList (val) {
      ApiCustomer.getAllempList({ storeId: val[1] }).then(({ data }) => {
        this.allempList = data
      })
    },
    staffEdit (item) {
      this.showEditStaff = true
      this.editStaffForm.empId = ''
      this.$nextTick(() => {
        this.$refs['editStaffFormRef'].clearValidate()
      })
      this.editStaffForm.orderCode = item.orderCode
      this.getAllempList([null, item.storeId])
    },
    staffSave () {
      this.$refs['editStaffFormRef'].validate((valid) => {
        if (!valid) return
        ApiOrder.bindOrderEmp(this.editStaffForm).then(() => {
          this.getList()
          this.showEditStaff = false
        })
      })
    },
    download () {
      ApiOrder.exportEmpBrokerage({
        createBeginTime: this.time[0],
        createEndTime: this.time[1]
      }, '导购销售业绩导出')
    },
    changeSelectStore (val) {
      this.searchForm.storeId = val.storeId || ''
      this.searchForm.companyId = val.companyId || ''
    },
    sizeChange (e) {
      this.pageSize = e
      this.getList()
    },
    pageChange (val) {
      this.currentPage = val
      this.getList()
    },
    getList () {
      if (this.payTime) {
        this.searchForm.createBeginTime = this.payTime[0] || ''
        this.searchForm.createEndTime = this.payTime[1] || ''
      }
      ApiOrder.getList({
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        ...this.searchForm
      }).then(({ data = {} }) => {
        data.dataList = data.dataList || []
        data.dataList.map((item) => {
          item['_expressStatus'] = item.expressStatus > 0 ? '已发货' : '未发货'
          if (Number(item.payStatus) === 1) {
            item['_payStatus'] = '未支付'
          } else if (Number(item.payStatus) === 2) {
            item['_payStatus'] = '已支付'
          } else if (Number(item.payStatus) === 3) {
            item['_payStatus'] = '已退款'
          }
          item['_orderStatus'] = orderStatusArr[item.orderStatus]
          item['_payType'] = Number(item.payType) === 2 ? '第三方' : '微信'
          item.userPhone = item.userPhone || '--'
          return item
        })
        this.listData = data.dataList
        this.total = data.totalCount || 0
      }, () => {
      })
    },
    switchTab (val) {
      this.currentPage = 1
      this.searchForm.orderStatus = val
      this.getList()
    },
    searchList () {
      this.currentPage = 1
      this.getList()
    },
    changeCoupon () {
      this.$refs['editInfoForm'].validate((valid) => {
        if (!valid) return
        let discountAmount = +this.editInfoForm.discountAmount
        const orderAmount2 = +this.Big(this.editInfoForm.discountAmount2).plus(Number(this.editInfoForm.orderAmount2)).toFixed(2)
        if (this.Big(discountAmount).gt(orderAmount2)) {
          discountAmount = orderAmount2
        }
        this.editInfoForm.discountAmount = discountAmount
        this.editInfoForm.orderAmount = this.Big(orderAmount2).minus(discountAmount || 0).toFixed(2)
      })
    },
    orderEdit (orderCode) {
      ApiOrder.editInfo({ orderCode: orderCode }).then((data) => {
        this.editInfoForm = data
        this.editInfoForm.orderAmount2 = data.orderAmount
        this.editInfoForm.discountAmount2 = data.discountAmount
        this.editInfoForm.orderCode = orderCode
        this.showEdit = true
      })
    },
    saveEdit () {
      this.$refs['editInfoForm'].validate((valid) => {
        if (!valid) return
        ApiOrder.edit(this.editInfoForm).then(({ message }) => {
          this.$message({ type: 'success', message: message })
          this.showEdit = false
          this.getList()
        }, () => {
        })
      })
    },
    orderCancel (orderCode) {
      this.$confirm('取消订单后将不允许再做任何操作，确认要执行吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ApiOrder.cancel({ orderCode }).then(({ message = '' }) => {
          this.$message({ type: 'success', message: message })
          this.getList()
        }).catch(() => {
        })
      }).catch(() => {
      })
    },
    closeDeliveryForm () {
      this.$refs['deliveryForm'].resetFields()
      this.showDelivery = false
    },
    orderDelivery (orderCode, receiverName) {
      this.deliveryForm.orderCode = orderCode
      this.deliveryForm.receiverName = receiverName
      ApiOrder.deliverPageInfo({ orderCode }).then(res => {
        let num = 0
        res.data.productList.forEach(v => {
          v.spec_code = v.specCode
          v.count = v.operationalNumber
          v.operationalNumberArr = [0].concat([...Array(v.operationalNumber)].map((v, i) => i + 1))
          num += v.operationalNumber
        })
        this.deliveryForm.isComplete = num === 0 ? 1 : 0
        this.deliveryForm.specCodeList = res.data.productList
      })
      this.showDelivery = true
    },
    deliverySave () {
      this.$refs['deliveryForm'].validate((valid) => {
        if (!valid) return
        ApiOrder.deliver(this.deliveryForm).then(({ message }) => {
          this.$message({ type: 'success', message: message })
          this.getList()
          this.closeDeliveryForm()
        }, () => {
        })
      })
    },
    orderInfo (orderCode, userPhone) {
      ApiOrder.orderInfo({ orderCode }).then((res = {}) => {
        const returnStatusMap = ['', '正常', '换货', '退货', '部分退货', '退款']
        res['_orderStatus'] = orderStatusArr[res.orderStatus]
        /*
        res['_list'] = [
          {
            productName: res.productName || '-',
            specCode: res.specCode || '-',
            productPrice: res.productPrice || '-',
            productNum: res.productNum || '-',
            productTotalPrice: res.productTotalPrice || '-',
            status: res.status || '-',
            returnStatus: returnStatusMap[res.returnStatus],
            specName: res.specName || '-'
          }
        ]
*/
        res['_list'] = (res.productList || []).map((item) => {
          item._status = returnStatusMap[item.status]
          return item
        })
        res['_userPhone'] = userPhone
        res['_express'] = []
        this.orderInfoForm = res
        this.showOrderInfo = true
        ApiOrder.getExpressRecords({ orderCode }).then(({ data }) => {
          data.sendOut.forEach((v, i, a) => {
            a[i] = [v]
          })
          this.orderInfoForm._express = data.sendOut || []
        })
      })
    },
    exportOrder () {
      this.searchForm.createBeginTime = this.time[0]
      this.searchForm.createEndTime = this.time[1]
      ApiOrder.orderExport(this.searchForm, '订单列表导出')
    },
    // 赠品售后
    handleGiftRefund ({ detailId }, index) {
      this.$confirm('是否对该赠品进行售后处理?', '提示', { type: 'warning' }).then(() => {
        ApiOrder.giftRefund({ id: detailId }).then(({ status }) => {
          if (status !== 200) return
          this.$message.success('操作成功')
          this.orderInfoForm._list[index].isRefund = 0
        })
      }).catch(() => {
      })
    }
    // searchFn () {
    //   this.getList()
    // },
    // showMoreFn () {
    //   if (!this.showMore) {
    //     for (let keys of Object.keys(this.searchFormSenir)) {
    //       this.searchFormSenir[keys] = ''
    //     }
    //   }
    //   this.showMore = !this.showMore
    // },
    // radioChange () {
    //   this.getList()
    // }
  }
}
</script>

<style lang="scss" rel="stylesheet">
  .page-order {
    .edit-form {
      padding-left: 50px;

      .el-form-item {
        margin-bottom: 0;
      }
    }

    .like-tab .el-radio-button__inner {
      border-bottom: 0;
    }

    .width1 {
      width: 250px;
    }

    .tabs-box {
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
  }
</style>
