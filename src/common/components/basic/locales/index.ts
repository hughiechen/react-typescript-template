import zhCN from './zh_CN.json'
import enUS from './en_US.json'

type LanguageType = 'zh-CN' | 'en-US'

class BasicIntl {
  private data = zhCN

  init(lang: LanguageType) {
    this.data = lang === 'en-US' ? enUS : zhCN
  }

  // TODO: 完善类型
  get(key: string, options?: AnyObject): string | AnyObject {
    const value = (key.split('.').reduce((prev, next) => (prev === undefined ? undefined : prev[next]), this.data) as unknown) as string | AnyObject | undefined
    if (value === undefined) {
      throw new Error(`国际化文件中不存在 ${key}`)
    }
    if (typeof value === 'string') {
      return options ? value?.replace(/\{(.*?)\}/g, (_, $0) => options[$0]) : value
    }
    return value
  }
}

export const basicIntl = new BasicIntl()
