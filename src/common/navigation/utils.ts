import querystring from 'query-string'
import { history } from './history'

/**
 * 获取 query 的值
 */
export function getQuery<T = any>(): Partial<T> {
  return (querystring.parse(history.location.search) as unknown) as Partial<T>
}

/**
 * 生成 search 字符串
 * @param searchObject json 对象
 * @param withCurrentSearch 是否将当前 search 携带上
 */
export function createSearch(searchObject: AnyObject, withCurrentSearch?: boolean) {
  const finalLocation = {
    ...searchObject,
    ...(withCurrentSearch ? querystring.parse(history.location.search) : null),
  }
  const searchString = querystring.stringify(finalLocation)
  return searchString ? `?${searchString}` : searchString
}
