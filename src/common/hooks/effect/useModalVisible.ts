/*
 * @Author: Hughie
 * @Date: 2020-06-29 10:33:37
 * @Last Modified by: Hughie
 * @Last Modified time: 2020-06-29 10:40:09
 * @description: 控制弹窗显示
 */

import React from 'react'
import { useSetState } from '../utils/useSetState'

interface UseModalVisibleState<T> {
  visible: boolean
  data?: T
}

/**
 * 控制弹窗显示
 * @returns
 * - cancel
 *  - 引用不变
 *  - 关闭弹窗，不清除 open 时存储的 data
 * - open
 *  - 引用不变
 *  - 打开弹窗，可传入打开弹窗时，需要存储的数据，该数据可传给 Modal
 * - state：{ visible, data }：传给弹窗的数据 data 以及 visible
 */
export function useModalVisible<T>() {
  const [state, setState] = useSetState<UseModalVisibleState<T>>({
    visible: false,
    data: undefined,
  })
  const open = React.useCallback(
    (data?: T) => {
      setState({ visible: true, data })
    },
    [setState]
  )
  const cancel = React.useCallback(() => {
    setState({ visible: false })
  }, [setState])
  return { state, cancel, open }
}
