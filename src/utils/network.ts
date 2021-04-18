/*
 * @Author: Hughie
 * @Date: 2021-04-15 16:29:47
 * @LastEditors: Hughie
 * @LastEditTime: 2021-04-18 17:49:43
 * @Description:
 */
import { API_VERSION } from '@/utils/config'
import { request as originRequest, RequestConfig } from '@/common/network'

let apiHost = ''
if (IS_DEBUG || IS_TEST) {
  // 测试环境可以指定 apiHost
  apiHost = window.localStorage.getItem('apiHost') || ''
}

// 真实接口请求方法
export async function request<T>(config: RequestConfig, prefix?: 'common' | 'web', version?: string): Promise<T> {
  return originRequest<T>({ ...config, url: `${apiHost}/api/${prefix || 'web'}/${version || API_VERSION}${config.url}` })
}

// 测试接口请求方法
export async function mocRequest<T>(config: RequestConfig, prefix?: 'common' | 'web', version?: string): Promise<T> {
  return originRequest<T>({ ...config, url: `/mock/15/api/${prefix || 'web'}/${version || API_VERSION}${config.url}` })
}
