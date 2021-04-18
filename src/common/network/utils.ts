import moment from 'moment'

const ISO_DATE_FORMAT = /^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(\.\d+Z?)?$/

/**
 * url 与 params 生成完整 url
 * @param url 带有参数的 url
 * @param params 参数对应的对象
 */
export const stringifyPath = (url: string, params: AnyObject) => {
  return url.replace(/\/\{[\w]+?}/g, item => {
    const value = params[item.slice(2, -1)]
    return value ? `/${encodeURIComponent(value)}` : ''
  })
}

export function parseWithMoment(data: string) {
  return JSON.parse(data, (key: string | number, value: any) => {
    if (typeof value === 'string' && ISO_DATE_FORMAT.test(value)) {
      return moment(value)
    }
    return value
  })
}

/**
 * 序列化时间对象，主要供后端支持
 * @param data
 */
export function parseDateToISO(data: string) {
  return JSON.parse(data, (key: string | number, value: any) => {
    if (typeof value === 'string' && ISO_DATE_FORMAT.test(value)) {
      return moment(value).format('YYYY-MM-DDTHH:mm:ss.SSS')
    }
    return value
  })
}
