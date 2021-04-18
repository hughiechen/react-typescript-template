import { renderHook, act } from '@testing-library/react-hooks'
import { useInput } from '../useInput'

describe('useInput', () => {
  test('test onChange', () => {
    const { result } = renderHook(() => useInput(''))

    act(() => {
      result.current.onChange('test')
    })

    expect(result.current.value).toBe('test')
  })
})
