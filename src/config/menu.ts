/*
 * @Author: Hughie
 * @Date: 2020-10-09 09:42:58
 * @LastEditTime: 2021-04-18 18:23:03
 * @LastEditors: Hughie
 * @Description: 菜单配置，子菜单会合拼父级的path，如果父级没path，就不合并,看menuExtra函数 就知道
 */

import { IAsideMenuConfig } from '../block/WebSiteApp/types'
import RouteMenuUtil from '../block/WebSiteApp/RouteMenuUtil'

const menuConfig: IAsideMenuConfig[] = [
  {
    name: '我的工作台',
    path: '/workbench',
    icon: 'data',
  },
  {
    name: '中心管理',
    path: '/center',
    icon: 'user',
  },
]

const asideMenuConfig = RouteMenuUtil.menuExtra(menuConfig)

export { asideMenuConfig }
