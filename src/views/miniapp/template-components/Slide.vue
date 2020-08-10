<template>
  <div class="template-components-slide">
    <el-form
      ref="form"
      :rules="formRules"
      :model="form"
      label-width="100px">
      <el-form-item label="轮播图">
        <div class="img-list">
          <div
            v-for="(item, index) in form.list"
            :key="index"
            class="img-item">
            <el-card
              :body-style="{ padding: '0px' }"
              shadow="hover">
              <div @click="openMaterialSelector(index)">
                <div
                  v-if="item.imgUrl"
                  :style="`background-image:url(${ item.imgUrl })`"
                  class="img-uploader uploaded" />
                <div
                  v-else
                  class="img-uploader">
                  <p class="img-uploader-plus"><i class="icons el-icon-plus" /> 添加图片</p>
                </div>
              </div>

              <div class="action-wrap">
                <i
                  v-if="index !== 0"
                  class="btn-up el-icon-arrow-up"
                  @click="handleBannerSort(index, index - 1)" />
                <i
                  v-if="index !== form.list.length - 1"
                  class="btn-down el-icon-arrow-down"
                  @click="handleBannerSort(index, index + 1)" />
                <i
                  class="btn-close el-icon-close"
                  @click="handleBannerRemove(index)" />
              </div>

              <div class="link-address">
                <div
                  v-if="item.linkName"
                  class="link-wrap">已添加链接至: "{{ item.linkName }}"
                </div>
                <el-button
                  round
                  size="mini"
                  @click="openLinkSelector(index)">{{ item.linkName ? '修改' : '添加链接' }}
                </el-button>
              </div>
            </el-card>
          </div>
        </div>
        <el-button
          v-if="form.list.length < 5"
          type="primary"
          size="mini"
          @click="handleBannerAdd">
          <i class="el-icon-plus" /> 添加图片
        </el-button>
        <p class="ui-color3 f12">图片建议尺寸为 750 x {{ form.height }} 像素</p>
      </el-form-item>
      <el-form-item label="自定义高度">
        <el-input
          v-model="form.height"
          class="w100" />
      </el-form-item>
    </el-form>

    <material-selector
      :visible.sync="showMaterialSelector"
      :is-multi="false"
      type="image"
      @change="materialSelectorChanged" />

    <link-selector
      :current-value="linkSelected"
      :visible.sync="showLinkSelector"
      @change="linkSelectorChanged($event)" />
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
        return {}
      }
    }
  },
  data () {
    return {
      showMaterialSelector: false,
      showLinkSelector: false,
      currentIndex: '',
      form: {
        list: [],
        height: 400
      },
      formRules: {}
    }
  },
  computed: {
    linkSelected () {
      const itemInfo = this.form.list[this.currentIndex] || {}
      return { url: itemInfo.linkUrl, name: itemInfo.linkName }
    }
  },

  created () {
    if (Object.keys(this.defaultValue).length) {
      this.form = this.defaultValue
    }
    this.emitData()
  },

  methods: {
    handleBannerAdd () {
      this.form.list.push({ linkUrl: '', linkName: '', imgUrl: '' })
    },
    handleBannerRemove (index) {
      this.form.list.splice(index, 1)
      this.$message({ type: 'success', message: '已删除，保存后生效!' })
      this.emitData()
    },
    handleBannerSort (index, indexTo) {
      const list = this.form.list
      list.splice(indexTo, 1, ...list.splice(index, 1, list[indexTo]))
    },
    openMaterialSelector (index) {
      this.currentIndex = index
      this.showMaterialSelector = true
    },
    openLinkSelector (index) {
      this.currentIndex = index
      this.showLinkSelector = true
    },
    materialSelectorChanged (data) {
      this.$set(this.form.list, this.currentIndex, { imgUrl: data[0].imgUrl || '' })
      this.showMaterialSelector = false
      this.emitData()
    },
    linkSelectorChanged ({ name, url }) {
      this.form.list[this.currentIndex].linkName = name || ''
      this.form.list[this.currentIndex].linkUrl = url || ''
      this.emitData()
    },
    emitData () {
      this.$emit('change', this.form)
    }
  }
}
</script>

<style lang="scss">
  .template-components-slide {
    .img-list {
      font-size: 0;

      .img-item {
        vertical-align: top;
        font-size: 12px;
        width: 375px;
        position: relative;
        padding-right: 10px;
        padding-bottom: 10px;

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

        .action-wrap {
          position: absolute;
          top: 0;
          right: 0;
          padding-right: 10px;
          width: 100%;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }

        .btn-close,
        .btn-down,
        .btn-up {
          display: none;
          margin-right: 10px;
          width: 20px;
          height: 20px;
          line-height: 20px;
          text-align: center;
          font-size: 14px;
          border-radius: 50%;
          font-weight: bold;
          cursor: pointer;
          z-index: 99;
        }

        &:hover {
          .btn-close,
          .btn-down,
          .btn-up {
            display: block;
          }
        }

        .btn-close {
          right: 20px;
          color: #5889ff;
          background-color: rgba(255, 255, 255, 0.9);
        }

        .btn-down {
          right: 50px;
          color: #ffffff;
          background-color: #65c654;
        }

        .btn-up {
          right: 80px;
          color: #ffffff;
          background-color: #eb6b5f;
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
