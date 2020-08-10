<!-- 面包屑，从路由自动生成 -->
<template>
  <el-upload
    :accept="fileAccept"
    :show-file-list="false"
    :on-success="handleFileUploadSuccess"
    :before-upload="beforeFileUpload"
    :data="upload"
    :multiple="multiple"
    :limit="limit"
    :on-exceed="handleExceed"
    action="//upload.qiniup.com">
    <slot/>
  </el-upload>
</template>

<script>
import Cookies from 'js-cookie'
import * as ApiCommon from '@/api/common'
import ApiMaterial from '@/api/material'

const IMAGE_MIME_TYPE = ['image/jpeg', 'image/png', 'image/gif']
const VIDEO_MIME_TYPE = ['video/mp4', 'video/webm']

export default {
  name: 'FileUpload',

  props: {
    categoryId: {
      type: [String, Number],
      default: '' // 分类id
    },
    type: {
      type: String,
      default: 'image' // video
    },
    // 单文件大小限制（默认2M）
    maxSize: {
      type: Number,
      default: 2 // M
    },
    // 是否支持多选文件
    multiple: {
      type: Boolean,
      default: false
    },
    // 最大允许上传个数
    limit: {
      type: Number,
      default: 350
    }
  },

  data () {
    return {
      upload: {
        token: '',
        domain: '',
        key: '',
        name: ''
      },
      // 多文件上传时存放key: name映射，避免取到同一个name
      fileKeyList: []
    }
  },

  computed: {
    fileAccept () {
      return this.type === 'image' ? IMAGE_MIME_TYPE.join() : VIDEO_MIME_TYPE.join()
    }
  },

  methods: {
    handleFileUploadSuccess (res, file, fileList) {
      // console.log(res)
      // console.log(fileList)
      // 是否所有文件已上传完毕
      // const isUploadCompleted = fileList.every(i => !!i.response)
      // if (!isUploadCompleted) return

      // 批量保存素材
      ApiMaterial.add({
        materialBatchDTOList: [{
          labelId: this.categoryId,
          imgName: file.name,
          imgUrl: `${this.upload.domain}/${file.response.key}`,
          type: this.type === 'image' ? 1 : 2,
          tag: ''
        }]
        // materialBatchDTOList: fileList.map(item => {
        //   return {
        //     imgName: item.name,
        //     imgUrl: `${this.upload.domain}/${item.response.key}`,
        //     type: this.type === 'image' ? 1 : 2,
        //     tag: ''
        //   }
        // })
      }).then(({ message }) => {
        this.$message.success(message)
        this.$emit('on-success', { type: this.type })
      })
    },
    // handleFileUploadSuccess (res, file, fileList) {
    //   // 是否所有文件已上传完毕
    //   const isUploadCompleted = fileList.every(i => !!i.response)
    //   if (!isUploadCompleted) return
    //
    //   // 批量保存素材
    //   ApiMaterial.add({
    //     materialBatchDTOList: fileList.map(item => {
    //       return {
    //         imgName: item.name,
    //         imgUrl: `${this.upload.domain}/${item.response.key}`,
    //         type: this.type === 'image' ? 1 : 2,
    //         tag: ''
    //       }
    //     })
    //   }).then(({ message }) => {
    //     this.$message.success(message)
    //     this.$emit('on-success', { type: this.type })
    //   })
    // },
    beforeFileUpload (file) {
      const emitBeforeUpload = (result) => this.$emit('before-upload', { result, type: this.type })

      return new Promise((resolve, reject) => {
        ApiCommon.getQiniuToken().then(({ data }) => {
          const { uptoken, domain } = data
          this.upload.token = uptoken
          this.upload.domain = domain
          if (!uptoken) {
            emitBeforeUpload(false)
            reject(new Error('Token is required!'))
            return
          }

          // 重命名文件名
          const suffix = file.name.split('.')
          const ext = suffix.splice(suffix.length - 1, 1)[0]
          // file.key = `${this.type}/${new Date().getTime()}_${String(Math.random()).substr(10)}_${file.name.replace(/[\u4e00-\u9fa5() ]/g, '')}.${ext}`
          const tenantId = Cookies.get('tenantId') || ''
          file.key = `${this.type}/${tenantId ? tenantId + '_' : ''}${new Date().getTime()}_${String(Math.random()).substr(10)}.${ext}`
          this.upload.key = file.key
          this.upload.name = file.name
          this.fileKeyList.push({
            key: file.key,
            name: file.name
          })

          // 格式限制（因为传了accept参数，这里实际上会始终满足限制）
          let errMsg = ''
          let mineTypeList = this.type === 'image' ? IMAGE_MIME_TYPE : VIDEO_MIME_TYPE
          const typeText = this.type === 'image' ? '图片' : '视屏'
          if (!~mineTypeList.indexOf(file.type)) {
            errMsg = `上传${typeText}必须是 ${(this.type === 'image' ? IMAGE_MIME_TYPE : VIDEO_MIME_TYPE).map(i => i.split('/')[1]).join('/')} 格式!`
            this.$message.error(errMsg)
            emitBeforeUpload(false)
            reject(new Error(errMsg))
            return
          }

          // 大小限制
          const isLtLimitSize = file.size / 1024 / 1024 < this.maxSize
          errMsg = `上传${typeText}大小不能超过 ${this.maxSize}MB!`
          if (!isLtLimitSize) {
            this.$message.error(errMsg)
            emitBeforeUpload(false)
            reject(new Error(errMsg))
            return
          }

          emitBeforeUpload(true)
          resolve()
        })
      })
    },
    handleExceed () {
      this.$message.warning(`单次上传不可超过${this.limit}张，请重新选择`)
    }
  }
}
</script>

<style lang="scss">
</style>
