<!--商品编辑/添加-->
<template>
  <div class="goods-edit-container">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      validate-on-rule-change
      label-width="80px">
      <el-card
        class="box-card">
        <div slot="header">商品信息</div>
        <el-form-item
          prop="name"
          label="商品名称">
          <div class="goods-name">
            <el-input
              v-model="form.name"
              :maxlength="120"/>
            <span class="word-limit">{{ form.name.length }}/120 字</span>
          </div>
        </el-form-item>
        <el-form-item label="商品分类">
          <el-button
            type="primary"
            size="mini"
            @click="showGoodsCategorySelector = true">选择分类</el-button>
          <goods-category-selector
            :visible.sync="showGoodsCategorySelector"
            :default-value.sync="category"
            :include-half-checked="true"
            :three-level-only="true"
            title="选取商品分类"
            @change="goodsCategoryChanged"/>
        </el-form-item>
        <el-form-item label="标签">
          <el-checkbox-group
            v-if="labelList.length"
            v-model="form.labelList">
            <el-checkbox
              v-for="item in labelList"
              :label="item.id"
              :key="item.id">{{ item.name }}
            </el-checkbox>
          </el-checkbox-group>
          <span
            v-else
            class="text-muted">无</span>
        </el-form-item>
        <el-form-item
          ref="materialMainList"
          required
          prop="materialMainList"
          label="商品图片">
          <div class="img-list">
            <div
              v-background="item.imgUrl"
              v-for="(item, index) in form.materialMainList"
              :key="index"
              class="img-item">
              <div class="sort-bar">
                <i
                  class="icons el-icon-caret-left"
                  @click="handleImgSort('prev', index)"/>
                <i
                  class="icons el-icon-close"
                  @click="(index) => handleImgRemove(item.id, 'main')"/>
                <i
                  class="icons el-icon-caret-right"
                  @click="handleImgSort('next', index)"/>
              </div>
            </div>
            <div
              v-if="form.materialMainList.length < MAX_IMAGE_LENGTH"
              class="el-upload el-upload--picture-card"
              @click="showMaterialSelector = true">
              <i class="el-icon-plus"/>
            </div>
          </div>
          <div/>
          <material-selector
            :visible.sync="showMaterialSelector"
            :product-id="form.id"
            :default-value.sync="form.materialMainList"
            type="image"
            source="goods"
            @change="(val) => materialSelectorChanged(val, 'main')"/>
        </el-form-item>
        <el-form-item
          ref="materialnotMainList"
          prop="materialnotMainList"
          label="商品素材">
          <el-button
            type="primary"
            size="mini"
            @click="materialVisible = true">选择素材
          </el-button>
        </el-form-item>
        <el-form-item
          prop="details"
          label="商品详情"
          style="width: 800px;"
        >
          <el-input
            v-model="form.details"
            :autosize="{ minRows: 3 }"
            type="textarea"/>
        </el-form-item>
        <el-form-item
          prop="showImages"
          label="详情图片">
          <el-button
            type="primary"
            size="mini"
            @click="detailImagesVisible = true">选择详情图片
          </el-button>

          <span class="text-secondary ml20">详情图最多可添加十张</span>
        </el-form-item>
        <el-form-item
          label="商品编码"
          class="w250">
          <el-input v-model="form.productCode"/>
        </el-form-item>
        <el-form-item
          prop="prePrice"
          label="市场价"
          class="w250">
          <el-input v-model="form.prePrice"><template slot="append">元</template></el-input>
        </el-form-item>
        <el-form-item
          prop="weight"
          label="重量"
          class="w250">
          <el-input v-model="form.weight"><template slot="append">KG</template></el-input>
        </el-form-item>
        <el-form-item
          prop="volume"
          label="体积"
          class="w250">
          <el-input v-model="form.volume"><template slot="append">m³</template></el-input>
        </el-form-item>
      </el-card>

      <!--规格信息-->
      <el-card class="mt10">
        <div slot="header">规格信息</div>
        <div
          v-for="(item, index) in form.attributeList"
          :key="index"
          class="spec-item">
          <i
            class="spec-item__delete el-icon-delete"
            @click="specRemove(index)"/>
          <div>
            <el-select
              v-model="item.key"
              class="search-input"
              filterable
              allow-create
              default-first-option
              placeholder="请选择规格"
              @change="changeAttribute(index)">
              <el-option
                v-for="item in attributeListSelect"
                :disabled="item.disabled"
                :key="item.name"
                :label="item.name"
                :value="item.name"/>
            </el-select>
            <el-checkbox
              v-if="index<=0"
              :false-label="0"
              :true-label="1"
              v-model="item.isShow"
              class="ml20"><p
                class="increase-price-explain"
                style="margin-left: 0;">添加规格图片 仅支持为第一个规格设置图片， 建议尺寸：<span class="ui-color1">750 x 750</span> 像素</p></el-checkbox>
          </div>
          <div v-if="item.key">
            <div>
              <div
                v-for="(item2, index2) in item.value"
                :key="index2"
                class="spec-item-value">
                <div style="display: -webkit-box; width: 200px;">
                  <el-select
                    v-model="item2.values"
                    style="width: 137px;"
                    class="search-input"
                    filterable
                    allow-create
                    default-first-option
                    placeholder="请选择规格值"
                    @change="changeAttribute2(index, index2)">
                    <el-option
                      v-for="attributeValue in attributeList2[item.key]"
                      :disabled="attributeValue.disabled"
                      :key="attributeValue.name"
                      :label="attributeValue.name"
                      :value="attributeValue.name"/>
                  </el-select>
                  <el-button
                    slot="append"
                    style="background: #f5f7fa;border-left: 0px;"
                    icon="el-icon-close"
                    @click="specValueRemove(index, index2)"/>
                </div>
                <div
                  v-background="item2.img"
                  v-if="item.isShow > 0 && index<=0"
                  class="mt10 el-upload el-upload--picture-card"
                  @click="showMaterialSelector4 = true">
                  <i class="el-icon-plus"/>
                </div>
                <material-selector
                  :visible.sync="showMaterialSelector4"
                  :is-multi="false"
                  type="image"
                  source="goods"
                  @change="(val) => specmaterialSelectorChanged(index, index2, val)"/>
              </div>
            </div>
            <el-button
              class="mt15"
              icon="el-icon-plus"
              size="mini"
              type="text"
              @click="specValueAdd(index)">添加规格值
            </el-button>
          </div>
        </div>
        <div>
          <el-button
            icon="el-icon-circle-plus-outline"
            type="primary"
            @click="specAdd">添加规格</el-button>
          <span class="increase-price-explain">添加/删除规格后将影响原有规格值数据<span class="ui-color1">（货号、销售价、库存、重量等数据将清零）</span>，请谨慎操作。</span>
        </div>
      </el-card>

      <!--价格与库存-->
      <el-card class="mt10">
        <div slot="header">价格与库存</div>
        <div
          style="display: -webkit-box; padding-bottom: 0;"
          class="spec-item">
          <el-form-item
            prop="batch.prePrice"
            label="市场价"
            class="w250">
            <el-input v-model="form.batch.prePrice"><template slot="append">元</template></el-input>
          </el-form-item>
          <el-form-item
            prop="batch.price"
            label="销售价"
            class="w250">
            <el-input v-model="form.batch.price"><template slot="append">元</template></el-input>
          </el-form-item>
          <el-form-item
            prop="batch.inventory"
            label="库存"
            class="w250">
            <el-input v-model="form.batch.inventory"><template slot="append">件</template></el-input>
          </el-form-item>
          <el-button
            class="ml20"
            type="primary"
            @click="batchFill">批量填充</el-button>
        </div>
        <div>

          <!--
          id: '', // 规格id
          // imgUrl: '', // 规则图片
          inventory: '99', // 库存
          prePrice: '66', // 市场价
          price: '33', // 售卖价
          specCode: '', // 规格编号
          specContent: '黑色', // 规格内容
          status: 1 // 状态 0禁用 1启用
-->
          <el-table
            :data="form.specificationList"
            class="table-wrap">
            <el-table-column
              prop="specContent"
              label="规格"
              header-align="center"/>
            <el-table-column
              label="货号"
              align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.specCode" />
              </template>
            </el-table-column>
            <el-table-column
              label="市场价"
              align="center">
              <template slot-scope="scope">
                <el-form-item
                  :prop="'specificationList.' + scope.$index + '.prePrice'"
                  :rules="rules.specificationList.prePrice"
                  label-width="0">
                  <el-input v-model="scope.row.prePrice" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="销售价"
              align="center">
              <template slot-scope="scope">
                <el-form-item
                  :prop="'specificationList.' + scope.$index + '.price'"
                  :rules="rules.specificationList.price"
                  label-width="0">
                  <el-input v-model="scope.row.price" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="库存"
              align="center">
              <template slot-scope="scope">
                <el-form-item
                  :prop="'specificationList.' + scope.$index + '.inventory'"
                  :rules="rules.specificationList.inventory"
                  label-width="0">
                  <el-input v-model="scope.row.inventory" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="操作"
              width="150"
              fixed="right">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.status"
                  :active-value="1"
                  :inactive-value="0"
                  :active-text="scope.row.status ? '禁用' : '启用'" />
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>

      <!--导购提成设置-->
      <el-card
        :body-style="{ padding: form.commissionRulesDTO.empSwitch === 1 ? '20px': 0 }"
        class="mt10">
        <div slot="header">
          <el-checkbox
            v-model="form.commissionRulesDTO.empSwitch"
            :true-label="1"
            :false-label="0"
            class="mr10"/> 导购提成设置
          <span class="increase-price-explain">填写0或不填则表示无提成</span>
        </div>
        <template v-if="form.commissionRulesDTO.empSwitch === 1">
          <div>
            <el-radio
              v-model="form.commissionRulesDTO.empType"
              :label="1"
              class="w100">按比返佣</el-radio>
            <el-form-item
              prop="commissionRulesDTO.empPercent"
              label="按商品金额的"
              label-width="100px"
              class="ml30 dib"
              style="width: 310px;">
              <el-input
                v-model.number="form.commissionRulesDTO.empPercent"
                :min="0"
                :max="100"
                :disabled="form.commissionRulesDTO.empType === 2"><template slot="append">% 比例提成</template></el-input>
            </el-form-item>
          </div>
          <div>
            <el-radio
              v-model="form.commissionRulesDTO.empType"
              :label="2"
              class="w100">按固定金额返</el-radio>
            <el-form-item
              prop="commissionRulesDTO.empAmount"
              label="每件商品提成"
              label-width="100px"
              class="w250 ml30 dib">
              <el-input
                v-model.number="form.commissionRulesDTO.empAmount"
                :min="0"
                :disabled="form.commissionRulesDTO.empType === 1"><template slot="append">元</template></el-input>
            </el-form-item>
          </div>
        </template>
      </el-card>

      <!--其他设置-->
      <el-card class="mt10">
        <div slot="header">其他设置</div>
        <el-form-item
          label="是否包邮:"
          label-width="65">
          <el-radio
            v-model="form.expressFree"
            :label="1">包邮
          </el-radio>
          <el-radio
            v-model="form.expressFree"
            :label="0">不包邮
          </el-radio>
          <span class="increase-price-explain">（默认运费模板）</span>
        </el-form-item>
        <!--
        <el-form-item
          label="上架状态:"
          label-width="65">
          <el-radio
            v-model="form.status"
            :label="1">立即上架
          </el-radio>
          <el-radio
            v-model="form.status"
            :label="0">暂不上架
          </el-radio>
        </el-form-item>
-->
      </el-card>
    </el-form>

    <el-dialog
      :visible.sync="materialVisible"
      title="商品素材"
      width="945px">

      <p class="mb10"><el-button
        type="primary"
        @click="showMaterialSelector2 = true"
      ><i class="icon icon-plus"/> 添加图片</el-button></p>

      <transition-group
        v-if="form.materialnotMainList.length"
        name="list-complete"
        tag="div"
        class="img-list">
        <div
          v-background="item.imgUrl"
          v-for="(item, index) in form.materialnotMainList"
          :key="index"
          class="img-item">
          <!--<img :src="item.imgUrl">-->
          <div class="sort-bar">
            <i
              class="icons el-icon-close"
              @click="(index) => handleImgRemove(item.id)"/>
          </div>
        </div>
      </transition-group>
      <p
        v-else
        class="tc mt20">暂无图片</p>

      <material-selector
        :visible.sync="showMaterialSelector2"
        :product-id="form.id"
        source="goods"
        @change="(val) => materialSelectorChanged(val)"/>

      <span
        slot="footer"
        class="dialog-footer">
        <el-button @click="materialVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="materialVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :visible.sync="detailImagesVisible"
      title="详情图片"
      width="945px">

      <p class="mb10">
        <el-button
          type="primary"
          @click="showMaterialSelector3 = true"
        ><i class="icon icon-plus"/> 添加图片</el-button>
        <span class="text-secondary ml20">详情图最多可添加十张</span>
      </p>

      <transition-group
        v-if="form.showImages.length"
        name="list-complete"
        tag="div"
        class="img-list">
        <div
          v-background="item.imgUrl"
          v-for="(item, index) in form.showImages"
          :key="index"
          class="img-item">
          <!--<img :src="item.imgUrl">-->
          <div class="sort-bar">
            <i
              class="icons el-icon-close"
              @click="(index) => handleDetailImgRemove(item.imgUrl)"/>
          </div>
        </div>
      </transition-group>
      <p
        v-else
        class="tc mt20">暂无图片</p>

      <material-selector
        :visible.sync="showMaterialSelector3"
        @change="(val) => detailMaterialSelectorChanged(val)"/>

      <span
        slot="footer"
        class="dialog-footer">
        <el-button @click="detailImagesVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="detailImagesVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <div class="ui-edit-btn-wrapper">
      <el-button
        size="large"
        @click="$router.go(-1)">取消</el-button>
      <el-button
        :loading="submitting"
        type="primary"
        size="large"
        @click="submit">保存
      </el-button>
    </div>
  </div>
</template>

<script>
import ApiProduct from '@/api/product'
import ApiMaterial from '@/api/material'
import { removeEmptyChildren } from '@/utils'
import MaterialSelector from '@/components/MaterialSelector'
import GoodsCategorySelector from '@/components/GoodsCategorySelector'
import * as Validate from '@/utils/validate'

// const specificationEmpty = { inventory: '', prePrice: '', price: '', specCode: '', specContent: '', status: '', id: '' }
const MAX_IMAGE_LENGTH = 9

export default {
  name: 'GoodsEdit',

  components: { MaterialSelector, GoodsCategorySelector },

  data () {
    return {
      submitting: false,
      // 已选分类id
      // 用于显示已选分类
      showMaterialSelector: false,
      showMaterialSelector2: false,
      showMaterialSelector3: false,
      showMaterialSelector4: false,
      materialVisible: false,
      detailImagesVisible: false,
      list: [],
      MAX_IMAGE_LENGTH,

      category: [],
      categoryList: [],
      labelList: [],
      showGoodsCategorySelector: false,
      form: {
        id: '',
        name: '', //  商品名称
        categoryList: [], // 商品分类
        labelList: [], // 标签
        materialMainList: [], // 主图商品图片
        materialnotMainList: [], // 非主图商品图片,商品素材
        details: '', // 详情
        showImages: '', // 图片展示位
        productCode: '', // 商品编码
        prePrice: '', //  市场价
        weight: '', // 重量
        volume: '', // 体积
        isOpen: 0, // 开启提成设置 0否 1是
        commissionRulesDTO: {
          empAmount: '', // 导购返佣固定金额
          empPercent: '', // 导购返佣百分比
          empType: 1, // 导购返佣类型 1百分比 2固定金额
          empSwitch: 0, // 导购返佣开关 0关闭 1打开
          id: '' // 返佣规则id
        },
        expressFree: 1, // 是否包邮 0：否 1：是
        // 规格属性
        attributeList: [
          /*
            {
              key: '颜色',
              value: [
                { values: '黑色', img: 'sdfsdf' },
                { values: '红色', img: 'sdfsdf' }
              ],
              isShow: 1
            },
            {
              key: '尺码',
              value: [
                { values: 'm' },
                { values: 'ml' }
              ]
            }
  */
        ],
        specificationList: [
          /*
            {
              id: '', // 规格id
              // imgUrl: '', // 规则图片
              inventory: '99', // 库存
              prePrice: '66', // 市场价
              price: '33', // 售卖价
              specCode: '', // 规格编号
              specContent: '黑色', // 规格内容
              status: 1 // 状态 0禁用 1启用
            }
  */
        ],
        batch: {
          prePrice: '',
          price: '',
          inventory: ''
        }
      },
      rules: {
        name: [{ required: true, message: '请填写商品名称', trigger: 'blur' }],
        details: [{ required: true, message: '请填写商品详情', trigger: 'blur' }],
        materialMainList: [{
          validator: (rule, value, callback) => {
            if (value.length === 0) callback(new Error('请至少选择一张商品图片'))
            else if (value.length > MAX_IMAGE_LENGTH) callback(new Error(`最多能选择${MAX_IMAGE_LENGTH}张商品图片`))
            else callback()
          },
          trigger: 'change'
        }],
        prePrice: [
          { required: true, message: '请填写市场价', trigger: 'blur' },
          { validator: Validate.money, trigger: 'blur' }
        ],
        weight: [
          { required: true, message: '请填写重量', trigger: 'blur' },
          { validator: Validate.min0, trigger: 'blur' }
        ],
        volume: [
          { required: true, message: '请填写体积', trigger: 'blur' },
          { validator: Validate.min0, trigger: 'blur' }
        ],
        'batch.prePrice': [
          { validator: Validate.money, trigger: 'blur' }
        ],
        'batch.price': [
          { validator: Validate.money, trigger: 'blur' }
        ],
        'batch.inventory': [
          { validator: (rule, value, callback) => Validate.limitNumber(rule, value, callback, { min: 0 }), trigger: 'blur' }
        ],
        'commissionRulesDTO.empPercent': [{
          validator: (rule, value, callback) => {
            if (value === '') {
              this.form.commissionRulesDTO.empType === 1 ? callback(new Error('请输入提成比例')) : callback()
            }
            if (value !== 0 && !/^[1-9][0-9]*$/.test(value)) callback(new Error('请输入正整数'))
            if (value < 0) callback(new Error('不能小于0'))
            if (value > 100) callback(new Error('不能大于100'))
            callback()
          },
          trigger: 'blur'
        }],
        'commissionRulesDTO.empAmount': [{
          validator: (rule, value, callback) => {
            if (value === '') {
              this.form.commissionRulesDTO.empType === 2 ? callback(new Error('请输入商品提成')) : callback()
            }
            if (!/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(value)) callback(new Error('请输入大于0的小数（小数位最多2位）'))
            callback()
          },
          trigger: 'blur'
        }],
        specificationList: {
          prePrice: [
            { required: true, message: '请填写市场价', trigger: 'blur' },
            { validator: Validate.money, trigger: 'change' }
          ],
          price: [
            { required: true, message: '请填写销售价', trigger: 'blur' },
            { validator: Validate.money, trigger: 'change' }
          ],
          inventory: [
            { required: true, message: '请填写库存', trigger: 'blur' },
            { validator: (rule, value, callback) => Validate.limitNumber(rule, value, callback, { min: 0 }), trigger: 'blur' }
          ]
        }
      },
      attributeList: [],
      attributeList2: {}
    }
  },
  computed: {
    attributeListSelect () {
      const selected = this.form.attributeList.map(item => item.key)
      return this.attributeList.map((item) => {
        if (selected.indexOf(item.name) > -1) {
          item.disabled = true
        } else {
          item.disabled = false
        }
        return item
      })
    }
  },

  watch: {
    'form.commissionRulesDTO.empType' (val) {
      if (!val) return
      // 对切换前输入框值作校验
      setTimeout(() => {
        this.$refs.form.validateField(`commissionRulesDTO.${val === 1 ? 'empAmount' : 'empPercent'}`)
      }, 160)
    },
    'form.commissionRulesDTO.saleType' (val) {
      if (!val) return
      // 对切换前输入框值作校验
      setTimeout(() => {
        this.$refs.form.validateField(`commissionRulesDTO.${val === 1 ? 'saleAmount' : 'salePercent'}`)
      }, 160)
    }
  },

  created () {
    const { id } = this.$route.params

    this.getLabelList()
    this.getCategoryList()
    this.getAttributeList()

    if (!id) return

    ApiProduct.getDetail({ id }).then(({ data }) => {
      const {
        id,
        name,
        categoryList,
        labelList,
        materialMainList = [],
        materialnotMainList = [],
        details,
        showImages,
        productCode,
        prePrice,
        weight,
        volume,
        commissionRulesDTO,
        expressFree,
        attributeList,
        specificationList
      } = data

      // const {
      //   empSwitch,
      //   empType,
      //   saleSwitch,
      //   saleType
      // } = commissionRulesDTO
      this.form = {
        ...this.form,
        id,
        name,
        details,
        materialMainList,
        materialnotMainList: materialnotMainList.map(i => {
          if (i.type === 2) i.imgUrl += '?vframe/jpg/offset/2' // 处理视屏占位图
          return i
        }),
        showImages: showImages ? showImages.split(',').map(imgUrl => ({ imgUrl })) : [],
        productCode,
        prePrice,
        weight,
        volume,
        isOpen: commissionRulesDTO.empSwitch,
        commissionRulesDTO: {
          empAmount: commissionRulesDTO.empAmount, // 导购返佣固定金额
          empPercent: commissionRulesDTO.empPercent, // 导购返佣百分比
          empType: commissionRulesDTO.empType, // 导购返佣类型 1百分比 2固定金额
          empSwitch: commissionRulesDTO.empSwitch, // 导购返佣开关 0关闭 1打开
          id: commissionRulesDTO.id // 返佣规则id
        },
        expressFree,
        attributeList,
        specificationList
      }

      // 初始化选中分类
      this.form.category = categoryList // .filter(i => i.level === 3).map(i => i.id)
      this.form.labelList = labelList.map(i => i.id)

      this.sortMaterial()
    })
  },

  methods: {
    specmaterialSelectorChanged (index, index2, val) {
      this.form.attributeList[index].value[index2].img = (val[0] && val[0].imgUrl) || ''
      this.showMaterialSelector4 = false
    },
    goodsCategoryChanged (val) {
      this.category = val
      this.showGoodsCategorySelector = false
    },
    saveAttribute (name, parentId) {
      ApiProduct.attributeAdd({ name: name, parentId: parentId, rank: 1 }).then(() => {
        this.getAttributeList()
        setTimeout(() => this.setAttributeList2())
      })
    },
    getAttributeList () {
      ApiProduct.attributeList().then(({ data }) => {
        this.attributeList = data || []
        this.setAttributeList2()
      })
    },
    getCategoryList () {
      ApiProduct.getCategoryList().then(({ data }) => {
        removeEmptyChildren(data)
        this.categoryList = data
      })
    },
    getLabelList () {
      ApiProduct.getLabelList().then(({ data }) => {
        this.labelList = data
      })
    },
    handleImgSort (type, index) {
      const current = this.form.materialMainList[index].rank
      if (type === 'prev' && index > 0) {
        this.form.materialMainList[index].rank = this.form.materialMainList[index - 1].rank
        this.form.materialMainList[index - 1].rank = current
      } else if (type === 'next' && index < this.form.materialMainList.length - 1) {
        this.form.materialMainList[index].rank = this.form.materialMainList[index + 1].rank
        this.form.materialMainList[index + 1].rank = current
      }
      this.sortMaterial()
    },
    handleImgRemove (id, type) {
      const isMain = type === 'main'
      const list = this.form[isMain ? 'materialMainList' : 'materialnotMainList']
      // 解绑并移除图片
      ApiMaterial.unbind({ id }).then(() => list.splice(list.findIndex(item => item.id === id), 1))
    },
    materialSelectorChanged (val, type) {
      if (!val.length) return

      const isMain = type === 'main'
      const fieldName = isMain ? 'materialMainList' : 'materialnotMainList'

      const currentIds = this.form[fieldName].map(i => i.id)
      const selected = val
        // .filter(item => item.isDelete !== 1)
        .map((item, index) => ({
          id: item.id,
          imgUrl: item.imgUrl,
          rank: index + 1
        }))

        // 去重
      const waitPush = []
      selected.forEach(item => {
        if (!currentIds.includes(item.id)) waitPush.push(item)
      })

      if (isMain) {
        if (this.form.materialMainList.length + waitPush.length > MAX_IMAGE_LENGTH) {
          this.$message.warning(`最多只能选${MAX_IMAGE_LENGTH}张商品图片`)
          return
        }

        this.$refs.materialMainList.clearValidate()
        this.showMaterialSelector = false
        this.sortMaterial()
      } else {
        this.$refs.materialnotMainList.clearValidate()
        this.showMaterialSelector2 = false
      }

      this.form[fieldName].push(...waitPush)
    },
    sortMaterial () {
      // TODO 此处未考虑像 [1, 2, 2, 3] 这样值非全等且有连续相临数字的情况
      // HACK 后端未将rank保存上的情况下rank值都为相等，正常情况下不应如此
      if (new Set(this.form.materialMainList.map(i => i.rank)).size === 1) {
        this.form.materialMainList = this.form.materialMainList.map((item, index) => {
          item.rank = index + 1
          return item
        })
      }

      this.form.materialMainList = this.form.materialMainList.sort((a, b) => a.rank - b.rank)
    },
    // 商品详情图片选择
    detailMaterialSelectorChanged (val) {
      const current = this.form.showImages.map(i => i.imgUrl)
      const selected = val.map((item, index) => ({
        imgUrl: item.imgUrl
      }))
      // 去重
      selected.forEach(item => {
        if (!current.includes(item.imgUrl)) this.form.showImages.push(item)
      })
      this.showMaterialSelector3 = false
    },
    handleDetailImgRemove (imgUrl) {
      const list = this.form.showImages
      list.splice(list.findIndex(item => item.imgUrl === imgUrl), 1)
    },
    setAttributeList2 () {
      let datass = {}
      let datass2 = {}
      this.form.attributeList.forEach(item => {
        datass2[item.key] = item.value.map(item2 => item2.values)
      })
      this.attributeListSelect.forEach((item) => {
        let childList = item.childList || []
        childList.forEach((item3) => {
          if (datass2[item.name] && datass2[item.name].indexOf(item3.name) > -1) {
            item3.disabled = true
          } else {
            item3.disabled = false
          }
        })
        datass[item.name] = childList
      })
      this.attributeList2 = datass
    },

    changeAttribute (index) {
      //      const names = (this.attributeList || []).map(item => item.name)
      //      if (names.indexOf(val) <= -1) {
      //        this.saveAttribute(val, 0)
      //      } else {
      //        this.setAttributeList2()
      //      }
      let attributeItem = this.form.attributeList[index]
      attributeItem.value = []
      const names = (this.attributeList || []).map(item => item.name)
      if (names.indexOf(attributeItem.key) <= -1) {
        this.saveAttribute(attributeItem.key, 0)
      } else {
        this.setAttributeList2()
      }
    },
    changeAttribute2 (index, index2) {
      let attributeItem = this.form.attributeList[index]
      const se = attributeItem.value[index2].values
      const selected = (this.attributeList || []).filter(item => item.name === attributeItem.key)[0]
      const childList = (selected.childList || []).map(item => item.name)
      if (childList.indexOf(se) <= -1) {
        this.saveAttribute(se, selected.id)
      } else {
        this.setAttributeList2()
      }
      this.setSku()
    },

    // 根据选择的规格值生成sku组合
    setSku () {
      let sku = this.form.attributeList.map((item) => {
        return (item.value || []).map((item2) => {
          return item2.values || ''
        })
      })
      const skuResult = this.skuCombine(sku.reverse())
      this.form.specificationList = skuResult.map((item) => {
        return {
          id: '', // 规格id
          // imgUrl: '', // 规则图片
          inventory: '', // 库存
          prePrice: '', // 市场价
          price: '', // 售卖价
          specCode: '', // 规格编号
          specContent: item.join('、'), // 规格内容
          status: 1 // 状态 0禁用 1启用
        }
      })
    },
    skuCombine (arr) {
      if (arr.length <= 0) return []
      let r = [];
      (function f (t, a, n) {
        if (n === 0) return r.push(t)
        for (let i = 0; i < a[n - 1].length; i++) {
          f(t.concat(a[n - 1][i]), a, n - 1)
        }
      })([], arr, arr.length)
      return r
    },

    // 添加规格
    specAdd () {
      this.form.attributeList.push({ key: '', value: [], isShow: 1 })
    },
    // 删除规格
    specRemove (index) {
      this.$confirm('删除规格后将影响原有规格值数据（货号、销售价、库存、重量等数据将清零）, 确定删除吗?', '提示', { type: 'warning' }).then(() => {
        this.form.attributeList.splice(index, 1)
        this.setSku()
      }).catch(() => {})
    },

    // 添加规格值
    specValueAdd (index) {
      this.form.attributeList[index].value.push({ values: '', img: '' })
    },

    // 删除规格值
    specValueRemove (index, index2) {
      this.form.attributeList[index].value.splice(index2, 1)
      this.setAttributeList2()
      this.setSku()
    },

    // 批量填充
    batchFill () {
      let _self = this
      Promise.all(['prePrice', 'batch.price', 'batch.inventory'].map(item => {
        return new Promise(function (resolve) {
          _self.$refs['form'].validateField(item, (error) => resolve(error))
        })
      })).then((data) => {
        if (data.join('')) {
          return
        }
        this.$confirm('批量填充将覆盖以前的值，确认批量填充吗，', '提示', { type: 'warning' }).then(() => {
          this.form.specificationList.forEach((item) => {
            ['prePrice', 'price', 'inventory'].forEach((item2) => {
              if (this.form.batch[item2]) {
                item[item2] = this.form.batch[item2]
              }
            })
          })
        }).catch(() => {})
      })
    },

    submit () {
      // 资源格式化
      const materialMainList = (this.form.materialMainList || []).map((i) => ({ id: i.id, rank: i.rank }))
      const materialnotMainList = (this.form.materialnotMainList || []).map((i) => ({ id: i.id }))
      const showImages = (this.form.showImages || []).map((i) => i.imgUrl).join()

      const params = {
        ...this.form,
        id: this.form.id,
        categoryList: this.category.map(i => ({ id: i.id })),
        materialMainList,
        materialnotMainList,
        showImages,
        isOpen: this.form.commissionRulesDTO.empSwitch,
        labelList: this.form.labelList.map(i => ({ id: i }))
      }

      this.$refs.form.validate((valid) => {
        if (!valid) {
          this.submitting = false
          return
        }
        console.log(JSON.stringify(params))
        this.submitting = true
        ApiProduct.addOrUpdateProduct(params)
          .then(({ message }) => {
            this.$message({ type: 'success', message })
            this.$router.go(-1)
          })
          .catch((res) => {
          })
          .finally(() => (this.submitting = false))
      })
    }
  }
}
</script>

<style lang="scss">
  .goods-edit-container {
    .table-wrap {
      .el-form-item--medium {
        margin-bottom: 0;
      }
    }
  }
</style>

<style lang="scss" scoped>
  .goods-name {
    display: flex;
    .word-limit {
      padding-left: 10px;
      width: 85px;
    }
  }

  .increase-price-explain {
    margin-left: 10px;
    font-size: 12px;
    color: $--color-text-secondary;
  }

  .img-list {
    display: inline-block;
    .img-item {
      display: inline-block;
      position: relative;
      margin-right: 20px;
      width: 148px;
      height: 148px;
      background-color: #fbfdff;
      border: 1px solid $--border-color-lighter;
      // transition: all 0.25s;
      img {
        width: 100%;
        height: 100%;
        border-radius: 6px;
      }
      .sort-bar {
        display: flex;
        justify-content: space-around;
        align-items: center;
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 20px;
        line-height: 20px;
        text-align: center;
        color: white;
        font-weight: bold;
        background-color: rgba(0, 0, 0, 0.3);
        .icons {
          font-size: 16px;
          cursor: pointer;
          &:first-child {
            /*margin-right: 80px;*/
          }
        }
      }
    }
  }

  .spec-item {
    position: relative;
    padding: 0 0 20px;
    margin-bottom: 20px;
    border-bottom: 1px solid $--border-color-base;
    &__delete {
      color: $--color-text-secondary;
      font-size: 16px;
      position: absolute;
      right: 10px;
      top: 10px;
      cursor: pointer;
      &:hover {
        color: $--color-danger;
      }
    }
    .spec-item-value {
      display: inline-block;
      font-size: 0;
      width: 193px;
      margin-right: 10px;
      margin-top: 15px;
      .el-input-group__append, .el-input-group__prepend {
        padding: 0 10px;
      }
      .el-upload--picture-card {
        width: 193px;
        height: 193px;
        display: -webkit-box;
        -webkit-box-align: center;
        -webkit-box-pack: center;
      }
    }

    .search-input {
      cursor: auto;
    }
  }
</style>
