<template>
  <div class="template-components-nav">
    <el-form
      ref="form"
      :rules="formRules"
      :model="form"
      label-width="100px">
      <div class="nav-wrap">
        <el-card
          v-for="(item, index) in form.list"
          :key="index"
          :body-style="{ padding: '0px' }"
          shadow="hover"
          class="nav-item">
          <el-button
            class="del"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="delNav(index)">删除</el-button>
          <el-form-item
            label="导航名称">
            <el-input
              v-model="item.name"
              class="w200"
              placeholder="请输入导航名称"
              @blur="emitData"/>
          </el-form-item>
          <el-form-item
            label="导航链接地址">
            <div class="link-address">
              <template v-if="item.linkName">
                <el-button
                  class="add-link"
                  round
                  icon="el-icon-edit"
                  size="mini"
                  @click="openLinkSelector(index)">已添加链接至: "{{ item.linkName }}"
                </el-button>
              </template>
              <el-button
                v-else
                round
                size="mini"
                icon="el-icon-plus"
                @click="openLinkSelector(index)">添加链接
              </el-button>
            </div>
          </el-form-item>
          <el-form-item
            label="导航图片">
            <div
              style="width: 100px; height: 100px;"
              class="ui-img-uploader"
              @click="openMaterialSelector(index)">
              <img
                v-if="item.imgUrl"
                :src="item.imgUrl"
                class="img" >
              <p
                v-else
                class="ui-img-uploader-plus"><i class="icons el-icon-plus"/> 添加图片</p>
            </div>
            <p class="ui-color3 f12">建议尺寸为 100 x 100 像素</p>
          </el-form-item>
        </el-card>
      </div>
      <el-form-item
        v-if="form.list.length < 4"
        label="">
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-plus"
          @click="addNav">添加导航</el-button>
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
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      showMaterialSelector: false,
      showLinkSelector: false,
      currentIndex: '',
      form: {
        list: []
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
    this.form.list = [].concat(this.defaultValue)
    this.emitData()
  },

  methods: {
    addNav () {
      this.form.list.push({ name: '', linkName: '', linkUrl: '', imgUrl: '' })
    },
    delNav (index) {
      this.form.list.splice(index, 1)
      this.emitData()
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
      this.form.list[this.currentIndex].imgUrl = data[0].imgUrl || ''
      this.showMaterialSelector = false
      this.emitData()
    },
    linkSelectorChanged ({ name, url }) {
      this.form.list[this.currentIndex].linkName = name || ''
      this.form.list[this.currentIndex].linkUrl = url || ''
      this.emitData()
    },
    emitData () {
      this.$emit('change', this.form.list)
    }
  }
}
</script>

<style lang="scss">
  .template-components-nav {
    .nav-wrap {
      /*font-size: 0;*/
    }
    .nav-item {
      /*display: inline-block;*/
      /*font-size: 12px;*/
      /*vertical-align: top;*/
      /*width: 450px;*/
      /*margin-right: 10px;*/
      padding-top: 10px;
      position: relative;
      margin-bottom: 10px;
      padding-right: 10px;
      .del {
        position: absolute;
        right: 10px;
        top: 0;
        z-index: 4;
      }
      .add-link {
        font-weight: normal;
        @include ellipsis();
      }
    }
  }
</style>
