/*
 * @Author: Hughie
 * @Date: 2020-06-29 11:01:24
 * @Last Modified by: Hughie
 * @Last Modified time: 2020-06-29 11:01:48
 * @description 使用 hooks 模拟的组件生命周期
 */
import React from 'react'

/**
 * 返回组件是否第一次渲染
 */
export function useIsFirstRender() {
  const isFirstRender = React.useRef(true)
  if (isFirstRender.current) {
    isFirstRender.current = false
    return true
  }
  return isFirstRender.current
}

/**
 * 返回组件挂载状态
 * @return (必须返回的是一个对象)React.MutableRefObject<boolean>;
 * @example
 * ```tsx
 * const isMount = useMountedStatus() // 禁止使用解构，否则在 useCallback 中无效
 * const Test = React.useCallback(async => {
 *  await delay(2000)
 *  if (!isMount.current) {
 *    // do nothing
 *  }
 * }, [isMount])
 * ```
 */
export function useMountedStatus() {
  const isMount = React.useRef(true)
  useWillUnmount(() => {
    isMount.current = false
  })
  return isMount
}

/**
 * 组件加载完成
 * @param effect
 */
export function useDidMount(effect: () => void | Promise<void>) {
  React.useEffect(() => {
    effect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

/**
 * 组件将要卸载
 * @param fn
 */
export function useWillUnmount(fn: () => void) {
  const fnRef = React.useRef(fn)
  fnRef.current = fn
  React.useEffect(() => () => fnRef.current(), [])
}

/**
 * 组件更新
 * @param callback
 * @param deps
 */
export function useDidUpdate(callback: () => void, deps?: React.DependencyList) {
  const isFirstRender = useIsFirstRender()
  React.useEffect(() => {
    if (!isFirstRender) {
      callback()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

/**
 * 强制刷新组件
 */
export function useForceUpdate() {
  const [, setCount] = React.useState(0)
  const forceUpdate = React.useCallback(() => {
    setCount(prevCount => prevCount + 1)
  }, [])
  return forceUpdate
}
