<template>
  <div class="component-link-selector">
    <el-dialog
      :visible.sync="visible"
      :close-on-click-modal="false"
      :before-close="closeDialog"
      append-to-body
      width="900px"
      title="链接目标">
      <el-tabs
        v-model="innerCurrentTab"
        type="border-card"
        @tab-click="tabClick">
        <el-tab-pane
          v-for="(item, index) in typeListDefault"
          :key="index"
          :label="item.text"
          :name="item.name">

          <!-- 商城页面 -->
          <el-row v-if="item.name == 'shopPage'">
            <el-col :span="4">选择商城页面名称：</el-col>
            <el-col :span="20">
              <el-radio-group v-model="shopPage">
                <template v-for="item in shopPageList">
                  <template
                    v-if="item.id===5&&(userInfo.tenantId===100||userInfo.tenantId===101||userInfo.tenantId===508)">
                    <el-radio
                      :key="item.id"
                      :label="item.id">{{ item.label }}
                    </el-radio>
                  </template>
                  <template v-if="item.id!==5">
                    <el-radio
                      :key="item.id"
                      :label="item.id">{{ item.label }}
                    </el-radio>
                  </template>
                </template>
              </el-radio-group>
            </el-col>
          </el-row>

          <!-- 商品分类 -->
          <el-cascader
            v-else-if="item.name == 'goodsCategory'"
            v-model="category"
            :disabled="categoryList.length === 0"
            :options="categoryList"
            :props="{ children: 'childList', value: 'id', label: 'name'}"
            :show-all-levels="false"
            clearable
            placeholder="---无---"
            expand-trigger="hover"
            change-on-select />

          <template v-else>
            <!-- 商品、活动、优惠券、视频公用 -->
            <div class="search-container">
              <!--搜索你想找的商品-->
              <el-input
                v-model="tableSearch.name"
                placeholder="请输入名称搜索"
                class="input-with-select"
                @keyup.enter.native="handlePageChange(1)">
                <el-select
                  v-if="item.name == 'goodsDetail'"
                  slot="prepend"
                  v-model="goodsSearchType"
                  style="width: 120px;"
                  placeholder="请选择">
                  <el-option
                    v-for="item in goodsSearchTypeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value" />
                </el-select>
                <el-button
                  slot="append"
                  icon="el-icon-search"
                  @click="handlePageChange(1)" />
              </el-input>
            </div>

            <!-- 商品详情 -->
            <el-table
              v-loading="loading"
              v-if="item.name == 'goodsDetail'"
              :data="tableList"
              highlight-current-row
              style="width: 100%"
              @current-change="handleSelected">
              <el-table-column
                label=""
                width="45">
                <template slot-scope="scope">
                  <el-radio
                    v-model="selectedInfo.radioValue"
                    :label="scope.row.id"
                    style="margin-right: 0;"><span /></el-radio>
                </template>
              </el-table-column>
              <el-table-column
                prop="productCode"
                label="编码"
                align="center"
                width="160" />
              <el-table-column
                prop="name"
                label="商品名称"
                align="center"
                min-width="250"
                header-align="center">
                <template slot-scope="scope">
                  <div class="goods-title">{{ scope.row.name }}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="imgUrl"
                label="商品图片"
                align="center"
                width="180">
                <template slot-scope="scope">
                  <img
                    v-if="scope.row.imgUrl"
                    :src="scope.row.imgUrl"
                    style="height: 46px">
                </template>
              </el-table-column>
              <el-table-column
                prop="price"
                label="价格"
                align="center"
                width="100">
                <template slot-scope="scope">¥ {{ scope.row.price }}</template>
              </el-table-column>
            </el-table>

            <!-- 活动详情 -->
            <el-table
              v-loading="loading"
              v-if="item.name == 'activityDetail'"
              :data="tableList"
              highlight-current-row
              style="width: 100%"
              @current-change="handleSelected">
              <el-table-column
                label=""
                width="45">
                <template slot-scope="scope">
                  <el-radio
                    v-model="selectedInfo.radioValue"
                    :label="scope.row.id"
                    style="margin-right: 0;"><span /></el-radio>
                </template>
              </el-table-column>
              <el-table-column
                prop="name"
                label="活动名称"
                align="center"
                min-width="250"
                header-align="center">
                <template slot-scope="scope">
                  <div class="goods-title">{{ scope.row.name }}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="name"
                label="活动时间"
                align="center"
                min-width="320"
                header-align="center">
                <template slot-scope="scope">
                  <div class="goods-title">{{ scope.row.beginTime }} - {{ scope.row.endTime }}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="state"
                label="活动状态"
                align="center"
                min-width="250"
                header-align="center">
                <template slot-scope="scope">
                  <p v-if="scope.row.state == 0">未开始</p>
                  <p v-if="scope.row.state == 1">进行中</p>
                  <p v-if="scope.row.state == 2">已结束</p>
                </template>
              </el-table-column>
            </el-table>

            <!-- 优惠券详情 -->
            <el-table
              v-loading="loading"
              v-if="item.name == 'couponDetail'"
              :data="tableList"
              highlight-current-row
              style="width: 100%"
              @current-change="handleSelected">
              <el-table-column
                label=""
                width="45">
                <template slot-scope="scope">
                  <el-radio
                    v-model="selectedInfo.radioValue"
                    :label="scope.row.id"
                    style="margin-right: 0;"><span /></el-radio>
                </template>
              </el-table-column>
              <el-table-column
                :show-overflow-tooltip="true"
                prop="name"
                min-width="220"
                label="名称" />
              <el-table-column
                :show-overflow-tooltip="true"
                prop="price"
                label="面值"
                align="center" />
              <el-table-column
                :show-overflow-tooltip="true"
                prop="usePrice"
                min-width="150"
                label="使用条件">
                <template slot-scope="scope">
                  <template v-if="scope.row.useRule > 0">满{{ scope.row.usePrice }}元可使用</template>
                  <template v-else>无门槛使用</template>
                </template>
              </el-table-column>
              <el-table-column
                label="领取条件"
                min-width="150">
                <template slot-scope="scope">
                  <template v-if="scope.row.receiveRule > 0">限每人{{ scope.row.receiveTotal }}张</template>
                  <template v-else>不限制领取</template>
                </template>
              </el-table-column>
              <el-table-column
                :show-overflow-tooltip="true"
                label="有效期"
                width="320"
                align="center">
                <template slot-scope="scope">
                  {{ scope.row.beginTime }} - {{ scope.row.endTime }}
                </template>
              </el-table-column>
              <el-table-column
                :show-overflow-tooltip="true"
                prop="total"
                label="优惠券总数"
                align="center" />
            </el-table>

            <!-- 视频详情 -->
            <el-table
              v-loading="loading"
              v-if="item.name == 'videoDetail'"
              :data="tableList"
              highlight-current-row
              style="width: 100%"
              @current-change="handleSelected">
              <el-table-column
                label=""
                width="45">
                <template slot-scope="scope">
                  <el-radio
                    v-model="radioValue"
                    :label="scope.row.id"
                    style="margin-right: 0;"><span /></el-radio>
                </template>
              </el-table-column>
              <el-table-column
                width="60"
                label="视频">
                <template slot-scope="{row}">
                  <div
                    class="goods">
                    <img
                      :src="`${row.videoUrl}?vframe/jpg/offset/2`"
                      style="width: 50px; height: 50px; display: block;">
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                :show-overflow-tooltip="true"
                prop="videoName"
                label="视频名称"
                align="center" />
              <el-table-column
                prop="watchNum"
                label="观看次数"
                align="center" />
              <el-table-column
                :show-overflow-tooltip="true"
                width="150"
                prop="createTime"
                label="发布时间"
                align="center" />
              <el-table-column
                prop="receiveCoupons"
                label="领劵数量"
                align="center" />
              <el-table-column
                prop="shareNum"
                label="分享次数"
                align="center" />
              <el-table-column
                prop="orderNum"
                label="成交单数"
                align="center" />
              <el-table-column
                header-align="center"
                width="180px"
                label="关联信息">
                <template slot-scope="scope">
                  <p>关联商品数：{{ scope.row.productNum }}</p>
                  <p>关联优惠券数：{{ scope.row.couponNum }}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="orderAmount"
                label="交易额"
                align="center" />
            </el-table>

            <!-- 文章详情 -->
            <el-table
              v-loading="loading"
              v-if="item.name == 'textDetail'"
              :data="tableList"
              highlight-current-row
              style="width: 100%"
              @current-change="handleSelected">
              <el-table-column
                label=""
                width="45">
                <template slot-scope="scope">
                  <el-radio
                    v-model="selectedInfo.radioValue"
                    :label="scope.row.id"
                    style="margin-right: 0;"><span /></el-radio>
                </template>
              </el-table-column>
              <el-table-column
                :show-overflow-tooltip="true"
                label="文章标题">
                <template slot-scope="{row}">
                  {{ row.title }}
                </template>
              </el-table-column>
              <el-table-column
                :show-overflow-tooltip="true"
                label="创建时间"
                width="320"
                align="center">
                <template slot-scope="scope">
                  {{ scope.row.createTime }}
                </template>
              </el-table-column>
            </el-table>

            <!--瓜分券详情-->
            <el-table
              v-loading="loading"
              v-if="item.name == 'CouponSplitDetail'"
              :data="tableList"
              highlight-current-row
              style="width: 100%"
              @current-change="handleSelected">
              <el-table-column
                label=""
                width="45">
                <template slot-scope="scope">
                  <el-radio
                    v-model="selectedInfo.radioValue"
                    :label="scope.row.id"
                    style="margin-right: 0;"><span /></el-radio>
                </template>
              </el-table-column>
              <el-table-column
                :show-overflow-tooltip="true"
                label="瓜分券名称">
                <template slot-scope="scope">
                  {{ scope.row.name }}
                </template>
              </el-table-column>
              <el-table-column
                :show-overflow-tooltip="true"
                label="瓜分券方式"
                align="center">
                <template slot-scope="scope">
                  {{ scope.row.distTypeDesc }}
                </template>
              </el-table-column>
              <el-table-column
                label="发放总量"
                align="center">
                <template slot-scope="scope">
                  {{ scope.row.total }}
                </template>
              </el-table-column>
              <el-table-column
                label="剩余券数"
                align="center">
                <template slot-scope="scope">
                  {{ scope.row.surplusNum }}
                </template>
              </el-table-column>
              <el-table-column
                label="活动时间"
                width="320"
                align="center">
                <template slot-scope="scope">
                  {{ scope.row.issueTime }} - {{ scope.row.issueEndTime }}
                </template>
              </el-table-column>
            </el-table>

            <!-- 商品、活动、优惠券、视频公用 -->
            <div class="g-pagination-wrap">
              <el-pagination
                :current-page="tableSearch.pageNum"
                :page-sizes="$store.state.app.pageSizes"
                :page-size="tableSearch.pageSize"
                :total="tableTotal"
                :layout="$store.state.app.layout"
                @size-change="sizeChange"
                @current-change="handlePageChange" />
            </div>
          </template>
        </el-tab-pane>

      </el-tabs>
      <div
        slot="footer"
        class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button
          type="primary"
          @click="submit">确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as ApiCoupon from '@/api/coupon'
import * as ApiActivity from '@/api/activity'
import * as ApiVideo from '@/api/video'
import * as ApiArticle from '@/api/article'
import * as ApiCouponSplit from '@/api/coupon-split'
import ApiProduct from '@/api/product'
import { removeEmptyChildren, getParams } from '@/utils'
import { mapGetters } from 'vuex'

const typeListDefault = {
  shopPage: {
    name: 'shopPage',
    text: '商城页面',
    url: ''
  },
  goodsCategory: {
    name: 'goodsCategory',
    text: '商品分类',
    url: '/pages/search/search',
    api: ApiProduct
  },
  goodsDetail: {
    name: 'goodsDetail',
    text: '商品详情',
    url: '/pages/product/product',
    api: ApiProduct
  },
  activityDetail: {
    name: 'activityDetail',
    text: '活动详情',
    url: '/pages/activity-confirm/activity-confirm',
    api: ApiActivity
  },
  couponDetail: {
    name: 'couponDetail',
    text: '优惠券详情',
    url: '/pages/coupon-detail/coupon-detail',
    api: ApiCoupon
  },
  videoDetail: {
    name: 'videoDetail',
    text: '视频详情',
    url: '/pages/explore-video/explore-video',
    api: ApiVideo
  },
  textDetail: {
    name: 'textDetail',
    text: '文章详情',
    url: '/pages/article-detail/index',
    api: ApiArticle
  },
  CouponSplitDetail: {
    name: 'CouponSplitDetail',
    text: '瓜分券详情',
    url: '/pages-subpackages/promotion/pages/coupon-split/index',
    api: ApiCouponSplit
  }
}
const tableSearch = {
  name: '',
  pageNum: 1,
  pageSize: 10
}
const selectedInfo = { url: '', name: '', radioValue: '', tab: '' }
export default {
  name: 'LinkSelector',

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    currentValue: {
      type: Object,
      default: () => ({})
    }
  },

  data () {
    return {
      typeListDefault: typeListDefault,
      innerCurrentTab: 'shopPage',
      // 选中页面
      shopPage: '',
      // 页面列表
      shopPageList: [
        { id: 1, label: '商城首页', url: '/pages/index/index' },
        { id: 2, label: '商品分类页', url: '/pages/category/category' },
        { id: 3, label: '我的', url: '/pages/profile/profile' },
        { id: 4, label: '拼购列表页', url: '/pages/group-list/group-list' },
        // { id: 5, label: '特步风火活动页', url: '/pages/tb-active-detail/index' }
        { id: 5, label: '砍价列表页', url: '/pages-subpackages/promotion/pages/bargain-list/index' },
        { id: 6, label: '预约单', url: '/pages-subpackages/booking/pages/booking/index' }
      ],
      // 选中分类
      category: [],
      // 分类列表
      categoryList: [],
      // 搜索类型列表
      goodsSearchTypeList: [
        { label: '商品名称', value: 'name' },
        { label: '商品编号', value: 'productCode' },
        { label: '商品货号', value: 'specCode' }
      ],
      // 当前搜索类型
      goodsSearchType: 'name',
      loading: true,
      tableSearch: { ...tableSearch },
      tableList: [],
      tableTotal: 0,
      selectedInfo: { ...selectedInfo }
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    radioValue () {
      return this.selectedInfo.tab === this.innerCurrentTab ? this.selectedInfo.radioValue : ''
    }
  },

  watch: {
    visible (val) {
      if (!val || !this.currentValue.url) return
      const innerCurrentTab = Object.keys(typeListDefault).filter((item) => this.currentValue.url.indexOf(typeListDefault[item].url) > -1 && typeListDefault[item].url !== '')[0] || 'shopPage'
      this.innerCurrentTab = innerCurrentTab
      if (innerCurrentTab === 'shopPage') {
        this.shopPage = (this.shopPageList.find((item) => item.url === this.currentValue.url) || {}).id
      }
      this.selectedInfo.tab = innerCurrentTab
      this.selectedInfo.radioValue = Number(getParams(this.currentValue.url, 'id'))
      console.log(this.selectedInfo.tab)

      this.selectedInfo.url = this.currentValue.url
      this.selectedInfo.name = this.currentValue.name
      this.tabClick({ name: innerCurrentTab })
    }
  },
  methods: {
    tabClick ({ name }) {
      this.tableSearch = { ...tableSearch }
      typeListDefault[name].api && this.getTableList()
    },
    getCategoryList () {
      ApiProduct.getCategoryList().then(({ data }) => {
        removeEmptyChildren(data)
        this.categoryList = data
      })
    },
    getTableList () {
      if (this.innerCurrentTab === 'goodsCategory') {
        this.getCategoryList()
        return
      }
      this.loading = true
      let params = { ...this.tableSearch }
      let methodName = 'list'
      switch (this.innerCurrentTab) {
        case 'goodsDetail':
          // params.status = 1  // 已上架
          params[this.goodsSearchType] = params.name
          if (this.goodsSearchType !== 'name') delete params.name
          methodName = this.storeType <= 0 ? 'getList' : 'storeproductList'
          break
        case 'activityDetail':
          methodName = 'getList'
          break
        case 'couponDetail':
          params.type = 2
          break
        case 'videoDetail':
          params.videoName = params.name
          params.status = 1
          delete params.name
          break
        case 'textDetail':
          params.title = params.name
          delete params.name
          break
        case 'CouponSplitDetail':
          break
      }
      typeListDefault[this.innerCurrentTab].api[methodName](params).then(({ data }) => {
        this.tableList = data.dataList || []
        this.tableTotal = data.totalCount || 0
        this.loading = false
      })
    },
    sizeChange (e) {
      this.tableSearch.pageSize = e
      this.getTableList()
    },
    handlePageChange (page) {
      this.tableSearch.pageNum = page
      this.getTableList()
    },
    handleSelected (val) {
      if (!val) return
      const currentTab = this.innerCurrentTab
      let url = `${typeListDefault[currentTab].url}?id=${val.id}`
      if (currentTab === 'goodsDetail') {
        url += '&type=1' // type 1：商品库id ，2:门店id
      }
      this.selectedInfo.tab = currentTab
      this.selectedInfo.radioValue = Number(val.id)
      this.selectedInfo.url = url
      this.selectedInfo.name = val.name || val.videoName || val.title || ''
    },
    submit () {
      const currentTab = this.innerCurrentTab
      let url
      let name
      switch (currentTab) {
        case 'shopPage':
          const current = this.shopPageList.find(i => i.id === this.shopPage) || {}
          name = current.label
          url = current.url
          break
        case 'goodsCategory':
          const selected = this.getCascaderItem(this.category)
          if (selected.length > 0) {
            const categoryText = selected.map(i => i.name).join('/')
            const categoryId = selected[selected.length - 1].id
            name = `⎾${categoryText}⏌分类`
            if (categoryId) url = `${typeListDefault.goodsCategory.url}?categoryId=${categoryId}`
          }
          break
        default:
          if (currentTab === this.selectedInfo.tab) {
            url = this.selectedInfo.url
            name = this.selectedInfo.name
          }
      }

      if (!url) {
        this.$message({ type: 'warning', message: `请选择${typeListDefault[currentTab].text}` })
        return
      }
      this.$emit('change', { url, name, tab: currentTab })
      this.closeDialog()
    },
    closeDialog () {
      this.$emit('update:visible', false)
    },
    getCascaderItem (val) {
      let opt = this.categoryList
      return val.map((value) => {
        for (let itm of opt) {
          if (itm.id === value) {
            opt = itm.childList
            return itm
          }
        }
        return null
      })
    }
  }
}
</script>

<style lang="scss">
  .component-link-selector {
    .el-dialog__body {
      padding-top: 10px;
    }

    .el-tabs--border-card {
      box-shadow: none;
    }

    .el-tabs__content {
      padding: 20px 10px;
    }

    .el-radio + .el-radio {
      margin-left: 0;
    }

    .el-radio {
      margin-right: 30px;
      margin-bottom: 10px;
    }

    .el-select .el-input {
      width: 110px;
    }
  }
</style>

<style lang="scss" scoped>
  .search-container {
    margin-bottom: 10px;
  }

  .goods-link {
    color: $--color-primary;
  }

  .goods-title {
    @include ellipsis2();
  }
</style>
