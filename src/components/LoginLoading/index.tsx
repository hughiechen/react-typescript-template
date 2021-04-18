/*
 * @Author: Hughie
 * @Date: 2020-12-07 13:14:50
 * @LastEditTime: 2021-03-04 13:30:44
 * @LastEditors: Hughie
 * @Description:
 */

import React from 'react'
import classnames from 'classnames'
import styles from './index.module.less'
import { Icon } from '@/common/components/basic'

interface LoginLoadingProps {
  fullScreen?: boolean // 是否 render 到最外层
  type?: string // icon type
}

export const LoginLoading: React.FC<LoginLoadingProps> = React.memo(props => {
  return (
    <div className={classnames(styles.notFound, { [styles.fixed]: !!props.fullScreen })}>
      <div className={styles.outsideBox}>
        <Icon type="loading" className={styles.iconType} spin />
        <span className={styles.description}>加载中……</span>
      </div>
    </div>
  )
})

export default LoginLoading
