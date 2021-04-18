/*
 * @Author: Hughie
 * @Date: 2021-04-08 18:42:55
 * @LastEditors: Hughie
 * @LastEditTime: 2021-04-18 18:17:35
 * @Description:
 */
import React from 'react'
import classnames from 'classnames'
import { BackHeader } from '@/common/components/material'
import styles from './index.module.less'
import { Spin } from 'antd'

interface PageLayoutProps {
  backText?: string
  loading?: boolean
  loadingTip?: string
  containerClassName?: string
  contentClassName?: string
  // 禁止返回
  disabledBack?: boolean
  header?: React.ReactNode
}

export const PageLayout: React.FC<PageLayoutProps> = React.memo(props => {
  const { backText, header, children, contentClassName, containerClassName, loading, loadingTip, disabledBack } = props
  return (
    <div className={classnames(styles.pageLayout, containerClassName)}>
      {backText && (
        <BackHeader backText={backText} disabled={disabledBack}>
          {header}
        </BackHeader>
      )}
      <div className={classnames(styles.pageLayoutContent, contentClassName)}>{children}</div>
      <Spin spinning={loading} tip={loadingTip} className={styles.loading} />
    </div>
  )
})

PageLayout.defaultProps = {
  loading: false,
}
