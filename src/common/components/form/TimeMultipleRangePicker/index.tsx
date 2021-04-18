import React from 'react'
import classnames from 'classnames'
import { TimePicker, message } from 'antd'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons'
import { Moment } from 'moment'
import styles from './index.module.less'

export interface ValueItem {
  start: Moment | undefined
  end: Moment | undefined
}

export interface TimeMultipleRangePickerProps {
  value?: ValueItem[]
  onChange?: (value?: ValueItem[]) => void
  disabled?: boolean
}

interface State {
  errorIndex: number[]
}

export class TimeMultipleRangePicker extends React.PureComponent<TimeMultipleRangePickerProps, State> {
  private id = 0

  private readonly defaultValue: ValueItem[] = [
    {
      start: undefined,
      end: undefined,
    },
  ]

  constructor(props: TimeMultipleRangePickerProps) {
    super(props)
    this.state = {
      errorIndex: [],
    }
  }

  private checkTimeRepeat = (timeRange: ValueItem[]) => {
    for (let i = 0; i < timeRange.length; i++) {
      for (let j = 0; j < timeRange.length; j++) {
        if (i !== j) {
          if (timeRange[i].start && timeRange[i].end && timeRange[j].start && timeRange[j].end) {
            const haCross =
              (timeRange[j].start!.valueOf() >= timeRange[i].start!.valueOf() && timeRange[j].start!.valueOf() < timeRange[i].end!.valueOf()) ||
              (timeRange[j].end!.valueOf() > timeRange[i].start!.valueOf() && timeRange[j].end!.valueOf() <= timeRange[i].end!.valueOf())
            if (haCross) {
              this.setState({ errorIndex: [i, j] })
              return true
            }
          }
        }
      }
    }
    return false
  }

  validateTimePickerValue = (value: ValueItem[] | undefined): string | undefined => {
    if (value === undefined || value.every(_ => !_.start && !_.end)) {
      return intl.get('please_fill_in_the_time_interval').d('请填写时间区间')
    }
    if (value.filter(_ => _.start || _.end).some(_ => !_.start || !_.end)) {
      this.setState({ errorIndex: [value.findIndex(_ => (_.start || _.end) && (!_.start || !_.end))] })
      return intl.get('please_fill_in_the_complete_time_interval').d('请填写完整的时间区间')
    }
    if (value.filter(_ => _.start && _.end).some(_ => _.end!.valueOf() < _.start!.valueOf())) {
      this.setState({ errorIndex: [value.findIndex(_ => _.start && _.end && _.end!.valueOf() < _.start!.valueOf())] })
      return intl.get('time_interval_with_error').d('存在错误的时间区间')
    }
    if (this.checkTimeRepeat(value)) {
      return intl.get('there_are_repeated_time_intervals').d('存在重复时间区间')
    }
    return undefined
  }

  getValue = () => this.props.value || this.defaultValue

  onPlus = () => this.props.onChange?.([...this.getValue(), { start: undefined, end: undefined }])

  onMinus = (index: number) => {
    const newValues = [...this.props.value!]
    newValues.splice(index, 1)
    this.props.onChange?.(newValues)
    this.setState({ errorIndex: [] })
  }

  onChangeTime = <K extends keyof ValueItem>(value: Pick<ValueItem, K>, index: number) => {
    this.props.onChange?.(this.getValue().map((_, ind) => (index === ind ? { ..._, ...value } : _)))
    this.setState({ errorIndex: [] })
  }

  warning = () => message.warning(intl.get('you_can_only_add_up_to_five_items').d('最多只能添加五项'))

  render() {
    const { errorIndex } = this.state
    const value = this.getValue()
    return (
      <ul className={styles.timeMultipleRangePicker}>
        {value.map((_, index) => (
          <li key={++this.id} className={classnames({ [styles.clearErrorStyle]: !errorIndex.includes(index) })}>
            <div>
              <TimePicker value={_.start} onChange={v => this.onChangeTime({ start: v ?? undefined }, index)} minuteStep={30} format="HH:mm" showNow={false} />
              <span>-</span>
              <TimePicker value={_.end} onChange={v => this.onChangeTime({ end: v ?? undefined }, index)} minuteStep={30} format="HH:mm" showNow={false} />
            </div>
            <span className={classnames({ [styles.disabled]: value.length >= 5 && index === 0 })} onClick={index === 0 ? (value.length < 5 ? this.onPlus : this.warning) : () => this.onMinus(index)}>
              {index === 0 ? <PlusOutlined /> : <MinusOutlined />}
            </span>
          </li>
        ))}
      </ul>
    )
  }
}

export default TimeMultipleRangePicker
