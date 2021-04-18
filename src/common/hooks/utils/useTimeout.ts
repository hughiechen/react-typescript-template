/*
 * @Author: Hughie
 * @Date: 2020-06-29 11:00:10
 * @Last Modified by:   Hughie
 * @Last Modified time: 2020-06-29 11:00:10
 * @description 计时器
 */
import React from 'react'

/**
 * 计时器
 * @param handler
 * @param timeout
 * @returns
 * - start 开始执行 handler
 * - clear 停止，清除计时器
 */
export function useTimeout<F extends (...args: any[]) => any>(handler: F, timeout?: number): [start: (...args: Parameters<F>) => void, clear: () => void] {
  const timer = React.useRef<number | undefined>()
  const callback = React.useRef(handler)

  const clear = React.useCallback(() => {
    window.clearTimeout(timer.current)
  }, [])

  const start = React.useCallback<(...args: Parameters<F>) => void>(
    (...args) => {
      clear()
      timer.current = window.setTimeout(callback.current, timeout, ...args)
    },
    [clear, timeout]
  )

  return [start, clear]
}
