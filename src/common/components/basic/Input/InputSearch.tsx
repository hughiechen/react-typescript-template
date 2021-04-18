import React from 'react'
import { Input } from 'antd'
import type { SearchProps } from 'antd/lib/input'

export interface InputSearchProps extends SearchProps {
  /** 禁止输入空格 */
  trim?: boolean
}

export class InputSearch extends React.PureComponent<InputSearchProps> {
  private readonly inputRef: React.RefObject<Input> = React.createRef()

  private onSearch = (value: string, event?: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLInputElement>) => {
    // 去掉点击清除图标时，默认执行 onSearch 的行为
    if (!(event?.type === 'click' && event.currentTarget.tagName === 'INPUT')) {
      const { trim } = this.props
      this.props.onSearch?.(trim ? value.trim() : value, event)
    }
  }

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
    const { trim, ...restInputSearchProps } = this.props
    return <Input.Search ref={this.inputRef} {...restInputSearchProps} onChange={this.onChange} onSearch={this.onSearch} />
  }
}

export default InputSearch
