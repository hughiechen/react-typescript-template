import React from 'react'
import { Link, withRouter, RouteComponentProps } from 'react-router-dom'
import { Menu } from 'antd'
import styles from './index.module.less'
import classnames from 'classnames'
import { Icon, IconUnion } from '@/common/components/basic'
import CRouteMenu from '@/block/WebSiteApp/RouteMenuUtil'
import { RouteConfigContext } from '@/block/WebSiteApp/RouteConfigContext'

const { SubMenu } = Menu

interface IMenu {
  path: string
  icon?: IconUnion
  name: string
  authority?: string
  children?: IMenu[]
  hide?: boolean
  newWindow?: boolean
}

export interface IAsideProps extends RouteComponentProps {}

export interface IAsideState {
  openKeys: string[]
}

class Aside extends React.Component<IAsideProps, IAsideState> {
  static contextType = RouteConfigContext

  readonly context!: React.ContextType<typeof RouteConfigContext>

  menuConfig: IMenu[]

  authorMap: {}

  constructor(props: IAsideProps, context: React.ContextType<typeof RouteConfigContext>) {
    super(props)

    this.authorMap = new CRouteMenu(context.baseUrl || '/', context.routerConfig).authorMap

    this.menuConfig = this.filterMenu(context.asideMenuConfig)
    const openKeys = this.getDefaultOpenKeys()
    this.state = {
      openKeys,
    }
  }

  //  获取默认展开菜单项
  getDefaultOpenKeys = (): string[] => {
    const location = this.props.location
    const { pathname } = location
    const menus = this.getNavMenuItems(this.menuConfig)

    let openKeys: string[] = []
    if (Array.isArray(menus)) {
      this.menuConfig.forEach((item: IMenu, index: number) => {
        if (item.children && item.children?.length > 0) {
          const bHit = item.children.some(_item => {
            return pathname.startsWith(_item.path)
          })
          if (bHit) {
            openKeys = [`${index}`]
          }
        } else if (pathname.startsWith(item.path)) {
          openKeys = [`${index}`]
        }
      })
    }
    return openKeys
  }

  filterMenu = (menus: IMenu[]): IMenu[] => {
    // const permissions = window.appStore.permissions
    return menus
      .filter((menu: IMenu) => {
        // 如果菜单配置了权限，那么优先使用菜单权限来判断是否隐藏，否则使用菜单对应路由的权限来判断
        if (menu.authority) {
          return window.appStore.authority.checkPermission(menu.authority)
        }

        const author = this.authorMap[menu.path]
        return window.appStore.authority.checkPermission(author)
      })
      .map((menu: IMenu) => {
        if (menu.children) {
          return { ...menu, children: this.filterMenu(menu.children) }
        } else {
          return menu
        }
      })
  }

  // 二级导航菜单
  getSubMenuOrItem(item: IMenu, index: number) {
    if (item.children && item.children.some(child => child.name)) {
      const childrenItems = this.getNavMenuItems(item.children)
      if (childrenItems && childrenItems.length > 0) {
        const subNav = (
          <SubMenu
            key={index}
            title={
              <span>
                {item.icon && <Icon type={item.icon} style={{ fontSize: 16 }} />}
                <span>{item.name}</span>
              </span>
            }
          >
            {childrenItems}
          </SubMenu>
        )
        return subNav
      }
      return null
    }
    const navItem = (
      <Menu.Item key={item.path}>
        <Link to={item.path}>
          <div>
            {item.icon ? <Icon type={item.icon} style={{ fontSize: 16 }} /> : <span style={{ paddingLeft: 13 }} />}
            <span>{item.name}</span>
          </div>
        </Link>
      </Menu.Item>
    )
    return navItem
  }

  onOpenChange = (openKeys: any) => {
    this.setState({
      openKeys,
    })
  }

  // 获取菜单项数据
  getNavMenuItems(menusData: IMenu[]) {
    if (!menusData) {
      return []
    }
    return menusData
      .filter(item => item.name && !item.hide)
      .map((item, index) => {
        return this.getSubMenuOrItem(item, index)
      })
  }

  interceptPath = (pathname: string, __partCount = 1) => {
    const partCount = __partCount + 1
    if (pathname) {
      const pathItems = pathname.split('/')
      if (pathItems.length >= partCount) {
        const paths = pathItems.slice(1, partCount)
        return `/${paths.join('/')}`
      }
      return pathname
    }
    return ''
  }

  render() {
    const { pathname } = this.props.location
    const pathName = this.interceptPath(pathname)
    const pathName2 = this.interceptPath(pathname, 2)
    return (
      <div className={classnames(styles.fullOver, styles.customMenu)}>
        <div style={{ width: '190px', height: '100%' }}>
          <Menu mode="inline" inlineIndent={13} theme="dark" openKeys={this.state.openKeys} selectedKeys={[pathName, pathName2]} onOpenChange={this.onOpenChange}>
            {this.getNavMenuItems(this.menuConfig)}
          </Menu>
        </div>
      </div>
    )
  }
}

export default withRouter(Aside)
