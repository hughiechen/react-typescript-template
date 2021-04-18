import { renderHook, act } from '@testing-library/react-hooks'
import { useTimeout } from '../useTimeout'

describe('useTimeout', () => {
  jest.useFakeTimers()
  test('test exec', () => {
    const fn = jest.fn()
    const { result } = renderHook(() => useTimeout(fn, 1000))
    act(() => {
      result.current[0]()
    })
    jest.runOnlyPendingTimers()
    expect(fn).toBeCalledTimes(1)
  })
})
