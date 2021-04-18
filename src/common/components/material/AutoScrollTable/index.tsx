import classnames from 'classnames'
import * as React from 'react'
import { HTMLAttributes } from 'react'
import styles from './index.module.less'
import { Search } from './Search'
import { Table } from './Table'

interface AutoScrollTableProps extends HTMLAttributes<HTMLDivElement> {}

export class AutoScrollTable extends React.PureComponent<AutoScrollTableProps> {
  static Search = Search

  static Table = Table

  render() {
    const { children, className, ...restProps } = this.props
    return (
      <div className={classnames(styles.wrap, className, 'AutoScrollTable')} {...restProps}>
        {this.props.children}
      </div>
    )
  }
}
