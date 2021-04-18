/*
 * @Author: Hughie
 * @Date: 2020-06-28 17:13:26
 * @LastEditTime: 2020-06-29 11:01:12
 * @LastEditors: Hughie
 * @Description:
 */
import { renderHook, act } from '@testing-library/react-hooks'
import { useFetchTableData } from '../useFetchTableData'

interface TableData {
  list: { name: string; age: number }[]
  totalCount: number
  query: PagingTableQuery
}

describe('useFetchTableData', () => {
  jest.useFakeTimers()

  /** api mock 函数 */
  const fetchApi = jest.fn(
    async (query: PagingTableQuery): Promise<TableData> => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            list: [{ name: 'jack', age: 20 }],
            totalCount: 1,
            query,
          })
        }, 1000)
      })
    }
  )

  test('fetchData: check loading, query, data', async () => {
    // /** 跟踪  window.setTimeout 的调用情况 */
    // jest.spyOn(global, 'setTimeout')
    const { result } = renderHook(() =>
      useFetchTableData(fetchApi, {
        pageNum: 1,
        pageSize: 10,
      })
    )

    act(() => {
      result.current.fetchData()
    })

    expect(result.current.state.loading).toBeTruthy()

    await act(async () => {
      jest.runAllTimers()
    })

    expect(result.current.state.loading).toBeFalsy()
    expect(result.current.state.data).toEqual({
      list: [{ name: 'jack', age: 20 }],
      totalCount: 1,
      query: {
        pageNum: 1,
        pageSize: 10,
      },
    })
    expect(result.current.state.query).toEqual({ pageNum: 1, pageSize: 10 })
    expect(setTimeout).toBeCalled()
  })

  test('test: updateQuery, reset', async () => {
    const { result } = renderHook(() =>
      useFetchTableData(fetchApi, {
        pageNum: 1,
        pageSize: 10,
      })
    )

    act(() => {
      result.current.updateQuery({ pageSize: 20 })
    })

    expect(result.current.state.query).toEqual({ pageNum: 1, pageSize: 20 })

    act(() => {
      result.current.reset()
    })

    expect(result.current.state).toEqual({
      data: null,
      loading: false,
      query: {
        pageNum: 1,
        pageSize: 10,
      },
    })
  })
})
