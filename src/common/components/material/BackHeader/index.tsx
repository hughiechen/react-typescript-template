import React from 'react'
import { Breadcrumb } from 'antd'
import { Icon } from '../../basic/Icon'
import { history } from '@/common/navigation'
import styles from './index.module.less'
import cx from 'classnames'
import { useDidUpdate, useDidMount } from '@/common/hooks/lifecycle'
import { useSetState } from '@/common/hooks/utils/useSetState'

export interface BackHeaderProps {
  backText?: string | Array<string>
  disabled?: boolean
}
export interface BackHeaderState {
  texts: Array<string>
}

export const BackHeader: React.FC<BackHeaderProps> = props => {
  const [state, setState] = useSetState<BackHeaderState>({
    texts: [],
  })
  const updateText = () => {
    if (props?.backText) {
      let temp: Array<string> = []
      if (typeof props?.backText === 'string') {
        temp = props?.backText?.split('/')
      }
      if (Array.isArray(props?.backText)) {
        temp = Array.from(props?.backText)
      }
      setState({
        texts: temp,
      })
    }
  }
  // 禁止返回
  const handleGoback = () => {
    if (props.disabled) return
    history.goBack()
  }
  useDidMount(() => {
    updateText()
  })

  useDidUpdate(() => {
    updateText()
  }, [props.backText])
  return (
    <div className={cx(styles.back, { [styles.disabled]: history.length <= 1 })}>
      {!props.disabled && (
        <span data-testid="click" onClick={handleGoback} style={{ cursor: 'pointer' }}>
          <Icon type="left" className={styles.backIcon} />
        </span>
      )}
      {state.texts && state.texts.length > 0 && (
        <Breadcrumb>
          {state.texts.map(_ => (
            <Breadcrumb.Item key={_}>
              <span className={styles.backText}>{_}</span>
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>
      )}
      {props.children}
    </div>
  )
}

export default BackHeader
