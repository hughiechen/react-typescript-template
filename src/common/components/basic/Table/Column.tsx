import React from 'react'
import { Table as AntdTable } from 'antd'
import { ColumnProps as AntdColumnProps } from 'antd/lib/table'

export interface ColumnProps<T> extends AntdColumnProps<T> {
  dataIndex?: (keyof T & string) | string[]
}

export class Column<T> extends React.PureComponent<ColumnProps<T>> {
  render() {
    return <AntdTable.Column {...this.props} />
  }
}

export default Column
