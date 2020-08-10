<template>
  <div class="goods-tag-container">
    <el-button
      v-if="storeType <= 0"
      type="primary"
      class="mb10"
      @click="handleAdd">添加标签
    </el-button>

    <el-table
      v-loading="loading"
      :data="list">
      <el-table-column
        prop="name"
        label="标签名称">
        <template slot-scope="scope">
          <div
            v-if="scope.row.isEditing"
            class="name-wrap">
            <el-input
              v-model="scope.row.name"
              :maxlength="6"
              class="name-input" />
            <i
              class="icons el-icon-circle-close"
              @click="scope.row.isEditing = false; scope.row.name = scope.row.name_origin"/>
            <i
              class="icons el-icon-circle-check"
              @click="() => handleNameEdit(scope.row, scope.$index)"/>
          </div>
          <div
            v-else
            class="name-wrap">{{ scope.row.name }}
            <i
              v-if="storeType <= 0"
              class="icons el-icon-edit-outline"
              @click="() => nameFiledToEdit(scope.row)"/>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="更新时间"
        sortable
        align="center">
        <template slot-scope="scope">{{ scope.row.createTime | dateFormat }}</template>
      </el-table-column>
      <el-table-column
        v-if="storeType <= 0"
        align="center"
        label="操作"
        width="50"
        fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="handleRemove(scope.row.id)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--添加标签-->
    <el-dialog
      :visible.sync="dialogFormVisible"
      width="400px"
      title="添加标签">
      <el-form
        ref="form"
        :model="form"
        :rules="rules">
        <el-form-item
          prop="name"
          label="标签名称"
          label-width="80px">
          <div class="tag-name">
            <el-input
              v-model="form.name"
              :maxlength="6"/>
            <span class="word-limit">{{ form.name.length }}/6</span>
          </div>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          :loading="saveIng"
          type="primary"
          @click="submit">保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as ApiCustomer from '@/api/customer'

export default {
  name: 'GoodsTag',

  data () {
    return {
      saveIng: false,
      loading: false,
      list: [],
      dialogFormVisible: false,
      form: {
        name: ''
      },
      rules: {
        name: [{ required: true, message: '请输入标签名', trigger: 'blur' }]
      }
    }
  },

  computed: {
    storeType () {
      // storeType   门店类型 0总部 1分公司 2门店
      return this.$store.getters.userInfo.storeType
    }
  },

  created () {
    this.getList()
  },

  methods: {
    getList () {
      ApiCustomer.getLabelList().then(({ data }) => {
        this.list = data.map(item => {
          item.isEditing = false
          item.name_origin = item.name
          return item
        })
        this.loading = false
      })
    },
    handleAdd () {
      this.dialogFormVisible = true
      this.$refs.form && this.$refs.form.resetFields()
    },
    submit () {
      this.$refs.form.validate((valid) => {
        if (!valid) return false

        this.saveIng = true
        ApiCustomer.addLabel({ name: this.form.name }).then(({ message }) => {
          this.$message({ type: 'success', message })
          this.getList()
          this.dialogFormVisible = false
          this.saveIng = false
        }, () => {
          this.saveIng = false
        })
      })
    },
    handleRemove (id) {
      this.$confirm('是否删除该标签?', '提示').then(() => {
        ApiCustomer.delLabel({ id }).then(({ message }) => {
          this.$message({ type: 'success', message })
          this.dialogFormVisible = false
          this.getList()
        })
      }, () => {})
    },
    nameFiledToEdit (row) {
      this.list = this.list.map(item => {
        item.isEditing = false
        return item
      })
      row.isEditing = true
    },
    handleNameEdit (row, index) {
      ApiCustomer.updateLabel({ id: row.id, name: row.name }).then(({ message }) => {
        this.$message({ type: 'success', message })
        this.list[index].name_origin = row.name
        row.isEditing = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .tag-name {
    display: flex;
    .word-limit {
      padding-left: 10px;
      width: 85px;
    }
  }

  .name-wrap {
    .name-input {
      width: 150px;
    }

    &:hover {
      .el-icon-edit-outline {
        display: inline-block !important;
      }
    }
    .icons {
      margin-left: 5px;
      font-size: 16px;
      color: $--color-primary;
      vertical-align: -2px;
      cursor: pointer;
      &.el-icon-edit-outline {
        display: none;
      }
    }
  }
</style>
