/*
 * @Author: Hughie
 * @Date: 2020-12-07 13:14:50
 * @LastEditTime: 2021-04-18 18:21:27
 * @LastEditors: Hughie
 * @Description:公用头部
 */

import React from 'react'
import { Alert } from 'antd'

import styles from './index.module.less'
import UserMenu from './components/UserMenu'
import { appStore } from '@/stores/appStore'
import { navigation, history } from '@/common/navigation'

const Header = React.memo(() => {
  return (
    <div className={styles.antDesignLayoutHeader}>
      <div className={styles.headerLeft} id="PortalENV">
        <span className={styles.title} onClick={() => history.replace('/')}>
          Demo
        </span>
      </div>

      <div className={styles.headerRight1}>
        <div className={styles.headerRight1}>
          {IS_TEST && (
            <div>
              <Alert message="您当前所在的位置为测试环境" type="warning" showIcon />
            </div>
          )}
        </div>
        <UserMenu
          {...appStore.user}
          logout={() => {
            appStore.logOut().then(() => {
              navigation.push('/login')
            })
          }}
        />
      </div>
    </div>
  )
})
export default Header
