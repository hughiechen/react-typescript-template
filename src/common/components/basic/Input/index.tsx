import React from 'react'
import { Input as AntdInput } from 'antd'
import type { InputProps as AntdInputProps } from 'antd/lib/input'
import classnames from 'classnames'
import { InputSearch } from './InputSearch'
import { TextArea } from './TextArea'
import { Password } from './Password'
import styles from './index.module.less'

export interface InputProps extends AntdInputProps {
  /** 禁止输入空格 */
  trim?: boolean
  /** 使得输入框透明 */
  transparent?: boolean
  /** 获取焦点时，选中内容 */
  focusSelection?: boolean
}

interface State {
  type: string | undefined
}

export class Input extends React.PureComponent<InputProps, State> {
  static Search = InputSearch

  static TextArea = TextArea

  static Password = Password

  private readonly inputRef: React.RefObject<AntdInput> = React.createRef()

  constructor(props: InputProps) {
    super(props)
    this.state = {
      type: props.type === 'password' ? 'text' : props.type,
    }
  }

  componentDidMount() {
    // 禁止浏览器自动保存密码
    if (this.props.type === 'password') {
      this.setState({ type: 'password' })
    }
  }

  private onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { trim, onChange } = this.props
    if (trim) {
      event.target.value = event.target.value.trim()
    }
    onChange?.(event)
  }

  private onFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    const { focusSelection, onFocus } = this.props
    if (focusSelection) {
      this.inputRef.current?.select()
    }
    return onFocus?.(event)
  }

  focus = () => this.inputRef.current?.focus()

  blur = () => this.inputRef.current?.blur()

  render() {
    const { onChange, onFocus, trim, type, className, transparent, focusSelection, ...restInputProps } = this.props
    return (
      <AntdInput
        ref={this.inputRef}
        {...restInputProps}
        className={classnames(className, { [styles.transparent]: transparent })}
        onChange={this.onChange}
        onFocus={this.onFocus}
        type={this.state.type}
      />
    )
  }
}

export default Input
