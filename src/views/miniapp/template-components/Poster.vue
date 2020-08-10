<template>
  <div class="template-components-poster">
    <el-form
      ref="form"
      :rules="formRules"
      :model="form"
      label-width="100px">
      <el-form-item label="海报图片">
        <div class="poster-wrap">
          <el-card
            :body-style="{ padding: '0px' }"
            shadow="hover">
            <img
              v-if="form.imgUrl"
              :src="form.imgUrl"
              class="img"
              @click="showMaterialSelector = true">
            <div
              v-else
              class="img-uploader"
              @click="showMaterialSelector = true">
              <p class="img-uploader-plus"><i class="icons el-icon-plus"/> 添加图片</p>
            </div>
            <div
              v-for="(item, index) in form.link"
              :key="index"
              :style="{ left: `${item.position[0]}px`, top: `${item.position[1]}px`}"
              :class="{ 'active-move-block-wrap': index == currentLinkIndex }"
              class="move-block-wrap">
              <div
                :style="{ width: `${item.width}px`, height: `${item.height}px`}"
                class="move-block"
                @mousedown="(event) => moveBlockDown(event, index)"/>
              <div
                class="scale-block"
                @mousedown="(event) => scaleBlockDown(event, index)"/>
            </div>
          </el-card>
        </div>
        <p class="ui-color3 f12">图片建议尺寸为 750 x 200 像素（图片高度根据宽度自适应）</p>
        <div
          v-if="form.imgUrl"
          class="link-address-wrap">
          <div
            v-for="(item, index) in form.link"
            :key="index"
            :class="{ 'active-item-link': index == currentLinkIndex }"
            class="item-link">
            <div
              class="link-wrap">已添加链接至: "{{ item.linkName }}"
            </div>
            <!--
              <el-button
                round
                size="mini"
                @click="openLinkSelector(index)">修改链接
              </el-button>
-->
            <el-button
              icon="el-icon-edit"
              type="text"
              size="mini"
              @click="openLinkSelector(index)"/>
            <el-button
              icon="el-icon-delete"
              type="text"
              size="mini"
              @click="delLink(index)"/>
          </div>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-plus"
            @click="addLink">增加链接
          </el-button>
        </div>
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
      currentLinkIndex: '',
      form: {
        imgUrl: '',
        link: []
      },
      formRules: {}
    }
  },
  computed: {
    linkSelected () {
      const itemInfo = this.form.link[this.currentLinkIndex] || {}
      return { url: itemInfo.linkUrl, name: itemInfo.linkName }
    }
  },
  created () {
    this.form = Object.assign(this.form, this.defaultValue)
    this.emitData()
  },

  methods: {
    getElementStyle () {
      let elements = document.querySelectorAll('.template-components-poster img')
      elements = [...elements]
      const element = elements.filter((item) => item.src === this.form.imgUrl)[0]
      return element
    },
    scaleBlockDown (event, index) {
      this.currentLinkIndex = index
      const _this = this
      let itemInfo = _this.form.link[index]
      const oldWidth = event.clientX - itemInfo.width
      const oldHeight = event.clientY - itemInfo.height
      const elementStyle = this.getElementStyle()
      const maxWidth = parseInt(elementStyle.width) - 2 - itemInfo.position[0]
      const maxHeight = parseInt(elementStyle.height) - 2 - itemInfo.position[1]

      document.onmousemove = function (e) {
        e.preventDefault()
        let width = e.clientX - oldWidth
        let height = e.clientY - oldHeight
        width = width < 50 ? 50 : width
        height = height < 50 ? 50 : height
        width = width < maxWidth ? width : maxWidth
        height = height < maxHeight ? height : maxHeight
        _this.form.link[index].width = width
        _this.form.link[index].height = height
      }
      document.onmouseup = function () {
        _this.emitData()
        document.onmousemove = () => {}
        document.onmouseup = () => {}
      }
    },
    moveBlockDown (event, index) {
      this.currentLinkIndex = index
      const _this = this
      let itemInfo = _this.form.link[index]
      const oldClientX = event.clientX - itemInfo.position[0]
      const oldClientY = event.clientY - itemInfo.position[1]
      const elementStyle = this.getElementStyle()
      const maxRight = parseInt(elementStyle.width) - itemInfo.width
      const maxBottom = parseInt(elementStyle.height) - itemInfo.height

      document.onmousemove = function (e) {
        e.preventDefault()
        let clientX = e.clientX - oldClientX
        let clientY = e.clientY - oldClientY
        clientX = clientX < 0 ? 0 : clientX
        clientY = clientY < 0 ? 0 : clientY
        clientX = clientX > maxRight ? maxRight : clientX
        clientY = clientY > maxBottom ? maxBottom : clientY
        _this.form.link[index].position = [clientX, clientY]
      }
      document.onmouseup = function () {
        _this.emitData()
        document.onmousemove = () => {}
        document.onmouseup = () => {}
      }
    },
    addLink () {
      if (!this.form.imgUrl) {
        this.$message('请先上传图片')
        return
      }
      this.form.link.push({
        width: '50',
        height: '50',
        position: ['0', '0'],
        linkName: '',
        linkUrl: ''
      })
    },
    materialSelectorChanged (data) {
      this.form.imgUrl = data[0].imgUrl || ''
      this.form.link = []
      this.showMaterialSelector = false
      this.emitData()
    },
    openLinkSelector (index) {
      this.currentLinkIndex = index
      this.showLinkSelector = true
    },
    linkSelectorChanged ({ name, url }) {
      this.form.link[this.currentLinkIndex].linkName = name || ''
      this.form.link[this.currentLinkIndex].linkUrl = url || ''
      this.currentLinkIndex = ''
      this.emitData()
    },
    delLink (index) {
      this.form.link.splice(index, 1)
      this.emitData()
    },
    emitData () {
      this.$emit('change', this.form)
    }
  }
}
</script>

<style lang="scss">
  .template-components-poster {
    .img-uploader {
      display: block;
      position: relative;
      cursor: pointer;
      width: 100%;
      min-height: 200px;
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
    }
    .poster-wrap {
      width: 377px;
      height: auto;
      .img {
        width: 100%;
        height: auto;
        display: block;
      }
    }
    .link-address-wrap {
      padding: 10px;
      border: 1px solid #ebeef5;
      .item-link {
        font-size: 12px;
        display: flex;
        color: #606266;
        margin-bottom: 10px;
        border-bottom: 1px dashed #ebeef5;
        &:last-child {
          margin-bottom: 0;
        }
        .link-wrap {
          flex: 1;
          line-height: 28px;
          padding-right: 10px;
          @include ellipsis()
        }
        &.active-item-link {
          color: #E75C45;
        }
      }
    }
    .move-block-wrap {
      position: absolute;
      cursor: move;
      border: 1px solid #24baab;
      background: rgba(36, 186, 171, .5);
      .scale-block {
        width: 0;
        height: 0;
        position: absolute;
        right: 1px;
        bottom: 1px;
        border-bottom: 5px solid white;
        border-left: 5px solid transparent;
        cursor: nw-resize;
      }
      &.active-move-block-wrap {
        border-color: #E75C45;
        background: rgba(231,92,69,.5);
      }
    }
  }
</style>
