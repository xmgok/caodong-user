<template>
  <div class="template-components-banner">
    <el-form
      ref="form"
      :rules="formRules"
      :model="form"
      label-width="100px">
      <el-form-item label="广告图">
        <div class="img-list">
          <div class="img-item">
            <el-card
              :body-style="{ padding: '0px' }"
              shadow="hover">
              <div @click="openMaterialSelector()">
                <div
                  v-if="form.imgUrl"
                  :style="`background-image:url(${ form.imgUrl })`"
                  class="img-uploader uploaded"/>
                <div
                  v-else
                  class="img-uploader">
                  <p class="img-uploader-plus"><i class="icons el-icon-plus"/> 添加图片</p>
                </div>
              </div>

              <!--
              <i
                class="btn-close el-icon-close"
                @click="handleBannerRemove()"/>
-->

              <div class="link-address">
                <div
                  v-if="form.linkName"
                  class="link-wrap">已添加链接至: "{{ form.linkName }}"</div>
                <el-button
                  round
                  size="mini"
                  @click="openLinkSelector()">{{ form.linkName ? '修改' : '添加链接' }}
                </el-button>
              </div>
            </el-card>
          </div>
        </div>
        <p class="ui-color3 f12">图片建议尺寸为 750 x 400 像素（图片高度根据宽度自适应）</p>
      </el-form-item>
    </el-form>
    <material-selector
      :visible.sync="showMaterialSelector"
      :is-multi="false"
      type="image"
      @change="materialSelectorChanged"/>
    <link-selector
      :current-value="linkSelected"
      :visible.sync="showLinkSelector"
      @change="linkSelectorChanged($event)"/>
  </div>
</template>

<script>
import MaterialSelector from '@/components/MaterialSelector'
import LinkSelector from '@/components/LinkSelector'

export default {
  components: {
    MaterialSelector,
    LinkSelector
  },
  props: {
    defaultValue: {
      type: Object,
      default: () => {
      }
    }
  },
  data () {
    return {
      showMaterialSelector: false,
      showLinkSelector: false,
      form: {
        linkUrl: '',
        linkName: '',
        imgUrl: ''
      },
      formRules: {}
    }
  },

  computed: {
    linkSelected () {
      return { url: this.form.linkUrl, name: this.form.linkName }
    }
  },
  created () {
    this.form = Object.assign(this.form, this.defaultValue)
    this.emitData()
  },

  methods: {
    openMaterialSelector () {
      this.showMaterialSelector = true
    },
    openLinkSelector () {
      this.showLinkSelector = true
    },
    materialSelectorChanged (data) {
      this.form.imgUrl = data[0].imgUrl || ''
      this.showMaterialSelector = false
      this.emitData()
    },
    linkSelectorChanged ({ name, url }) {
      this.form.linkName = name || ''
      this.form.linkUrl = url || ''
      this.emitData()
    },
    emitData () {
      this.$emit('change', this.form)
    }
  }
}
</script>

<style lang="scss">
  .template-components-banner {
    .img-list {
      font-size: 0;
      .img-item {
        display: inline-block;
        vertical-align: top;
        font-size: 12px;
        width: 375px;
        position: relative;
        padding-right: 10px;
        padding-bottom: 10px;
        &:hover .btn-close {
          display: block;
        }
        .link-address {
          display: flex;
          padding: 16px 16px 16px 20px;
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
      .img-uploader {
        display: block;
        position: relative;
        border-bottom: 1px solid #d8dce6;
        cursor: pointer;
        width: 100%;
        height: 200px;
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
        &.uploaded {
          border: none;
          background-size: cover;
          background-position: 50% 50%;
          background-repeat: no-repeat;
        }
      }
    }
  }
</style>
