/*
 * @Author: Hughie
 * @Date: 2019-12-26 21:51:48
 * @Last Modified by: Hughie
 * @Last Modified time: 2020-07-13 17:13:03
 * 带有下拉选择的 InputNumber
 */

import React from 'react'
import { Menu, Dropdown } from 'antd'
import { InputNumber } from '../../basic/InputNumber'
import type { InputNumberProps } from '../../basic/InputNumber'
import styles from './index.module.less'

export interface Option {
  label: string
  value: number | undefined
  disabled?: boolean
}

export interface DropDownInputNumberProps extends InputNumberProps {
  options?: Option[]
}

interface State {
  visible: boolean
}

export class DropDownInputNumber extends React.PureComponent<DropDownInputNumberProps, State> {
  private inputRef: React.RefObject<InputNumber> = React.createRef()

  state: State = {
    visible: false,
  }

  private getMenu = () => {
    const { options } = this.props
    return (
      <Menu>
        {options?.map((_, index) => (
          <Menu.Item
            key={index}
            disabled={_.disabled}
            onClick={info => {
              info.domEvent.stopPropagation()
              this.props.onChange?.(_.value)
              this.hideDropDownMenu()
            }}
          >
            {_.label}
          </Menu.Item>
        ))}
      </Menu>
    )
  }

  private openDropDownMenu = () => this.setState({ visible: true })

  private hideDropDownMenu = () => this.setState({ visible: false })

  public blur() {
    this.inputRef.current?.blur()
  }

  public focus() {
    this.inputRef.current?.focus()
  }

  render() {
    const { options, ...restInputNumberProps } = this.props
    const { visible } = this.state
    return (
      <div className={styles.container} onClick={this.openDropDownMenu} onMouseLeave={this.hideDropDownMenu}>
        <Dropdown visible={visible} overlay={this.getMenu} placement="bottomCenter">
          <InputNumber ref={this.inputRef} {...restInputNumberProps} />
        </Dropdown>
      </div>
    )
  }
}

export default DropDownInputNumber
