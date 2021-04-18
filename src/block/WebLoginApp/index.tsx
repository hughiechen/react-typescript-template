/*
 * @Author: Hughie
 * @Date: 2021-04-14 15:35:04
 * @LastEditors: Hughie
 * @LastEditTime: 2021-04-18 17:39:58
 * @Description:  登录的页面的App，和 WebSiteApp 不一样，不适用同一个，因为WebSiteApp（依赖于左侧菜单的配置）里面涉及到路由权限，路径菜单合并计算
 */

import path from 'path'

import React, { Suspense } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import PageLoading from '@/common/components/material/PageLoading'
import { IBasicRouteChildren } from './types'

const NotFound = React.lazy(() => import('@/components/NotFound'))

const RouteItem = (props: any) => {
  const { redirect, path: routePath, exact, component: Component, key } = props
  if (redirect) {
    return <Redirect exact key={key} from={routePath} to={redirect} />
  }
  return <Route key={key} exact={exact} path={routePath} render={routeProps => <Component key={key} {...routeProps} />} />
}

export interface WebLoginProps {
  routes: IBasicRouteChildren[]
}

export const WebLoginApp: React.FC<WebLoginProps> = React.memo(({ routes }) => {
  return (
    <>
      <Switch>
        {routes.map((route, id) => {
          const { component: RouteComponent, children, ...others } = route
          return (
            <Route
              key={id}
              {...others}
              render={props => {
                return children ? (
                  <RouteComponent key={id} {...props}>
                    <Suspense fallback={<PageLoading fullScreen />}>
                      <Switch>
                        {children.map((routeChild: any, idx: number) => {
                          const { redirect, path: childPath, component, authority, exact } = routeChild
                          return RouteItem({
                            key: `${id}-${idx}`,
                            redirect,
                            path: childPath && path.join(route.path, childPath),
                            component,
                            authority,
                            exact,
                          })
                        })}
                        <Route path="*" component={NotFound} />
                      </Switch>
                    </Suspense>
                  </RouteComponent>
                ) : (
                  <Suspense fallback={<PageLoading fullScreen />}>
                    {RouteItem({
                      key: id,
                      ...route,
                    })}
                  </Suspense>
                )
              }}
            />
          )
        })}
      </Switch>
    </>
  )
})
