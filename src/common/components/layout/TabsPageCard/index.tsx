import React from 'react'
import { Radio } from 'antd'
import { PageCard, PageCardProps } from '../PageCard'
import { RadioChangeEvent } from 'antd/lib/radio'
import { Omit } from '@/common/types/rewrite'
import styles from './index.module.less'

export interface TabsItem<T extends string | number = string> {
  tabText: string
  tabKey: T
  component: React.ReactElement
}

export interface TabsPageCardProps<T extends string | number = string> extends Omit<PageCardProps, 'left'> {
  activeTabKey: T
  onTabChange: (tabKey: T) => void
  dataSource: TabsItem<T>[]
  style?: React.CSSProperties
  /** 卸载隐藏的组件 */
  unmountComponent?: boolean
}

export class TabsPageCard<T extends string | number = string> extends React.PureComponent<TabsPageCardProps<T>> {
  static defaultProps: PickOptional<TabsPageCardProps<any>> = {
    unmountComponent: true,
  }

  onTabChange = (e: RadioChangeEvent) => this.props.onTabChange(e.target.value)

  renderLeft = () => {
    const { dataSource, activeTabKey } = this.props
    return (
      <Radio.Group buttonStyle="solid" value={activeTabKey} onChange={this.onTabChange}>
        {dataSource.map(_ => (
          <Radio.Button className={styles.radioButton} key={_.tabKey} value={_.tabKey}>
            {_.tabText}
          </Radio.Button>
        ))}
      </Radio.Group>
    )
  }

  render() {
    const { activeTabKey, dataSource, onTabChange, unmountComponent, ...restProps } = this.props
    const activeComponent = dataSource.find(_ => _.tabKey === activeTabKey)
    return (
      <PageCard {...restProps} left={this.renderLeft()}>
        {!unmountComponent
          ? c =>
              dataSource.map(_ => {
                return (
                  <div key={_.tabKey} className={c} style={{ display: _.tabKey === activeTabKey ? 'block' : 'none' }}>
                    {_.component}
                  </div>
                )
              })
          : activeComponent
          ? activeComponent.component
          : null}
      </PageCard>
    )
  }
}

export default TabsPageCard
