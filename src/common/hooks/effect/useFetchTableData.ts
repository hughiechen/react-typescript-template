/*
 * @Author: Hughie
 * @Date: 2020-06-29 10:57:38
 * @Last Modified by: sheng
 * @Last Modified time: 2021-01-18 14:24:37
 * @description 获取表格数据，包含分页，关键字查询，loading， totalCount 等功能
 */
import { useSetState } from '../utils/useSetState'
import { useCache } from '../utils/useCache'
import { usePersistFn } from '../utils/usePersistFn'
import { TablePaginationConfig } from 'antd/lib/table'
import { useMountedStatus } from '../lifecycle'

interface UseFetchTableDataState<R, Q> {
  data: R | null
  loading: boolean
  query: Q
}

/**
 * 获取表格数据，包含分页，关键字查询，loading， totalCount 等功能
 * @params
 * - fetchApi 获取表格数据的 api 函数，需要返回表格数据
 * - initialQuery 初始的查询条件，可传入一个函数计算出查询条件，只会执行一遍
 * - autoLoading 是否自动根据 fetchApi 状态处理 loading 状态
 * @return \{state, fetchData, updateQuery, updateLoading, getPageNumAfterRemovedItem, reset\}
 * - state 查看 UseFetchTableDataState
 * - fetchData 根据 query 搜索，返回引用不变
 * - updateQuery 更新搜索条件，返回引用不变
 * - updateLoading 更新 loading 状态的值，一般在 autoLoading 为 false 时可在外部手动更改，返回引用不变
 * - onPageChange 分页变化时进行搜索
 * - getPageNumAfterRemovedItem 删除表格一项后，计算出需要查询的页数，当在最后一页，且最后一页数据只有一项时，删除成功，那么需要查询的页数在原基础上减 1
 * - updateData 将返回值更新 fetchApi 获取的数据，并重渲染
 * - reset 清除数据，内部使用 setState，异步更新数据，所以需要在 rest 后使用重置后的 query 进行其他操作，那么 reset 会返回初始 query，返回引用不变
 */
export function useFetchTableData<F extends (args: any) => Promise<any>>(fetchApi: F, initialQuery: Parameters<F>[0] | (() => Parameters<F>[0]), autoLoading = true) {
  const [defaultQuery] = useCache(initialQuery)

  const isMount = useMountedStatus()

  const [state, setState] = useSetState<Readonly<UseFetchTableDataState<PromiseReturnType<F>, Parameters<F>[0]>>>({
    data: null,
    loading: false,
    query: defaultQuery,
  })

  const fetchData = usePersistFn<OptionalParamsMethod<Parameters<F>[0], any | void>>(async query => {
    try {
      const finalQuery = { ...state.query, ...query }
      if (autoLoading) {
        setState({ loading: true, query: finalQuery })
      } else {
        setState({ query: finalQuery })
      }
      const result = await fetchApi(finalQuery)
      if (isMount.current) {
        setState({ data: result })
      }
      return result
    } finally {
      if (autoLoading && isMount.current) {
        setState({ loading: false })
      }
    }
  })

  const updateQuery = usePersistFn<OptionalParamsMethod<Parameters<F>[0], void>>(query => {
    setState({ query: { ...state.query, ...query } })
  })

  const updateLoading = usePersistFn((loading: boolean) => {
    setState({ loading })
  })

  const updateData = usePersistFn((fn: (prevData: Readonly<PromiseReturnType<F>> | null) => PromiseReturnType<F> | null) => {
    setState({ data: fn(state.data) })
  })

  const onPageChange = usePersistFn((pagination: TablePaginationConfig) => fetchData({ pageNum: pagination.current!, pageSize: pagination.pageSize! }))

  const getPageNumAfterRemovedItem = usePersistFn((pageNum: number, dateSourceLength: number) => {
    return pageNum > 1 && dateSourceLength === 1 ? pageNum - 1 : pageNum
  })

  /** 返回初始搜索条件 */
  const reset = usePersistFn(
    (): Readonly<Parameters<F>[0]> => {
      setState({
        data: null,
        loading: false,
        query: defaultQuery,
      })
      return defaultQuery
    }
  )

  return { state, fetchData, updateQuery, updateLoading, onPageChange, reset, getPageNumAfterRemovedItem, updateData }
}
