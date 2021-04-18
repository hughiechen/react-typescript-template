import * as React from 'react'
import styles from './index.module.less'

import { Form, Field, useForm, Icon, Input } from '@/common/components/basic'
import { FlexBox, GridLayout } from '@/common/components/layout'
import { Radio, message, Button } from 'antd'

import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { loginWithUser } from './api/loginWithUser'
import { SMSButton } from '../../components/SMSButton'

import { LoginBySms } from './api/loginBySms'
import { navigation } from '@/common/navigation'

const Login: React.FC = React.memo(() => {
  const [type, setType] = React.useState<'normal' | 'sms'>('normal')

  const [loading, setLoading] = React.useState(false)

  const encryptPassword = React.useCallback(password => {
    return password
  }, [])

  const { form, store } = useForm({
    phoneNumber: '',
    password: '',
  })

  const { form: smsForm, store: smsStore } = useForm({
    phoneNumber: '',
    smsCode: '',
  })

  const onUserCommit = React.useCallback(async () => {
    const result = await form.submitForm()
    if (!result.hasError) {
      const { phoneNumber, password } = result.values
      const ePassword = encryptPassword(password)
      try {
        setLoading(true)
        const res = await loginWithUser({ phoneNumber, password: ePassword })
        if (res) {
          localStorage.setItem('accessToken', res.accessToken)
          navigation.replace('/')
        }
      } finally {
        setLoading(false)
      }
    }
  }, [encryptPassword, form])

  const onSmsCommit = React.useCallback(async () => {
    const result = await smsForm.submitForm()
    if (!result.hasError) {
      const { phoneNumber, smsCode } = result.values
      try {
        setLoading(true)
        const res = await LoginBySms({ phoneNumber, smsCode })
        if (res) {
          localStorage.setItem('accessToken', res.accessToken)
          navigation.replace('/')
        }
      } finally {
        setLoading(false)
      }
    }
  }, [smsForm])

  return (
    <div className={styles.root}>
      <FlexBox className={styles.box}>
        <FlexBox className={styles.content} flexDirection="column" alignItems="center">
          <FlexBox className={styles.header} justifyContent="space-between" alignItems="center">
            <h1>{intl.get('log_in_system').d('登录系统')}</h1>
            <Link to="/login/apply">{intl.get('apply_trial').d('申请试用')}</Link>
          </FlexBox>

          <Radio.Group
            size="large"
            value={type}
            onChange={e => {
              setType(e.target.value)
            }}
          >
            <Radio.Button className={styles.loginBtn} value="normal">
              {intl.get('account_pwd').d('账号密码')}
            </Radio.Button>
            <Radio.Button className={styles.loginBtn} value="sms">
              {intl.get('sms_login').d('短信登录')}
            </Radio.Button>
          </Radio.Group>
          {type === 'normal' && (
            <div className={styles.form}>
              <Form store={store}>
                <Field name="phoneNumber" required shortMarginBottom={false}>
                  <Input
                    size="large"
                    className={styles.input}
                    maxLength={20}
                    placeholder={intl.get('pleaseEnterPhoneNumber').d('请输入手机号')}
                    prefix={<Icon type="icon-shoujihaoma" />}
                    onPressEnter={onUserCommit}
                  />
                </Field>
                <Field name="password" required shortMarginBottom={false} validateType="password">
                  <Input.Password
                    size="large"
                    maxLength={12}
                    className={styles.input}
                    placeholder={intl.get('please_enter_password').d('请输入密码')}
                    prefix={<Icon type="icon-mima" />}
                    onPressEnter={onUserCommit}
                    iconRender={visible => (visible ? <EyeInvisibleFilled /> : <EyeFilled />)}
                  />
                </Field>
              </Form>
              <Button type="primary" loading={loading} size="large" className={styles.commit} onClick={onUserCommit}>
                {intl.get('login').d('登 录')}
              </Button>
              <FlexBox justifyContent="space-between" className={styles.retrievePwd}>
                <span>{intl.get('use_sms_code_first').d('首次登录请使用短信验证码登录')}</span>
                <Link className={styles.link} to="/login/retrieve">
                  {intl.get('forget_password?').d('忘记密码？')}
                </Link>
              </FlexBox>
            </div>
          )}

          {type === 'sms' && (
            <div className={styles.form}>
              <Form store={smsStore}>
                <Field name="phoneNumber" required requiredText={intl.get('pleaseEnterPhoneNumber').d('请输入账号/手机号')} shortMarginBottom={false} validateType="PhoneNumber">
                  <Input
                    size="large"
                    className={styles.input}
                    maxLength={11}
                    placeholder={intl.get('pleaseEnterPhoneNumber').d('请输入账号/手机号')}
                    prefix={<Icon type="icon-shoujihaoma" />}
                    onPressEnter={onSmsCommit}
                  />
                </Field>
                <GridLayout column={['1fr', 'auto']} columnGap={16}>
                  <Field name="smsCode" required requiredText={intl.get('please_enter_sms_code').d('请输短信验证码')} shortMarginBottom={false}>
                    <Input
                      size="large"
                      className={styles.input}
                      placeholder={intl.get('please_enter_sms_code').d('请输短信验证码')}
                      maxLength={4}
                      prefix={<Icon type="icon-duanxinyanzhengma" />}
                      onPressEnter={onSmsCommit}
                    />
                  </Field>
                  <SMSButton
                    size="large"
                    style={{ width: 124 }}
                    callBack={async () => {
                      await smsForm.validateField('phoneNumber')
                      if (!smsForm.errors.phoneNumber) {
                        return smsForm.values.phoneNumber
                      }
                      message.error(intl.get('please_enter_phone_number').d('请输入电话号码'))
                      return ''
                    }}
                  />
                </GridLayout>
              </Form>
              <Button type="primary" loading={loading} size="large" className={styles.commit} onClick={onSmsCommit}>
                {intl.get('login').d('登 录')}
              </Button>
            </div>
          )}
        </FlexBox>
      </FlexBox>
    </div>
  )
})
export default Login
