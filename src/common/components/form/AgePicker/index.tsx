import React from 'react'
import { DatePicker } from 'antd'
import classnames from 'classnames'
import { InputNumber } from '@/common/components/basic'
import { DateUtil } from '@/common/utils'
import moment, { Moment } from 'moment'
import styles from './index.module.less'

export interface AgePickerProps {
  value?: Moment
  onChange?: (value?: Moment) => void
  disabled?: boolean
  /** 日期撑开 */
  fullWidth?: boolean
}

interface State {
  age: number | undefined
  month: number | undefined
}

export class AgePicker extends React.PureComponent<AgePickerProps, State> {
  // 可配置该值修改最大年龄
  private readonly maxAge = 150

  constructor(props: AgePickerProps) {
    super(props)
    this.state = this.getAgeAndMonthFromDate(props.value)
  }

  componentDidUpdate(prevProps: Readonly<AgePickerProps>) {
    const { value } = this.props
    if (prevProps.value !== value) {
      this.setState(this.getAgeAndMonthFromDate(value))
    }
  }

  getAgeAndMonthFromDate = (date?: Moment) => {
    if (date) {
      const { years, months } = DateUtil.getAge(date)
      return { age: years, month: months }
    }
    return { age: undefined, month: undefined }
  }

  onChangeDate = (date: Moment | null) => this.props.onChange?.(date ?? undefined)

  onChangeAge = (age?: number) => {
    const date = this.calculateDate(age, this.state.month)
    if (date.isValid()) {
      this.props.onChange?.(date)
    }
  }

  onChangeMonth = (month?: number) => {
    const date = this.calculateDate(this.state.age, month)
    if (date.isValid()) {
      this.props.onChange?.(date)
    }
  }

  calculateDate = (age = 0, month = 0): Moment => {
    const current = moment()
    const y = current.year() - age
    const m = current.month() - month
    const d = current.date()
    return moment(new Date(y, m, d))
  }

  disabledDate = (current: Moment | null) => {
    const now = moment()
    return (!!current && current > moment()) || (!!current && current < moment({ year: now.year() - this.maxAge, month: now.month() + 1, date: now.date() }))
  }

  render() {
    const { value, disabled, fullWidth } = this.props
    const { age, month } = this.state
    return (
      <div className={styles.agePicker}>
        <div className={styles.agePickerAge}>
          <InputNumber disabled={disabled} min={0} max={this.maxAge - 1} value={age} onChange={this.onChangeAge} className={styles.inputNumber} placeholder={intl.get('enter').d('输入')} />
          <span>&nbsp;{intl.get('yearOld').d('岁')}&nbsp;</span>
          <InputNumber disabled={disabled} min={0} max={11} value={month} onChange={this.onChangeMonth} className={styles.inputNumber} placeholder={intl.get('enter').d('输入')} />
          <span>&nbsp;{intl.get('format_month')}&nbsp;</span>
        </div>
        <DatePicker
          disabled={disabled}
          disabledDate={this.disabledDate}
          value={value}
          onChange={this.onChangeDate}
          className={classnames(styles.datePicker, { [styles.fullWidth]: fullWidth })}
          placeholder={intl.get('please_select_birth').d('请选择出生日期')}
        />
      </div>
    )
  }
}

export default AgePicker
