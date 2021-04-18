import * as React from 'react'
import { Upload as AntdUpload, message, Button } from 'antd'
import { MathUtil } from '@/common/utils/basic/MathUtil'
import type { UploadProps as AntdUploadProps, RcFile, UploadChangeParam } from 'antd/lib/upload/interface'
import { FileUtil } from '@/common/utils/basic/FileUtil'
import { upload } from '../api'
import { PreviewModal } from '../PreviewModal'
import { acceptMap, isFileCannotPreview, isFileType, isImageFile } from '../utils'
import { PlusOutlined, UploadOutlined } from '@ant-design/icons'
import type { BaseUploadProps, UploadFile } from '../type'
import styles from './index.module.less'

export interface UploadProps extends BaseUploadProps, Pick<AntdUploadProps, 'listType'> {
  /** 文件目录 */
  prefix?: string
}

interface State {
  visiblePreviewFile: boolean
  previewFile?: UploadFile
}

export class Upload extends React.PureComponent<UploadProps, State> {
  static defaultProps: PickOptional<UploadProps> = {
    maxFileSize: 500,
    listType: 'text',
    fileType: ['image'],
    uploadText: '上传',
    prefix: '',
  }

  private readonly acceptMap = acceptMap

  private readonly maxFileSize = MathUtil.multiply(this.props.maxFileSize!, 1024, 1024)

  constructor(props: UploadProps) {
    super(props)
    this.state = {
      previewFile: undefined,
      visiblePreviewFile: false,
    }
  }

  /**
   * @description 上传是失败的文件，图片可以预览，pdf不能预览
   */
  handlePreview = async (file: UploadFile) => {
    // 如果上传失败，且是pdf文件禁止预览
    if (file.error && isFileCannotPreview(file)) {
      return
    }
    if (!file.url) {
      file.preview = await FileUtil.dataURL(file.originFileObj!)
    }
    if (isImageFile(file)) {
      this.setState({ previewFile: file, visiblePreviewFile: true })
      return
    }
    if (isFileType(file, 'pdf')) {
      window.open(file.url ?? file.preview, '_blank', 'noopener=yes,noreferrer=yes')
    }
  }

  handleChange = (info: UploadChangeParam<UploadFile>) => {
    const newFileList = (info.fileList as UploadFile[])
      .map(item => {
        // NOTE: 默认上传成功后，url 只存在在 UploadFile.response 中，这里将 url 从 UploadFile.response 中放置到 UploadFile.url 上
        if (item.response) {
          item.url = item.response.url
          item.fileId = item.response.id
        }
        return item
      })
      .filter(item => item.size <= Number(this.maxFileSize))
    // NOTE: onChange 必须输入一个新的数组，否则不会重渲染
    this.props.onChange?.(newFileList)
  }

  beforeUpload = (file: RcFile) => {
    const { maxFileSize } = this.props
    if (file.size > Number(this.maxFileSize)) {
      message.error(`文件 ${file.name} 大小应小于等于 ${maxFileSize}M`)
      return false
    }
    return true
  }

  customRequest = (options: any) => {
    upload({
      file: options.file,
      prefix: this.props.prefix,
      onUploadProgress: p => options.onProgress({ percent: p * 100 }, options.file),
    })
      .then(result => {
        options.onSuccess(result, options.file)
      })
      .catch(error => {
        options.onError(error)
        throw error
      })
  }

  handleDownload = (file: UploadFile) => FileUtil.download(file.url!, file.name)

  getAccept = () => {
    const { fileType } = this.props
    if (fileType) {
      return fileType.map(_ => this.acceptMap[_]).join(',')
    }
    return undefined
  }

  renderChildren = () => {
    const { listType, uploadText } = this.props
    if (listType === 'picture-card') {
      return (
        <div className={styles.uploadText}>
          <PlusOutlined />
          <div>{uploadText}</div>
        </div>
      )
    }
    return <Button icon={<UploadOutlined />}>{uploadText}</Button>
  }

  closePreview = () => this.setState({ visiblePreviewFile: false })

  changePreviewFile = (previewFile?: UploadFile) => this.setState({ previewFile })

  render() {
    const { previewFile, visiblePreviewFile } = this.state
    const { maxCount, maxFileSize, readonly, fileType, children, disabled, download, ...restUploadProps } = this.props
    return (
      <React.Fragment>
        <AntdUpload
          {...restUploadProps}
          disabled={readonly || disabled}
          showUploadList={download ? { showDownloadIcon: true } : undefined}
          accept={this.getAccept()}
          onChange={this.handleChange}
          beforeUpload={this.beforeUpload}
          customRequest={this.customRequest}
          onPreview={this.handlePreview}
          onDownload={this.handleDownload}
        >
          {(maxCount && restUploadProps.fileList && restUploadProps.fileList.length >= maxCount) || readonly ? null : this.renderChildren()}
        </AntdUpload>
        <PreviewModal
          visible={visiblePreviewFile}
          file={previewFile}
          fileList={restUploadProps.fileList}
          onCancel={this.closePreview}
          onNext={this.changePreviewFile}
          onPrev={this.changePreviewFile}
          afterClose={this.changePreviewFile}
        />
      </React.Fragment>
    )
  }
}

export default Upload
