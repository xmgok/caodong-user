<!--门店导入-->
<template>
  <div class="goods-import">
    <el-card shadow="never">
      <div slot="header">
        <span class="title">快速导入</span>

        <a
          :href="`${ siteUrl }/file/store_template.xlsx`"
          download="门店导入模板.xlsx">
          <el-button
            type="primary"
            size="mini"
            class="fr">信息模板下载</el-button>
        </a>
      </div>

      <div class="upload-wrap">
        <h3 class="mb10 title">请选择门店信息模板：</h3>
        <el-upload
          ref="upload"
          :on-success="handleSuccess"
          :on-change="fileChange"
          :limit="1"
          :file-list="fileList"
          :headers="{ token }"
          :auto-upload="false"
          :action="`${ postUrl }${ baseUrl }/store/import_store`"
          name="excelFile"
          class="dib mr15"
          multiple>
          <el-button
            v-if="!fileList.length"
            slot="trigger"
            size="small"
            type="primary">上传
          </el-button>
          <el-button
            style="margin-left: 10px;"
            size="small"
            type="success"
            @click="submitUpload">导入</el-button>
        </el-upload>
      </div>

      <div class="upload-explain">
        <label>批量导入说明：</label>
        <ul class="explain-list">
          <li>①下载批量导入模板，并根据模板填写门店信息，需使用xlsx文件上传；</li>
          <li>②填写好需要导入的门店信息，上传文件，并导入；</li>
          <li>③单次上传xlsx最大条目（行数）为1500，超出请按文件分批上传；</li>
          <li>④友情提醒，上传后系统将检查批量门店是否有效，需根据提示进行修改并重新上传xlsx文件</li>
        </ul>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'StoreImport',

  data () {
    return {
      fileList: [],
      fileName: '',
      postUrl: window.VUE_APP_API_URL,
      baseUrl: window.VUE_APP_BASE_API,
      siteUrl: location.origin
    }
  },

  computed: {
    ...mapGetters(['token'])
  },

  methods: {
    fileChange ({ name }) {
      this.fileName = name
    },
    submitUpload () {
      this.$confirm(`是否确定导入文件“${this.fileName}”中的门店数据？`, '提示')
        .then(() => this.$refs.upload.submit()).catch(() => {})
    },
    handleSuccess ({ status, message }, file, fileList) {
      this.$message[status === 200 ? 'success' : 'error'](message)
      setTimeout(() => {
        this.fileList = []
      }, 2000)
    }
  }
}
</script>

<style lang="scss" scoped>
  .goods-import {
    .title {
      font-weight: bold;
      font-size: 14px;
    }
    /deep/ .el-card__header {
      padding: 8px 20px;
      line-height: 28px;
    }
  }

  .upload-wrap {
    width: 500px;
  }

  .upload-explain {
    display: flex;
    margin-top: 40px;
    font-size: 14px;
    ul li {
      margin-bottom: 10px;
    }
  }
</style>
