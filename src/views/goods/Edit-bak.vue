<!--商品编辑/添加-->
<template>
  <div class="goods-edit-container">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      validate-on-rule-change
      label-width="80px">
      <el-card class="box-card">
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
          <!-- <el-cascader
            :options="categoryList"
            :disabled="categoryList.length === 0"
            :props="{ children: 'childList', value: 'id', label: 'name'}"
            v-model="category"
            clearable
            placeholder="---无---"
            expand-trigger="hover"
            change-on-select/> -->
          <el-button
            type="primary"
            size="mini"
            @click="showGoodsCategorySelector = true">选择分类</el-button>
          <!-- <span
            v-if="categoryText"
            class="ml10 text-regular">已选分类：{{ categoryText }}</span> -->
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
            v-model="label">
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
      </el-card>

      <el-card class="mt10">
        <div slot="header">规格信息</div>
        <el-form-item
          prop="productCode"
          label="商品编号"
          class="w500">
          <el-input v-model="form.productCode"/>
        </el-form-item>
        <div
          v-for="(item, index) in form.specificationList"
          :key="item.id"
          class="spec-item">
          <i
            v-if="form.specificationList.length > 1"
            class="spec-item__delete el-icon-delete"
            @click="specRemove(index)"/>
          <div class="form-group">
            <el-form-item
              :prop="`specificationList.${index}.specCode`"
              :rules="[validateSpecCode(index)]"
              label="货号"
              class="w500">
              <el-input v-model="item.specCode"/>
            </el-form-item>
          </div>
          <el-form-item
            :prop="`specificationList.${index}.specContent`"
            :rules="{ required: true, message: '请填写规格', trigger: 'blur' }"
            label="规格"
            class="w500">
            <el-input
              v-model="item.specContent"
              placeholder="请输入规格，如：黑色，2018款，羊毛，XXL"/>
          </el-form-item>
          <el-form-item
            :prop="`specificationList.${index}.price`"
            :rules="[{ required: true, message: '请填写售卖价', trigger: 'blur' }, positiveNumber(), validatePrice(index)]"
            label="售卖价"
            class="dib w300">
            ¥ <el-input
              v-model.number="item.price"
              min="0"
              type="number"
              step="0.01"
              class="w200"/>
          <!-- IMPORTANT: 此处及以下type为number的input特意加上了step=0.01，是为了避免在firefox上输入小数时显示红框的问题，
            副作用是步长只能按0.01调整，目前没有更好的解决方案 -->
          <!-- TODO 可以考虑不用type为number -->
          </el-form-item>
          <el-form-item
            :prop="`specificationList.${index}.prePrice`"
            :rules="[{ required: true, message: '请填写市场价', trigger: 'blur' }, positiveNumber(), validatePrePrice(index)]"
            label="市场价"
            class="dib w300">
            ¥ <el-input
              v-model.number="item.prePrice"
              min="0"
              type="number"
              step="0.01"
              class="w200"/>
          </el-form-item>
          <el-form-item
            :prop="`specificationList.${index}.inventory`"
            :rules="[{ required: true, message: '请填写库存', trigger: 'blur' }, positiveNumber()]"
            label="库存"
            class="w300">
            <el-input
              v-model.number="item.inventory"
              min="0"
              type="number"
              class="w200"/> 件
          </el-form-item>
          <el-form-item
            :prop="`specificationList.${index}.weight`"
            :rules="[positiveNumber()]"
            label="重量"
            class="dib w400">
            <el-input
              v-model.number="item.weight"
              min="0"
              type="number"
              step="0.01"
              class="w200"/> KG（公斤）
          </el-form-item>
          <el-form-item
            :prop="`specificationList.${index}.volume`"
            :rules="[positiveNumber()]"
            label="体积"
            class="dib w400">
            <el-input
              v-model.number="item.volume"
              min="0"
              type="number"
              step="0.01"
              class="w200"/> m³（立方米）
          </el-form-item>
        </div>

        <p class="spec-item__action">
          <el-button
            type="primary"
            @click="specAdd"><i class="el-icon-circle-plus-outline"/> 添加规格</el-button>
        </p>
      </el-card>

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
              class="dib w300 ml50"
              label-width="200">
              <el-input
                v-model.number="form.commissionRulesDTO.empPercent"
                :min="0"
                :max="100"
                :disabled="form.commissionRulesDTO.empType === 2"
                class="w100" /> % 比例提成
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
              class="dib w300 ml50"
              label-width="200">
              <el-input
                v-model.number="form.commissionRulesDTO.empAmount"
                :min="0"
                :disabled="form.commissionRulesDTO.empType === 1"
                class="w100" /> 元
            </el-form-item>
          </div>
        </template>
      </el-card>

      <el-card
        :body-style="{ padding: form.commissionRulesDTO.saleSwitch === 1 ? '20px': 0 }"
        class="mt10">
        <div slot="header">
          <el-checkbox
            v-model="form.commissionRulesDTO.saleSwitch"
            :true-label="1"
            :false-label="0"
            class="mr10"/> 推广员佣金设置
          <span class="increase-price-explain">留白则默认奖金设置中的值，且两者之和不可大于商品价格的50%</span>
        </div>
        <template v-if="form.commissionRulesDTO.saleSwitch === 1">
          <div>
            <el-radio
              v-model="form.commissionRulesDTO.saleType"
              :label="1"
              class="w100">按比返佣</el-radio>
            <!--:rules="[positiveNumber(true), { type: 'number', message: '奖金比例必须为数字值'}]"-->
            <el-form-item
              prop="commissionRulesDTO.salePercent"
              label="本店销售奖金比例"
              class="dib w300 ml50"
              label-width="200">
              <el-input
                v-model.number="form.commissionRulesDTO.salePercent"
                :min="0"
                :max="100"
                :disabled="form.commissionRulesDTO.saleType !== 1"
                class="w100" /> %
            </el-form-item>
          </div>
          <div>
            <el-radio
              v-model="form.commissionRulesDTO.saleType"
              :label="2"
              class="w100">按固定金额返</el-radio>
            <!--:rules="[positiveNumber(), { type: 'number', message: '销售奖金必须为数字值'}]"-->
            <el-form-item
              prop="commissionRulesDTO.saleAmount"
              label="本店销售奖金"
              class="dib w300 ml50"
              label-width="200">
              <el-input
                v-model.number="form.commissionRulesDTO.saleAmount"
                :min="0"
                :disabled="form.commissionRulesDTO.saleType !== 2"
                class="w100" /> 元
            </el-form-item>
          </div>
        </template>
      </el-card>

      <el-card class="mt10">
        <div slot="header">上架设置
          <!-- <span class="increase-price-explain">留白则默认奖金设置中的值，且两者之和不可大于商品价格的50%</span> -->
        </div>
        <!-- <div style="display: -webkit-box;">
          <el-form-item label-width="0">
            <el-checkbox
              v-model="form.isAdd"
              :true-label="0"
              :false-label="-1">可加价
            </el-checkbox>
          </el-form-item>
          <el-form-item
            :rules="{ required: form.isAdd === 1, message: '请填写设置允许加价上限', trigger: 'blur' }"
            prop="maxPrice"
            label="设置允许加价上限："
            label-width="150px">
            <el-input
              v-model="form.maxPrice"
              type="number"
              class="w100 ml10 mr10"/>元
          </el-form-item>
        </div> -->
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

    <div class="btn-wrapper">
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

const specificationEmpty = { inventory: '', prePrice: '', price: '', specCode: '', specContent: '', volume: '', weight: '' }
const MAX_IMAGE_LENGTH = 9

export default {
  name: 'GoodsEdit',

  components: { MaterialSelector, GoodsCategorySelector },

  data () {
    return {
      submitting: false,
      isEdit: false,
      form: {
        id: '',
        name: '',
        details: '',
        isAdd: -1,
        maxPrice: 0,
        status: 0,
        productCode: '',
        materialMainList: [],
        materialnotMainList: [],
        showImages: [],
        specificationList: [{ ...specificationEmpty }],
        commissionRulesDTO: {
          empAmount: '',
          empPercent: '',
          empSwitch: 0,
          empType: 1,
          saleAmount: '',
          salePercent: '',
          saleSwitch: 0,
          saleType: 1
        }
      },
      rules: {
        name: [{ required: true, message: '请填写商品名称', trigger: 'blur' }],
        details: [{ required: true, message: '请填写商品详情', trigger: 'blur' }],
        // productCode: [{ required: true, message: '请填写商品编号', trigger: 'blur' }],
        // specCode: [{ required: true, message: '请填写货号', trigger: 'blur' }],
        materialMainList: [{
          validator: (rule, value, callback) => {
            if (value.length === 0) callback(new Error('请至少选择一张商品图片'))
            else if (value.length > MAX_IMAGE_LENGTH) callback(new Error(`最多能选择${MAX_IMAGE_LENGTH}张商品图片`))
            else callback()
          },
          trigger: 'change'
        }],
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
        'commissionRulesDTO.salePercent': [{
          validator: (rule, value, callback) => {
            if (value === '') {
              this.form.commissionRulesDTO.saleType === 1 ? callback(new Error('请输入奖金比例')) : callback()
            }
            if (value !== 0 && !/^[1-9][0-9]*$/.test(value)) callback(new Error('请输入正整数'))
            if (value < 0) callback(new Error('不能小于0'))
            if (value > 100) callback(new Error('不能大于100'))
            callback()
          },
          trigger: 'blur'
        }],
        'commissionRulesDTO.saleAmount': [{
          validator: (rule, value, callback) => {
            if (value === '') {
              this.form.commissionRulesDTO.saleType === 2 ? callback(new Error('请输入销售奖金')) : callback()
            }
            if (!/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(value)) callback(new Error('请输入大于0的小数（小数位最多2位）'))
            callback()
          },
          trigger: 'blur'
        }]
      },
      // 已选分类id
      category: [],
      // 用于显示已选分类
      categoryText: '',
      categoryList: [],
      label: [],
      labelList: [],
      showGoodsCategorySelector: false,
      showMaterialSelector: false,
      showMaterialSelector2: false,
      showMaterialSelector3: false,
      materialVisible: false,
      detailImagesVisible: false,
      list: [],
      MAX_IMAGE_LENGTH
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
    this.isEdit = !!id

    this.getLabelList()
    this.getCategoryList()

    if (!this.isEdit) return

    ApiProduct.getDetail({ id }).then(({ data }) => {
      const {
        name,
        categoryList,
        details,
        materialMainList = [],
        materialnotMainList = [],
        showImages,
        labelList,
        productCode,
        specificationList,
        isAdd,
        maxPrice,
        status,
        commissionRulesDTO
      } = data

      const {
        empSwitch,
        empType,
        saleSwitch,
        saleType
      } = commissionRulesDTO

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
        specificationList: specificationList.length ? specificationList : [{ ...specificationEmpty }],
        productCode,
        isAdd,
        maxPrice,
        status,
        commissionRulesDTO: {
          ...commissionRulesDTO,
          empSwitch: empSwitch === null ? 0 : empSwitch,
          empType: empType || 1,
          saleSwitch: saleSwitch === null ? 0 : saleSwitch,
          saleType: saleType || 1
        }
      }

      // 初始化选中分类
      this.category = categoryList // .filter(i => i.level === 3).map(i => i.id)
      this.label = labelList.map(i => i.id)

      this.sortMaterial()
    })
  },

  methods: {
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
    goodsCategoryChanged (val) {
      this.category = val // .map(i => i.id)
      this.categoryText = val.map(i => i.name).join('/')
      this.showGoodsCategorySelector = false
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
    handleImgRemove (id, type) {
      const isMain = type === 'main'
      const list = this.form[isMain ? 'materialMainList' : 'materialnotMainList']
      // 解绑并移除图片
      ApiMaterial.unbind({ id }).then(() => list.splice(list.findIndex(item => item.id === id), 1))
    },
    handleDetailImgRemove (imgUrl) {
      const list = this.form.showImages
      list.splice(list.findIndex(item => item.imgUrl === imgUrl), 1)
    },
    // 添加规格
    specAdd () {
      this.form.specificationList.push({ ...specificationEmpty })
    },
    // 删除规格
    specRemove (index) {
      this.form.specificationList.splice(index, 1)
    },
    // 校验每个规格的货号不能相同
    validateSpecCode (index) {
      return {
        validator: (rule, value, callback) => {
          if (!value) return callback()
          const isRepeat = this.form.specificationList.filter(item => item.specCode === value).length > 1
          if (isRepeat) {
            callback(new Error('货号必须唯一'))
            return
          }
          callback()
        },
        trigger: 'blur'
      }
    },
    // 校验售卖价
    validatePrice (index) {
      return {
        validator: (rule, value, callback) => {
          if (!value) return callback()
          if (this.form.specificationList[index].prePrice) this.$refs.form.validateField(`specificationList.${index}.prePrice`)
          callback()
        },
        trigger: 'blur'
      }
    },
    // 校验市场价
    validatePrePrice (index) {
      return {
        validator: (rule, value, callback) => {
          if (+value < +this.form.specificationList[index].price) {
            callback(new Error('市场价必须大于售卖价'))
            return
          }
          callback()
        },
        trigger: 'blur'
      }
    },
    positiveNumber (isPercent) {
      return {
        validator: (rule, value, callback) => {
          if (value < 0) callback(new Error('不能小于0'))
          if (isPercent && value > 100) callback(new Error('不能大于100'))
          callback()
        },
        trigger: 'blur'
      }
    },
    submit () {
      // 只留需要的规格参数
      const specificationList = this.form.specificationList.map((item, index) => {
        const result = {
          identify: index + 1,
          inventory: item.inventory,
          prePrice: item.prePrice,
          price: item.price,
          specCode: item.specCode,
          specContent: item.specContent,
          volume: item.volume,
          weight: item.weight
        }
        if (item.id) result.id = item.id
        return result
      })

      // 资源格式化
      const materialMainList = this.form.materialMainList.map((i) => ({ id: i.id, rank: i.rank }))
      const materialnotMainList = this.form.materialnotMainList.map((i) => ({ id: i.id }))
      const showImages = this.form.showImages.map((i) => i.imgUrl).join()

      const params = {
        ...this.form,
        id: +this.form.id,
        categoryList: this.category.map(i => ({ id: i.id })),
        labelList: this.label.map(id => ({ id })),
        specificationList,
        materialMainList,
        materialnotMainList,
        showImages
      }

      this.$refs.form.validate((valid) => {
        if (!valid) {
          this.submitting = false
          return
        }

        this.submitting = true
        ApiProduct.addOrUpdateProduct(params)
          .then(({ message }) => {
            this.$message({ type: 'success', message })
            this.$router.go(-1)
          }).finally(() => (this.submitting = false))
      })
    }
  }
}
</script>

<style lang="scss">
  .btn-wrapper {
    margin: 40px;
    text-align: center;
    .el-button {
      padding: 14px 40px;
      margin-right: 20px;
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
    padding: 20px 0 0;
    border-top: 1px solid $--border-color-base;
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

    &__action {
      padding-top: 20px;
      border-top: 1px solid $--border-color-base;
    }
  }

  // .list-complete-enter,
  // .list-complete-leave-to
  //   /* .list-complete-leave-active for below version 2.1.8 */ {
  //   opacity: 0;
  //   transform: translateX(10px);
  // }
  // .list-complete-leave-active {
  //   position: absolute;
  // }
</style>
