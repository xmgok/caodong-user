<template>
  <div class="page-add-employee">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="80px">
      <p class="hd-title">账号信息</p>
      <div class="set-item">
        <el-form-item
          label="员工账号"
          prop="mobile">
          <el-input
            v-model="ruleForm.mobile"
            placeholder="请输入有效的手机号码"
            style="width: 300px;"/>
        </el-form-item>
        <el-form-item
          label="员工姓名"
          prop="name">
          <el-input
            v-model="ruleForm.name"
            maxlength="8"
            placeholder="请输入真实的姓名"
            style="width: 300px;"/>
        </el-form-item>
        <el-form-item
          label="类型"
          prop="storeType">
          <el-radio
            v-model="ruleForm.storeType"
            :label="0"
            @change="changeStoreType">总部</el-radio>
          <el-radio
            v-model="ruleForm.storeType"
            :label="1"
            @change="changeStoreType">分公司</el-radio>
          <el-radio
            v-model="ruleForm.storeType"
            :label="2"
            @change="changeStoreType">门店</el-radio>
        </el-form-item>
        <el-form-item
          label="可用门店">
          <el-form-item
            v-if="showCompanyId"
            :rules="[ { required: true, message: '请选择分公司', trigger: 'change' } ]"
            style="display: inline-block"
            label-width="0"
            prop="companyId">
            <el-select
              v-model="ruleForm.companyId"
              placeholder="请选择分公司"
              @change="changeCompany">
              <el-option
                v-for="item in companyList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-select
            v-if="!showCompanyId"
            v-model="ruleForm.companyId2"
            multiple
            placeholder="全部分公司"
            @change="changeCompany">
            <el-option
              v-for="item in companyList"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
          <template v-if="showstoreSelect">
            <el-form-item
              v-if="showstoreId"
              :rules="[ { required: true, message: '请选择门店', trigger: 'change' } ]"
              label-width="0"
              style="display: inline-block"
              prop="storeId">
              <el-select
                v-model="ruleForm.storeId"
                class="ml10"
                placeholder="请选择门店">
                <el-option
                  v-for="item in storesList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </el-form-item>
            <el-select
              v-if="!showstoreId"
              v-model="ruleForm.storeId2"
              multiple
              class="ml10"
              placeholder="全部门店">
              <el-option
                v-for="item in storesList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </template>
        </el-form-item>
      </div>
      <p class="hd-title">后台操作权限</p>
      <div class="set-item mb10">
        <div class="operate-limit">
          <el-form-item
            label=""
            prop="roleIds">
            <el-checkbox-group v-model="ruleForm.roleIds">
              <div
                v-for="(item, index) in roleList"
                :key="item.id"
                class="item">
                <div class="item-ch">
                  <div class="item-title">
                    <div>
                      <el-checkbox
                        :label="item.id"
                        name="roleIds">{{ item.name }}</el-checkbox>
                    </div>
                    <div style="padding-top: 1px;">
                      <el-button
                        type="text"
                        size="small"
                        @click="onShowTag(index)">点击{{ item.showTag ? '收起' : '查看' }}详情</el-button>
                    </div>
                  </div>
                  <ul
                    v-if="item.showTag"
                    class="info">
                    <li>
                      <p class="p2">
                        <span
                          v-for="tagItem in item._permNames"
                          :key="tagItem">{{ tagItem }}</span>
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </el-checkbox-group>
          </el-form-item>
        </div>
      </div>
    </el-form>

    <div class="ui-edit-btn-wrapper">
      <el-switch
        v-model="ruleForm.status2"
        :active-text="ruleForm.status2 ? '已启用员工账号' : '已关闭员工账号'"
        class="mr20"/>
      <el-button
        @click="$router.go(-1)">取消</el-button>
      <el-button
        type="primary"
        @click="onSubmit">保存
      </el-button>
    </div>

  </div>
</template>

<script>
import * as ApiSysuser from '@/api/sysuser'
import * as ApiRole from '@/api/role'
import { mapGetters, mapMutations } from 'vuex'
import * as ApiStores from '@/api/stores'

export default {
  name: 'EmployeePermit',
  data () {
    let checkMobile = (rule, value, callback) => {
      if (!(/^[1][0-9]{10}$/.test(value))) {
        return callback(new Error('请输入有效的手机号码'))
      } else {
        callback()
      }
    }
    return {
      switchText: '已关闭员工账号',
      ruleForm: {
        name: '',
        mobile: '',
        roleIds: [],
        status2: true,
        storeType: 0,
        companyId: '',
        companyId2: [],
        storeId: '',
        storeId2: []
      },
      saveIng: false,
      rules: {
        name: [
          { required: true, message: '请输入真实的姓名', trigger: 'blur' },
          { max: 8, message: '最多8个字', trigger: 'blur' }
        ],
        mobile: [
          { required: true, validator: checkMobile, trigger: 'blur' }
        ],
        roleIds: [
          { required: true, message: '请勾选后台操作权限', trigger: 'change' }
        ]
      },
      roleList: [],

      showCompanyId: false,
      showstoreId: false,
      showstoreSelect: false,
      storeList: []
    }
  },

  computed: {
    ...mapGetters(['breadcrumb']),
    companyList () {
      if (this.ruleForm.storeType <= 0) {
        return this.storeList
      } else {
        return this.storeList.filter((item) => {
          return item.type > 0
        })
      }
    },
    storesList () {
      if (this.ruleForm.storeType > 0) {
        const store = this.storeList.filter((item) => {
          return item.id === this.ruleForm.companyId
        })[0]
        return store.list
      } else {
        return []
      }
    }
  },

  mounted () {
    const id = this.$route.query.id || ''
    this.SET_BREADCRUMB({ index: this.breadcrumb.length - 1, title: id ? '编辑员工' : '创建新员工' })
    this.getStoreList(() => {
      ApiRole.getRolelist().then(({ data = [] }) => {
        data.forEach((item) => {
          item.showTag = false
          item['_permNames'] = (item.permNames && item.permNames.split(',')) || []
        })
        this.roleList = data
      })
      if (id) {
        ApiSysuser.getSysuserInfo({ id }).then(({ data = {} }) => {
          this.ruleForm = Object.assign(this.ruleForm, data)
          this.ruleForm.status2 = this.ruleForm.status > 0
          this.changeStoreType({ type: 'init' })
        })
      } else {
        this.changeStoreType()
      }
    })
  },

  methods: {
    ...mapMutations(['SET_BREADCRUMB']),
    getStoreList (callback) {
      ApiStores.getList().then((data) => {
        this.storeList = data || []
        callback && callback()
      })
    },
    changeStoreType (options = {}) {
      if (options.type && options.type === 'init') {
        if (this.ruleForm.storeType <= 0) {
          this.ruleForm.companyId2 = this.ruleForm.storeIds || []
        }
        if (this.ruleForm.storeType === 1) {
          const resultInitData = this.initData(this.ruleForm.storeIds)
          this.ruleForm.companyId = resultInitData.companyId
          setTimeout(() => {
            this.ruleForm.storeId2 = resultInitData.storeId
          })
        }
        if (this.ruleForm.storeType === 2) {
          this.ruleForm.companyId = this.ruleForm.storeIds[0]
          setTimeout(() => {
            this.ruleForm.storeId = this.ruleForm.storeIds[1]
          })
        }
      } else {
        this.ruleForm.companyId = ''
        this.ruleForm.companyId2 = []
        this.ruleForm.storeId = ''
        this.ruleForm.storeId2 = []
      }
      if (this.ruleForm.storeType <= 0) {
        this.showCompanyId = false
        this.showstoreSelect = false
      } else {
        this.showCompanyId = true
        this.showstoreSelect = !!this.ruleForm.companyId
      }
      this.changeCompany()
    },
    initData (data) {
      let companyId = '';
      (this.storeList || []).forEach((item) => {
        if (data.indexOf(item.id) > -1) {
          companyId = item.id
        }
      })
      data.splice(data.indexOf(companyId), 1)
      return { companyId: companyId, storeId: data }
    },
    changeCompany () {
      this.ruleForm.storeId = ''
      this.ruleForm.storeId2 = []
      if (this.ruleForm.storeType === 1 && this.ruleForm.companyId) {
        this.showstoreSelect = true
        this.showstoreId = false
      }
      if (this.ruleForm.storeType === 2 && this.ruleForm.companyId) {
        this.showstoreSelect = true
        this.showstoreId = true
      }
    },
    onSubmit () {
      this.$refs['ruleForm'].validate((valid) => {
        console.log(valid)
        if (!valid) return
        this.saveIng = true
        let form = { ...this.ruleForm }
        form.status = form.status2 ? 1 : 0
        form.storeIds = form.companyId2.concat(form.storeId2).concat([form.companyId]).concat([form.storeId]).filter((item) => {
          return item
        })
        ApiSysuser.addSysuser(form).then(({ code, message }) => {
          this.saveIng = false
          this.$message({ type: 'success', message: message })
          if (code === 'SUCCESS') {
            this.$router.push('/setting/permission')
          }
        }, () => {
          this.saveIng = false
        })
      })
    },
    onShowTag (index) {
      this.roleList[index].showTag = !this.roleList[index].showTag
    }
  }
}
</script>

<style lang="scss">
  .page-add-employee {
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

    .operate-limit {
      font-size: 0;
      margin-left: -80px;
      .item {
        vertical-align: top;
        display: inline-block;
        width: 50%;
        margin-bottom: 20px;
        padding-right: 20px;
        box-sizing: border-box;
        &:last-child, &:nth-last-child(2) {
          margin-bottom: 0;
        }
      }
      .item-ch {
        background: #f5f7fc;
        font-size: 12px;

        .item-title {
          padding: 0 20px;
          height: 50px;
          display: -webkit-box;
          -webkit-box-align: center;
          -webkit-box-pack: justify;
        }
        .info {
          margin: 0 20px;
          padding: 20px 0;
          border-top: 1px solid #dddddd;
          line-height: 24px;
          li {
            padding-bottom: 10px;
            display: -webkit-box;
            &:last-child {
              padding-bottom: 0;
            }
            .p1 {
              width: 80px;
              color: #5889ff;
            }
            .p2 {
              -webkit-box-flex: 1;
              box-sizing: border-box;
              font-size: 0;
              span {
                display: inline-block;
                font-size: 12px;
                margin-right: 20px;
              }
            }
          }
        }
      }
    }
  }
</style>
