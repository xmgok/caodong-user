<template>
  <div class="login-container">
    <div class="header-text">
      <img
        src="@/assets/images/logo2.jpg"
        alt="logo">
      <p>草动后台管理系统</p>
    </div>
    <div class="login-main">
      <div class="pp-text">
        <p class="p1">专业智慧零售解决方案</p>
        <p class="p2">打破传统拓客思路，引爆流量新战场</p>
      </div>
      <div class="form-wrap">
        <el-form
          v-show="showInterface == 'login'"
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          auto-complete="on"
          label-position="left">
          <div class="login-title">
            <div
              :class="{ active: loginForm.type === 1 }"
              class="title-item"
              @click="switchLoginType(1)">企业登录
            </div>
            <div
              :class="{ active: loginForm.type === 0 }"
              class="title-item"
              @click="switchLoginType(0)">个人管理员
            </div>
          </div>
          <!--<div class="login-text">登录</div>-->
          <div class="input-wrap">
            <el-form-item prop="username">
              <span class="svg-container">
                <svg-icon icon-class="user" />
              </span>
              <el-input
                v-model="loginForm.username"
                name="username"
                type="text"
                maxlength="11"
                auto-complete="on"
                placeholder="请输入手机号" />
            </el-form-item>
            <el-form-item prop="password">
              <span class="svg-container">
                <svg-icon icon-class="password" />
              </span>
              <el-input
                :type="pwdType"
                v-model="loginForm.password"
                name="password"
                auto-complete="on"
                placeholder="请输入密码"
                @keyup.enter.native="handleLogin" />
              <span
                class="show-pwd"
                @click="showPwd">
                <svg-icon :icon-class="pwdType === 'password' ? 'eye': 'eye-open'" />
              </span>
            </el-form-item>
            <el-form-item
              prop="code"
              style="position: relative;">
              <span style="color: #DCDCDC; padding-left: 30px; font-size: 16px; height: 1px;" />
              <el-input
                v-model="loginForm.imageCode"
                name="code"
                type="text"
                auto-complete="on"
                placeholder="请输入图形验证码"
                @keyup.enter.native="handleLogin" />
              <img
                :src="imageCodeUrl"
                style="width: 90px; position: absolute; right: 0; bottom: 10px; cursor: pointer;"
                @click="changeImgCodeUrl">
            </el-form-item>
            <div style="height: 19px;width: 1px;" />
            <!--<el-checkbox v-model="checked">下次自动登录</el-checkbox>-->
          </div>
          <el-button
            :loading="loading"
            type="primary"
            style="width:100%;"
            @click.native.prevent="handleLogin">
            登录
          </el-button>
          <div class="reg-wrap">
            <span
              class="reg"
              @click="switchContent('forgotPwd')">忘记密码</span>
            <span
              v-if="loginForm.type === 1"
              class="reg"
              @click="switchContent('register')">新用户注册</span>
          </div>
        </el-form>

        <el-form
          v-show="showInterface == 'register'"
          ref="registerForm"
          :model="registerForm"
          :rules="registerRules"
          class="login-form"
          auto-complete="on"
          label-position="left">
          <div class="login-text">注册</div>
          <div
            class="input-wrap"
            style="padding-bottom: 20px;">
            <el-form-item prop="mobile">
              <span class="svg-container">
                <svg-icon icon-class="user" />
              </span>
              <el-input
                v-model="registerForm.mobile"
                name="mobile"
                type="text"
                maxlength="11"
                auto-complete="on"
                placeholder="请输入手机号" />
            </el-form-item>
            <el-form-item prop="password">
              <span class="svg-container">
                <svg-icon icon-class="password" />
              </span>
              <el-input
                :type="pwdType"
                v-model="registerForm.password"
                name="password"
                auto-complete="on"
                placeholder="请输入密码"
                @keyup.enter.native="handleLogin" />
              <span
                class="show-pwd"
                @click="showPwd">
                <svg-icon :icon-class="pwdType === 'password' ? 'eye': 'eye-open'" />
              </span>
            </el-form-item>
            <el-form-item
              prop="imageCode"
              style="position: relative;">
              <span style="color: #DCDCDC; padding-left: 30px; font-size: 16px; height: 1px;" />
              <el-input
                v-model="registerForm.imageCode"
                name="code"
                type="text"
                auto-complete="on"
                placeholder="请输入图形验证码" />
              <img
                :src="imageCodeUrl"
                style="width: 90px; position: absolute; right: 0; bottom: 10px; cursor: pointer;"
                @click="changeImgCodeUrl">
            </el-form-item>
            <el-form-item
              prop="code"
              style="position: relative;">
              <span
                class="icon icon-comment"
                style="color: #DCDCDC; padding-left: 13px; font-size: 16px" />
              <el-input
                v-model="registerForm.code"
                name="code"
                type="text"
                auto-complete="on"
                placeholder="请输入短信验证码" />
              <div
                :class="{active : registerForm.time >= 60}"
                class="msg-code"
                @click="getCode('registerForm')">{{ registerForm.timeText }}
              </div>
            </el-form-item>
            <div style="display: -webkit-box; ">
              <el-checkbox v-model="registerForm.accept">阅读并接受</el-checkbox>
              <p style="padding-top: 3px; color: #409EFF; font-size: 12px">《草动商城用户协议》</p>
            </div>
          </div>
          <el-button
            :loading="loading"
            type="primary"
            style="width:100%;"
            @click.native.prevent="handleRegisterForm">
            注册
          </el-button>
          <div class="reg-wrap">
            <p
              class="reg"
              @click="switchContent('login')">已有账号，现在登录</p>
          </div>
        </el-form>

        <el-form
          v-show="showInterface == 'forgotPwd'"
          ref="forgotPwdForm"
          :model="forgotPwdForm"
          :rules="forgotPwdRules"
          class="login-form"
          auto-complete="on"
          label-position="left">
          <div class="login-text">{{ loginForm.type === 1 ? '企业账号密码找回' : '管理员账号密码找回' }}</div>
          <div class="input-wrap">
            <el-form-item prop="mobile">
              <span class="svg-container">
                <svg-icon icon-class="user" />
              </span>
              <el-input
                v-model="forgotPwdForm.mobile"
                type="text"
                maxlength="11"
                placeholder="请输入您需要找回密码的账号" />
            </el-form-item>
            <el-form-item
              prop="imageCode"
              style="position: relative;">
              <span style="color: #DCDCDC; padding-left: 30px; font-size: 16px; height: 1px;" />
              <el-input
                v-model="forgotPwdForm.imageCode"
                type="text"
                placeholder="请输入图形验证码" />
              <img
                :src="imageCodeUrl"
                style="width: 90px; position: absolute; right: 0; bottom: 10px; cursor: pointer;"
                @click="changeImgCodeUrl">
            </el-form-item>
            <el-form-item
              prop="smsCode"
              style="position: relative;">
              <span
                class="icon icon-comment"
                style="color: #DCDCDC; padding-left: 13px; font-size: 16px" />
              <el-input
                v-model="forgotPwdForm.smsCode"
                type="text"
                placeholder="请输入短信验证码" />
              <div
                :class="{active : forgotPwdForm.time >= 60}"
                class="msg-code"
                @click="getCode('forgotPwdForm')">{{ forgotPwdForm.timeText }}
              </div>
            </el-form-item>
          </div>
          <div style="height: 22px;" />
          <el-button
            :loading="loading"
            type="primary"
            style="width:100%;"
            @click.native.prevent="handleForgotPwd">
            确认
          </el-button>
          <div class="reg-wrap">
            <span
              class="reg"
              @click="switchContent('login')">账号登录</span>
            <span
              v-if="loginForm.type === 1"
              class="reg"
              @click="switchContent('register')">新用户注册</span>
          </div>
        </el-form>

        <el-form
          v-show="showInterface == 'resetPassword'"
          ref="resetPasswordForm"
          :model="resetPasswordForm"
          :rules="resetPasswordRules"
          class="login-form"
          auto-complete="on"
          label-position="left">
          <div class="login-text">重置密码</div>
          <div class="input-wrap">
            <el-form-item prop="password">
              <span class="svg-container">
                <svg-icon icon-class="password" />
              </span>
              <el-input
                :type="pwdType"
                v-model="resetPasswordForm.password"
                name="password"
                auto-complete="on"
                placeholder="请输入密码"
                @keyup.enter.native="handleResetPassword" />
              <span
                class="show-pwd"
                @click="showPwd">
                <svg-icon :icon-class="pwdType === 'password' ? 'eye': 'eye-open'" />
              </span>
            </el-form-item>
            <el-form-item prop="password2">
              <span class="svg-container">
                <svg-icon icon-class="password" />
              </span>
              <el-input
                :type="pwdType"
                v-model="resetPasswordForm.password2"
                name="password"
                auto-complete="on"
                placeholder="请输入确认密码"
                @keyup.enter.native="handleResetPassword" />
              <span
                class="show-pwd"
                @click="showPwd">
                <svg-icon :icon-class="pwdType === 'password' ? 'eye': 'eye-open'" />
              </span>
            </el-form-item>
          </div>
          <div style="height: 80px" />
          <el-button
            :loading="loading"
            type="primary"
            style="width:100%;"
            @click.native.prevent="handleResetPassword">
            确认
          </el-button>
          <div class="reg-wrap">
            <span
              class="reg"
              @click="switchContent('login')">账号登录</span>
            <span
              class="reg"
              @click="switchContent('register')">新用户注册</span>
          </div>
        </el-form>

      </div>
    </div>
    <div class="copyright-text">
      <p>公司地址：上海市浦东新区浦东南路2240号808室<span class="pl30">TEL：021-88888888</span></p>
      <p>上海具志网络科技有限公司 @ zhimeiplus 2018-2021</p>
    </div>
  </div>
</template>

<script>
import * as ApiLogin from '@/api/login'

import { validateMobile } from '@/utils/validate'

export default {
  name: 'Login',
  data () {
    let checkMobile = (rule, value, callback) => {
      if (!validateMobile(value)) return callback(new Error('请输入有效的手机号码'))
      callback()
    }
    const validatePass = (rule, value, callback) => {
      if (value.length < 6) return callback(new Error('密码不能小于6位'))
      callback()
    }
    const validatePass2 = (rule, value, callback) => {
      if (value !== this.resetPasswordForm.password) return callback(new Error('两次输入密码不一致!'))
      callback()
    }

    return {
      showInterface: 'login',
      registerForm: {
        type: 1, // 1草动商城 2五五拓客
        mobile: '',
        password: '',
        imageCode: '',
        code: '',
        accept: false,
        time: 60,
        timeText: '获取验证码',
        uuid: ''
      },
      loginForm: {
        username: '',
        password: '',
        imageCode: '',
        uuid: '',
        brandType: 1, // brandType1草动商城 brandType2五五拓客。
        type: 1 // 1 企业账号 0 个人账号
      },
      forgotPwdForm: {
        time: 60,
        timeText: '获取验证码',
        mobile: '',
        imageCode: '',
        uuid: '',
        smsCode: ''
      },
      resetPasswordForm: {
        password: '',
        password2: '',
        mobile: ''
      },
      checked: false,
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: checkMobile }],
        password: [{ required: true, trigger: 'blur', validator: validatePass }],
        imageCode: [{ required: true, trigger: 'blur', message: '请输入图形验证码' }]
      },
      registerRules: {
        mobile: [{ required: true, trigger: 'blur', validator: checkMobile }],
        password: [{ required: true, trigger: 'blur', validator: validatePass }],
        imageCode: [{ required: true, trigger: 'blur', message: '请输入图形验证码' }],
        code: [{ required: true, trigger: 'blur', message: '请输入短信验证码' }]
      },
      forgotPwdRules: {
        mobile: [{ required: true, trigger: 'blur', validator: checkMobile }],
        imageCode: [{ required: true, trigger: 'blur', message: '请输入图形验证码' }],
        smsCode: [{ required: true, trigger: 'blur', message: '请输入短信验证码' }]
      },
      resetPasswordRules: {
        password: [{ required: true, trigger: 'blur', validator: validatePass }],
        password2: [{ required: true, trigger: 'blur', validator: validatePass2 }]
      },
      loading: false,
      pwdType: 'password',
      redirect: undefined,
      imageCodeUrl: ''
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  mounted () {
    const uuid = this.getGuid()
    const arr = ['loginForm', 'forgotPwdForm', 'registerForm']
    arr.forEach((item) => {
      this[item].uuid = uuid
      // console.log(this[item])
    })
    this.imageCodeUrl = `${window.VUE_APP_API_URL}${window.VUE_APP_BASE_API}sysuser/imagecode?uuid=${uuid}`
  },
  methods: {
    changeImgCodeUrl () {
      this.imageCodeUrl = `${this.imageCodeUrl}&time=${new Date().getTime()}`
    },
    switchContent (type = 'login') {
      this.loading = false
      this.showInterface = type
    },
    getGuid () {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
      })
    },
    showPwd () {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    getCode (formName) {
      if (this[formName].time < 60) return
      this.$refs[formName].validateField('mobile', (valid) => {
        if (valid) return
        this.$refs[formName].validateField('imageCode', (validImageCode) => {
          console.log(validImageCode)
          if (validImageCode) return
          clearInterval(this.timerFn)
          ApiLogin.getSmsCode({ mobile: this[formName].mobile }).then(() => {
            this.timerFn = setInterval(() => {
              if (this[formName].time <= 0) {
                clearInterval(this.timerFn)
                this[formName].time = 60
                this[formName].timeText = '获取验证码'
              } else {
                this[formName].time--
                this[formName].timeText = `${this[formName].time}后重新发送`
              }
            }, 1000)
          }, () => {
          })
        })
      })
    },
    timerFn () {

    },
    handleResetPassword () {
      this.$refs.resetPasswordForm.validate(valid => {
        if (!valid) return
        this.loading = true
        ApiLogin.forgotpassword({
          ...this.resetPasswordForm,
          type: this.loginForm.type
        }).then(({ message }) => {
          this.$message({ type: 'success', message: message })
          this.loading = false
          setTimeout(() => {
            window.location.reload()
          }, 2000)
        }, () => {
          this.loading = false
        })
      })
    },
    handleRegisterForm () {
      this.$refs.registerForm.validate(valid => {
        if (!valid) return

        if (!this.registerForm.accept) {
          this.$message({ type: 'error', message: '请勾选阅读并接受草动商城用户协议' })
          return
        }
        this.loading = true
        ApiLogin.register(this.registerForm).then(() => {
          this.$message({ type: 'success', message: '注册成功，请登录' })
          // TODO 跳企业信息
          this.loading = false
          setTimeout(() => {
            window.location.reload()
          }, 2000)
        }, () => {
          this.loading = false
        })
      })
    },
    handleForgotPwd () {
      this.$refs.forgotPwdForm.validate(valid => {
        if (!valid) return
        this.loading = true
        ApiLogin.authcode(this.forgotPwdForm).then(({ message }) => {
          this.$message({ type: 'success', message: message })
          this.switchContent('resetPassword')
          this.resetPasswordForm.mobile = this.forgotPwdForm.mobile
        }, () => {
          this.loading = false
        })
      })
    },
    handleLogin () {
      this.$refs.loginForm.validate(valid => {
        if (!valid) return
        this.loading = true
        this.$store.dispatch('Login', this.loginForm).then(() => {
          this.loading = false
          // this.$router.push({ path: this.redirect || '/' })
          this.$router.push({ path: '/' })
        }).catch(() => {
          this.loading = false
        })
      })
    },
    switchLoginType (type) {
      this.loginForm.type = type
    }
  }
}
</script>

<style lang="scss">
  $bg: #2d3a4b;
  $light_gray: #eee;

  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;

      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: #303133;
        height: 47px;

        &:-webkit-autofill {
          box-shadow: 0 0 0 1000px white inset !important;
          -webkit-text-fill-color: #303133 !important;
        }
      }
    }

    .el-form-item {
      border-bottom: 1px solid #D8DCE6;
      color: #454545;
    }

    .el-button {
      border-radius: 24px;
      background: #5889FF;
      height: 48px;
      font-size: 18px;
    }

    .el-form-item__error {
      left: 45px;
      padding-top: 6px;
    }
  }

</style>

<style lang="scss">
  $bg: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #eee;
  .login-container {
    width: 100%;
    height: 100%;
    padding-top: 100px;
    box-sizing: border-box;
    position: relative;
    min-height: 870px;

    .header-text {
      position: absolute;
      left: 84px;
      top: 32px;
      color: #606266;
      font-size: 26px;
      font-weight: bold;
      line-height: 37px;
      display: -webkit-box;

      img {
        margin-right: 12px;
        display: block;
        width: 32px;
        height: 40px;
      }
    }

    .copyright-text {
      padding-top: 24px;
      text-align: center;
      line-height: 30px;
      color: #909399;
      font-size: 14px;
      position: absolute;
      left: 0;
      bottom: 32px;
      width: 100%;
    }

    .login-main {
      position: relative;
      height: 100%;
      width: 100%;
      background-image: url("../../assets/images/login-banner.jpg");
      background-repeat: no-repeat;
      background-size: 100% auto;
      background-position: center;
    }

    .pp-text {
      position: absolute;
      right: 50%;
      top: 256px;
      text-align: right;
      margin-right: -70px;

      .p1 {
        color: #303133;
        font-size: 36px;
        line-height: 50px;
        padding-bottom: 8px;
      }

      .p2 {
        color: #909399;
        line-height: 33px;
        font-size: 24px;
      }
    }

    .form-wrap {
      position: absolute;
      left: 50%;
      margin-left: 170px;
      top: 90px;
      box-shadow: 0 6px 24px 0 rgba(144, 147, 153, 0.2);
    }

    .login-form {
      background: white;
      border-radius: 8px;
      width: 480px;
      height: 560px;
      padding: 68px 60px 0;
      box-sizing: border-box;
    }

    .login-title {
      display: flex;

      .title-item {
        flex: 1;
        text-align: center;
        font-size: 24px;
        font-weight: bold;
        color: #c0c4cc;
        line-height: 42px;
        cursor: pointer;

        &.active {
          font-size: 30px;
          color: rgba(48, 49, 51, 1);
        }
      }
    }

    .login-text {
      text-align: center;
      font-size: 30px;
      font-weight: bold;
      color: rgba(48, 49, 51, 1);
      line-height: 42px;
    }

    .input-wrap {
      padding-top: 20px;
      padding-bottom: 50px;
    }

    .reg-wrap {
      margin-top: 24px;
      text-align: right;

      .reg {
        height: 16px;
        font-size: 14px;
        color: rgba(88, 137, 255, 1);
        line-height: 16px;
        margin-left: 24px;
        cursor: pointer;
      }
    }

    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .msg-code {
      position: absolute;
      right: 0;
      bottom: 10px;
      background: #C0C4CC;
      width: 90px;
      line-height: 28px;
      text-align: center;
      border-radius: 100px;
      color: white;
      cursor: pointer;
      font-size: 12px;

      &.active {
        background: #5889FF;
      }
    }

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: #D8DCE6;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }

    .title {
      font-size: 26px;
      font-weight: 400;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }
  }
</style>
