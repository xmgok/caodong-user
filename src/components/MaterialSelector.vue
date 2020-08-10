<template>
  <div class="component-material-selector">
    <el-dialog
      :visible.sync="visible"
      :before-close="close"
      :title="type === 'video' ? '选择视频' : '选择图片'"
      append-to-body
      custom-class="dialog-material-selector"
      width="1120px">
      <template v-if="type == 'video'">
        <el-form
          :inline="true"
          :model="form"
          class="demo-form-inline fr">
          <el-form-item>
            <el-input
              v-model="form.title"
              placeholder="请输入视频名称">
              <el-button
                slot="append"
                class="btn-search"
                type="primary"
                icon="el-icon-search"
                @click="getList()"
              >搜索
              </el-button>
            </el-input>
          </el-form-item>
        </el-form>
        <file-upload
          :max-size="50"
          :disabled="loading"
          type="video"
          @before-upload="beforeUpload"
          @on-success="uploadSuccess">
          <el-button
            :disabled="loading"
            :loading="loading"
            type="primary"
            icon="el-icon-upload">{{ loading ? '视频上传中' : '上传视频' }}
          </el-button>
        </file-upload>
        <div class="grey mt5">限制大小：50M以下</div><!--上传时超了会弹窗提示-->
      </template>
      <template v-else>
        <div>
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
                  :disabled="loading"
                  :loading="loading"
                  type="primary"
                  icon="el-icon-upload">{{ loading ? '图片上传中' : '上传图片' }}
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
                  style="width: 134px;"
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
            <div class="flex">
              <div @click="goMaterial">
                <el-button
                  type="text"
                  size="mini">管理素材
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </template>

      <div class="flex">
        <el-checkbox
          v-if="isMulti"
          v-model="isSelectAll"
          class="checkbox-reset"
          @change="selectAllChanged">全选
        </el-checkbox>
      </div>
      <div
        v-loading="loading"
        style="clear: both;"
        class="list-wrap">
        <div
          v-for="(item, index) in imgList"
          :key="item.index"
          class="img-item">
          <div
            :style="{backgroundImage: `url(${item.imgUrl})`}"
            class="img"
            @click="itemClick(item, index)" />
          <div class="pt10">
            <el-checkbox
              v-if="isMulti"
              v-model="item.checked"
              @change="() => checkChanged(item, index)">{{ item.imgName || item.key }}
            </el-checkbox>
            <el-radio
              v-else
              v-model="checked"
              :label="item.id"
              @change="() => checkChanged(item, index)">{{ item.imgName || item.key }}
            </el-radio>
          </div>
        </div>

        <div
          class="g-pagination-wrap p0">
          <el-pagination
            :current-page="pagination.page"
            :page-sizes="[12, 24, 36, 48, 120]"
            :page-size="pagination.size"
            :total="pagination.total"
            :layout="$store.state.app.layout"
            @size-change="sizeChange"
            @current-change="handleCurrentChange" />
        </div>
      </div>

      <div
        slot="footer"
        class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button
          type="primary"
          @click="submit">确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Vue from 'vue'
import ApiMaterial from '@/api/material'
import FileUpload from '@/components/FileUpload'
import MaterialCategory from '@/components/MaterialCategory'

const UPLOAD_TYPES = { image: 1, video: 2, imageAndVideo: '' }

export default {
  name: 'MaterialSelector',

  components: { FileUpload, MaterialCategory },

  props: {
    whenShowClearSelected: {
      type: Boolean,
      default: false
    },
    visible: {
      type: Boolean,
      default: false
    },
    isMulti: {
      type: Boolean,
      default: true
    },
    source: {
      type: String,
      default: '' // goods or ''
    },
    productId: {
      type: [String, Number],
      default: ''
    },
    defaultValue: {
      type: Array,
      default: () => []
    },
    // 文件上传类型：1(image) 图片；2(video) 视屏；空字符串：皆可
    type: {
      type: String,
      default: 'image',
      validator: function (value) {
        return ['image', 'video', 'imageAndVideo'].indexOf(value) !== -1
      }
    }
  },

  data () {
    return {
      imgName: '',
      categoryIdUpload: '',
      categoryIdSearch: '',
      checked: '',
      imgList: [],
      isSelectAll: false,
      selected: [],
      pagination: {
        total: 0,
        page: 1,
        size: 12
      },
      loading: false,
      form: {
        title: ''
      }
    }
  },

  watch: {
    visible (val) {
      if (val) {
        if (this.whenShowClearSelected) { // 修复，活动页，活动入口选完图，活动详情选图时，内部却已默认选中，但是又提示需要选中图片。
          this.checked = ''
          this.selected = []
        }
        this.getList()
      }
    },
    defaultValue () {
      this.fnResetSelected()
    }
  },

  methods: {
    search () {
      // 处理翻页全选不正常
      this.checked = ''
      this.isSelectAll = false
      this.selected = []
      this.getList()
    },
    materialCategoryChange (id, type) {
      this[type] = id
    },
    getList () {
      const params = {
        imgName: this.imgName || this.form.title,
        labelId: this.categoryIdSearch,
        type: UPLOAD_TYPES[this.type],
        pageNum: this.pagination.page,
        pageSize: this.pagination.size
      }
      const isAttachToGoods = this.source === 'goods'
      if (isAttachToGoods && this.productId) {
        params.productId = this.productId
      }

      ApiMaterial[`${isAttachToGoods ? 'getListUnRelated' : 'getList'}`](params)
        .then(({ data = {} }) => {
          this.pagination.total = data.totalCount
          this.imgList = (data.dataList || []).map((item) => {
            item.checked = false

            // 处理视屏占位图
            if (item.type === 2) item.imgUrl += '?vframe/jpg/offset/2'

            // 处理无图片名的情况
            const imgUrlSplit = item.imgUrl.split('/')
            item.key = imgUrlSplit[imgUrlSplit.length - 1]
            return item
          })

          this.selectDefault()
        })
    },
    // 设置默认选中
    selectDefault () {
      this.fnDefaultListSelected() // 根据默认项反推列表中选中的项
      this.fnImgListSelected() // 根据被选中的项反推列表中选中的项
      this.isSelectAll = this.imgList.filter(v => v.checked).length === this.pagination.size
    },
    // 全选/反选
    selectAllChanged (val) {
      this.imgList = this.imgList.map((item) => {
        item.checked = val
        return item
      })
      this.multiGetSelected() // 多选获取被选中的项
      this.fnUniqueSelected() // 去重
      this.multiDelSelected() // 多选移除没被选中的项
    },
    itemClick (item, index, flag) {
      if (this.isMulti) {
        // NOTE 点击单选框时其内部会自动变更绑定值

        if (!flag) {
          item.checked = !item.checked
        }

        Vue.set(this.imgList, index, item)
        this.multiGetSelected() // 多选获取被选中的项
        this.fnUniqueSelected() // 去重
        this.multiDelSelected() // 多选移除没被选中的项
      } else {
        this.checked = item.id
        item.checked = true
        this.selected = [item]
      }
    },
    fnResetSelected () { // 被选中的项保持和默认项一致。
      const arr = []
      this.defaultValue.forEach(v => {
        const obj = this.selected.find(item => +item.id === +v.id)
        if (obj) {
          arr.push(obj)
        } else {
          arr.push(v)
        }
      })
      this.selected = arr
    },
    fnDefaultListSelected () { // 根据默认项反推列表中选中的项
      const ids = this.defaultValue.map(i => i.id)
      this.imgList = this.imgList.map((item) => {
        item.checked = ids.includes(item.id)
        return item
      })
    },
    fnImgListSelected () { // 根据被选中的项反推列表中选中的项
      const ids = this.selected.map(i => i.id)
      this.imgList = this.imgList.map((item) => {
        item.checked = ids.includes(item.id)
        return item
      })
    },
    fnUniqueSelected () { // 去重
      const uniqueSelected = []
      this.selected.forEach(item => {
        if (!uniqueSelected.find(i => +i.id === +item.id)) {
          uniqueSelected.push(item)
        }
      })
      this.selected = uniqueSelected
    },
    multiGetSelected () { // 多选获取被选中的项
      this.selected = this.selected.concat(this.imgList.filter(i => i.checked))
    },
    multiDelSelected () { // 多选移除没被选中的项
      this.imgList.filter(i => !i.checked).forEach(item => {
        const index = this.selected.findIndex(i => +i.id === +item.id)
        if (index !== -1) {
          this.selected.splice(index, 1)
        }
      })
    },
    checkChanged (item, index) {
      this.itemClick(item, index, true)
    },
    sizeChange (e) {
      this.pagination.size = e
      this.checked = ''
      this.isSelectAll = false
      this.getList()
    },
    handleCurrentChange (val) {
      this.pagination.page = val
      this.checked = ''
      this.isSelectAll = false
      this.getList()
    },
    close () {
      this.$emit('update:visible', false)
      this.form.title = ''
    },
    beforeUpload ({ result }) {
      if (result) this.loading = true
    },
    uploadSuccess () {
      this.loading = false
      this.getList()
    },
    submit () {
      if (!this.selected.length) {
        this.$message({ type: 'warning', message: `请选择${this.type === 'video' ? '视频' : '图片'}` })
        return
      }
      if (this.type === 'video') {
        this.selected = this.selected.map((item) => {
          item.imgUrl = item.imgUrl.replace('?vframe/jpg/offset/2', '')
          return item
        })
      }
      this.$emit('change', this.selected)
      // this.close()
    },
    goMaterial () {
      this.$confirm('即将跳转至素材管理页面，本页面修改的信息将无法保存，确定离开本页面吗？', '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.$router.push('/brand/material')
      }).catch(() => {
      })
    }
  }
}
</script>

<style lang="scss">
  .dialog-material-selector {
    .el-radio__label,
    .el-checkbox__label {
      display: inline-block;
      vertical-align: -2px;
      width: 145px;
      line-height: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
</style>

<style lang="scss" scoped>
  .space-between {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .list-wrap {
    font-size: 0;
    padding-top: 20px;

    .img-item {
      vertical-align: top;
      display: inline-block;
      width: 160px;
      position: relative;
      margin-right: 20px;
      margin-bottom: 20px;
      cursor: pointer;

      .img {
        width: 160px;
        height: 160px;
        background: #f5f5f5 no-repeat center;
        background-size: cover;
      }
    }
  }
</style>
