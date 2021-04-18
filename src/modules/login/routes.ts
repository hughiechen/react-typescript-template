/*
 * @Author: Hughie
 * @Date: 2021-04-15 11:07:06
 * @LastEditors: Hughie
 * @LastEditTime: 2021-04-18 17:52:53
 * @Description:
 */
import * as React from 'react'

const Login = React.lazy(() => import('./pages/main'))
const Apply = React.lazy(() => import('./pages/Apply'))

const designRoute = [
  {
    path: '/',
    exact: true,
    component: Login,
  },

  {
    path: '/apply',
    exact: true,
    component: Apply,
  },
]

export default designRoute
