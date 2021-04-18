import React from 'react'
import { Spin } from 'antd'
import classnames from 'classnames'
import { Container } from './Container'
import styles from './index.module.less'

export interface OperateButtonProps {
  color?: 'red'
  style?: React.CSSProperties
  disabled?: boolean
  onClick?: () => void
}

interface State {
  loading: boolean
}

export class OperateButton extends React.PureComponent<OperateButtonProps, State> {
  static Container = Container

  private isMount = true

  state: State = {
    loading: false,
  }

  componentWillUnmount() {
    this.isMount = false
  }

  onClick = async () => {
    try {
      this.setState({ loading: true })
      await this.props.onClick?.()
    } finally {
      if (this.isMount) {
        this.setState({ loading: false })
      }
    }
  }

  render() {
    const { disabled, children, style, color } = this.props
    const { loading } = this.state
    return (
      <a
        data-testid="OperateButton"
        onClick={!disabled && !loading ? this.onClick : undefined}
        style={style}
        className={classnames(styles.operateButton, {
          [styles.operateButtonDisabled]: disabled,
          [styles.red]: color === 'red',
        })}
      >
        {children}
        <Spin spinning={loading} size="small" className={styles.spin} />
      </a>
    )
  }
}
