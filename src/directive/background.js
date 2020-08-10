export default {
  install (Vue) {
    Vue.directive('background', (el, binding) => {
      const params = binding.value
      if (typeof params === 'string') {
        el.style.backgroundImage = `url(${params})`
        el.style.backgroundSize = 'contain'
      } else {
        el.style.backgroundImage = `url(${params.src})`
        el.style.backgroundSize = params.size || 'contain'
      }

      el.style.backgroundRepeat = 'no-repeat'
      el.style.backgroundPosition = 'center'
    })
  }
}
