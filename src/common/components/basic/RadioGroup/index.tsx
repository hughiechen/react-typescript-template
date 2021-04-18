import React from 'react'
import classnames from 'classnames'
import { Radio } from 'antd'
import { RadioChangeEvent } from 'antd/lib/radio'
import styles from './index.module.less'

export interface RadioGroupDataSourceItem<T> {
  label: string
  value: T
  disabled?: boolean
}

export interface RadioGroupProps<T> {
  value?: T
  disabled?: boolean
  type?: 'noBorder'
  onChange?: (value: RadioChangeEvent) => void
  dataSource: RadioGroupDataSourceItem<T>[]
}

export class RadioGroup<T> extends React.PureComponent<RadioGroupProps<T>> {
  render() {
    const { dataSource, value, onChange, disabled, type } = this.props
    const radioClassName = classnames({ [styles.radioBox]: !type, [styles.disabled]: disabled && !type })
    return (
      <Radio.Group disabled={disabled} className={radioClassName} value={value} onChange={onChange}>
        {dataSource.map(_ => (
          <Radio key={_.label} value={_.value} disabled={disabled || _.disabled}>
            {_.label}
          </Radio>
        ))}
      </Radio.Group>
    )
  }
}

export default RadioGroup
