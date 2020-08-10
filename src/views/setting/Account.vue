<template>
  <div>
    <!--v-model="activeIndex"-->
    <el-tabs
      type="border-card">
      <!--
      <el-tab-pane label="修改绑定手机">
        <el-form
          ref="form0"
          :model="form0"
          :rules="loginRules"
          label-width="120px">
          <div class="pt50 pb50">
            <el-form-item label="当前手机号">
              <el-input
                v-model="mobile"
                style="width: 240px"
                disabled/>
            </el-form-item>
            <el-form-item
              label="请输入新的手机号"
              prop="newMobile">
              <el-input
                v-model="form0.newMobile"
                name="newMobile"
                style="width: 240px"/>
            </el-form-item>
            <el-form-item
              label="验证码"
              prop="code">
              <el-input
                v-model="form0.code"
                style="width: 240px"/>
              <el-button
                :disabled="timeReduce<60"
                type="primary"
                size="small"
                class="ml20 aaasss"
                style="width: 120px"
                @click="sendCode">{{ sendText }}</el-button>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                class="mt20"
                @click="sure1">确定</el-button>
            </el-form-item>
          </div>

        </el-form>
      </el-tab-pane>
-->
      <el-tab-pane label="修改登录密码">
        <el-form
          ref="form1"
          :model="form1"
          :rules="loginRules"
          label-width="120px">
          <div class="pt50 pb50">
            <el-form-item
              label="请输入原密码"
              prop="oldPass">
              <el-input
                v-model="form1.oldPass"
                type="password"
                style="width: 240px"/>
            </el-form-item>
            <el-form-item
              label="请输入新密码"
              prop="newPass0">
              <el-input
                v-model="form1.newPass0"
                type="password"
                style="width: 240px"/>
            </el-form-item>
            <el-form-item
              label="请确认新密码"
              prop="newPass1">
              <el-input
                v-model="form1.newPass1"
                type="password"
                style="width: 240px"/>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                class="mt20"
                @click="sure2">确定</el-button>
            </el-form-item>
          </div>
        </el-form>

      </el-tab-pane>
    </el-tabs>
    <el-row
      type="flex"
      justify="center"
      class="mt20"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { validateMobile } from '@/utils/validate'
import * as ApiSysuser from '@/api/sysuser'

export default {
  name: 'Account',
  data () {
    let checkMobile = (rule, value, callback) => {
      if (!validateMobile(value)) return callback(new Error('请输入有效的手机号码'))
      callback()
    }
    const validatePass = (rule, value, callback) => {
      if (value.length < 6) return callback(new Error('密码不能小于6位'))
      callback()
    }
    let validatePass1 = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能小于6位'))
      } else {
        if (this.form1.newPass1.length >= 6) {
          this.$refs.form1.validateField('newPass1')
        }
        callback()
      }
    }
    let validatePass2 = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能小于6位'))
      } else if (value !== this.form1.newPass0) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      activeIndex: '1',
      form0: {
        newMobile: '',
        code: ''
      },
      form1: {
        oldPass: '',
        newPass0: '',
        newPass1: ''
      },
      loginRules: {
        newMobile: [{ required: true, trigger: 'blur', validator: checkMobile }],
        code: [{ required: true, trigger: 'blur', message: '请输入验证码' }],
        oldPass: [{ required: true, trigger: 'blur', validator: validatePass }],
        newPass0: [{ required: true, trigger: 'blur', validator: validatePass1 }],
        newPass1: [{ required: true, trigger: 'blur', validator: validatePass2 }]
      },
      sendText: '获取验证码',
      timeReduce: 60
    }
  },
  computed: {
    ...mapGetters([
      'mobile'
    ])
  },
  mounted () {
  },
  created () {
    this.activeIndex = Number(this.$route.query.tab) === 0 ? '0' : '1'
  },
  methods: {
    sure1 () {
      this.$refs['form0'].validate((valid) => {
        if (!valid) return
        alert('submit!')
      })
    },
    sure2 () {
      this.$refs.form1.validate(valid => {
        if (!valid) return
        ApiSysuser.updatepwd({
          oldPwd: this.form1.oldPass,
          newPwd: this.form1.newPass0
        }).then(({ code, message }) => {
          // this.saveIng = false
          this.$message({ type: (code === 'SUCCESS' ? 'success' : 'error'), message: message })
          if (code === 'SUCCESS') {
            this.$store.dispatch('FedLogOut')
          }
        })
      })
    },
    sendCode () {
      let _this = this
      this.$refs.form0.validateField('newMobile', v => {
        if (v === '') {
          let timer = setInterval(function () {
            _this.timeReduce--
            _this.sendText = `剩余${_this.timeReduce}秒`
            if (_this.timeReduce === 0) {
              clearInterval(timer)
              _this.timeReduce = 60
              _this.sendText = '获取验证码'
            }
          }, 1000)
        } else {
          _this.$message(v)
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss">

</style>
