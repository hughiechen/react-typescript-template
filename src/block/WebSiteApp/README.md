<!--
 * @Author: Hughie
 * @Date: 2020-01-02 16:21:27
 * @LastEditTime : 2020-01-14 10:35:12
 * @LastEditors  : Hughie
 * @Description:
 -->

## 站点 app

- 把原站点的 app 抽离出来，因为多个站点代码是相同的，使用了 context 注入配置的方式主要是为了解决深层组件次使用配置，以及循环依赖倒是 undefined 的问题

#### 内容：

- index: 站点 app 组件
- CRouteMenu：主要是处理菜单和路由的一些公共类，主要功能是是拼接 baseUrl
- RouteConfigContext： 配置注入声明
- types： 菜单和路由 的类型

#### 例子：

```
import { asideMenuConfig } from './config/menu'
import { BASEURL } from './config/constants'
import routerConfig from './config/routes'

interface IAppProps {}

const value = { baseUrl: BASEURL, routerConfig, asideMenuConfig }

const App: React.FunctionComponent<IAppProps> = () => {
  return (
    <RouteConfigContext.Provider value={value}>
      <WebSiteApp />
    </RouteConfigContext.Provider>
  )
}

export default documentTitle('护士站_健康阿鹿')(App)
```
