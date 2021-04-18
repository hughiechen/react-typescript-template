/*
 * @Author: Hughie
 * @Date: 2019-11-28 10:38:45
 * @Last Modified by: Hughie
 * @Last Modified time: 2020-04-17 15:05:10
 * 权限验证组件，增加联合权限方式，通过‘&’符号 联合起来的权限将会组成新的权限，需要两个权限都通过才算通过权限测试
 */

import React from 'react'
import styles from './index.module.less'
import { Icon } from '@/common/components/basic/Icon'

export interface AuthProps {
  authority?: string // 权限点
  children?: React.ReactElement
  // 无权限的描述
  noPermissionContent?: React.ReactElement
}

// 页面没权限
export const PageNoPermission: React.FC<AuthProps> = () => {
  return (
    <div className={styles.auth}>
      <div className={styles.outsideBox}>
        <Icon type="quanxian" className={styles.icon} />
        <span className={styles.description}>{intl.get('sorry_no_permission').d('抱歉，您没有权限访问该页面')}</span>
      </div>
    </div>
  )
}

export const Auth: React.FC<AuthProps> = props => {
  const hasPermission = window.appStore.authority.checkPermission(props.authority)
  // 有权限
  if (hasPermission) {
    return props.children || null
  }
  return props.noPermissionContent || null
}

// export const checkPermission = window.appStore.authority.checkPermission

export * from './config'
export default Auth
