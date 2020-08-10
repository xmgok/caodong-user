<template>
  <div class="page-freight">
    <div class="mb10">
      <el-button
        type="primary"
        @click="add()">新增模板
      </el-button>
    </div>
    <div class="ui-search-header-block mb10">
      <el-form
        :inline="true"
        :model="form"
        label-width="80px">
        <div>
          <select-store
            style="display: inline-block; margin-bottom: 10px"
            labelwidth="80px"
            selectwidth="250px"
            @change="changeSelectStore" />
          <el-form-item
            label="物流公司" >
            <el-select
              v-model="form.expressId"
              class="w250"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in companyList"
                :key="item.id"
                :label="item.name"
                :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="模板名称">
            <el-input
              v-model="form.templateName"
              class="w250"/>
          </el-form-item>
        </div>
        <el-button
          class="btn-search"
          type="primary"
          icon="el-icon-search"
          @click="templateSearch"
        >搜索
        </el-button>
      </el-form>
    </div>
    <el-table :data="tableData">
      <el-table-column
        prop="name"
        align="center"
        label="模板名称"/>
      <el-table-column
        align="center"
        label="物流公司">
        <template
          v-if="companyList[scope.row.expressId]"
          slot-scope="scope">
          {{ companyList[scope.row.expressId].name }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="首重">
        <template slot-scope="scope">
          {{ scope.row.firstWeight }} KG/ {{ scope.row.firstPrice }}元
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="续重">
        <template slot-scope="scope">
          {{ scope.row.addWeight }}KG / {{ scope.row.addPrice }}元
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        width="150"
        label="操作">
        <template
          slot-scope="scope">
          <div v-if="storeType === scope.row.createType">
            <el-button
              type="text"
              size="small"
              @click="freightSet(scope.row.id)">设为默认</el-button>
            <el-button
              type="text"
              size="small"
              @click="edit(scope.row.id,'edit')">编辑</el-button>
            <el-button
              type="text"
              size="small"
              @click="del(scope.row.id)">删除</el-button>
          </div>
          <el-button
            v-else
            type="text"
            size="small"
            @click="edit(scope.row.id,'look')"
          >查看</el-button>
        </template>

      </el-table-column>
    </el-table>

    <el-dialog
      :visible.sync="dialogFormVisible"
      :title="isEditOBJ[isEdit]"
      width="1000px"
      @close="cancel(1)">
      <div >
        <el-form
          ref="addOreditForm"
          :model="form"
          :rules="rules"
          :inline="true"
          label-position="left"
          label-width="80px">
          <!-- v-if="storeType!==2" -->
          <div
            v-if="storeType!==2"
          >
            <el-form-item
              prop="storeList"
              style="margin-bottom: 0;"
              label="适用门店">
              <template v-if="storeListLength>0"><span style="font-size: 12px;">已选{{ storeListLength }}家门店</span></template>
              <el-button
                type="text"
                size="mini"
                @click="isShowStore=true">
                {{ storeListLength>0?'修改':'添加' }}门店
              </el-button>
            </el-form-item>

          </div>
          <el-divider/>
          <div
            v-for="(item,index) in form.templateArr"
            :key="index"
            class="flex template_info_wp"
          >
            <span
              v-if="form.templateArr.length > 1"
              class="del el-icon-close"
              @click="delTemplateDialog(index)" />
            <el-form-item
              :prop="'templateArr.' + index + '.name'"
              :rules="[
                { required: true, message: '请输入模板名称', trigger: 'blur' },
              ]"
              label="模板名称" >
              <el-input
                v-model.trim="item.name"
              />
            </el-form-item>
            <el-form-item
              :prop="'templateArr.' + index + '.expressId'"
              :rules="[
                { required: true, message: '请选择运费模板', trigger: 'change' }
              ]"
              label="物流公司" >
              <el-select
                v-model="item.expressId"
                placeholder="请选择"
                @change=" companyListChange">
                <el-option
                  v-for="item in companyList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item
              :prop="'templateArr.' + index + '.firstWeight'"
              :rules="[
                { required: true, message: '请输入首重重量', trigger: 'blur' },
                { validator: (rule, value, callback) => limitFloatNumber(rule, value, callback, { min: 0.001 }), trigger: 'blur' }
              ]"
              label="首重">
              <el-input
                v-model.trim="item.firstWeight"
              >
                <template slot="append">KG</template>
              </el-input>
            </el-form-item>
            <el-form-item
              :prop="'templateArr.' + index + '.firstPrice'"
              :rules="[
                { required: true, message: '请输入首重价格', trigger: 'blur' },
                { validator: money, trigger: 'blur' }
              ]"
              class="first-price"
              label=" "
            >
              <el-input
                v-model.trim="item.firstPrice"
                class="w150">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item
              :prop="'templateArr.' + index + '.addWeight'"
              :rules="[
                { required: true , message: '请输入续重重量', trigger: 'blur' },
                { validator: (rule, value, callback) => limitFloatNumber(rule, value, callback, { min: 0.001 }), trigger: 'blur' }

              ]"
              label="续重">
              <el-input
                v-model.trim="item.addWeight"
              >
                <template slot="append">KG</template>
            </el-input></el-form-item>
            <el-form-item
              :prop="'templateArr.' + index + '.addPrice'"
              :rules="[
                { required: true, message: '请输入续重价格', trigger: 'blur' },
                { validator: money, trigger: 'blur' }
              ]"
              class="first-price"
              label=" "
            >
              <el-input
                v-model.trim="item.addPrice"
              >
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </div>
        </el-form>
        <el-divider/>
        <div
          v-if="isEdit!==1 && isEdit!==2"
          class="mb10">
          <el-button
            type="primary"
            @click="addtempletDialog"
          >新增模板
          </el-button>
        </div>
        <div
          slot="footer"
          class="tc">
          <el-button
            v-if="isEdit===2"
            @click="cancel(1)">取 消</el-button>
          <div v-else>
            <el-button
              @click="cancel(1)">取 消</el-button>
            <el-button
              :loading="saveIng"
              type="primary"
              @click="submit">保 存
            </el-button>
          </div>

        </div>
      </div>
    </el-dialog>

    <!-- 设置默认运费 -->
    <el-dialog
      :visible.sync="freightVisible"
      class="freight-wrap"
      width="600px"
      title="设置默认运费"
      @close="cancel(2)">
      <ul
        v-if="freightInfo"
        class="dialog-content pl30 pr30">
        <li class="pb20 ">
          <label >
            模板名称 :
          </label>
          <span>{{ freightInfo.name }}</span>
        </li>
        <li class="pb20 ">
          <label >
            物流公司 :
          </label>
          <span>{{ freightInfo.expressName || '--' }}</span>
        </li>
        <li class="pb20 ">
          <label >
            首重 :
          </label>
          <span>{{ freightInfo.firstWeight }} KG/ {{ freightInfo.firstPrice }}元</span>
        </li>
        <li class="pb20 ">
          <label >
            续重 :
          </label>
          <span>{{ freightInfo.addWeight }}KG/ {{ freightInfo.addPrice }}元</span>
        </li>
        <li v-if="storeType!==2">
          将当前模板设置为以下店铺的默认模板 :
        </li>
      </ul>
      <!-- v-if="storeType!==2" -->
      <div
        v-if="storeType!==2"
        class="mt20">
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
        >
          <el-form-item

            prop="storeList"
            style="margin-bottom: 0;"
            label="适用门店">
            <template v-if="storeListLength>0"><span style="font-size: 12px;">已选{{ storeListLength }}家门店</span></template>
            <el-button
              type="text"
              size="mini"
              @click="isShowStore=true">
              {{ storeListLength>0?'修改':'添加' }}门店
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <p
        class="mt20 warn"
      >每家门店仅能设置1个默认模板，本次设置后将会覆盖之前的默认模板</p>
      <div
        slot="footer"
        class="tc">
        <el-button @click="cancel(2)">取 消</el-button>
        <el-button
          :loading="saveIngFreight"
          type="primary"
          @click="freightSure()"
        >保 存
        </el-button>
      </div>
    </el-dialog>

    <!--门店选择，多选-->
    <select-store-tree
      ref="selectStoreTree"
      :visible.sync="isShowStore"
      :default-value="form.storeList"
      :part-info="partInfoObj"
      @confirm="confirmCheckedStore"
    />

    <!--分页-->
    <div class="g-pagination-wrap">
      <el-pagination
        :current-page="search.pageNum"
        :page-sizes="$store.state.app.pageSizes"
        :page-size="search.pageSize"
        :total="search.totalCount"
        :layout="$store.state.app.layout"
        @size-change="sizeChange"
        @current-change="pageChange" />
    </div>

  </div>
</template>

<script>
import * as Validate from '@/utils/validate'
import * as ApiFreight from '@/api/freight'
import * as ApiLogistics from '@/api/logistics'
import SelectStoreTree from '@/components/SelectStoreTree'
import SelectStore from '@/components/SelectStore'

export default {
  name: 'SettingFreight',
  components: {
    SelectStoreTree,
    SelectStore
  },
  data () {
    return {
      companyList: [],
      saveIng: false,
      saveIngFreight: false,
      tableData: [],
      dialogFormVisible: false,
      isShowStore: false,
      freightVisible: false,
      freightInfo: {}, // 默认模板回显
      form: {
        'storeList': [],
        id: '',
        firstWeight: '',
        firstPrice: '',
        addWeight: '',
        addPrice: '',
        isDefault: 0,
        expressId: '',
        templateName: '',
        templateArr: [
        ]
      },
      search: {
        pageNum: 1,
        totalCount: 0,
        pageSize: 10
      },
      searchForm: {
        storeId: '',
        companyId: ''
      },
      isEdit: '', // 0 新增 1编辑 2查看
      freightId: '',
      rules: {
        // name: [
        //   { required: true, message: '请输入模板名称', trigger: 'blur' }
        // ],
        // expressId: [
        //   { required: true, message: '请选择运费模板', trigger: 'change' }
        // ],
        // firstWeight: [
        //   { required: true, message: '请输入首重重量', trigger: 'blur' },
        //   { validator: (rule, value, callback) => Validate.limitFloatNumber(rule, value, callback, { min: 0.001 }), trigger: 'blur' }
        // ],
        // firstPrice: [
        //   { required: true, message: '请输入首重价格', trigger: 'blur' },
        //   { validator: Validate.money, trigger: 'blur' }
        // ],
        // addWeight: [
        //   { required: true, message: '请输入续重重量', trigger: 'blur' },
        //   { validator: (rule, value, callback) => Validate.limitFloatNumber(rule, value, callback, { min: 0.001 }), trigger: 'blur' }
        // ],
        // addPrice: [
        //   { required: true, message: '请输入续重价格', trigger: 'blur' },
        //   { validator: Validate.money, trigger: 'blur' }
        // ],
        storeList: [{ required: true, message: '本项必填' }]
      },
      money: Validate.money,
      limitFloatNumber: Validate.limitFloatNumber,
      partInfoObj: {
        storeTreeList: [
        ],
        isSetDefault: false
      },
      dataStoreList: [],
      storeTypeList: [], // storeType ===2
      isEditOBJ: {
        0: '新增模板',
        1: '编辑模板',
        2: '查看模板'
      }

    }
  },
  computed: {
    storeListLength () {
      return this.form.storeList.filter(v => v.type === 0).length
    },
    storeType () {
      // storeType   门店类型 0总部 1分公司 2门店
      return this.$store.getters.userInfo.storeType
    }
  },
  created () {
    this.getListPc()
    ApiLogistics.companyList().then(({ data }) => {
      this.companyList = Object.keys(data).map((index) => {
        return { id: Number(index), name: data[index] }
      })
      // this.getList()
      // this.getListPc()
    }, () => {})
  },
  methods: {
    getListPc () {
      ApiFreight.listPc({
        ...this.searchForm,
        expressId: this.form.expressId,
        name: this.form.templateName,
        ...this.search

      }).then(({ data }) => {
        this.tableData = data.dataList
        this.search.totalCount = data.totalCount || 0
      })
    },
    sizeChange (e) {
      this.search.pageSize = e
      this.getListPc()
    },
    pageChange (e) {
      this.search.pageNum = e
      this.getListPc()
    },
    //  模糊搜索
    templateSearch () {
      this.getListPc()
    },
    // getList () {
    //   ApiFreight.list().then(({ data }) => {
    //     this.tableData = data || []
    //   })
    // },
    add () {
      if (this.$store.getters.userInfo.storeType === 2) {
        this.form.storeList = this.$refs.selectStoreTree.data2[0].list
      }
      this.isEdit = 0
      this.isSure = false
      this.partInfoObj.isSetDefault = false
      this.form.templateArr = [
        {
          name: '',
          expressId: '',
          expressName: '',
          firstWeight: '',
          firstPrice: '',
          addWeight: '',
          addPrice: '',
          id: '',
          isDefault: 0
        }

      ]
      this.dialogFormVisible = true
      // this.form.storeList = []
    },
    edit (row, type) {
      switch (type) {
        case 'look':
          this.isEdit = 2
          break
        case 'edit':
          this.isEdit = 1
          break
        default:
          break
      }
      // this.$refs['addOreditForm'].clearValidate()
      this.partInfoObj.isSetDefault = false
      ApiFreight.EditDefultTempInfo(row).then(({ data }) => {
        this.dialogFormVisible = true
        this.form.templateArr = [data]
        this.form.storeList = data.storeList
        this.dataStoreList = this.form.storeList // 是否编辑过门店
      })
    },
    cancel (type) {
      switch (type) {
        case 1:
          this.form.templateArr = [
            {
              name: '',
              expressId: '',
              expressName: '',
              firstWeight: '',
              firstPrice: '',
              addWeight: '',
              addPrice: '',
              id: '',
              isDefault: 0
            }
          ]
          this.dialogFormVisible = false
          this.$refs['addOreditForm'].resetFields()
          break
        case 2:
          // this.$forceUpdate()
          this.freightVisible = false
          this.$refs['form'].resetFields()

          break
        default:
          break
      }
      // 清除选中项
      this.$refs['selectStoreTree'].noSelect()
      this.$refs['selectStoreTree'].isSelectedAll = false
      this.form.storeList = []
    },

    del (id) {
      ApiFreight.delInfo(id).then(({ data }) => {
        const h = this.$createElement
        this.$msgbox({
          title: '提示',
          message: h('p', null, [
            h('span', null, `有${data}家门店正在使用当前模板，是否确认删除？`)
          ]),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true
              ApiFreight.del(id).then(({ code, message = '' }) => {
                done()
              }).catch(() => {
              })
              setTimeout(() => {
                instance.confirmButtonLoading = false
              }, 300)
            } else {
              done()
            }
          }
        }).then(() => {
          this.getListPc()
          this.$message({
            type: 'success',
            message: '删除成功'
          })
        })
      })
    },
    // 新增 编辑模板
    submit () {
      this.$refs['addOreditForm'].validate((valid) => {
        if (!valid) return
        this.saveIng = true
        this.form.templateArr.map(el => {
          el.expressName = this.companyList.find(e => {
            return e.id === el.expressId
          }).name
        })
        const reqData = this.form.templateArr[0].id ? { ...this.form.templateArr[0], storeList: this.form.storeList } : {
          list: this.form.templateArr, // 模板
          storeList: this.form.storeList
        }

        ApiFreight.save(reqData).then(({ code, message }) => {
          this.$message({ type: (code === 'SUCCESS' ? 'success' : 'error'), message: message })
          if (code === 'SUCCESS') {
            this.dialogFormVisible = false
            this.getListPc()
          }
          this.saveIng = false
        }, () => {
          this.saveIng = false
        })
      })
    },
    companyListChange (id) {
      // this.companyList.forEach((e, i) => {
      //   if (e.id === id) {
      //     this.form.templateArr.forEach((ele, i) => {
      //       ele.expressName = e.name
      //     })
      //   }
      // })
    },
    setDefault (data) {
      this.saveIng = true
      data.isDefault = 1
      ApiFreight.save(data).then(({ code, message }) => {
        this.$message({ type: (code === 'SUCCESS' ? 'success' : 'error'), message: message })
        if (code === 'SUCCESS') {
          this.getList()
        }
        this.saveIng = false
      }, () => {
        this.saveIng = false
      })
    },
    confirmCheckedStore (data) {
      this.form.storeList = data
      // this.$refs['form'].validateField(['storeList'])
    },
    getBy () {
      this.saveIngFreight = true
      ApiFreight.setDefultTemp({
        id: this.freightId,
        storeList: this.$store.getters.userInfo.storeType === 2 ? this.$refs.selectStoreTree.data2[0].list : this.form.storeList
      }).then(({ code, message }) => {
        this.$message({ type: (code === 'SUCCESS' ? 'success' : 'error'), message: message })
        if (code === 'SUCCESS') {
          this.freightVisible = false
          this.getListPc()
        }
        this.saveIngFreight = false
      }, () => {
        this.saveIngFreight = false
      })
    },
    // 设置默认运费
    freightSure () {
      if (this.$store.getters.userInfo.storeType === 2) {
        this.getBy()
        return
      }

      this.$refs['form'].validateField(['storeList'], (valid) => {
        if (!valid) {
          this.getBy()
        }
      })
    },
    freightSet (id) {
      this.freightId = id
      ApiFreight.setDefultTempInfo(id).then(({ data }) => {
        this.freightVisible = true
        this.freightInfo = data
        this.partInfoObj.isSetDefault = true
        this.partInfoObj.storeTreeList = data.storeTreeList
        this.form.storeList = this.$store.getters.userInfo.storeType === 2 ? this.$refs.selectStoreTree.data2[0].list : data.storeList
      })
    },
    // 添加模板
    addtempletDialog () {
      let obj = {
        name: '',
        expressId: '',
        expressName: '',
        firstWeight: '',
        firstPrice: '',
        addWeight: '',
        addPrice: '',
        id: '',
        isDefault: 0
      }
      this.form.templateArr.push(obj)
    },
    // 删除模板
    delTemplateDialog (index) {
      if (this.form.templateArr.length < 1) return
      this.form.templateArr.splice(index, 1)
    },
    changeSelectStore (val) {
      this.searchForm.storeId = val.storeId || ''
      this.searchForm.companyId = val.companyId || ''
    }
  }
}
</script>

<style lang="scss" scoped>
.page-freight{
  // 隐藏验证icon
/deep/.first-price.is-required:not(.is-no-asterisk) >
 .el-form-item__label:before,
 .el-form-item.is-required:not(.is-no-asterisk)
  .el-form-item__label-wrap > .el-form-item__label:before{
    opacity: 0;
}
.template_info_wp {
    position: relative;
    margin-top: 10px;
    .del {
      width: 30px;
      height: 30px;
      background: rgba(236, 236, 236, 1);
      position: absolute;
      right: 0;
      top: 0;
      font-size: 20px;
      color: #96989c;
      line-height: 30px;
      text-align: center;
    }
  }
  .freight-wrap {
    .warn{
      text-align: center;
      color: $--color-danger;
    }
    .dialog-content{
    width: 100%;
    li{
      width: 100%;
      list-style:none;
    }
    label {
      width: 110px;
      display: inline-block;
      text-align: right;
      padding-right: 10px;
    }
    .cnt {
      color: #303133;
    }
  }
  }

}

</style>
