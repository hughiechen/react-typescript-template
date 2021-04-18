/*
 * @Author: Hughie
 * @Date: 2021-04-13 17:18:08
 * @LastEditors: Hughie
 * @LastEditTime: 2021-04-13 17:18:08
 * @Description:  发送验证码接口，目前没实现
 */

// TODO: 待实现
export interface SendSmsCodeRequest {
  phoneNumber: string
  captchaCode: string
  eventId: string
}

export function sendSmsCode(request: SendSmsCodeRequest): Promise<void> {
  console.log(request)
  // const { phoneNumber, captchaCode, eventId } = request

  return Promise.resolve()
}
