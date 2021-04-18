import { renderHook, act } from '@testing-library/react-hooks'
import { useSetState } from '../useSetState'

describe('useSetState', () => {
  test('test useSetState', () => {
    const { result, rerender } = renderHook(() =>
      useSetState({
        name: 'jack',
        age: 10,
      })
    )
    act(() => {
      result.current[1]({ name: 'Tom' })
    })
    rerender()
    expect(result.current[0]).toEqual({
      name: 'Tom',
      age: 10,
    })
  })
})
