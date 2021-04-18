import React from 'react'
import { Modal } from '@/common/components/basic'
// import { Modal, Form, Field, useForm, Icon, Input } from '@/common/components/basic'
// import { GridLayout } from '@/common/components/layout'
// import { Captcha, ICaptchaUrl } from '../Captcha'

// interface FormState {
//   code: string
// }

export interface ICaptcha {
  code: string
  id: string
}

export interface CustomModalProps {
  visible?: boolean
  /**
   * onOk 执行完成自动关闭
   */
  onOk?: (variables: ICaptcha) => Promise<void> | void
  onCancel?: () => void
}

export const CaptchaModal: React.FC<CustomModalProps> = React.memo(props => {
  const onOk = React.useCallback(async () => {
    props.onCancel?.()
  }, [props])

  return (
    <Modal
      title={intl.get('please_enter_the_graphic_verification_code').d('请输入图形验证码')}
      onCancel={props.onCancel}
      width={580}
      visible={props.visible}
      footer={<Modal.Footer onOk={onOk} okText={intl.get('report_confirm').d('确认')} cancelText={intl.get('cancel').d('取消')} onCancel={props.onCancel} />}
    >
      后面调用第三方的
    </Modal>
  )
})
