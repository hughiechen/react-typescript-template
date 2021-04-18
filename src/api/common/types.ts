/*
 * @Author: Hughie
 * @Date: 2021-04-18 18:10:20
 * @LastEditors: Hughie
 * @LastEditTime: 2021-04-18 18:17:05
 * @Description:
 */

// 登录接口
export interface LoginRequest {
  /** 手机号 */
  phone: string
  /** 密码 */
  password: string
}

export interface LoginResponse {
  /** ID */
  id: number
  /** 用户昵称 */
  nickname: string
  /** 手机号码 */
  phone: string
  /** 用户token */
  token: string
  /** 角色 */
  role: string
  /** 当前项目 */
  study?: {
    id: string
  }
}

// 验证token
export interface CheckTokenResponse extends LoginResponse {
  /** 用户名 */
  username?: string
}

// 获取验证码
export interface GetAuthCodeRequest {
  /** 手机号码 */
  phone: string
  /** 随机字符串 */
  nonce: string
  /** 签名 */
  signature: string
  /** 验证类型 */
  category: GetAuthCodeRequestCategory
}

export type GetAuthCodeRequestCategory = 'login' | 'register' | 'reset' | 'bind'

// 上传文件

export type UploadFileResponse = UploadFileResponseItem[]

export interface UploadFileResponseItem {
  filename: string
  url: string
}

// 修改密码请求
export interface ChangePasswordRequest {
  /** 原密码 */
  old_password: string
  /** 新密码 */
  new_password: string
}
