import React from 'react'
import classnames from 'classnames'
import styles from './index.module.less'

export interface TableLayoutElementProps {
  /**
   * 用于定位
   */
  id?: string
  /**
   * css 类名
   */
  className?: string
  /**
   * 对其方式
   */
  align?: 'left' | 'center' | 'right'
  /**
   * 背景颜色, tableHeader 为 thead 默认的背景色
   */
  bgColor?: 'yellow' | 'white' | 'red' | 'tableHeader'
  /**
   * 样式
   */
  style?: React.CSSProperties
}

export interface TableLayoutProps extends TableLayoutElementProps {
  /**
   * table-layout 是否为 fixed，固定布局
   */
  fixed?: boolean
}

export interface TableLayoutCellProps extends TableLayoutElementProps {
  /**
   * 竖向合并单元格数量
   */
  colSpan?: number
  /**
   * 横向合并单元格数量
   */
  rowSpan?: number
}

export interface TableLayoutTheadProps extends TableLayoutElementProps {
  /**
   * 右上角和左上角圆角效果
   */
  borderRadiusTop?: true
}

export interface TableLayoutTbodyProps extends TableLayoutElementProps {
  /**
   * 右上角和左上角圆角效果
   */
  borderRadiusTop?: true
  /**
   * 右下角和左下角圆角效果
   */
  borderRadiusBottom?: true
}

export interface TableLayoutTfootProps extends TableLayoutElementProps {
  /**
   * 右下角和左下角圆角效果
   */
  borderRadiusBottom?: true
}

/**
 * 根据 props 获取表格内部元素的类名
 * @param props 内部元素的属性
 * @param otherClassnames 当前元素的其他特殊类名
 */
const getClassNames = (props: TableLayoutElementProps, otherClassnames?: Record<string, boolean | undefined>) =>
  classnames(
    props.className,
    {
      [styles.alignLeft]: props.align === 'left',
      [styles.alignCenter]: props.align === 'center',
      [styles.alignRight]: props.align === 'right',
      [styles.bgYellow]: props.bgColor === 'yellow',
      [styles.bgWhite]: props.bgColor === 'white',
      [styles.bgRed]: props.bgColor === 'red',
      [styles.bgHeader]: props.bgColor === 'tableHeader',
    },
    otherClassnames
  )

export const TableLayout: React.FC<TableLayoutProps> = React.memo(props => {
  const { fixed, bgColor, align, ...restProps } = props
  return (
    <table
      {...restProps}
      className={getClassNames(props, {
        [styles.tableLayout]: true,
        [styles.fixed]: fixed,
      })}
    />
  )
})

export const Thead: React.FC<TableLayoutTheadProps> = React.memo(props => {
  const { borderRadiusTop, bgColor, align, ...restProps } = props
  return (
    <thead
      {...restProps}
      className={getClassNames(props, {
        [styles.borderRadiusTop]: props.borderRadiusTop,
      })}
    />
  )
})

Thead.defaultProps = {
  borderRadiusTop: true,
  bgColor: 'tableHeader',
}

export const Tbody: React.FC<TableLayoutTbodyProps> = React.memo(props => {
  const { borderRadiusTop, borderRadiusBottom, bgColor, align, ...restProps } = props
  return (
    <tbody
      {...restProps}
      className={getClassNames(props, {
        [styles.borderRadiusTop]: props.borderRadiusTop,
        [styles.borderRadiusBottom]: props.borderRadiusBottom,
      })}
    />
  )
})

export const Tfoot: React.FC<TableLayoutTfootProps> = React.memo(props => {
  const { borderRadiusBottom, bgColor, align, ...restProps } = props
  return (
    <tfoot
      {...restProps}
      className={getClassNames(props, {
        [styles.borderRadiusBottom]: props.borderRadiusBottom,
      })}
    />
  )
})

Tfoot.defaultProps = {
  borderRadiusBottom: true,
}

export const Tr: React.FC<TableLayoutElementProps> = React.memo(props => {
  const { bgColor, align, ...restProps } = props
  return <tr {...restProps} className={getClassNames(props)} />
})

export const Td: React.FC<TableLayoutCellProps> = React.memo(props => {
  const { bgColor, align, ...restProps } = props
  return <td {...restProps} className={getClassNames(props)} />
})

export const Th: React.FC<TableLayoutCellProps> = React.memo(props => {
  const { bgColor, align, ...restProps } = props
  return <th {...restProps} className={getClassNames(props)} />
})
