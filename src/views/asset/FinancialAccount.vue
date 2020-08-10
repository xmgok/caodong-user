<template>
  <div class="page-asset_financial_act">
    <el-card class="box-card mb10">
      <div slot="header">
        <span>账户概况</span>
      </div>
      <el-row>
        <el-col :span="12">
          <p class="f18">结算金额（元）</p>
          <p class="f24 fb ui-color1 pt10">￥{{ infoData.withdrawAmount }}</p>
        </el-col>
        <el-col :span="12">
          <p class="f18">收入流水（元）</p>
          <p class="f24 fb ui-color1 pt10">￥{{ infoData.settlementAmount }}</p>
        </el-col>
      </el-row>
    </el-card>
    <!-- card 报表 -->
    <el-card class="box-card">
      <div slot="header">
        <span>账户概况</span>
      </div>
      <div
        class="pb20"
        style="display: -webkit-box">
        <select-store
          labelwidth="80px"
          selectwidth="194px"
          @change="changeSelectStore"/>
        <el-button
          class="ml20"
          round
          type="primary"
          icon="el-icon-search"
          @click="search"
        >查询</el-button>
      </div>
      <el-row>
        <el-col :span="12">
          <el-row>
            <el-col :span="12">
              <p class="f16">今日收款（元）</p>
              <p class="pt10"><span class="f24 fb ui-color1">￥{{ infoData.inAmount }}</span><span>（{{ infoData.inQuantity }}笔）</span></p>
            </el-col>
            <el-col :span="12">
              <p class="f16">昨日收款（元）</p>
              <p class="pt10"><span class="f24 fb ui-color1">￥{{ infoData.lastInAmount }}</span><span>（{{ infoData.lastInQuantity }}笔）</span></p>
            </el-col>
          </el-row>
          <div class="echarts_wrap">
            <!-- 收款折线图 -->
            <ul class="tabs_wp">
              <li
                v-for="(v,i) in tabsList"
                :key="i"
                :class="{ active: tabsIndex1 == v.value }"
                @click="tabClick(v,1)"
              >{{ v.text }}</li>
            </ul>
            <div
              v-if="showTb1"
              id="myChart1"
              class="echarts_box mt30"/>
          </div>
        </el-col>
        <el-col
          :span="12"
          style="border-left: 1px dashed #ccc; padding-left: 20px;">
          <el-row>
            <el-col :span="12">
              <p class="f16">今日退款（元）</p>
              <p class="pt10"><span class="f24 fb ui-color1">￥{{ infoData.outAmount }}</span><span>（{{ infoData.outQuantity }}笔）</span></p>
            </el-col>
            <el-col :span="12">
              <p class="f16">昨日退款（元）</p>
              <p class="pt10"><span class="f24 fb ui-color1">￥{{ infoData.lastOutAmount }}</span><span>（{{ infoData.lastOutQuantity }}笔）</span></p>
            </el-col>
          </el-row>
          <div class="echarts_wrap">
            <!-- 收款折线图 -->
            <ul class="tabs_wp">
              <li
                v-for="(v,i) in tabsList"
                :key="i"
                :class="{ active: tabsIndex2 == v.value }"
                @click="tabClick(v,2)"
              >{{ v.text }}</li>
            </ul>
            <div
              v-if="showTb2"
              id="myChart2"
              class="echarts_box mt30"/>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <div
      class="tips"
      style="display: none">
      <div>关于交易费率、资金提现，请注意：</div>
      <div class="text3">1、交易费率：按照银行规定，每笔交易手续费率为0.6%，系统将自动扣除；
        <br>2、结算时间：当天收款金额2天后可申请提现；
        <br>3、提现时间：成功申请提现，2小时内到账；非工作日、节假日的提现和结算可能出现延迟；
        <br>4、提现金额：满100元方可提现；
        <br>5、提现失败：若发生提现失败，则金额会自动回到账户余额中，可再次申请提现
        <br>
      </div>
    </div>
  </div>
</template>

<script>
import * as ApiAssets from '@/api/assets'
import SelectStore from '@/components/SelectStore'

import echarts from 'echarts'
export default {
  name: 'FinancialAccount',
  components: { SelectStore },
  data () {
    return {
      storeId: '',
      companyId: '',
      infoData: {
        // settlementAmount: '0.00',
        // withdrawAmount: '0.00',
        // inAmount: '0.00',
        // inQuantity: 0,
        // lastInAmount: '0.00',
        // lastInQuantity: 0,
        // outAmount: '0.00',
        // outQuantity: 0,
        // lastOutAmount: '0.00',
        // lastOutQuantity: 0
      },
      showTb1: true,
      showTb2: true,
      tabsList: [{ text: '7天', value: 7 }, { text: '15天', value: 15 }, { text: '30天', value: 30 }],
      tabsIndex1: 7,
      tabsIndex2: 7,
      listData1: [],
      listData2: []
    }
  },
  computed: {
    allAmount () {
      const money = Number(this.infoData.settlementAmount) + Number(this.infoData.withdrawAmount)
      return Number(money).toFixed(2)
    }
  },
  mounted () {
    this.getInfo()
    this.search()
  },
  methods: {
    search () {
      this.getInfo()
      this.getList(1)
      this.getList(2)
      window.onresize = () => {
        this.getList(1)
        this.getList(2)
      }
    },
    getInfo () {
      ApiAssets.getInfo({ storeId: this.storeId, companyId: this.companyId }).then(({ data }) => {
        // this.infoData = Object.assign(this.infoData, data)
        this.infoData = data
      })
    },
    changeSelectStore (val) {
      this.storeId = val.storeId || ''
      this.companyId = val.companyId || ''
    },
    tabClick (val, id) {
      this[`tabsIndex${id}`] = val.value
      this.getList(id)
    },
    handleItemChange (val) {
      setTimeout(_ => {
        if (val.indexOf('总部') > -1 && !this.options2[0].cities.length) {
          this.options2[0].cities = [{
            label: '分公司'
          }]
        } else if (val.indexOf('分公司') > -1 && !this.options2[1].cities.length) {
          this.options2[1].cities = [{
            label: '门店'
          }]
        }
      }, 300)
    },
    getList (num) {
      ApiAssets.assetaccountHistory({ storeId: this.storeId, companyId: this.companyId, days: this[`tabsIndex${num}`] }).then(({ data = [] }) => {
        this[`showTb${num}`] = false
        setTimeout(() => {
          this[`showTb${num}`] = true
          setTimeout(() => {
            this.drawLine(data, num)
          }, 200)
        }, 100)
      }, () => { })
    },
    drawLine (echartsData, type) {
      let data = echartsData.map((item) => (item.assetDate || ''))
      let data1 = echartsData.map((item) => (type === 1 ? (item.inAmount || 0) : (item.outAmount || 0)))
      let myChart = echarts.init(document.getElementById(`myChart${type}`))
      // 取数组轴显示最大数
      function yAxisMax (arr) {
        var max = Math.max.apply(null, arr)// 取数组中的最大值
        var maxint = Math.ceil(max / 10)// 去除个位数
        var maxval = maxint * 10// 补上各位十位加1
        return maxval
      }
      var maxdata1 = yAxisMax(data1)
      let options = {
        title: {
          subtext: type === 1 ? '收款金额（元）' : '退款金额（元）'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        xAxis: {
          type: 'category',
          data: data,
          axisTick: {
            alignWithLabel: false,
            lineStyle: {
              color: '#999'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#999'
            }
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: '#999'
            }
          }
        },
        yAxis: {
          type: 'value',

          axisLine: {
            lineStyle: {
              color: '#999'
            }
          },
          min: 0,
          max: maxdata1, // y轴最大值
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          }
        },
        series: [{
          data: data1,
          type: 'line',
          name: type === 1 ? '收款金额' : '退款金额',
          color: ['#0188fb']
        }]
      }
      // 绘制图表
      myChart.setOption(options)
    }
  }
}
</script>

<style lang="scss">
  .page-asset_financial_act {

    .echarts_box {
      width: 100%;
      height: 340px;
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
    }
    .echarts_wrap {
      width: 100%;
      height: 380px;
      position: relative;
    }
    .tabs_wp {
      position: absolute;
      right: 40px;
      top: 40px;
      display: -webkit-box;
      border: 1px solid #ebeef5;
      border-radius: 18px;
      line-height: 36px;
      text-align: center;
      width: 190px;
      font-size: 14px;
      color: #606266;
      overflow: hidden;
      z-index: 100;
      li {
        -webkit-box-flex: 1;
        width: 1%;
        cursor: pointer;
        &.active {
          border-radius: 18px;
          background: #5889ff;
          color: white;
        }
      }
    }
  }
</style>
