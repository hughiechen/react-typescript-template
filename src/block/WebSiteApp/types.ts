import { IconUnion } from '@/common/components/basic/Icon'

/*
 * @Author: Hughie
 * @Date: 2020-01-02 16:01:34
 * @LastEditTime: 2021-04-15 10:50:05
 * @LastEditors: Hughie
 * @Description: 路由类型文件,这文件一般会被站点的 config引用
 */

// 路由类型
export interface IRouteChildren {
  path: string
  redirect?: string
  autoRedirect?: boolean
  component?: React.LazyExoticComponent<React.ComponentType<any>> | React.ComponentType<any>
  authority?: string
  children?: IRouteChildren[]
  /** 默认为 false */
  exact?: boolean
}

export interface IRouteConfig {
  path: string
  component: React.ComponentType<any>
  children: IRouteChildren[]
}

// 菜单
export interface IAsideMenuConfig {
  path?: string
  icon?: IconUnion
  name: string
  authority?: string
  children?: IAsideMenuConfig[]
  hide?: boolean
  newWindow?: boolean
  /** 数值越大优先级越高，用于计算重定向优先级别 */
  priority?: number
}

export interface IAsideMenu {
  path: string
  icon?: IconUnion
  name: string
  authority?: string
  children?: IAsideMenu[]
  hide?: boolean
  newWindow?: boolean
  /** 数值越大优先级越高，用于计算重定向优先级别 */
  priority?: number
}
