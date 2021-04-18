import React from 'react'
import { Input } from 'antd'
import type { PasswordProps as AntdPasswordProps } from 'antd/lib/input'

export interface PasswordProps extends AntdPasswordProps {
  /** 禁止输入空格 */
  trim?: boolean
}

export class Password extends React.PureComponent<PasswordProps> {
  private readonly inputRef: React.RefObject<Input> = React.createRef()

  private onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { trim, onChange } = this.props
    if (trim) {
      event.target.value = event.target.value.trim()
    }
    onChange?.(event)
  }

  focus = () => this.inputRef.current?.focus()

  blur = () => this.inputRef.current?.blur()

  render() {
    const { onChange, trim, ...restTextAreaProps } = this.props
    return <Input.Password ref={this.inputRef} {...restTextAreaProps} onChange={this.onChange} />
  }
}
