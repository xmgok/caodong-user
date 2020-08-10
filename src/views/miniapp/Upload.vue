<template>
  <div class="miniapp-upload">
    <el-card
      shadow="none">
      <el-form
        ref="uploadData"
        :rules="rules"
        :model="uploadData"
        label-width="200px">
        <el-form-item
          label="APP ID（小程序ID）："
          prop="authAppId">
          <el-input
            v-if="uploadData.authStatus === 1"
            v-model="uploadData.authAppId"
            disabled />
          <el-input
            v-else
            v-model="uploadData.authAppId" />
        </el-form-item>
        <el-form-item
          label="App Secret（小程序密钥）："
          prop="authAppSecret">
          <el-input v-model="uploadData.authAppSecret"/>
        </el-form-item>
        <!--<el-form-item label="商户号：">
          <el-input v-model="uploadData.merchant_id"/>
        </el-form-item>
        <el-form-item label="商户密钥：">
          <el-input v-model="uploadData.merchant_secret"/>
        </el-form-item>-->
        <el-form-item
          label="小程序标题："
          prop="title">
          <el-input v-model="uploadData.title"/>
        </el-form-item>
        <el-form-item
          label="行业标签："
          prop="label">
          <el-input v-model="uploadData.label"/>
          <div class="text1">最多10个，用空格隔开</div>
        </el-form-item>
        <!--
        <el-form-item label="支付证书：">
          <div
            v-if="has_cert==1"
            class="text1">您的证书已上传，如需更改，可在下方重新上传</div>
          <div class="cert-line">
            <div class="text1">文件：apiclient_cert.pem 和 apiclient_key.pem</div>
            <el-upload
              :limit="2"
              :before-upload="beforeCertUpload"
              :on-exceed="uploadCertExceed"
              accept=".pem"
              multiple
              action="https://jsonplaceholder.typicode.com/posts/">
              <el-button
                size="small"
                type="primary">点击上传</el-button>
            </el-upload>
          </div>
          <div class="text1">请到 微信支付平台 → 账号中心 → API中心 → API证书 ，下载证书至本地，解压后将文件 “apiclient_cert.pem” 与文件 “apiclient_key.pem” 上传至对应栏位
            <el-button
              type="text"
              size="small"
              @click="showCertDialog = true"
            >找不到 点我</el-button>
          </div>
        </el-form-item>
        -->
      </el-form>
    </el-card>
    <div class="footer">
      <router-link to="/miniapp/list">
        <el-button>返回</el-button>
      </router-link>
      <el-button
        :loading="saveIng"
        type="primary"
        class="ml20"
        @click="save" >保存</el-button>
    </div>
    <!--
    <el-dialog
      :visible.sync="showCertDialog"
      title="下载证书"
      width="900px"
    >
      <img
        class="cert-img"
        src="@/assets/images/cert.png" >
    </el-dialog>
    -->
  </div>
</template>

<script>
import * as ApiMinapp2 from '@/api/minapp2'

export default {
  name: 'MiniAppUpload',
  data () {
    return {
      uploadData: {
        id: '',
        authAppId: '',
        authAppSecret: '',
        title: '',
        label: ''
      },
      rules: {
        authAppId: [ { required: true, message: '请输入APP ID', trigger: 'blur' } ],
        authAppSecret: [ { required: true, message: '请输入App Secret', trigger: 'blur' } ],
        title: [ { required: true, message: '请输入小程序标题', trigger: 'blur' } ],
        label: [ { required: true, message: '请输入行业标签', trigger: 'blur' } ]
      },
      saveIng: false
    }
  },
  computed: {

  },
  mounted () {
    const id = this.$route.query.id || ''
    if (!id) {
      this.$router.push('/miniapp/list')
      return
    }
    ApiMinapp2.getInfo({ id }).then(({ data = {} }) => {
      this.uploadData = Object.assign({}, data)
    })
  },
  methods: {
    save () {
      this.$refs['uploadData'].validate((valid) => {
        if (!valid) return
        this.saveIng = true
        ApiMinapp2.save(this.uploadData).then(({ code, message }) => {
          this.saveIng = false
          this.$message({ type: 'success', message: message })
          this.$router.push('/miniapp/list')
        }, () => {
          this.saveIng = false
        })
      })
    }
  }
}
</script>

<style lang="scss">
  .miniapp-upload {
    .el-input {width: 400px}
    .el-upload {
      vertical-align: middle;
    }
    .el-upload-list {
      display: inline-block;
      vertical-align: middle;
      padding-left: 10px;
    }
    .title1 {
      font-size: 14px;
    }
    .text1 {
      font-size: 12px;
      color: grey;
    }
    .footer {
      display: flex;
      margin-top: 20px;
      justify-content: center;
    }
    .cert-img {
      width: 100%;
    }
    .cert-line {
      align-items: center;
    }
  }

</style>
