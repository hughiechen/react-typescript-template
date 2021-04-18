import { renderHook, act } from '@testing-library/react-hooks'
import { useTimeoutLoop } from '../useTimeoutLoop'

describe('useInterval', () => {
  jest.useFakeTimers()
  test('test exec', () => {
    const fn = jest.fn()
    const { result } = renderHook(() => useTimeoutLoop(fn, 1000))
    act(() => {
      result.current.start()
    })
    jest.runTimersToTime(1000)
    jest.runTimersToTime(1000)
    jest.runTimersToTime(1000)
    jest.runTimersToTime(1000)
    jest.runTimersToTime(1000)

    expect(fn).toHaveBeenCalledTimes(1)
  })
})
