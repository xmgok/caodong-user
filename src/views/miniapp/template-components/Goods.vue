<template>
  <div class="template-components-goods">
    <el-form
      ref="form"
      :rules="formRules"
      :model="form"
      label-width="100px">
      <el-form-item label="列表名称样式">
        <el-select
          v-model="form.nameType"
          class="w200"
          @change="changeNameType">
          <el-option
            :value="1"
            label="文字样式"/>
          <el-option
            :value="2"
            label="图片样式"/>
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="form.nameType == 1"
        label="列表名称文字">
        <el-input
          v-model="form.name"
          class="w200"
          placeholder="请输入列表名称"
          @blur="emitData"/>
      </el-form-item>
      <el-form-item
        v-if="form.nameType == 2"
        label="列表名称图片">
        <div class="img-wrap">
          <el-card
            :body-style="{ padding: '0px' }"
            shadow="hover">
            <div @click="showMaterialSelector = true">
              <img
                v-if="form.nameImgUrl"
                :src="form.nameImgUrl"
                class="img">
              <div
                v-else
                class="img-uploader">
                <p class="img-uploader-plus"><i class="icons el-icon-plus"/> 添加图片</p>
              </div>
            </div>
          </el-card>
          <p class="ui-color3 f12">图片建议尺寸为 750 x 80 像素（图片高度根据宽度自适应）</p>
        </div>
      </el-form-item>
      <el-form-item label="选择商品">
        <el-button
          type="primary"
          size="mini"
          @click="showGoodsSelector = true">选取商品</el-button>
      </el-form-item>
    </el-form>
    <material-selector
      :visible.sync="showMaterialSelector"
      :is-multi="false"
      type="image"
      @change="materialSelectorChanged"/>
    <!--商品选择-->
    <goods-selector
      v-if="showGoodsSelector"
      :visible.sync="showGoodsSelector"
      :type="{1: 'condition', 2: 'manual'}[form.searchType]"
      :condition-data="form.search"
      :manual-data="form.productList"
      @change="goodsSelectorChanged"/>
  </div>
</template>

<script>
import GoodsSelector from '@/components/GoodsSelector'
import MaterialSelector from '@/components/MaterialSelector'

export default {
  components: {
    GoodsSelector,
    MaterialSelector
  },
  props: {
    defaultValue: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      showMaterialSelector: false,
      showGoodsSelector: false,
      form: {
        nameType: 1, // 1:文字样式 2:图片样式
        name: '',
        nameImgUrl: '',
        searchType: 1, // 1:按条件搜索 2:指定商品
        productList: [],
        search: {
          categoryList: [],
          labelList: [],
          startPrice: '',
          endPrice: ''
        }
      },
      formRules: {}
    }
  },

  created () {
    this.form = Object.assign(this.form, this.defaultValue)
    this.emitData()
  },

  methods: {
    goodsSelectorChanged ({ tabType, data }) {
      tabType = tabType === 'condition' ? 1 : 2
      this.form.searchType = tabType
      this.form[tabType === 1 ? 'search' : 'productList'] = data
      this.emitData()
    },
    changeNameType () {
      this.emitData()
    },
    materialSelectorChanged (data) {
      this.form.nameImgUrl = data[0].imgUrl || ''
      this.showMaterialSelector = false
      this.emitData()
    },
    emitData () {
      this.$emit('change', this.form)
    }
  }
}
</script>

<style lang="scss">
  .template-components-goods {
    .img-uploader {
      display: block;
      position: relative;
      cursor: pointer;
      width: 100%;
      min-height: 80px;
      text-align: center;
      &-plus {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 12px;
        .icons {
          font-size: 20px;
          color: #8c939d;
          vertical-align: -2px;
        }
      }
    }
    .img-wrap {
      width: 375px;
      height: auto;
      .img {
        width: 100%;
        height: auto;
        display: block;
      }
    }
  }
</style>
