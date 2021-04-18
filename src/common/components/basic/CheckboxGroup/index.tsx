import React from 'react'
import { Checkbox } from 'antd'
import classnames from 'classnames'
import styles from './index.module.less'

export interface CheckboxGroupDataSourceItem<T> {
  label: string
  value: T
  disabled?: boolean
}

export interface CheckboxGroupProps<T> {
  value?: T[]
  disabled?: boolean
  type?: 'noBorder'
  onChange?: (value: T[], data: CheckboxGroupDataSourceItem<T>[]) => void
  dataSource: CheckboxGroupDataSourceItem<T>[]
}

export class CheckboxGroup<T> extends React.PureComponent<CheckboxGroupProps<T>> {
  onChange = (value: T[]) => {
    const { dataSource, onChange } = this.props
    const data = value.map(_ => dataSource.find(item => item.value === _)!)
    onChange?.(value, data)
  }

  render() {
    const { value, disabled, type, dataSource } = this.props
    const checkboxClassName = classnames({ [styles.checkbox]: !type, [styles.disabled]: disabled && !type })
    return (
      // 使用 any 隐藏泛型编译错误
      <Checkbox.Group disabled={disabled} className={checkboxClassName} value={value as any} options={dataSource as any} onChange={this.onChange as any} />
    )
  }
}

export default CheckboxGroup
