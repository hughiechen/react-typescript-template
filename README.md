# Demo 前端框架

基于飞冰 Ice-script 脚手架创建（支持 antd 手脚架和 该构建脚本和 ui 库无关）
主要依赖 typescript、react、Mobx、axios、antd4.0 框架）

## 分支说明

- master:商用环境

## 项目启动

- 启动调试服务: `npm start`
- 构建 dist: `npm run build`
- 代码检测: `npm run task`

## 目录结构

- 入口文件: `src/index.jsx`
- 导航配置: `src/config/menu.js`
- 路由配置: `src/config/routes.js`
- 路由入口: `src/router.jsx`
- 布局文件: `src/layouts`
- 通用组件: `src/components`
- 业务组件: `src/components-x`
- 块组件 : `src/block`
- 页面文件: `src/pages`
- 公共库: `src/common`

### 其他文件 说明

- authority.json 权限文件

### 单元测试目录

```
--|--- __test__
       |--- XX.ts (文件名称和被测试的组件同名)
```

## 开发要求

- 使用 vscode 开发，统一使用文档头部说明 插件：vscode-fileheader，配置好自己的名称
- 安装 ESlint 插件，并添加配置（系统的 vscode 的 首选项、搜索 ESlint、点击对应的 setting.json，在该文件下添加）

```
    "eslint.validate":[
       "javascript",
       "javascriptreact",
       "typescript",
       "typescriptreact"
   ],
```

- 安装 Code Spell Checker 插件，用于单词拼写检测
- 目前简单的组件可以使用 hook 来写，后期将会把之前的部分组件重构成 hook
- 上传代码前确保代码已经被格式化过，原则上编写的代码不能报红（不能存在 ESLint 警告 或者 Typescript 警告）
- 每个业务 page 必须加上 `README.md`（说明一下页面业务，写上坑点，或者业务的特殊需求，方便维护）
- page 使用大写驼峰的命名方式（里面放一个 index.tsx）
- 模块化 css 使用小写驼峰方式，方便 直接 .操作
- 打包的时候回通过后续.module.less 判断是否为模块化 css
- 接口编写统一放到对应 page 或者业务组件下 Api 目录里面，接口定义的输入输出类型不能依赖 apollo codegen 自动生成的类型，因为这样会污染上层 ui。后台数据转换数据统一放到 api 里面处理，返回上层最直接需要（比如用于直接显示的数据、在这层转换好）的数据，以便减少上层 UI 页面的代码量。
- 所有组件统一使用 export default 导出组件，其他额外的元素 使用 export 导出
- 所有组件、页面开发的时候，如果使用到 UI 设计的某些色值，先判断是否为主题色或者主题相关色（参考[样色配置](./ice.config.js)），如果是主题相关色就使用样色配置表中的变量。否则后期切换主题的时候需要重新修改组件代码

## 单元测试

- 目前项目使用的是 jest+testing library 库来做单元测试，具体

  - [jest](https://jestjs.io/docs/en/getting-started)
  - [testing library](https://testing-library.com/docs/react-testing-library/intro)

- vscode 单元测试调试配置：[debug](https://jestjs.io/docs/en/troubleshooting#debugging-in-vs-code)
- 单元测试要求

  - 目前单元测试不强性要求，单针针对某些底层组件以及公用的 hook，建议进行单元测试
  - 针对某些复杂的处理函数最好做单元测试
  - 可用 vs 插件: Jest（语法提示，运行单个测试，快速更新快照）, Jest runner(快速运行单个文件内的所有单元测试)

## 更新组件

- Icon 组件更新：
  首先在 iconfont 上传更新图标，再在项目执行，
  `npm run icon [iconfont的图标在线地址]`
  - Icon 组件类型 type 值 会自动写入更新

## 接口规范

### 日期字段格式约定

时间使用 ISO8601 格式，默认东八区， 以下面为准:

```
  时间: '2020-12-09T13:37:10.024068'
  日期:  '2020-01-12T00:00:00''  和上面时间格式一样，只是后端会截掉后面的十分秒，只用年月日。 返回的时候默认时分秒为0
```

时间区间(比如一小时，两天): 整型，单位为毫秒

### 国际化方案

选用 react-intl-universal 插件进行语言切换。

原理是然后根据当前文件位置, 向上查找配置文件, 直到找到的第一个为止 然后根据配置文件, 对当前文件进行国际化分析，根据定义的文本对应的唯一 key 值获取对应的值

实现：

- 首先安装 react-intl-universal，在根目录添加 intl.config.js 配置文件,内容如下：

```js
// intl.config.js

// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

// eslint-disable-next-line @typescript-eslint/no-var-requires
module.exports = (/* {vscode, utils} */) => {
  return {
    localeDir: path.join(__dirname, 'src/locales'),
    langKey: {
      zh_CN: '中文',
      en_US: '英语',
    },
    checkFileReg: /.(?:ts|tsx)$/,
    ignoreCheckNode: nodePath => {
      return nodePath.findParent(item => {
        const node = item.node
        if ((node.type === 'NewExpression' && node.callee.name === 'Error') || (node.type === 'CallExpression' && node.callee.type === 'MemberExpression' && node.callee.object.name === 'console')) {
          return true
        }
      })
    },
  }
}
```

- 然后在 src 目录添加 locales 目录，目录内容包括各语言对应的文本 json 数据:

```js
// 英文数据：locales/en_US.json

{
  "please_fill_in_the_time_interval": "please fill in the time interval",

}
```

```js
// 中文数据：locales/zh_CN.json
{
  "please_fill_in_the_time_interval": "请填写时间区间",
}
```

- 在主入口 index.tsx 文件初始化基础组件的语言环境

```js
// index.tsx
basicIntl.init(window.lang)
```

- 定义 Intl 组件，执行 react-intl-universal 初始化,在主入口 index 里，把 App 包起来

```js
// index.tsx
<Intl>
  <App />
</Intl>
```

- 最后借用 vscode 插件 react-intl-universal 配合语法提示使用

```js
intl.get('status_pendingDeal').d('待处理')
```
