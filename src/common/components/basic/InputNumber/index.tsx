import * as React from 'react'
import { Input, Button } from 'antd'
import { PlusOutlined, MinusOutlined, UpOutlined, DownOutlined } from '@ant-design/icons'
import type { SizeType } from 'antd/lib/config-provider/SizeContext'
import classnames from 'classnames'
import { MathUtil } from '@/common/utils/basic/MathUtil'
import { parsePrecisionValue, parseValue, getMinValue, getMaxValue, getValueInRange } from './utils'
import styles from './index.module.less'
import 'antd/lib/input-number/style'

export interface InputNumberMethods {
  blur(): void
  focus(): void
}

export interface InputNumberProps {
  value?: number
  min?: number
  max?: number
  step?: number
  /** 精度，小数位数 */
  precision?: number
  readOnly?: boolean
  disabled?: boolean
  /** 尺寸 */
  size?: SizeType // 'large' | 'small' | 'default'
  placeholder?: string
  style?: React.CSSProperties
  inputStyle?: React.CSSProperties
  className?: string
  /** UI 类型，single 为 antd 样式， inline 为按钮输入框一行显示 */
  type?: 'single' | 'inline'
  /** 默认值 */
  defaultValue?: number
  /** 文字对齐 */
  align?: 'left' | 'center' | 'right'
  /** 透明 */
  transparent?: boolean
  /**
   * 获取焦点（focus）时，选中所有内容
   */
  selectOnFocus?: boolean
  /**
   * type 不是 inline 状态下隐藏点击按钮
   */
  hideButton?: boolean
  onFocus?: () => void
  onBlur?: () => void
  /** 按下回车键调用 */
  onPressEnter?: React.KeyboardEventHandler<HTMLInputElement>
  onChange?: (value?: number) => void
  onOverMax?: () => void
  onLessMin?: () => void
  /**
   * 格式化数子，使用 precision 后会生成 string 类型的值
   */
  formatter?: (value?: string) => string | undefined
}

interface State {
  internalValue: string | undefined // 内部存储的值
  numberValue: number | undefined // internalValue 的数字值
  updateInner: boolean // 组件是否是在组件内部触发更新
  isFocus: boolean // input 是否获取了焦点
}

export class InputNumber extends React.PureComponent<InputNumberProps, State> implements InputNumberMethods {
  static defaultProps: PickOptional<InputNumberProps> = {
    step: 1,
    size: 'middle',
    formatter: value => value,
  }

  static getDerivedStateFromProps(props: InputNumberProps, state: State) {
    if ('value' in props) {
      // 如果是内部触发更新
      if (state.updateInner) {
        return { updateInner: false }
      }
      // 受组件外部 value 更新而更新
      if (state.numberValue !== props.value) {
        const value = getValueInRange(props.value, props.min, props.max)
        return { internalValue: value?.toString(), numberValue: value }
      }
    }
    return null
  }

  inputRef: React.RefObject<Input> = React.createRef()

  constructor(props: InputNumberProps) {
    super(props)
    const defaultValue = getValueInRange(props.defaultValue, props.min, props.max)
    this.state = {
      internalValue: defaultValue?.toString(),
      numberValue: defaultValue,
      updateInner: false,
      isFocus: false,
    }
  }

  private onChange = (value: string | undefined) => {
    const numberValue = value === undefined || value === '-' ? undefined : Number(value)
    this.setState({ internalValue: value, numberValue, updateInner: true }, () => {
      /**
       * !('value' in this.props) 代表不是受控的情况
       * numberValue !== this.props.value 代表不将相等的值回调
       */
      if (!('value' in this.props) || numberValue !== this.props.value) {
        this.props.onChange?.(numberValue)
      }
    })
  }

  private onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { max, min, precision, onOverMax } = this.props
    try {
      let value = parsePrecisionValue(getMaxValue(parseValue(event.target.value), max, onOverMax), precision)

      // 如果最小值大于等于零，禁止输入负数
      if (typeof min === 'number' && min >= 0 && typeof value === 'string' && Number(value) < min) {
        value = null
      }

      if (value !== null) {
        this.onChange(value)
      }
    } catch {
      if (!(typeof min === 'number' && min >= 0)) {
        // 输入的值为 '-'
        this.onChange('-')
      }
    }
  }

  private onFocus = () => {
    const { readOnly, selectOnFocus } = this.props
    if (!readOnly) {
      this.setState({ isFocus: true })
      this.props.onFocus?.()
    }
    if (selectOnFocus) {
      this.inputRef.current?.select()
    }
  }

  private onBlur = () => {
    const { min, precision, readOnly } = this.props
    if (!readOnly) {
      const { internalValue } = this.state
      // 处理最小值精度问题
      const value = parsePrecisionValue(getMinValue(internalValue, min), precision)
      if (value !== null) {
        // value 类型: string -> number -> string, 去除尾随小数点或者尾随 0： 1. ， 1.000， 0.000
        this.onChange(value === undefined || value === '-' ? undefined : Number(value).toString())
      }
      this.setState({ isFocus: false })
      this.props.onBlur?.()
    }
  }

  private onPressEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === 13) {
      this.props.onPressEnter?.(event)
    }
  }

  /**
   * 递增
   */
  private add = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event.stopPropagation()
    const { step, min, max, precision, onOverMax } = this.props
    const { internalValue } = this.state
    const value = internalValue === undefined || internalValue === '-' ? min ?? step! : MathUtil.add(Number(internalValue), step!)
    const sum = parsePrecisionValue(getMaxValue(value?.toString(), max, onOverMax), precision)
    if (sum !== null) {
      this.onChange(sum)
    }
  }

  /**
   * 递减
   */
  private subtract = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event.stopPropagation()
    const { step, min, precision, onLessMin } = this.props
    const { internalValue } = this.state
    const value = internalValue === undefined || internalValue === '-' ? -step! : MathUtil.subtract(Number(internalValue), step!)
    const balance = parsePrecisionValue(getMinValue(value?.toString(), min, onLessMin), precision)
    if (balance !== null) {
      this.onChange(balance)
    }
  }

  /**
   * 是否禁用 递减 按钮
   */
  private getDisabledMinus = () => {
    const { min, readOnly, disabled, precision } = this.props
    const { numberValue } = this.state
    const minWithPrecision = parsePrecisionValue(min === undefined ? undefined : min.toString(), precision)
    if (minWithPrecision) {
      return !!(numberValue !== undefined && min !== undefined && numberValue <= Number(minWithPrecision)) || disabled || readOnly
    }
    return false
  }

  /**
   * 是否禁用 递增 按钮
   */
  private getDisabledAdd = () => {
    const { max, readOnly, disabled, precision } = this.props
    const { numberValue } = this.state
    const maxWithPrecision = parsePrecisionValue(max === undefined ? undefined : max.toString(), precision)
    if (maxWithPrecision) {
      return !!(numberValue !== undefined && max !== undefined && numberValue >= Number(maxWithPrecision)) || disabled || readOnly
    }
    return false
  }

  /**
   * 显示为正确精度的值，对超出精度的值进行裁剪，对没达到精度的值补充
   */
  private getPrecisionValue = (value: string | undefined) => {
    const { precision } = this.props
    if (typeof precision === 'number' && typeof value === 'string') {
      const splitValues = value.split('.')
      const decimal = splitValues[1]
      if (decimal) {
        const decimalWithPrecision = decimal.length >= precision ? decimal.slice(0, precision) : decimal.padEnd(precision, '0')
        return [splitValues[0], decimalWithPrecision].filter(Boolean).join('.')
      } else {
        return [splitValues[0], '0'.repeat(precision)].filter(Boolean).join('.')
      }
    }
    return value
  }

  public focus() {
    this.inputRef.current?.focus()
  }

  public blur() {
    this.inputRef.current?.blur()
  }

  render() {
    const { disabled, formatter, size, placeholder, style, inputStyle, className, type, readOnly, hideButton, transparent, align } = this.props
    const { internalValue, isFocus } = this.state
    const displayValue = isFocus ? internalValue : formatter!(this.getPrecisionValue(internalValue))
    const disabledMinus = this.getDisabledMinus()
    const disabledAdd = this.getDisabledAdd()
    const inputClassnames = {
      [styles.transparent]: transparent,
      [styles.alignCenter]: align === 'center',
      [styles.alignRight]: align === 'right',
    }
    // 项目需求所需的 UI
    if (type === 'inline') {
      const sizeWithClassName = size === 'large' ? styles.large : size === 'small' ? styles.small : styles.default
      return (
        <div className={classnames(styles.inlineInputNumber, inputClassnames, className)} style={style}>
          <Button
            icon={<MinusOutlined />}
            className={classnames({ [styles.large]: size === 'large', [styles.default]: size === 'middle', [styles.small]: size === 'small' })}
            disabled={disabledMinus}
            onClick={this.subtract}
          />
          <Input
            ref={this.inputRef}
            size={size}
            readOnly={readOnly}
            disabled={disabled}
            value={displayValue ?? ''}
            onChange={this.onInputChange}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            onKeyUp={this.onPressEnter}
            placeholder={placeholder}
          />
          <Button icon={<PlusOutlined />} className={sizeWithClassName} disabled={disabledAdd} onClick={this.add} />
        </div>
      )
    }

    // 以下使用 antd 自带的 html 结构和样式，达到和默认样式一致
    return (
      <div
        className={classnames('ant-input-number', styles.normalInputNumber, inputClassnames, { 'ant-input-number-lg': size === 'large', 'ant-input-number-sm': size === 'small' }, className)}
        style={style}
      >
        <div className="ant-input-number-input-wrap">
          <Input
            style={inputStyle}
            ref={this.inputRef}
            size={size}
            className="ant-input-number-input"
            readOnly={readOnly}
            disabled={disabled}
            value={displayValue ?? ''}
            onChange={this.onInputChange}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            onKeyUp={this.onPressEnter}
            placeholder={placeholder}
          />
        </div>
        <div className="ant-input-number-handler-wrap" style={{ display: !disabled && !readOnly && !hideButton ? undefined : 'none' }}>
          <span
            unselectable="on"
            role="button"
            tabIndex={-1}
            aria-label="Increase Value"
            className={classnames('ant-input-number-handler', 'ant-input-number-handler-up', { 'ant-input-number-handler-up-disabled': disabledAdd })}
            onClick={disabledAdd ? undefined : this.add}
          >
            {/**
             * 1. UpOutlined 原本可以直接复制 antd 网页的 svg DOM，但是存在渲染 svg 闪烁的问题
             * 2. UpOutlined 设置字体大小防止渲染闪烁的问题
             */}
            <UpOutlined className="ant-input-number-handler-up-inner" style={{ fontSize: 8 }} />
          </span>
          <span
            unselectable="on"
            role="button"
            tabIndex={-1}
            aria-label="Decrease Value"
            className={classnames('ant-input-number-handler', 'ant-input-number-handler-down', { 'ant-input-number-handler-down-disabled': disabledMinus })}
            onClick={disabledMinus ? undefined : this.subtract}
          >
            {/** 保持结构相同 */}
            <DownOutlined className="ant-input-number-handler-down-inner" style={{ fontSize: 8 }} />
          </span>
        </div>
      </div>
    )
  }
}

export default InputNumber
