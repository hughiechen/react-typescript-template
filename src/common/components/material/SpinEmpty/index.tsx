import * as React from 'react'
import { Spin, Empty } from 'antd'
import { SpinEmptyProps } from './type'
import { FullSpinEmpty } from './FullSpinEmpty'

export class SpinEmpty extends React.PureComponent<SpinEmptyProps> {
  static Full = FullSpinEmpty

  static defaultProps: PickOptional<SpinEmptyProps> = {
    loading: false,
    emptyDescription: intl.get('temporary_no_data').d('暂无数据'),
  }

  render() {
    const { loading, children, emptyDescription, emptyExtra } = this.props
    const isEmptyChildren = !children
    return (
      <Spin spinning={loading}>
        {isEmptyChildren ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={loading ? intl.get('loading_120').d('加载中...') : emptyDescription}>
            {!loading && emptyExtra}
          </Empty>
        ) : (
          children
        )}
      </Spin>
    )
  }
}

export default SpinEmpty
