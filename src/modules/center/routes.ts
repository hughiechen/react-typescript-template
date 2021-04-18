/*
 * @Author: Hughie
 * @Date: 2021-04-15 11:07:06
 * @LastEditors: Hughie
 * @LastEditTime: 2021-04-18 17:51:53
 * @Description:
 */
import * as React from 'react'
import { IRouteChildren } from '@/block/WebSiteApp/types'

const CenterList = React.lazy(() => import('./pages/CenterList'))

const centerRoutes: IRouteChildren[] = [
  {
    path: '/center/list',
    component: CenterList,
  },
  {
    path: '/center',
    redirect: '/center/list',
  },
]

export default centerRoutes
