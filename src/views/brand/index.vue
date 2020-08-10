<template>
  <div class="page-brand">
    <el-form
      ref="form"
      :rules="formRules"
      :model="form"
      label-width="100px">
      <div class="form-wrap">
        <div class="form-item">
          <el-form-item
            label="品牌名称"
            prop="name">
            <el-input
              v-model="form.name"
              :style="{width:inputWidth }"
              maxlength="30">
              <template slot="append">{{ (form.name && form.name.length) || 0 }}/30</template>
            </el-input>
          </el-form-item>
          <el-form-item
            label="主营类目"
            prop="categoryValue">
            <el-cascader
              :options="categoryList"
              :disabled="categoryList.length === 0"
              v-model="form.categoryValue"
              :style="{width:inputWidth }"
              :props="categoryProps" />
            <p class="tip">为了更好得提供服务，建议请选择最符合的商品类别</p>
          </el-form-item>

          <el-form-item
            label="品牌介绍"
            prop="introduce">
            <el-input
              :rows="4"
              v-model="form.introduce"
              :style="{width:inputWidth }"
              maxlength="300"
              type="textarea"
              placeholder="请输入内容"/>
            <p class="ui-color3 tr mr10 w400">{{ (form.introduce && form.introduce.length) || 0 }}/300</p>
          </el-form-item>

          <el-form-item
            ref="logoUrlForm"
            label="品牌logo"
            prop="logoUrl">
            <div
              class="img-uploader"
              @click="materialSelector('logoUrl')">
              <img
                v-if="form.logoUrl"
                :src="form.logoUrl"
                class="img" >
              <p
                v-else
                class="img-uploader-plus"><i class="icons el-icon-plus"/> 添加图片</p>
            </div>
            <p class="tip">建议尺寸为 160 x 160 像素</p>
          </el-form-item>

          <el-form-item
            ref=""
            label="公众号二维码"
            prop="qrCode">
            <div
              class="img-uploader"
              @click="materialSelector('qrCode')">
              <img
                v-if="form.qrCode"
                :src="form.qrCode"
                class="img" >
              <p
                v-else
                class="img-uploader-plus"><i class="icons el-icon-plus"/> 添加图片</p>
            </div>
            <p class="tip">建议尺寸为 160 x 160 像素</p>
          </el-form-item>
        </div>

        <div class="form-item">
          <el-form-item label="微信号">
            <el-input
              v-model="form.wechat"
              :style="{width:inputWidth }"
              maxlength="40"/>
          </el-form-item>

          <el-form-item
            label="QQ号"
            prop="qq">
            <el-input
              v-model="form.qq"
              :style="{width:inputWidth }"
              maxlength="15"/>
          </el-form-item>

          <el-form-item
            label="公司电话"
            prop="companyPhone">
            <el-input
              v-model="form.companyPhone"
              :style="{width:inputWidth }"
              maxlength="20"/>
          </el-form-item>

          <el-form-item label="客服服务时间">
            <div class="pb10">
              <el-select
                v-model="form.beginWeek"
                placeholder="请选择">
                <el-option
                  v-for="item in weekList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"/>
              </el-select>
              <span> 至 </span>
              <el-select
                v-model="form.endWeek"
                placeholder="请选择">
                <el-option
                  v-for="item in weekList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"/>
              </el-select>
            </div>
            <div>
              <el-time-select
                v-model="form.beginTime"
                :picker-options="{
                  start: '00:00',
                  step: '00:30',
                  end: '24:00'
                }"
                placeholder="起始时间"/>
              <span> 至 </span>
              <el-time-select
                v-model="form.endTime"
                :picker-options="{
                  start: '00:00',
                  step: '00:30',
                  end: '24:00',
                  minTime: form.startTime
                }"
                placeholder="结束时间"/>
            </div>
          </el-form-item>

          <el-form-item label="公司地址">
            <el-input
              v-model="form.companyAddress"
              :style="{width:inputWidth }"
              maxlength="60"/>
          </el-form-item>

          <el-form-item label="手机号码">
            <div style="overflow: auto;">
              <el-input
                v-model="form.mobile"
                :style="{width:inputWidth }"
                disabled/>
                <!--
              <router-link
                :to="{ path: 'setting/account', query: {tab:0} }"
                class="pr10">
                <el-button
                  class="ml10"
                  type="text"
                  size="small">去修改</el-button>
              </router-link>
-->
            </div>
            <div style="display: none">
              <p class="tip">该手机号仅用做商家接收短信通知使用，可设置是否展示在商城页面</p>
              <div>
                <el-radio
                  v-model="form.showMobile"
                  label="0">是</el-radio>
                <el-radio
                  v-model="form.showMobile"
                  label="1">否</el-radio>
              </div>
            </div>
          </el-form-item>

          <el-form-item label="退货地址">
            <div class="pb10">
              <el-cascader
                :options="regionList"
                v-model="regionValue"
                :disabled="regionList.length === 0"
                :style="{width:inputWidth }"
                :props="regionProps" />
            </div>
            <div>
              <el-input
                v-model="form.returnedAddress"
                :style="{width:inputWidth }"
                maxlength="60"
                placeholder="请输入详细地址：xx路xx号"/>
            </div>
          </el-form-item>

          <el-form-item label="收货人">
            <el-input
              v-model="form.consignee"
              :style="{width:inputWidth }"
              maxlength="10"/>
          </el-form-item>

          <el-form-item
            label="联系方式"
            prop="consigneePhone">
            <el-input
              v-model="form.consigneePhone"
              :style="{width:inputWidth }"
              maxlength="16"/>
          </el-form-item>

          <el-form-item
            label="默认门店">
            <select-store
              :is-open-default-value="true"
              :default-store-id="form.storeId"
              :default-company-id="form.companyId"
              class="mr10"
              labelwidth="60px"
              @change="changeSelectStore" />
          </el-form-item>
        </div>
      </div>

    </el-form>
    <div style="text-align: center"><el-button
      :loading="saveIng"
      type="primary"
      @click="onSubmit">&nbsp;&nbsp;保存&nbsp;&nbsp;</el-button></div>
    <material-selector
      :visible.sync="showMaterialSelector"
      :is-multi="false"
      @change="materialSelectorChanged" />
  </div>
</template>

<script>

import MaterialSelector from '@/components/MaterialSelector'
import * as ApiBrand from '@/api/brand'
import * as ApiRegion from '@/api/region'
import * as Validate from '@/utils/validate'
import SelectStore from '@/components/SelectStore'

export default {
  name: 'Brand',
  components: {
    MaterialSelector,
    SelectStore
  },
  data () {
    return {
      currentMaterialSelector: '',
      showMaterialSelector: false,
      inputWidth: '400px',
      form: {
        storeId: '',
        companyId: '',
        firstId: '',
        secondId: '',
        name: '',
        wechat: '',
        qq: '',
        mobile: '',
        showMobile: '0',
        companyPhone: '', // 公司电话
        beginWeek: '',
        endWeek: '',
        beginTime: '',
        endTime: '',
        companyAddress: '',
        returnedProvince: '', // 退货地址-省
        returnedCity: '', // 退货地址-市
        returnedArea: '',
        returnedAddress: '', // 退货详细地址
        consignee: '', // 收货人
        consigneePhone: '', // 收货人电话
        introduce: '', // 品牌介绍
        logoName: '',
        logoUrl: '',
        categoryValue: [],
        qrCode: ''
      },
      formRules: {
        name: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' }
        ],
        categoryValue: [
          { required: true, message: '请选择主营类目', trigger: 'change' }
        ],
        introduce: [
          { required: true, message: '请输入品牌介绍', trigger: 'blur' }
        ],
        logoUrl: [
          { required: true, message: '请添加品牌logo', trigger: 'change' }
        ],
        qq: [
          { validator: Validate.number, trigger: 'blur' }
        ],
        companyPhone: [
          { validator: Validate.numbergang, trigger: 'blur' }
        ],
        consigneePhone: [
          { validator: Validate.numbergang, trigger: 'blur' }
        ]
      },
      weekList: [
        { value: '1', label: '周一' },
        { value: '2', label: '周二' },
        { value: '3', label: '周三' },
        { value: '4', label: '周四' },
        { value: '5', label: '周五' },
        { value: '6', label: '周六' },
        { value: '7', label: '周日' }
      ],
      saveIng: false,

      categoryList: [],
      categoryProps: {
        value: 'id',
        label: 'name',
        children: 'categoryList'
      },
      regionValue: [],
      regionList: [],
      regionProps: {
        value: 'code',
        label: 'name',
        children: 'childRegion'
      }
    }
  },
  created () {
    ApiBrand.getDetail().then(({ data = {} }) => {
      data.beginWeek = String(data.beginWeek || 1)
      data.endWeek = String(data.endWeek || 7)
      data.showMobile = String(data.showMobile)
      this.form = Object.assign(this.form, data)
      this.form.categoryValue = []
      if (data.firstId) {
        this.form.categoryValue.push(data.firstId)
      }
      if (data.secondId) {
        this.form.categoryValue.push(data.secondId)
      }
      this.regionValue = [data.returnedProvince, data.returnedCity, data.returnedArea]

      this.getRegionList()
      this.getCategoryList()
    })
  },
  methods: {
    changeSelectStore (val) {
      this.form.companyId = val.companyId || ''
      this.form.storeId = val.storeId || ''
    },
    materialSelector (type) {
      this.currentMaterialSelector = type
      this.showMaterialSelector = true
    },
    getCategoryList () {
      ApiBrand.getCategoryList().then(({ data = [] }) => {
        this.categoryList = data
      })
    },
    getRegionList () {
      ApiRegion.getList2().then(({ data = [] }) => {
        this.regionList = data
      })
    },
    materialSelectorChanged (val) {
      const imgUrl = val[0] && val[0].imgUrl
      this.form[this.currentMaterialSelector] = imgUrl
      if (this.currentMaterialSelector === 'logoUrl') {
        this.$refs['logoUrlForm'].clearValidate()
      }
      this.currentMaterialSelector = ''
      this.showMaterialSelector = false
    },
    onSubmit () {
      this.$refs['form'].validate((valid) => {
        if (!valid) return
        this.saveIng = true
        this.form.firstId = this.form.categoryValue[0]
        this.form.secondId = this.form.categoryValue[1]

        this.form.returnedProvince = this.regionValue[0]
        this.form.returnedCity = this.regionValue[1]
        this.form.returnedArea = this.regionValue[2]
        ApiBrand.save({ ...this.form }).then(({ code, message }) => {
          this.saveIng = false
          this.$message({ type: 'success', message: message })
        }, () => {
          this.saveIng = false
        })
      })
    }
  }
}
</script>

<style lang="scss">
  .page-brand {
    min-width: 1050px;
    overflow-x: auto;
    .img-uploader {
      background: white;
      display: block;
      position: relative;
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      width: 160px;
      height: 160px;
      text-align: center;
      &:hover {
        border-color: #409EFF;
      }
      &-plus {
        width: 100%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 14px;
        color: #8c939d;
        .icons {
          font-size: 20px;
          vertical-align: -2px;
        }
      }
      &-tips {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 20px;
        color: $--color-text-placeholder;
      }
      &.uploaded {
        border: none;
      }
      .img {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
      }
    }
    p {
      font-size: 12px;
    }
    .tip {
      color: #888888;
      line-height: 25px;
    }
    .form-wrap {
      display: -webkit-box;
      margin-bottom: 20px;
      .form-item {
        -webkit-box-flex: 1;
        width: 1%;
        margin-right: 20px;
        background: white;
        padding: 20px 20px 0 0;
        border-radius: 8px;
        &:last-child {
          margin-right: 0;
        }
      }
    }
    .el-date-editor.el-input, .el-date-editor.el-input__inner, .el-select--medium {
      width: 190px;
    }
  }
</style>
