import React from 'react'
import { Store, FormVisible, FormErrors, SubmitReturnType, SetVisibleValue, SetErrorValue, ValidateReturnType } from './Store'
import { StoreContext } from './context'
import { Lambda } from 'mobx'
import { deepObserve } from 'mobx-utils'
import { FormContext } from './FormProvider/context'

export interface FormActions<V> {
  setValues<K extends keyof V>(values: Pick<V, K>, validate?: boolean): void
  setDeepValues(errors: Record<string, string>): void
  setErrors(errors: SetErrorValue<V>): void
  setDeepErrors(errors: Record<string, string>): void
  setVisible(values: SetVisibleValue<V>): void
  setDeepVisible(errors: Record<string, boolean>): void
  /**
   * 重置表单数据，默认不传值将使用 initialValue 来重置表单， initialValue 可使用 updateInitialValue 来进行更新
   * @param values
   */
  resetForm(values?: V): void
  submitForm(validate?: boolean): Promise<Readonly<SubmitReturnType<V>>>
  validateField<K extends keyof V>(fieldName: K): Promise<void>
  validate<F extends unknown[] = Array<keyof V>>(fieldNames?: F): Promise<Readonly<ValidateReturnType<V>>>
  updateInitialValue(values: V): void
}

export interface FormStoreData<V> {
  values: Readonly<V>
  errors: Readonly<FormErrors<V>>
  visible: Readonly<FormVisible<V>>
}

export interface FormInstance<V> extends FormActions<V>, FormStoreData<V> {}

export interface FormProps<V> {
  /**
   * 表单初始值，当 store 传入为一个 Store 实例，则忽略该初始值，因为 Store 实例化时已经提供了初始值
   */
  initialValue?: V
  /** 表单名字，配合 FormProvider 组件使用 */
  name?: string
  /**
   * initialValue 变化后使用新值初始化表单
   * @default true
   */
  enableReinitialize?: boolean
  /** 允许被 FormProvider 控制 */
  allowControlByProvider?: boolean
  /**
   * 监听表单字段变化
   */
  effect?: (name: keyof V, values: V, actions: FormActions<V>) => void
  effectMoments?: Array<'add' | 'update' | 'remove' | 'splice' | 'delete'>
  /**
   * 表单渲染之前的操作
   */
  beforeRender?: (actions: FormActions<V>) => void
  /**
   * Form 内部的状态从外部传入, 使用 useForm 时，需要将 useForm 返回的 store 赋予该字段
   * @example
   * ```tsx
   * function FormDemo() {
   *  const {store, from} = useForm({test: ''})
   *  // form.setValues({test: "1"})
   *  return (
   *    <Form store={store}>
   *      <Field name="test">
   *        <Input />
   *      </Field>
   *    </Form>
   *  )
   * }
   * ```
   */
  store?: Store<V> | (new (values: V) => Store<V>)
}

export class Form<V> extends React.PureComponent<FormProps<V>> implements FormInstance<V> {
  static contextType = FormContext

  readonly context: React.ContextType<typeof FormContext> = null

  static defaultProps: PickOptional<FormProps<any>> = {
    enableReinitialize: true,
  }

  private readonly store = (() => {
    const { store: OuterStore, initialValue = {} as V } = this.props
    if ((OuterStore instanceof Function || OuterStore === undefined) && !this.props.initialValue) {
      console.warn('%c 当 store 没有传入或者传入一个类时，initialValue 为必填！！', 'color: red;font-size: 14px')
    }
    if (OuterStore) {
      if (OuterStore instanceof Function) {
        return new OuterStore(initialValue)
      }
      return OuterStore
    }
    return new Store(initialValue)
  })()

  private disposer: Lambda | null = null

  setValues = this.store.setValues

  setDeepValues = this.store.setDeepValues

  setErrors = this.store.setErrors

  setDeepErrors = this.store.setDeepErrors

  setVisible = this.store.setVisible

  setDeepVisible = this.store.setDeepVisible

  validateField = this.store.validateField

  resetForm = this.store.resetForm

  submitForm = this.store.submit

  validate = this.store.validate

  updateInitialValue = this.store.updateInitialValue

  constructor(props: FormProps<V>) {
    super(props)
    props.beforeRender?.(this.createFormActions())
  }

  componentDidMount() {
    const { name, effect, allowControlByProvider } = this.props
    if (effect || this.context) {
      this.disposer = deepObserve(this.store.values, this.listener)
    }
    // 如果使用了 FormProvider 且 Form 允许被控制，那么将表单实例加入其中
    if (this.context && allowControlByProvider) {
      if (!name) {
        console.log('0000000', this.props)
        throw new Error('表单使用了 FormProvider 且开启 allowControlByProvider 后, Form 的 name 属性为必填')
      }
      this.context.addForm(name, this)
    }
  }

  componentDidUpdate(prevProps: Readonly<FormProps<V>>) {
    const { enableReinitialize, initialValue } = this.props
    if (enableReinitialize && initialValue !== prevProps.initialValue) {
      this.store.setValues(initialValue!, false)
    }
  }

  componentWillUnmount() {
    this.disposer?.()
    const { name } = this.props
    if (this.context && name) {
      this.context.removeForm(name)
    }
  }

  get values(): Readonly<V> {
    return this.store.values
  }

  get errors(): Readonly<FormErrors<V>> {
    return this.store.errors
  }

  get visible(): Readonly<FormVisible<V>> {
    return this.store.visible
  }

  private listener = (change: any, path: string, root: V) => {
    const { effectMoments = ['update'] } = this.props
    if (effectMoments.indexOf(change.type) > -1) {
      this.props.effect?.(change.name as keyof V, root, this.createFormActions())
      this.context?.onFormChange?.(this.props.name!, change.name as string, this.context.forms)
    }
  }

  private createFormActions = (): FormActions<V> => {
    return {
      setValues: this.setValues,
      setDeepValues: this.setDeepValues,
      setErrors: this.setErrors,
      setDeepErrors: this.setDeepErrors,
      setVisible: this.setVisible,
      setDeepVisible: this.setDeepVisible,
      resetForm: this.resetForm,
      submitForm: this.submitForm,
      validateField: this.validateField,
      validate: this.validate,
      updateInitialValue: this.updateInitialValue,
    }
  }

  render() {
    return <StoreContext.Provider value={this.store}>{this.props.children}</StoreContext.Provider>
  }
}

export default Form
