<template>
  <div class="page-material">
    <el-tabs
      type="border-card"
      @tab-click="tabClick">
      <el-tab-pane label="图片">
        <!--<file-upload
          :disabled="true"
          multiple
          @before-upload="beforeUpload"
          @on-success="uploadSuccess">
          <el-button
            :disabled="imageUploadLoading"
            :loading="imageUploadLoading"
            type="primary"
            icon="el-icon-upload">{{ imageUploadLoading ? '图片上传中' : '上传图片' }}
          </el-button>
        </file-upload>-->

        <img-list
          ref="imageList"
          :type="1" />
      </el-tab-pane>

      <el-tab-pane label="视频">
        <!-- <file-upload
          :max-size="50"
          :disabled="videoUploadLoading"
          type="video"
          @before-upload="beforeUpload"
          @on-success="uploadSuccess">
          <el-button
            :disabled="videoUploadLoading"
            :loading="videoUploadLoading"
            type="primary"
            icon="el-icon-upload">{{ videoUploadLoading ? '视频上传中' : '上传视频' }}
          </el-button>
        </file-upload> -->

        <img-list
          ref="videoList"
          :type="2" />
      </el-tab-pane>

      <el-tab-pane :label="num">
        <template>
          <img-list
            :type="3"
            @showtotaltount="showtotaltount" />
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import ImgList from './components/ImgList'
import FileUpload from '@/components/FileUpload'

export default {
  name: 'Material',
  components: {
    ImgList,
    FileUpload
  },

  data () {
    return {
      imageUploadLoading: false,
      videoUploadLoading: false,
      num: '报错(0)'
    }
  },

  methods: {
    tabClick ({ index }) {
      this.type = ++index
    },
    beforeUpload ({ result, type }) {
      if (result) this[`${type}UploadLoading`] = true
    },
    uploadSuccess ({ type }) {
      this[`${type}UploadLoading`] = false
      this.$refs[`${type}List`].getList()
      // TODO 替换
      // location.reload()
    },
    showtotaltount (num) {
      this.num = `报错(${num})`
    }
  }
}
</script>

<style lang="scss">
</style>
