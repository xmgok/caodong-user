<template>
  <div class="miniapp-list">
    <div class="title1">小程序绑定</div>
    <el-card
      class="discription"
      shadow="none">
      <div>将小程序授权给草动，系统会自动帮你生成店铺小程序，并提交到微信，你不需要做复杂的操作，即可获得专属的草动小程序</div>
      <div class="tips">
        <div>注：</div>
        <div>
          <div>1. 你的小程序的主体必须是【企业】，并开通了微信支付，才具备绑定权限</div>
          <div>2. 请正确资料的填写，填写错误将授权失败</div>
          <div>3. 若代码审核失败，请根据公众平台的返回的失败原因，修改后点击 “再次获取”。（服务类目推荐商家自营）</div>
        </div>
      </div>
    </el-card>
    <div class="title1">小程序发布</div>

    <el-table
      :data="tableData"
      class="mt20">
      <el-table-column
        prop="appName"
        align="center"
        label="绑定项目"/>
      <el-table-column
        prop="version"
        align="center"
        label="版本号"/>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="versionDesc"
        align="center"
        label="版本简介"/>
      <el-table-column
        prop="updateTime"
        align="center"
        label="更新时间"/>
      <el-table-column
        align="center"
        width="200"
        label="小程序账号">
        <template slot-scope="scope">
          {{ scope.row.authAppId?scope.row.authAppId:'未绑定' }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        width="100"
        prop="_authStatus"
        label="授权状态"/>
      <el-table-column
        align="center"
        width="130"
        prop="_codeStatus"
        label="代码上传状态"/>
      <el-table-column
        prop="label"
        align="center"
        label="服务类目" />
      <el-table-column
        label="操作"
        fixed="right"
        align="center"
        width="120">
        <template slot-scope="scope">
          <router-link
            v-if="scope.row.appType!=2"
            :to="{
              name:'MiniAppUpload',
              query: { id: scope.row.id }
          }" >
            <el-button
              type="text"
              size="small"
            >设置</el-button>
          </router-link>
          <el-button
            class="ml5"
            type="text"
            size="small"
            @click="authority(scope.row.id, scope.row.authAppId, scope.row.appType)"
          >授权</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--授权弹框-->
    <el-dialog
      :visible.sync="showAuthor"
      title="授权提示"
      width="400px">
      <div class="tc pt20 pb20">请在新窗口中完成扫码授权绑定操作</div>
      <div class="tc pt50">
        <el-button
          type="primary"
          size="small"
          @click="authored">已成功授权</el-button>
        <el-button
          type="primary"
          size="small"><a
            :href="authUrl"
            target="_blank">授权失败，请重试</a></el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as ApiMinapp2 from '@/api/minapp2'

export default {
  name: 'MiniAppList',
  data () {
    return {
      tableData: [],
      showAuthor: false,
      authUrl: ''
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    getList () {
      const authStatusArr = ['未授权', '已授权', '已解除授权']
      const codeStatusArr = ['', '审核提交失败', '审核提交成功', '审核失败', '已发布']
      ApiMinapp2.getList().then(({ data }) => {
        data.forEach((item) => {
          item['_codeStatus'] = codeStatusArr[item.codeStatus]
          item['_authStatus'] = authStatusArr[item.authStatus]
        })
        this.tableData = data || []
      })
    },
    authority (id, authAppId, appType) {
      if (!authAppId && +appType !== 2) {
        this.$message({ type: 'warning', message: '小程序尚未设置，请先完成小程序设置再进行授权。' })
        return
      }
      // type1草动商城 type2五五拓客。
      ApiMinapp2.getPreauth({ id, type: 1 }).then(({ data = '' }) => {
        this.authUrl = data
        window.open(data)
        this.showAuthor = true
      }, () => {})
    },
    authored () {
      this.showAuthor = false
      this.getList()
    }
  }
}
</script>

<style lang="scss">

  .miniapp-list {
    .title1 {
      font-size: 14px;
    }
    .discription {
      line-height: 2;
      margin: 20px 0;
      .tips {
        display: flex;
        color: gray;
      }
    }
  }

</style>
