/*
 * @Author: Hughie
 * @Date: 2019-11-28 10:36:45
 * @Last Modified by: Hughie
 * @Last Modified time: 2019-11-28 10:41:33
 * 标题头，比如作为 PageCard 的 title 或者 FormBlock 的 title 等等
 */

import React from 'react'
import classnames from 'classnames'
import styles from './index.module.less'

export type TitleType = 'noStyle' | 'verticalHighlight' | 'fullLine' | 'highlightFullLine'

export interface TitleProps {
  text?: string | React.ReactNode
  className?: string
  /**
   * title 样式
   * @types
   * - noStyle 没有样式
   * - verticalHighlight(default) 左侧有一个垂直高亮竖线
   * - fullLine 占满整行
   * - highlightFullLine 左侧有一个垂直高亮竖线且占满整行
   */
  type?: TitleType
  right?: React.ReactNode
  left?: React.ReactNode
  style?: React.CSSProperties
}

export const Title: React.FC<TitleProps> = React.memo(props => (
  <div
    className={classnames(
      styles.title,
      {
        [styles.fullLine]: props.type === 'fullLine' || props.type === 'highlightFullLine',
      },
      props.className
    )}
    style={props.style}
  >
    {props.text && <strong className={classnames(styles.titleText, { [styles.verticalHighlight]: props.type === 'verticalHighlight' || props.type === 'highlightFullLine' })}>{props.text}</strong>}
    {props.left && <div>{props.left}</div>}
    {props.right && <div className={styles.titleRight}>{props.right}</div>}
  </div>
))

Title.defaultProps = {
  type: 'verticalHighlight',
}

export default Title
