/*
 * @Author: Hughie
 * @Date: 2021-04-06 20:50:31
 * @LastEditors: Hughie
 * @LastEditTime: 2021-04-14 17:23:46
 * @Description:
 */
import axios from 'axios'
import { stringifyPath, parseDateToISO, parseWithMoment } from './utils'
import { MathUtil } from '../utils/basic/MathUtil'
import { createSearch } from '../navigation/utils'
import { APIException, BadRequestException, NetworkException } from './Exception'

export interface APIResponse<T> {
  errorCode: string
  result: T
  message: string
}

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

export type ProgressMethod = (percentage: number, loaded: number, total: number) => void

export interface RequestConfig {
  method?: RequestMethod
  url: string
  /** query 参数，生成 search 字符串追加到 url 后方 */
  query?: AnyObject
  /** 作为请求 body 发送给后端 */
  body?: AnyObject
  /**
   * url 上需要传入的参数
   * @example
   * url: /person/{id}
   * params: {id: 'xxx'}
   * 生成: /person/xxx
   */
  params?: AnyObject
  /** 上传进度 */
  onUploadProgress?: ProgressMethod
  /** 下载进度 */
  onDownloadProgress?: ProgressMethod
}

const instance = axios.create()

instance.interceptors.request.use(
  config => {
    if (config.data instanceof FormData) {
      Object.assign(config.headers, { 'Content-Type': 'multipart/form-data' })
    }
    if (localStorage.getItem('token')) {
      Object.assign(config.headers, { TOKEN: localStorage.getItem('token') })
    }
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

function onProgress(callBack?: ProgressMethod) {
  // Axios 未对 progressEvent 声明类型
  return (progressEvent: any) => {
    if (callBack && typeof progressEvent?.loaded === 'number' && typeof progressEvent?.total === 'number') {
      callBack(MathUtil.division(progressEvent.loaded, progressEvent.total)!, progressEvent.loaded, progressEvent.total)
    }
  }
}

declare global {
  interface Navigator {
    connection: {
      rtt: number
    }
  }
}

/**
 * 默认将 ISO8601格式数据转化为 moment 对象
 */
export async function request<T>(config: RequestConfig): Promise<T> {
  const finalQuery = createSearch(parseDateToISO(JSON.stringify(config.query ?? {})))
  const finalBody = config.body instanceof FormData ? config.body : config.body && parseDateToISO(JSON.stringify(config.body))
  const url = `${stringifyPath(config.url, config.params ?? {})}${finalQuery}`
  try {
    const res = await instance.request<APIResponse<T>>({
      method: config.method,
      url,
      data: finalBody,
      onUploadProgress: onProgress(config.onUploadProgress),
      onDownloadProgress: onProgress(config.onDownloadProgress),
    })
    if (!(res.data && typeof res.data === 'object' && 'errorCode' in res.data)) {
      // 三方接口
      return (res.data as unknown) as T
    } else if (res.data.errorCode === '00000') {
      return parseWithMoment(JSON.stringify(res.data.result || {}).replace(/"_id":/g, '"id":'))
    }

    throw new APIException(res.data.errorCode, (typeof res.data.result === 'string' ? res.data.result : res.data.message) || res.data.message)
  } catch (error) {
    if (error instanceof APIException) {
      throw error
    }
    if (error.status >= 400 && error.status < 500) {
      throw new BadRequestException(error, config)
    }

    if (error.response?.status >= 500) {
      if (navigator.connection.rtt === 0) {
        throw new NetworkException('请查看网络是否连接')
      }
      throw new NetworkException('服务器异常')
    }

    throw new NetworkException()
  }
}
