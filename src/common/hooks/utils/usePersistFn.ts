/*
 * @Author: Hughie
 * @Date: 2020-09-15 13:14:10
 * @LastEditors: Hughie
 * @LastEditTime: 2020-09-15 13:14:10
 * @Description: 持久化 function 的 Hook
 */

/**
 * 在某些场景中，你可能会需要用 useCallback 记住一个回调，但由于内部函数必须经常重新创建，记忆效果不是很好，导致子组件重复 render。
 * 对于超级复杂的子组件，重新渲染会对性能造成影响。通过 usePersistFn，可以保证函数地址永远不会变化。
 * 具体请看：https://ahooks.js.org/zh-CN/hooks/advanced/use-persist-fn
 */

import { useCallback, useRef } from 'react'

export type noop = (...args: any[]) => any

export function usePersistFn<T extends noop>(fn: T) {
  const ref = useRef<any>(() => {
    throw new Error('Cannot call function while rendering.')
  })

  ref.current = fn

  const persistFn = useCallback(((...args) => ref.current(...args)) as T, [ref])

  return persistFn
}
