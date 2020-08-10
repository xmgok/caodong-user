<template>

  <div class="page-enterprise">
    <div class="header-text">
      <img
        src="@/assets/images/logo2.jpg"
        alt="logo">
      <p>草动后台管理系统</p>
    </div>

    <div class="steps-wrap">
      <el-steps
        :active="activeStatus"
        finish-status="success"
        align-center>
        <el-step title="注册成功"/>
        <el-step title="完善企业信息"/>
        <el-step title="系统审核"/>
        <el-step title="开启体验"/>
      </el-steps>
    </div>

    <div class="form-wrap">
      <el-form
        v-if="status == 0"
        ref="form"
        :rules="formRules"
        :model="form"
        style="padding-right: 64px;"
        label-width="170px">
        <el-form-item
          label="公司名称"
          prop="name">
          <el-input
            v-model="form.name"
            :style="{width:'100%' }"
            placeholder="需与当地政府颁发的商业许可证或企业注册证上的名称一致，信息审核成功后，企业名称不可修改"/>
        </el-form-item>

        <el-form-item
          label="营业执照注册号"
          prop="licenseRegNo">
          <el-input
            v-model="form.licenseRegNo"
            :style="{width:'100%' }"
            placeholder="请输入15位营业执照注册号或18位统一社会信用代码"/>
        </el-form-item>

        <el-form-item
          ref="licenseImage"
          label="营业执照电子版"
          prop="licenseImage">

          <el-upload
            :accept="fileAccept"
            :show-file-list="false"
            :on-success="handleFileUploadSuccess.bind(null, 'licenseImage')"
            :before-upload="beforeFileUpload"
            :action="uploadUrl"
            :headers="{ token }"
            name="img">
            <div class="img-uploader">
              <img
                v-if="form.licenseImage"
                :src="form.licenseImage"
                class="img">
              <p
                v-else
                class="img-uploader-plus"><i class="icons el-icon-plus"/> 营业执照</p>
            </div>
          </el-upload>

        </el-form-item>

        <el-form-item
          label="开户行帐号"
          prop="bankAccount">
          <el-input
            v-model="form.bankAccount"
            placeholder="请输入开户行帐号"/>
        </el-form-item>

        <el-form-item
          ref="accountLicense"
          label="开户许可证电子版"
          prop="accountLicense">
          <el-upload
            :accept="fileAccept"
            :show-file-list="false"
            :on-success="handleFileUploadSuccess.bind(null, 'accountLicense')"
            :before-upload="beforeFileUpload"
            :action="uploadUrl"
            :headers="{ token }"
            name="img">
            <div class="img-uploader">
              <img
                v-if="form.accountLicense"
                :src="form.accountLicense"
                class="img">
              <p
                v-else
                class="img-uploader-plus"><i class="icons el-icon-plus"/> 开户许可证</p>
            </div>
          </el-upload>
        </el-form-item>

        <el-form-item
          label="法人姓名"
          prop="legalPerson">
          <el-input v-model="form.legalPerson"/>
        </el-form-item>

        <el-form-item
          label="法人身份证号码"
          prop="idcard">
          <el-input
            v-model="form.idcard"
            maxlength="18"
            placeholder="请输入法人的身份证号码"/>
        </el-form-item>

        <el-form-item
          label="手机号码"
          prop="mobile">
          <el-input
            v-model="form.mobile"
            maxlength="11"
            placeholder="请输入手机号码"/>
        </el-form-item>

        <el-form-item
          ref="idcardFront"
          label="身份证电子版"
          prop="idcardFront">
          <div style="display: -webkit-box;">
            <el-upload
              :accept="fileAccept"
              :show-file-list="false"
              :on-success="handleFileUploadSuccess.bind(null, 'idcardFront')"
              :before-upload="beforeFileUpload"
              :action="uploadUrl"
              :headers="{ token }"
              name="img">
              <div
                class="img-uploader mr20">
                <img
                  v-if="form.idcardFront"
                  :src="form.idcardFront"
                  class="img">
                <p
                  v-else
                  class="img-uploader-plus"><i class="icons el-icon-plus"/> 身份证正面</p>
              </div>
            </el-upload>
            <el-upload
              :accept="fileAccept"
              :show-file-list="false"
              :on-success="handleFileUploadSuccess.bind(null, 'idcardBack')"
              :before-upload="beforeFileUpload"
              :action="uploadUrl"
              :headers="{ token }"
              name="img">
              <div
                class="img-uploader">
                <img
                  v-if="form.idcardBack"
                  :src="form.idcardBack"
                  class="img">
                <p
                  v-else
                  class="img-uploader-plus"><i class="icons el-icon-plus"/> 身份证反面</p>
              </div>
            </el-upload>
          </div>
        </el-form-item>

        <div class="btn-wrap">
          <!--<el-button round>取消</el-button>-->
          <el-button
            round
            plain
            class="mr20"
            @click="logout">退出
          </el-button>
          <el-button
            :loading="submitting"
            type="primary"
            round
            @click="onSubmit">保存并继续
          </el-button>
        </div>
      </el-form>
      <div class="steps-content">
        <template v-if="status == 1">
          <p class="p1">企业信息提交成功，系统正在审核中</p>
          <p class="p2">为了更好地为您提供服务，系统会审核您提交的企业资料， <br>审核时间为3-5个工作日；审核结束后，您可在本页面查询审核结果。</p>
          <div class="btn-wrap">
            <el-button
              round
              plain
              @click="logout">退出
            </el-button>
          </div>
        </template>
        <template v-if="status == 2">
          <p class="p1">恭喜您，审核通过</p>
          <p class="p2">您所提交的企业信息和资料完整真实，已通过审核，<br>现在您可立即开启草动之旅。</p>
          <div class="btn-wrap">
            <el-button
              round
              plain
              class="mr20"
              @click="logout">退出
            </el-button>
            <el-button
              type="primary"
              round
              @click="auditStart">开启体验
            </el-button>
          </div>
        </template>
        <template v-if="status == 3">
          <p class="p1">非常抱歉，审核未通过</p>
          <p class="p2">您所提交的企业信息和资料因以下原因未通过审核，<br>建议您可提交真实完整的企业资料并重新申请。</p>
          <ul
            v-if="reason"
            class="li">
            <li
              v-for="(item, key) in reason"
              :key="key">· {{ item }}</li>
            <li v-if="reasonCountOdd"/>
            <li style="width:100%">. {{ remark }}</li>
          </ul>
          <div class="btn-wrap">
            <el-button
              round
              plain
              class="mr20"
              @click="logout">退出
            </el-button>
            <el-button
              type="primary"
              round
              @click="editInfo">编辑资料
            </el-button>
          </div>
        </template>
      </div>
    </div>

    <div class="copyright-text">
      <p>公司地址：上海市浦东新区浦东南路2240号808室<span class="pl30">TEL：021-88888888</span></p>
      <p>上海具志网络科技有限公司 @ zhimeiplus 2018-2021</p>
    </div>

  </div>
</template>

<script>
// import Cookies from 'js-cookie'
// import * as ApiCommon from '@/api/common'
// import * as ApiBrand from '@/api/brand'
import * as ApiCompany from '@/api/company'
// import { validateMobile, validateName, validateIdcard } from '@/utils/validate'
import { validateMobile } from '@/utils/validate'
import { getToken } from '@/utils/auth'

export default {
  name: 'Enterprise',
  data () {
    const checkMobile = (rule, value, callback) => {
      if (!validateMobile(value)) return callback(new Error('请输入有效的手机号码'))
      callback()
    }

    // const checkIdcard = (rule, value, callback) => {
    //   if (!validateIdcard(value)) return callback(new Error('法人身份证号码格式有误'))
    //   callback()
    // }

    // const checkName = (rule, value, callback) => {
    //   if (!validateName(value)) return callback(new Error('法人姓名格式有误'))
    //   callback()
    // }

    const validateIdcardFront = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请上传身份证正面电子版'))
      } else if (this.form.idcardBack === '') {
        callback(new Error('请上传身份证反面电子版'))
      } else {
        callback()
      }
    }

    return {
      status: 0, // -1可注册 0注册成功 1资料完善 2审核通过 3审核未通过 4开启草动
      submitting: false,
      token: getToken(),
      form: {
        // id: '',
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
      },
      formRules: {
        name: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
        licenseRegNo: [{ required: true, message: '请输入营业执照注册号', trigger: 'blur' }],
        licenseImage: [{ required: true, message: '请上传营业执照电子版', trigger: 'change' }],
        bankAccount: [{ required: true, message: '请输入开户行帐号', trigger: 'blur' }],
        accountLicense: [{ required: true, message: '请上传开户许可证电子版', trigger: 'change' }],
        // legalPerson: [{ required: true, validator: checkName, trigger: 'blur' }],
        legalPerson: [{ required: true, trigger: 'blur' }],
        // idcard: [{ required: true, validator: checkIdcard, trigger: 'blur' }],
        idcard: [{ required: true, trigger: 'blur' }],
        mobile: [{ required: true, validator: checkMobile, trigger: 'blur' }],
        idcardFront: [{ required: true, validator: validateIdcardFront, trigger: 'change' }]
      },
      uploadUrl: `${window.VUE_APP_API_URL}${window.VUE_APP_BASE_API}uploadimg`,
      fileAccept: 'image/jpeg,image/png,image/gif',
      maxSize: 10,
      reason: '',
      remark: ''
    }
  },

  computed: {
    activeStatus () {
      let status = Number(this.status) + 1
      if (this.status === 3) status = 2
      if (status > 3) status = 3
      return status
    },
    reasonCountOdd () {
      if (!this.reason) return false
      return Object.keys(this.reason).length % 2 === 1
    }
  },

  created () {
    this.getEnterpriseStatus()
  },

  methods: {
    logout () {
      this.$store.dispatch('FedLogOut')
    },
    handleFileUploadSuccess (formKey, { data }) {
      this.form[formKey] = data
      this.$refs[formKey === 'idcardBack' ? 'idcardFront' : formKey].clearValidate()
    },
    beforeFileUpload (file) {
      // 格式限制（因为传了accept参数，这里实际上会始终满足限制）
      let errMsg = ''
      const fileAccept = this.fileAccept.split(',')
      if (!~fileAccept.indexOf(file.type)) {
        errMsg = `上传文件必须是 ${fileAccept.map(i => i.split('/')[1]).join('/')} 格式!`
        this.$message.error(errMsg)
        return false
      }

      // 大小限制
      const isLtLimitSize = file.size / 1024 / 1024 < this.maxSize
      errMsg = `上传文件大小不能超过 ${this.maxSize}MB!`
      if (!isLtLimitSize) {
        this.$message.error(errMsg)
        return false
      }
    },
    getEnterpriseStatus () {
      ApiCompany.status().then(({ data: { status, reason, info, remark } }) => {
        this.status = status
        // hack
        if (status === 4) location.href = location.origin

        this.reason = reason
        this.remark = remark
        if (info) this.form = { ...this.form, ...info }
      })
    },
    onSubmit () {
      this.$refs['form'].validate((valid) => {
        if (!valid) return
        this.submitting = true
        ApiCompany.save(this.form).then(({ message }) => {
          this.$message({ type: 'success', message: message })
          this.status = 1
        }).finally(() => (this.submitting = false))
      })
    },
    editInfo () {
      this.status = 0
      ApiCompany.editInfo().then(() => this.getEnterpriseStatus())
    },
    auditStart () {
      ApiCompany.auditStart().then(() => this.$router.push('/'))
    }
  }
}
</script>

<style lang="scss">
  .page-enterprise {
    .el-step__title {
      font-weight: bold;
    }
    .header-text {
      font-size: 26px;
      font-weight: bold;
      line-height: 37px;
      padding: 33px 0;
      display: -webkit-box;
      -webkit-box-pack: center;
      img {
        margin-right: 12px;
        display: block;
        width: 32px;
        height: 40px;
      }
    }
    .copyright-text {
      padding: 32px 0;
      text-align: center;
      line-height: 30px;
      color: #909399;
      font-size: 14px;
    }
    .steps-wrap {
      margin: 0 auto;
      padding: 40px 0;
      width: 1000px;
    }
    .form-wrap {
      /*padding: 32px 66px 32px 0;*/
      padding: 32px 0 32px 0;
      box-sizing: border-box;
      margin: 0 auto 40px;
      width: 870px;
      box-shadow: 0 6px 24px 0 rgba(144, 147, 153, 0.2);
      border-radius: 8px;
      .btn-wrap {
        padding-top: 20px;
        text-align: center;
        button {
          width: 120px;
        }
      }
      .el-input {
        width: 260px;
      }
    }

    .steps-content {
      text-align: center;
      .p1 {
        padding-top: 80px !important;
        font-size: 32px;
        font-weight: bold;
      }
      .p2 {
        padding: 40px 0 64px !important;
        font-size: 18px;
        line-height: 26px;
        color: #303133;
      }
      ul {
        width: 642px;
        background: #F4F7FD;
        border-radius: 8px;
        line-height: 32px;
        padding: 16px 0;
        color: #909399;
        font-size: 16px;
        list-style-type: disc;
        margin: 0 auto 40px;
        li {
          width: 50%;
          display: inline-block;
          text-align: left;
          padding-left: 30px;
          padding-right: 30px;
          box-sizing: border-box;
          vertical-align: top;
        }
      }
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
        color: #D8D8D8;
        .icons {
          font-size: 20px;
          display: block;
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

    .el-step__title.is-finish {
      color: #303133 !important;
    }
    .el-step__title.is-process {
      color: $--color-primary;
    }
    .el-step__head.is-process {
      color: $--color-primary;
      border-color: $--color-primary;
    }
    .is-finish .el-step__line {
      background: $--color-primary;
    }
    .el-step__title.is-success {
      color: $--color-primary;
    }
    .el-step__head.is-success {
      color: $--color-primary;
      border-color: $--color-primary;
      .el-step__line {
        background: $--color-primary;
      }
      .is-text {
        color: white;
        background-color: $--color-primary;
        box-shadow: 0px 2px 4px 0px rgba(88, 137, 255, 0.3);
      }
    }
  }
</style>
