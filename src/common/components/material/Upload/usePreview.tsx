import React from 'react'
import { useSetState } from '@/common/hooks/utils/useSetState'
import { UploadFile } from './type'
import { isFileCannotPreview, isFileType, isImageFile } from './utils'
import { FileUtil } from '@/common/utils/basic/FileUtil'

export interface State {
  visiblePreviewFile: boolean
  previewFile: UploadFile | undefined
  fileList: UploadFile[]
}

export function usePreview() {
  const [state, setState] = useSetState<State>({
    visiblePreviewFile: false,
    previewFile: undefined,
    fileList: [],
  })

  const setPreviewFile = React.useCallback((previewFile?: UploadFile) => setState({ previewFile }), [setState])

  const closePreview = React.useCallback(() => setState({ visiblePreviewFile: false }), [setState])

  const open = React.useCallback(
    async (fileList: UploadFile[], file: UploadFile) => {
      // 如果上传失败，且是pdf文件禁止预览
      if (file.error && isFileCannotPreview(file)) {
        return
      }
      if (!file.url) {
        file.preview = await FileUtil.dataURL(file.originFileObj!)
      }
      if (isImageFile(file)) {
        setState({ previewFile: file, visiblePreviewFile: true, fileList })
        return
      }
      if (isFileType(file, 'pdf')) {
        window.open(file.url ?? file.preview, '_blank', 'noopener=yes,noreferrer=yes')
      }
    },
    [setState]
  )

  return {
    visible: state.visiblePreviewFile,
    current: state.previewFile,
    fileList: state.fileList,
    open,
    closePreview,
    setPreviewFile,
  }
}
