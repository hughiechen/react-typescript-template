import React from 'react'
import { GetRowKey, SelectionSelectFn, TableRowSelection } from 'antd/lib/table/interface'
import { usePersistFn } from '../utils/usePersistFn'

/**
 * antd rowSelection 逻辑封装
 * @param rowKey 选择数据中哪一个字段为 select key
 * @returns [rowSelection, toggleSelectItem]
 * - rowSelection 可直接赋值给 Table 组件的 rowSelection 属性
 * - toggleSelectItem 当需要点击 Table 行进行选中时，可以使用该方法
 */
export function useRowSelection<T>(
  rowKey: (keyof T & string) | GetRowKey<T>
): [rowSelection: TableRowSelection<T>, toggleSelectItem: (key: React.Key) => void, setSelectedRowKeys: (keys: React.Key[]) => void] {
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<React.Key[]>([])

  const getRowKey = usePersistFn((record: T) => (rowKey instanceof Function ? rowKey(record) : rowKey))

  const onSelect: SelectionSelectFn<T> = usePersistFn((record: T, selected: boolean) => {
    const finalRowKey = getRowKey(record)
    const rowKeyValue = record[finalRowKey]
    const newSelectedRowKeys = [...selectedRowKeys]
    if (selected) {
      newSelectedRowKeys.push(rowKeyValue)
      setSelectedRowKeys(newSelectedRowKeys)
    } else {
      const index = newSelectedRowKeys.findIndex(_ => _ === rowKeyValue)
      if (index > -1) {
        newSelectedRowKeys.splice(index, 1)
        setSelectedRowKeys(newSelectedRowKeys)
      }
    }
  })

  const onSelectAll = usePersistFn((selected: boolean, selectedRows: T[], changeRows: T[]) => {
    if (selected) {
      const currentPageKeysValue = selectedRows.filter(Boolean).map(_ => _[getRowKey(_)])
      setSelectedRowKeys(selectedRowKeys.concat(currentPageKeysValue.filter(_ => !selectedRowKeys.includes(_))))
    } else {
      const changeRowKeysValue = changeRows.filter(Boolean).map(_ => _[getRowKey(_)])
      setSelectedRowKeys(selectedRowKeys.filter(_ => !changeRowKeysValue.includes(_)))
    }
  })

  const toggleSelectItem = usePersistFn((key: React.Key) => {
    const newSelectedRowKeys = [...selectedRowKeys]
    const index = newSelectedRowKeys.indexOf(key)
    if (index === -1) {
      newSelectedRowKeys.push(key)
    } else {
      newSelectedRowKeys.splice(index, 1)
    }
    setSelectedRowKeys(newSelectedRowKeys)
  })

  return [{ selectedRowKeys, onSelect, onSelectAll }, toggleSelectItem, setSelectedRowKeys]
}
