/*
 * @Author: Hughie
 * @Date: 2020-06-29 10:58:46
 * @Last Modified by:   Hughie
 * @Last Modified time: 2020-06-29 10:58:46
 * @description 为输入性组件提供双向绑定功能，如 Input, Checked
 */
import React from 'react'

/**
 * 为输入性组件提供双向绑定功能，如 Input, Checked
 * @param initialState 初始值
 */
export function useInput<S>(initialState: S | (() => S)) {
  const [value, setValue] = React.useState(initialState)
  return { value, onChange: setValue }
}
