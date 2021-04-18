/*
 * @Author: caoliusi
 * @Date: 2019-12-05 16:44:44
 * @LastEditTime: 2021-03-16 16:31:20
 * @LastEditors: Hughie
 * @Description: 数字相关方法
 */

import numeral from 'numeral'
import { MathUtil } from './MathUtil'

// 国际化为中文，影响到货币单位：¥
numeral.register('locale', 'zh-CN', {
  delimiters: {
    thousands: ',',
    decimal: '.',
  },
  abbreviations: {
    thousand: '千',
    million: '百万',
    billion: '十亿',
    trillion: '兆',
  },
  ordinal() {
    return '.'
  },
  currency: {
    symbol: '¥',
  },
})

numeral.register('locale', 'en2', {
  ...numeral.localeData('en'),
  currency: {
    symbol: '¥',
  },
})

numeral.locale(window.lang === 'en-US' ? 'en2' : 'zh-CN')

export class NumberUtil {
  /**
   * 保留数字小数点后几位有效数字（默认2位）
   * @param digital 数字
   * @param length 小数位数
   * @param rounding 四舍五入，默认 true
   */
  static toFixed(digital: number, length = 2, rounding = true): string {
    if (!rounding) {
      const divisor = Number('1'.padEnd(length + 1, '0'))
      digital = MathUtil.division(Math.floor(MathUtil.multiply(digital, divisor)), divisor)
    }
    return numeral(digital).format('0.'.padEnd(length + 2, '0'))
  }

  /**
   * 将数字转化为百分比并保留几位小数点位数（默认2位有效数字）
   * @param digital 数字
   * @param length 百分比小数位数
   * @param rounding 四舍五入，默认 true
   */
  static parseToPercentage(digital: number, length = 2, rounding = true): string {
    if (!rounding) {
      digital = Number(this.toFixed(digital, length + 2, false))
    }
    return numeral(digital).format(`${'0.'.padEnd(length + 2, '0')}%`)
  }

  /**
   * 数字格式化
   * @param digital 数字
   * @param format 格式
   */
  static parseToMoney(digital: number | string, format = '$0,0.00') {
    return numeral(digital).format(format)
  }

  /**
   * 数字格式化
   * @param digital 数字
   * @param format 格式
   */
  static parseToMoney2(digital: number | string, format?: string) {
    const len = this.splitLength(digital)
    format = !format ? (len > 2 ? '$0,0.0000' : '$0,0.00') : format
    return numeral(digital).format(format)
  }

  /**
   * 数字格式化
   * @param digital 数字
   * @param format 格式
   */
  static toMicrometerRmb(digital: number) {
    const rmb = this.toRmb(digital)
    let format = '0,0.'
    let len = this.splitLength(digital)
    while (len > 0) {
      format += '0'
      len--
    }

    return numeral(rmb).format(format)
  }

  /**
   * 保留几位小数
   * @param digital 数字
   * @param decimal 默认两位小数
   * @param rounding 默认四舍五入
   */
  static decimal(digital: number, decimal = 2, rounding = true) {
    return Number(this.toFixed(digital, decimal, rounding))
  }

  /**
   * 获取数字小数点后的长度
   * @param digital 数字
   */
  static splitLength(digital: number | string): number {
    return digital.toString().split('.')[1]?.length ?? 0
  }

  /**
   * 金额小数点后几位，存在4位及以上则保留4位，小于4位则保留2位
   * @param digital 数字
   * @param rounding 默认四舍五入
   */
  static toRmb(digital: number, rounding = true): string {
    const len = this.splitLength(digital)
    if (len >= 4) {
      /**
       * 若四舍五入后小数点变成多个0
       * 最小小数位为2位（末位可以为0），最大小数位为4位（超过2位，末位不能为0）
       */
      const newDigital = parseFloat(this.toFixed(digital, 4, rounding))
      const len2 = this.splitLength(newDigital)
      if (len2 <= 2) {
        return this.toFixed(newDigital, 2)
      } else {
        return this.toFixed(newDigital, len2)
      }
    } else if (len <= 2) {
      return this.toFixed(digital, 2, rounding)
    } else {
      return this.toFixed(digital, 3, rounding)
    }
  }

  /* 转为繁体描述
   * @param digital 数字
   */
  static toTCString(digital: number): string {
    let n = digital.toString()
    if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(digital.toString())) {
      return intl.get('illegal_data').d('数据非法') // 判断数据是否大于0
    }

    let unit = '千百拾亿千百拾万千百拾元角分'
    let str = ''
    n += '00'

    const indexPoint = n.indexOf('.') // 如果是小数，截取小数点前面的位数

    if (indexPoint >= 0) {
      n = n.substring(0, indexPoint) + n.substr(indexPoint + 1, 2) // 若为小数，截取需要使用的unit单位
    }

    unit = unit.substr(unit.length - n.length) // 若为整数，截取需要使用的unit单位
    for (let i = 0; i < n.length; i++) {
      str += '零壹贰叁肆伍陆柒捌玖'.charAt(Number(n.charAt(i))) + unit.charAt(i) // 遍历转化为大写的数字
    }

    return str
      .replace(/零(千|百|拾|角)/g, '零')
      .replace(/(零)+/g, '零')
      .replace(/零(万|亿|元)/g, '$1')
      .replace(/(亿)万|壹(拾)/g, '$1$2')
      .replace(/^元零?|零分/g, '')
      .replace(/元$/g, '元整')
  }
}
