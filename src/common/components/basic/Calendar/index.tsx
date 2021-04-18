import * as React from 'react'
import { Calendar as AntdCalendar } from 'antd'
import type { CalendarProps as AntdCalendarProps } from 'antd/lib/calendar/generateCalendar'
import type { Moment } from 'moment'
import styles from './index.module.less'
import { basicIntl } from '../locales'

export interface CalendarProps extends AntdCalendarProps<Moment> {}

export const Calendar: React.FC<CalendarProps> = React.memo(props => {
  React.useEffect(() => {
    // NOTE: 强制修改日历表格头部的文字, 后期 Antd 支持修改头部文字后可删除
    Array.from(document.getElementsByClassName(styles.calendar)[0].getElementsByTagName('th')).forEach(_ => {
      _.innerHTML = `<strong>${basicIntl.get(`Calendar.周${_.textContent}`)}</strong>`
    })
  }, [])
  return <AntdCalendar {...props} className={styles.calendar} />
})
