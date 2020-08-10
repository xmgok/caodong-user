<template>
  <div class="page-wx-pay">
    <el-card shadow="none">
      <el-form
        ref="uploadData"
        :rules="uploadDataRules"
        :model="uploadData"
        label-width="200px">
        <!--
        <el-form-item label="支付接口平台：">
          <div class="text2">{{ uploadData.author_platform }}</div>
        </el-form-item>
        <el-form-item label="支付授权目录：">
          <div class="text2">{{ uploadData.author_direct }}</div>
          <div class="text1">请将上面的URL复制并粘贴到您的 微信公众平台 → 微信支付 → 开发配置 → 支付授权目录</div>
        </el-form-item>
        <el-form-item label="授权回调域名：">
          <div class="text2">{{ uploadData.author_domain }}</div>
          <div class="text1">请将上面的URL复制并粘贴到您的 微信公众平台 → 开发者中心 → 接口权限表 → 网页服务 → 网页授权获取用户基本信息 → 修改</div>
        </el-form-item>
        <el-form-item label="API密钥：">
          <el-input v-model="uploadData.api_secret"/>
          <div class="text1">请到 微信支付商户平台 → 账户设置 → API安全 → API密钥 中设置密钥，并将密钥复粘贴过来</div>
        </el-form-item>
-->
        <el-form-item
          label="微信支付商户号："
          prop="mchId">
          <el-input v-model="uploadData.mchId"/>
        </el-form-item>
        <el-form-item
          label="微信支付商户秘钥："
          prop="mchKey">
          <el-input v-model="uploadData.mchKey"/>
        </el-form-item>
        <!--
        <el-form-item label="APP ID（小程序ID）：">
          <el-input v-model="uploadData.app_id"/>
        </el-form-item>
        <el-form-item label="App Secret（小程序密钥）：">
          <el-input v-model="uploadData.app_secret"/>
        </el-form-item>
        -->
        <!--
        <el-form-item label="文件名：">
          <el-input v-model="uploadData.file_name"/>
          <div class="text1">请到 微信公众平台 → 公众号设置 → 功能设置 → 网页授权域名 中复制文件名。</div>
        </el-form-item>
        <el-form-item label="文件内容：">
          <el-input v-model="uploadData.file_content"/>
          <div class="text1">请到 微信公众平台 → 公众号设置 → 功能设置 → 网页授权域名 中下载相应文件。（类似MP_verify_yohIYFNBLSh7c2lh.txt）</div>
        </el-form-item>
-->
        <el-form-item label="支付证书：">
          <div
            v-if="uploadData.certName"
            class="ui-color3 f12">您的证书已上传，如需更改，可在下方重新上传</div>
          <div class="ui-color3 f12">文件：{{ uploadData.certName }}</div>
          <el-upload
            :before-upload="beforeCertUpload"
            accept=".p12"
            action="https://jsonplaceholder.typicode.com/posts/">
            <el-button
              size="small"
              type="primary">{{ uploadData.certName ? '重新上传' : '点击上传' }}</el-button>
          </el-upload>
          <div class="ui-color3 f12">请到 微信支付平台 → 账号中心 → API中心 → API证书 ，下载证书至本地，解压后将文件 “apiclient_cert.p12” 上传至对应栏位
            <el-button
              type="text"
              size="small"
              @click="showCertDialog = true"
            >找不到 点我</el-button>
          </div>
        </el-form-item>

      </el-form>
    </el-card>

    <div class="ui-edit-btn-wrapper">
      <el-button
        @click="$router.go(-1)">取消</el-button>
      <el-button
        type="primary"
        @click="save">保存
      </el-button>
    </div>

    <el-dialog
      :visible.sync="showCertDialog"
      title="下载证书"
      width="900px"
    >
      <img
        class="cert-img"
        src="@/assets/images/cert.jpg" >
    </el-dialog>
  </div>
</template>

<script>
import * as ApiWxpay from '@/api/wxpay'

export default {
  name: 'WxPay',
  data () {
    return {
      uploadData: {
        // app_id: '2323rr33',
        // app_secret: '2323rr33',
        mchId: '',
        mchKey: '',
        file: '',
        certName: ''
      },
      uploadDataRules: {
        mchId: [
          { required: true, message: '请输入微信支付商户号', trigger: 'blur' }
        ],
        mchKey: [
          { required: true, message: '请输入微信支付商户秘钥', trigger: 'blur' }
        ]
      },
      showCertDialog: false
    }
  },
  computed: {

  },
  mounted () {
    ApiWxpay.getDetail().then(({ data = {} }) => {
      this.uploadData.mchId = data.mchId || ''
      this.uploadData.mchKey = data.mchKey || ''
      this.uploadData.certName = data.certName || ''
    }, () => {})
  },
  methods: {
    save () {
      this.$refs['uploadData'].validate((valid) => {
        if (!valid) return
        let formData = new window.FormData()
        Object.keys(this.uploadData).forEach((item) => {
          if (this.uploadData[item]) {
            formData.append(item, this.uploadData[item])
          }
        })
        ApiWxpay.save(formData).then(({ message }) => {
          this.$message({ type: 'success', message: message })
        }, () => {})
      })
    },
    beforeCertUpload (file) {
      if (file.name !== 'apiclient_cert.p12') {
        this.$message({
          message: '请上传正确的文件',
          type: 'error'
        })
      } else {
        this.uploadData.file = file
        this.uploadData.certName = file.name || ''
      }
      return false
    }
  }
}
</script>

<style lang="scss">
  .page-wx-pay {
    .el-input {width: 400px}
    .el-upload {
      vertical-align: middle;
    }
    .el-upload-list {
      display: inline-block;
      vertical-align: middle;
      padding-left: 10px;
    }
    .cert-img {
      width: 100%;
    }
  }

</style>
