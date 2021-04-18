import React from 'react'
import ReactIntlUniversal from 'react-intl-universal'
import 'intl/locale-data/jsonp/en.js'
import 'intl/locale-data/jsonp/zh.js'

// 该文件在 ./index.tsx 导入，将会在入口文件初始化加载

type LanguageType = 'zh-CN' | 'en-US'
type ReactIntl = typeof ReactIntlUniversal

declare global {
  interface Window {
    intl: ReactIntl
    // 语言
    lang: LanguageType
  }
  const intl: ReactIntl
}

// 为 ReactIntlUniversal 添加全局的声明，任何文件中无需导入 react-intl-universal 模块
window.intl = ReactIntlUniversal
// 设置多国语言,url 上带 ?lang = "**" ,会被自动写入到 lang中
window.lang = (window.localStorage.getItem('lang') as LanguageType) !== 'en-US' ? 'zh-CN' : 'en-US'

declare module 'react-intl-universal' {
  export function getReactNode(key: string, options: AnyObject<React.ReactText | React.ReactElement>): React.ReactNode
  // 以下两个类型声明根据源码补充
  export const options: {
    readonly locales: AnyObject
    readonly currentLocale: string
  }
  export function getDescendantProp(locales: AnyObject, key: string): string | undefined
}
ReactIntlUniversal.getReactNode = (key, options) => {
  const { locales, currentLocale } = ReactIntlUniversal.options
  const stringData = ReactIntlUniversal.getDescendantProp(locales[currentLocale], key)
  if (stringData === undefined) {
    throw new Error(`locales 字段 ${key} 值不能为 undefined 或该字段未定义`)
  }
  const stringArray = stringData.split(/(?=\{[\w]+?\})|(?<=\{[\w]+?\})/g)
  return stringArray.map((_, index) => <React.Fragment key={React.isValidElement(_) ? _.key ?? index : index}>{/\{[\w]+?\}/.test(_) ? options[_.slice(1, -1)] ?? '' : _}</React.Fragment>)
}
