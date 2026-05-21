const path = require('path')
module.exports = {
  lintOnSave: false,
  transpileDependencies: [
    'vuetify',
  ],

  devServer: {
    proxy: {
      '/dev-api': {
        target: 'http://localhost:3000',
        ws: true,
        changeOrigin: true,
        // pathRewrite: {
        //   '^/dev-api': '',
        // },
      },
    },
  },

  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [
        // 加上自己的文件路径，不能使用别名
        path.resolve(__dirname, 'src/style/index.scss'),
      ],
    },
  },
}
