<template>
  <div
    v-if="!item.hidden && item.children"
    class="menu-wrapper">
    <!-- 无子菜单 -->
    <template
      v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children || onlyOneChild.noShowingChildren) && !item.alwaysShow">
      <sidebar-menu-link
        :to="resolvePath(onlyOneChild.path)"
        :name="onlyOneChild.name">
        <el-menu-item
          :index="resolvePath(onlyOneChild.path)"
          :class="{'submenu-title-noDropdown': !isNest}">
          <sidebar-menu-item
            v-if="onlyOneChild.meta"
            :icon="onlyOneChild.meta.icon || item.meta.icon"
            :title="onlyOneChild.meta.title"/>
        </el-menu-item>
      </sidebar-menu-link>
    </template>

    <!-- 有子菜单 -->
    <el-submenu
      v-else-if="!item.noPermission"
      :index="item.name || item.path">
      <template slot="title">
        <sidebar-menu-item
          v-if="item.meta"
          :icon="item.meta.icon"
          :title="item.meta.title"/>
      </template>

      <template
        v-for="child in item.children"
        v-if="!child.hidden && !child.noPermission">
        <sidebar-item
          v-if="child.children && child.children.length > 0"
          :is-nest="true"
          :item="child"
          :key="child.path"
          :base-path="resolvePath(child.path)"
          class="nest-menu"/>
        <sidebar-menu-link
          v-else
          :to="resolvePath(child.path)"
          :name="child.name"
          :key="child.name">
          <el-menu-item :index="resolvePath(child.path)">
            <sidebar-menu-item
              v-if="child.meta"
              :icon="child.meta.icon"
              :title="child.meta.title"/>
          </el-menu-item>
        </sidebar-menu-link>
      </template>
    </el-submenu>
  </div>
</template>

<script>
import path from 'path'
import { validateURL } from '@/utils/validate'
import SidebarMenuItem from './SidebarMenuItem'
import SidebarMenuLink from './SidebarMenuLink'

export default {
  name: 'SidebarItem',

  components: {
    SidebarMenuItem,
    SidebarMenuLink
  },

  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },

  data () {
    return {
      onlyOneChild: null
    }
  },

  methods: {
    hasOneShowingChild (children, parent) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item
          return true
        }
      })

      // When there is only one child router, the child router is displayed by default
      // if (showingChildren.length === 1) {
      //   return true
      // }

      // 父级路由meta中设置 onlyShowParent 为 true，不展示其子路由
      if (parent.meta && parent.meta.onlyShowParent) {
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    resolvePath (routePath) {
      if (this.isExternalLink(routePath)) {
        return routePath
      }
      return path.resolve(this.basePath, routePath)
    },
    isExternalLink (routePath) {
      return validateURL(routePath)
    }
  }
}
</script>
