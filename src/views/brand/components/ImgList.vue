<template>
  <div class="components-img-list">
    <div v-if="type === 1">
      <div class="space-between">
        <div class="space-between">
          <material-category @change="(id) => materialCategoryChange(id, 'categoryIdUpload')" />
          <file-upload
            :disabled="true"
            :category-id="categoryIdUpload"
            multiple
            @before-upload="beforeUpload"
            @on-success="uploadSuccess">
            <el-button
              :disabled="imageUploadLoading"
              :loading="imageUploadLoading"
              type="primary"
              icon="el-icon-upload">{{ imageUploadLoading ? '图片上传中' : '上传图片' }}
            </el-button>
          </file-upload>
          <div class="grey ml5">限制大小：2M以下</div><!--上传时超了会弹窗提示-->
        </div>
        <div class="space-between">
          <el-input
            v-model="imgName"
            placeholder="请输入图片名称"
            style="width: 380px;">
            <material-category
              slot="prepend"
              style="width: 120px;"
              @change="(id) => materialCategoryChange(id, 'categoryIdSearch')" />
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="search" />
          </el-input>
        </div>
      </div>
      <div class="space-between mt5">
        <div class="grey">先选择图片分类，再上传图片可直接上传到相应分类里</div>
      </div>
    </div>

    <div
      v-if="type === 2"
      class="flex">
      <div class="flex1">
        <file-upload
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
        </file-upload>
        <div class="grey mt5">限制大小：50M以下</div><!--上传时超了会弹窗提示-->
      </div>
      <div class="fr">
        <el-form
          :inline="true"
          :model="form"
          class="demo-form-inline">
          <el-form-item>
            <el-input
              v-model="form.title"
              placeholder="请输入视频名称"
              class="">
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="getList()" />
            </el-input>
          </el-form-item>
        </el-form>
      </div>

    </div>
    <div class="top-func">
      <el-checkbox
        v-if="imgList.length"
        v-model="checked"
        @change="changeCheckedAll">全选
      </el-checkbox>

      <el-button
        v-if="imgList.length"
        class="ml20"
        type="text"
        size="small"
        @click="deleteAll">批量删除{{ type == 2 ? '视频' : '图片' }}
      </el-button>

      <el-button
        v-if="imgList.length && type === 1"
        class="ml20"
        type="text"
        size="mini"
        @click="plChangeBefore('categoryDialogVisible')">批量修改分类
      </el-button>
    </div>

    <div class="list-wrap">
      <el-checkbox-group
        v-model="checkedList"
        @change="changeChecked">
        <div
          v-for="item in imgList"
          :key="item.id"
          class="img-item">
          <p
            v-if="type === MaterialTypes.IMAGE || type === MaterialTypes.VIDEO"
            class="detele">
            <el-button
              type="text"
              size="small"
              @click="deleteItem(item.id)">删除
            </el-button>
          </p>

          <div
            :style="{backgroundImage: 'url(' + (type !== MaterialTypes.VIDEO ? item.imgUrl : item.videoUrl) + ')'}"
            class="img"
            @click="handlePreview(item.imgUrl)">
            <p v-if="type === MaterialTypes.VIDEO" />
          </div>
          <div
            class="img-name">
            <!-- <p class="name-text">{{ item.imgName || item.defaultUrl }}&nbsp;</p> -->
            <el-checkbox :label="item.id">
              <div class="name-text">{{ item.imgName || item.defaultUrl }}</div>
            </el-checkbox>
          </div>

          <div v-if="type === MaterialTypes.REPORT">
            <p class="flex flex-jc-sb">
              <el-button
                type="text"
                size="small"
                @click="reportIgnore(item.id)">忽略
              </el-button>
              <el-button
                class="ml20"
                type="text"
                size="small"
                @click="reportDelete(item.id)">删除
              </el-button>
            </p>
          </div>
        </div>
      </el-checkbox-group>
    </div>

    <!--分页-->
    <div
      v-if="imgList.length <= 0"
      class="tc p50">暂无数据
    </div>
    <div
      class="g-pagination-wrap"
      style="padding: 0;">
      <el-pagination
        :current-page="pageNum"
        :page-sizes="$store.state.app.pageSizes"
        :page-size="pageSize"
        :total="totalCount"
        :layout="$store.state.app.layout"
        @size-change="sizeChange"
        @current-change="handlePageChange" />
    </div>

    <!--素材预览-->
    <el-dialog
      :visible.sync="previewVisible"
      width="1000px">
      <template v-if="type === MaterialTypes.VIDEO">
        <video-player
          ref="videoPlayer"
          :options="playerOptions"
          :playsinline="true" />
      </template>
      <img
        v-else
        :src="previewUrl"
        width="100%"
        alt="">
    </el-dialog>

    <!--批量修改图片分类-->
    <el-dialog
      :visible="categoryDialogVisible"
      title="修改图片分类"
      width="500px"
      @close="categoryDialogVisible=false">
      <div class="grey mb18">将图片转移到以下分类：</div>
      <material-category @change="(id) => materialCategoryChange(id, 'categoryIdChange')" />
      <div
        slot="footer"
        class="dialog-footer">
        <el-button @click="categoryDialogVisible=false">取 消</el-button>
        <el-button
          type="primary"
          @click="plChange('modify-category')">确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ApiMaterial from '@/api/material'
import { videoPlayer } from 'vue-video-player'
import 'video.js/dist/video-js.css'
import * as ApiMaterial2 from '@/api/material2'
import { MaterialTypes } from '@/config/const'
import MaterialCategory from '@/components/MaterialCategory'
import FileUpload from '@/components/FileUpload'

export default {
  name: 'ImgList',

  components: { videoPlayer, MaterialCategory, FileUpload },

  props: {
    type: {
      type: Number,
      default: MaterialTypes.IMAGE
    }
  },

  data () {
    return {
      imageUploadLoading: false,
      videoUploadLoading: false,
      imgName: '',
      categoryIdUpload: '',
      categoryIdSearch: '',
      // 批量修改分类弹窗显示
      categoryDialogVisible: false,
      categoryIdChange: '',
      MaterialTypes,
      checked: false,
      imgList: [],
      checkedList: [],
      pageNum: 1,
      pageSize: 20,
      totalCount: 0,
      previewVisible: false,
      previewUrl: '',
      videoOffsetQuery: '?vframe/jpg/offset/2',
      playerOptions: {
        muted: true,
        language: 'en',
        playbackRates: [0.7, 1.0, 1.5, 2.0],
        sources: [{
          type: 'video/mp4',
          src: ''
        }, {
          type: 'video/webm',
          src: ''
        }],
        poster: ''
      },
      form: {
        title: ''
      }

    }
  },

  computed: {
    player () {
      return this.$refs.videoPlayer.player
    }
  },

  watch: {
    previewVisible (val) {
      // 关闭预览弹窗时，暂停视屏播放
      if (!val && this.type === MaterialTypes.VIDEO) this.player.pause()
    }
  },

  created () {
    this.getList()
  },

  methods: {
    search () {
      // 处理翻页全选不正常
      this.checked = false
      this.checkedList = []
      this.getList()
    },
    beforeUpload ({ result, type }) {
      if (result) this[`${type}UploadLoading`] = true
    },
    uploadSuccess ({ type }) {
      this[`${type}UploadLoading`] = false
      this.getList()
    },
    materialCategoryChange (id, type) {
      this[type] = id
    },
    plChangeBefore (type) {
      if (this.checkedList.length <= 0) {
        this.$message({ type: 'warning', message: '您暂未选择图片，请先选择需要修改分类的图片再继续操作。' })
        return
      }
      this[type] = true
    },
    plChange (type) {
      this.$confirm('确定修改分类吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (type === 'modify-category') { // 批量修改分类。
          ApiMaterial2.updateLabel({
            labelId: this.categoryIdChange,
            ids: this.checkedList
          }).then(({ message = '' }) => {
            this.categoryDialogVisible = false
            this.pageNum = 1
            this.getList()
            this.$message({ type: 'success', message: message })
          }, () => {
          })
        }
      }).catch(() => {
      })
    },
    getList () {
      if (this.type === MaterialTypes.REPORT) {
        ApiMaterial2.getReportList({
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          labelId: this.categoryIdSearch,
          imgName: this.imgName
        }).then(({ data = {} }) => {
          data.dataList = this.handleDataFormat(data.dataList || [])
          this.totalCount = data.totalCount
          this.imgList = data.dataList
          this.$emit('showtotaltount', data.totalCount)
        })
        return
      }

      ApiMaterial.getList({
        type: this.type,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        labelId: this.categoryIdSearch,
        imgName: this.imgName || this.form.title
      }).then(({ data = {} }) => {
        data.dataList = this.handleDataFormat(data.dataList || [])
        if (this.type === MaterialTypes.VIDEO) {
          data.dataList.forEach((item) => {
            item.videoUrl = `${item.imgUrl}${this.videoOffsetQuery}`
          })
        }
        this.totalCount = data.totalCount
        this.imgList = data.dataList
      })
    },
    handleDataFormat (data) {
      return data.map((item) => {
        // 处理无图片名的情况
        const imgUrlSplit = item.imgUrl.split('/')
        item.defaultUrl = imgUrlSplit[imgUrlSplit.length - 1]
        return item
      })
    },
    sizeChange (e) {
      this.pageSize = e
      // 处理翻页全选不正常
      this.checked = false
      this.checkedList = []
      this.getList()
    },
    handlePageChange (val) {
      this.pageNum = val
      // 处理翻页全选不正常
      this.checked = false
      this.checkedList = []
      this.getList()
    },
    changeChecked () {
      this.checked = this.checkedList.length === this.imgList.length
    },
    changeCheckedAll () {
      if (this.checkedList.length > 1) {
        this.checkedList = []
      } else {
        this.imgList.forEach((item) => {
          this.checkedList.push(item.id)
        })
      }
    },
    deleteItem (id) {
      this.$confirm('确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ApiMaterial.del({ id }).then(({ message = '' }) => {
          this.checked = false
          this.pageNum = 1
          this.getList()
          this.$message({ type: 'success', message: message })
        }, () => {
        })
      }).catch(() => {
      })
    },
    deleteAll () {
      if (this.checkedList.length <= 0) {
        this.$message({ type: 'warning', message: '您暂未选择图片，请先选择需要删除的图片再继续操作。' })
        return
      }

      this.$confirm('确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const delFunc = this.type === MaterialTypes.REPORT ? ApiMaterial2.del : ApiMaterial.del
        delFunc({ id: this.checkedList.join() }).then(({ message = '' }) => {
          this.checked = false
          this.pageNum = 1
          this.getList()
          this.checkedList = []
          this.$message({ type: 'success', message: message })
        }, () => {
        })
      }).catch(() => {
      })
    },
    handlePreview (url) {
      this.previewVisible = true
      if (+this.type === MaterialTypes.VIDEO) {
        this.playerOptions.sources[0].src = url
        this.playerOptions.poster = `${url}${this.videoOffsetQuery}`
      } else {
        this.previewUrl = url
      }
    },
    reportIgnore (id) {
      ApiMaterial2.handle({ id }).then(({ message }) => {
        this.$message.success(message)
        this.getList()
      }, () => {
      })
    },
    reportDelete (id) {
      ApiMaterial2.del({ id }).then(({ message }) => {
        this.$message.success(message)
        this.getList()
      }, () => {
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .space-between {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .components-img-list {
    .video-js {
      width: 962px !important;

      .vjs-big-play-button {
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }

    .list-wrap {
      font-size: 0;
      padding-top: 20px;

      .img-item {
        vertical-align: top;
        display: inline-block;
        width: 160px;
        position: relative;
        margin-right: 15px;
        margin-bottom: 20px;

        .img-name {
          padding-top: 8px !important;
          color: #606266;
          font-size: 12px;
          cursor: pointer;
          white-space: nowrap;
        }

        .name-text {
          vertical-align: -2px;
          width: 100px;
          line-height: 14px;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .detele {
          cursor: pointer;
          position: absolute;
          right: 0;
          bottom: -7px;
          text-align: center;
          color: red;
        }

        .img {
          width: 160px;
          height: 160px;
          background-color: #f5f5f5;
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
          cursor: pointer;
          display: -webkit-box;
          -webkit-box-align: center;
          -webkit-box-pack: center;

          p {
            width: 80px;
            height: 72px;
            background-image: url("../../../assets/images/video-bg.png");
            background-repeat: no-repeat;
          }
        }

        .el-checkbox__label {
          vertical-align: -2px;
          width: 100px;
          line-height: 14px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
</style>
