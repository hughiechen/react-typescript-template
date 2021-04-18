import _ from 'lodash'
import * as React from 'react'
import { StringUtil } from '@/common/utils'
import { Table as BasicTable, TableProps as BasicTableProps } from '../../basic/Table'
import styles from './index.module.less'

/**
 * 计算当前元素外面滚动条多出来的高度
 * @param elem
 */
const getScrollOffset = (elem: HTMLDivElement) => {
  let offset = elem.scrollHeight - elem.clientHeight || 0
  let next = elem.offsetParent as HTMLDivElement
  while (next) {
    offset += next.scrollHeight - next.clientHeight || 0
    next = next?.offsetParent as HTMLDivElement
  }
  return offset
}

const getTableParent = (elem: HTMLDivElement): HTMLDivElement | undefined | null => {
  let next = elem.parentElement as HTMLDivElement
  while (next) {
    if (next.classList.contains('AutoScrollTable')) {
      return next
    }
    next = next.parentElement as HTMLDivElement
  }
  return null
}

export interface TableProps<T> extends Omit<BasicTableProps<T>, 'scroll'> {
  scroll?: { x?: number | true | string } & {
    scrollToFirstRowOnChange?: boolean
  }
  /** 最小 scrollY，默认300，保证能正常显示 */
  minScrollY?: number
  /** 分页高度（默认65） */
  paginationHeight?: number
}

interface TableState {
  scrollY: number
  paginationHeight: number
}

export class Table<T extends object> extends React.PureComponent<TableProps<T>, TableState> {
  resizeObserver: ResizeObserver | undefined = undefined

  uuid = StringUtil.uuid().replace(/[#=]/g, '')

  table: HTMLDivElement | undefined | null

  tableParent: HTMLDivElement | undefined | null

  constructor(props: TableProps<T>) {
    super(props)
    const paginationHeight = props.pagination === false ? 0 : 65
    this.state = {
      scrollY: 300,
      paginationHeight: props.paginationHeight || paginationHeight,
    }
    this.calcScrollY = _.debounce(this.calcScrollY, 500)
  }

  componentDidMount() {
    this.observeResize()
  }

  componentWillUnmount() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
    }
  }

  /** 监听当前表格上一级标签大小变化 */
  observeResize = () => {
    this.table = document.querySelector<HTMLDivElement>(`#${this.uuid}`)
    if (this.table && ResizeObserver) {
      this.resizeObserver = new ResizeObserver(() => {
        this.calcScrollY()
      })
      this.resizeObserver.observe(this.table)
      this.tableParent = getTableParent(this.table)
      if (this.tableParent) {
        this.resizeObserver.observe(this.tableParent)
      }
    }
  }

  /** 计算scrollY */
  calcScrollY = () => {
    const container = document.querySelector<HTMLDivElement>(`#${this.uuid}`)
    if (container) {
      const header = container.querySelector<HTMLDivElement>('.ant-table-header')
      const scrollOffset = getScrollOffset(container)
      const scrollY = container.offsetHeight - scrollOffset - (header?.offsetHeight || 0) - this.state.paginationHeight
      if (scrollY !== this.state.scrollY && scrollY > (this.props.minScrollY || 300)) {
        this.setState({ scrollY })
      }
    }
  }

  render() {
    const { scrollY } = this.state
    const { scroll, ...restProps } = this.props
    return (
      <div id={this.uuid} className={styles.table} style={{ overflowY: 'hidden' }}>
        <BasicTable<T> {...restProps} scroll={{ ...scroll, x: scroll?.x || 'max-content', y: scrollY }} />
      </div>
    )
  }
}
