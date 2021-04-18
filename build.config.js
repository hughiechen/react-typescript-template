/*
 * @Author: Hughie
 * @Date: 2020-10-09 09:42:58
 * @LastEditTime: 2021-04-18 17:37:16
 * @LastEditors: Hughie
 * @Description:
 */

/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const packConfig = require('./package.json')
const moment = require('moment')

let Version = process.env.Version || 'last'

Version = `${Version.replace(/[./]/g, '_')}_${moment().format('YYYYMMDDHHmmss')}`

module.exports = {
  disableRuntime: true,
  entry: {
    index: 'src/index.tsx',
    login: 'src/loginApp/index.tsx',
  },
  alias: {
    variables: path.resolve(__dirname, './src/styles/variables.less'), // support import in less; example in less file: @import "~variable";
    /**
     * ref: https://github.com/gaearon/react-hot-loader#hot-loaderreact-dom
     * @hot-loader/react-dom replaces the "react-dom" package of the same version, but with additional patches to support hot reloading.
     */
    // 'react-dom': '@hot-loader/react-dom',
    '@': path.resolve(__dirname, './src'),
    types: path.resolve(__dirname, './src/common/types'),
  },
  plugins: [
    ['build-plugin-antd'],
    [
      'build-plugin-moment-locales',
      {
        locales: ['zh-cn'],
      },
    ],
    [
      './build.plugin.js',
      {
        Version,
      },
    ],
  ],
  extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.html'],
  outputDir: `build/${Version}/`,
  publicPath: `/${Version}/`,

  devServer: {
    historyApiFallback: {
      disableDotRule: true,
      rewrites: [{ from: /^\/login/, to: '/login.html' }],
    },
  },
  proxy: {
    '/api': {
      enable: true,
      target: packConfig.proxy,
    },
    '/mock': {
      enable: true,
      target: 'http://baidu.com',
    },
  },
}
