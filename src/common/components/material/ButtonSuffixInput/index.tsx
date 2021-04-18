import React from 'react'
import { Input } from '../../basic/Input'
import { AutoLoadingButton } from '../../material/AutoLoadingButton'
import styles from './index.module.less'

export interface ButtonSuffixInputProps {
  value?: string
  onChange?: (value: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
  maxLength?: number
  trim?: boolean
  buttonText?: string
  buttonDisabled?: boolean
  buttonLoading?: boolean
  placeholder?: string
  onClick?: (value: string | undefined) => void | Promise<void>
}

export class ButtonSuffixInput extends React.PureComponent<ButtonSuffixInputProps> {
  public static defaultProps: PickOptional<ButtonSuffixInputProps> = {
    buttonText: intl.get('button').d('按钮'),
  }

  onClickButton = () => this.props.onClick?.(this.props.value)

  render() {
    const { value, onChange, disabled, buttonText, buttonDisabled, buttonLoading, placeholder, trim, maxLength } = this.props
    return (
      <div className={styles.captchaButtonContainer}>
        <Input trim={trim} maxLength={maxLength} value={value} onChange={onChange} disabled={disabled} placeholder={placeholder} />
        <AutoLoadingButton type="primary" ghost size="small" className={styles.captchaButton} disabled={buttonDisabled} loading={buttonLoading} onClick={this.onClickButton}>
          {buttonText}
        </AutoLoadingButton>
      </div>
    )
  }
}

export default ButtonSuffixInput
