<!--
 * @Author: Hughie
 * @Date: 2019-12-02 10:56:52
 * @LastEditTime: 2019-12-11 15:47:50
 * @LastEditors: Hughie
 * @Description:
 -->

**复写 Antd 组件**

# CheckboxGroup

- 重置修改样式

# Form

> 自定义表单控件，使用 `mobx` 封装，适用于大型表单，主要解决大型表单性能问题

### 组件

#### Form ([查看](./Form/core/Form.tsx))

提交表单 `await ref.current!.submitForm()`

重置 `ref.current!.resetForm()`

注：

1. `initialValue` 更新后，表单会根据新的值渲染表单
2. 表单重置取 `initialValue` 第一次设置的值去重置表单，若想使用其他值重置表单，可传入新的 `initialValue` 作为 `resetForm(newValues)` 的参数
3.

```typescriptreact
<Form ref={this.formRef} initialValue={initialValue}>
	<Field name="a" label="a" required component={InputComponent} />
</Form>
```

#### Field([查看](./Form/Field.tsx))

> 每次字段值的变更只会 `re-render` 当前的 `Field` 组件，起到提高表单性能的作用

> 属性 `component` 传入的组件基本全部写好，可直接使用

```typescriptreact
// component 用法，目前项目中大多使用这种方式，若需求复杂，可使下方两种渲染空间方式
<Field
  name="w"
  label="w"
  validate={() => {}}         // 表单验证函数
  validateSuccess={() => {}}  // 表单验证成功回调
  validateType=""             // 默认写好的验证类型，比 validate 优先使用
  component={InputComponent}
/>
```

```typescriptreact
// render props 用法，最灵活的使用方式，不含 UI，只有表单逻辑
<Field name="w">
  {(data: RenderPropsConfig<FormState, 'w'>) => {
    return <Input value={data.value} onChange={e => data.setValue(e.target.value)}/>
  }}
</Field>
```

#### Consumer ([查看](./Form/core/Consumer.tsx))

> 监听表单字段值的变更而实时刷新该组件

```typescriptreact
// names 选择监听的字段，若不传，默认监听所有字段，建议写上 names，提高性能
<Consumer<FormState> names={['b', 'c']}>
  {values => {
    return <div>{values.b + values.c}</div>
  }}
</Consumer>
```

# Icon

- 自定义图标，`iconfont.com` 项目中的图标更新后，请更新 `scriptUrl`, 如下图：

  ```typescript
  const Icon = AntdIcon.createFromIconfontCN({
    // 在 iconfont.cn 上生成，需更新
    scriptUrl: '//at.alicdn.com/t/font_1456887_tp3jlmba8cf.js',
  })
  ```

# Input

- 在 `antd Input` 基础上添加属性 `trim`，用来去除值的前后空格，默认为 `undefined`

  注：表单所有输入框使用 `InputComponent`，默认 `trim` 为 `true`

# InputNumber

- `Antd InputNumber` 组件 `onChange` 事件会抛出多种数据类型的值，该组件封装后，使得 `onChange` 只抛出 `number` 类型的值

# Modal

- 重置样式
- 自定义 `footer`

# RadioGroup

- 重置修改样式

# Select

- 简化数据传入于书写

# Table

- 重置样式
- 简化分页参数输入
- 增强 typescript 类型

注：table 设置了 `scroll={{ x: 'max-content' }}` , `fixed` 只能设置一个方向, 且 `ellipsis` 无法使用，这种情况可使用组件 `Ellipsis` 代替
