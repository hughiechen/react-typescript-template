/*
 * @Author: Hughie
 * @Date: 2021-04-15 11:07:06
 * @LastEditors: Hughie
 * @LastEditTime: 2021-04-18 18:27:20
 * @Description:
 */
import * as React from 'react'
import styles from './index.module.less'
import { Button, message } from 'antd'
import { Form, Field, useForm } from '@/common/components/basic/Form'
import { Input, Icon } from '@/common/components/basic'
import { FlexBox, GridLayout } from '@/common/components/layout'
import { navigation } from '@/common/navigation'

import { AutoLoadingButton } from '@/common/components/material'
import { SMSButton } from '../../components/SMSButton'
import { addApplyTrial } from './api'

// const pictureCodeReg = /^\w{4}$/

const Apply: React.FC = React.memo(() => {
  const { form, store } = useForm({
    proposer: '',
    phoneNumber: '',
    smsCode: '',
    orgName: '',
  })

  // const [captcha, setCaptcha] = React.useState<ICaptchaUrl | undefined>()

  const onSubmit = React.useCallback(async () => {
    const result = await form.submitForm()
    if (!result.hasError) {
      const { proposer, phoneNumber, smsCode, orgName } = result.values
      const ok = await addApplyTrial({
        proposer,
        phoneNumber,
        smsCode,
        orgName,
      })
      if (ok) {
        navigation.goBack()
      }
    }
  }, [form])

  return (
    <div className={styles.root}>
      <FlexBox className={styles.loginBg} flexDirection="column">
        <Form store={store}>
          <GridLayout column={['1fr', 'auto']} columnGap={16}>
            <Field name="smsCode" required requiredText="请输短信验证码" shortMarginBottom={false}>
              <Input size="large" className={styles.input} maxLength={4} placeholder="请输短信验证码" prefix={<Icon type="icon-duanxinyanzhengma" />} />
            </Field>
            <SMSButton
              size="large"
              style={{ width: 124 }}
              callBack={async () => {
                await form.validateField('phoneNumber')
                if (!form.errors.phoneNumber) {
                  return form.values.phoneNumber
                }
                message.error(intl.get('please_enter_phone_number').d('请输入电话号码'))
                return ''
              }}
            />
          </GridLayout>

          <FlexBox justifyContent="space-between">
            <Button size="large" className={styles.commit} onClick={navigation.goBack}>
              {intl.get('cancel_139').d('取 消')}
            </Button>
            <AutoLoadingButton type="primary" size="large" className={styles.commit} onClick={onSubmit}>
              {intl.get('apply_trial').d('申请试用')}
            </AutoLoadingButton>
          </FlexBox>
        </Form>
      </FlexBox>
    </div>
  )
})

export default Apply
