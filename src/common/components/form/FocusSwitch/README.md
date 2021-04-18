# FocusSwitch

全键盘操控表单控件解决方案

## 简单案例

```tsx
const FocusSwitchDemo = React.memo(() => {
  // 若不需要手动进行 nextManager.next 操作，hook 可以不写
  const nextManager = useFocusSwitch()
  return (
    <FocusSwitch manager={nextManager} scopeSelector="body">
      <Select id="aaa" style={{ width: 200 }} focusAutoOpen options={[{ label: '11', value: 11 }]} />
      <DatePicker id="bbb" />
      <Input disabled value="ccc" id="ccc" tabIndex={-1} />
      <Select id="ddd" style={{ width: 200 }} focusAutoOpen options={[{ label: '11', value: 11 }]} />
      <Input />
      <Button onClick={() => nextManager.next('#bbb')}>主动获取焦点bbb</Button>
    </FocusSwitch>
  )
})
```

## 常用 API

1. 在当前表单内进行手动切换焦点

   ```ts
   // 函数组件
   const nextManager = useFocusSwitch()

   // <input id="a" class="b"/>

   nextManager.next(selector) // "#a" | ".b", selector 为一个 css 选择器字符串

   // 类组件使用 ref 获取 FocusSwitch 进行 next 操作
   ```

2. 表单孙子组件内手动调用 `next`

   ```ts
   // 函数组件
   const next = useNext()

   // 类组件使用 context api: NextManagerContext
   static contextType = NextManagerContext
   readonly context!: React.ContextType<typeof NextManagerContext>
   ```

3. 跨越 `FocusSwitch` 操作 `next`

   ```ts
   FocusSwitch.scope(scopeSelector).next(selector)
   ```

## 注意点

1. 如果一个页面存在多个 `FocusSwitch` 且需要进行跨 `FocusSwitch` 操控 `next`，那么 `scopeSelector` 必须保证不一致，否则 `FocusSwitch.scope(scopeSelector).next(selector)` 将不会正常工作

2. 如果 `next` 需要跳过某些组件，可以在组件上设置 `tabIndex={-1}`
