import * as React from 'react'
import classnames from 'classnames'
import styles from './index.module.less'

export interface TableCellLabelProps {
  text: string | React.ReactNode
  required?: boolean
}

export const TableCellLabel: React.FC<TableCellLabelProps> = React.memo(props => (
  <div className={styles.tableCellLabel}>
    <span className={classnames({ [styles.required]: props.required })}>{props.text}</span>
  </div>
))
