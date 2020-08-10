<template>
  <div class="page-brand-info">
    <el-form
      ref="form"
      :model="form"
      label-width="140px">
      <el-form-item label="公司名称">
        <el-input
          v-model="form.name"
          :style="{width:'100%' }"
          disabled />
      </el-form-item>

      <el-form-item label="营业执照注册号">
        <el-input
          v-model="form.licenseRegNo"
          :style="{width:'100%' }"
          disabled />
      </el-form-item>

      <el-form-item label="营业执照电子版">
        <div class="img-uploader"><img
          :src="form.licenseImage"
          class="img"
          @click="handlePreview(form.licenseImage)" ></div>
      </el-form-item>

      <el-form-item label="开户行帐号">
        <el-input
          v-model="form.bankAccount"
          disabled />
      </el-form-item>

      <el-form-item label="开户许可证电子版">
        <div class="img-uploader"><img
          :src="form.accountLicense"
          class="img"
          @click="handlePreview(form.accountLicense)" ></div>
      </el-form-item>

      <el-form-item label="法人姓名">
        <el-input
          v-model="form.legalPerson"
          disabled />
      </el-form-item>

      <el-form-item label="法人身份证号码">
        <el-input
          v-model="form.idcard"
          disabled />
      </el-form-item>

      <el-form-item label="手机号码">
        <el-input
          v-model="form.mobile"
          disabled />
      </el-form-item>

      <el-form-item label="身份证电子版">
        <div style="display: -webkit-box;">
          <div class="img-uploader mr10"><img
            :src="form.idcardFront"
            class="img"
            @click="handlePreview(form.idcardFront)" ></div>
          <div class="img-uploader"><img
            :src="form.idcardBack"
            class="img"
            @click="handlePreview(form.idcardBack)" ></div>
        </div>
      </el-form-item>

    </el-form>

    <el-dialog
      :visible.sync="previewVisible"
      :lock-scroll="false"
      width="auto"
      custom-class="sdfsdf"
      style="text-align: center;">
      <img
        :src="previewUrl"
        style="max-width: 1000px; height: auto; margin: 0 auto; display: block;" >
    </el-dialog>
  </div>
</template>

<script>
import * as ApiCompany from '@/api/company'
// import * as ApiBrand from '@/api/brand'

export default {
  name: 'Info',
  data () {
    return {
      previewVisible: false,
      previewUrl: '',
      form: {
        name: '', // 公司名称
        licenseRegNo: '', // 营业执照注册号
        licenseImage: '', // 营业执照图片
        bankAccount: '', // 开户行账号
        accountLicense: '', // 开户许可证图片
        legalPerson: '', // 法人姓名
        idcard: '', // 法人身份证号
        mobile: '', // 手机号
        idcardFront: '', // 身份证正面图片
        idcardBack: '' // 身份证背面图片
      }
    }
  },

  created () {
    ApiCompany.status().then(({ data: { info } }) => {
      if (info) this.form = { ...this.form, ...info }
    })
  },

  methods: {
    handlePreview (url) {
      this.previewVisible = true
      this.previewUrl = url
    }
  }
}
</script>

<style lang="scss">
  .page-brand-info {
    background: white;
    border-radius: 8px;
    padding: 30px 0 10px;
    padding-right: 100px;
    .sdfsdf {
      display: inline-block;
      padding: 0 10px;
    }
    .el-input {
      width: 260px;
    }
    .img-uploader {
      background: white;
      display: block;
      position: relative;
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      width: 120px;
      height: 120px;
      text-align: center;
      .img {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
      }
    }
  }
</style>
