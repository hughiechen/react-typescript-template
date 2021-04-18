# 公共样式

- variables.less 放置公共的 css 变量。非覆盖 antd 样色的公共变量必须声明在这，不能放在 src/ice.config 的主题变量下，ice.config 的主题变量默认用于覆盖 antd 主题样色。

# 主题换肤方案

使用 [antd-theme-webpack-plugin](https://github.com/mzohaibqc/antd-theme-webpack-plugin) 生成主题色 less 文件，全局定义 var 变量，通过 less 动态编译修改主题色

具体实现过程：

- styles 目录添加主题变量 less 文件 variables.less

```css
/* styles/variables.less */

/* 注意：要引入antd主题色 */
@import '~antd/lib/style/themes/default.less';

@primary-color: #7cb9c6;
```

- 然后在 styles 添加主入口文件 index.less，引入 less 变量, 定义全局变量--primary-color

```css
/* styles/index.less */

@import './variables.less';

// 引入默认全局样式
:root {
  /** 主色 */
  --primary-color: @primary-color;
}
```

- 安装 antd-theme-webpack-plugin ，在 build.plugin.js 引入使用

```js
// build.plugin.js

const AntDesignThemePlugin = require('antd-theme-webpack-plugin')
const { getLessVars } = require('antd-theme-generator')

module.exports = ({ onGetWebpackConfig, context, onHook }, options) => {
  onGetWebpackConfig(config => {
    // 注入less样式插件
    config.plugin('AntDesignThemePlugin').use(
      new AntDesignThemePlugin({
        // antd目录
        antDir: path.join(__dirname, './node_modules/antd'),
        // 样式目录
        stylesDir: path.join(__dirname, './src/styles'),
        // 变量目录
        varFile: path.join(__dirname, './src/styles/variables.less'),
        mainLessFile: path.join(__dirname, './src/styles/index.less'),
        // 定义要更改的主题色less变量
        themeVariables: Array.from(new Set([...Object.keys(getLessVars(path.join(__dirname, './src/styles/variables.less')))])),
        indexFileName: 'index.html',
        generateOnce: false,
        lessUrl: 'https://cdnjs.cloudflare.com/ajax/libs/less.js/2.7.2/less.min.js',
        javascriptEnabled: true,
        customColorRegexArray: [],
      })
    )
  })
}
```

- 在 index.html 中在线引入 less.js 编译文件，并引入生成的 color.less 文件

```html
<!-- index.html -->
<body>
  <!-- 看这里 -->
  <link rel="stylesheet/less" type="text/css" href="/color.less" />

  <div id="ice-container"></div>
</body>
<!-- 看这里 -->
<script>
  window.less = {
    async: false,
    env: 'production',
    javascriptEnabled: true,
  }
</script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/less.js/2.7.2/less.min.js"></script>
```

- 然后就可以在项目中愉快使用 var 定义全局样式变量啦

```css
p {
  color: var(--primary-color);
}
```

- 要更改的话，调用 window.less 方法更改,如下：

```js
window.less.modifyVars({
  '@primary-color': '#000',
})
```
