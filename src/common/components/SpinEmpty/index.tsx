/*
 * @Author: Hughie
 * @Date: 2019-10-30 17:09:08
 * @Last Modified by: Hughie
 * @Last Modified time: 2020-04-17 15:06:22
 * 列表数据 占位控件，结合了 Spin 和 empty
 */
import React from 'react'
import { Spin, Empty } from 'antd'
import styles from './index.module.less'

// TODO/alex: 删除，新版本的在 material 中

export interface ISpinEmptyProps {
  loading: boolean
  hasData: boolean
  /**
   * 是否loading 结束(false)后完毕才显示children, 可以有效防止闪烁
   */
  showAfterLoading?: boolean
  /** 额外的内容(默认会渲染出个空的图片，如果需要额外的按钮，可以使用该该参数) */
  extraContent?: React.ReactNode
  /** 提示语 */
  description?: React.ReactNode | string
}

const STYLE = { minHeight: 300 }

/** 废弃，新版本的在 material 中 */
export default class SpinEmpty extends React.PureComponent<ISpinEmptyProps> {
  static defaultProps = {
    showAfterLoading: false,
  }

  public render() {
    const { loading, hasData, children, showAfterLoading, extraContent, description } = this.props
    // if (!loading && !hasData) return null
    return loading ? (
      <Spin style={STYLE}>{!showAfterLoading ? <>{children}</> : <div className={styles.placeholder} />}</Spin>
    ) : !hasData ? (
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={STYLE} className={styles.empty} description={description}>
        {extraContent}
      </Empty>
    ) : (
      // <>{children}</>
      <Spin spinning={false}>{children}</Spin>
    )
  }
}
