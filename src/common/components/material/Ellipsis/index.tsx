import * as React from 'react'
import classnames from 'classnames'
import styles from './index.module.less'

export interface EllipsisProps {
  width: number
  className?: string
}

const Ellipsis: React.FC<EllipsisProps> = props => {
  return (
    <div title={typeof props.children === 'string' ? props.children : undefined} className={classnames(styles.ellipsis, props.className)} style={{ width: props.width }}>
      {props.children}
    </div>
  )
}

export default Ellipsis
