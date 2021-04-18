import React from 'react'
import { get } from 'lodash'
import { observe, Lambda, IObjectDidChange } from 'mobx'
import { observer } from 'mobx-react'
import { StoreContext } from './context'
import type { FormErrors, ValidateStatus } from './Store'
import { UnifiedEvent } from './UnifiedEvent'
import type { ValuePropName } from './UnifiedEvent'
import { getValueFormUIEvent, asyncDebounce } from './utils'

export interface AnyValue {
  [k: string]: any
}

export type FieldChildren = React.ReactChild | boolean | null // React.ReactElement | string | number | boolean | null

export type Validate<V, K extends keyof V> = (value: V[K], values: Readonly<V>) => (string | undefined) | Promise<string | undefined>

export interface ValidateRegExp {
  pattern: RegExp
  message: string
}

export interface FieldConfig<V, K extends keyof V> {
  value: V[K]
  values: V
  error: string | undefined
  errors: FormErrors<V>
  validateStatus: ValidateStatus
  setValue: (value: V[K] | React.ChangeEvent, validate?: boolean) => void
  setValues: <K extends keyof V>(values: Pick<V, K>, validate?: boolean) => void
}

export interface FieldTransferProps {
  /** 字段描述 */
  label?: React.ReactNode
  /** 是否做必填校验 */
  required?: boolean
  /** 自定义必填提示信息 */
  requiredText?: string
}

// 传递到 children render props 函数中的参数
export interface RenderPropsConfig<V = any, K extends keyof V = any> extends FieldConfig<V, K>, FieldTransferProps {}

export interface FieldProps<V, K extends keyof V> extends FieldTransferProps {
  /** 表单字段名称 */
  name: K
  /** 绑定到的字段名的值改变了，就会重新 render 组件 */
  bindNames?: string[]
  /** children 接受 value 的字段名称 */
  valuePropName?: ValuePropName
  /**
   * 表单验证支持输入函数与正则， 输入正则情况，表单组件 onChange 必须返回 string 类型的值
   * @description 默认在 required 为假时，且 value 为空，不执行 validate 即不做验证，若想做验证，可开启 validateNullish
   */
  validate?: Validate<V, K> | ValidateRegExp[]
  /**
   * 对表单验证函数 validate 的防抖处理，值为防抖等待时间
   * @default undefined 即不进行防抖处理
   * @description 单位为毫秒
   */
  validateDebounce?: number
  /**
   * 可选情况下并且 value 为空时，是否执行 validate 函数进行验证
   * @description 一般用在联合验证的情况，比如：fieldName1, fieldName2, fieldName3, 至少输入一个
   */
  validateNullishWithOptional?: boolean
  /** 表单验证成功回调 */
  validateSuccess?: (value: V[K]) => void
  /** 表单控件 */
  children?: React.ReactElement | string | number | boolean | null | ((renderPropsConfig: RenderPropsConfig<V, K>) => React.ReactElement | string | number | boolean | null)
}

@observer
export class Field<V extends AnyValue, K extends keyof V> extends React.PureComponent<FieldProps<V, K>> {
  static contextType = StoreContext

  readonly context!: React.ContextType<typeof StoreContext>

  static defaultProps: PickOptional<FieldProps<any, any>> = {
    valuePropName: 'value',
  }

  private disposer: Lambda | null = null

  constructor(props: FieldProps<V, K>, context: React.ContextType<typeof StoreContext>) {
    super(props, context)
    // 初始设置显示为 true
    if (this.context.visible[props.name] === undefined) {
      this.context.setVisible({ [props.name]: true })
    }
    // 初始设置显示为 undefined (保证有对应的 key)
    if (get(context.values, props.name) === undefined) {
      this.context.setValues({ [props.name]: undefined })
    }
  }

  componentDidMount() {
    const { validate, name, bindNames, required, validateSuccess } = this.props
    this.addValidateMethodToForm()
    if (validateSuccess && (required || validate)) {
      this.context.registerValidateSuccessMethod(name, validateSuccess)
    }
    // 添加 values 变化的监听器，为 bindName 属性服务
    if (bindNames && bindNames.length > 0) {
      this.disposer = observe(this.context.values, this.listener)
    }
  }

  componentWillUnmount() {
    this.context.unregisterValidateMethod(this.props.name)
    this.context.unregisterValidateSuccessMethod(this.props.name)
    this.disposer?.()
  }

  listener = (change: IObjectDidChange) => {
    const { bindNames: bindName, name } = this.props
    if (bindName?.includes(change.name as string) && change.name !== name) {
      this.forceUpdate()
    }
  }

  getFieldError = (error: string | undefined, touched: boolean | undefined, submitCount: number) => {
    return (touched && error) || (submitCount > 0 && error) ? error : undefined
  }

  addValidateMethodToForm = () => {
    const { validate, name, required, validateDebounce } = this.props
    if (required && validate) {
      this.context.registerValidateMethod(name, validateDebounce !== undefined ? asyncDebounce(this.validateWithRequired, validateDebounce) : this.validateWithRequired)
      return
    }
    if (required) {
      this.context.registerValidateMethod(name, validateDebounce !== undefined ? asyncDebounce(this.validateOnlyWithRequired, validateDebounce) : this.validateOnlyWithRequired)
      return
    }
    if (validate) {
      this.context.registerValidateMethod(name, validateDebounce !== undefined ? asyncDebounce(this.validate, validateDebounce) : this.validate)
    }
  }

  isNullValue = (value: V[K]) => value === null || value === undefined || (typeof value === 'string' && value === '')

  validateWithRequired = async (value: V[K], values: Readonly<V>) => {
    const errorMessage = await this.validateOnlyWithRequired(value)
    if (errorMessage) {
      return errorMessage
    }
    return await this.validate(value, values)
  }

  validateOnlyWithRequired = async (value: V[K]) => {
    const { required, requiredText, label } = this.props
    if (required && this.isNullValue(value)) {
      return requiredText ?? `${typeof label === 'string' ? `${label}为必填项` : '该项为必填项'}`
    }
    return undefined
  }

  validate = async (value: V[K], values: Readonly<V>) => {
    const { validate, validateNullishWithOptional: validateNullish, required } = this.props
    if (!required && !validateNullish && this.isNullValue(value)) {
      return undefined
    }
    return validate instanceof Function ? await validate?.(value, values) : this.createValidateWithRegExp(value, validate)
  }

  createValidateWithRegExp(value: V[K], regExp?: ValidateRegExp[]) {
    const notPaseItem = regExp?.find(_ => !_.pattern.test((value as unknown) as string))
    if (notPaseItem) {
      return notPaseItem.message
    }
    return undefined
  }

  /**
   * 接受 ChangeEvent 事件对象或值
   * @param value 值
   * @param validate 是否对该字段进行表单验证
   */
  setValue = (value: V[K] | React.ChangeEvent, validate = true) => this.context.setValues({ [this.props.name]: getValueFormUIEvent(value, this.props.valuePropName!) }, validate)

  setValues = <K extends keyof V>(values: Pick<V, K>, validate = true) => this.context.setValues(values, validate)

  render() {
    const { children, name, label, required, valuePropName } = this.props
    const { values, visible, errors, touched, submitCount, validateStatus } = this.context
    const renderPropsConfig = {
      name,
      label,
      required,
      value: get(values, name),
      values,
      error: this.getFieldError(get(errors, name) as string | undefined, get(touched, name) as boolean | undefined, submitCount),
      errors,
      setValue: this.setValue,
      setValues: this.setValues,
      validateStatus: get(validateStatus, name) as ValidateStatus,
    }
    if (!get(visible, name)) {
      return null
    }
    if (React.isValidElement(children)) {
      return (
        <UnifiedEvent valuePropName={valuePropName!} value={renderPropsConfig.value} onChange={this.setValue}>
          {children}
        </UnifiedEvent>
      )
    }
    if (children instanceof Function) {
      return children(renderPropsConfig)
    }
    return children
  }
}

export default Field
