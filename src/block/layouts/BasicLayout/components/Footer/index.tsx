/*
 * @Author: Hughie
 * @Date: 2021-01-31 17:54:23
 * @LastEditors: Hughie
 * @LastEditTime: 2021-02-18 16:20:52
 * @Description:底部
 */
import React from 'react'
import classnames from 'classnames'
import styles from './index.module.less'
import moment from 'moment'

interface FooterProps {
  className?: string
}

export const Footer: React.FC<FooterProps> = React.memo(props => {
  const { className } = props
  return <div className={classnames(styles.antdLayoutFooter, className)}>CopyRight(C)2008 - {moment().year()} 有宝科技. All Rights Reserved</div>
})

export default Footer
