<!-- 处理侧边栏导航菜单项跳转，若传入外链，则生成a标签；否则为vue-router跳转 -->
<template>
  <div>
    <a
      v-if="isExternalLink"
      :href="to"
      target="_blank">
      <slot/>
    </a>
    <router-link
      v-else
      :to="to"
      @click.native="$fnDelKeepAliveInclude">
      <slot/>
    </router-link>
  </div>
</template>

<script>
import { validateURL } from '@/utils/validate'

export default {
  name: 'SidebarMenuLink',

  props: {
    // 跳转路径
    to: {
      type: String,
      required: true
    },
    // 组件的name
    name: {
      type: String,
      default: ''
    }
  },

  computed: {
    // 是否是合法的外链
    isExternalLink () {
      return validateURL(this.to)
    }
  }
}
</script>
