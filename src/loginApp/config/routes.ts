/*
 * @Author: Hughie
 * @Date: 2019-10-21 20:43:52
 * @LastEditTime: 2020-06-28 13:15:46
 * @LastEditors: Hughie
 * @Description:
 */

import { SimpleLayout } from '@/block/layouts/SimpleLayout'
import { IBasicRouteConfig } from '@/block/WebLoginApp/types'

import logRoutes from '@/modules/login/routes'

const routerConfig: IBasicRouteConfig[] = [
  {
    path: '/login',
    component: SimpleLayout,
    children: [...logRoutes],
  },
]

export default routerConfig
