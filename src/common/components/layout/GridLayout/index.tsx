/*
 * @Author: Hughie
 * @Date: 2019-12-05 15:05:33
 * @Last Modified by: Hughie
 * @Last Modified time: 2020-01-06 15:58:25
 * grid 布局组件
 */

import React from 'react'
import classnames from 'classnames'
import styles from './index.module.less'
import { GridLayoutItem } from './GridLayoutItem'

/**
 * ref: https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-columns
 */

export interface GridLayoutProps {
  /**
   * 默认 column 为 1
   *
   * @type string: 只能是像素值，比如：300px，代表最小长度 300px ，自适应换行显示
   * @type number: 列数，均等分长度
   * @type string[]: 百分数，像素，fr单位
   */
  column?: number | string | string[]
  /**
   * 同 column，默认为 undefined
   */
  row?: number | string | string[]
  /**
   * 列之间的距离
   */
  columnGap?: string | number
  /**
   * 行之间的距离
   */
  rowGap?: string | number
  /**
   * 列宽度的自适应填充方式
   * ref: https://developer.mozilla.org/zh-CN/docs/Web/CSS/repeat
   */
  gridItemFillType?: 'auto-fit' | 'auto-fill'
  style?: React.CSSProperties
  className?: string
}

export class GridLayout extends React.PureComponent<GridLayoutProps> {
  static Item = GridLayoutItem

  static defaultProps: PickOptional<GridLayoutProps> = {
    gridItemFillType: 'auto-fit',
  }

  getStyle = (): React.CSSProperties => {
    const { column, row, columnGap, rowGap, style } = this.props
    const composeStyle: React.CSSProperties = {
      gridTemplateColumns: this.gridTemplateStyleValue(column),
      gridTemplateRows: this.gridTemplateStyleValue(row),
      columnGap,
      rowGap,
      ...style,
    }
    return composeStyle
  }

  gridTemplateStyleValue = (direction?: number | string | string[]) => {
    if (Array.isArray(direction)) {
      return direction.join(' ')
    }
    if (typeof direction === 'number') {
      return `repeat(${direction}, 1fr)`
    }
    if (typeof direction === 'string') {
      return `repeat(${this.props.gridItemFillType}, minmax(${direction}, 1fr))`
    }
    return undefined
  }

  render() {
    const { children, className } = this.props
    return (
      <div style={this.getStyle()} className={classnames(styles.grid, className)}>
        {children}
      </div>
    )
  }
}
