<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      unique-opened
      mode="vertical"
      background-color="#1c2b36"
      text-color="#a5aaae"
      active-text-color="#ffffff"
    >
      <div class="sidebar-header">
        <img
          :src="avatar || require('@/assets/images/avatar_default.png')"
          class="avatar">
          <!--<div class="role-name">店长</div>-->
          <!--<div class="nickname">Sand & Foam</div>-->
      </div>
      <template v-if="roles.length && forceRender">
        <sidebar-item
          v-for="route in routes"
          :key="route.name"
          :item="route"
          :base-path="route.path"
        />
      </template>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'

export default {
  components: { SidebarItem },

  data () {
    return {
      forceRender: true
    }
  },

  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'roles'
    ]),
    routes () {
      let routes = [...this.$router.options.routes]

      // 检查是否有权限访问
      const checkNoPermission = (i) => {
        if (!this.roles.length) return false
        if (!i.meta || !i.meta.code) return false
        return i.meta && i.meta.code && !this.roles.includes(i.meta.code)
      }

      // 菜单权限控制
      routes = routes.map(item => {
        if (checkNoPermission(item)) {
          item.noPermission = true
        }

        let childrendPermissionCount = 0 // 有权限的子菜单数量
        if (item.children && item.children.length) {
          item.children = item.children.map(it => {
            if (checkNoPermission(it)) {
              it.noPermission = true
              // 子级有权限，放开父级菜单
              item.noPermission = false
            } else {
              childrendPermissionCount++
            }
            return it
          })
        }

        // 子级皆无权限，隐藏父级
        if (item.children && childrendPermissionCount === 0) {
          item.noPermission = true
        }

        return item
      })

      /* eslint-disable vue/no-side-effects-in-computed-properties */
      this.forceRender = false
      this.$nextTick(() => {
        this.forceRender = true
      })

      // console.log(this.roles)
      // if (this.roles.length > 0) {

      // } else {
      //   console.log('no roles')
      //   routes = routes.map(item => {
      //     console.log(item)
      //     if (item.path !== '/' && item.meta && item.meta.code) {
      //       // item.noPermission = true
      //       if (item.children && childrendPermissionCount === 0) {
      //         item.noPermission = true
      //       } else {

      //       }
      //     }
      //     return item
      //   })
      // }
      return routes
    },
    isCollapse () {
      return !this.sidebar.opened
    }
  }
}
</script>
