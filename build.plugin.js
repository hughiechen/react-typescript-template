/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const packConfig = require('./package.json')
const webpack = require('webpack')
const fs = require('fs-extra')

const ENV = process.env.ENV || 'Production' // 环境
const AntDesignThemePlugin = require('antd-theme-webpack-plugin');
const { getLessVars } = require('antd-theme-generator')

module.exports = ({ onGetWebpackConfig, context, onHook }, options) => {
  const { command } = context
  console.log('options:', options)
  // 这Version值是从build.config.js 插件参数中带过来的
  const Version = options.Version
  const RELEASE = Version

  onGetWebpackConfig(config => {
    config.module
      .rule('mjs')
      .test(/\.mjs$/)
      .type('javascript/auto')
      .end()

    // 增加svg文件的解析
    config.module
      .rule('svg')
      .use('svg')
      .loader('@svgr/webpack')
      .options({
        svgoConfig: {
          // See: https://github.com/svg/svgo#what-it-can-do
          // Important! We need to stick to @svgr/weback v4.3.3 to prevent an issue
          // where removeViewBox is not applied (still not fixed in 5.2.0).
          plugins: [
            {
              removeViewBox: false,
              removeTitle: false,
              convertShapeToPath: false,
              mergePaths: false,
            },
          ],
        },
      })
      // 修改对应 css module的 loader，默认修改 scss-module 同理可以修改 css-module 和 less-module 规则
      // 执行 ice-scripts build 命令时
      ;['scss-module', 'less-module'].forEach(rule => {
        if (config.module.rules.get(rule)) {
          config.module.rule(rule).use('ts-css-module-loader').loader(require.resolve('css-modules-typescript-loader')).options({ modules: true, sass: true })
          // 指定应用loader的位置
          config.module.rule(rule).use('ts-css-module-loader').before('css-loader')
        }
      })

    config
      .plugin('DefinePlugin')
      // 第一项为具体插件，第二项为插件参数
      .tap(args => {
        // 根据需求返回 WebpackPluginImport 插件构造函数的参数
        return [
          {
            ...args,
            // 此处不能省略 JSON.stringify，否则构建过程会出现语法问题
            // ASSETS_VERSION: JSON.stringify("0.0.3"),
            IS_DEBUG: command !== 'build',
            RELEASE: JSON.stringify(RELEASE),
            ENV: JSON.stringify(ENV),
            // 是否为测试环境
            IS_TEST: ENV === 'Test',
            PROXY: JSON.stringify(packConfig.proxy),
          },
        ]
      })

    config.plugin('ProvidePlugin').use(
      new webpack.ProvidePlugin({
        React: 'react',
        _: 'lodash',
      })
    )
    // 注入less样式插件
    config.plugin('AntDesignThemePlugin').use(
      new AntDesignThemePlugin(
        {
          // antd目录
          antDir: path.join(__dirname, './node_modules/antd'),
          // 样式目录
          stylesDir: path.join(__dirname, './src/styles'),
          // 变量目录
          varFile: path.join(__dirname, './src/styles/variables.less'),
          mainLessFile: path.join(__dirname, './src/styles/index.less'),
          // 定义要更改的主题色less变量
          themeVariables: Array.from(new Set([
            ...Object.keys(getLessVars(path.join(__dirname, './src/styles/variables.less')))
          ])),
          indexFileName: 'index.html',
          generateOnce: false,
          lessUrl: 'https://cdnjs.cloudflare.com/ajax/libs/less.js/2.7.2/less.min.js',
          javascriptEnabled: true,
          customColorRegexArray: [],
        }
      )
    )
    if (command === 'build') {
      // config.devtool('source-map')
      config.optimization.minimize(true)
      config.optimization.runtimeChunk({
        name: 'runtime',
      })

      config.optimization.minimizer('TerserPlugin').tap(([options]) => {
        console.log('options', options)
        return [
          {
            ...options,
            sourceMap: true,
            terserOptions: {
              ...options.terserOptions,
              compress: {
                drop_console: true,
                drop_debugger: true,
                pure_funcs: ['console.log'], // 移除console
              },
            },
          },
        ]
      })

      // 修改打包的名称
      config.output.filename(path.join('js', '[name].[chunkhash:8].js'))
      config.plugin('MiniCssExtractPlugin').tap(args => [
        Object.assign(...args, {
          filename: path.join('css', '[name].[contenthash:7].css'),
        }),
      ])

      config.optimization.splitChunks({
        cacheGroups: {
          // ...config.optimization.get('splitChunks').cacheGroups,
          vender: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            // minChunks: 2,
          },
          // 修改了css chuncks规制，把相同的css 抽离到同一个 chuncks中，解决由于使用react lazy导致的样色覆盖的问题
          styles: {
            test: /\.(css|scss|less)$/,
            enforce: true, // force css in new chunks (ignores all other options)
          },
          common: {
            // 排除 css|scss|less为后缀的文件
            // test: /[\\/]src[\\/]common[\\/].*\..*$(?<!(less|css|scss))/, // Time: 163061ms
            test: module => {
              // Time: 103576ms, 使用非正则可以节省好多时间
              return (
                module.resource && /[\\/]src[\\/]common[\\/]/.test(module.resource) && !module.resource.endsWith('.css') && !module.resource.endsWith('.scss') && !module.resource.endsWith('.less')
              )
            },
            name: 'commons',
            chunks: 'all',
            minChunks: 2,
            // minSize: 10000,
            enforce: true,
            priority: 1,
            reuseExistingChunk: true,
          },
        },
      })

      onHook('after.build.compile', () => {
        // do something after build
        console.log('after.build.compile A')
        // 写入版本文件，用于前端检测版本更新
        fs.writeFileSync(
          path.join(__dirname, './build/version.json'),
          JSON.stringify({
            version: Version,
          }),
          {
            encoding: 'utf8',
          }
        )

        fs.copySync(path.join(__dirname, `/build/${RELEASE}/index.html`), path.join(__dirname, '/build/index.html'))
        // fs.copySync(path.join(__dirname, `/build/${RELEASE}/login.html`), path.join(__dirname, '/build/login.html'))
        fs.copySync(path.join(__dirname, `/build/${RELEASE}/color.less`), path.join(__dirname, '/build/color.less'))

        console.log('after.build.compile B')
      })
    }
  })
}
