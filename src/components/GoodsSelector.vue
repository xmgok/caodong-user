<!--商品选择器-->
<template>
  <div>
    <el-dialog
      :visible="visible"
      :before-close="close"
      custom-class="component-goods-selector"
      append-to-body
      width="900px"
      title="商品选择">
      <el-tabs
        :value="tabType"
        type="border-card"
        @tab-click="tabClick">
        <el-tab-pane
          v-if="!hideCondition"
          name="condition"
          label="按条件选取商品">
          <el-form :model="form">
            <div class="big-wrap">
              <div class="left-wrap">
                <p class="hd-title">商品分类</p>
                <div class="tree-wrap">
                  <el-tree
                    ref="tree"
                    :data="categoryList"
                    :default-checked-keys="categorySelected"
                    :props="{ children: 'childList', label: 'name' }"
                    default-expand-all
                    show-checkbox
                    node-key="id" />
                </div>
              </div>
              <div class="right-wrap">
                <p class="hd-title">价格</p>
                <div class="price-wrap">
                  <el-input
                    v-model="form.startPrice"
                    :style="{width:'130px'}"
                    type="number"
                    placeholder="最低价格" />
                  <div>&nbsp;至&nbsp;</div>
                  <el-input
                    v-model="form.endPrice"
                    :style="{width:'130px'}"
                    type="number"
                    placeholder="最高价格" />
                  <div>&nbsp;元&nbsp;</div>
                </div>

                <p class="hd-title">商品标签</p>
                <div class="tag-wrap">
                  <el-checkbox-group v-model="labelSelected">
                    <el-checkbox
                      v-for="item in labelList"
                      :label="item.id"
                      :key="item.id"
                      class="tag-item">{{ item.name }}
                    </el-checkbox>
                  </el-checkbox-group>
                </div>
              </div>
            </div>
          </el-form>
        </el-tab-pane>

        <el-tab-pane
          v-if="!hideManual"
          name="manual"
          label="手动添加商品">
          <el-form>
            <el-form-item
              label="商品分类"
              style="margin-bottom: 0;">
              <el-checkbox-group
                v-model="categoryIds"
                style="display: inline;">
                <el-checkbox
                  v-for="item in selectedCategoryList"
                  :label="item.id"
                  :key="item.id">{{ item.name }}
                </el-checkbox>
              </el-checkbox-group>
              <el-button
                :class="[selectedCategoryList.length?'ml10':'']"
                type="primary"
                size="mini"
                @click="showGoodsCategorySelector = true">选择分类
              </el-button>
            </el-form-item>
            <el-form-item
              label="商品标签"
              style="margin-bottom: 0;">
              <div
                class="tag-wrap tag-wrap-reset"
                style="display: inline;">
                <el-checkbox-group v-model="labelSelected">
                  <el-checkbox
                    v-for="item in labelList"
                    :label="item.id"
                    :key="item.id"
                    class="tag-item">{{ item.name }}
                  </el-checkbox>
                </el-checkbox-group>
              </div>
            </el-form-item>
            <el-form-item
              label="商品类型"
              style="margin-bottom: 0;">
              <el-checkbox-group v-model="typeIds">
                <el-checkbox
                  v-for="(value, key) in goodsType"
                  :key="key"
                  :label="Number(key)">{{ value }}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
          <div class="top-func">
            <div style="width: 400px;">
              <el-input
                v-model="keyword"
                placeholder="搜索你想找的商品"
                class="input-with-select">
                <el-select
                  slot="prepend"
                  v-model="searchType"
                  placeholder="请选择">
                  <el-option
                    label="商品名称"
                    value="name" />
                  <el-option
                    label="商品编号"
                    value="productCode" />
                  <el-option
                    label="商品货号"
                    value="specCode" />
                </el-select>
                <el-button
                  slot="append"
                  icon="el-icon-search"
                  @click="onSearch" />
              </el-input>
            </div>
            <div class="text">已选<span>{{ multipleSelectionAll.length }}</span>件</div>
          </div>

          <el-table
            ref="multipleTable"
            :data="listData"
            tooltip-effect="dark"
            @selection-change="handleSelectionChange">
            <el-table-column
              v-if="multiple"
              type="selection"
              width="60" />
            <el-table-column
              v-if="!multiple"
              label=""
              width="45">
              <template slot-scope="scope">
                <el-radio
                  :label="scope.row.id"
                  v-model="multipleSelection[0]"
                  @change.native="getTemplateRow(scope.$index,scope.row)"><span /></el-radio>
              </template>
            </el-table-column>
            <el-table-column
              label="图片"
              width="65">
              <template slot-scope="scope">
                <img
                  :src="scope.row.imgUrl"
                  class="img">
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              min-width="220"
              label="名称">
              <template slot-scope="scope">
                <p class="name">{{ scope.row.name }}</p>
              </template>
            </el-table-column>
            <el-table-column
              prop="productCode"
              label="编码"
              width="160" />
              <!--
<el-table-column
prop="price"
label="价格"
width="80"/>
<el-table-column
prop="inventory"
label="库存"
width="80"/>
-->
          </el-table>

          <div class="g-pagination-wrap">
            <el-pagination
              :current-page="currentPage"
              :page-sizes="$store.state.app.pageSizes"
              :page-size="pageSize"
              :total="totalCount"
              :layout="$store.state.app.layout"
              @size-change="sizeChange"
              @current-change="handleCurrentChange" />
          </div>
        </el-tab-pane>
      </el-tabs>

      <div
        slot="footer"
        class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button
          type="primary"
          @click="submit">确 定
        </el-button>
      </div>
    </el-dialog>

    <goods-category-selector
      :leaf-only="true"
      :visible.sync="showGoodsCategorySelector"
      title="选取商品分类"
      @change="goodsCategoryChanged"
    />
  </div>
</template>

<script>
import { GOODS_TYPE } from '@/config/const'
import ApiProduct from '@/api/product'
import GoodsCategorySelector from '@/components/GoodsCategorySelector'

export default {
  name: 'GoodsSelector',

  components: { GoodsCategorySelector },

  props: {
    hideCondition: {
      type: Boolean,
      default: false
    },
    hideManual: {
      type: Boolean,
      default: false
    },
    visible: {
      type: Boolean,
      default: false
    },
    conditionData: {
      type: Object,
      default: () => ({})
    },
    manualData: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      default: 'condition'
    },
    multiple: {
      type: Boolean,
      default: true
    },
    storeId: {
      type: [String, Number],
      default: ''
    }
  },

  data () {
    return {
      typeIds: [],
      goodsType: GOODS_TYPE,
      tabType: this.type,
      // --- 条件
      form: {
        startPrice: '',
        endPrice: ''
      },
      labelList: [],
      categoryList: [],
      categorySelected: [],
      labelSelected: [],
      // --- 手动
      keyword: '',
      searchType: 'name',
      multipleSelectionAll: [], // 所有选中的数据包含跨页数据
      multipleSelection: [], // 当前页选中的数据
      idKey: 'id', // 标识列表数据中每一行的唯一键的名称
      pageSize: 10,
      currentPage: 1,
      totalCount: 0,
      listData: [],
      // 已选中的商品分类
      categoryIds: [],
      selectedCategoryList: [],
      showGoodsCategorySelector: false
    }
  },

  /*
  watch: {
    visible (val) {
      if (val) {
        ApiProduct.getLabelList().then(({ data }) => (this.labelList = data))
        ApiProduct.getCategoryList().then(({ data = [] }) => (this.categoryList = data))

        this.getProduct()
      }
    }
  },
*/

  computed: {
    storeType () {
      // storeType   门店类型 0总部 1分公司 2门店
      return this.$store.getters.userInfo.storeType
    }
  },

  created () {
    ApiProduct.getLabelList().then(({ data }) => (this.labelList = data))
    ApiProduct.getCategoryList().then(({ data = [] }) => (this.categoryList = data))

    this.getProduct()
    if (this.tabType === 'condition') {
      const { startPrice, endPrice, categoryList, labelList } = this.conditionData
      this.form = {
        startPrice: startPrice,
        endPrice: endPrice
      }
      this.categorySelected = categoryList
      this.labelSelected = labelList
    } else if (this.tabType === 'manual') {
      this.multipleSelectionAll = this.manualData
    }
  },

  methods: {
    goodsCategoryChanged (val) {
      this.categoryIds = val.map(i => i.id)
      this.selectedCategoryList = val
      this.showGoodsCategorySelector = false
      this.getProduct()
    },
    getProduct () {
      let params = {
        categoryIds: this.categoryIds.join(),
        // checkSelect: 1,
        pageNum: this.currentPage,
        pageSize: this.pageSize
        // status: 1
      }
      params[this.searchType] = this.keyword
      if (this.storeType > 0) {
        // params.status = 1
      }
      if (this.storeId) {
        params.storeId = this.storeId
      }
      if (this.labelSelected) {
        params.labelIds = this.labelSelected.join(',')
      }
      if (this.typeIds) {
        params.typeIds = this.typeIds.join(',')
      }
      // storeType
      ApiProduct[this.storeType <= 0 && !this.storeId ? 'getList' : 'storeproductList'](params).then(({ data = {} }) => {
        this.listData = data.dataList || []
        this.totalCount = data.totalCount || 0
        setTimeout(() => this.setSelectRow(), 50)
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = []
      val.forEach((item) => this.multipleSelection.push(item[this.idKey]))
      setTimeout(() => this.changePageCoreRecordData(), 50)
    },
    getTemplateRow (index, val) {
      this.multipleSelection = [val[this.idKey]]
      this.multipleSelectionAll = [val[this.idKey]] // 修复单选可以选多个的bug。
      setTimeout(() => this.changePageCoreRecordData(), 50)
    },
    changePageCoreRecordData () {
      let idKey = this.idKey
      if (this.multipleSelectionAll.length <= 0) {
        this.multipleSelectionAll = this.multipleSelection
        return
      }

      this.multipleSelectionAll = Array.from(new Set(this.multipleSelectionAll.concat(this.multipleSelection)))

      let noSelectIds = []
      // 得到当前页没有选中的id
      this.listData.forEach(item => {
        if (this.multipleSelection.indexOf(item[idKey]) < 0) {
          noSelectIds.push(item[idKey])
        }
      })
      this.multipleSelectionAll = this.multipleSelectionAll.filter((item) => noSelectIds.indexOf(item) <= -1)
    },
    setSelectRow () {
      if (!this.multipleSelectionAll || this.multipleSelectionAll.length <= 0) return

      // 标识当前行的唯一键的名称
      this.$refs.multipleTable && this.$refs.multipleTable.clearSelection()
      this.listData.forEach((item, index) => {
        if (this.multipleSelectionAll.indexOf(item[this.idKey]) >= 0) {
          this.$refs.multipleTable.toggleRowSelection(this.listData[index], true)
        }
      })
    },
    sizeChange (e) {
      this.pageSize = e
      this.getProduct()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getProduct()
    },
    onSearch () {
      this.currentPage = 1
      this.getProduct()
    },
    close () {
      this.$emit('update:visible', false)
    },
    submit () {
      let data = {
        tabType: this.tabType
      }
      if (this.hideCondition) {
        data.data = this.multipleSelectionAll
      } else if (this.hideManual) {
        data.data = this.getConditionData()
      } else {
        data.data = this.tabType === 'condition' ? this.getConditionData() : this.multipleSelectionAll
      }

      this.$emit('change', data)
      this.close()
    },
    getConditionData () {
      const categorySelected = this.$refs.tree.getCheckedNodes().map(item => item.id)
      return {
        ...this.form,
        categoryList: categorySelected,
        labelList: this.labelSelected
      }
    },
    tabClick ({ name }) {
      this.tabType = name
    }
  }
}
</script>

<style lang="scss">
  .component-goods-selector {
    .el-dialog__body {
      padding: 5px 20px;
    }

    /*条件选择*/
    .big-wrap {
      display: -webkit-box;
      -webkit-box-align: start;
    }

    .left-wrap {
      width: 300px;
    }

    .right-wrap {
      -webkit-box-flex: 1;
      box-sizing: border-box;
      padding-left: 20px;
    }

    .hd-title {
      font-size: 14px;
      font-weight: bold;
      padding-bottom: 10px;
    }

    .tree-wrap {
      height: 350px;
      overflow-y: auto;
    }

    .price-wrap {
      margin-bottom: 20px;
      display: -webkit-box;
      -webkit-box-align: center;
    }

    .tag-wrap {
      font-size: 0;

      &.tag-wrap-reset {
        .tag-item {
          width: auto;
          vertical-align: middle;
        }
      }

      .tag-item {
        display: inline-block;
        width: 33.333%;
        overflow: hidden;
      }
    }

    /* 手动选择*/
    .top-func {
      padding-bottom: 20px;
      display: -webkit-box;
      -webkit-box-align: center;

      .text {
        -webkit-box-flex: 1;
        text-align: right;
        /*font-size: 18px;*/
        font-weight: bold;
        color: #333;

        span {
          font-size: 28px;
          padding: 0 5px;
        }
      }
    }

    .img {
      height: 35px;
      display: block;
    }

    .name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .el-select .el-input {
      width: 110px;
    }

    .input-with-select .el-input-group__prepend {
      background-color: #fff;
    }
  }
</style>
