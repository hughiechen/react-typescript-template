import pathUtil from 'path'
import React, { Suspense } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Auth, { PageNoPermission } from '@/common/components/material/Auth'
import { IAsideMenu, IRouteChildren } from './types'
import PageLoading from '@/common/components/material/PageLoading'
import { RouteConfigContext } from './RouteConfigContext'
import { ErrorBoundary, ErrorPlaceholder } from '@/common/components/material'
import { PageCard, PageLayout } from '@/common/components/layout'
import CRouteMenu from './RouteMenuUtil'

const NotFound = React.lazy(() => import('../../components/NotFound'))

export interface IRouteItem {
  url?: string
  redirect?: string
  autoRedirect?: string
  path: string
  key: string | number
  component?: React.LazyExoticComponent<any> | React.ComponentType<any>
  authority?: string
  exact?: boolean
}

const RouteItem = (props: IRouteItem) => {
  const { redirect, path: routePath, autoRedirect, component: Component, key, url = '', exact, authority } = props
  if (redirect) {
    const target = pathUtil.join(url, redirect)
    return <Redirect exact key={key} from={routePath} to={target} />
  } else if (autoRedirect) {
    return <Redirect exact key={key} from={routePath} to={autoRedirect} />
  } else if (!Component) {
    return null
  }
  return (
    <Route
      key={key}
      exact={exact}
      path={routePath}
      render={() => {
        return (
          <Auth authority={authority} noPermissionContent={<PageNoPermission />}>
            <Component key={key} />
          </Auth>
        )
      }}
    />
  )
}

export default class WebSiteApp extends React.PureComponent {
  static contextType = RouteConfigContext

  readonly context!: React.ContextType<typeof RouteConfigContext>

  autoRedirectPath: string

  authorMap: {}

  constructor(props: {}, context: React.ContextType<typeof RouteConfigContext>) {
    super(props)

    this.authorMap = new CRouteMenu(context.baseUrl, context.routerConfig).authorMap
    this.autoRedirectPath = this.findAuthorityPath(context.asideMenuConfig.slice().sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0)))[1]
  }

  findAuthorityPath = (menus: IAsideMenu[]): [boolean, string] => {
    let path = ''
    const funded = menus.some((menu: IAsideMenu) => {
      if (menu.path !== '/' && !menu.children) {
        if (menu.authority && window.appStore.authority.checkPermission(menu.authority)) {
          path = menu.path
          return true
        } else {
          const author = this.authorMap[menu.path]
          if (window.appStore.authority.checkPermission(author)) {
            path = menu.path
            return true
          }
        }
      }

      if (menu.children) {
        const [mFound, mPath] = this.findAuthorityPath(menu.children)
        path = mPath
        return mFound
      }
      return false
    })

    return [funded, path]
  }

  public render() {
    const url = this.context.baseUrl || '/'
    const routes = this.context.routerConfig

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
                    <ErrorBoundary>
                      <RouteComponent key={id} {...props}>
                        <ErrorBoundary
                          errorComponent={
                            <PageLayout>
                              <PageCard>
                                <ErrorPlaceholder />
                              </PageCard>
                            </PageLayout>
                          }
                        >
                          <Suspense fallback={<PageLoading />}>
                            <Switch>
                              {children.map((routeChild: IRouteChildren, idx: number) => {
                                const { redirect, path: childPath, autoRedirect, component, authority, exact } = routeChild
                                return RouteItem({
                                  url,
                                  key: `${id}-${idx}`,
                                  redirect,
                                  autoRedirect: autoRedirect ? this.autoRedirectPath : undefined,
                                  path: childPath && pathUtil.join(url, route.path, childPath),
                                  component,
                                  authority,
                                  exact,
                                })
                              })}
                              <Route path="*" component={NotFound} />
                            </Switch>
                          </Suspense>
                        </ErrorBoundary>
                      </RouteComponent>
                    </ErrorBoundary>
                  ) : (
                    <Suspense fallback={<PageLoading />}>
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
  }
}
