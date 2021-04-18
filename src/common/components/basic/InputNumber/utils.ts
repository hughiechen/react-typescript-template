/**
 * 获取最大值
 *
 * string 一定为数字字符串
 */
export function getMaxValue(value: string | undefined | null, max?: number, over?: () => void) {
  if (typeof value === 'string' && typeof max === 'number') {
    const numberValue = Number(value)
    if (numberValue > max) {
      over?.()
      return max.toString()
    }
  }
  return value
}

/**
 * 获取最小值
 *
 * string 一定为数字字符串
 */
export function getMinValue(value: string | undefined | null, min?: number, less?: () => void) {
  if (typeof value === 'string' && typeof min === 'number' && Number(value) <= min) {
    const numberValue = Number(value)
    if (numberValue < min) {
      less?.()
      return min.toString()
    }
  }
  return value
}

/**
 * input onChange 获取正确的值
 *
 * 空字符串：undefined
 * 不能转化为数字的： null
 * 可以转化位数字的： string
 */
export function parseValue(value: string): string | undefined | null {
  if (value === '') {
    return undefined
  }
  if (/^-?00+$/.test(value)) {
    return '0'
  }
  const numberValue = Number(value)
  if (Number.isNaN(numberValue)) {
    if (value === '-') {
      throw new Error('-')
    }
    return null
  }
  return value
}

/**
 * 获取正确精度的值
 */
export function parsePrecisionValue(value: string | undefined | null, precision?: number) {
  if (typeof precision === 'number' && typeof value === 'string') {
    const splitValues = value.split('.')
    if (splitValues[1]) {
      return [splitValues[0], splitValues[1].slice(0, precision)].join('.')
    }
  }
  return value
}

/**
 * 获取范围内的值
 * @param value
 * @param min
 * @param max
 */
export function getValueInRange(value: number | undefined, min?: number, max?: number) {
  if (typeof max === 'number' && value && value > max) {
    return max
  }
  if (typeof min === 'number' && value && value < min) {
    return min
  }
  return value
}
