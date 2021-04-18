import React from 'react'
import classnames from 'classnames'
import { Spin } from 'antd'
import { LeftOutlined } from '@ant-design/icons'
import { history } from '@/common/navigation'
import styles from './index.module.less'

export interface PageCardProps {
  title?: string
  left?: React.ReactNode
  leftClassName?: string
  right?: React.ReactNode
  backText?: string
  footer?: React.ReactElement
  loading?: boolean
  loadingTip?: string
  containerClassName?: string
  containerRef?: React.Ref<HTMLElement>
  headerClassName?: string
  contentClassName?: string
  /**
   * 设置在 PageCard 内部或者外部滚动界面，默认为外部滚动即 innerScroll === false
   *
   * 原理：在容器上设置 min-height 或者 height 达到效果，若不需要设置这两个 css 属性，PageCard 高度随内容撑高，则传 null
   */
  innerScroll?: boolean | null
  style?: React.CSSProperties
  children?: React.ReactNode | ((contentClassName: string) => React.ReactNode)
}

export class PageCard extends React.PureComponent<PageCardProps> {
  static readonly classNames = {
    body: styles.body,
    header: styles.header,
    headerRight: styles.headerRight,
    footer: styles.footer,
  }

  static defaultProps: PickOptional<PageCardProps> = {
    loading: false,
    innerScroll: false,
  }

  render() {
    const { title, right, left, leftClassName, backText, footer, loading, loadingTip, innerScroll, containerClassName, headerClassName, contentClassName, children, style, containerRef } = this.props
    const hasHeader = title || right || left || backText
    const composeContentClassName = classnames(styles.content, contentClassName, { [styles.hasFooter]: footer })
    return (
      <section
        ref={containerRef}
        className={classnames(styles.pageCard, { [styles.heightFollowParent]: innerScroll, [styles.heightFollowChildren]: innerScroll === false }, containerClassName)}
        style={style}
      >
        <div className={styles.body}>
          {hasHeader && (
            <div className={classnames(styles.header, headerClassName)}>
              {backText && (
                <div className={styles.back}>
                  <LeftOutlined className={styles.backIcon} onClick={history.goBack} /> <span className={styles.backTitle}>{backText}</span>
                </div>
              )}
              {title && <span className={styles.title}>{title}</span>}
              {left && <div className={classnames(styles.headerLeft, leftClassName)}>{left}</div>}
              {right && <div className={styles.headerRight}>{right}</div>}
            </div>
          )}
          {children instanceof Function ? children(composeContentClassName) : <div className={composeContentClassName}>{children}</div>}
          {footer && <div className={styles.footer}>{footer}</div>}
        </div>
        <Spin spinning={loading} tip={loadingTip} className={styles.loading} />
      </section>
    )
  }
}

export default PageCard
