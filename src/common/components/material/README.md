# 相对独立，可使用在任何地方的没有明确分类的组件

## Auth

- 授权控件，通过权限判断是否显示 `children`，另外可配置是否显示没有权限的页面

## AutoLoadingButton

- `onClick` 事件返回一个 `Promise` 对象，根据状态自动控制按钮 `loading` 图标的显示与隐藏

## Avatar

- 头像控件，根据阿鹿项目需求，包含医生和患者的不同大小的头像

## BackHeader

- 返回 `header`，`UI` 显示大致为 `< 返回`

## CustomTag

- 类似 `Antd` 的 `Tag`

## DateSelect

- 日期选择控件，包含 `今天`、`昨天`、`近7天` 等自定义日期等选择

## OperateButton

- 操作按钮，一般用于 table 里面的操作列，也可以使用`<Button type='link'>` 替代，`<Button type='link'>` 默认没有 margin，如有需要得自己加上

## PageLoading

- 页面加载控件， 目前主要用于 `React.Suspense`

## PaymentRadio

- 支付方式选择，根据阿鹿项目需求，目前支持 `现金`、`支付宝`、`银行卡`、`微信支付` 等

## SearchInput

- 搜索栏，一般用于 `Table` 列表搜索。

## Title

- 标题，左边有个竖杠。一般用于标题
