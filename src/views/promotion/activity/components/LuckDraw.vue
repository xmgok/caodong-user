<template>
  <div class="component-luck-draw">
    <el-dialog
      :visible="visible"
      :before-close="close"
      width="900px"
      append-to-body
      title="抽奖奖励">
      <el-form
        ref="form"
        :model="form"
        :rules="formRules"
        label-width="100px">
        <el-table
          :data="form.rewards"
          style="width: 100%">
          <el-table-column
            width="100"
            align="center"
            label="奖项">
            <template slot-scope="scope">{{ scope.$index + 1 }}等奖</template>
          </el-table-column>
          <el-table-column
            prop="date"
            align="center"
            label="奖励类型"
            width="200">
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.type"
                placeholder="请选择"
                disabled
                @change="changeType(scope.$index)">
                <el-option
                  :value="1"
                  label="优惠券" />
                <el-option
                  :value="2"
                  label="赠品" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="name"
            label="奖励详情">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.rewardId"
                icon="el-icon-edit-outline"
                type="text"
                size="small"
                @click="editReward(scope.$index)">{{ scope.row.rewardName }}
              </el-button>
              <el-button
                v-else
                icon="el-icon-plus"
                type="text"
                size="small"
                @click="editReward(scope.$index)">添加奖励
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            width="180"
            label="数量"
            align="center">
            <template slot-scope="scope">
              <el-form-item
                v-if="scope.row.type <=2"
                :prop="'rewards.' + scope.$index + '.rewardNumber'"
                :rules="formRules.rewardNumber"
                label-width="0"
                style="margin-bottom: 0">
                <el-input
                  v-model="scope.row.rewardNumber"
                  class="w100"/>
              </el-form-item>
              <p v-else> - - </p>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            fixed="right"
            width="50"
            align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="delReward(scope.$index)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          class="mt10"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="addReward">添加奖励
        </el-button>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button
          type="primary"
          @click="submit">确 定
        </el-button>
      </div>
    </el-dialog>
    <goods-selector
      v-if="showGoodsSelector"
      :visible.sync="showGoodsSelector"
      :manual-data="goodsSelector"
      :hide-condition="true"
      :multiple="false"
      type="manual"
      @change="goodsSelectorChanged" />
  </div>
</template>

<script>
import GoodsSelector from '@/components/GoodsSelector'
import ApiProduct from '@/api/product'
import * as Validate from '@/utils/validate'

export default {
  name: 'LuckDraw',
  components: {
    GoodsSelector
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    defaultValue: {
      type: Array,
      default: () => []
    }
  },

  data () {
    return {
      currentGoodsSelector: '',
      showGoodsSelector: false,
      form: {
        rewards: []
      },
      formRules: {
        rewardNumber: [
          { required: true, message: '请输入奖励数量', trigger: 'blur' },
          { validator: (rule, value, callback) => Validate.limitNumber(rule, value, callback, { min: 1 }), trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    goodsSelector () {
      const id = this.form.rewards[this.currentGoodsSelector].rewardId || ''
      return id ? [id] : []
    }
  },

  created () {
    console.log(this.defaultValue)
    this.form.rewards = [].concat(this.defaultValue)
  },

  methods: {
    addReward () {
      this.form.rewards.push({
        levelImg: '', // 等级图片，传空
        levelName: '', // 等级名称，传空
        rewardId: '', // 优惠券id/赠品id ,
        rewardImg: '', // 奖励图片
        rewardName: '', // 奖励名称 ,
        rewardNumber: '', // 奖励数量 ,
        rewardPrice: 0, // 奖励价格 ,
        type: 2 // 奖励类型 1优惠券 2赠品 3抽奖
      })
    },
    delReward (index) {
      this.form.rewards.splice(index, 1)
    },
    editReward (index) {
      const type = ['', 'Coupon', 'Goods'][this.form.rewards[index].type]
      this[`show${type}Selector`] = true
      this[`current${type}Selector`] = index
    },
    goodsSelectorChanged ({ data }) {
      this.$refs['form'].clearValidate()
      ApiProduct.productCouponlist({ pids: data[0], pageNum: 1, pageSize: 10 }).then(({ data }) => {
        data = data.dataList[0]
        let item = this.form.rewards[this.currentGoodsSelector]
        item.levelImg = ''
        item.levelName = ''
        item.rewardId = data.id
        item.rewardImg = data.imgUrl
        item.rewardName = data.name
        item.rewardNumber = data.inventory
        item.rewardPrice = data.price
        item.type = 2
      })
    },
    close () {
      this.$emit('update:visible', false)
    },
    submit () {
      this.$refs['form'].validate((valid) => {
        if (!valid) return
        const result = this.form.rewards.map((item, index) => {
          item.levelName = `${index + 1}等奖`
          return item
        })
        this.$emit('change', result)
        this.close()
      })
    }
  }
}
</script>

<style lang="scss">
  .component-luck-draw {
    .el-dialog__body {
      padding: 5px 20px;
    }
  }
</style>
