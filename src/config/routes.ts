/*
 * @Author: Hughie
 * @Date: 2019-12-04 13:40:20
 * @LastEditTime: 2021-04-18 17:46:01
 * @LastEditors: Hughie
 * @Description:
 */

import * as React from 'react'

import BasicLayout from '../block/layouts/BasicLayout'
import { IRouteConfig } from '../block/WebSiteApp/types'

import centerRoutes from '@/modules/center/routes'

const NotFound = React.lazy(() => import('@/components/NotFound'))

const routerConfig: IRouteConfig[] = [
  {
    path: '/',
    component: BasicLayout,
    children: [{ path: '/', autoRedirect: true }, ...centerRoutes, { path: '*', component: NotFound }],
  },
]

export default routerConfig
