/*
 * @Author: Hughie
 * @Date: 2019-11-26 11:11:09
 * @Last Modified by: Hughie
 * @Last Modified time: 2020-11-23 11:09:54
 * 重写 Modal footer 组件
 */

import React from 'react'
import classnames from 'classnames'
import type { ModalProps } from 'antd/lib/modal'
import { AutoLoadingButton } from '@/common/components/material'
import styles from './index.module.less'

type PickModalProps = Pick<ModalProps, 'onCancel' | 'onOk' | 'cancelText' | 'okText' | 'okButtonProps' | 'cancelButtonProps'>

export interface FooterProps extends PickModalProps {
  align?: 'center' | 'right'
  bordered?: boolean // 设置是否含有上边框
}

export const Footer: React.FC<FooterProps> = React.memo(props => {
  if (props.children && props.align === 'center') {
    return <div className={classnames(styles.moduleFooter, styles.alignCenter, { [styles.footerBordered]: props.bordered })}>{props.children}</div>
  }
  return (
    <div
      className={classnames(styles.moduleFooter, {
        [styles.alignCenter]: props.align === 'center',
        [styles.footerBordered]: props.bordered,
      })}
    >
      {props.align === 'right' && <div className={styles.moduleFooterContent}>{props.children}</div>}
      {props.cancelText && (
        <AutoLoadingButton {...props.cancelButtonProps} onClick={props.onCancel}>
          {props.cancelText}
        </AutoLoadingButton>
      )}
      {props.okText && (
        <AutoLoadingButton type="primary" {...props.okButtonProps} onClick={props.onOk}>
          {props.okText}
        </AutoLoadingButton>
      )}
    </div>
  )
})

Footer.defaultProps = {
  okText: intl.get('confirm').d('确定'),
  cancelText: intl.get('cancel').d('取消'),
  align: 'center',
  bordered: true,
}
