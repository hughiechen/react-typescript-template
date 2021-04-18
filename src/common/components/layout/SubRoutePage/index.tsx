import React, { Suspense } from 'react'
import { RouteComponentProps, withRouter, Route, Redirect, Switch, matchPath } from 'react-router-dom'
import { Radio, Badge } from 'antd'
import classnames from 'classnames'
import { RadioChangeEvent } from 'antd/lib/radio'
import PageCard, { PageCardProps } from '@/common/components/layout/PageCard'
import { Omit } from '@/common/types/rewrite'
import styles from './index.module.less'
import { PageLoading } from '../../material'
import { LocationDescriptorObject, History } from 'history'
import querystring from 'query-string'
import Auth, { PageNoPermission } from '@/common/components/material/Auth'
import { Context, ContextState } from './Context'
import { PageLayout } from './PageLayout'

type ISubRouteItem = AluRouteConfig.ISubRouteItem
type ISubRouteItems = Array<ISubRouteItem>

/**
 * 该接口被 CleanSubRoutePage 继承，修改接口在此处做
 */

export interface ISubRoutePageOwnProps extends Omit<PageCardProps, 'left' | 'right'> {
  basename?: string
  routes: ISubRouteItems
  right?: React.ReactNode | ((path: History) => React.ReactNode)
  emptyPlaceholder?: React.ReactNode
  // 内嵌模式下，没有header line、内容padding 0 20 20 20
  nested?: boolean
  // fill为true，内容区没有padding
  fill?: boolean
  /**
   * 切换的时候是否合并当前的search信息（url ? 后面的query），如果ignoreSearch=true(默认为true)，那么将不会自动copy当前的location.search的信息
   */
  mergeSearch?: boolean
}

export interface ISubRoutePageProps extends ISubRoutePageOwnProps, RouteComponentProps<{}> {}

interface State {
  context: ContextState
}

export { History }

class SubRoutePageBase extends React.PureComponent<ISubRoutePageProps, State> {
  static defaultProps: Partial<ISubRoutePageOwnProps> = {
    basename: '',
    mergeSearch: true,
  }

  /** 为 SubRoutePage 容器上添加一个唯一 className，用于 SubRoutePagePortal 定位第一个父级 SubRoutePageBase 中 */
  private readonly containerRef: React.RefObject<HTMLElement> = React.createRef()

  readonly routes: ISubRouteItems = this.props.routes

  redirectPath: string

  canRedirect = false

  constructor(props: ISubRoutePageProps) {
    super(props)
    this.state = {
      context: {
        isMount: false,
        getParentPageCard: () => null,
      },
    }
    // 后期如果需要增加权限控制可以修改这里的 方式，通过权限计计算出redirectPath，目前默认使用第一项
    this.redirectPath = this.figureFirstPath() // this.props.basename + this.routes?.[0].path
    const rootPath = this.props.match.path
    const matchInfo = matchPath(this.redirectPath, { path: rootPath, exact: true, strict: false })
    if (!matchInfo) {
      this.canRedirect = true
      this.redirectPath += this.props.history.location.search
    }
  }

  componentDidMount() {
    this.setState({
      context: {
        isMount: true,
        getParentPageCard: () => this.containerRef.current,
      },
    })
  }

  // 计算出第一个有权限的路径、便面点击菜单的时候显示的是没权限的tab页
  figureFirstPath() {
    const routeItem = this.routes.find(item => window.appStore.authority.checkPermission(item.authority))
    return (this.props.basename || '') + (routeItem?.path || '')
  }

  renderLeft() {
    const { location, basename } = this.props
    // const pathname = location.pathname

    let pathname = location.pathname

    this.routes.some(item => {
      const recordPath = basename + item.path
      const matched = !!matchPath(location.pathname, { path: recordPath, exact: item.exact ?? true, strict: false })
      if (matched) {
        pathname = recordPath
      }
      return matched
    })

    return (
      <Radio.Group
        value={pathname}
        buttonStyle="solid"
        onChange={this.onRadioChange}
        className={classnames(styles.radioGroup, {
          [styles.small]: this.routes.length > 9,
        })}
      >
        {this.routes.map(record => {
          const recordPath = basename + record.path
          return (
            <Auth key={recordPath} authority={record.authority}>
              {record?.count ? (
                <Badge count={record?.count} offset={[-8, 0]}>
                  <Radio.Button className={classnames(styles.radioButton, { [styles.bold]: pathname === recordPath })} key={recordPath} value={recordPath}>
                    {record.icon}
                    {record.name}
                  </Radio.Button>
                </Badge>
              ) : (
                <Radio.Button className={classnames(styles.radioButton, { [styles.bold]: pathname === recordPath })} key={recordPath} value={recordPath}>
                  {record.icon}
                  {record.name}
                </Radio.Button>
              )}
            </Auth>
          )
        })}
      </Radio.Group>
    )
  }

  onRadioChange = async (e: RadioChangeEvent) => {
    const { routes, history, basename, mergeSearch } = this.props
    const pathname = e.target.value
    const goToPath = (config?: Omit<LocationDescriptorObject, 'pathname'>) => {
      // 将当前页面的 query 添加到下个页面
      const composeSearchObject = {
        ...(mergeSearch ? querystring.parse(history.location.search) : null),
        ...(config?.search ? querystring.parse(config.search) : null),
      }
      history.replace({ pathname, ...config, search: `?${querystring.stringify(composeSearchObject)}` })
    }
    const currentRoute = routes.find(item => basename + item.path === pathname)!
    if (currentRoute.onClick) {
      return await currentRoute.onClick(goToPath)
    }
    goToPath()
  }

  render() {
    const { emptyPlaceholder, title, right, nested, fill, containerClassName, contentClassName, headerClassName, innerScroll, footer, loading, match, history, basename } = this.props
    const rootPath = match.path

    return (
      <Context.Provider value={this.state.context}>
        <PageCard
          containerRef={this.containerRef}
          title={title}
          containerClassName={containerClassName}
          contentClassName={classnames(contentClassName, { [styles.noPadding]: fill, [styles.top0]: nested })}
          headerClassName={classnames(headerClassName, { [styles.noHeaderLine]: nested })}
          left={this.renderLeft()}
          leftClassName={styles.left}
          right={right instanceof Function ? right(history) : right}
          innerScroll={innerScroll}
          footer={footer}
          loading={loading}
        >
          {emptyPlaceholder ?? (
            <Suspense fallback={<PageLoading />}>
              <Switch>
                {this.canRedirect && <Redirect exact key="Redirect" from={rootPath} to={this.redirectPath} />}
                {this.routes.map((record: ISubRouteItem, index: number) => {
                  const recordPath = basename + record.path
                  // return <Route key={index} exact path={recordPath} component={
                  //   record.component} />
                  const authority = record.authority

                  return (
                    <Route
                      key={index}
                      exact={record.exact ?? true}
                      path={recordPath}
                      render={routeProps => (
                        <Auth authority={authority} noPermissionContent={<PageNoPermission />}>
                          <record.component {...routeProps} />
                        </Auth>
                      )}
                    />
                  )
                })}
              </Switch>
            </Suspense>
          )}
        </PageCard>
      </Context.Provider>
    )
  }
}

const SubRoutePage = withRouter(SubRoutePageBase)

export { SubRoutePage, PageLayout as SubRoutePageContent }
export default SubRoutePage
