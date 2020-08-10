<template>
  <div style="display: inline-block;">
    <!--<div style="display: inline-block;margin-right: 5px;">图片分类</div>-->
    <div style="display: inline-block;margin-right: 5px;">
      <el-select
        v-model="id"
        placeholder="请选择图片分类"
        @change="change">
        <el-option
          v-for="item in dataList"
          :key="item.id"
          :value="item.id"
          :label="item.name" />
      </el-select>
    </div>
  </div>
</template>

<script>
import * as ApiMaterial2 from '@/api/material2'

export default {
  name: 'MaterialCategory',
  data () {
    return {
      id: '',
      dataList: []
    }
  },
  created () {
    this.getList()
  },
  methods: {
    change () {
      this.$emit('change', this.id)
    },
    getList () {
      ApiMaterial2.getCategoryList().then(({ data }) => {
        this.dataList = data
      })
    }
  }
}
</script>

<style scoped>

</style>
