import React from 'react'
import { Input as AntdInput } from 'antd'
import { TextAreaProps as AntdTextAreaProps } from 'antd/lib/input'
import classnames from 'classnames'
import styles from './index.module.less'

export interface TextAreaProps extends AntdTextAreaProps {
  /** 禁止输入空格 */
  trim?: boolean
  /** 使 Textarea 透明 */
  transparent?: boolean
}

export class TextArea extends React.PureComponent<TextAreaProps> {
  private readonly inputRef: React.RefObject<any> = React.createRef()

  private onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { trim, onChange } = this.props
    if (trim) {
      event.target.value = event.target.value.trim()
    }
    onChange?.(event)
  }

  focus = () => this.inputRef.current?.focus()

  blur = () => this.inputRef.current?.blur()

  render() {
    const { onChange, trim, className, transparent, ...restTextAreaProps } = this.props
    return <AntdInput.TextArea ref={this.inputRef} {...restTextAreaProps} className={classnames(className, { [styles.transparent]: transparent })} onChange={this.onChange} />
  }
}

export default TextArea
