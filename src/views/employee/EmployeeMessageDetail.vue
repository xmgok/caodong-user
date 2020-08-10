<template>
  <div class="page-employee-message">
    <el-form
      ref="form"
      :model="form"
      :rules="formRules"
      class="form"
      label-width="100px">
      <el-card>
        <div>
          <el-form-item
            prop="name"
            label="通知名称"
            class="w500">
            <el-input
              :disabled="see"
              v-model="form.title"
              :maxlength="20" />
          </el-form-item>
          <el-form-item
            label="通知内容"
            prop="content">
            <el-input
              :disabled="see"
              v-model="form.content"
              class="w500"
              rows="10"
              type="textarea" />
          </el-form-item>
          <el-form-item
            label="发送方式">
            <el-radio-group v-model="form.sendType">
              <div
                style="display:flex"
                class="mb20 ">
                <el-radio
                  :label="1"
                  :disabled="see"
                  prop="off"
                  class="mt10"
                >
                  立即发送
                </el-radio>
              </div>
              <div
                style="display:flex"
              >
                <el-radio
                  :label="2"
                  :disabled="see"
                  class="mt10"
                >定时发送
                </el-radio>
                <el-form-item
                  v-if="form.sendType===2 "
                  prop="time">
                  <el-date-picker
                    v-model="form.sendTime"
                    :disabled="see"
                    :picker-options="startPickerOptions"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间"
                    default-time="12:00:00"/>
                </el-form-item>
              </div>
            </el-radio-group>
          </el-form-item>
          <!-- 适用门店 -->
          <el-form-item
            prop="storeList"
            style="margin-bottom: 0;"
            label="适用门店">
            <div class="condition-wrap">
              <template v-if="storeListLength>0">已选{{ storeListLength }}家门店</template>
              <el-button
                type="text"
                size="mini"
                @click="isShowStore=true">
                {{ storeListLength>0?'修改':'添加' }}门店
              </el-button>
            </div>
          </el-form-item>
        </div>
      </el-card>
    </el-form>
    <!-- <el-card class="mt10">
        <div slot="header">适用门店<el-form-item
          prop="storeList"
          style="margin-bottom: 0;"
          label=""/></div>
        <div class="condition-wrap">
          <template v-if="storeListLength>0">已选{{ storeListLength }}家门店</template>
          <el-button
            type="text"
            size="mini"
            @click="isShowStore=true">
            {{ storeListLength>0?'修改':'添加' }}门店
          </el-button>
        </div>
      </el-card> -->
    <div class="ui-edit-btn-wrapper">
      <template >
        <el-button
          @click="$router.go(-1)">取消
        </el-button>
        <el-button
          :loading="saveIng"
          type="primary"
          @click="submit">保存
        </el-button>
      </template>
    </div>

    <!--门店选择，多选-->
    <select-store-tree
      :visible.sync="isShowStore"
      :is-disabled-all="see"
      :default-value="form.storeList"
      @confirm="confirmCheckedStore"
    />
  </div>
</template>

<script>
import SelectStoreTree from '@/components/SelectStoreTree'
import * as ApiEmployee from '@/api/employee'
export default {
  name: 'EmployeeMessageDetail',
  components: {
    SelectStoreTree
  },
  data () {
    return {
      form: {
        'storeList': [],
        sendTime: '',
        sendType: 1,
        content: '',
        id: '',
        title: ''
      },
      isShowStore: false,
      saveIng: false,
      see: false,
      formRules: {
        title: [
          { required: true, message: '请输入通知名称', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入通知内容' }
        ],
        sendTime: [
          { required: true, message: '请选择发送时间', trigger: 'blur' }
        ],
        storeList: [
          { required: true, message: '请选择适用门店' }
        ]
      }
    }
  },
  computed: {
    storeListLength () {
      return this.form.storeList.filter(v => v.type === 0).length
    },
    startPickerOptions () {
      return ({ disabledDate: time => time ? (time.getTime() < new Date() - '8.64e7') : false })
    }
  },
  created () {
    const id = this.$route.query.id || ''
    this.see = Boolean(this.$route.query.id) || false
    this.form.id = id
    id && this.getInfo()
  },
  methods: {
    getInfo () {
      ApiEmployee.getMessageDetail(
        { id: this.form.id }
      ).then(({ data }) => {
        this.form = data
        // this.form.title = data.title
        // this.form.content = data.content
        // this.form.sendTime = data.sendTime
        // this.form.sendType = data.sendType
      })
    },
    confirmCheckedStore (data) {
      this.form.storeList = data
      this.$refs['form'].validateField(['storeList'])
    },
    submit () {
      this.$refs['form'].validate((valid) => {
        if (!valid) return
        this.saveIng = true
        ApiEmployee.addMessageList({ ...this.form }).then(({ code, message }) => {
          this.$message({ type: (code === 'SUCCESS' ? 'success' : 'error'), message: message })
          if (code === 'SUCCESS') {
            this.$router.go(-1)
          }
          this.saveIng = false
        }, () => {
          this.saveIng = false
        })
      })
    }

  }
}
</script>

<style lang="scss">
</style>
