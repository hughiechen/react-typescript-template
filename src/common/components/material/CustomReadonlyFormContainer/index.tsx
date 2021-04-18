/*
 * @Author: Hughie
 * @Date: 2020-05-06 16:19:20
 * @Last Modified by: Hughie
 * @Last Modified time: 2020-05-06 16:20:05
 * 自定义表单类输入组件的 disabled 状态下，字体的颜色，提高只读表单的文本识别度
 */

import * as React from 'react'
import classnames from 'classnames'
import styles from './index.module.less'

export interface CustomReadonlyFormContainerProps {
  className?: string
}

export const CustomReadonlyFormContainer: React.FC<CustomReadonlyFormContainerProps> = React.memo(props => {
  return <div className={classnames(styles.readonlyContainer, props.className)}>{props.children}</div>
})
