### 该例子主要说明一下子路由（嵌套路由）的写法

#### 1.旧项目的做法

```
import React from "react"
import { Switch, Route } from "react-router-dom"
import StockDeliveryAdd from "./StockDeliveryAdd"

export const DeliveryAddRoute = ({}) => {
  return (
    <Switch>
      <Route path="/deliveryManager/add/edit/:id" component={StockDeliveryAdd} />
      <Route path="/deliveryManager/add/:clinicCommodityId/:batchRecordId" component={StockDeliveryAdd} />
      <Route component={StockDeliveryAdd} />
    </Switch>
  )
}

```

#### 2.新项目的做法：

2.1 规范命名 嵌套路由名称统一为：subRoutes.ts
2.2 使用配置的方式替代组件编写的方式，和主路由写法保持一致。

- 配置方式好处：规范、清晰
- 组件写法：灵活

结合项目的情况：选择使用配置的方式，因为项目中嵌套路由的写法比较固定。所以可以使用代码模板+配置的方式替代组件方式。

2.3 规范

- 嵌套的 page 放在 components，取名为 \*Page 用于区分页面或者组件，或者可以新增一个文件夹 subPage 用于存放

  2.4 参考模板代码（若需要自己定制化可以查考一下代码）

```
export default class TestPage extends React.PureComponent<ITestPageProps> {
  constructor(props: ITestPageProps) {
    super(props)
  }

  get renderLeft() {
    return (
      <Tabs animated={false} defaultActiveKey={this.props.location.pathname} onChange={key => this.props.history.push(key)}>
        {routes.map((record, index) => {
          return <TabPane key={record.path} tab={record.name} />
        })}
      </Tabs>
    )
  }

  // 这写法完全可以固定
  get renderLeft_Buton() {
    return (
      <Radio.Group value={this.props.location.pathname} onChange={(e: RadioChangeEvent) => this.props.history.push(e.target.value)} style={{ marginBottom: 8 }}>
        {routes.map((record, index) => {
          return (
            <Radio.Button key={index} value={record.path}>
              {record.name}
            </Radio.Button>
          )
        })}
      </Radio.Group>
    )
  }

 // 这写法完全可以固定
  render() {
    console.log('url:', this.props)
    return (
      <CardPage left={this.renderLeft_Buton}>
        {routes.map((record, index) => {
          return <Route path={record.path} exact={true} component={record.component} />
        })}
        <div>这是全局的不会切换内容全局</div>
      </CardPage>
    )
  }
}
```

2.5 路由配置写法 名称尽量统一：subRoutes.ts

```
import Bus from './components/SubPage1'
import Car from './components/SubPage2'

const routes: Array<AluRouteConfig.ISubRouteItem> = [
  {
    name: '待就诊',
    path: '/nurse/test2',
    component: Bus,
  },
  {
    name: '正在就诊',
    path: '/nurse/test2/cart',
    component: Car,
    authority: '111',
  },
  {
    name: '就诊记录',
    path: '/nurse/test2/cart2',
    component: Car,
  },
]

export default routes

```

2.6 使用方式

```
import React from 'react'
import { Button } from 'antd'
import { SubRoutePage } from '@/common/components/layout'
import routes from './subRoutes'

const SubRouteTestPage: React.FC = () => {
  return (
    <SubRoutePage
      routes={routes}
      right={
        <Button type="primary" ghost>
          登记就诊
        </Button>
      }
    />
  )
}

export default SubRouteTestPage

```

2.7 自定义 `SubRoutePage` 中的 `right & footer`

- 可以通过 `right & footer` 属性定义，所有 `Tab` 页面公用

- 为每个 `Tab` 页面定义自己的 `right & footer`

  ```
  ...
  render() {
    return (
      <SubRoutePagePortal location="right">{...}</SubRoutePagePortal>
      <SearchBar/>
      <Table>{...}</Table>
      <SubRoutePagePortal location="footer">{...}</SubRoutePagePortal>
    )
  }
  ...

  ```

## 注意事项

默认会重定向到第一项，目前不支持重定向指定，后期有需求可以增加个排序好来控制
