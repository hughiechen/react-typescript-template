import { useCache } from './useCache'
import { takeAsyncLast } from '../../utils/methods/takeAsyncLast'

/**
 * takeAsyncLast 的 hook 写法
 * @param fn api 函数
 */
export function useTakeAsyncLast<T extends (...arg: any[]) => Promise<any>>(fn: T) {
  return useCache(() => takeAsyncLast()(fn))[0]
}
