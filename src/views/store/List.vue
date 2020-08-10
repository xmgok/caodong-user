<template>
  <div
    v-loading="loading"
    class="page-store-list">

    <div class="mb10 flex">
      <el-button
        type="primary"
        @click="() => addCompanyInfo()">添加分公司
      </el-button>
      <!--
      <router-link
        :to="{ name: 'AddStore' }"
        class="ml10">
        <el-button type="primary" >添加门店
        </el-button>
      </router-link>
-->
      <div class="export">
        <el-button
          type="primary"
          class="ml5"
          @click="download3">导出
        </el-button>
      </div>
    </div>

    <div class="tree-header">
      <div
        class="pl20 node-header">名称
      </div>
      <div
        style="width: 170px; text-align: center;">自提
      </div>
      <div
        class="tc"
        style="width: 120px;">操作
      </div>
    </div>

    <el-tree
      ref="categoryTree"
      :data="list"
      :expand-on-click-node="false"
      :props="{ children: 'list', label: 'name'}"
      :default-expand-all="false"
      node-key="id"
      class="filter-tree"
    >
      <div
        slot-scope="{ node, data }"
        class="custom-tree-node">
        <div
          class="node-header">
          <span>{{ node.label }}</span>
          <router-link
            v-if="node.level == 1 && data.type > 0"
            :to="{ name: 'AddStore', query: { parentId: data.id } }"
            class="ml50">
            <el-button
              type="primary"
              size="mini">添加门店
            </el-button>
          </router-link>
        </div>
        <div
          style="width: 170px; text-align: center;">
          <el-switch
            v-if="data.type < 1"
            v-model="data.takeStatus"
            @change="changeState(data)" />
        </div>
        <div
          style="width: 120px;"
          class="tr">
          <!--
          <el-button
            v-if="node.level == 1 && data.type > 0"
            type="text"
            size="mini"
            @click="() => addStore(data)">添加门店
          </el-button>
-->
          <!--
          <el-button
            type="text"
            size="mini"
            @click="() => editJurisdiction(data)">修改权限</el-button>
-->
          <el-popover
            v-if="data.type < 1"
            ref="popover"
            class="mr10"
            placement="right"
            title=""
            width="300"
            trigger="hover"
            @show="popoverShow(data)">

            <el-tabs v-model="data.tabName">
              <el-tab-pane
                label="门店二维码"
                name="one">
                <img
                  v-if="data.popoverIsShow&&data.tabName==='one'"
                  :src="getQrCode(data)"
                  class="qr-img"
                  alt="">
                <el-button
                  class="qr-download"
                  type="text"
                  size="small"
                  @click="download(data)">下载
                </el-button>
              </el-tab-pane>
              <el-tab-pane
                label="虚拟导购二维码"
                name="two">
                <img
                  v-if="data.popoverIsShow&&data.tabName==='two'"
                  :src="getQrCode2(data)"
                  class="qr-img"
                  alt="">
                <el-button
                  class="qr-download"
                  type="text"
                  size="small"
                  @click="download2(data)">下载
                </el-button>
              </el-tab-pane>
            </el-tabs>

            <el-button
              slot="reference"
              type="text"
              size="small">预览
            </el-button>
          </el-popover>
          <el-button
            type="text"
            size="mini"
            @click="() => editCompanyInfo(data)">修改信息
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="() => del(data.id)">删除
          </el-button>
        </div>
      </div>
    </el-tree>

    <el-dialog
      :visible.sync="dialogFormVisible"
      :title="`${form.id ? '编辑': '添加'}分公司`"
      width="400px"
      @close="cancel">
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="100px">
        <el-form-item
          prop="name"
          label="分公司名称">
          <el-input
            v-model.trim="form.name"
            maxlength="20" />
        </el-form-item>
        <el-form-item
          prop="storeCode"
          label="分公司编号">
          <el-input
            v-model.trim="form.storeCode"
            maxlength="20" />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="tc">
        <el-button @click="cancel">取 消</el-button>
        <el-button
          type="primary"
          @click="submit">保 存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as ApiStores from '@/api/stores'
import { getToken } from '@/utils/auth'
import axios from 'axios'
import { downloadImg } from '@/utils'

export default {
  name: 'StoreList',

  data () {
    return {
      loading: false,
      list: [],
      dialogFormVisible: false,
      form: {
        id: '',
        name: '',
        storeCode: '',
        type: 1,
        level: 1
      },
      rules: {
        name: [
          { required: true, message: '请输入分公司名称', trigger: 'blur' }
        ],
        storeCode: [
          { required: true, message: '请输入分公司编号', trigger: 'blur' }
        ]
      }
    }
  },

  created () {
    this.getList()
  },

  methods: {
    download3 () {
      ApiStores.storeExport({}, '门店导出')
    },
    popoverShow (data) {
      this.$set(data, 'popoverIsShow', true)
    },
    download ({ name, storeCode }) {
      axios({
        url: this.getQrCode({ storeCode }),
        responseType: 'arraybuffer'
      }).then((res) => {
        // console.log(Object.prototype.toString.call(res.data)) // [object ArrayBuffer]
        downloadImg(res.data, name + '二维码')
      })
    },
    getQrCode ({ storeCode }) {
      return `${window.VUE_APP_API_URL + window.VUE_APP_BASE_API}miniapp/qrcode?token=${getToken()}&width=750&scene=${encodeURIComponent(`storeCode=${storeCode}`)}`
    },
    download2 ({ name, storeCode }) {
      axios({
        url: this.getQrCode2({ storeCode }),
        responseType: 'arraybuffer'
      }).then((res) => {
        // console.log(Object.prototype.toString.call(res.data)) // [object ArrayBuffer]
        downloadImg(res.data, name + '二维码')
      })
    },
    getQrCode2 ({ storeCode }) {
      return `${window.VUE_APP_API_URL + window.VUE_APP_BASE_API}miniapp/qrcode?token=${getToken()}&page=pages-subpackages/seller/pages/seller-request/index&width=750&scene=${encodeURIComponent(`storeCode=${storeCode}`)}`
    },
    addStore (data) {
      this.$router.push({ name: 'AddStore', query: { parentId: data.id } })
    },
    takeStatus (data) {
      return data.map((item) => {
        item.takeStatus = Boolean(item.takeStatus)
        if (item.list) {
          this.takeStatus(item.list)
        }
        item.tabName = 'one'
        return item
      })
    },
    getList () {
      ApiStores.getList2().then((data) => {
        this.list = this.takeStatus(data || [])
      })
    },
    addCompanyInfo () {
      this.dialogFormVisible = true
    },
    editCompanyInfo (data) {
      if (data.type < 1) {
        this.$router.push({ name: 'AddStore', query: { id: data.id } })
        return
      }
      this.form = { ...data }
      this.dialogFormVisible = true
    },
    editJurisdiction () {
      this.$message({
        message: '此功能产品暂未完善',
        type: 'warning'
      })
    },
    submit () {
      this.$refs['form'].validate((valid) => {
        if (!valid) return
        console.log(this.form)
        ApiStores.storeAdd({
          id: this.form.id,
          name: this.form.name,
          storeCode: this.form.storeCode,
          type: this.form.type,
          level: this.form.level
        }).then(() => {
          this.getList()
          this.cancel()
        })
      })
    },
    cancel () {
      this.dialogFormVisible = false
      this.$refs['form'].resetFields()
      this.form = {
        id: '',
        name: '',
        storeCode: '',
        type: 1,
        level: 1
      }
    },
    del (id) {
      console.log(id)
      this.$confirm('确定删除吗?', '提示', { type: 'warning' }).then(() => {
        ApiStores.storeDelete({ id }).then(({ code, message = '' }) => {
          this.$message({ type: (code === 'SUCCESS' ? 'success' : 'error'), message: message })
          if (code === 'SUCCESS') {
            this.getList()
          }
        }).catch(() => {
        })
      }).catch(() => {
      })
    },
    changeState (data) {
      const { id, takeStatus } = data
      ApiStores.changeTakeStatus({ id, takeStatus: Number(takeStatus) }).then(() => {
        // this.getList()
      }).catch(v => {
        data.takeStatus = 0
      })
    }
  }
}
</script>

<style lang="scss">
  .page-store-list {
    .el-tree-node__content {
      height: 50px;
      cursor: default;
    }

    .el-tree > .el-tree-node > .el-tree-node__content {
      border-bottom: 1px solid $--table-border-color;
    }

    .uploader {
      width: 128px;
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;

      &:hover {
        border-color: #409eff;
      }

      &.uploaded {
        border: none;
      }

      .uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 128px;
        height: 128px;
        line-height: 128px;
        text-align: center;
      }

      .avatar {
        width: 128px;
        height: 128px;
        display: block;
      }
    }

    .upload-tips {
      font-size: 12px;
      color: $--color-text-placeholder;
    }
  }
</style>

<style lang="scss" scoped>
  .export {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .qr-img {
    width: 174px;
    height: 174px;
    margin: 0 auto;
    display: block;
  }

  .qr-download {
    margin: 10px auto 0;
    display: block;
  }

  .page-store-list {
    .tree-header {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: bold;
      color: $--table-header-color;
      background-color: $--table-header-background;
      line-height: 50px;
      font-size: 14px;
      padding-right: 8px;
    }

    .custom-tree-node {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      padding-right: 8px;
    }

    .node-header {
      flex: 1;
    }
  }
</style>
