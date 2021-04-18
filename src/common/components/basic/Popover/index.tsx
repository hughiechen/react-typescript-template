/*
 * @Author: Hughie
 * @Date: 2020-01-03 15:11:42
 * @Last Modified by: Hughie
 * @Last Modified time: 2020-01-03 15:12:49
 * 没有 padding 的 Popover
 */

import * as React from 'react'
import { Popover as AntdPopover } from 'antd'
import { PopoverProps } from 'antd/lib/popover'
import styles from './index.module.less'

export interface IPopoverProps extends PopoverProps {}

export class Popover extends React.PureComponent<IPopoverProps> {
  static Item: React.FC<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>> = React.memo(props => <div className={styles.item} {...props} />)

  render() {
    return <AntdPopover {...this.props} overlayClassName={styles.wrap} />
  }
}

export default Popover
