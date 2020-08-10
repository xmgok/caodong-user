<template>
  <el-form
    ref="form"
    :model="form"
    :rules="rules"
    class="form"
    label-width="100px">
    <el-card>
      <div slot="header">项目详情</div>
      <el-form-item
        prop="name"
        label="项目名称">
        <el-input
          :disabled="see"
          v-model="form.name"
          :maxlength="30">
          <template slot="append">{{ form.name.length }}/30</template>
        </el-input>
      </el-form-item>
      <el-form-item
        prop="imgUrl"
        label="项目图片">
        <img
          v-if="form.imgUrl"
          :src="form.imgUrl"
          style="width: 375px; height: 190px; display: block;"
          @click="showMaterialSelector = true">
        <div
          v-if="!form.imgUrl"
          class="el-upload el-upload--picture-card"
          @click="showMaterialSelector = true">
          <i class="el-icon-plus" />
        </div>
        <p class="ui-color3 f12">建议尺寸为 750 x 380 像素</p>
      </el-form-item>
      <el-form-item
        prop="details"
        label="项目详情">
        <el-input
          :disabled="see"
          v-model="form.details"
          class="w500"
          rows="10"
          maxlength="240"
          type="textarea"/>
      </el-form-item>
      <el-form-item
        prop="price"
        label="项目价格">
        <el-input
          :disabled="see"
          v-model="form.price"
          class="w200">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-form-item
        prop="storeList"
        label="适用门店">
        <template v-if="storeListLength>0"><span class="f12 pr10">已选{{ storeListLength }}家门店</span></template>
        <!--已选门店可查看，所以不允许被禁用-->
        <el-button
          type="text"
          size="mini"
          @click="isShowStore=true">
          {{ storeListLength>0?'修改':'添加' }}门店
        </el-button>
      </el-form-item>
    </el-card>

    <div class="ui-edit-btn-wrapper">
      <el-button
        size="large"
        @click="$router.go(-1)">取消</el-button>
      <el-button
        :loading="submitting"
        type="primary"
        @click="submit">保存
      </el-button>
    </div>

    <!--门店选择，多选-->
    <select-store-tree
      :is-disabled-all="see"
      :visible.sync="isShowStore"
      :default-value="form.storeList"
      @confirm="confirmCheckedStore"
    />
    <!--图片库-->
    <material-selector
      :is-multi="false"
      :visible.sync="showMaterialSelector"
      @change="(val) => detailMaterialSelectorChanged(val)" />
  </el-form>
</template>

<script>
import * as Validate from '@/utils/validate'
import * as ApiAppointment from '@/api/appointment'
import SelectStoreTree from '@/components/SelectStoreTree'
import MaterialSelector from '@/components/MaterialSelector'

export default {
  name: 'AppointmentDetail',
  components: {
    MaterialSelector,
    SelectStoreTree
  },
  data () {
    return {
      form: {
        id: '',
        name: '',
        imgUrl: '',
        details: '',
        price: '',
        storeList: []
      },
      rules: {
        name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
        imgUrl: [{ required: true, message: '请上传项目图片', trigger: 'blur' }],
        price: [
          { required: true, message: '请填写项目价格', trigger: 'blur' },
          { validator: Validate.money, trigger: 'blur' }
        ],
        storeList: [{ required: true, message: '请选择适用门店', trigger: 'blur' }]
      },
      see: false,
      isShowStore: false,
      showMaterialSelector: false,
      submitting: false
    }
  },
  computed: {
    storeListLength () {
      return this.form.storeList.filter(v => v.type === 0).length
    }
  },
  created () {
    const id = this.$route.query.id || ''
    this.see = Boolean(this.$route.query.see) || false
    this.form.id = id
    id && this.getInfo()
  },
  mounted () {
  },
  methods: {
    detailMaterialSelectorChanged (val) {
      this.form.imgUrl = val[0].imgUrl
      this.showMaterialSelector = false
      this.$refs['form'].validateField(['imgUrl'])
    },
    confirmCheckedStore (data) {
      this.form.storeList = data
      this.$refs['form'].clearValidate()
    },
    getInfo () {
      ApiAppointment.info({ id: this.form.id }).then(res => {
        const data = res.data
        data._time = [data.startTime, data.endTime]
        data._productIds = [data.productId]
        this.specIds = (data.specIds && data.specIds.split(',')) || []
        this.form = data
      })
    },
    submit () {
      this.$refs['form'].validate((valid) => {
        if (!valid) return
        this.submitting = true
        ApiAppointment.save(this.form).then(({ code, message }) => {
          this.$message({ type: (code === 'SUCCESS' ? 'success' : 'error'), message: message })
          code === 'SUCCESS' && this.$router.go(-1)
          this.submitting = false
        }, () => { this.submitting = false })
      })
    }
  }
}
</script>

<style lang="scss">
</style>
