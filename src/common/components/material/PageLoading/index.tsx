import React from 'react'
import classnames from 'classnames'
import { Icon, IconUnion } from '@/common/components/basic'
import styles from './index.module.less'
import { Spin } from 'antd'

interface PageLoadingProps {
  fullScreen?: boolean // 是否 render 到最外层
  type?: IconUnion // icon type
}

export const PageLoading: React.FC<PageLoadingProps> = React.memo(props => {
  return (
    <div className={classnames(styles.pageLoading, { [styles.fixed]: !!props.fullScreen })}>
      <div className={styles.centerBox}>
        <Spin indicator={props.type && <Icon type={props.type} className={styles.loadingIcon} spin />} />
        <span className={styles.description}>{intl.get('loading_120')}</span>
      </div>
    </div>
  )
})

PageLoading.defaultProps = {
  type: 'loading',
}
export default PageLoading
