<template>
  <div
    :class="classObj"
    class="app-wrapper">
    <sidebar class="sidebar-container"/>

    <div class="main-container">
      <navbar/>
      <app-main/>
    </div>
  </div>
</template>

<script>
import Navbar from './Navbar'
import AppMain from './AppMain'
import Sidebar from './components/Sidebar'
import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'Layout',

  components: {
    Navbar,
    AppMain,
    Sidebar
  },

  mixins: [ResizeMixin],

  computed: {
    sidebar () {
      return this.$store.state.app.sidebar
    },
    device () {
      return this.$store.state.app.device
    },
    classObj () {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },

  methods: {
    handleClickOutside () {
      this.$store.dispatch('CloseSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss" scoped>
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar {
      position: fixed;
      top: 0;
    }
  }
</style>
