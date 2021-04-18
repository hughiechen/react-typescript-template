import React from 'react'
import classnames from 'classnames'
import styles from './index.module.less'

export interface ContainerProps {
  /**
   * 给 Container 下面的按钮添加左右边距
   * @type right: 添加右边距
   * @type horizontal: 左右两侧都添加边距
   */
  margin: 'right' | 'horizontal'
}

export const Container: React.FC<ContainerProps> = React.memo(props => (
  <div
    className={classnames({
      [styles.marginRight]: props.margin === 'right',
      [styles.marginHorizontal]: props.margin === 'horizontal',
    })}
  >
    {props.children}
  </div>
))
