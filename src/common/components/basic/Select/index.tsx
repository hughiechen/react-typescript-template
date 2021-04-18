import React, { PureComponent } from 'react'
import { Select as AntdSelect } from 'antd'
import classnames from 'classnames'
import { SelectProps as AntdSelectProps } from 'antd/lib/select'
import type { OptionCoreData as RCOptionData } from 'rc-select/lib/interface'
import styles from './index.module.less'

export type UndefinedAsAllOfValue<S, T> = S extends true ? T | undefined : T

export interface OptionData<T> extends Omit2<RCOptionData, 'value'> {
  value: T
}

export interface SelectProps<T = any, S extends boolean = false> extends Omit2<AntdSelectProps<T>, 'onChange' | 'allowClear' | 'options'> {
  options?: OptionData<T>[]
  allowClear?: S
  /**
   * 支持 value 为 undefined 时，显示全部选项
   */
  undefinedAsAll?: S
  /**
   * undefinedAsAll 为 true 时，设置全部选项的 label
   */
  undefinedAsAllLabel?: React.ReactNode
  /**
   * 全部选项的位置
   */
  undefinedAsAllPosition?: 'top' | 'bottom'
  /**
   * 使透明
   */
  transparent?: boolean
  /**
   * undefinedAsAll 为 true，onChange 的 value 参数为 T | undefined，否则为 T
   * @param option 使用 options 则为当前项，Select.Option 则为当前组件
   */
  onChange?: (value: UndefinedAsAllOfValue<S, T>, option: any) => void
}

export class Select<T, S extends boolean = false> extends PureComponent<SelectProps<T, S>> {
  static defaultProps: PickOptional<SelectProps<any>> = {
    undefinedAsAllLabel: '全部',
    undefinedAsAllPosition: 'top',
  }

  static Option = AntdSelect.Option

  static OptGroup = AntdSelect.OptGroup

  private readonly allValue = ('@@all' as unknown) as T

  private readonly allItem: OptionData<T>[] = [
    {
      label: this.props.undefinedAsAllLabel!,
      value: this.allValue,
    },
  ]

  onChange = (value: any, option: any) => this.props.onChange?.(value === this.allValue ? undefined : value, option)

  render() {
    const { options, children, undefinedAsAll, undefinedAsAllLabel, undefinedAsAllPosition, className, transparent, ...restProps } = this.props
    const finalOptions = undefinedAsAll && options ? (undefinedAsAllPosition === 'top' ? this.allItem.concat(options) : options.concat(this.allItem)) : options
    const partOfProperties = {
      onChange: this.onChange,
      ...('value' in restProps ? { value: undefinedAsAll && restProps.value === undefined ? this.allValue : restProps.value } : undefined),
      ...('defaultValue' in restProps ? { defaultValue: undefinedAsAll && restProps.defaultValue === undefined ? this.allValue : restProps.defaultValue } : undefined),
    }
    return (
      <AntdSelect<any> {...restProps} {...partOfProperties} className={classnames(className, { [styles.transparent]: transparent })} options={finalOptions as any}>
        {undefinedAsAll ? (
          <React.Fragment>
            <AntdSelect.Option key="undefinedAsAll" value={this.allItem[0].value as any}>
              {this.allItem[0].label}
            </AntdSelect.Option>
            {children}
          </React.Fragment>
        ) : (
          children
        )}
      </AntdSelect>
    )
  }
}
