const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const isProd = process.env.NODE_ENV === 'production'

function resolve (dir) {
  return path.join(__dirname, `src/${dir}`)
}

module.exports = {
  publicPath: '/',
  chainWebpack: config => {
    // file-loader排除svg图标目录，避免file-loader处理svg图标引发webpack报错
    config.module
      .rule('svg')
      .exclude.add(resolve('assets/icons/svg'))
      .end()

    // 生成 svg 雪碧图
    config.module
      .rule('svgSpriteLoader')
      .test(/\.svg$/)
      .include.add(resolve('assets/icons/svg'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    // 自动修复eslint报错
    config.module.rule('eslint')
      .use('eslint-loader')
      .options({
        fix: true
      })
  },

  css: {
    loaderOptions: {
      // 向所有 Sass 样式传入共享的全局变量、mixins
      sass: {
        prependData: `
          @import "@/styles/_variables.scss";
          @import "@/styles/_variables-element.scss";
          @import "@/styles/_mixins.scss";
        `
      }
    }
  },

  devServer: {
    // proxy: process.env.VUE_APP_API_URL
  },

  configureWebpack: {
    optimization: {
      minimizer: isProd ? [
        new UglifyJsPlugin({
          uglifyOptions: {
            warnings: false,
            compress: {
              drop_console: true
            }
          }
        })
      ] : []
    }
  }
}
