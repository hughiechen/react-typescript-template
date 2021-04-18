/*
 * @Author: Hughie
 * @Date: 2019-12-10 13:26:20
 * @LastEditTime: 2021-03-16 15:53:25
 * @LastEditors: Hughie
 * @Description:自定义时间选择组件, 用于表格搜索条件
 */

import React from 'react'
import moment from 'moment'
import type { Moment } from 'moment'
import classnames from 'classnames'
import { Input, DatePicker } from 'antd'
import { RangeValue } from 'rc-picker/lib/interface'
import { Select } from '../Select'
import styles from './index.module.less'

export type DefaultDateType = 'today' | 'yesterday' | 'last7day' | 'last30day' | 'custom'

export type UndefinedAsAllOfValue<S, T> = S extends true ? T | undefined : T

export type DateSelectValueRange = [Moment, Moment]

/**
 * - 泛型 U 代表 value 是否可以被清除，如果可以，组件返回的 value 值为 undefined
 * - type 时间类型
 * - value 当前事件类型下的时间范围
 */
export interface DateSelectValue {
  type: string
  value: DateSelectValueRange
}

export interface DateSelectOption {
  label: string
  /** 时间类型，select 根据这个值来进行切换显示，所以必须为唯一值 */
  type: string
  valueCreator: () => DateSelectValueRange
}

export interface DateSelectProps<U extends boolean = true> {
  value?: DateSelectValue
  /** 宽度 */
  breadth?: 'default' | 'small'
  /**
   * 是否自动响应，根据屏幕大小自动调整 breadth，优先级高于 breadth
   * @default true
   */
  responsive?: boolean
  /** 自定义下拉选择时间段 */
  options?: DateSelectOption[]
  /** 支持 value 为 undefined 时，显示全部选项 */
  undefinedAsAll?: U
  /** undefinedAsAll 为 true 时，设置全部选项的 label */
  undefinedAsAllLabel?: React.ReactNode
  containerClassName?: string
  containerStyle?: React.CSSProperties
  onChange?: (value: UndefinedAsAllOfValue<U, DateSelectValue>) => void
  disabledDate?: (date: Moment) => boolean
}

export class DateSelect<U extends boolean = true> extends React.PureComponent<DateSelectProps<U>> {
  static readonly defaultOptions: Record<DefaultDateType, DateSelectOption> = {
    today: {
      label: intl.get('today').d('今日'),
      type: 'today',
      valueCreator: () => [moment().startOf('day'), moment().endOf('day')],
    },
    yesterday: {
      label: intl.get('yesterday').d('昨日'),
      type: 'yesterday',
      valueCreator: () => [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')],
    },
    last7day: {
      label: intl.get('past_7Days').d('过去7天'),
      type: 'last7day',
      valueCreator: () => [moment().subtract(7, 'days').startOf('day'), moment().endOf('day')],
    },
    last30day: {
      label: intl.get('past_30Days').d('过去30天'),
      type: 'last30day',
      valueCreator: () => [moment().subtract(30, 'days').startOf('day'), moment().endOf('day')],
    },
    custom: {
      label: intl.get('customTime').d('自定义时间'),
      type: 'custom',
      valueCreator: () => [moment().subtract(30, 'days').startOf('day'), moment().endOf('day')],
    },
  }

  /** 获取默认值 */
  static getDefaultValue(type: DefaultDateType) {
    const option = this.defaultOptions[type]
    return { type: option.type, value: option.valueCreator() } as DateSelectValue
  }

  static defaultProps: PickOptional<DateSelectProps<any>> = {
    /** 默认取 defaultDateRange 的值作为默认选项，且默认自定义时间为 过去30天 */
    options: Object.values(DateSelect.defaultOptions),
    responsive: true,
    breadth: 'default',
    undefinedAsAll: true,
    undefinedAsAllLabel: intl.get('all_time').d('全部时间'),
  }

  onSelectChange = (value: UndefinedAsAllOfValue<U, string>) => {
    const currentSelectedItem = this.props.options!.find(_ => _.type === value)
    // value 为字符串，则为 defaultDateRange 中的 label, 值为 undefined ，则为全部，直接返回 undefined
    const newValue = (currentSelectedItem && {
      type: currentSelectedItem.type,
      value: currentSelectedItem.valueCreator(),
    }) as UndefinedAsAllOfValue<U, DateSelectValue>
    this.props.onChange?.(newValue)
  }

  onDatePickerChange = (value: RangeValue<Moment>) => {
    const custom = this.props.options!.find(_ => _.type === 'custom')
    if (custom) {
      const newValue = { type: custom.type, value: value as DateSelectValueRange }
      this.props.onChange?.((newValue as unknown) as UndefinedAsAllOfValue<U, DateSelectValue>)
    }
  }

  render() {
    const { undefinedAsAll, undefinedAsAllLabel, value, containerClassName, containerStyle, breadth, responsive, options, disabledDate } = this.props
    const customType = options!.find(_ => _.type === 'custom')?.type
    const showCustomDatePicker = customType && value?.type && customType === value.type
    return (
      <Input.Group compact className={containerClassName} style={containerStyle}>
        <Select
          className={classnames({
            [styles.smallSelect]: breadth === 'small',
            [styles.select]: breadth === 'default',
            [styles.responsive]: responsive,
          })}
          undefinedAsAll={undefinedAsAll}
          undefinedAsAllLabel={undefinedAsAllLabel}
          undefinedAsAllPosition="bottom"
          options={options!.map(_ => ({ label: _.label, value: _.type }))}
          value={value?.type}
          onChange={this.onSelectChange}
        />
        {showCustomDatePicker && (
          <DatePicker.RangePicker
            className={classnames({
              [styles.smallPick]: breadth === 'small',
              [styles.pick]: breadth === 'default',
              [styles.responsive]: responsive,
            })}
            disabledDate={disabledDate}
            allowClear={false}
            value={value?.value}
            onChange={this.onDatePickerChange}
          />
        )}
      </Input.Group>
    )
  }
}

export default DateSelect
