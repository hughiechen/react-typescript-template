import * as React from 'react'
import classnames from 'classnames'
import { Modal } from '@/common/components/basic/Modal'
import { Icon } from '@/common/components/basic/Icon'
import { GridLayout } from '@/common/components/layout/GridLayout'
import { UploadFile } from 'antd/lib/upload/interface'
import { MathUtil } from '@/common/utils/basic/MathUtil'
import styles from './index.module.less'
import { FileUtil } from '@/common/utils/basic/FileUtil'
import { isImageFile } from '../utils'

export interface PreviewModalProps {
  // 弹框标题
  title?: string
  /** 预览的文件列表 */
  fileList?: UploadFile[]
  visible: boolean
  /** 当前要预览的文件 */
  file?: UploadFile
  /** 给顶层添加额外元素 */
  topNode?: React.ReactNode
  onCancel?: () => void
  onPrev?: (file: UploadFile) => void
  onNext?: (file: UploadFile) => void
  afterClose?: () => void
}

interface State {
  /**
   * 缩放比例
   */
  scale: number
  /**
   * 旋转角度
   */
  rotate: number
  /**
   * 位移
   */
  translate: [number, number]
}

export class PreviewModal extends React.PureComponent<PreviewModalProps, State> {
  private isMouseDown = false

  private mouseDownPosition = [0, 0]

  private translate = [0, 0]

  constructor(props: PreviewModalProps) {
    super(props)
    this.state = {
      scale: 1,
      rotate: 0,
      translate: [0, 0],
    }
  }

  componentDidUpdate(prevProps: Readonly<PreviewModalProps>) {
    const { file, visible } = this.props
    // 切换图片，则恢复所有的缩放与位移数据
    if (visible && file && file !== prevProps.file) {
      this.reset()
    }
  }

  reset = () => {
    this.setState({
      scale: 1,
      rotate: 0,
      translate: [0, 0],
    })
    this.mouseDownPosition = [0, 0]
    this.translate = [0, 0]
  }

  /** 查找上一个或者下一个图片资源 */
  getPreviewFile = (type: 'prev' | 'next'): UploadFile | undefined => {
    const { fileList: files, file } = this.props
    if (files && file) {
      const index = files.findIndex(_ => _.uid === file.uid)
      if (index > -1) {
        return type === 'next'
          ? files.slice(index + 1).find(_ => isImageFile(_) && _.url)
          : files
              .slice(0, index)
              .reverse()
              .find(_ => isImageFile(_) && _.url)
      }
    }
    return undefined
  }

  onPrev = async () => {
    const previewFile = this.getPreviewFile('prev')
    if (previewFile) {
      // 如果没有 url，即上传发生异常，添加本地的预览数据
      if (!previewFile.url) {
        previewFile.preview = await FileUtil.dataURL(previewFile.originFileObj!)
      }
      this.props.onPrev?.(previewFile)
    }
  }

  onNext = async () => {
    const previewFile = this.getPreviewFile('next')
    if (previewFile) {
      // 如果没有 url，即上传发生异常，添加本地的预览数据
      if (!previewFile.url) {
        previewFile.preview = await FileUtil.dataURL(previewFile.originFileObj!)
      }
      this.props.onNext?.(previewFile)
    }
  }

  onRotate = () => this.setState(state => ({ rotate: MathUtil.subtract(state.rotate, 90) }))

  /** 缩放需要精确的计算值，使用 MathUtil */
  onZoom = () => this.setState(state => ({ scale: MathUtil.add(state.scale, 0.2) }))

  /** 缩放需要精确的计算值，使用 MathUtil */
  onZoomOut = () => {
    const { scale } = this.state
    if (scale > 0) {
      this.setState({ scale: MathUtil.subtract(scale, 0.2) })
    }
  }

  onMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    this.isMouseDown = event.button === 0
    this.mouseDownPosition = [event.pageX, event.pageY]
  }

  onMouseUp = () => {
    this.isMouseDown = false
    this.translate = [...this.state.translate]
  }

  onMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (this.isMouseDown) {
      const dx = event.pageX - this.mouseDownPosition[0] + this.translate[0]
      const dy = event.pageY - this.mouseDownPosition[1] + this.translate[1]
      this.setState({ translate: [dx, dy] })
    }
  }

  afterClose = () => {
    // 弹窗隐藏，则恢复所有的缩放与位移数据
    this.reset()
    this.props.afterClose?.()
  }

  render() {
    // TODO: 补全以下图标
    const { visible, file, topNode, onCancel, fileList, title } = this.props
    const { scale, rotate, translate } = this.state
    const disabledOnPrev = !this.getPreviewFile('prev')
    const disabledOnNext = !this.getPreviewFile('next')
    return (
      <Modal className={styles.modalContainer} width={810} title={title || '查看图片'} footer={null} visible={visible} onCancel={onCancel} afterClose={this.afterClose}>
        {topNode}
        <GridLayout column={['auto', 'auto', 'auto']} columnGap={32} rowGap={20}>
          <div className={classnames(styles.switch, { [styles.disabled]: disabledOnPrev })} onClick={disabledOnPrev ? undefined : this.onPrev}>
            {Number(fileList?.length) >= 2 && <Icon type="left" />}
          </div>
          <div className={styles.imageContainer} onMouseDown={this.onMouseDown} onMouseUp={this.onMouseUp} onMouseLeave={this.onMouseUp} onMouseMove={this.onMouseMove}>
            <div style={{ transform: `translate3d(${translate[0]}px,${translate[1]}px,0px)` }}>
              <img key={file?.uid} src={file?.url ?? file?.preview} alt={file?.name} style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }} draggable={false} />
            </div>
          </div>
          <div className={classnames(styles.switch, { [styles.disabled]: disabledOnNext })} onClick={disabledOnNext ? undefined : this.onNext}>
            {Number(fileList?.length) >= 2 && <Icon type="right" />}
          </div>
          <GridLayout.Item gridColumnStart="span 3" className={styles.previewOperate}>
            <div className={styles.operateText} onClick={this.onZoom}>
              <Icon className={styles.icon} type="fangda" />
              放大
            </div>
            <div className={styles.operateText} onClick={this.onZoomOut}>
              <Icon className={styles.icon} type="suoxiao" />
              缩小
            </div>

            <div className={styles.operateText} onClick={this.onRotate}>
              <Icon className={styles.icon} type="xuanzhuan" />
              旋转
            </div>
          </GridLayout.Item>
        </GridLayout>
      </Modal>
    )
  }
}
