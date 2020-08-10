<template>
  <div class="page-add-role">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="80px">
      <p class="hd-title">角色信息</p>
      <div class="set-item">
        <el-form-item
          label="角色名称"
          prop="name">
          <el-input
            v-model="ruleForm.name"
            placeholder="请输入您专属的角色名称"
            style="width: 500px;"/>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input
            v-model="ruleForm.description"
            maxlength="100"
            type="textarea"
            rows="4"
            placeholder="请输入您对专属角色的描述"
            style="width: 500px;"/>
        </el-form-item>
      </div>
      <p class="hd-title">角色权限选择</p>

      <div>
        <div
          v-for="(item, index) in permlist"
          :key="item.name"
          class="set-item pb10 mb10">
          <div class="pb10">
            <el-checkbox
              v-model="item.checked"
              @change="changeParent(index)"><span style="font-weight: bold;">{{ item.name }}</span></el-checkbox>
          </div>
          <div class="limit-wrap">
            <div
              v-for="itemItem in item.list"
              :key="itemItem.name"
              class="item"><el-checkbox
                v-model="itemItem.checked"
                @change="changeSon(index)">{{ itemItem.name }}</el-checkbox></div>
          </div>
        </div>
      </div>

      <!--
            <div
              v-for="(item, index) in limitList"
              :key="item.name"
              class="set-item pb10 mb10">
              <el-checkbox
                v-model="item.checked"
                @change="changeParent(index)">{{ item.name }}</el-checkbox>
              <div class="limit-wrap">
                <div
                  v-for="itemItem in item.childItem"
                  :key="itemItem.name"
                  class="item"><el-checkbox
                    v-model="itemItem.checked"
                    @change="changeSon(index)">{{ itemItem.name }}</el-checkbox></div>
              </div>
            </div>
      -->
    </el-form>

    <div class="ui-edit-btn-wrapper">
      <el-button
        @click="$router.go(-1)">取消</el-button>
      <el-button
        :disabled="saveIng"
        type="primary"
        @click="onSubmit">保存
      </el-button>
    </div>
  </div>
</template>

<script>
import * as ApiRole from '@/api/role'
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'RoleEdit',
  data () {
    return {
      ruleForm: {
        name: '',
        description: '',
        id: '',
        permIds: []
      },
      saveIng: false,
      rules: {
        name: [
          { required: true, message: '请输入您专属的角色名称', trigger: 'blur' },
          { max: 8, message: '最多8个字', trigger: 'blur' }
        ]
      },
      permlist: []
    }
  },

  computed: {
    ...mapGetters(['breadcrumb'])
  },

  mounted () {
    const id = this.$route.query.id || ''
    this.SET_BREADCRUMB({ index: this.breadcrumb.length - 1, title: id ? '编辑角色' : '创建新角色' })
    ApiRole.getPermlist().then(({ data }) => {
      this.permlist = this.setDefault(data)
      if (id) {
        ApiRole.getRoleInfo({ id }).then(({ data = {} }) => {
          this.ruleForm = Object.assign(this.ruleForm, data)
          this.setChecked(this.permlist)
        })
      }
    })
  },

  methods: {
    ...mapMutations(['SET_BREADCRUMB']),
    setDefault (data) {
      return (data || []).map((item) => {
        item.checked = false
        if (item.list) this.setDefault(item.list)
        return item
      })
    },
    setChecked (data = []) {
      data.forEach((item) => {
        if (this.ruleForm.permIds.indexOf(item.id) > -1) {
          item.checked = true
        }
        if (item.list) {
          this.setChecked(item.list)
        }
      })
    },
    changeParent (index) {
      let permlist = this.permlist[index]
      if (!permlist.list) return
      permlist.list = permlist.list.map((item) => {
        item.checked = permlist.checked
        return item
      })
    },
    changeSon (index) {
      console.log(index)
      let permlist = this.permlist[index]
      permlist.checked = permlist.list.every((item) => item.checked)
    },
    getChecked (data = []) {
      data.forEach((item) => {
        if (item.checked) {
          this.ruleForm.permIds.push(item.id)
        }
        if (item.list) {
          this.getChecked(item.list)
        }
      })
    },
    onSubmit () {
      this.$refs['ruleForm'].validate((valid) => {
        if (!valid) return
        this.saveIng = true
        this.ruleForm.permIds = []
        this.getChecked(this.permlist)
        ApiRole.addRole({ ...this.ruleForm }).then(({ code, message }) => {
          this.saveIng = false
          this.$message({ type: 'success', message: message })
          if (code === 'SUCCESS') {
            this.$router.push('/setting/permission/role')
          }
        }, () => {
          this.saveIng = false
        })
      })
    }
  }
}
</script>

<style lang="scss">
  .page-add-role {
    .hd-title {
      font-size: 14px;
      font-weight: bold;
      padding: 0 0 10px 0;
    }
    .set-item {
      background: white;
      margin-bottom: 20px;
      padding: 20px 0 1px 20px;
    }
    .limit-wrap {
      font-size: 0;
      /*padding-top: 10px;*/
      .item {
        display: inline-block;
        vertical-align: top;
        width: 130px;
        margin-right: 20px;
        margin-bottom: 5px;
      }
    }
  }
</style>
