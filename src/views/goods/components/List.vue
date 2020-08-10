<template>
  <div>
    <div style="display: -webkit-box; -webkit-box-pack: justify;">
      <div>&nbsp;</div>
      <el-input
        v-model="search.productCode"
        size="small"
        placeholder="输入商品编码查询"
        class="">
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="searchFn" />
      </el-input>
    </div>
    <el-table
      :data="dataList"
      class="mt20">
      <el-table-column
        :show-overflow-tooltip="true"
        label="商品信息"
        width="300"
        align="center">
        <template slot-scope="{row}">
          <div
            class="goods">
            <div class="goods-content">
              <div class="goods-content-name">
                <div class="goods-label">商品名称：</div>
                <div>{{ row.productName }}</div>
              </div>
              <div class="goods-content-spec">
                <div class="goods-label">商品编码：</div>
                <div>{{ row.productCode }}</div>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        label="评星"
        width="200"
        align="center">
        <template slot-scope="{row}">
          <div class="star-icon">
            <span
              v-for="(item,index) in row.starArr"
              :key="index"
              :class="[row.star>index?'active':'']"
              class="icon icon-pingjiawuxing item" />
          </div>
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        label="评价内容"
        width="200"
        align="center">
        <template
          slot-scope="{row}">
          {{ row.content || '用户没有填写内容' }}
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        label="评价图片"
        align="center">
        <template slot-scope="{row}">
          <div v-if="row.imgCount <= 0">用户没有上传图片</div>
          <img
            v-else
            :src="imgUrl(row)"
            class="comment-img"
            alt=""
            @click="previewImage(0, row.imgUrlArr)">
          <template v-if="row.imgCount>0">
            <span class="comment-img-span">x{{ row.imgCount }}</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        label="评价人"
        align="center">
        <template slot-scope="{row}">
          {{ row.nickName || '匿名' }}
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        label="手机号"
        width="110"
        align="center">
        <template slot-scope="{row}">
          {{ row.userMobile || '' }}
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        label="评价时间"
        align="center">
        <template slot-scope="{row}">
          {{ row.createTime }}
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        label="是否展示"
        align="center">
        <template slot-scope="{row}">
          <el-switch
            v-model="row.isShow"
            :active-value="1"
            :inactive-value="0"
            @change="changeStatus(row, row.isShow)" />
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        width="120"
        align="center">
        <template slot-scope="{row}">
          <el-button
            v-if="!row.isTop"
            type="text"
            size="small"
            @click="toTop(row, 1)">置顶
          </el-button>
          <el-button
            v-else
            type="text"
            size="small"
            @click="toTop(row, 0)">取消置顶
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="g-pagination-wrap">
      <el-pagination
        :current-page="search.pageNum"
        :page-sizes="$store.state.app.pageSizes"
        :page-size="search.pageSize"
        :total="search.totalCount"
        :layout="$store.state.app.layout"
        @size-change="sizeChange"
        @current-change="pageChange" />
    </div>
    <el-dialog
      :visible.sync="showPreviewImage"
      width="800px"
      title="预览图片"
      @close="showPreviewImage = false">
      <div
        v-if="imgUrlArr.length==1"
        class="comment-preview-img-wrap">
        <img
          :src="imgUrlArr[0]"
          class="comment-preview-img"
          alt="">
      </div>
      <el-carousel
        v-else
        :interval="6000"
        style="overflow: hidden;"
        trigger="click"
        height="400px">
        <el-carousel-item
          v-for="item in imgUrlArr"
          :key="item">
          <div class="comment-preview-img-wrap">
            <img
              :src="item"
              class="comment-preview-img"
              alt="">
          </div>
        </el-carousel-item>
      </el-carousel>
    </el-dialog>
  </div>
</template>

<script>
import * as ApiComment from '@/api/comment'

export default {
  props: {
    type: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      showPreviewImage: false,
      imgUrlArr: [],
      search: {
        productCode: '',
        pageNum: 1,
        totalCount: 0,
        pageSize: 10
      },
      dataList: []
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    previewImage (current, urls) {
      this.imgUrlArr = urls
      this.showPreviewImage = true
    },
    toTop (row, type) {
      this.$confirm(`${type === 1 ? '确定将本条评价设置为置顶吗？' : '确定对本条评价取消置顶吗？'}`, '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        ApiComment.update({
          productId: row.productId,
          id: row.id,
          isShow: row.isShow,
          isTop: type
        }).then(({ message }) => {
          this.getList()
        })
      }).catch(() => {
      })
    },
    imgUrl (row) {
      const imgUrl = (row.imgUrl || '').split(',')
      const first = imgUrl[0]
      return first || ''
    },
    getList () {
      ApiComment.list({
        ...this.search,
        type: this.type
      }).then(({ data }) => {
        this.dataList = data.dataList || []
        this.search.totalCount = data.totalCount || 0
      })
    },
    sizeChange (e) {
      this.search.pageSize = e
      this.getList()
    },
    pageChange (e) {
      this.search.pageNum = e
      this.getList()
    },
    searchFn () {
      this.search.pageNum = 1
      this.getList()
    },
    changeStatus (row, status) {
      status = status ? 1 : 0
      ApiComment.update({
        id: row.id,
        isShow: status,
        isTop: row.isTop,
        productId: row.productId
      }).then(({ message }) => {
        this.$message({ type: 'success', message: message })
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .star-icon {
    display: inline-flex;
    align-items: center;
    margin-top: 8px;
    margin-bottom: 10px;

    .item {
      font-size: 14px;
      margin: 0 2px;
      color: #dcdcdc;

      &.active {
        color: #f49017;
      }
    }
  }

  .comment-img {
    width: 50px;
    height: 50px;
    cursor: pointer;
    vertical-align: bottom;
  }

  .comment-img-span {
    margin-left: 5px;
    line-height: 1;
    vertical-align: bottom;
  }

  .comment-preview-img-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .comment-preview-img {
    max-width: 100%;
    max-height: 100%;
  }

  .goods {
    display: flex;
    font-size: 12px;
    line-height: 1;

    .goods-img {
      min-width: 50px;
      width: 50px;
      height: 50px;
    }

    .goods-label {
      font-weight: bold;
    }

    .goods-content {
      margin-left: 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .goods-content-name {
      display: flex;
      margin-bottom: 5px;
    }

    .goods-content-spec {
      display: flex;
      flex-wrap: wrap;
    }

    .goods-content-spec-item {
      margin-right: 10px;
      margin-bottom: 10px;
    }
  }

  .qr-img {
    width: 174px;
    height: 174px;
    margin: 0 auto;
    display: block;
  }
</style>
