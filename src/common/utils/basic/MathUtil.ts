import numeral from 'numeral'

export class MathUtil {
  /**
   * 加法
   */
  static add(digital1: number, digital2: number, ...digitals: number[]) {
    return digitals.reduce((prev, next) => prev.add(next), numeral(digital1).add(digital2)).value()!
  }

  /**
   * 减法
   */
  static subtract(digital1: number, digital2: number, ...digitals: number[]) {
    return digitals.reduce((prev, next) => prev.subtract(next), numeral(digital1).subtract(digital2)).value()!
  }

  /**
   * 相乘
   */
  static multiply(digital1: number, digital2: number, ...digitals: number[]) {
    return digitals.reduce((prev, next) => prev.multiply(next), numeral(digital1).multiply(digital2)).value()!
  }

  /**
   * 除法
   */
  static division(digital1: number, digital2: number, ...digitals: number[]) {
    return digitals.reduce((prev, next) => prev.divide(next), numeral(digital1).divide(digital2)).value()!
  }

  /**
   * 指数运算
   * @param base 底数
   * @param exponent 指数
   */
  static pow(base: number, exponent: number): number {
    if (exponent < 0) {
      return MathUtil.division(1, MathUtil.pow(base, Math.abs(exponent)))!
    }
    if (exponent === 0) {
      return 1
    }
    if (exponent === 1) {
      return base
    }
    return MathUtil.multiply(base, base, ...Array(exponent - 2).fill(base))!
  }
}
