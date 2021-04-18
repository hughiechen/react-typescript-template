# 表单组件

该表单组件基于 `Mobx` 封装，利用到 `Mobx` 可定点刷新组件的特性，解决大型表单性能问题。

## 组件

### Form

存储表单数据在 `context` 中，提供给子孙组件。表单提交时，需要通过 `ref` 获取 `Form` 实例调取 `submitForm` 方法来进行表单验证

注：`initialValue`, `initialVisible` 两个属性可通过 `enableReinitialize` 属性控制是否允许被外部传进来的多次初始化，默认为支持多次初始化

### Field

表单项组件，提供绑定数据到字段，表单验证，渲染默认 `Antd Form.Item` 的 `UI`，存在三种渲染方式:

1. `component` 属性传入一个组件，目前用的最多
2. `children` 传入一个函数，返回一个 `React.ReactElement`, 默认不包含任何 `UI`

#### Field.FormItem

重置样式后的 `Antd FormItem`，用在 `children render props` 中

### Consumer

表单消费组件，类似 `React context Consumer`，因为表单每次的更新在 `Field` 层级，所以如果需要依赖表单字段值的变化来更新其他位置界面，可用到该组件，例子：

```tsx
<Consumer<FormState> names={['b', 'c']}>{values => <div>{values.b + values.c}</div>}</Consumer>
```

`names` 属性可以绑定字段名称，例子中表示只有，`b`, `c` 两个字段值变化，那么重渲染组件 `Consumer`，如果不输入 `names`，默认为所有的字段值改变会触发 `Consumer` 组件重渲染，为了提高表单性能，建议加上 `names` 属性

## 复杂案例

#### 可编辑 Table 注意点

[代码演示](../../../../../storybook/common/components/basic/Form/Demo3/index.tsx)

1. `Form` 支持外部传入 `store`

   ```typescriptreact
   // 自己的 mobx store
   class Store {
       @observable list: AnyObject<Item> = {}
       ...
       getList() {
           // ....
       }
   }

   // 组件
   import { Store as FormStore} from '@/common/components/basic'

   export const TableFormDemo2: React.FC = observer(() => {
   // mobx store 实例化，作为表单的 values
   const [store] = useCache(() => new FormStore(new Store()))

   useDidMount(() => {
       store.values.getList()
   })

   return (
       <Form store={store}>
       ...
       </Form>
   )
   })
   ```

2. 表单可完美支持 `{ key: value }` 类型的对象，`Field` 组件可以通过 `key` 将输入控件与 `value` 绑定起来，实现双向绑定的效果。但是对数组支持不太友好，数组的 `key` 一般包含下标，如：`list[index]name`，当表单发生删除，添加，分页操作时，同一个 `key` 指向的不是同一个 `value`，这时绑定不是一一对应的。这里需要将数组转化为对象：

   ```typescript
   // api 获取到数据后，进行数组转化为对象操作
   // 使用 list 数据中的唯一标识作为 key，一般可以取 id，如果 id 可能相同，比如删除一条数组，新增时的 id 和之前删除的一样，可以使用 createTime，必须为唯一标识
   this.list = ClinicUtil.mapTableListToObject(result.list, item => `${item.id}`)
   ```

3. `Field` 组件设置绑定的 `key`

   ```typescriptreact
   // 该函数赋值给 Table.Column 组件 render 属性
   const renderName = React.useCallback((text: any, record: Item) => {
       // 通过 `list.${record.id}.name` 来绑定 store 中的值
       return (
           <Field name={`list.${record.id}.name`} noStyle>
               <Input onChange={() => record.log()} />
           </Field>
       )
   }, [])
   ```

4. `Table` 组件需要的还是一个数组，需要将对象转化为数组

   ```typescriptreact
   <Table
       rowKey="id"
       dataSource={Object.values(store.values.list)}>
   ```
