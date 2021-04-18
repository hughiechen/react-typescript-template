import * as React from 'react'
import { KeyboardEventListener, KeyboardKey } from '../../material/KeyboardEventListener'
import { NextManager } from './NextManager'
import { NextManagerContext } from './context'

export interface FocusSwitchProps {
  /**
   * 基于 DOM 进行范围约束，为表单祖先 DOM 元素，一个 css 选择器
   * @default body
   */
  scopeSelector?: string
  /** 传入 useFocusSwitch 的返回值，若不使用 hook 写法，可采用 ref 获取 FocusSwitch 实例进行 next 操作 */
  manager?: NextManager
  /**
   * 是否开启自动切换焦点，否则需要手动切换焦点
   * @default true
   */
  autoNext?: boolean
}

export class FocusSwitch extends React.PureComponent<FocusSwitchProps> {
  private static scopeManager = new Map<string, NextManager>()

  static defaultProps: PickOptional<FocusSwitchProps> = {
    autoNext: true,
    scopeSelector: 'body',
  }

  static scope(selector: string) {
    return this.scopeManager.get(selector)
  }

  private readonly nextManager = (() => {
    const { scopeSelector, manager } = this.props
    const nextManager = manager ?? new NextManager()
    nextManager.setScope(scopeSelector!)
    return nextManager
  })()

  next = this.nextManager.next.bind(this.nextManager)

  componentDidMount() {
    FocusSwitch.scopeManager.set(this.props.scopeSelector!, this.nextManager)
  }

  componentWillUnmount() {
    FocusSwitch.scopeManager.delete(this.props.scopeSelector!)
  }

  private listener = (code: KeyboardKey) => {
    if (code === 'Enter') {
      this.next()
    }
  }

  render() {
    const { autoNext } = this.props
    return (
      <NextManagerContext.Provider value={this.nextManager}>
        {autoNext && <KeyboardEventListener listener={this.listener} />}
        {this.props.children}
      </NextManagerContext.Provider>
    )
  }
}
