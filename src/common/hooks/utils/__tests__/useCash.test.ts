import { renderHook, act } from '@testing-library/react-hooks'
import { useCache } from '../useCache'
import { useForceUpdate } from '../../lifecycle'

interface Cash {
  name: string
  age: number
}

function useTest(testData: Cash | (() => Cash)) {
  const [data, updateData] = useCache<Cash>(testData)

  const forceUpdate = useForceUpdate()

  return { data, updateData, forceUpdate }
}

describe('useCache', () => {
  test('test object value', () => {
    let prevData: Cash | null = null
    const { result } = renderHook(() => useTest({ name: 'jack', age: 10 }))
    prevData = result.current.data
    act(() => {
      result.current.forceUpdate()
    })
    // 同一引用使用 toBe 比较
    expect(result.current.data).toBe(prevData)
  })

  test('test function value', () => {
    let prevData: Cash | null = null
    const { result } = renderHook(() => useTest(() => ({ name: 'jack', age: 10 })))
    prevData = result.current.data
    act(() => {
      result.current.forceUpdate()
    })
    // 同一引用使用 toBe 比较
    expect(result.current.data).toBe(prevData)
  })

  test('test update cache', () => {
    const { result, rerender } = renderHook(() => useTest({ name: 'jack', age: 10 }))
    result.current.updateData({ name: 'Tom', age: 20 })
    rerender()
    expect(result.current.data).toEqual({ name: 'Tom', age: 20 })
  })
})
