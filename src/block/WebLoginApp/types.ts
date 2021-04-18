/*
 * @Author: Hughie
 * @Date: 2021-04-14 15:24:34
 * @LastEditors: Hughie
 * @LastEditTime: 2021-04-14 15:24:34
 * @Description:
 */

// 路由类型
export interface IBasicRouteChildren {
  path: string
  redirect?: string
  component: React.LazyExoticComponent<React.ComponentType<any>> | React.ComponentType<any>
  children?: IBasicRouteChildren[]
  /** 默认为 false */
  exact?: boolean
}

export interface IBasicRouteConfig {
  path: string
  component: React.ComponentType<any>
  children: IBasicRouteChildren[]
}
