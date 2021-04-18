import React from 'react'
import classnames from 'classnames'
import { TabsPageCard, TabsPageCardProps } from '../TabsPageCard'
import styles from './index.module.less'

export interface CleanTabsPageCardProps<T extends string | number = string> extends TabsPageCardProps<T> {}

export class CleanTabsPageCard<T extends string | number = string> extends React.PureComponent<CleanTabsPageCardProps<T>> {
  render() {
    const { containerClassName, headerClassName, contentClassName } = this.props
    return (
      <TabsPageCard
        {...this.props}
        containerClassName={classnames(styles.container, containerClassName)}
        headerClassName={classnames(styles.cleanHeader, headerClassName)}
        contentClassName={classnames(styles.cleanContent, contentClassName)}
      />
    )
  }
}

export default CleanTabsPageCard
