/*
 * @Author: Hughie
 * @Date: 2020-11-04 16:14:27
 * @LastEditors: Hughie
 * @LastEditTime: 2021-04-09 19:36:46
 * @Description:
 */
import type { UploadFile, UploadFileStatus } from 'antd/lib/upload/interface'

export type FileType = 'image' | 'pdf' | 'csv' | 'excel' | 'video' | 'audio' | 'doc' | 'rar' | 'zip'

export const acceptMap: Record<FileType, string> = {
  image: 'image/png,image/PNG,image/jpeg,image/jpg,image/bmp,image/gif,image/tiff,image/jp2,image/webp,image/apng,image/HEIC,image/HEIF',
  pdf: 'application/pdf',
  csv: 'text/csv',
  excel: 'application/vnd.ms-excel',
  video: 'video/mp4,video/webm,video/mpeg,video/quicktime,video/x-flv,video/x-msvideo,video/x-ms-wmv,video/x-m4v',
  audio: 'audio/mpeg,audio/midi,audio/x-wav,audio/x-mpegurl,audio/x-m4a,audio/ogg,audio/x-realaudio',
  doc: 'application/msword',
  rar: 'application/x-rar-compressed, application/octet-stream',
  zip: 'application/zip, application/octet-stream, application/x-zip-compressed, multipart/x-zip',
}

/** 判断文件类型 */
export function isFileType(file: UploadFile, type: FileType) {
  return (
    file.type?.includes(type) ||
    'image/png,image/PNG,image/jpeg,image/jpg,image/bmp,image/gif,image/tiff,image/jp2,image/webp,image/apng,image/HEIC,image/HEIF'
      .split(',')
      .map(_ => _.split('/')[1])
      .some(_ => file.url?.endsWith(`.${_}`))
  )
}

/**
 * 判断是否是图片文件
 */
export function isImageFile(file: UploadFile) {
  return isFileType(file, 'image')
}

/**
 * file 上传失败且不是图片的文件，都禁止预览
 * @param file
 */
export function isFileCannotPreview(file: UploadFile) {
  return !isImageFile(file)
}

/**
 * 根据 antd Upload 组件的上传状态与进度获取 width
 * @param status
 * @param percent 小数 区间：[0, 1]
 */
export function getWidthByUploadInfo(status?: UploadFileStatus, percent?: number) {
  if (status === 'success' || status === 'done') {
    return '100%'
  }
  if (status === 'uploading' || (!status && percent === undefined)) {
    return `${(percent ?? 1) * 100}%`
  }
  return '0%'
}
