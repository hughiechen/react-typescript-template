import { StringUtil } from '../basic/StringUtil'

export type TakeAsyncLastReturn<R> = { result: R; isLast: true } | { isLast: false; status: 'ok' | 'error' }

/**
 * 多次执行异步函数, 标识最后一次异步返回的结果
 * @description 内部使用了 try catch ,在高频执行时，性能可能比较差，不建议在高频调用的场景下使用，比如：使用该方式实现输入框防抖效果
 */
export const takeAsyncLast = () => <P extends any[], R>(fn: (...args: P) => Promise<R>) => {
  let id: string | undefined
  return async (...args: P): Promise<TakeAsyncLastReturn<R>> => {
    const uuid = StringUtil.uuid()
    id = uuid
    try {
      const result = (await fn(...args)) as R
      if (uuid === id) {
        return {
          result,
          isLast: true,
        }
      }
      return { isLast: false, status: 'ok' }
    } catch (error) {
      if (uuid === id) {
        throw error
      }
      return { isLast: false, status: 'error' }
    }
  }
}
