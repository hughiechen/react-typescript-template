/*
 * @Author: Hughie
 * @Date: 2020-08-27 09:25:56
 * @LastEditors: Hughie
 * @LastEditTime: 2021-04-18 17:54:01
 * @Description:  密码登录接口
 */

export interface LoginRequest {
  phoneNumber: string
  password: string
}

export interface LoginResponse {
  accessToken: string
}

export async function loginWithUser(request: LoginRequest): Promise<LoginResponse | null> {
  console.log('request:', request)
  const accessToken = await Promise.resolve('mock')

  return accessToken
    ? {
        accessToken,
      }
    : null
}
