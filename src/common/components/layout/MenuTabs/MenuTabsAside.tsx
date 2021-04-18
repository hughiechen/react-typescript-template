import * as React from 'react'
import styles from './index.module.less'

export interface MenuTabsAsideItem<T extends string | number = string> {
  tabContent: React.ReactNode
  tabKey: T
}

export interface MenuTabsAsideProps<T extends string | number = string> {
  activeTabKey: T
  dataSource: MenuTabsAsideItem<T>[]
  title?: string
  onTabChange?: (tabKey: T) => void
}

export class MenuTabsAside<T extends string | number = string> extends React.PureComponent<MenuTabsAsideProps<T>> {
  render() {
    const { title, dataSource, onTabChange, activeTabKey } = this.props
    return (
      <div className={styles.aside}>
        {title && (
          <div>
            <strong>{title}</strong>
          </div>
        )}
        <ul>
          {dataSource.map(item => (
            <li key={item.tabKey} onClick={() => onTabChange?.(item.tabKey)} className={activeTabKey === item.tabKey ? styles.active : undefined}>
              {item.tabContent}
            </li>
          ))}
        </ul>
      </div>
    )
  }
}
