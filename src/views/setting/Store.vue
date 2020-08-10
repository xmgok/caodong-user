<template>
  <div class="goods-tag-container">
    <el-button
      type="primary"
      class="mb10"
      @click="editStore">添加门店
    </el-button>

    <el-table
      :data="listData">
      <el-table-column
        prop="name"
        label="门店名称"/>
      <el-table-column
        prop="address"
        label="地址"/>
      <el-table-column
        align="center"
        label="操作"
        width="100"
        fixed="right">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="text"
            @click="editStore(scope.row)">修改
          </el-button>
          <el-button
            size="small"
            type="text"
            @click="deleteStore(scope.row.id)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--添加标签-->
    <el-dialog
      :visible.sync="showDialog"
      :title="`${form.id ? '编辑': '添加'}门店`"
      width="400px"
      @close="closeDialog">
      <el-form
        ref="form"
        :model="form"
        :rules="rules">
        <el-form-item
          prop="name"
          label="门店名称"
          label-width="80px">
          <div class="store-name">
            <el-input v-model="form.name" />
          </div>
        </el-form-item>
        <el-form-item
          prop="address"
          label="门店地址"
          label-width="80px">
          <div class="store-name">
            <el-input v-model="form.address" />
          </div>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button
          type="primary"
          @click="save">保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as ApiStores from '@/api/stores'

export default {
  name: 'Store',
  data () {
    return {
      saveIng: false,
      form: {
        id: '',
        name: '',
        address: ''
      },
      rules: {
        name: [{ required: true, message: '请输入门店', trigger: 'blur' }],
        address: [{ required: true, message: '请输入门店地址', trigger: 'blur' }]
      },
      showDialog: false,
      listData: []
    }
  },
  mounted () {
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      ApiStores.getList().then((data = []) => {
        this.listData = data
      })
    },
    editStore (data) {
      this.form = {
        id: '',
        name: '',
        address: '',
        ...data
      }
      this.showDialog = true
    },
    deleteStore (id) {
      this.$confirm('确定删除吗?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
        ApiStores.storeDelete({ id }).then(({ code, message = '' }) => {
          this.$message({ type: 'success', message: message })
          if (code === 'SUCCESS') {
            this.getList()
          }
        }).catch(() => {})
      }).catch(() => {})
    },
    closeDialog () {
      this.showDialog = false
      this.$refs['form'].resetFields()
    },
    save () {
      this.$refs['form'].validate((valid) => {
        if (!valid) return
        this.saveIng = true
        ApiStores.storeAdd({ ...this.form }).then(({ code, message }) => {
          this.showDialog = false
          this.saveIng = false
          this.$message({ type: 'success', message: message })
          this.getList()
        }, () => {
          this.saveIng = false
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .store-name {
    display: flex;
    .word-limit {
      padding-left: 10px;
      width: 85px;
    }
  }
</style>
