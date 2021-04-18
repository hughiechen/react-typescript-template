import React from 'react'
import { Empty } from 'antd'
import AntdTable, { TablePaginationConfig } from 'antd/lib/table'
import classnames from 'classnames'
import Column from './Column'
import type { TableProps as AntdTableProps } from 'antd/lib/table'
import type { GetRowKey } from 'antd/es/table/interface'
import styles from './index.module.less'
import { KeyboardEventListener, KeyboardKey } from '../../material/KeyboardEventListener'
import { basicIntl } from '../locales'

export interface TableProps<T> extends AntdTableProps<T> {
  pageSize?: number
  /** 当前页码 */
  current?: number
  /** 列表总数据量 */
  total?: number
  pagination?: false | TablePaginationConfig
  rowKey?: (keyof T & string) | GetRowKey<T>
  emptyDescription?: React.ReactNode
  /** 数据为空时显示的额外信息 */
  emptyExtra?: React.ReactNode
  /**
   * 开启键盘上下键选择功能，按下 Enter 键触发该方法，当 onEnter 赋值为 undefined,内部会移除键盘监听事件，重新赋值为函数，则重新添加键盘监听函数
   * @description 当一个页面上多个表格都使用了该属性，那么 Enter 会触发所有表格上的该方法，所以通过改变 onEnter 的值，可以指定特定情况添加监听事间
   */
  onEnter?: (item: T, index: number) => void
}

interface State {
  selectedIndex?: number
}

export class Table<T extends object> extends React.PureComponent<TableProps<T>, State> {
  static Column = Column

  static ColumnGroup = AntdTable.ColumnGroup

  static defaultProps: PickOptional<TableProps<any>> = {
    emptyDescription: basicIntl.get('Table.emptyText'),
  }

  constructor(props: TableProps<T>) {
    super(props)
    this.state = {
      selectedIndex: undefined,
    }
  }

  componentDidUpdate(prevProps: TableProps<T>) {
    const { dataSource } = this.props
    const { selectedIndex } = this.state
    if (prevProps.dataSource !== dataSource && selectedIndex !== undefined) {
      this.setState({ selectedIndex: undefined })
    }
  }

  keyboardEventListener = (code: KeyboardKey) => {
    const { dataSource, onEnter } = this.props
    if (dataSource && dataSource.length > 0) {
      // 上
      if (code === 'ArrowUp') {
        this.setState(state => {
          const index = (state.selectedIndex ?? 0) - 1
          return { selectedIndex: index < 0 ? dataSource.length - 1 : index }
        }, this.selectedRowScrollIntoView)
      }
      // 下
      if (code === 'ArrowDown') {
        this.setState(state => {
          const index = (state.selectedIndex ?? -1) + 1
          return { selectedIndex: index > dataSource.length - 1 ? 0 : index }
        }, this.selectedRowScrollIntoView)
      }
      // enter
      if (code === 'Enter') {
        const { selectedIndex } = this.state
        if (selectedIndex !== undefined) {
          onEnter?.(dataSource[selectedIndex], selectedIndex)
          this.setState({ selectedIndex: undefined })
        }
      }
    }
  }

  selectedRowScrollIntoView = () => setTimeout(() => document.querySelector(`.${styles.selected}`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }))

  getTotalString = (total: number) => basicIntl.get('Table.totalCount', { total })

  getRowClassName = (record: T, index: number, indent: number) => {
    const { rowClassName } = this.props
    const finalRowClassName = rowClassName instanceof Function ? rowClassName?.(record, index, indent) : rowClassName
    return classnames(finalRowClassName, { [styles.selected]: index === this.state.selectedIndex })
  }

  render() {
    const { total, current, pageSize, emptyExtra, emptyDescription, className, rowClassName, pagination, onEnter, scroll, dataSource, ...restTableProps } = this.props
    return (
      <React.Fragment>
        {onEnter && <KeyboardEventListener options listener={this.keyboardEventListener} />}
        <AntdTable
          bordered
          className={classnames(styles.fixTable, className)}
          rowClassName={this.getRowClassName}
          pagination={
            (total && pageSize && total <= 10) || pagination === false
              ? false
              : {
                  className: styles.pagination,
                  current,
                  total,
                  pageSize,
                  size: 'default',
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: this.getTotalString,
                  // TODO: antd 4 必须明确写明 locale，否则国际化失效，后续修改了该问题可以删除以下代码
                  locale: basicIntl.get('Pagination'),
                }
          }
          size="middle"
          {...restTableProps}
          dataSource={dataSource}
          scroll={scroll?.y ? { ...scroll, y: dataSource?.length ? scroll.y : undefined } : undefined}
          locale={{
            // TODO: antd 4 必须明确写明 locale 中的一下字段，否则国际化失效，后续修改了该问题可以删除以下代码
            ...(basicIntl.get('Table') as AnyObject),
            emptyText: (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={restTableProps.loading ? basicIntl.get('Table.loading') : emptyDescription}>
                {restTableProps.loading ? null : emptyExtra}
              </Empty>
            ),
          }}
        />
      </React.Fragment>
    )
  }
}

export default Table
