/*
 * @Author: Hughie
 * @Date: 2020-06-29 11:00:33
 * @Last Modified by:   Hughie
 * @Last Modified time: 2020-06-29 11:00:33
 * @description 计时器，使用 setTimeout 模拟 setInterval，setInterval不会等待函数执行完成后再重新计时
 */
import React from 'react'

/**
 * 计时器，使用 setTimeout 模拟 setInterval，setInterval不会等待函数执行完成后再重新计时
 * @param handler
 * @param timeout
 * @returns
 * - start 开始执行 handler
 * - stop 停止
 */
export function useTimeoutLoop(handler: () => void | Promise<void>, timeout?: number) {
  const timer = React.useRef<number | undefined>()
  const callback = React.useRef(handler)

  const stop = React.useCallback(() => {
    window.clearTimeout(timer.current)
  }, [])

  const start = React.useCallback(() => {
    stop()
    timer.current = window.setTimeout(async () => {
      await callback.current()
      start()
    }, timeout)
  }, [stop, timeout])

  return { start, stop }
}
