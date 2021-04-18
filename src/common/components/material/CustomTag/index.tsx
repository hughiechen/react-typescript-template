import React from 'react'
import classnames from 'classnames'
import styles from './index.module.less'

export interface CustomTagProps {
  color: CustomTagColorList
}

export type CustomTagColorList = 'red' | 'green' | 'blue' | 'gray' | 'yellow' | 'white' | 'purple'

export const CustomTag: React.FC<CustomTagProps> = React.memo(props => (
  <span
    className={classnames(styles.customTag, {
      [styles.red]: props.color === 'red',
      [styles.green]: props.color === 'green',
      [styles.blue]: props.color === 'blue',
      [styles.gray]: props.color === 'gray',
      [styles.yellow]: props.color === 'yellow',
      [styles.purple]: props.color === 'purple',
      [styles.white]: props.color === 'white',
    })}
  >
    {props.children}
  </span>
))

export default CustomTag
