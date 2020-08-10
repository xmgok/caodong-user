<template>
  <div class="page-booking">
    <el-card>
      <el-form
        ref="form"
        :rules="rules"
        :model="form"
        class="form"
        label-width="100px">
        <el-form-item
          label="启用预约"
          prop="status">
          <el-radio-group
            v-model="form.status">
            <el-radio
              :label="0">禁用
            </el-radio>
            <el-radio
              :label="1">启用
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          prop="storeList"
          label="适用门店">
          <template v-if="storeListLength>0"><span class="pr10 f12">已选{{ storeListLength }}家门店</span></template>
          <!--已选门店可查看，所以不允许被禁用-->
          <el-button
            type="text"
            size="mini"
            @click="isShowStore=true">
            {{ storeListLength>0?'修改':'添加' }}门店
          </el-button>
        </el-form-item>
        <el-form-item
          label="预约时间"
          prop="_time">
          <el-time-picker
            v-model="form._time"
            style="width: 400px;"
            value-format="yyyy-MM-dd HH:mm"
            format="HH:mm"
            is-range
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围" />
        </el-form-item>
        <el-form-item
          label="预约门店"
          prop="integral">
          <el-radio-group
            v-model="form.type">
            <div>
              <el-radio
                :label="1"
                class="mt10">
                <span>固定门店</span>
                <span class="grey ml10">消费者仅能预约当前小程序进入的门店</span>
              </el-radio>
            </div>
            <div>
              <el-radio
                :label="2"
                class="mt10">
                <span>自选门店</span>
                <span class="grey ml10">消费者可预约其他门店</span>
              </el-radio>
            </div>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          ref="topImgForm"
          label="活动入口"
          prop="topImg">
          <el-checkbox
            v-model="form.isTop"
            :true-label="1"
            :false-label="0">首页弹窗
          </el-checkbox>
          <div
            class="ui-img-uploader"
            @click="materialSelector()">
            <img
              v-if="form.topImg"
              :src="form.topImg"
              class="img">
            <p
              v-else
              class="ui-img-uploader-plus"><i class="icons el-icon-plus" /> 添加图片</p>
          </div>
          <p class="ui-color3 f12">建议尺寸为 600 x 800 像素</p>
        </el-form-item>
      </el-form>
    </el-card>

    <div class="ui-edit-btn-wrapper">
      <el-button
        :loading="submitting"
        type="primary"
        @click="submit">保存
      </el-button>
    </div>

    <material-selector
      :when-show-clear-selected="true"
      :visible.sync="showMaterialSelector"
      :is-multi="false"
      @change="materialSelectorChanged" />
    <!--门店选择，多选-->
    <select-store-tree
      :visible.sync="isShowStore"
      :default-value="form.storeList"
      @confirm="confirmCheckedStore"
    />
  </div>
</template>

<script>
import * as ApiBooking from '@/api/booking'
// import * as Utils from '@/utils/index'
import MaterialSelector from '@/components/MaterialSelector'
import SelectStoreTree from '@/components/SelectStoreTree'

export default {
  name: 'Booking',
  components: {
    SelectStoreTree,
    MaterialSelector
  },
  data () {
    return {
      isShowStore: false,
      showMaterialSelector: false,
      form: {
        id: '',
        status: 0, // 0禁用 1启用
        storeList: [],
        _time: ['2016-10-10 00:00:00', '2016-10-10 23:59:59'],
        beginTime: '',
        endTime: '',
        type: 1, // 1固定门店 2自选门店
        isTop: 0, // 首页弹窗 0否 1是 ,
        topImg: '' // 弹窗图片地址
      },
      submitting: false,
      rules: {
        _time: [{ required: true, message: '请选择预约时间', trigger: 'blur' }],
        storeList: [{ required: true, message: '请选择适用门店', trigger: 'blur' }],
        topImg: [
          { required: true, message: '请上传活动入口图片', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    storeListLength () {
      return this.form.storeList.filter(v => v.type === 0).length
    }
  },
  async created () {
    this.getDetail()
  },
  methods: {
    confirmCheckedStore (data) {
      this.form.storeList = data
      this.$refs['form'].validateField(['storeList'])
    },
    materialSelector () {
      this.showMaterialSelector = true
    },
    materialSelectorChanged (val) {
      this.form.topImg = val[0] && val[0].imgUrl
      this.$refs[`form`].clearValidate()
      this.showMaterialSelector = false
    },
    async getDetail () {
      const res = await ApiBooking.info().catch(() => false)
      if (!res) return
      const data = res.data
      if (!data.beginTime) return
      data._time = [`2016-10-10 ${data.beginTime}:00`, `2016-10-10 ${data.endTime}:59`]
      this.form = data
    },
    submit () {
      this.$refs.form.validate(async valid => {
        if (!valid) return
        this.submitting = true
        this.form.beginTime = this.form._time[0].substring(11, 16) || '00:00'
        this.form.endTime = this.form._time[1].substring(11, 16) || '23:59'
        const res = await ApiBooking.save(this.form).catch(() => (this.submitting = false))
        if (!res) return
        this.submitting = false
        this.$message.success('操作成功')
      })
    }
  }
}
</script>

<style lang="scss">
  .page-booking {
  }
</style>
