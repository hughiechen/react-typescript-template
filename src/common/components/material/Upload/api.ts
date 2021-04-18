/*
 * @Author: Hughie
 * @Date: 2021-03-13 17:36:43
 * @LastEditors: Hughie
 * @LastEditTime: 2021-04-06 18:33:09
 * @Description:
 */
import { commonAPI } from '@/api/common'
import { UploadFileResponseItem } from '@/api/common/types'

interface UploadFileRequest {
  file: File
  prefix?: string
  onUploadProgress?: (progress: number, loaded: number, total: number) => void
}

export interface UploadFileResponse {
  name: string
  url: string
  /** errcode === 0 为请求正确 */
  errcode: number
  /** 存在异常时，该字段有值 */
  errmsg?: string
}

/**
 * 上传文件
 */
export async function upload(request: UploadFileRequest): Promise<UploadFileResponseItem> {
  const formData = new FormData()
  formData.append('file', request.file, request.file.name)
  formData.append('prefix', request.prefix ?? '')
  const result = await commonAPI.uploadFile(formData, request.onUploadProgress)
  return result[0]
}
