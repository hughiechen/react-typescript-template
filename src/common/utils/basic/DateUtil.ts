import moment, { Moment } from 'moment'

export type DateFormatType = 'YYYY/MM/DD HH:mm:ss' | 'YYYY/MM/DD HH:mm' | 'MM/DD HH:mm' | 'YYYY/MM/DD' | 'YYYY/MM' | 'MM/DD' | 'HH:mm:ss' | 'HH:mm'

export class DateUtil {
  private static EnDateFormatMap: Partial<Record<DateFormatType, string>> = {
    'YYYY/MM/DD HH:mm:ss': 'MM/DD/YYYY HH:mm:ss',
    'YYYY/MM/DD HH:mm': 'MM/DD/YYYY HH:mm',
    'YYYY/MM/DD': 'MM/DD/YYYY',
    'YYYY/MM': 'MM/YYYY',
  }

  private static getTimeString(num: number, type: 'Y/O.' | 'year' | 'month' | 'and month' | 'day' | 'hour' | 'minute') {
    const map = {
      'Y/O.': '岁',
      year: '年',
      month: '月',
      day: '天',
      hour: '小时',
      minute: '分',
      'and month': '个月',
    }
    return window.lang === 'zh-CN' ? `${num}${map[type]}` : num > 1 ? (type === 'and month' ? `and ${num} months` : `${num}${type}`) : type === 'and month' ? `and ${num} month` : `${num}${type}`
  }

  /**
   * 格式化时间相对此时此刻的相对日期，一般用于获取几岁几月几日
   * @param date moment 对象
   * @returns \{ years, months, days \}
   *
   * @example
   * getAge(moment('2000-09-14T16:00:00.000Z'))
   * 返回: { years: 9, months: 1, days: 17 }
   * 代表: 9岁 1个月 17天
   */
  static getAge(date: Moment) {
    const now = moment()
    const current = moment(date) // 复制一份，不然会改变传入的时间对象
    const years = now.diff(current, 'year')
    current.add(years, 'years')
    const months = now.diff(current, 'months')
    current.add(months, 'months')
    const days = now.diff(current, 'days')
    return { years, months, days }
  }

  /**
   * 将时间生成生日字符串
   * @param date moment 对象
   * @param type 生成的类型，包含年 | 包含月 | 包含日
   * @param separator 年月日分隔符，默认 '/', 生成：12岁/2月/3天
   */
  static getAgeString(date: Moment, type: 'withYears' | 'withMonths' | 'withDays' = 'withYears', separator = '/') {
    const { years, months, days } = DateUtil.getAge(date)
    if (type === 'withMonths') {
      return [this.getTimeString(years, 'Y/O.'), this.getTimeString(months, 'month')].join(separator)
    }
    if (type === 'withDays') {
      return [this.getTimeString(years, 'Y/O.'), this.getTimeString(months, 'month'), this.getTimeString(days, 'day')].join(separator)
    }
    return this.getTimeString(years, 'Y/O.')
  }

  /**
   * 通过生日转换为年龄字符串
   * 规则：小于6岁的需要显示月、小于1个月的显示天，大于6岁的只显示岁数
   * @param dateOfBirth moment 对象
   * @example
   * getAgeStringByBirth(moment('2019-10-14T16:00:00.000Z'))
   * 返回: 7岁、5岁6个月、1天
   */
  static getAgeStringByBirth(date: Moment | string) {
    if (!moment.isMoment(date)) {
      date = moment(date)
    }
    if (!date.isValid()) {
      return '-'
    }
    const { years, months, days } = DateUtil.getAge(date)
    if (years === 0 && months < 1) {
      return this.getTimeString(days, 'day')
    }
    if (years < 6) {
      return `${this.getTimeString(years, 'Y/O.')} ${this.getTimeString(months, 'and month')}`
    }
    return this.getTimeString(years, 'Y/O.')
  }

  /**
   * 格式化时间
   * @param date moment 对象
   * @param type 格式化类型
   * @param defaultStr 转换失败时候，默认的返回值
   */
  static format(date?: Moment | Date | string | null, formatString: DateFormatType = 'YYYY/MM/DD HH:mm:ss', defaultStr = '--') {
    const formatStr = window.lang === 'zh-CN' ? formatString : this.EnDateFormatMap[formatString] ?? formatString
    if (date) {
      const formattedDate = moment(date)
      if (formattedDate.isValid()) {
        return formattedDate.format(formatStr)
      }
    }
    return defaultStr
  }

  /**
   * 获取当前时间所在周周一到周日的时间列表
   * @param date
   */
  static getDateListFormMondayToSunday(date?: Moment, callback?: (date: Moment, index: number) => Moment) {
    const monday = moment(date).startOf('week')
    return Array.from(Array(7)).map((_, index) => {
      const current = moment(monday).add(index, 'day')
      return callback?.(current, index) ?? current
    })
  }

  /**
   * 以当前周为参考，获取周一到周日的日期
   * @param position 相距当前周的数量，默认: 0 本周；-1 代表上周，1 代表下周
   * @param callback 可以对每一个日期做处理，返回值将作为当天时间
   */
  static getWeeklyDatesByPosition(position = 0, year = moment().year(), callback?: (date: Moment, index: number) => Moment) {
    const currentWeekNum = moment().week() + position
    return this.getWeeklyDatesByWeekNum(currentWeekNum, year, callback)
  }

  /**
   * 根据周数计算当前周周一到周日的日期，比如获取第 47 周的所有日期
   * @param weekNum 周数
   * @param callback 可以对每一个日期做处理，返回值将作为当天时间
   */
  static getWeeklyDatesByWeekNum(weekNum: number, year = moment().year(), callback?: (date: Moment, index: number) => Moment) {
    return this.getDateListFormMondayToSunday(moment().year(year).week(weekNum), callback)
  }

  /**
   * 根据当前时间获取本周的所有时间
   * @param date 当前时间
   * @param callback 可以对每一个日期做处理，返回值将作为当天时间
   */
  static getWeeklyDates(date: Moment, callback?: (date: Moment, index: number) => Moment) {
    return this.getWeeklyDatesByWeekNum(date.week(), date.year(), callback)
  }

  /**
   * 根据时间获取当天为周几
   * @param date moment 时间
   */
  static getWeekDayName(date: Moment): string {
    return moment.localeData().weekdays(date)
  }

  /**
   * 根据年龄算出出生日期
   * @param age 年龄
   * @return  dateOfBirth
   */
  static getDateOfBirthByAge(age: number) {
    return moment().subtract(age, 'years')
  }

  /**
   * 将秒数换算成小时,天,月（不是时间戳）
   * @param seconds 秒数
   */
  static formatSeconds(seconds: number) {
    if (seconds < 0) {
      seconds = 0
    }
    const minutes = Math.floor(seconds / 60)
    let hours = 0
    let days = 0
    if (minutes >= 60) {
      hours = Math.ceil(minutes / 60)
    }
    if (hours >= 24) {
      days = Math.ceil(hours / 24)
    }
    if (days) {
      return this.getTimeString(days, 'day')
    } else if (hours) {
      return this.getTimeString(hours, 'hour')
    } else if (minutes) {
      return this.getTimeString(minutes, 'minute')
    } else {
      return this.getTimeString(0, 'minute')
    }
  }

  /**
   * 判断一个时间是否为今天的时间
   */
  static isTimeOnDay(date: Moment | Date | string) {
    const copyDate = moment(date)
    if (copyDate.isValid()) {
      const today = moment()
      return today.startOf('day').valueOf() <= copyDate.valueOf() && today.endOf('day').valueOf() > copyDate.valueOf()
    }
    return false
  }
}
