<!--
 * @Author: Hughie
 * @Date: 2019-12-10 13:26:52
 * @LastEditTime : 2020-01-09 17:17:17
 * @LastEditors  : yang
 * @Description:
 -->

### 日期选择控件

- 主要改了 DateSelect 的 value 的值 和 onChange，使其能接入表单系统

### demo

```tsx
// 默认选项
const DateSelectDemo = React.memo(() => {
  // 通过 DateSelect.getDefaultValue('last7day') 获取默认值
  const [state, setState] = React.useState<DateSelectValue<true>>(DateSelect.getDefaultValue('last7day'))
  return <DateSelect value={state} onChange={setState} />
})

// 自定义options
const DateSelectDemo1 = React.memo(() => {
  const [state, setState] = React.useState<DateSelectValue<false>>()

  return (
    <DateSelect
      value={state}
      undefinedAsAll={false}
      onChange={setState}
      options={[
        {
          label: '近5天',
          type: 'five',
          valueCreator: () => [moment().subtract(5, 'day').startOf('day'), moment().subtract(5, 'day').endOf('day')],
        },
        {
          label: '近10天',
          type: 'ten',
          valueCreator: () => [moment().subtract(10, 'day').startOf('day'), moment().subtract(10, 'day').endOf('day')],
        },
        {
          label: '自定义',
          type: 'custom', // 自定义选项 type 必须为 custom
          valueCreator: () => [moment().subtract(10, 'day').startOf('day'), moment().subtract(10, 'day').endOf('day')],
        },
      ]}
    />
  )
})
```
