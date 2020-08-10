<!--商品列表-->
<template>
  <div class="goods-ware-house-container">
    <div class="mb10">
      <router-link
        v-if="storeType <= 0"
        :to="{ name: 'GoodsAdd' }">
        <el-button
          type="primary"
          icon="el-icon-plus">发布新品
        </el-button>
      </router-link>
    </div>

    <!--条件筛选-->
    <div class="ui-search-header-block mb10">
      <el-form
        ref="form"
        :inline="true"
        :model="searchForm"
        label-width="80px">
        <div class="grey mb10 ml20">批量查询时，用英文逗号“,”分隔开，最多可同时查询100条。</div>
        <div>
          <el-form-item label="商品编号">
            <el-input v-model="searchForm.productCode" />
          </el-form-item>
          <el-form-item label="货号">
            <el-input v-model="searchForm.specCode" />
          </el-form-item>
          <el-form-item label="商品名称">
            <el-input v-model="searchForm.name" />
          </el-form-item>
          <el-form-item
            v-if="storeType == 1"
            label="选择状态">
            <el-select
              v-model="searchForm.storeStatus"
              style="width: 179px;"
              placeholder="请选择">
              <el-option
                label="全部"
                value="" />
              <el-option
                label="已选择"
                value="1" />
              <el-option
                label="未选择"
                value="0" />
            </el-select>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="商品分类">
            <el-checkbox-group
              v-model="searchForm.categoryIds"
              style="width: 880px;">
              <el-checkbox
                v-for="item in selectedCategoryList"
                :label="item.id"
                :key="item.id">{{ item.name }}
              </el-checkbox>
            </el-checkbox-group>
            <el-button
              type="primary"
              size="mini"
              @click="showGoodsCategorySelector = true">选择分类
            </el-button>
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

    <goods-category-selector
      :leaf-only="true"
      :visible.sync="showGoodsCategorySelector"
      title="选取商品分类"
      @change="goodsCategoryChanged"
    />
    <div>
      <el-button
        v-if="storeType == 0"
        class="mb10"
        size="mini"
        @click="batchOperate('updateCategory')">修改分类
      </el-button>
      <el-button
        v-if="storeType == 0"
        class="mb10"
        size="mini"
        @click="batchOperate('type')">修改商品类型
      </el-button>
      <el-button
        v-if="storeType == 0"
        class="mb10"
        size="mini"
        @click="batchOperate('tag')">修改标签
      </el-button>
      <el-button
        v-if="storeType == 0"
        class="mb10"
        size="mini"
        @click="batchOperate('price')">修改价格
      </el-button>
      <el-button
        v-if="storeType == 0"
        class="mb10"
        size="mini"
        @click="batchOperate('virtualTotal')">修改虚拟销量
      </el-button>
      <el-button
        v-if="storeType == 0"
        class="mb10"
        size="mini"
        @click="batchOperate('tc')">修改提成
      </el-button>
      <el-button
        v-if="storeType == 0"
        class="mb10"
        size="mini"
        @click="batchOperate('by')">修改包邮
      </el-button>
      <el-button
        v-if="storeType == 0"
        class="mb10"
        size="mini"
        @click="batchOperate('vip')">参与会员价
      </el-button>
      <template v-if="storeType == 1">
        <el-button
          class="mb10"
          size="mini"
          @click="doBatchOperate('choose')">批量选择
        </el-button>
        <el-button
          class="mb10"
          size="mini"
          @click="doBatchOperate('update')">批量同步
        </el-button>
      </template>

      <template v-else>
        <el-button
          class="mb10"
          size="mini"
          @click="batchOperate('select');selectCompanyIds='';">批量选择
        </el-button>
        <el-button
          class="mb10"
          size="mini"
          @click="batchOperate('sync');syncCompanyIds='';plSync=0;">批量同步
        </el-button>
      </template>
    </div>

    <!--列表-->
    <el-table
      v-loading="loading"
      :data="list"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="60" />
      <el-table-column
        prop="image_url"
        label="商品图片"
        align="center"
        width="180">
        <template slot-scope="scope">
          <!--FIXED 外层固定高度以避免fixed:right属性导致尾列错位-->
          <img
            :src="scope.row.imgUrl"
            style="display: block; height: 80px; margin: 0 auto;">
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="商品名称"
        min-width="300"
        header-align="left">
        <div
          slot-scope="scope"
          class="goods-title-content">
          <p class="goods-link">商品编号: {{ scope.row.productCode }}</p>
          <div class="goods-title">{{ scope.row.name }}</div>
        </div>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="name"
        align="center"
        label="商品类型">
        <template slot-scope="scope">
          {{ goodsType[scope.row.type] }}
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        prop="updateTime"
        label="更新时间"
        min-width="150">
        <template slot-scope="scope">{{ scope.row.updateTime?scope.row.updateTime.substr(0,11):'--' }}</template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
        width="70"
        fixed="right">
        <template slot-scope="scope">
          <router-link
            v-if="storeType == 0"
            :to="{name: 'GoodsEdit', params: { id: scope.row.id }}"
            class="pr10">
            <el-button
              size="mini"
              type="text">编辑
            </el-button>
          </router-link>
          <!--storeStatus-->
          <template v-if="storeType == 1">
            <el-button
              v-if="scope.row.storeStatus == 0"
              size="mini"
              type="text"
              @click="productUpdate(scope.row, 1)">选择
            </el-button>
            <el-button
              v-if="scope.row.storeStatus == 1"
              size="mini"
              type="text"
              @click="productUpdate(scope.row, 2)">同步
            </el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <div class="g-pagination-wrap">
      <el-pagination
        :current-page="pagination.page"
        :page-sizes="$store.state.app.pageSizes"
        :page-size="pagination.size"
        :total="pagination.total"
        :layout="$store.state.app.layout"
        @size-change="sizeChange"
        @current-change="handlePageChange" />
    </div>

    <!--批量修改商品类型-->
    <el-dialog
      :visible="typeDialogVisible"
      title="修改商品类型"
      width="500px"
      @close="typeDialogVisible=false">
      <el-form>
        <el-form-item label="商品类型：">
          <el-radio-group v-model="plType">
            <el-radio
              :label="1">普通商品
            </el-radio>
            <el-radio
              :label="2">赠品
            </el-radio>
            <el-radio
              :label="3">活动商品
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer">
        <el-button @click="typeDialogVisible=false">取 消</el-button>
        <el-button
          type="primary"
          @click="doBatchOperate('type')">确 定
        </el-button>
      </div>
    </el-dialog>

    <!--批量修改商品标签-->
    <el-dialog
      :visible="tagDialogVisible"
      title="修改商品标签"
      width="500px"
      @close="tagDialogVisible=false">
      <el-form>
        <el-form-item label="商品标签：">
          <el-checkbox-group v-model="plLabelList">
            <el-checkbox
              v-for="item in labelList"
              :key="item.id"
              :label="item.id">{{ item.name }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer">
        <el-button @click="tagDialogVisible=false">取 消</el-button>
        <el-button
          type="primary"
          @click="doBatchOperate('tag')">确 定
        </el-button>
      </div>
    </el-dialog>

    <!--批量修改商品价格-->
    <el-dialog
      :visible="priceDialogVisible"
      title="修改商品价格"
      width="500px"
      @close="priceDialogVisible=false">
      <div class="grey mb18">被选中商品的所有规格价格都会被修改</div>
      <el-form>
        <el-form-item label="市场价：">
          <el-input
            v-model="plPrePrice"
            class="w250">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="销售价：">
          <el-input
            v-model="plPrice"
            class="w250">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer">
        <el-button @click="priceDialogVisible=false">取 消</el-button>
        <el-button
          type="primary"
          @click="doBatchOperate('price')">确 定
        </el-button>
      </div>
    </el-dialog>

    <!--批量修改商品虚拟销量-->
    <el-dialog
      :visible="virtualTotalDialogVisible"
      title="修改虚拟销量"
      width="500px"
      @close="virtualTotalDialogVisible=false">
      <el-form>
        <el-form-item label="商品虚拟销量：">
          <el-input
            v-model="plVirtualTotal"
            class="w250">
            <template slot="append">件</template>
          </el-input>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer">
        <el-button @click="virtualTotalDialogVisible=false">取 消</el-button>
        <el-button
          type="primary"
          @click="doBatchOperate('virtualTotal')">确 定
        </el-button>
      </div>
    </el-dialog>

    <!--批量修改商品提成-->
    <el-dialog
      :visible="tcDialogVisible"
      title="修改导购提成"
      width="500px"
      @close="tcDialogVisible=false">
      <el-form>
        <el-form-item label="是否开启：">
          <el-radio-group v-model="plCommissionRulesDTO.empSwitch">
            <el-radio
              :label="1">开启
            </el-radio>
            <el-radio
              :label="0">不开启
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="plCommissionRulesDTO.empSwitch===1">
          <div class="grey mb18">填写0或不填则表示无提成</div>
          <el-form-item label-width="0">
            <el-radio
              v-model="plCommissionRulesDTO.empType"
              :label="1">按比返佣
            </el-radio>
            <el-form-item
              v-if="plCommissionRulesDTO.empType == 1"
              label="按商品金额的"
              label-width="100px"
              class="dib"
              style="width: 310px;">
              <el-input
                v-model="plCommissionRulesDTO.empPercent"
                :min="0"
                :max="100">
                <template slot="append">% 比例提成</template>
              </el-input>
            </el-form-item>
          </el-form-item>
          <el-form-item label-width="0">
            <el-radio
              v-model="plCommissionRulesDTO.empType"
              :label="2">按固定金额返
            </el-radio>
            <el-form-item
              v-if="plCommissionRulesDTO.empType == 2"
              prop="commissionRulesDTO.empAmount"
              label="每件商品提成"
              label-width="100px"
              class="w250 dib">
              <el-input
                v-model="plCommissionRulesDTO.empAmount"
                :min="0">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </el-form-item>
        </template>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer">
        <el-button @click="tcDialogVisible=false">取 消</el-button>
        <el-button
          type="primary"
          @click="doBatchOperate('tc')">确 定
        </el-button>
      </div>
    </el-dialog>

    <!--批量修改商品包邮-->
    <el-dialog
      :visible="byDialogVisible"
      title="修改是否包邮"
      width="500px"
      @close="byDialogVisible=false">
      <el-form>
        <el-form-item label="是否包邮：">
          <el-radio-group v-model="plBy">
            <el-radio :label="1">包邮</el-radio>
            <el-radio :label="0">不包邮</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer">
        <el-button @click="byDialogVisible=false">取 消</el-button>
        <el-button
          type="primary"
          @click="doBatchOperate('by')">确 定
        </el-button>
      </div>
    </el-dialog>
    <!-- 批量选择分公司 -->
    <el-dialog
      :visible="selectDialogVisible"
      title="批量选择"
      width="500px"
      @close="selectDialogVisible=false">
      <div>选择分公司 :
        <el-select
          v-model="selectCompanyIds"
          multiple
          collapse-tags
          style="margin-left: 20px;"
          placeholder="不选则默认全部分公司">
          <el-option
            v-for="item in selectOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id" />
        </el-select>
      </div>
      <div
        slot="footer"
        class="dialog-footer">
        <el-button @click="selectDialogVisible=false">取 消</el-button>
        <el-button
          type="primary"
          @click="doBatchOperate('select')">确 定
        </el-button>
      </div>
    </el-dialog>

    <!-- 批量同步分公司 -->
    <el-dialog
      :visible="syncDialogVisible"
      title="批量同步"
      width="500px"
      @close="syncDialogVisible=false">
      <div class="mb20">选择分公司 :
        <el-select
          v-model="syncCompanyIds"
          multiple
          collapse-tags
          style="margin-left: 20px;"
          placeholder="不选则默认全部分公司">
          <el-option
            v-for="item in syncOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id" />
        </el-select>
      </div>
      <div>
        <el-divider />
        <div>
          <p class="mb20">请选择是否同步以下信息：</p>
          <!-- <el-radio-group v-model="plSync">
            <el-radio :label="1">是否包邮</el-radio>
            <el-radio :label="2">是否参与会员价</el-radio>
          </el-radio-group> -->
          <div>
            <el-checkbox
              v-model="expressFree"
              label="是否包邮" />
            <el-checkbox
              v-model="isVip"
              label="是否参与会员价" />
            <el-checkbox
              v-model="inventory"
              label="是否同步库存" />
            <el-checkbox
              v-model="shareTotal"
              label="是否同步虚拟销量" />
          </div>
        </div>
      </div>
      <div
        slot="footer"
        class="dialog-footer">
        <el-button @click="syncDialogVisible=false">取 消</el-button>
        <el-button
          type="primary"
          @click="doBatchOperate('sync')"
        >确 定
        </el-button>
      </div>
    </el-dialog>

    <!--批量修改商品是否参与会员价-->
    <el-dialog
      :visible="vipDialogVisible"
      title="修改是否参与会员价"
      width="500px"
      @close="vipDialogVisible=false">
      <el-form>
        <el-form-item label="是否参与会员价：">
          <el-radio-group v-model="plVip">
            <el-radio :label="1">参与</el-radio>
            <el-radio :label="0">不参与</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer">
        <el-button @click="vipDialogVisible=false">取 消</el-button>
        <el-button
          type="primary"
          @click="doBatchOperate('vip')">确 定
        </el-button>
      </div>
    </el-dialog>

    <!-- 批量修改商品分类 -->
    <goods-category-selector
      :visible.sync="categoryDialogVisible"
      :include-half-checked="true"
      :three-level-only="true"
      title="修改商品分类"
      @change="(val) => doBatchOperate('updateCategory', val)" />
  </div>
</template>

<script>
import { GOODS_TYPE } from '@/config/const'
import ApiProduct from '@/api/product'
import { validateMoney, positiveNumber } from '@/utils/validate'
import GoodsCategorySelector from '@/components/GoodsCategorySelector'
import * as ApiStores from '@/api/stores'

export default {
  name: 'GoodsListWarehouse',

  components: { GoodsCategorySelector },

  data () {
    return {
      isTrue: false,
      goodsType: GOODS_TYPE,
      list: [],
      loading: true,
      searchForm: {
        productCode: '',
        specCode: '',
        name: '',
        storeStatus: '',
        categoryIds: []
      },
      pagination: {
        page: 1,
        total: 0,
        size: 10
      },
      labelList: [],
      // 已选中的商品分类
      selectedCategoryList: [],
      showGoodsCategorySelector: false,
      // 选中的商品列表
      rowSelection: [],
      // 批量选择分公司
      selectOptions: [],
      // 批量同步分公司
      syncOptions: [],
      // 批量选择 同步分公司id
      selectCompanyIds: [],
      syncCompanyIds: [],
      // 批量修改分类弹窗显示
      categoryDialogVisible: false,
      // 批量修改商品类型弹窗显示
      typeDialogVisible: false,
      // 批量修改标签弹窗显示
      tagDialogVisible: false,
      // 批量修改价格弹窗显示
      priceDialogVisible: false,
      // 批量修改商品虚拟销量弹窗显示
      virtualTotalDialogVisible: false,
      // 批量修改提成弹窗显示
      tcDialogVisible: false,
      // 批量修改包邮弹窗显示
      byDialogVisible: false,
      // 批量参与会员价弹窗显示
      vipDialogVisible: false,
      // 批量选择分公司弹框显示
      selectDialogVisible: false,
      // 批量同步分公司弹框显示
      syncDialogVisible: false,
      // batchDialogVisible: false,
      // 批量数据-商品类型
      plType: 0,
      plLabelList: [],
      plPrePrice: '',
      plPrice: '',
      plVirtualTotal: '',
      plCommissionRulesDTO: {
        empAmount: '', // 导购返佣固定金额
        empPercent: '', // 导购返佣百分比
        empType: 1, // 导购返佣类型 1百分比 2固定金额
        empSwitch: ''
      },
      plBy: '',
      plVip: '',
      expressFree: true,
      isVip: true,
      inventory: false,
      shareTotal: false

    }
  },

  computed: {
    storeType () {
      // storeType   门店类型 0总部 1分公司 2门店
      return this.$store.getters.userInfo.storeType
    }
  },

  created () {
    this.getList()
    this.getLabelList()
    this.getSysuserStore()
  },

  methods: {
    getLabelList () {
      ApiProduct.getLabelList().then(({ data }) => {
        this.labelList = data
      })
    },
    getList () {
      const { page, size } = this.pagination
      const { categoryIds } = this.searchForm
      const params = {
        // checkSelect: 1,
        ...this.searchForm,
        categoryIds: categoryIds.join(','),
        pageNum: page,
        pageSize: size
      }

      this.loading = true
      ApiProduct.getList(params).then(({ data: { dataList, totalCount } }) => {
        this.list = dataList || []
        this.pagination.total = totalCount || 0
        this.loading = false
      })
    },
    sizeChange (e) {
      this.pagination.size = e
      this.getList()
    },
    handlePageChange (page) {
      this.pagination.page = page
      this.getList()
    },
    goodsCategoryChanged (val) {
      this.searchForm.categoryIds = val.map(i => i.id)
      this.selectedCategoryList = val
      this.showGoodsCategorySelector = false
    },
    handleSelectionChange (val) {
      this.rowSelection = val
    },
    getSysuserStore () {
      ApiStores.getSysuserStore({ storeId: '' }).then(({ data }) => {
        this.syncOptions = data
        this.selectOptions = data
      })
    },
    batchOperate (type) {
      const ids = this.rowSelection.map(i => i.id)
      if (!ids.length) {
        this.$message.warning('请选择要操作的商品')
        return
      }

      switch (type) {
        case 'updateCategory':
          this.categoryDialogVisible = true
          break
        case 'type':
          this.typeDialogVisible = true
          break
        case 'tag':
          this.tagDialogVisible = true
          break
        case 'price':
          this.priceDialogVisible = true
          break
        case 'virtualTotal':
          this.virtualTotalDialogVisible = true
          break
        case 'tc':
          this.tcDialogVisible = true
          break
        case 'by':
          this.byDialogVisible = true
          break
        case 'vip':
          this.vipDialogVisible = true
          break
        case 'select':
          this.selectDialogVisible = true
          break
        case 'sync':
          this.syncDialogVisible = true
          break
        default:
          break
      }
    },
    productUpdate (val, type) {
      ApiProduct.addstoreproduct({
        pids: [val.id],
        mark: type,
        storeProductId: val.storeProductId
      }).then(({ message }) => {
        this.$message.success(message)
        this.getList()
      }).catch(() => {
      })
    },
    doBatchOperate (type, value) {
      let msg
      let params = {}
      if (this.rowSelection.length <= 0) {
        this.$message.warning('请选择要操作的商品')
        return
      }

      let rowSelection = []
      switch (type) {
        case 'updateCategory':
          msg = '是否修改选中商品所属分类?'
          rowSelection = this.rowSelection
          break
        case 'choose':
          msg = '是否批量选择选中的商品?'
          rowSelection = this.rowSelection.filter(item => item.storeStatus === 0)
          break
        case 'update':
          msg = '是否批量同步选中的商品?'
          rowSelection = this.rowSelection.filter(item => item.storeStatus === 1)
          break
        case 'type':
          msg = '是否修改选中商品所属类型?'
          rowSelection = this.rowSelection
          break
        case 'tag':
          msg = '是否修改选中商品所属标签?'
          rowSelection = this.rowSelection
          break
        case 'price':
          msg = '是否修改选中商品所属价格?'
          rowSelection = this.rowSelection
          break
        case 'virtualTotal':
          msg = '是否修改选中商品虚拟销量?'
          rowSelection = this.rowSelection
          break
        case 'tc':
          msg = '是否修改选中商品所属导购提成?'
          rowSelection = this.rowSelection
          break
        case 'by':
          msg = '是否修改选中商品所属是否包邮?'
          rowSelection = this.rowSelection
          break
        case 'vip':
          msg = '是否修改选中商品所属是否参与会员价?'
          rowSelection = this.rowSelection
          break
        case 'select':
          msg = '是否批量选择选中的商品?'
          rowSelection = this.rowSelection
          break
        case 'sync':
          msg = '是否批量同步选中的商品?'
          rowSelection = this.rowSelection
          break
        default:
          break
      }

      const pidList = rowSelection.map(i => i.id)
      if (pidList.length <= 0) {
        this.$message.success('成功')
        this.getList()
        return
      }

      switch (type) {
        case 'updateCategory':
          params = {
            pidList,
            categoryList: value.map(i => i.id)
          }
          break
        case 'choose':
          params = {
            pids: pidList,
            mark: 1
          }
          break
        case 'update':
          params = {
            pids: pidList,
            mark: 2
          }
          break
        case 'type':
          params = {
            pidList,
            type: this.plType // 1普通商品 2赠品 3活动商品
          }
          if (!params.type) {
            this.$message({ type: 'warning', message: '请选择商品类型' })
            return
          }
          break
        case 'tag':
          params = {
            pidList,
            labelList: this.plLabelList
          }
          break
        case 'price':
          params = {
            pidList,
            prePrice: this.plPrePrice,
            price: this.plPrice
          }
          if (!params.prePrice || !validateMoney(params.prePrice)) {
            this.$message({ type: 'warning', message: '请输入合法的市场价' })
            return
          }
          if (!params.price || !validateMoney(params.price)) {
            this.$message({ type: 'warning', message: '请输入合法的销售价' })
            return
          }
          break
        case 'virtualTotal':
          params = {
            pidList,
            virtualTotal: this.plVirtualTotal
          }
          if (!params.virtualTotal || !positiveNumber(params.virtualTotal)) {
            this.$message({ type: 'warning', message: '请输入正整数' })
            return
          }
          break
        case 'tc':
          params = {
            pidList,
            commissionRulesDTO: this.plCommissionRulesDTO
          }
          params.isOpen = params.commissionRulesDTO.empSwitch
          if (params.isOpen !== '') {
            if (params.commissionRulesDTO.empType === 1 && params.commissionRulesDTO.empPercent !== '' && (!validateMoney(params.commissionRulesDTO.empPercent) || params.commissionRulesDTO.empPercent > 100)) {
              this.$message({ type: 'warning', message: '请输入合法的导购返佣百分比' })
              return
            }
            if (params.commissionRulesDTO.empType === 2 && params.commissionRulesDTO.empAmount !== '' && (!validateMoney(params.commissionRulesDTO.empAmount))) {
              this.$message({ type: 'warning', message: '请输入合法的导购返佣固定金额' })
              return
            }
          }
          break
        case 'by':
          params = {
            pidList,
            expressFree: this.plBy // 是否包邮 0：否 1：是
          }
          if (params.expressFree === '') {
            this.$message({ type: 'warning', message: '请选择是否包邮' })
            return
          }
          break
        case 'vip':
          params = {
            pidList,
            isVip: this.plVip // 0不参与 1参与
          }
          if (!params.isVip === '') {
            this.$message({ type: 'warning', message: '请选择是否参与会员价' })
            return
          }
          break
        case 'select':
          params = {
            pids: pidList,
            mark: 1,
            companyIds: this.selectCompanyIds && this.selectCompanyIds.length ? this.selectCompanyIds : ''
          }
          break
        case 'sync':
          params = {
            pids: pidList,
            mark: 2,
            companyIds: this.syncCompanyIds && this.syncCompanyIds.length ? this.syncCompanyIds : '',
            expressFree: this.expressFree ? 1 : 0, // 是否包邮 0：否 1：是
            isVip: this.isVip ? 1 : 0, // 是否参与会员价 0不参与 1参与
            inventory: this.inventory ? 1 : 0, // 是否同步库存 0不参与 1参与
            shareTotal: this.shareTotal ? 1 : 0 // 是否同步虚拟销量 0不参与 1参与
          }
          break
        default:
          break
      }

      if (this.isTrue) return
      this.isTrue = true
      this.$confirm(msg, '提示', { type: 'warning' }).then(() => {
        console.log(type)
        if (type !== 'choose' && type !== 'update' && type !== 'select' && type !== 'sync') {
          ApiProduct.batchUpdateProduct(params).then(({ message }) => {
            this.$message.success(message)
            if (type === 'updateCategory') this.categoryDialogVisible = false
            if (type === 'type') this.typeDialogVisible = false
            if (type === 'tag') this.tagDialogVisible = false
            if (type === 'price') this.priceDialogVisible = false
            if (type === 'virtualTotal') this.virtualTotalDialogVisible = false
            if (type === 'tc') this.tcDialogVisible = false
            if (type === 'by') this.byDialogVisible = false
            if (type === 'vip') this.vipDialogVisible = false
            this.getList()
            this.isTrue = false
          }).catch(() => {
            this.isTrue = false
          })
        } else {
          ApiProduct.addstoreproduct(params).then(({ message }) => {
            this.$message.success(message)
            if (type === 'select') this.selectDialogVisible = false
            if (type === 'sync') this.syncDialogVisible = false
            this.getList()
            this.isTrue = false
          }).catch(() => {
            this.isTrue = false
          })
        }
      }).catch(() => {
        this.isTrue = false
      })
    }
  }
}
</script>

<style lang="scss">
  .goods-ware-house-container {
    .goods-title-content {
      height: 80px;
      display: flex;
      flex-direction: column;
      justify-content: center;

      .goods-link {
        color: $--color-primary;
      }

      .goods-title {
        @include ellipsis2();
      }
    }
  }
</style>
