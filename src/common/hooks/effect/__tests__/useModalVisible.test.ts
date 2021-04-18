/*
 * @Author: Hughie
 * @Date: 2020-06-28 17:13:26
 * @LastEditTime: 2020-06-29 11:01:12
 * @LastEditors: Hughie
 * @Description:
 */
import { renderHook, act } from '@testing-library/react-hooks'
import { useModalVisible } from '../useModalVisible'

test('useModalVisible', () => {
  const { result } = renderHook(() => useModalVisible<{ a: number }>())
  expect(result.current.state.visible).toBeFalsy()
  act(() => {
    result.current.open({ a: 1 })
  })
  expect(result.current.state.visible).toBeTruthy()
  expect(result.current.state.data).toEqual({ a: 1 })
  act(() => {
    result.current.cancel()
  })
  expect(result.current.state.visible).toBeFalsy()
})
