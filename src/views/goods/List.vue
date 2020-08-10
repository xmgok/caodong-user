<!--商品列表-->
<template>
  <div class="goods-container2">
    <!--条件筛选-->
    <div class="ui-search-header-block mb10">
      <el-form
        ref="searchForm"
        :inline="true"
        :model="searchForm"
        label-width="80px">
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
            v-if="storeType >= 2"
            label="商品状态">
            <el-select
              v-model="searchForm.status"
              style="width: 180px;"
              clearable
              placeholder="请选择">
              <el-option
                label="全部"
                value="" />
              <el-option
                label="在售"
                value="1" />
              <el-option
                label="已售罄"
                value="2" />
              <el-option
                label="已下架"
                value="0" />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="storeType == 1"
            label="在售门店">
            <el-select
              v-model="searchForm.storeId"
              style="width: 179px;"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in storeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
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
                :key="item.id"
              >{{ item.name }}
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
          @click="getList">搜索
        </el-button>
      </el-form>
    </div>

    <div class="mb10 flex flex-jc-sb pr10">
      <div>
        <!--<template v-if="storeType == 1">
          <el-button
            :disabled="!rowSelection.length"
            size="mini"
            @click="del">批量删除
          </el-button>
          <el-button
            :disabled="!rowSelection.length"
            size="mini"
            @click="showVipPrice(rowSelection,1)"
          >批量会员价
          </el-button>
        </template>-->
        <el-button
          :disabled="!rowSelection.length"
          size="mini"
          @click="updown('1')">批量商品上架
        </el-button>
        <el-button
          :disabled="!rowSelection.length"
          size="mini"
          @click="updown('0')">批量商品下架
        </el-button>
        <!--<el-button
          v-if="storeType == 0"
          :disabled="!rowSelection.length"
          class="mb10"
          size="mini"
          @click="batchOperate('updateCategory')">修改分类
        </el-button>-->
        <template v-if="storeType !== 0">
          <el-button
            :disabled="!rowSelection.length"
            class="mb10"
            size="mini"
            @click="batchOperate('type')">修改商品类型
          </el-button>
          <!--<el-button
              :disabled="!rowSelection.length"
              class="mb10"
              size="mini"
              @click="batchOperate('tag')">修改标签
            </el-button>-->
          <el-button
            :disabled="!rowSelection.length"
            class="mb10"
            size="mini"
            @click="batchOperate('price')">修改价格
          </el-button>
          <el-button
            :disabled="!rowSelection.length"
            class="mb10"
            size="mini"
            @click="batchOperate('virtualTotal')">修改虚拟销量
          </el-button>
          <!--<el-button
              :disabled="!rowSelection.length"
              class="mb10"
              size="mini"
              @click="batchOperate('tc')">修改提成
            </el-button>-->
          <el-button
            :disabled="!rowSelection.length"
            class="mb10"
            size="mini"
            @click="batchOperate('by')">修改包邮
          </el-button>
          <el-button
            :disabled="!rowSelection.length"
            class="mb10"
            size="mini"
            @click="batchOperate('vip')">参与会员价
          </el-button>
        </template>
        <!--<el-button
          size="mini"
          type="primary"
          @click="goodsExport()">导出
        </el-button>-->
      </div>
      <div
        v-if="storeType < 1"
        class="export">
        <select-store
          size="mini"
          class="mr10"
          labelwidth="60px"
          @change="changeSelectStore" />
        <el-select
          v-model="exportValue"
          size="mini"
          style="width:130px;border-radius: 5px 0 0 5px"
          placeholder="请选择导出类型">
          <el-option
            v-for="item in exportTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value" />
        </el-select>
        <el-button
          size="mini"
          type="primary"
          @click="exportGoods">导出
        </el-button>
      </div>
    </div>

    <goods-category-selector
      :leaf-only="true"
      :visible.sync="showGoodsCategorySelector"
      title="选取商品分类"
      @change="goodsCategoryChanged"
    />

    <!--列表-->
    <el-table
      v-loading="loading"
      :data="list"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="60" />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="image_url"
        label="商品图片"
        align="center"
        width="180">
        <template slot-scope="scope">
          <img
            :src="scope.row.imgUrl"
            style="height: 80px; display: block; margin: 0 auto;">
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="name"
        label="商品名称"
        min-width="200"
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
        prop="sellTotal"
        label="总销量"
        align="center"
        width="100" />
      <el-table-column
        v-if="storeType < 2"
        prop="inventory"
        label="门店状态"
        align="center"
        width="100">
        <template slot-scope="scope">
          <p>已上架：{{ scope.row.up || '--' }}</p>
          <p>已售罄：{{ scope.row.finish || '--' }}</p>
          <p>待上架：{{ scope.row.down || '--' }}</p>
        </template>
      </el-table-column>
      <el-table-column
        v-if="storeType >= 2"
        label="上架状态"
        align="center"
        width="100">
        <template slot-scope="scope">
          <p>{{ statusOBJ[scope.row.status] }}</p>
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="createTime"
        label="添加时间"
        align="center"
        width="100">
        <template
          slot-scope="scope"
        >{{ scope.row.createTime?scope.row.createTime.substr(0,11):'--' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="isOpen"
        label="是否开启提成"
        align="center"
        width="100">
        <template slot-scope="scope">{{ scope.row.isOpen ? '是' : '否' }}</template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        label="销售价"
        align="center"
        width="150">
        <template slot-scope="scope">{{ scope.row.price }} - {{ scope.row.highPrice }}</template>
      </el-table-column>
      <el-table-column
        v-if="storeType"
        align="center"
        label="操作"
        width="100"
        fixed="right">
        <template slot-scope="scope">
          <template>
            <router-link
              :to="{name: 'GoodsEdit', params: { id: scope.row.id }, query: { type: 1}}"
              class="pr10"
            >
              <el-button
                size="mini"
                type="text">编辑
              </el-button>
            </router-link>
            <!--<el-button
              v-if="storeType == 1"
              size="mini"
              type="text"
              @click="showVipPrice(scope.row,0)">会员价
            </el-button>-->
            <!--
          <el-popover
            placement="left"
            @show="showQrCode(scope.row.id)">
            <div
              v-loading="!previewLoading[scope.row.id]"
              v-if="previewShow[scope.row.id]">
              <img
                :src="scope.row.qrcode"
                width="150px"
                height="150px"
                @load="qrLoaded(scope.row.id)">
              <div class="popover-tips">
                <p class="tc">微信扫一扫</p>
                <p class="tc">打开小程序查看</p>
              </div>
            </div>
            <el-button
              slot="reference"
              size="mini"
              type="text">会员价
            </el-button>
          </el-popover>
          -->
          </template>
          <template v-if="storeType == 2">
            <el-button
              v-if="scope.row.state === 0"
              size="mini"
              type="text"
              @click="upperProduct(scope.row)">上架
            </el-button>
            <el-button
              v-else
              size="mini"
              type="text"
              @click="upperProduct(scope.row)">下架
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
        @current-change="handlePageChange"
      />
    </div>

    <!-- 批量会员价 -->
    <el-dialog
      :visible.sync="vipPriceDialogVisible"
      title="设置会员价"
      width="500px"
      @close="cancel">
      <p
        v-if="setVipType"
        class="pb10">共选择{{ rowSelection.length }}件商品</p>
      <div v-else>
        <p class="pb10 f12">商品编号：{{ selectInfo.productCode }}</p>
        <p class="pb10 f12">商品名称:{{ selectInfo.name }}</p>
        <p class="pb10 f12">商品售价：{{ selectInfo.price }}</p>
        <p class="pb10 f12">会员价：{{ selectInfo.price }}</p>
      </div>
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        class="vip-price-dialog"
        label-width="100px">
        <el-table
          :data="form.vipPriceList"
          max-height="300"
          class="table-wrap">
          <el-table-column
            prop="level"
            label="会员等级"
            align="center">
            <template slot-scope="scope">
              {{ `VIP${scope.row.level}` }}
            </template>
          </el-table-column>
          <el-table-column
            label="会员折扣"
            align="center">
            <template slot-scope="scope">
              <el-form-item
                :prop="'vipPriceList.' + scope.$index + '.discount'"
                :rules=" [
                { required: true, message: '请填写会员折扣', trigger: 'blur' },validateDisCount() ]"
                label-width="0"
              >
                <el-input
                  v-model="scope.row.discount"
                  placeholder="请输入内容">
                  <template slot="append">折</template>
                </el-input>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer">
        <el-button @click="vipPriceDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="setVipPrice('form')">确 定</el-button>
      </span>
    </el-dialog>

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
        <!--<el-form-item label="市场价：">
          <el-input
            v-model="plPrePrice"
            class="w250">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>-->
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
import GoodsCategorySelector from '@/components/GoodsCategorySelector'
import SelectStore from '@/components/SelectStore'
import TabsBox from '@/components/TabsBox'
import * as ApiStores from '@/api/stores'
import * as Validate from '@/utils/validate'

const { validateMoney, positiveNumber } = Validate

export default {
  name: 'GoodsList',

  components: { GoodsCategorySelector, TabsBox, SelectStore },

  data () {
    return {
      companyId: '',
      storeId: '',
      goodsType: GOODS_TYPE,
      list: [],
      Validate,
      loading: true,
      selectInfo: {},
      setVipType: false, // false：单个设置会员价  true.批量设置
      searchForm: {
        productCode: '',
        specCode: '',
        name: '',
        categoryIds: [],
        storeId: '',
        status: ''
      },
      // 商品上架状态
      statusOBJ: { 0: '下架', 1: '可售', 2: '已售罄' },
      exportTypes: [
        { value: '', label: '全部' },
        { value: 1, label: '上架商品' },
        { value: 0, label: '0库存商品' }
      ],
      exportValue: '',
      pagination: {
        page: 1,
        total: 0,
        size: 10
      },
      storeList: [],
      vipPriceDialogVisible: false,
      form: {
        vipPriceList: []
      },
      rules: {
        vipPriceList: {
          discount: [
            { required: true, message: '请填写会员折扣', trigger: 'blur' },
            { validator: (rule, value, callback) => Validate.number, trigger: 'blur' },
            {
              validator: (rule, value, callback) => Validate.limitFloatNumber(rule, value, callback, {
                min: 0.01,
                max: 9.99
              }),
              trigger: 'blur'
            }
          ]
        }
      },
      labelList: [],
      // 已选中的商品分类
      selectedCategoryList: [],
      showGoodsCategorySelector: false,
      // 选中的商品列表
      rowSelection: [],
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
      plVip: ''

      // --------------------------------
      // 此版本暂不需要
      // 用于预览二维码延迟显示
      // previewShow: {},
      // previewLoading: {},
      // 分类被勾选的次数，用于判断单选
      // categoryCheckedTimes: 0,
    }
  },

  computed: {
    storeType () {
      // storeType   门店类型 0总部 1分公司 2门店
      return this.$store.getters.userInfo.storeType
    }
  },

  created () {
    ApiStores.getSysuserStore().then(({ data }) => {
      this.storeList = data || []
    })
    this.getList()
    this.getLabelList()
  },

  methods: {
    changeSelectStore (val) {
      this.companyId = val.companyId || ''
      this.storeId = val.storeId || ''
    },
    getLabelList () {
      ApiProduct.getLabelList().then(({ data }) => {
        this.labelList = data
      })
    },
    exportGoods () {
      if (this.companyId === '') {
        this.$message({ type: 'warning', message: '请选择分公司' })
        return
      }
      let type = this.exportValue
      let filename = this.exportTypes.find(v => v.value === type).label
      ApiProduct.exportProduct({ params: { type, companyId: this.companyId, storeId: this.storeId }, filename })
    },
    upperProduct (data) {
      ApiProduct.storeProductUpdown({
        status: Math.abs(data.status - 1),
        productId: data.id
      }).then(({ code, message }) => {
        this.$message({ type: (code === 'SUCCESS' ? 'success' : 'error'), message: message })
        this.getList()
      })
    },
    // 校验会员折扣
    validateDisCount () {
      return {
        validator: (rule, value, callback) => {
          if (
            value &&
            !/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(
              value
            )
          ) {
            return callback(new Error('最多保留两位小数'))
          } else if (value < 0 || value > 9.99) {
            return callback(new Error('大于0且小于9.99'))
          }
          callback()
        },
        trigger: 'blur'
      }
    },
    getList () {
      const { page, size } = this.pagination
      const { categoryIds } = this.searchForm
      const params = {
        ...this.searchForm,
        // clist: categoryIds.join(),
        categoryIds: categoryIds.join(),
        pageNum: page,
        pageSize: size
      }
      if (params.status >= 2) {
        params.inventory = 0
        delete params.status
      }
      this.loading = true
      ApiProduct.storeproductList(params).then(({ data: { dataList, totalCount } }) => {
        this.list = dataList || []
        // this.list = dataList.map(item => {
        //   item.qrcode = `${window.VUE_APP_API_URL}${window.VUE_APP_BASE_API}product/qrcode?token=${store.getters.token}&scene=${encodeURIComponent(`id=${item.id}`)}`
        //   return item
        // })
        this.pagination.total = totalCount
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
    del () {
      this.$message.warning('后端暂不支持')
    },
    goodsCategoryChanged (val) {
      this.searchForm.categoryIds = val.map(i => i.id)
      this.selectedCategoryList = val
      this.showGoodsCategorySelector = false
    },
    handleSelectionChange (val) {
      this.rowSelection = val
    },
    showVipPrice (val, type) {
      this.setVipType = type
      this.form.vipPriceList = []
      if (!type) { // 单个
        this.selectInfo = val
        console.log(val)
        let params = {
          productId: val.id
        }
        ApiProduct.productdiscount(params).then(({ data }) => {
          if (data.pdList) {
            data.pdList.map(el => {
              this.form.vipPriceList.push({
                name: data.name,
                price: data.price,
                productCode: val.productCode,
                discount: el.discount,
                id: el.id,
                level: el.level,
                productId: val.id
              })
            })
          } else {
            this.addVipList()
          }
        })
      } else { // 批量
        this.addVipList()
      }
      this.vipPriceDialogVisible = true
    },
    addVipList () {
      for (var i = 1; i < 4; i++) {
        this.form.vipPriceList.push({
          discount: 0,
          level: i,
          id: ''
        })
      }
    },
    setVipPrice (formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) return
        let params = {
          discountDTOs: this.form.vipPriceList,
          pids: (this.setVipType ? this.rowSelection.map(el => el.id) : [this.selectInfo.id])
        }
        ApiProduct.setproductdiscount(params).then(() => {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.getList()
          this.cancel()
        })
      })
    },
    cancel () {
      this.vipPriceDialogVisible = false
      this.$refs['form'].resetFields()
    },
    updown (type) {
      // status: 1:上架   0：下架
      ApiProduct.updatebatchproduct({
        pidList: this.rowSelection.map(i => i.id),
        status: Number(type)
      }).then(({ code, message }) => {
        this.$message({ type: (code === 'SUCCESS' ? 'success' : 'error'), message: message })
        this.getList()
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
        default:
          break
      }
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
            pids: pidList.join(','),
            mark: 1
          }
          break
        case 'update':
          params = {
            pids: pidList.join(','),
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
            // prePrice: this.plPrePrice,
            price: this.plPrice
          }
          // if (!params.prePrice || !validateMoney(params.prePrice)) {
          //   this.$message({ type: 'warning', message: '请输入合法的市场价' })
          //   return
          // }
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
        default:
          break
      }

      if (this.isTrue) return
      this.isTrue = true
      this.$confirm(msg, '提示', { type: 'warning' }).then(() => {
        if (type !== 'choose' && type !== 'update') {
          ApiProduct.updatebatchproduct(params).then(({ message }) => {
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
            this.getList()
            this.isTrue = false
          }).catch(() => {
            this.isTrue = false
          })
        }
      }).catch(() => {
        this.isTrue = false
      })
    },
    showQrCode (id) {
      this.$set(this.previewShow, id, true)
    },
    qrLoaded (id) {
      this.$set(this.previewLoading, id, true)
    },
    goodsExport () {
      const { labelIds, categoryIds } = this.searchForm
      ApiProduct.productExport({
        ...this.searchForm,
        labelIds: labelIds.join(),
        categoryIds: categoryIds.join()
      }, '商品导出')
    }
    /*
    // 分类强制单选
    categoryCheckChange (data, checked, interminate) {
      this.categoryCheckedTimes++
      // 跳过处理奇数次勾选
      if (this.categoryCheckedTimes % 2 !== 0) return

      // 交叉点击节点（点击非选中节点）
      if (checked) {
        this.$refs.categoryTree.setCheckedNodes([])
        this.$refs.categoryTree.setCheckedNodes([data])
        return
      }

      // 点击已经选中的节点，置空
      this.$refs.categoryTree.setCheckedNodes([])
    },
    */
  }
}
</script>

<style lang="scss">
  .goods-container2 {
    .vip-price-dialog {
      .el-form-item--medium {
        margin-bottom: 0;

        .el-input__inner {
          text-align: right;
        }
      }
    }

    .dialog-update-label {
      .el-checkbox {
        margin-right: 30px;
        margin-left: 0;
        margin-bottom: 10px;
      }

      .el-checkbox + .el-checkbox {
        margin-left: 0;
      }
    }

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

    .export {
      display: flex;

      .el-form-item--medium .el-form-item__label {
        line-height: 26px;
      }

      .el-form-item--medium .el-form-item__content {
        line-height: 1;
      }

      .el-input__inner {
        border-radius: 5px 0 0 5px;
      }

      .el-button--mini {
        border-radius: 0 5px 5px 0;
      }
    }

    .popover-tips {
      p {
        text-align: center;
        margin: 5px;
      }
    }
  }
</style>
