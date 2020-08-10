<template>
  <div class="page-add-store">
    <el-form
      ref="form"
      :rules="formRules"
      :model="form"
      label-width="120px">
      <div class="form-wrap">
        <el-form-item label="门店logo">
          <div
            class="img-uploader"
            @click="showMaterialSelector = true">
            <img
              v-if="form.logoUrl"
              :src="form.logoUrl"
              class="img" >
            <p
              v-else
              class="img-uploader-plus"><i class="icons el-icon-plus"/> 添加图片</p>
          </div>
          <p class="tip">建议尺寸为 160 x 160 像素</p>
        </el-form-item>
        <el-form-item label="门店编码">
          <el-input
            v-model="form.storeCode"
            :style="{width:inputWidth }" />
        </el-form-item>
        <el-form-item label="门店类型">
          <el-select
            :style="{width:inputWidth }"
            v-model="form.storeType"
            clearable
            placeholder="请选择门店类型">
            <el-option
              v-for="item in storeTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item
          prop="parentId"
          label="所属分公司">
          <el-select
            :disabled="!!form.id"
            :style="{width:inputWidth }"
            v-model="form.parentId"
            placeholder="请选择所属分公司">
            <el-option
              v-for="item in companyList"
              :key="item.id"
              :label="item.name"
              :value="Number(item.id)"/>
          </el-select>
        </el-form-item>
        <el-form-item
          label="门店名称"
          prop="name">
          <el-input
            :style="{width:inputWidth }"
            v-model="form.name" />
        </el-form-item>
        <el-form-item
          label="详细地址"
          prop="address">
          <div style="display: -webkit-box">
            <div>
              <el-input
                v-model="form.address"
                class="w500"
                maxlength="60"/>
            </div>
            <el-button
              class="ml10"
              type="primary"
              @click="getPlaceList">搜索地址</el-button>
          </div>
        </el-form-item>
        <el-form-item
          label="地图标注"
          prop="longitude">
          <div class="map-wrap">
            <div
              v-if="placeList.length > 0"
              class="place-wrap">
              <div class="map-search-result">
                <div
                  v-for="(item, index) in placeList"
                  :key="index"
                  class="map-search-list"
                  @click="setMarker(item)">
                  <p class="num">{{ index }}</p>
                  <p class="name">{{ item.title }}</p>
                  <p class="addr">{{ item.address }}</p>
                </div>
              </div>
            </div>
            <div
              id="container"
              class="map" />
            <div style="position: absolute; right: 0; top: -5px; z-index: 100;">
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-refresh"
                @click="refreshMap">刷新地图</el-button>
            </div>
          </div>
          <el-input
            v-model="form.longitude"
            style="height: 1px; width: 1px; overflow: hidden; line-height: 0;" />
        </el-form-item>
        <el-form-item label="门店负责人姓名">
          <el-input
            v-model="form.managerName"
            :style="{width:inputWidth }" />
        </el-form-item>
        <el-form-item
          label="门店负责人电话">
          <el-input
            :style="{width:inputWidth }"
            v-model="form.managerMobile"
          />
        </el-form-item>
      </div>

    </el-form>
    <div class="ui-edit-btn-wrapper">
      <el-button
        @click="$router.go(-1)">取消</el-button>
      <el-button
        :loading="saveIng"
        type="primary"
        @click="onSubmit">保存
      </el-button>
    </div>
    <material-selector
      :visible.sync="showMaterialSelector"
      :is-multi="false"
      @change="materialSelectorChanged" />
  </div>
</template>
<script>
import * as Validate from '@/utils/validate'
import MaterialSelector from '@/components/MaterialSelector'
import * as ApiStores from '@/api/stores'

export default {
  name: 'AddStore',
  components: {
    MaterialSelector
  },
  data () {
    return {
      showMaterialSelector: false,
      inputWidth: '300px',
      storeTypeList: [
        { value: 0, label: '直营店' },
        { value: 1, label: '加盟店' }
      ],
      form: {
        logoUrl: '',
        storeCode: '',
        storeType: 0,
        address: '',
        province: '',
        city: '',
        area: '',
        id: '',
        longitude: '',
        latitude: '',
        level: '',
        managerMobile: '',
        managerName: '',
        name: '',
        parentId: '',
        type: 0
      },
      formRules: {
        parentId: [
          { required: true, message: '请选择所属分公司', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入门店名称', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ],
        longitude: [
          { required: true, message: '请选择地图标注', trigger: 'blur' }
        ],
        managerMobile: [
          { validator: Validate.mobile, trigger: 'blur' }
        ]
      },
      saveIng: false,
      companyList: [],
      placeList: [],
      geolocationRegion: '',
      qqmap: null,
      markerArray: null,
      InfoWindowArray: null
    }
  },
  created () {
    this.getCompanyList()
    const id = this.$route.query.id || ''
    this.form.id = id
    this.form.parentId = Number(this.$route.query.parentId) || ''
    // id ? this.getInfo() : this.initMap()
    if (id) this.getInfo()
  },
  mounted () {
    if (!this.form.id) this.initMap()
  },
  methods: {
    refreshMap () {
      this.initMap()
    },
    setMarker (item) {
      this.markerArray && this.markerArray.setMap(null)
      this.InfoWindowArray && this.InfoWindowArray.close()

      var center = new window.qq.maps.LatLng(item.location.lat, item.location.lng)
      const marker = new window.qq.maps.Marker({ position: center, map: this.qqmap })
      const info = new window.qq.maps.InfoWindow({ map: this.qqmap })
      info.open()
      info.setContent(`<div style="text-align:left;white-space:nowrap; font-size: 12px; line-height: 20px;">
                        <p style="border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 5px;">${item.title}<br/>${item.address}</p>
                        <p class="set-addr" data-province="${item.province}" data-city="${item.city}" data-district="${item.district}" data-lat="${item.location.lat}" data-lng="${item.location.lng}" data-address="${item.address}" style="color: #38f; cursor: pointer; display: inline-block;">标注为门店地址</p>
                      </div>`)
      info.setPosition(center)
      this.qqmap.panTo(new window.qq.maps.LatLng(item.location.lat, item.location.lng))

      this.markerArray = marker
      this.InfoWindowArray = info
    },
    getPlaceList () {
      ApiStores.placeSearch({ keyword: this.form.address, region: this.geolocationRegion }).then((data) => {
        this.placeList = data || []
      })
    },
    getCompanyList () {
      ApiStores.getList2({ type: 1 }).then((data) => {
        this.companyList = data || []
      })
    },
    materialSelectorChanged (val) {
      this.form.logoUrl = val[0] && val[0].imgUrl
      this.showMaterialSelector = false
    },
    getInfo () {
      ApiStores.info({ id: this.form.id }).then((data) => {
        this.form = Object.assign(this.form, (data || {}))
        this.form.regionValue = [this.form.province, this.form.city, this.form.area]
        this.form.parentId = this.form.parentId > 0 ? this.form.parentId : ''
        setTimeout(() => {
          this.initMap()
        }, 1000)
      })
    },
    initMap () {
      const geolocation = new window.qq.maps.Geolocation('YXQBZ-2PDWQ-PO65B-GHH4L-2WKQH-OBF4W', 'myapp')
      geolocation.getIpLocation((position) => {
        this.geolocationRegion = position.city || ''
        this.qqmap = new window.qq.maps.Map(document.getElementById('container'), {
          center: new window.qq.maps.LatLng(position.lat, position.lng),
          zoom: 15,
          noClear: false,
          scaleControl: true
        })

        if (this.form.latitude) {
          const markersss = new window.qq.maps.Marker({
            position: new window.qq.maps.LatLng(this.form.latitude, this.form.longitude),
            map: this.qqmap
          })
          console.log(markersss)
          this.qqmap.panTo(new window.qq.maps.LatLng(this.form.latitude, this.form.longitude))
        }
        document.getElementById('container').addEventListener('click', (e) => {
          this.form.address = e.target.dataset.address || ''
          this.form.longitude = e.target.dataset.lng || ''
          this.form.latitude = e.target.dataset.lat || ''
          this.form.province = e.target.dataset.province || ''
          this.form.city = e.target.dataset.city || ''
          this.form.area = e.target.dataset.district || ''
        })
      })
    },
    onSubmit () {
      this.$refs['form'].validate((valid) => {
        if (!valid) return
        this.saveIng = true
        this.form.level = this.form.parentId ? 2 : 1
        ApiStores.storeAdd({ ...this.form }).then(({ code, message }) => {
          this.saveIng = false
          this.$message({ type: (code === 'SUCCESS' ? 'success' : 'error'), message: message })
          this.$router.go(-1)
        }, () => {
          this.saveIng = false
        })
      })
    }
  }
}
</script>

<style lang="scss">
  .page-add-store {
    .img-uploader {
      background: white;
      display: block;
      position: relative;
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      width: 160px;
      height: 160px;
      text-align: center;
      &:hover {
        border-color: #409EFF;
      }
      &-plus {
        width: 100%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 14px;
        color: #8c939d;
        .icons {
          font-size: 20px;
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
      }
      .img {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
      }
    }
    p {
      font-size: 12px;
    }
    .tip {
      color: #888888;
      line-height: 25px;
    }
    .form-wrap {
      background: white;
      border-radius: 5px;
      margin-bottom: 20px;
      padding: 20px;
    }
    .map-wrap {
      width: 100%;
      height: 500px;
      position: relative;
      border: 1px solid #ddd;
      box-sizing: border-box;
      .map {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 2;
      }
      .place-wrap {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 4;
        width: 199px;
        height: 100%;
        border-right: 1px solid #ccc;
        background: white;
        .map-search-result {
          height: 100%;
          overflow-y: auto;
          overflow-x: hidden;

          &::-webkit-scrollbar {
            width: 5px;
            height: 5px;
            display: block
          }

          &::-webkit-scrollbar-thumb {
            background-color: rgba(50,50,50,.3)
          }

          &::-webkit-scrollbar-thumb:hover {
            background-color: rgba(50,50,50,.6)
          }

          &::-webkit-scrollbar-track {
            background-color: rgba(50,50,50,.1)
          }

          &::-webkit-scrollbar-track:hover {
            background-color: rgba(50,50,50,.2)
          }
        }

        .map-search-list {
          padding-left: 30px;
          position: relative;
          padding-bottom: 5px;
          padding-top: 5px;
          border-bottom: 1px dashed #ccc;
          cursor: pointer;
          background: #fff;
          padding-right: 5px;
          box-sizing: border-box;
          &:hover {
            background: #f9f9f9
          }

          .name {
            line-height: 18px;
            font-size: 12px;
            font-weight: 700;
          }

          .addr {
            color: #888888;
            line-height: 14px;
            font-size: 12px;
          }

          .num {
            position: absolute;
            left: 3px;
            top: 5px;
            width: 24px;
            height: 36px;
            line-height: 24px;
            font-size: 12px;
            text-align: center;
            color: #fff;
            background: url(../../assets/images/marker.png) center no-repeat
          }
        }
      }
    }
  }
</style>
