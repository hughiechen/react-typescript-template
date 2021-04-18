import * as React from 'react'
import styles from './index.module.less'
import { Spin } from 'antd'

interface IPageLayoutProps {
  loading?: boolean
  loadingTip?: string
}

export const PageLayout: React.FC<IPageLayoutProps> = React.memo(props => {
  const { loading = false, loadingTip } = props
  return (
    <div className={styles.root}>
      <Spin spinning={loading} tip={loadingTip} className={styles.loading}>
        {props.children}
      </Spin>
    </div>
  )
})

export default PageLayout
