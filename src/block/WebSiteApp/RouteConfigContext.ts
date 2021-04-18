/*
 * @Author: Hughie
 * @Date: 2020-01-03 10:06:32
 * @LastEditTime: 2020-10-10 10:28:55
 * @LastEditors: Hughie
 * @Description: 路由菜单配置注入，主要是为了解决 layout 和 routes配置的 循环依赖问题
 */
import React from 'react'
import { IRouteConfig, IAsideMenu } from './types'

export interface IConfigContextValue {
  baseUrl: string
  title: string
  routerConfig: IRouteConfig[]
  asideMenuConfig: IAsideMenu[]
}

const defaultValue: IConfigContextValue = {
  baseUrl: '/',
  title: '',
  routerConfig: [],
  asideMenuConfig: [],
}

export const RouteConfigContext = React.createContext(defaultValue)
