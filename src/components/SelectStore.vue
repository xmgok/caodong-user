<!--商品选择器-->
<template>
  <div class="component-select-store">
    <el-form
      v-if="storeType < 2"
      :inline="true"
      :label-width="labelwidth">
      <el-form-item
        v-if="storeType <= 0"
        label="分公司">
        <el-select
          :size="size"
          :disabled="disabled"
          :style="{width: selectwidth}"
          v-model="companyId"
          clearable
          placeholder="请选择"
          @change="changeCompany">
          <el-option
            v-for="item in companyList"
            :disabled="item.disabled"
            :key="item.id"
            :label="item.name"
            :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item
        label="门店">
        <el-select
          :size="size"
          :disabled="disabled"
          :style="{width: selectwidth}"
          v-model="storeId"
          clearable
          placeholder="请选择"
          @change="changeStore">
          <el-option
            v-for="item in storeList"
            :disabled="item.disabled"
            :key="item.id"
            :label="item.name"
            :value="item.id" />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import * as ApiStores from '@/api/stores'

export default {
  name: 'SelectStore',

  props: {
    size: {
      type: String,
      default: ''
    },
    isOpenDefaultValue: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    defaultCompanyId: {
      type: [Number, String],
      default: ''
    },
    defaultStoreId: {
      type: [Number, String],
      default: ''
    },
    labelwidth: {
      type: String,
      default: '120px'
    },
    selectwidth: {
      type: String,
      default: '179px'
    }
  },

  data () {
    return {
      storeList: [],
      companyList: [],
      storeId: '',
      companyId: ''
    }
  },

  computed: {
    storeType () {
      // storeType   门店类型 0总部 1分公司 2门店
      return this.$store.getters.userInfo.storeType
    }
  },

  watch: {
    defaultCompanyId (newVal) {
      if (this.isOpenDefaultValue && newVal) {
        this.companyId = +newVal
        this.getSysuserStore(this.companyId)
      }
    },
    defaultStoreId (newVal) {
      if (this.isOpenDefaultValue && this.companyId && newVal) {
        this.storeId = +newVal
      }
    }
  },

  created () {
    this.getSysuserStore()
  },

  methods: {
    changeStore () {
      this.emit()
    },
    changeCompany (val) {
      this.storeId = ''
      this.storeList = []
      if (!this.isOpenDefaultValue) {
        this.getSysuserStore(val)
      }
      this.emit()
    },
    getSysuserStore (val) {
      ApiStores.getSysuserStore({ storeId: val }).then(({ data }) => {
        this[val ? 'storeList' : 'companyList'] = data || []
        if (this.storeType === 1) {
          this.storeList = data || []
        }
      })
    },
    emit () {
      let params = {
        companyId: this.companyId,
        storeId: this.storeId
      }

      const xx = this.companyList.filter((item) => (item.id === params.companyId && item.type <= 0))
      if (xx.length > 0) {
        params.storeId = params.companyId
        params.companyId = ''
      }
      this.$emit('change', params)
    }
  }
}
</script>

<style lang="scss">
  .component-select-store {
    .el-form-item--medium {
      margin-bottom: 0;
    }
  }
</style>
