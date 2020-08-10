<template>
  <el-form
    ref="form"
    :model="form"
    :rules="rules"
    class="form page-article-detail"
    label-width="100px">
    <el-card>
      <div slot="header">基础信息</div>
      <el-form-item
        prop="title"
        label="文章标题"
        class="w500">
        <el-input
          :disabled="see"
          v-model="form.title"
          :maxlength="30">
          <template slot="append">{{ form.title.length }}/30</template>
        </el-input>
      </el-form-item>
      <div class="flex flex-align-c">
        <el-form-item
          prop="linkUrl"
          label="文章抓取"
          class="w500">
          <el-input
            :disabled="see"
            v-model="form.linkUrl">
            <span
              slot="append"
              class="getArticle"
              @click="getArticle">{{ isGetting?'抓取中...':'抓取' }}</span>
          </el-input>
        </el-form-item>
        <div
          class="ui-color3 ml10"
          style="margin-bottom: 22px;">只允许输入微信公众号文章链接
        </div>
      </div>
      <el-form-item
        prop="content"
        label="文章内容"
        class="w1000">
        <div class="content" />
      </el-form-item>
      <el-form-item
        prop="shareDesc"
        label="分享描述"
        class="w500">
        <el-input
          :disabled="see"
          v-model="form.shareDesc"
          :rows="3"
          maxlength="80"
          type="textarea" />
        <div>{{ form.shareDesc.length }}/80</div>
      </el-form-item>
      <el-form-item
        prop="shareImg"
        label="分享配图"
        class="w500">
        <div class="goods">
          <el-input
            v-show="false"
            v-model="form.shareImg" />
          <img
            v-if="form.shareImg"
            :src="form.shareImg"
            alt=""
            class="goods-img"
            @click="showImg">
          <div
            v-if="!form.shareImg"
            class="el-upload el-upload--picture-card"
            @click="showImg">
            <i class="el-icon-plus" />
          </div>
        </div>
        <p class="ui-color3">建议尺寸为 750 x 750 像素</p>
      </el-form-item>
      <el-form-item
        prop="storeList"
        label="适用门店">
        <template v-if="storeListLength>0">已选{{ storeListLength }}家门店</template>

        <!--已选门店可查看，所以不允许被禁用-->
        <el-button
          type="text"
          size="mini"
          @click="isShowStore=true">
          {{ storeListLength>0?'修改':'添加' }}门店
        </el-button>
      </el-form-item>
    </el-card>

    <div class="ui-edit-btn-wrapper">
      <el-button
        v-if="see"
        type="primary"
        @click="$router.go(-1)">确定
      </el-button>
      <template v-else>
        <el-button
          @click="$router.go(-1)">取消
        </el-button>
        <el-button
          :loading="submitting"
          type="primary"
          @click="submit">保存
        </el-button>
      </template>
    </div>
    <!--门店选择，多选-->
    <select-store-tree
      :is-disabled-all="see"
      :visible.sync="isShowStore"
      :default-value="form.storeList"
      @confirm="confirmCheckedStore"
    />
    <!--图片库-->
    <material-selector
      :is-multi="false"
      :visible.sync="showMaterialSelector"
      @change="(val) => detailMaterialSelectorChanged(val)" />
    <!--图片库-->
    <material-selector
      :is-multi="true"
      :visible.sync="showMaterialSelector2"
      @change="(val) => detailMaterialSelectorChanged2(val)" />
    <!--视频-->
    <material-selector
      :is-multi="true"
      :visible.sync="showMaterialSelector3"
      type="video"
      @change="(val) => detailMaterialSelectorChanged3(val)" />
  </el-form>
</template>

<script>
// import * as Validate from '@/utils/validate'
// import ApiProduct from '@/api/product'
import * as ApiArticle from '@/api/article'
import GoodsSelector from '@/components/GoodsSelector'
import SelectStoreTree from '@/components/SelectStoreTree'
import MaterialSelector from '@/components/MaterialSelector'
import axios from 'axios'

require('@/utils/wangEditor/wangEditor.js')

export default {
  name: 'Detail',
  components: {
    MaterialSelector,
    SelectStoreTree,
    GoodsSelector
  },
  data () {
    return {
      isGetting: false,
      form: {
        title: '',
        linkUrl: '',
        content: '',
        shareImg: '',
        shareDesc: '',
        storeList: []
      },
      rules: {
        title: [{ required: true, message: '本项必填' }],
        content: [{ required: true, message: '本项必填' }],
        shareImg: [{ required: true, message: '本项必填' }],
        shareDesc: [{ required: true, message: '本项必填' }],
        storeList: [{ required: true, message: '本项必填' }]
      },
      see: false,
      isShowStore: false,
      showGoodsSelector: false,
      showMaterialSelector: false,
      showMaterialSelector2: false,
      showMaterialSelector3: false,
      submitting: false,
      specificationList: []
    }
  },
  computed: {
    storeListLength () {
      return this.form.storeList.filter(v => v.type === 0).length
    }
  },
  created () {
    const id = this.$route.query.id || ''
    this.see = Boolean(this.$route.query.see) || false
    this.form.id = id
    id && this.getInfo()
  },
  mounted () {
    this.wangEditorInit()
  },
  methods: {
    wangEditorInit () { // 初始化富文本编辑器
      this.$wangEditor = new window.WangEditor('.content')
      this.$wangEditor.customConfig.zIndex = 1000
      this.$wangEditor.customConfig.onClickImage = () => { // 自定义图片点击功能，务必放到create方法之前。
        this.showImg2()
      }
      this.$wangEditor.customConfig.onClickVideo = () => { // 自定义视频点击功能，务必放到create方法之前。
        this.showImg3()
      }
      this.$wangEditor.create()
      // 设置内容
      this.$wangEditor.txt.html(this.form.content)
      // 禁用编辑功能
      if (this.see) {
        this.$wangEditor.$textElem.attr('contenteditable', false)
      }
    },
    getArticle () {
      if (this.see) {
        return
      }
      if (!this.form.linkUrl) {
        this.$message({ type: 'error', message: '请输入抓取链接' })
        return
      }
      if (!this.isGetting) {
        this.isGetting = true
      }
      ApiArticle.reptile({
        articleUrl: this.form.linkUrl
      }).then(res => {
        const data = res.data
        this.form.title = data.title
        this.form.content = data.content
        this.form.shareDesc = data.title
        this.form.shareImg = data.shareImg
        // 设置内容
        this.$wangEditor.txt.html(this.form.content)
        this.isGetting = false
      }).catch(() => {
        this.isGetting = false
      })
    },
    showImg () {
      this.showMaterialSelector = true
    },
    showImg2 () {
      this.showMaterialSelector2 = true
    },
    showImg3 () {
      this.showMaterialSelector3 = true
    },
    // 商品详情图片选择
    detailMaterialSelectorChanged (val) {
      this.form.shareImg = val[0].imgUrl
      this.showMaterialSelector = false
    },
    // 商品详情图片选择
    detailMaterialSelectorChanged2 (val) {
      this.form.shareImg = val[0].imgUrl
      this.showMaterialSelector2 = false
      val.forEach(v => {
        this.$wangEditor.uploadImg.insertLinkImg(v.imgUrl)
      })
    },
    // 商品详情图片选择
    detailMaterialSelectorChanged3 (val) {
      this.form.shareImg = val[0].imgUrl
      this.showMaterialSelector3 = false
      val.forEach(v => {
        this.$wangEditor.cmd.do('insertHTML', `<video style="max-width: 100%;" controls src="${v.imgUrl}"></video><p><br></p>`) // <p><br></p>让光标移动到下一行
      })
    },
    confirmCheckedStore (data) {
      this.form.storeList = data
      // this.$refs['form'].clearValidate()
      this.$refs['form'].validateField(['storeList'])
    },
    getInfo () {
      ApiArticle.info({ articleId: this.form.id }).then(res => {
        this.form = res.data
        axios({
          url: this.form.content
        }).then(res => {
          // 设置内容
          this.$wangEditor.txt.html(res.data.content)
        })
      })
    },
    submit () {
      // 获取内容
      this.form.content = this.$wangEditor.txt.html()
      this.$refs['form'].validate((valid) => {
        if (!valid) return
        this.submitting = true
        ApiArticle[this.form.id ? 'update' : 'save'](this.form).then(({ code, message }) => {
          this.$message({ type: (code === 'SUCCESS' ? 'success' : 'error'), message: message })
          if (code === 'SUCCESS') {
            this.$router.go(-1)
          }
          this.submitting = false
        }, () => {
          this.submitting = false
        })
      })
    }
  }
}
</script>
<style lang="scss">
  .page-article-detail {
    .content {
      width: 769px;
    }

    .w-e-text {
      padding: 0;
    }

    .w-e-text-container {
      height: 800px !important;
    }
  }
</style>
<style scoped lang="scss">
  .getArticle {
    width: 70px;
    height: 34px;
    text-align: center;
    line-height: 34px;
    display: block;
    margin: 0 -20px 0 -20px;
  }

  .step {
    display: flex;
    justify-content: space-between;
  }

  .goods {
    display: flex;

    .goods-img {
      width: 148px;
      height: 148px;
    }

    .goods-label {
      font-weight: bold;
    }

    .goods-content {
      margin-left: 10px;
      font-size: 14px;
    }

    .goods-content-name {
      display: flex;
      margin-bottom: 10px;
    }

    .goods-content-spec {
      display: flex;
      flex-wrap: wrap;
    }

    .goods-content-spec-item {
      margin-right: 10px;
      margin-bottom: 10px;
      padding: 4px 10px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 5px;
    }
  }
</style>
