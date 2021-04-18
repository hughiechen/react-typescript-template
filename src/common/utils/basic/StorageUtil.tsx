import moment, { Moment, isMoment, DurationInputArg2 } from 'moment'

export interface LocalStorageDataItem<T> {
  data: T
  /**
   * 过期时间：
   * @type number：天数, 算上当天，比如 值为 5，则包含今天共保存 5 天
   * @type Moment：日期
   */
  expire?: number | Moment
}

export class LocalStorageUtil {
  /**
   * @param key 键
   * @param data 存储的数据
   * @param expire 过期时间，具体请看接口 LocalStorageDataItem.expire
   */
  static set<T>(key: string, data: T | null, expire?: number | Moment, type: DurationInputArg2 = 'day') {
    if (expire && expire <= 0) {
      throw new Error('LocalStorageUtil.set expire 必须大于等于 0，若需要存储当前会话，请使用 SessionStorageUtil')
    }
    if (data !== null) {
      const now = moment()
      const storageValue: LocalStorageDataItem<T> = {
        data,
        expire:
          expire !== undefined
            ? isMoment(expire)
              ? expire.valueOf()
              : now
                  .add(expire - 1, type)
                  .endOf(type)
                  .valueOf()
            : undefined,
      }
      localStorage.setItem(key, JSON.stringify(storageValue))
    } else {
      localStorage.removeItem(key)
    }
  }

  static get<T = any>(key: string, defaultValue: T | null = null): T | null {
    try {
      const data = localStorage.getItem(key)
      if (data !== null) {
        const finalData: LocalStorageDataItem<T> = JSON.parse(data)
        // 判断过期
        if (finalData.expire !== undefined && moment().valueOf() > finalData.expire) {
          localStorage.removeItem(key)
          return defaultValue
        }
        return finalData.data
      }
      return data
    } catch (e) {
      return defaultValue // JSON.parse 解析不是由 LocalStorageUtil.set 储存的数据发生错误，则直接返回默认值
    }
  }

  static clear() {
    localStorage.clear()
  }
}

export class SessionStorageUtil {
  /**
   * @param key 键
   * @param data 存储的数据
   */
  static set<T>(key: string, data: T | null) {
    if (data !== null) {
      sessionStorage.setItem(key, JSON.stringify(data))
    } else {
      sessionStorage.removeItem(key)
    }
  }

  static get<T>(key: string, defaultValue: T | null = null): T | null {
    try {
      const data = sessionStorage.getItem(key)
      return data !== null ? (data === 'undefined' ? undefined : JSON.parse(data)) : defaultValue
    } catch (e) {
      return defaultValue // JSON.parse 解析不是由 SessionStorageUtil.set 储存的数据错误，则直接返回默认值
    }
  }

  static clear() {
    sessionStorage.clear()
  }
}
