/*
 * @Author: Hughie
 * @Date: 2020-06-29 10:59:58
 * @Last Modified by:   Hughie
 * @Last Modified time: 2020-06-29 10:59:58
 * @description 扩展 React.useState,使得支持类似 this.setState 的合并原 state 的功能
 */
import React from 'react'

/**
 * 扩展 React.useState,使得支持类似 this.setState 的合并原 state 的功能
 * @param initialState
 * @returns [state, setState]
 * - setState 引用不变
 * - setState 为函数时，返回 null 则不更新组件
 */
export function useSetState<S extends AnyObject>(initialState: S | (() => S)) {
  const [state, updateState] = React.useState(initialState)
  const setState = React.useCallback<SetStateLikeMethod<S>>(inputState => {
    updateState(s => {
      const newState = inputState instanceof Function ? inputState(s) : inputState
      return newState ? { ...s, ...newState } : s
    })
  }, [])
  return [state, setState] as const
}
