import React from 'react'

interface BasicComponentProps {
  open?: boolean
  onDropdownVisibleChange?: (open: boolean) => void
  onFocus?: (event: React.FocusEvent<HTMLElement>) => void
}

export interface AutoOpenDropdownProps {
  /**
   * 获取焦点时，自动打开下拉菜单
   */
  focusAutoOpen?: boolean
}

interface State {
  open: boolean | undefined
}

export function autoOpenDropdown<T>(target: T): T

export function autoOpenDropdown<P extends BasicComponentProps>(Component: React.ComponentType<P>): React.ComponentType<P & AutoOpenDropdownProps> {
  return class extends React.PureComponent<P & AutoOpenDropdownProps, State> {
    private readonly componentRef = React.createRef<any>()

    constructor(props: P & AutoOpenDropdownProps) {
      super(props)
      this.state = {
        open: false,
      }
    }

    componentDidUpdate(prevProps: Readonly<P & AutoOpenDropdownProps>) {
      const { open } = this.props
      if (this.isDropdownVisibleControl() && open !== prevProps.open) {
        this.setState({ open })
      }
    }

    private isDropdownVisibleControl = () => 'open' in this.props

    private onFocus = (event: React.FocusEvent<HTMLElement>) => {
      const { focusAutoOpen, onFocus, onDropdownVisibleChange } = this.props
      if (focusAutoOpen) {
        if (this.isDropdownVisibleControl()) {
          onDropdownVisibleChange?.(true)
        } else {
          this.setState({ open: true })
        }
      }
      onFocus?.(event)
    }

    private onDropdownVisibleChange = (open: boolean) => {
      const { onDropdownVisibleChange } = this.props
      return this.isDropdownVisibleControl() ? onDropdownVisibleChange?.(open) : this.setState({ open })
    }

    focus = () => this.componentRef.current?.focus()

    blur = () => this.componentRef.current?.blur()

    render() {
      const { focusAutoOpen, ...rest } = this.props
      const { open } = this.state
      return React.createElement(Component, { ...rest, ref: this.componentRef, open, onFocus: this.onFocus, onDropdownVisibleChange: this.onDropdownVisibleChange } as P)
    }
  }
}
