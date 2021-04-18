/*
 * @Author: yang
 * @Date: 2019-10-30 15:33:52
 * @Last Modified by: Hughie
 * @Last Modified time: 2020-04-17 15:05:00
 * 底部布局，一般用于分页
 */

import * as React from 'react'
import classnames from 'classnames'
import styles from './index.module.less'

// TODO/alex: 删除，已经集成到 material/GridTable 中

export interface IFooterProps {
  align?: 'left' | 'center' | 'right'
  className?: string
}

export interface IFooterState {}

export default class Footer extends React.Component<IFooterProps, IFooterState> {
  constructor(props: IFooterProps) {
    super(props)

    this.state = {}
  }

  public render() {
    const { align = 'center', className } = this.props
    return (
      <div
        className={classnames(
          {
            [styles.wrap]: true,
            [styles.left]: align === 'left',
            [styles.center]: align === 'center',
            [styles.right]: align === 'right',
          },
          className
        )}
      >
        {this.props.children}
      </div>
    )
  }
}
