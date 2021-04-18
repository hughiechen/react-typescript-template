/*
 * @Author: Hughie
 * @Date: 2020-10-22 15:30:15
 * @LastEditors: Hughie
 * @LastEditTime: 2020-11-30 17:20:09
 * @Description: 上传文件组件
 */
import type { UploadFile as AntdUploadFile } from 'antd/lib/upload/interface'
import type { FileType } from './utils'

export interface UploadFile extends AntdUploadFile {
  /** 文件在数据库绑定的 id,该 id 由 addImage 接口返回 */
  fileId?: string
}

export interface BaseUploadProps {
  /** 上传的文件类型，默认为 ['image'] */
  fileType?: FileType[]
  /** 文件列表 */
  fileList?: Array<UploadFile>
  /**
   * 上传的最大文件数，上传文件到达该数将会隐藏文件选择器
   */
  maxCount?: number
  /**
   * 限制上传的文件大小，单位：MB, 默认为 10 MB
   */
  maxFileSize?: number
  /** 是否开启下载功能 */
  download?: boolean
  /** 控制显示隐藏选择文件按钮 */
  readonly?: boolean
  /** 是否禁止 */
  disabled?: boolean
  /** 是否支持选择多个文件 */
  multiple?: boolean
  // 上传文字
  uploadText?: string
  onChange?: (fileList: UploadFile[]) => void
}
