import * as React from 'react'
import classnames from 'classnames'
import { Pagination, Spin, Empty } from 'antd'
import styles from './index.module.less'

export interface PaginationConfig {
  pageSize: number
  current: number
}

export interface GridTableProps<T> {
  dataSource: T[]
  pageSize?: number
  current?: number
  total?: number
  loading?: boolean
  pagination?: false
  /**
   * 媒体查询的宽度设置，内部会自动生成媒体查询字符串
   * @default [860, 1280]
   * @tutorial
   * 下标 0: 一列最大宽度
   * 下标 1: 两列最大宽度
   * @example
   * 860px 以下显示一列，1280px 以下显示两列，1280px 以上显示三列，取值：[860, 1280]
   * 可理解为 [860, 1280] => ( 0~860, 860~1280, 1280~∞ )
   * @example 禁用响应式，取消内部响应式监听事件，优化性能，取值：[]
   * @example 最小显示 3 列，取值：[0, 0, 980]
   */
  mediaQuery?: number[]
  itemKey?: (keyof T & string) | ((item: T, index: number) => string)
  emptyDescription?: string
  emptyExtra?: React.ReactNode
  className?: string
  style?: React.CSSProperties
  renderItem: (item: T) => React.ReactElement
  onChange?: (pagination: PaginationConfig) => void
}

interface State {
  gridStyle: React.CSSProperties | undefined
}

export class GridTable<T> extends React.PureComponent<GridTableProps<T>, State> {
  static defaultProps: PickOptional<GridTableProps<any>> = {
    pageSize: 9,
    loading: false,
    emptyDescription: intl.get('temporary_no_data').d('暂无数据'),
    mediaQuery: [860, 1280],
    itemKey: (item: any, index: number) => index.toString(),
  }

  private readonly pageSizeOptions = ['9', '18', '27', '36']

  private readonly mediaQueryList: MediaQueryList[] | undefined

  constructor(props: GridTableProps<T>) {
    super(props)
    this.mediaQueryList = this.getMediaQueryStringList()?.map(_ => window.matchMedia(_))
    const matchesIndex = this.mediaQueryList?.findIndex(_ => _.matches)
    this.state = {
      gridStyle: matchesIndex === undefined ? undefined : this.getGridStyleByColumnCount(matchesIndex + 1),
    }
    this.addMediaListener()
  }

  /**
   * 获取媒体查询字符串数组
   */
  getMediaQueryStringList = () => {
    const { mediaQuery } = this.props
    if (mediaQuery && mediaQuery.length > 0) {
      const mediaQueryStrings = mediaQuery.map((_, index) => `screen${index === 0 ? '' : ` and (min-width: ${mediaQuery[index - 1]}px)`} and (max-width: ${_}px)`)
      return mediaQuery.length === 1 ? mediaQueryStrings : mediaQueryStrings.concat(`screen and (min-width: ${mediaQuery[mediaQuery.length - 1]}px)`)
    }
    return undefined
  }

  /**
   * 添加媒体查询监听事件
   */
  addMediaListener = () => this.mediaQueryList?.map((_, index) => _.addListener(event => event.matches && this.updateGridStyle(index + 1)))

  updateGridStyle = (columnCount: number) => this.setState({ gridStyle: this.getGridStyleByColumnCount(columnCount) })

  getGridStyleByColumnCount = (columnCount: number): React.CSSProperties => ({ gridTemplateColumns: `repeat(${columnCount}, 1fr)` })

  getTotalString = (total: number) => intl.get('format_total_table_count', { total })

  onChange = (current: number, pageSize?: number) => this.props.onChange?.({ current, pageSize: pageSize! })

  render() {
    const { dataSource, itemKey, renderItem, onChange, loading, mediaQuery, pagination, children, emptyDescription, emptyExtra, className, style, ...restPaginationProps } = this.props

    return (
      <Spin spinning={loading}>
        {dataSource.length > 0 ? (
          <div className={classnames(styles.gridTableBody, className)} style={{ ...this.state.gridStyle, ...style }}>
            {dataSource.map((_, index) => (
              <React.Fragment key={itemKey instanceof Function ? itemKey!(_, index) : _[itemKey as string]}>{renderItem(_)}</React.Fragment>
            ))}
          </div>
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={loading ? intl.get('loading_120').d('加载中...') : emptyDescription}>
            {!loading && emptyExtra}
          </Empty>
        )}
        {restPaginationProps.total !== undefined && restPaginationProps.total > restPaginationProps.pageSize! && pagination !== false && (
          <Pagination
            className={styles.gridTableFooter}
            showSizeChanger
            showQuickJumper
            showTotal={this.getTotalString}
            pageSizeOptions={this.pageSizeOptions}
            onChange={this.onChange}
            onShowSizeChange={this.onChange}
            {...restPaginationProps}
          />
        )}
      </Spin>
    )
  }
}

export default GridTable
