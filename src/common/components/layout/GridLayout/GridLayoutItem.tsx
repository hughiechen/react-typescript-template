/*
 * @Author: Hughie
 * @Date: 2019-11-27 23:24:35
 * @Last Modified by: Hughie
 * @Last Modified time: 2020-03-21 16:43:04
 * 设置跨列组件
 */

/**
 * ref：https://developer.mozilla.org/en-US/docs/Web/CSS/grid-column-start
 * 例子：
 * column(竖向布局)
 * 1. <FormBlock.Item gridColumnStart="span 2"> 代表在当前位置占两列
 * 2. <FormBlock.Item gridColumnStart={2} gridColumnEnd={5}> 代表占据从第 2 个列网格线线 到第 5 个列网格线线
 *
 * row 横向布局同理
 */

import React from 'react'
import classnames from 'classnames'
import styles from './index.module.less'

export interface GridLayoutItemProps {
  gridColumnStart?: number | string
  gridColumnEnd?: number | string
  gridRowStart?: number | string
  gridRowEnd?: number | string
  className?: string
  style?: React.CSSProperties
  /**
   * 开启 BFC 效果和 FlexBox 布局，用于多块分区布局时，滚动条在 GridLayoutItem 内部, 不会将 GridLayoutItem 撑高
   * @description
   * 相当于添加样式：{ overflow: 'auto', display: 'flex' }
   */
  innerScroll?: boolean
  /**
   * 开启 BFC 效果，用于控制 grid 子元素不会因内容而撑大宽度，例子：FormBlock 中三列布局，由于上传组件图片名称太长而使得该列宽度大于 1/3
   * @description
   * 相当于添加样式 { overflow: hidden }
   */
  bfc?: boolean
}

export const GridLayoutItem: React.FC<GridLayoutItemProps> = React.memo(props => {
  return (
    <div
      className={classnames(props.className, props.innerScroll && styles.gridItem, props.bfc && styles.bfc)}
      style={{ gridColumnStart: props.gridColumnStart, gridColumnEnd: props.gridColumnEnd, gridRowStart: props.gridRowStart, gridRowEnd: props.gridRowEnd, ...props.style }}
    >
      {props.children}
    </div>
  )
})
