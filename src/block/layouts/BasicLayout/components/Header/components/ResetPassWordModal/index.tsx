/*
 * @Author: Hughie
 * @Date: 2021-02-02 11:01:39
 * @LastEditors: Hughie
 * @LastEditTime: 2021-02-22 17:23:40
 * @Description: 重置密码弹框
 */

import { Modal, Form, Field, useForm } from '@/common/components/basic'
import * as React from 'react'
import { usePersistFn } from '@/common/hooks'
import { Password } from '@/common/components/basic/Input/Password'
import { AutoLoadingButton } from '@/common/components/material'
import { FlexBox } from '@/common/components/layout'
import { LockOutlined } from '@ant-design/icons'
import { commonAPI } from '@/api/common'
import { message } from 'antd'

export interface ResetPassWordModalProps {
  visible: boolean
  onCancel?: () => void
}

interface FormState {
  /** 原密码 */
  old_password: string
  /** 新密码 */
  new_password: string
  /** 确认新密码 */
  confirm_new_password: string
}

export const ResetPassWordModal: React.FC<ResetPassWordModalProps> = React.memo(props => {
  const { form, store } = useForm<FormState>({ old_password: '', new_password: '', confirm_new_password: '' })
  const buttonRef = React.useRef<HTMLElement>(null)

  const submit = usePersistFn(async () => {
    const result = await form.submitForm()
    if (!result.hasError) {
      const { old_password, new_password } = result.values
      await commonAPI.changePassword({ old_password, new_password })
      message.success('修改密码成功！', 1, props.onCancel)
    }
  })

  return (
    <Modal
      width={400}
      title="修改密码"
      onCancel={props.onCancel}
      visible={props.visible}
      footer={
        <FlexBox justifyContent="center" alignItems="center">
          <AutoLoadingButton type="primary" size="large" block style={{ borderRadius: 25, height: 50 }} onClick={submit}>
            提交
          </AutoLoadingButton>
        </FlexBox>
      }
    >
      <Form store={store}>
        <Field name="old_password" required shortMarginBottom={false} validateType="password">
          <Password autoComplete="new-password" maxLength={12} prefix={<LockOutlined />} placeholder="请输入原密码（6～12位）" />
        </Field>
        <Field name="new_password" required shortMarginBottom={false} validateType="password">
          <Password autoComplete="new-password" maxLength={12} prefix={<LockOutlined />} placeholder="请输入新密码（6～12位）" onChange={() => form.validateField('confirm_new_password')} />
        </Field>
        <Field name="confirm_new_password" required validate={(value, values) => (value !== values.new_password ? '两次密码输入不一致，请重试' : undefined)} shortMarginBottom={false}>
          <Password autoComplete="new-password" maxLength={12} prefix={<LockOutlined />} placeholder="请再次输入新密码（6～12位）" onPressEnter={() => buttonRef.current?.click()} />
        </Field>
      </Form>
    </Modal>
  )
})
