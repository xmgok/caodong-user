<template>
  <section class="app-main">
    <breadcrumb/>
    <!--
    <transition
      name="fade"
      mode="out-in">
      &lt;!&ndash; or name="fade" &ndash;&gt;
      &lt;!&ndash; <router-view :key="key"></router-view> &ndash;&gt;
      <router-view />
    </transition>
-->
    <transition
      name="fade"
      mode="out-in">
      <keep-alive :include="keepAliveInclude">
        <router-view v-if="$route.meta.keepAlive"/>
      </keep-alive>
    </transition>

    <transition
      name="fade"
      mode="out-in">
      <router-view v-if="!$route.meta.keepAlive"/>
    </transition>

  </section>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import { mapGetters } from 'vuex'

export default {
  name: 'AppMain',

  components: {
    Breadcrumb
  },

  data () {
    return {}
  },

  computed: {
    ...mapGetters(['keepAliveInclude'])
  }
}
</script>

<style scoped>
  .app-main {
    padding: 20px;
    /*50 = navbar  */
    min-height: calc(100vh - 50px);
    position: relative;
    overflow: hidden;
  }
</style>
