/*
 * @Author: Hughie
 * @Date: 2020-06-29 10:59:00
 * @Last Modified by: Hughie
 * @Last Modified time: 2020-06-29 10:59:52
 * @description 计时器
 */
import React from 'react'

/**
 * 计时器
 * @param handler 计时器重复执行的方法
 * @param timeout 等待时间
 * @returns
 * - start 开始执行 handler
 * - stop 停止
 */
export function useInterval(handler: () => void, timeout?: number) {
  const timer = React.useRef<number | undefined>()
  const callback = React.useRef(handler)

  const stop = React.useCallback(() => {
    window.clearInterval(timer.current)
  }, [])

  const start = React.useCallback(() => {
    stop()
    timer.current = window.setInterval(callback.current, timeout)
  }, [stop, timeout])

  return { start, stop }
}
