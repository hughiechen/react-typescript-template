import React, { useCallback, useEffect } from 'react'
import { Input } from '@/common/components/basic'
import { useDidUpdate, useSetState } from '@/common/hooks'
import { PlusOutlined } from '@ant-design/icons'
import { Tag, Tooltip } from 'antd'
import styles from './index.module.less'

export interface EditableTagsProps {
  value?: string[]
  onChange?: (value: string[]) => void
}

export interface EditableTagsState {
  /** 是否输入状态 */
  inputVisible: boolean
  /** 输入的内容 */
  inputValue: string
  editInputIndex: number
  editInputValue: string
  tags: string[]
}

const EditableTags = (props: EditableTagsProps) => {
  const [state, setState] = useSetState<EditableTagsState>({
    inputVisible: false,
    inputValue: '',
    editInputIndex: -1,
    editInputValue: '',
    tags: props.value ?? [],
  })

  const editRef = React.useRef<Input>(null)
  const inputRef = React.useRef<Input>(null)

  useDidUpdate(() => {
    if (props.value) {
      setState({
        tags: props.value,
      })
    }
  }, [props.value])

  /** 改变已经存在的值 */
  const handleEditInputChange = useCallback(
    e => {
      setState({
        editInputValue: e.target.value,
      })
    },
    [setState]
  )

  const handleEditInputConfirm = useCallback(() => {
    setState(({ tags, editInputValue, editInputIndex }) => {
      const newTags = [...tags]
      newTags[editInputIndex] = editInputValue
      props.onChange?.(newTags)
      return {
        tags: newTags,
        editInputIndex: -1,
        editInputValue: '',
      }
    })
  }, [props.onChange, setState])

  /** 新增Tag */
  const handleInputChange = useCallback(
    e => {
      setState({ inputValue: e.target.value })
    },
    [setState]
  )

  const handleInputConfirm = useCallback(() => {
    const { inputValue } = state
    let { tags } = state
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue]
    }
    props.onChange?.(tags)
    setState({
      tags,
      inputVisible: false,
      inputValue: '',
    })
  }, [props.onChange, setState, state])

  const showInput = useCallback(() => {
    setState({ inputVisible: true })
  }, [setState])

  /** 删除tag */
  const handleClose = useCallback(
    removedTag => {
      const tags = state.tags.filter(tag => tag !== removedTag)
      props.onChange?.(tags)
      setState({
        tags,
      })
    },
    [props.onChange, setState, state.tags]
  )

  useEffect(() => {
    if (state.editInputIndex !== -1) {
      return editRef.current?.focus()
    }
  }, [state.editInputIndex])

  useEffect(() => {
    if (state.inputVisible) {
      return inputRef.current?.focus()
    }
  }, [state.inputVisible])

  return (
    <>
      {state.tags.map((item, index) => {
        if (state.editInputIndex === index) {
          return (
            <Input
              ref={editRef}
              key={item}
              focusSelection
              onChange={handleEditInputChange}
              className={styles.tagsInput}
              onPressEnter={handleEditInputConfirm}
              onBlur={handleEditInputConfirm}
              size="small"
              value={state.editInputValue}
            />
          )
        }
        const isLongTag = item.length > 20
        const TagElem = (
          <Tag className={styles.editTag} key={item} closable onClose={() => handleClose(item)}>
            <span
              onDoubleClick={e => {
                setState({
                  editInputIndex: index,
                  editInputValue: item,
                })
                e.preventDefault()
              }}
            >
              {isLongTag ? `${item.slice(0, 10)}...` : item}
            </span>
          </Tag>
        )
        return isLongTag ? (
          <Tooltip title={item} key={item}>
            {TagElem}
          </Tooltip>
        ) : (
          TagElem
        )
      })}
      {state.inputVisible && (
        <Input
          type="text"
          ref={inputRef}
          size="small"
          className={styles.tagsInput}
          value={state.inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      )}
      {!state.inputVisible && (
        <Tag className={styles.tagsPlus} onClick={showInput}>
          <PlusOutlined /> 新增
        </Tag>
      )}
    </>
  )
}

export default EditableTags
