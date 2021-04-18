import * as React from 'react'
import { Spin, Empty } from 'antd'
import { SpinEmptyProps } from './type'
import styles from './index.module.less'

export interface FullSpinEmptyProps extends SpinEmptyProps {}

export const FullSpinEmpty: React.FC<FullSpinEmptyProps> = React.memo(props => {
  const isEmptyChildren = !props.children
  return (
    <div className={styles.fullSpinContainer}>
      {props.children}
      {props.loading ? (
        <React.Fragment>
          {isEmptyChildren && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={intl.get('loading_120').d('加载中...')} className={styles.emptyIcon} />}
          <Spin spinning className={isEmptyChildren ? styles.spinCenter : styles.spinTop} />
        </React.Fragment>
      ) : isEmptyChildren ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={props.emptyDescription} className={styles.emptyIcon}>
          {props.emptyExtra}
        </Empty>
      ) : null}
    </div>
  )
})

FullSpinEmpty.defaultProps = {
  loading: false,
  emptyDescription: intl.get('temporary_no_data').d('暂无数据'),
}
