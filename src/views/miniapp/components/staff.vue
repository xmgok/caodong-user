<template>
  <el-row
    :gutter="20"
    class="miniapp-template-container">
    <el-col
      :span="6"
      class="left-container">
      <h3 class="title mb10">模板样式预览</h3>
      <div class="phone-box"/>
    </el-col>

    <el-col
      :span="18"
      class="right-container">
      <h3 class="title mb10">组件样式</h3>

      <div class="content">
        <!--顶部轮播-->
        <div class="item-content">
          <div class="header"><h4 class="sub-title">店长推荐</h4><p class="ui-color3 pl10">（为导购推荐分享种草的返佣商品，首页展示且仅能展示6个）</p></div>
          <div class="content-body">
            <div class="img-list">
              <div class="img-item">
                <el-card
                  :body-style="{ padding: '0px' }"
                  shadow="hover"
                  class="img-content">
                  <div @click="openMaterialSelector('sellWellImg')">
                    <div
                      v-if="imgData.sellWellImg.imgUrl"
                      :style="`background-image:url(${ imgData.sellWellImg.imgUrl })`"
                      class="img-uploader uploaded"><img
                        :src="imgData.sellWellImg.imgUrl"
                        class="img" >
                    </div>
                    <div
                      v-else
                      class="img-uploader">
                      <p class="img-uploader-plus"><i class="icons el-icon-plus"/> 添加图片</p>
                      <p class="img-uploader-tips">建议尺寸为 345 x 156 像素</p>
                    </div>
                  </div>

                  <div class="link-address">
                    <template v-if="imgData.sellWellImg.linkName">
                      <div class="link-wrap">已添加链接至: "{{ imgData.sellWellImg.linkName }}"</div>
                      <el-button
                        round
                        size="mini"
                        @click="openLinkSelector('sellWellImg')">修改
                      </el-button>
                    </template>
                    <el-button
                      v-else
                      size="mini"
                      type="primary"
                      class="fr"
                      @click="openLinkSelector('sellWellImg')">添加链接
                    </el-button>
                  </div>
                </el-card>
              </div>
            </div>
            <el-form>
              <el-form-item
                label="选取商品："
                label-width="80px">
                <el-button
                  :loading="loading"
                  type="primary"
                  @click="showGoodsSelector = true">选取商品</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>

        <!--火爆接龙-->
        <div
          v-for="(item, key) in imgData"
          v-if="item.title"
          :key="key"
          class="item-content">
          <div class="header">
            <h4 class="sub-title no-border">
              <el-checkbox
                v-model="item.isShow"
                :true-label="1"
                :false-label="0">{{ item.title }}</el-checkbox>
            </h4>
          </div>
          <div
            v-show="item.isShow"
            class="content-body">
            <div class="img-list">
              <div class="img-item">
                <el-card
                  :body-style="{ padding: '0px' }"
                  shadow="hover"
                  class="img-content">
                  <div @click="openMaterialSelector(key)">
                    <div
                      v-if="item.imgUrl"
                      :style="`background-image:url(${ item.imgUrl })`"
                      class="img-uploader uploaded"><img
                        :src="item.imgUrl"
                        class="img" >
                    </div>
                    <div
                      v-else
                      class="img-uploader">
                      <p class="img-uploader-plus"><i class="icons el-icon-plus"/> 添加图片</p>
                      <p class="img-uploader-tips">建议尺寸为 345 x 156 像素</p>
                    </div>
                  </div>

                  <div class="link-address">
                    <template v-if="item.linkName">
                      <div class="link-wrap">已添加链接至: "{{ item.linkName }}"</div>
                      <el-button
                        round
                        size="mini"
                        @click="openLinkSelector(key)">修改
                      </el-button>
                    </template>
                    <el-button
                      v-else
                      size="mini"
                      type="primary"
                      class="fr"
                      @click="openLinkSelector(key)">添加链接
                    </el-button>
                  </div>
                </el-card>
              </div>
            </div>
          </div>
        </div>

        <div class="footer-container">
          <el-button
            :loading="loading"
            type="primary"
            @click="submit">保存
          </el-button>
        </div>
      </div>

      <material-selector
        :visible.sync="showMaterialSelector"
        :is-multi="false"
        type="image"
        @change="materialSelectorChanged"/>

      <!--连接选择-->
      <link-selector
        :current-value="linkSelected"
        :visible.sync="showLinkSelector"
        @change="linkSelectorChanged($event)"/>

      <!--商品选择-->
      <goods-selector
        v-if="showGoodsSelector"
        :visible.sync="showGoodsSelector"
        :type="{1: 'condition', 2: 'manual'}[searchType]"
        :condition-data="search"
        :manual-data="productList"
        @change="goodsSelectorChanged"/>
    </el-col>
  </el-row>
</template>

<script>
import LinkSelector from '@/components/LinkSelector'
import GoodsSelector from '@/components/GoodsSelector'
import MaterialSelector from '@/components/MaterialSelector'
import ApiMinapp from '@/api/minapp'

export default {
  components: {
    LinkSelector,
    GoodsSelector,
    MaterialSelector
  },
  data () {
    return {
      showGoodsSelector: false,
      loading: false,
      showLinkSelector: false,
      currentLink: '',
      showMaterialSelector: false,
      currentMaterial: '',

      id: '',
      appType: 1,
      // 推荐商品方式 1 按条件 2 手动选取
      searchType: 1,
      // 推荐商品筛选条件
      search: {
        categoryList: [],
        labelList: [],
        startPrice: '',
        endPrice: ''
      },
      // 推荐商品
      productList: [],
      imgData: {
        // 店长推荐
        sellWellImg: {
          imgUrl: '',
          isShow: 1,
          linkName: '',
          linkUrl: ''
        },

        // 火爆接龙
        solitaireImg: {
          imgUrl: '',
          isShow: 1,
          linkName: '',
          linkUrl: '',
          title: ''
          // title: '火爆接龙'
        },

        // 好物拼购
        assembleImg: {
          imgUrl: '',
          isShow: 1,
          linkName: '',
          linkUrl: '',
          // title: ''
          title: '好物拼购'
        },

        // 转发排行
        forwardImg: {
          imgUrl: '',
          isShow: 1,
          linkName: '',
          linkUrl: '',
          title: '转发排行'
        }
      }
    }
  },

  computed: {
    linkSelected () {
      const itemInfo = this.imgData[this.currentLink] || {}
      return { url: itemInfo.linkUrl, name: itemInfo.linkName }
    }
  },
  created () {
    this.getInfo()
  },

  methods: {
    openMaterialSelector (key) {
      this.currentMaterial = key
      this.showMaterialSelector = true
    },
    materialSelectorChanged (data) {
      this.imgData[this.currentMaterial].imgUrl = data[0].imgUrl || ''
      this.showMaterialSelector = false
    },
    openLinkSelector (type) {
      this.currentLink = type
      this.showLinkSelector = true
    },
    linkSelectorChanged ({ name, url }) {
      this.imgData[this.currentLink].linkName = name || ''
      this.imgData[this.currentLink].linkUrl = url || ''
      this.currentLink = ''
    },
    goodsSelectorChanged ({ tabType, data }) {
      this.searchType = tabType === 'condition' ? 1 : 2
      if (this.searchType === 1) {
        this.search = data
      } else {
        this.productList = data
      }
    },

    getInfo () {
      this.loading = true
      ApiMinapp.getInfo({ appType: 1 }).then(({ data }) => {
        this.loading = false
        if (!data) return
        this.id = data.id || ''
        this.appType = data.appType || 1
        this.searchType = data.searchType || 1
        this.search = data.search || {
          categoryList: [],
          labelList: [],
          startPrice: '',
          endPrice: ''
        }
        this.productList = data.productList
        const defaultData = { imgUrl: '', isShow: 1, linkName: '', linkUrl: '' }
        const typeList = ['sellWellImg', 'solitaireImg', 'assembleImg', 'forwardImg']
        typeList.forEach((item) => {
          this.imgData[item] = data[item] || { ...defaultData }
        })
        // this.imgData.solitaireImg.title = '火爆接龙'
        this.imgData.assembleImg.title = '好物拼购'
        this.imgData.forwardImg.title = '转发排行'
      })
    },
    submit () {
      const params = {
        id: this.id,
        appType: this.appType,
        searchType: this.searchType,
        search: this.search,
        productList: this.productList,
        ...this.imgData
      }
      params.solitaireImg.isShow = 0
      // params.assembleImg.isShow = 0
      this.loading = true
      ApiMinapp.save(params).then(({ message }) => {
        this.loading = false
        this.$message({ type: 'success', message })
        this.getInfo()
      }, () => {
        this.loading = false
      })
    }
  }
}
</script>
<style lang="scss">
  .dialog-miniapp-template {
    .el-form-item__label {
      text-align: left;
    }

    .el-dialog__body {
      padding: 30px 50px;
    }
  }

  .miniapp-template-container {
    .sub-title .el-checkbox__label {
      font-size: 16px;
      color: #303133;
      font-weight: bold;
    }
    .footer-container {
      .el-button {
        margin-right: 20px;
        padding: 12px 40px;
      }
    }
  }
</style>

<style lang="scss" scoped>
  $banner-item-height: 200px;

  .miniapp-template-container {
    display: flex;
    margin-left: 0 !important;
  }

  .left-container,
  .right-container {
    .title {
      font-size: 14px;
      font-weight: bold;
    }
  }

  .left-container {
    width: 375px;
    min-width: 375px;
    padding: 0 !important;
    margin-right: 10px;
    .phone-box {
      height: 812px;
      background-color: white;
      border-radius: 8px;
      background: url('../../../assets/images/minapp/preview.jpg') no-repeat 50%/cover;
    }
  }

  .right-container {
    flex: 1;
    > .content {
      margin-top: 10px;
      width: 100%;
      border-radius: 8px;
      background-color: white;
    }

    .item-content {
      border-bottom: 1px solid #ebeef5;
      .header {
        display: -webkit-box;
        -webkit-box-align: center;
        box-sizing: border-box;
        padding: 16px 24px;
        position: relative;
      }
      .sub-title {
        position: relative;
        padding-left: 16px;
        font-size: 16px;
        color: #303133;
        font-weight: bold;
        &::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          height: 18px;
          width: 4px;
          border-radius: 2px;
          background-color: $--color-primary;
        }
        &.no-border {
          padding-left: 0;
          &::after {
            display: none;
          }
        }
      }
      .content-body {
        padding: 0 24px 24px;
      }
    }

    .footer-container {
      background-color: white;
      padding: 16px 24px;
      border-top: 1px solid #ebeef5;
    }

    .text-placeholder {
      font-size: 14px;
      color: #909399;
      line-height: 16px;
      font-weight: normal;
    }

    .tab-content {
      padding-left: 24px;
      @include clearfix();
      min-height: 600px;
    }

    .img-list {
      @include clearfix();
      /*margin-bottom: 10px;*/
      .img-item {
        width: percentage(1/3);
        min-width: 350px;
        position: relative;
        float: left;
        padding-right: 10px;
        padding-bottom: 20px;
        &:hover .btn-close {
          display: block;
        }
        .link-address {
          display: flex;
          padding: 16px 16px 16px 20px;
          color: #606266;
          .link-wrap {
            flex: 1;
            line-height: 28px;
            padding-right: 10px;
            @include ellipsis()
          }
        }
        .btn-close {
          display: none;
          position: absolute;
          top: 10px;
          right: 20px;
          width: 20px;
          height: 20px;
          line-height: 20px;
          text-align: center;
          font-size: 14px;
          border-radius: 50%;
          font-weight: bold;
          color: #5889ff;
          background-color: rgba(255, 255, 255, 0.9);
          cursor: pointer;
          z-index: 99;
        }
        .link {
          color: #5889ff;
        }
      }
    }

    .img-uploader {
      display: inline-block;
      position: relative;
      /*border: 1px dashed #d9d9d9;*/
      border-bottom: 1px solid #d8dce6;
      /*border-radius: 6px;*/
      cursor: pointer;
      width: 100%;
      height: $banner-item-height;
      text-align: center;
      &-plus {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 14px;
        .icons {
          font-size: 20px;
          color: #8c939d;
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
        background-size: cover;
        background-position: 50% 50%;
        background-repeat: no-repeat;
      }
      .img {
        width: 100%;
        height: 100%;
      }
    }

    .list-name {
      .input {
        width: 200px;
        margin-right: 10px;
      }
      .tips {
        color: $--color-text-secondary;
      }
    }
  }
</style>
