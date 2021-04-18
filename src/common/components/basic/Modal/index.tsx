/*
 * @Author: yang
 * @Date: 2019-10-30 14:58:13
 * @Last Modified by: Hughie
 * @Last Modified time: 2020-11-16 15:22:28
 * 按照设计重写了弹框的部分样式
 */

import React from 'react'
import classnames from 'classnames'
import { Modal as AntdModal } from 'antd'
import { ModalProps } from 'antd/lib/modal'
import type { ModalFuncProps } from 'antd/lib/modal'
import { Footer } from './Footer'
import type { FooterProps } from './Footer'
import { errorHandler } from '@/common/utils/errorHandler/ExceptionListener'
import { basicIntl } from '../locales'

class Modal extends React.PureComponent<ModalProps> {
  static Footer: React.FC<FooterProps> = React.memo(props => <Footer align="right" {...props} />)

  static destroyAll = AntdModal.destroyAll

  static success = (config: ModalFuncProps) => {
    AntdModal.success({
      okText: basicIntl.get('Modal.ok'),
      ...config,
    })
  }

  static info = (config: ModalFuncProps) => {
    AntdModal.info({
      okText: basicIntl.get('Modal.ok'),
      ...config,
    })
  }

  static error = (config: ModalFuncProps) => {
    AntdModal.error({
      okText: basicIntl.get('Modal.ok'),
      ...config,
    })
  }

  static warn = (config: ModalFuncProps) => {
    AntdModal.warn({
      okText: basicIntl.get('Modal.ok'),
      ...config,
    })
  }

  static warning = (config: ModalFuncProps) => {
    AntdModal.warning({
      okText: basicIntl.get('Modal.ok'),
      ...config,
    })
  }

  // NOTE: antd confirm 会默认拦截 onOk 方法抛出的异常，在这里做一个手动异常捕获
  static confirm = (config: ModalFuncProps) => {
    AntdModal.confirm({
      title: basicIntl.get('Modal.defaultTitle'),
      cancelText: basicIntl.get('Modal.cancel'),
      okText: basicIntl.get('Modal.ok'),
      ...config,
      onOk: async () => {
        try {
          await config.onOk?.()
        } catch (error) {
          // 手动捕获异常，得到 onOk 的异常信息
          errorHandler.catch(error)
          throw error
        }
      },
    })
  }

  getContainer = () => document.body

  public render() {
    const { footer, onCancel, onOk, okText, cancelText, okButtonProps, cancelButtonProps } = this.props
    return (
      <AntdModal
        {...this.props}
        footer={
          'footer' in this.props ? (
            footer
          ) : (
            <Footer bordered={false} onCancel={onCancel} onOk={onOk} okText={okText} cancelText={cancelText} okButtonProps={okButtonProps} cancelButtonProps={cancelButtonProps} />
          )
        }
        wrapClassName={classnames(this.props.wrapClassName)}
        getContainer={this.getContainer}
      />
    )
  }
}

export { Modal, ModalProps }

export default Modal
