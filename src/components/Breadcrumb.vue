<!-- 面包屑，从路由自动生成 -->
<template>
  <div class="page-breadcrumb">
    <div
      v-for="(item, index) in breadcrumb"
      :key="item.path"
      class="breadcrumb">
      <span v-if="index == breadcrumb.length-1">{{ item.meta.title }}</span>
      <router-link
        v-else
        :to="item.path"
        @click.native="$fnDelKeepAliveInclude">{{ item.meta.title }}</router-link>
      <i
        v-if="index != breadcrumb.length-1"
        class="el-icon-arrow-right"/>
    </div>
    <!--
    <el-breadcrumb
      class="app-breadcrumb"
      separator-class="el-icon-arrow-right">
      <transition-group name="breadcrumb">
        <el-breadcrumb-item
          v-for="(item,index) in levelList"
          v-if="item.meta.title"
          :key="item.path">
        <span
          v-if="item.redirect === 'noredirect' || index == levelList.length-1"
          class="no-redirect">{{ item.meta.title }}</span>
          <router-link
            v-else
            :to="item.redirect||item.path">{{ item.meta.title }}{{item.path}}
          </router-link>
        </el-breadcrumb-item>
      </transition-group>
    </el-breadcrumb>
-->
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  data () {
    return {
      // levelList: null
    }
  },

  computed: {
    ...mapGetters(['breadcrumb'])
  },

  watch: {
    $route () {
      this.getBreadcrumb2()
    }
  },

  created () {
    this.getBreadcrumb2()
  },

  methods: {
    ...mapMutations(['SET_BREADCRUMB']),
    getBreadcrumb2 () {
      let routes = this.$router.options.routes
      let path = this.$route.path.split('/').filter((item) => item !== '')
      let levelList = []
      let path2 = ''
      path.forEach((name, index) => {
        let filterResult = this.iteration(routes, name)
        if (filterResult.length > 0) {
          filterResult = filterResult[0]
          levelList.push({ path: filterResult.path, meta: filterResult.meta })
          if (filterResult.children) {
            routes = filterResult.children
            if (index === path.length - 1) {
              const lastData = filterResult.children.filter((item) => item.path === '')[0]
              levelList.push({ path: lastData.path, meta: lastData.meta })
            }
          }
        }
      })
      levelList.forEach((item, index) => {
        path2 = item.path = `${path2}${index <= 0 ? '' : '/'}${item.path}`
      })
      levelList.unshift({ path: '/dashboard', meta: { title: '首页' } })
      this.SET_BREADCRUMB(levelList)
      // this.levelList = levelList
    },
    iteration (items, name) {
      return items.filter((item) => item.path === `/${name}` || item.path === name)
    },
    getBreadcrumb () {
      let matched = this.$route.matched.filter(item => item.name)
      const first = matched[0]
      if (first && first.name !== 'dashboard') {
        matched = [{ path: '/dashboard', meta: { title: '首页' } }].concat(matched)
      }
      this.SET_BREADCRUMB(matched)
      // this.levelList = matched
    }
  }
}
</script>

<style lang="scss">
  .page-breadcrumb {
    padding-bottom: 24px;
    font-size: 0;
    color: #606266;
    text-align: left;
    .breadcrumb {
      display: inline-block;
      font-size: 14px;
    }
    a {
      color: #5889ff;
    }
    i {
      width: 26px;
      text-align: center;
      color: #c0c4cc;
    }
  }
  .app-breadcrumb.el-breadcrumb {
    display: inline-block;
    margin-bottom: 24px;
    font-size: 14px;

    .el-breadcrumb__inner.is-link,
    .el-breadcrumb__inner a {
      color: #5889ff;
      font-weight: normal;
    }

    .el-breadcrumb__separator {
    }

    .no-redirect {
      color: #303133;
      cursor: text;
    }
  }
</style>
