/*
 * @Author: Hughie
 * @Date: 2020-07-03 15:36:23
 * @Last Modified by: Hughie
 * @Last Modified time: 2020-07-03 15:42:15
 * @description 防抖
 */

import { useTimeout } from './useTimeout'

/**
 * 防抖
 * @param handler 需要防抖的函数
 * @param timeout 防抖延时
 * @returns
 * - start 开始执行 handler
 * - stop 停止，清除计时器
 */
export function useDebounce<F extends (...args: any[]) => any>(handler: F, timeout = 300) {
  return useTimeout(handler, timeout)
}
