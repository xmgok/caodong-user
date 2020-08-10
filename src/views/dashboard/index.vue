<template>
  <div class="page-index">
    <div class="h2">数据中心</div>
    <div class="data-wrap">
      <router-link
        :to="{ path: 'order' }"
        class="data-item">
        <div class="text1">
          <p>今日付款订单笔数</p>
          <i class="icon icon-ellipsis-v"/>
        </div>
        <p class="text2">{{ dataCenter.todayOrders }}</p>
        <p
          class="text3"
          style="display: none;">昨日：{{ dataCenter.quantity }}</p>
      </router-link>

      <router-link
        :to="{ path: '/order/after-sale' }"
        class="data-item">
        <div class="text1"><p>未处理退款笔数</p><i class="icon icon-ellipsis-v"/></div>
        <p class="text2">{{ dataCenter.refundOrders }} </p>
        <!--<p class="text2">{{dataCenter.refundOrders}} <i class="icon icon-arrow-alt-down c1"/></p>-->
        <p
          class="text3"
          style="display: none;">昨日：- -</p>
      </router-link>

      <router-link
        :to="{ path: 'order', query: {orderStatus:2} }"
        class="data-item">
        <div class="text1"><p>未发货订单笔数</p><i class="icon icon-ellipsis-v"/></div>
        <p class="text2">{{ dataCenter.deliveryOrders }}</p>
        <p
          class="text3"
          style="display: none;">昨日：- -</p>
      </router-link>

      <router-link
        :to="{ path: 'customer' }"
        class="data-item">
        <div class="text1"><p>进店客户数</p><i class="icon icon-ellipsis-v"/></div>
        <p class="text2">{{ dataCenter.allNumber }} <i
          :class="dataCenter.number > 0 ? 'icon-arrow-alt-up' : 'icon-arrow-alt-down c1' "
          class="icon"/></p>
        <p class="text3">今日新增：{{ dataCenter.number }}</p>
      </router-link>
      <!--allQuantity (integer, optional): 累计成交笔数 ,-->
      <!--quantity (integer, optional): 昨日成交笔数 ,-->
    </div>

    <div class="hd-2">
      <div class="tb-wrap">
        <div class="tb-bar">
          <div class="tabs">
            <div
              v-for="item in tabsList"
              :class="['tab-item', { active: tabsIndex == item.value }]"
              :key="item.value"
              @click="switchTab(item.value)">{{ item.text }}</div>
          </div>
          <div class="zw">
            <div
              v-if="tabsIndex <= 1"
              class="type-wrap">
              <div
                v-for="item in typeList"
                :key="item.value"
                :class="['type-item', { active: !item.show }]"
                @click="changeTypeShow(item)">
                <span :style="{'background': item.color}"/>
                <p>{{ item.text }}</p>
              </div>
            </div>
            <div
              v-else
              class="type-wrap">
              <div class="type-item">
                <span style="background: #FF7F45"/>
                <p>会员人数</p>
              </div>
            </div>
          </div>
          <div class="tabs2">
            <div
              v-for="item in tabsList2"
              :class="['tab-item', { active: tabsIndex2 == item.value }]"
              :key="item.value"
              @click="switchTab2(item.value)">{{ item.text }}</div>
          </div>
        </div>
        <div
          v-if="showTb"
          id="myChart"
          style="width: 100%; height: 340px; position: absolute; left: 0; top: 70px;"/>
      </div>
      <div style="width: 24px;"/>
      <router-link
        :to="{ path: 'asset' }"
        class="jine">
        <div style="padding: 24px">
          <div class="text1"><p>累计销售金额</p><i class="icon icon-ellipsis-v"/></div>
          <p class="text2">{{ dataCenter.allAmount }}</p>
          <p class="text3">今日新增：{{ dataCenter.amount }}</p>
          <img
            class="img"
            src="@/assets/images/index/index-bg.png" >
        </div>
      </router-link>
    </div>

    <template v-if="storeType <=0">
      <div class="h2">常用功能</div>
      <div class="common-func">
        <router-link
          :to="{ path: 'goods/add' }"
          class="item">
          <div class="tb"><i
            class="icon icon-shipping-bag"
            style="color: #FF7D77;"/></div><p>商品发布</p>
        </router-link>

        <router-link
          :to="{ path: 'order' }"
          class="item">
          <div class="tb"><i
            class="icon icon-order"
            style="color: #5889FF;"/></div><p>订单发货</p>
        </router-link>

        <router-link
          :to="{ path: 'miniapp/list' }"
          class="item">
          <div class="tb"><i
            class="icon icon-minapp"
            style="color: #76CB7A;"/></div><p>小程序管理</p>
        </router-link>

        <router-link
          :to="{ path: 'brand' }"
          class="item">
          <div class="tb"><i
            class="icon icon-crown"
            style="color: #1C2B36;"/></div><p>品牌信息</p>
        </router-link>

        <router-link
          :to="{ path: 'asset' }"
          class="item">
          <div class="tb"><i
            class="icon icon-wallet"
            style="color: #FEB724;"/></div><p>资产管理</p>
        </router-link>

        <router-link
          :to="{ path: 'goods/import' }"
          class="item">
          <div class="tb"><i
            class="icon icon-goods-import"
            style="color: #FF7D77;"/></div><p>商品导入</p>
        </router-link>

        <router-link
          :to="{ path: 'brand/material' }"
          class="item">
          <div class="tb"><i
            class="icon icon-photo"
            style="color: #7E72F3;"/></div><p>素材管理</p>
        </router-link>

        <router-link
          :to="{ path: 'setting/permission' }"
          class="item">
          <div class="tb"><i
            class="icon icon-gear"
            style="color: #5583F2;"/></div><p>权限设置</p>
        </router-link>
      </div>
    </template>
  </div>
</template>

<script>
import echarts from 'echarts'
import * as ApiIndex from '@/api/index'

export default {
  name: 'Dashboard',

  data () {
    return {
      dataCenter: {},
      showTb: true,
      fileList2: [],
      tabsList: [{ text: '订单统计', value: '1' }, { text: '会员人数', value: '2' }],
      tabsIndex: 1,
      tabsList2: [{ text: '7天', value: '7' }, { text: '15天', value: '15' }, { text: '30天', value: '30' }],
      tabsIndex2: 7,
      typeList: [{ text: '成交金额', value: '1', color: '#FF7F45', show: true }, { text: '成交笔数', value: '2', color: '#5889FF', show: true }],
      listData: []
    }
  },
  computed: {
    storeType () {
      // storeType   门店类型 0总部 1分公司 2门店
      return this.$store.getters.userInfo.storeType
    }
  },
  mounted () {
    this.getData()
    this.getList()
  },
  methods: {
    getData () {
      ApiIndex.getData().then(({ data = {} }) => {
        this.dataCenter = data
      })
    },
    getList () {
      ApiIndex.getList({ days: this.tabsIndex2, type: this.tabsIndex }).then(({ data = {} }) => {
        this.listData = data
        this.showTb = false
        setTimeout(() => {
          this.showTb = true
          setTimeout(() => this.drawLine(), 200)
        }, 100)
      }, () => {})
    },
    switchTab (value) {
      this.tabsIndex = value
      this.tabsIndex2 = 7
      this.getList()
    },
    switchTab2 (value) {
      this.tabsIndex2 = value
      this.getList()
    },
    changeTypeShow (item) {
      item.show = !item.show
      this.showTb = false
      setTimeout(() => {
        this.showTb = true
        setTimeout(() => {
          this.drawLine()
        }, 200)
      }, 100)
    },
    drawLine () {
      let data = this.listData.map((item) => (item.dateTime || ('').substring(5)))
      let data1 = this.listData.map((item) => item.amount)
      let data2 = this.listData.map((item) => item.quantity)
      let data3 = this.listData.map((item) => item.number)
      // 取数组轴显示最大数
      function yAxisMax (arr) {
        var max = Math.max.apply(null, arr)// 取数组中的最大值
        var maxint = Math.ceil(max / 10)// 去除个位数
        var maxval = maxint * 10// 补上各位十位加1
        return maxval
      }

      // y轴间隔刻度数
      var splitNumber = 5

      var maxdata1 = yAxisMax(data1)
      var maxdata2 = yAxisMax(data2)
      var maxdata3 = yAxisMax(data3)

      let myChart = echarts.init(document.getElementById('myChart'))
      let options = {
        color: this.typeList.filter((item) => item.show && item.color).map((item) => item.color),
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        grid: {
          right: '10%'
        },
        xAxis: [
          {
            type: 'category',
            axisTick: {
              alignWithLabel: false,
              lineStyle: {
                color: '#EBEEF5'
              }
            },
            axisLine: {
              lineStyle: {
                color: '#909399'
              }
            },
            data: data,
            axisLabel: {
              show: true,
              textStyle: {
                color: '#909399'
              }
            },
            splitLine: {
              show: false
            }
          }
        ],
        yAxis: [],
        series: []
      }

      if (this.tabsIndex > 1) {
        options.yAxis = [
          {
            axisTick: {
              alignWithLabel: false,
              lineStyle: {
                color: '#EBEEF5'
              }
            },
            axisLine: {
              lineStyle: {
                color: '#909399'
              }
            },
            type: 'value',
            name: '会员人数（位）',
            min: 0,
            position: 'left',
            max: maxdata3,
            splitNumber: splitNumber,
            interval: maxdata3 / splitNumber,
            splitLine: {
              show: false
            },
            axisLabel: {
              formatter: '{value}',
              textStyle: {
                color: '#909399'
              }
            }
          }
        ]
      } else {
        options.yAxis = [
          {
            axisTick: {
              alignWithLabel: false,
              lineStyle: {
                color: '#909399'
              }
            },
            axisLine: {
              lineStyle: {
                color: '#909399'
              }
            },
            type: 'value',
            name: '成交笔数（件）',
            min: 0,
            position: 'right',
            max: maxdata2,
            splitNumber: splitNumber,
            interval: maxdata2 / splitNumber,
            splitLine: {
              show: false
            },
            axisLabel: {
              formatter: '{value}',
              textStyle: {
                color: '#909399'
              }
            }
          },
          {
            axisTick: {
              alignWithLabel: false,
              lineStyle: {
                color: '#EBEEF5'
              }
            },
            axisLine: {
              lineStyle: {
                color: '#909399'
              }
            },
            type: 'value',
            name: '成交金额（元）',
            min: 0,
            position: 'left',
            max: maxdata1,
            splitNumber: splitNumber,
            interval: maxdata1 / splitNumber,
            splitLine: {
              show: false
            },
            axisLabel: {
              formatter: '{value}',
              textStyle: {
                color: '#909399'
              }
            }
          }
        ]
      }

      if (this.tabsIndex > 1) {
        options.series.push({
          name: '会员人数',
          type: 'line',
          yAxisIndex: 0,
          data: data3,
          smooth: true
        })
      } else {
        this.typeList.forEach((item) => {
          if (Number(item.value) === 1 && item.show) {
            options.series.push({
              name: '成交金额',
              type: 'line',
              yAxisIndex: 1,
              data: data1,
              smooth: true
              // symbol:'none',
            })
          }
          if (Number(item.value) === 2 && item.show) {
            options.series.push({
              name: '成交笔数',
              type: 'line',
              yAxisIndex: 0,
              data: data2,
              smooth: true
              // symbol:'none',
            }
            )
          }
        })
      }

      // 绘制图表
      myChart.setOption(options)
    }
  }
}
</script>

<style lang="scss">
  .page-index {
    .h2 {
      font-size: 16px;
      line-height: 22px;
      font-weight: bold;
      padding: 0 0 12px;
    }
    .data-wrap {
      display: -webkit-box;
      .data-item {
        display: block;
        -webkit-box-flex: 1;
        background: white;
        margin-right: 24px;
        height: 152px;
        border-radius: 8px;
        box-sizing: border-box;
        padding: 24px;
        cursor: pointer;
        &:last-child {
          margin-right: 0;
        }
        .text1 {
          font-size: 14px;
          color: #606266;
          display: -webkit-box;
          p {
            -webkit-box-flex: 1;
          }
        }
        .text2 {
          padding-top: 20px;
          color: #1C2B36;
          font-size: 30px;
          font-weight: bold;
          padding-bottom: 27px;
          line-height: 30px;
          i {
            font-size: 18px;
            color: #EE5959;
          }
          .c1 {
            color: #76CB7A;
          }
        }
        .text3 {
          color: #909399;
        }
      }
    }
    .common-func {
      background: white;
      border-radius: 8px;
      display: -webkit-box;
      padding: 24px 0;
      .item {
        display: block;
        -webkit-box-flex: 1;
        width: 1%;
        text-align: center;
        cursor: pointer;
        .tb {
          width:72px;
          height:72px;
          border-radius:36px;
          border:1px solid #EBEEF5;
          margin: 0 auto;
          line-height: 72px;
          font-size: 32px;
        }
        p {
          padding-top: 10px;
          font-size: 12px;
          color: #606266;
          line-height: 14px;
        }
        &:hover {
          .tb {
            box-shadow:0 2px 10px 0 rgba(0,0,0,0.1);
          }
        }
      }
    }
    .hd-2 {
      margin-top: 24px;
      margin-bottom: 24px;
      display: flex;
      .tb-wrap {
        background: white;
        flex:3;
        height: 408px;
        padding-right: 144px;
        border-radius: 8px;
        position: relative;
      }
      .jine {
        display: block;
        flex:1;
        height: 408px;
        border-radius: 8px;
        background:linear-gradient(270deg,rgba(71,186,255,1) 0%,rgba(34,132,255,1) 100%);
        color: white;
        box-sizing: border-box;
        position: relative;
        .img {
          position: absolute;
          right: 24px;
          bottom: 40px;
          width: 40%; height: auto;
        }
        .text1 {
          font-size: 16px;
          display: -webkit-box;
          p {
            -webkit-box-flex: 1;
          }
        }
        .text2 {
          padding-top: 80px;
          font-size: 32px;
          font-weight: bold;
          padding-bottom: 27px;
          line-height: 32px;
        }
      }
    }
    .tb-bar {
      width: 100%;height: 60px; border-bottom: 1px solid #EBEEF5; position: absolute; left: 0; top: 0;
      display: -webkit-box;
      -webkit-box-align: center;
      padding: 0 24px;
      .tabs {
        display: -webkit-box;
        .tab-item {
          margin-right: 32px;
          color: #606266;
          font-size: 14px;
          line-height: 60px;
          cursor: pointer;
          &.active {
            color: #303133;
            font-size: 16px;
            font-weight: bold;
            position: relative;
            &:before {
              content: ' ';
              position: absolute;
              left: 0;
              bottom: 0;
              background: #5889FF;
              width: 34px;
              height: 4px;
              border-radius: 2px;
            }
          }
        }
      }
      .tabs2 {
        display: -webkit-box;
        border: 1px solid #EBEEF5;
        border-radius: 18px;
        line-height: 36px;
        text-align: center;
        width: 190px;
        font-size: 14px;
        color: #606266;
        overflow: hidden;
        .tab-item {
          -webkit-box-flex: 1;
          width: 1%;
          cursor: pointer;
          &.active {
            border-radius: 18px;
            background: #5889FF;
            color: white;
          }
        }
      }
      .zw {
        -webkit-box-flex: 1;
      }
      .type-wrap {
        display: -webkit-box;
        -webkit-box-pack: center;
        .type-item {
          display: -webkit-box;
          -webkit-box-align: center;
          margin-right: 28px;
          cursor: pointer;
          &.active {
            color: #cccccc;
          }
          &:last-child {
            margin-right: 0;
          }
          span {
            width: 8px;
            height: 8px;
            border-radius: 4px;
            display: block;
            margin-right: 8px;
          }
        }
      }
    }
  }
</style>
