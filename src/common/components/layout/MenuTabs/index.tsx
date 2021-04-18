import React from 'react'
import { GridLayout } from '../GridLayout'
import { MenuTabsAside, MenuTabsAsideItem, MenuTabsAsideProps } from './MenuTabsAside'
import styles from './index.module.less'

export interface MenuTabsItem<T extends string | number = string> extends MenuTabsAsideItem<T> {
  component: React.ReactElement
}

export interface MenuTabsProps<T extends string | number = string> extends MenuTabsAsideProps<T> {
  dataSource: MenuTabsItem<T>[]
  /** TAB下方内容 */
  tabExtra?: React.ReactNode
}

/**
 * 菜单 Tabs
 * @description 左侧为菜单选项，右侧为内容
 */
export class MenuTabs<T extends string | number = string> extends React.PureComponent<MenuTabsProps<T>> {
  static Aside = MenuTabsAside

  render() {
    const { activeTabKey, dataSource, title, onTabChange, tabExtra } = this.props
    const activeComponent = dataSource.find(item => item.tabKey === activeTabKey)?.component
    return (
      <GridLayout column={['280px', '1fr']} columnGap={20} className={styles.container}>
        <div>
          <MenuTabsAside title={title} dataSource={dataSource} activeTabKey={activeTabKey} onTabChange={onTabChange} />
          {tabExtra}
        </div>
        <div>{activeComponent}</div>
      </GridLayout>
    )
  }
}
