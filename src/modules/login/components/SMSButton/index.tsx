/*
 * @Author: Hughie
 * @Date: 2020-07-21 15:03:25
 * @LastEditTime: 2020-12-07 14:10:40
 * @LastEditors: Hughie
 * @Description:
 */

import React from 'react'
import { Button, message } from 'antd'
import { ButtonProps } from 'antd/lib/button/button'
import { CaptchaModal, ICaptcha } from '../CaptchaModal'
import { sendSmsCode } from './api/sendSmsCode'

/// mock sendSmsCode

export interface SMSButtonProps extends ButtonProps {
  second?: number
  disabled?: boolean
  // 返回手机号码
  callBack: () => Promise<string | undefined>
  sendCaptchaData?: (data: ICaptcha) => void
}

export interface SMSButtonState {
  phoneNumber?: string
  countdown?: number
  visible: boolean
}

class SMSButton extends React.PureComponent<SMSButtonProps, SMSButtonState> {
  static defaultProps = {
    second: 60,
  }

  state: SMSButtonState = {
    countdown: undefined,
    visible: false,
  }

  timer?: number = undefined

  componentWillUnmount() {
    this.clearTimer()
  }

  clearTimer = () => {
    window.clearInterval(this.timer)
    this.timer = undefined
  }

  startTimer = () => {
    if (!this.timer) {
      this.setState({ countdown: this.props.second }, () => {
        this.timer = window.setInterval(this.startCountdown, 1000)
      })
    }
  }

  startCountdown = () => {
    const { countdown } = this.state
    if (countdown === 0) {
      this.setState({ countdown: undefined })
      return this.clearTimer()
    } else if (countdown !== undefined) {
      this.setState({ countdown: countdown - 1 })
    }
  }

  onClickButton = async () => {
    const phoneNumber = await this.props.callBack()

    if (phoneNumber) {
      this.setState({ visible: true, phoneNumber })
    }
  }

  cancel = () => {
    this.setState({ visible: false })
  }

  onOk = async (captcha: ICaptcha) => {
    // this.setState({ visible: false })
    const { code, id } = captcha
    const { phoneNumber } = this.state
    if (!phoneNumber) {
      message.error(intl.get('please_enter_the_phone_number!').d('请输入手机号码!'))
      return
    }
    await sendSmsCode({ phoneNumber, captchaCode: code, eventId: id })
    this.startTimer()
    this.props?.sendCaptchaData?.(captcha)
    message.success(intl.get('the_sms_verification_code_has_been_sent,_please_check_it!').d('短信验证码已发送,请注意查收!'))
  }

  render() {
    const { disabled, callBack, sendCaptchaData, ...rest } = this.props
    const { countdown, visible } = this.state

    return (
      <>
        <Button type="primary" {...rest} disabled={disabled || countdown !== undefined} onClick={this.onClickButton}>
          {countdown === undefined ? intl.get('get_verification_code').d('获取验证码') : `(${countdown}s)${intl.get('reacquire')}`}
        </Button>
        {visible && <CaptchaModal visible onOk={this.onOk} onCancel={this.cancel} />}
      </>
    )
  }
}

export { SMSButton }
