import * as React from 'react'
import styles from './index.module.less'

export const SimpleLayout: React.FC = React.memo(props => {
  return <div className={styles.container}>{props.children}</div>
})
