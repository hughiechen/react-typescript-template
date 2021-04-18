import { renderHook, act } from '@testing-library/react-hooks'
import { useInterval } from '../useInterval'

describe('useInterval', () => {
  jest.useFakeTimers()
  test('test onChange', () => {
    const fn = jest.fn()
    const { result } = renderHook(() => useInterval(fn, 1000))
    act(() => {
      result.current.start()
    })
    jest.runTimersToTime(1000)
    jest.runTimersToTime(1000)
    jest.runTimersToTime(1000)
    jest.runTimersToTime(1000)
    jest.runTimersToTime(1000)
    act(() => {
      result.current.stop()
    })
    expect(fn).toBeCalledTimes(5)
  })
})
