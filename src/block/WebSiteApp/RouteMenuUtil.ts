/*
 * @Author: Hughie
 * @Date: 2020-01-03 09:17:04
 * @LastEditTime: 2020-07-29 13:20:13
 * @LastEditors: Hughie
 * @Description: 菜单路由的一些辅助方法
 */

import _ from 'lodash'
import path from 'path'
import { IRouteConfig, IRouteChildren, IAsideMenuConfig, IAsideMenu } from './types'

export interface IAuthorityMap {
  pathname: string
  authority?: string
}

type IZipChild = IAuthorityMap

interface RecursiveArray<T> extends Array<T | RecursiveArray<T>> {}
interface ListOfRecursiveArraysOrValues<T> extends Array<T | RecursiveArray<T>> {}

export default class RouteMenuUtil {
  BASEURL: string

  routeConfig: IRouteConfig[]

  // 路由菜单&菜单配置整合的数据结构
  constructor(baseUrl: string, routeConfig: IRouteConfig[]) {
    this.BASEURL = baseUrl
    this.routeConfig = routeConfig
  }

  private zipChildren(routerConfig: IRouteChildren[], fPath = ''): ListOfRecursiveArraysOrValues<IZipChild> {
    return routerConfig.map<IAuthorityMap | RecursiveArray<IAuthorityMap>>((item: IRouteChildren) => {
      if (item.children && item.children.length > 0) {
        return this.zipChildren(item.children, item.path)
      } else {
        // if (item.redirect) {
        //   const pathname = path.join(BASEURL, fPath, item.path)
        //   return {
        //     pathname,
        //     authority: item.authority,
        //   }
        // }

        if (!item.path) {
          return [] as IAuthorityMap[]
        }

        const pathname = path.join(this.BASEURL, fPath, item.path)
        return {
          pathname,
          authority: item.authority,
        }
      }
    })
  }

  private zip(routerConfig: IRouteConfig[]) {
    return routerConfig.map<ListOfRecursiveArraysOrValues<IZipChild>>((item: IRouteConfig) => {
      if (item.children && item.children.length > 0) {
        return this.zipChildren(item.children, item.path)
      }
      return []
    })
  }

  // 为了计算出菜单的权限，因为菜单耦合了路径
  get authorMap() {
    const authorMap = _.flattenDeep(this.zip(this.routeConfig))
      .filter(item => !!item)
      .reduce((pValue: {}, item: IZipChild) => {
        pValue[item.pathname] = item.authority
        return pValue
      }, {}) as {}
    return authorMap
  }

  static menuExtra(asideMenu: IAsideMenuConfig[], BASEURL = '', parentUrl = ''): IAsideMenu[] {
    return asideMenu.map<IAsideMenu>((item: IAsideMenuConfig) => {
      const children = item.children && RouteMenuUtil.menuExtra(item.children, BASEURL, item.path || '')
      return {
        ...item,
        children,
        path: item.newWindow ? item.path || '' : BASEURL + parentUrl + item.path,
      }
    })
  }
}
