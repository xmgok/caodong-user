<template>
  <div class="page-active-product">
    <el-dialog
      :visible.sync="visible"
      :before-close="close"
      :loading="loading"
      title="活动商品"
      width="1500px">
      <div>
        <el-button
          class="ml10"
          type="primary"
          icon="el-icon-plus"
          @click="showGoodsSelector = true"
        >添加商品
        </el-button>
        <el-button
          :disabled="multipleSelection.length <= 0"
          class="ml10"
          type="primary"
          @click="dialogDiscountVisible = true"
        >设置直播折扣
        </el-button>
        <el-button
          :disabled="multipleSelection.length <= 0"
          class="ml10"
          type="primary"
          @click="batchDel"
        >批量删除
        </el-button>
      </div>
      <!-- table -->
      <el-form
        ref="searchForm"
        :rules="rules"
        :model="searchForm">
        <el-table
          :row-key="getRowKeys"
          :data="searchFormList"
          class="mt10"
          @selection-change="handleSelectionChange">
          <el-table-column
            :reserve-selection="true"
            type="selection"
            width="55"/>
          <el-table-column
            width="70"
            align="center"
            label="缩略图">
            <template v-slot="scope">
              <img
                :src="scope.row.imgUrl"
                style="width: 50px; height: 50px; display: block; margin: 0 auto;">
            </template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="name"
            label="商品名称" />
          <el-table-column
            :show-overflow-tooltip="true"
            width="200px;"
            prop="productCode"
            align="center"
            label="商品编号" />
          <el-table-column
            width="180px"
            align="center"
            label="规格类型">
            <template
              slot-scope="scope">
              <template v-for="(item, index) in searchForm.productList">
                <span
                  v-if="scope.row.id === item.productId"
                  :key="item.productId">
                  <el-radio-group
                    v-model="searchForm.productList[index].specType"
                    class="pr10">
                    <el-radio :label="1">全部</el-radio>
                    <el-radio :label="2">指定规格</el-radio>
                  </el-radio-group>
                </span>
              </template>
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            width="300px"
            label="商品规格">
            <template slot-scope="scope" >
              <template v-for="(item, index) in searchForm.productList">
                <span
                  v-if="scope.row.id == item.productId && item.specType == 2"
                  :key="item.productId">
                  <el-checkbox-group
                    v-model="searchForm.productList[index].specIds"
                    class="mt10">
                    <el-checkbox
                      v-for="item in scope.row._specificationList"
                      :label="item.id"
                      :key="item.id">{{ item.specContent }}
                    </el-checkbox>
                  </el-checkbox-group>
                </span>
              </template>
            </template>
          </el-table-column>
          <el-table-column
            width="200px"
            align="center"
            label="折扣类型">
            <template slot-scope="scope" >
              <template v-for="(item, index) in searchForm.productList">
                <span
                  v-if="scope.row.id == item.productId"
                  :key="item.productId">
                  <el-select
                    slot="prepend"
                    v-model="searchForm.productList[index].type"
                    style="width: 130px;"
                    placeholder="请选择">
                    <el-option
                      :value="1"
                      label="折扣率" />
                    <el-option
                      :value="2"
                      label="促销价" />
                  </el-select>
                </span>
              </template>
            </template>
          </el-table-column>
          <el-table-column
            width="200px"
            align="center"
            label="折扣值">
            <template slot-scope="scope" >
              <template v-for="(item, index) in searchForm.productList">
                <span
                  v-if="scope.row.id == item.productId"
                  :key="item.productId">
                  <el-form-item
                    v-if="searchForm.productList[index].type === 1"
                    :prop="`productList.${index}.discount`"
                    :rules="[
                      { required: true, trigger: 'blur' },
                      {
                        validator: (rule, value, callback) => limitFloatNumber(rule, value, callback, {
                          min: 0.01,
                          max: 100
                        }),
                        trigger: 'blur'
                      },
                      { validator: min0, trigger: 'blur' }
                    ]"
                    label-width="0"
                    class="table-form-item">
                    <el-input
                      v-model="searchForm.productList[index].discount"
                      style="width:130px">
                      <template slot="append">%</template>
                    </el-input>
                  </el-form-item>
                  <el-form-item
                    v-if="searchForm.productList[index].type == 2"
                    :prop="`productList.${index}.price`"
                    :rules="[
                      { required: true, trigger: 'blur' },
                      { validator: min0, trigger: 'blur' }
                    ]"
                    label-width="0"
                    class="table-form-item">
                    <el-input
                      v-model="searchForm.productList[index].price"
                      style="width:130px">
                      <template slot="append">元</template>
                    </el-input>
                  </el-form-item>
                </span>
              </template>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            fixed="right"
            width="150"
            align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="del(scope.row.ids,scope.row.id,scope.$index)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>

      <!-- 分页 -->
      <div class="g-pagination-wrap">
        <el-pagination
          :current-page="searchForm.pageNum"
          :page-sizes="$store.state.app.pageSizes"
          :page-size="searchForm.pageSize"
          :total="searchFormTotal"
          :layout="$store.state.app.layout"
          @size-change="sizeChange"
          @current-change="pageChange"
        />
      </div>

      <!-- footer -->
      <div class="ui-edit-btn-wrapper">
        <template >
          <el-button
            @click="close()">取消
          </el-button>
          <el-button
            :loading="saveIng"
            type="primary"
            @click="submit">保存
          </el-button>
        </template>
      </div>
    </el-dialog>

    <!-- 添加商品 -->
    <goods-selector
      v-if="showGoodsSelector"
      :visible.sync="showGoodsSelector"
      :manual-data="productIds"
      :hide-condition="true"
      type="manual"
      @change="goodsSelectorChanged" />

    <!-- 修改新增折扣 -->
    <el-dialog
      :visible.sync="dialogDiscountVisible"
      title="设置折扣"
      width="500px">
      <el-form
        ref="form"
        :model="form"
        :rules="formRules">
        <el-form-item label="折扣类型">
          <el-radio-group v-model="form.type">
            <el-radio :label="1">折扣率</el-radio>
            <el-radio :label="2">促销价</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 折扣 -->
        <el-form-item
          v-if="form.type === 1"
          class="mt20"
          label="数值"
          prop="discount">
          <el-input
            v-model="form.discount"
            style="width:250px">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <!-- 促销 -->
        <el-form-item
          v-if="form.type === 2"
          class="mt20"
          label="数值"
          prop="price">
          <el-input
            v-model="form.price"
            style="width:250px">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
      >
        <el-button
          type="primary"
          size="small"
          @click="sureDis">确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import SelectStore from '@/components/SelectStore'
import GoodsSelector from '@/components/GoodsSelector'
import * as Validate from '@/utils/validate'
import ApiProduct from '@/api/product'
import * as ApiBroadcast from '@/api/broadcast'
export default {
  components: { SelectStore, GoodsSelector },
  props: {
    // select
    // 是否显示
    visible: {
      type: Boolean,
      default: false
    },
    productRoomId: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      positiveNumber: Validate.positiveNumber,
      limitFloatNumber: Validate.limitFloatNumber,
      min0: Validate.min0,
      // 数据
      searchFormList: [
      ], // 商品记录
      searchFormTotal: 0,
      searchForm: {
        pageNum: 1,
        pageSize: 10,
        videoName: ' ',
        status: 0,
        storeId: '',
        companyId: '',
        input: '',
        productList: [] // 添加商品

      },
      form: {
        type: 1,
        discount: '',
        price: ''

      }, // 直播折扣
      loading: false, // 商品
      multipleSelection: [], // 选择项
      saveIng: false,
      showGoodsSelector: false, // 新增商品
      dialogDiscountVisible: false, // 修改折扣
      formRules: {
        discount: [
          { required: true, trigger: 'blur' },
          {
            validator: (rule, value, callback) => Validate.limitFloatNumber(rule, value, callback, {
              min: 0.01,
              max: 100
            }),
            trigger: 'blur'
          },
          { validator: Validate.min0, trigger: 'blur' }

        ],
        price: [
          { required: true, trigger: 'blur' },
          { validator: Validate.positiveNumber, trigger: 'blur' }
        ]

      },
      rules: {

      }

    }
  },
  computed: {
    productIds () {
      return this.searchForm.productList.map((item) => item.productId)
    }
  },
  watch: {
    visible: function (val) {
      this.searchForm.pageNum = 1
      this.seeGoodList()
    },
    'searchForm.productList': {
      handler: function (newVal, oldVal) {
        newVal.forEach(el1 => {
          this.searchForm.productList.forEach(el => {
            if (el.id === el1.id || el.productId === el1.productId) {
              el = el1
            }
          })
        })
      },
      deep: true
    }
  },
  mounted () {},
  methods: {
    // 查看直播商品
    seeGoodList () {
      this.loading = true
      this.searchFormList = []
      this.searchForm.productList = []
      ApiBroadcast.productList({
        roomId: this.productRoomId,
        pageNum: this.searchForm.pageNum,
        pageSize: this.searchForm.pageSize
      }).then(({ data }) => {
        data.dataList.forEach((item, index, arr) => {
          if (item.productId) {
            ApiProduct.getDetail({ id: item.productId }).then(({ data }) => {
              var obj = {
                ...item,
                ...data,
                _specificationList: data.specificationList,
                ids: item.ids,
                type: item.type,
                price: item.price,
                discount: item.discount,
                specIds: item.specIds ? item.specIds : [],
                specType: item.specType,
                productId: item.productId,
                isDel: 'flag'
              }
              arr[index] = obj
              // setTimeout(() => {
              this.searchFormList = JSON.parse(JSON.stringify(arr))
              this.searchForm.productList = JSON.parse(JSON.stringify(arr))
              // }, 200)
            })
          }
        })
        this.searchFormTotal = data.totalCount || 0
        this.loading = false
      }).catch(() => { this.loading = false })
    },
    goodsSelectorChanged ({ data }) {
      const list = data.map((item) => {
        const obj = (this.searchForm.productList || []).find((v) => v.id === item)
        if (obj) {
          return obj
        }
        return {
          productId: item,
          specIds: [],
          specType: 1,
          type: 1,
          discount: '',
          price: '',
          ids: this.searchForm.productList.map(val => val.id === item ? val.ids : '') }
      })
      this.searchForm.productList = JSON.parse(JSON.stringify(list))
      this.searchFormList = JSON.parse(JSON.stringify(list))
      let multipleSelection = this.searchForm.productList.map(item => ({ ...item, ids: typeof item.ids === 'object' ? item.ids.join('') : item.ids }))
      ApiBroadcast.productAdd({
        roomId: this.productRoomId,
        productSpecDTOS: multipleSelection
      }).then(() => {
        this.seeGoodList()
      })
    },
    // 分页选中数据
    getRowKeys (row) {
      return row.id
    },
    // 批量设置折扣值
    sureDis () {
      this.$refs.form.validate(valid => {
        if (!valid) return
        this.multipleSelection.forEach(e => {
          ApiBroadcast.setDiscount({
            discount: this.form.discount,
            ids: [e.ids],
            price: this.form.price,
            type: this.form.type
          }).then(() => {
            this.seeGoodList()
            this.form.discount = ''
            this.form.price = ''
            this.form.type = 1
            this.dialogDiscountVisible = false
          })
        })

        // this.multipleSelection.forEach((item, index) => {
        //   this.searchForm.productList.forEach((ele, idx) => {
        //     console.log(ele, item)
        //     // 编辑item.productId 新增 item.id
        //     if (ele.productId === item.id) {
        //       ele.discount = this.form.discount
        //       ele.price = this.form.price
        //       ele.type = this.form.type
        //     }
        //   }
        //   )
        // })
      })
    },
    editDis () {
      this.dialogDiscountVisible = true
    },
    submit () {
      this.$refs.searchForm.validate(valid => {
        if (!valid) return
        // 需选中可保持
        // let tempArr = []
        // this.multipleSelection.forEach(val => {
        //   this.searchForm.productList.forEach(item => {
        //     if (item.productId === val.id) {
        //       console.log(item)
        //       val = {
        //         ...val,
        //         discount: item.discount,
        //         price: item.price,
        //         productId: item.productId,
        //         specIds: item.specIds,
        //         specType: item.specType,
        //         type: item.type,
        //         ids: typeof item.ids === 'object' ? item.ids.join(',') : item.ids
        //       }
        //       tempArr.push(val)
        //     }
        //   })
        // })
        // this.multipleSelection = tempArr
        let flag = true
        this.searchForm.productList.forEach(v => {
          if (v.specIds.length <= 0 && v.specType === 2) {
            flag = false
            this.$message({ type: 'warning', message: '指定规格不能为空！' })
          }
        })
        if (!flag) return
        let multipleSelection = this.searchForm.productList.map(item => ({ ...item, ids: typeof item.ids === 'object' ? item.ids.join('') : item.ids }))
        // 不选中可以保存
        ApiBroadcast.productAdd({
          roomId: this.productRoomId,
          productSpecDTOS: multipleSelection
        }).then(() => {
          this.$message({ type: 'success', message: '操作成功' })
          this.saveIng = false
          this.close()
        })
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
      this.seeGoodList()
    },
    pageChange (e, type) {
      this.searchForm.pageNum = e
      if (this.searchFormList.length <= 0) return
      this.seeGoodList()
    },
    close () {
      this.$emit('update:visible', false)
    },
    searchFn () {
      this.searchForm.pageNum = 1
      this.getList()
    },
    // 删除
    del (ids, id, index) {
      // 接口删除
      this.$confirm('确定删除该商品吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ApiBroadcast.productDel({
          idList: [ids]
        }).then(() => {
          this.pageChange(1)
          this.$message({ type: 'success', message: '删除成功' })
        }).catch(() => { })
      })
    },
    // 批量删除
    batchDel () {
      this.multipleSelection.forEach((item, index) => {
        this.searchFormList.forEach((ele, idx) => {
          // 接口删除
          if (ele.isDel === 'flag' && ele.id === item.id) {
            ApiBroadcast.productDel({
              idList: [item.ids]
            }).then(() => {
              this.pageChange(1)
            }).catch(() => { })
          }
        }
        )
      })
      this.$message({ type: 'success', message: '删除成功' })
    }
  }
}
</script>
<style lang="scss" scoped >
.page-active-product{
 /deep/.el-form-item{
    margin-bottom: 0!important;
  }
}
</style>
