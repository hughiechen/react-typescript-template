import React from 'react'
import classnames from 'classnames'
import { Omit } from '@/common/types/rewrite'
import { SubRoutePage, ISubRoutePageOwnProps } from '../SubRoutePage'
import styles from './index.module.less'

export interface CleanSubRoutePageProps extends Omit<ISubRoutePageOwnProps, 'headerClassName' | 'contentClassName'> {}

const CleanSubRoutePage: React.FC<CleanSubRoutePageProps> = React.memo(props => (
  <SubRoutePage {...props} innerScroll={null} containerClassName={classnames(styles.container, props.containerClassName)} headerClassName={styles.cleanHeader} contentClassName={styles.cleanContent} />
))
export { CleanSubRoutePage }
export default CleanSubRoutePage
