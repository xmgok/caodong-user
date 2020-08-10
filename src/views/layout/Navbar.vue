<template>
  <div
    class="navbar"
    mode="horizontal">
    <div class="navbar-title">
      <span>草动后台管理系统</span>
    </div>

    <div class="store-selector">
      <template v-if="userInfo.storeDetail">
        <div
          :class="{ hide: showMoreStore }"
          class="store-detail-wrap">
          (<span
            ref="storeDetail"
            class="store-detail">{{ userInfo.storeDetail }}</span>)
        </div>
        <el-popover
          :class="{ 'store-popover-hide': !showMoreStore }"
          trigger="hover"
          placement="bottom-end"
          width="400">
          {{ userInfo.storeDetail }}
          <div
            slot="reference"
            class="store-detail-wrap">
            (<span class="store-detail">{{ userInfo.storeDetail }}</span>)
          </div>
        </el-popover>
      </template>

      <el-dropdown @command="selectStore">
        <div class="el-dropdown-link">
          {{ mobile }}
          <i class="el-icon-arrow-down el-icon--right"/>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="item in storeList"
            :key="item.value"
            :command="item.value">{{ item.label }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      storeList: [
        { value: 2, label: '修改密码' },
        { value: 1, label: '退出账号' }
      ],
      storeDetailWidth: 0
    }
  },

  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'mobile',
      'userInfo'
    ]),
    // storeType () {
    //   // storeType   门店类型 0总部 1分公司 2门店
    //   return ['总部', '分公司', '门店'][this.userInfo.storeType]
    // },
    showMoreStore () {
      return this.storeDetailWidth >= 200
    }
  },

  mounted () {
    const $storeDetail = this.$refs.storeDetail
    if (!$storeDetail) return
    const { width } = $storeDetail.getBoundingClientRect()
    this.storeDetailWidth = width
  },

  methods: {
    selectStore (command) {
      if (command === 1) {
        this.$store.dispatch('FedLogOut')
      } else if (command === 2) {
        this.$router.push('/setting/account')
      }
    },
    toggleSideBar () {
      this.$store.dispatch('ToggleSideBar')
    },
    logout () {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .el-popper {
    width: 120px;
  }
  .store-detail {
    display: inline-block;
    cursor: pointer;
    @include ellipsis(1, null, 200px);
    &-wrap {
      display: flex;
      align-items: center;
      margin-right: 10px;
      &.hide {
        position: absolute;
        top: -9999px;
        left: -9999px;
      }
    }
  }
  .store-popover-hide {
    position: absolute;
    top: -9999px;
    left: -9999px;
  }
</style>

<style lang="scss">
  .navbar {
    display: flex;
    height: 60px;
    line-height: 60px;
    padding: 0 0 0 20px;
    border-bottom: 1px solid #dcdfe6;
    background: white;
    box-shadow: 0 2px 6px 0 rgba(220, 223, 230, 0.5);
    box-sizing: border-box;
    .navbar-title {
      flex: 1;
      font-size: 18px;
      color: #3f5362;
      display: flex;
      align-items: center;

      img {
        display: block;
        width: 24px;
        height: 24px;
        margin-right: 8px;
      }
    }

    .store-selector {
      height: 60px;
      display: flex;
      position: absolute;
      right: 20px;
      color: #606266;
      font-size: 14px;

      .el-dropdown-link {
        display: flex;
        align-items: center;
        height: 100%;
        cursor: pointer;
      }
    }
  }
</style>
