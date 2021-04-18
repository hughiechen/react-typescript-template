/*
 * @Author: Hughie
 * @Date: 2020-11-04 16:14:27
 * @LastEditors: Hughie
 * @LastEditTime: 2021-04-18 18:11:58
 * @Description: 公用api
 */

import { request, ProgressMethod } from '@/common/network'
import { CheckTokenResponse, LoginRequest, LoginResponse, UploadFileResponse, ChangePasswordRequest } from './types'

export const commonAPI = {
  /** 登录 */
  login(body: LoginRequest) {
    return request<LoginResponse>({ url: '/api/auth/login_by_password', method: 'POST', body })
  },
  /** 验证session登录状态，返回用户信息 */
  checkToken() {
    return request<CheckTokenResponse>({ url: '/api/user/profile', method: 'GET' })
  },
  /** 上传文件 */
  async uploadFile(body: FormData, onUploadProgress?: ProgressMethod) {
    const file = body.get('file') as File
    const fileName = file.name
    const url = `${+new Date()}-${fileName}`
    body.delete('file')
    body.append('key', url)
    body.append('success_action_status', '200')
    body.append('Content-Disposition', `attachment;filename=${fileName}`)
    body.append('file', file)
    await request<UploadFileResponse>({ url: 'baidu.com', method: 'POST', body, onUploadProgress })
    return [
      {
        filename: fileName,
        url: `'baidu.com'/${url}`,
      },
    ]
  },
  /** 修改密码 */
  changePassword(body: ChangePasswordRequest) {
    return request<void>({ url: '/api/auth/change_password', method: 'PUT', body })
  },
}
