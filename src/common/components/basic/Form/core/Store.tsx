import { observable, runInAction } from 'mobx'
import { cloneDeep, set, get, setWith, mergeWith } from 'lodash'

export interface AnyObject<T = any> {
  [k: string]: T
}

export type ValidateStatus = 'validating' | 'success' | 'error'

type TranslateValueType<T, P> = {
  [K in keyof T]?: T[K] extends AnyObject ? (T[K] extends any[] ? AnyObject<TranslateValueType<T[K][number], P>> : TranslateValueType<T[K], P>) : P
}

export type FormErrors<V> = TranslateValueType<V, string>

export type FormTouched<V> = TranslateValueType<V, boolean>

export type FormVisible<V> = TranslateValueType<V, boolean>

export type FormValidateStatus<V> = TranslateValueType<V, ValidateStatus>

export type SetVisibleValue<V> = Partial<Record<keyof V, boolean>>

export type SetErrorValue<V> = Partial<Record<keyof V, string>>

export interface ValidateReturnType<V> {
  hasError: boolean
  errors: FormErrors<V>
}

export interface SubmitReturnType<V> {
  values: V
  errors: FormErrors<V>
  hasError: boolean
  visible: FormVisible<V>
}

export class Store<V extends AnyObject> {
  /**
   * 表单值对象，不允许修改 values 的引用，因为在其他地方深层监听了该引用的值变化，引用一变化，那么其他地方监听的事件会失效，比如：Consumer组件， Field 组件中就做了监听
   */
  @observable values: V

  /**
   * @todo
   * // TODO: 当 mobx 支持设置设置超出范围下标元素的值后，可以将该文件内的所有 setWith 替换成 set
   * @note
   * 如果 values 中存在数组，由于 mobx 通过数组下标设置值时，当设置超过范围下标元素的值时，会抛出异常；在这里，errors 通过 lodash.setWith 将下标映射为对象的键，由此解决 mobx 异常问题，例：
   *
   * values: {
   *    list: [{name: 'jack'}]
   * }
   * errors: {
   *    list { 0: { name: '该项为必填项' } }
   * }
   */
  @observable errors: FormErrors<V> = {}

  /** 同 Store.errors */
  @observable visible: FormVisible<V> = {}

  /** 同 Store.errors */
  @observable touched: FormTouched<V> = {}

  /** 字段验证状态, 同 Store.errors */
  @observable validateStatus: FormValidateStatus<V> = {}

  submitCount = 0

  private initialValue: V

  // 表单验证函数集合
  private readonly validateMap = new Map<keyof V, (value: any, values: Readonly<V>) => Promise<string | undefined>>()

  // 表单验证通过回调函数集合
  private readonly validateSuccessMap = new Map<keyof V, (value: any) => void>()

  constructor(values: V) {
    this.initialValue = cloneDeep(values)
    this.values = values
  }

  /**
   * 深合并对象，生成新的对象，如果字段的值为 undefined,也会进行合并，该方法处理了 lodash mergeWith 默认跳过合并 undefined 的问题
   * @param source1
   * @param source2
   */
  private deepMerge<TSource1, TSource2>(source1: TSource1, source2: TSource2): TSource1 & TSource2 {
    return mergeWith({}, source1, source2, (objValue, srcValue, key, object) => {
      if (srcValue === undefined) {
        object[key] = undefined
      }
    })
  }

  setErrors = (errors: SetErrorValue<V>) => {
    runInAction(() =>
      Object.keys(errors).forEach(_ => {
        setWith(this.errors, _, errors[_], Object)
        setWith(this.validateStatus, _, errors[_] ? 'error' : 'success', Object)
      })
    )
  }

  setVisible = (visible: SetVisibleValue<V>) => {
    runInAction(() => Object.keys(visible).forEach(_ => setWith(this.visible, _, visible[_], Object)))
  }

  setValues = <K extends keyof V>(values: Pick<V, K>, validate = true) => {
    runInAction(() => {
      Object.keys(values).forEach(_ => {
        const fieldName = _ as K
        set(this.values, fieldName, values[fieldName])
        if (!get(this.touched, fieldName)) {
          setWith(this.touched, fieldName, true, Object)
        }
        if (validate) {
          this.validateField(fieldName)
        }
      })
    })
  }

  setDeepErrors = (errors: Partial<AnyObject<string>>) => {
    this.setErrors(errors as Partial<Record<keyof V, string>>)
  }

  setDeepVisible = (visible: Partial<AnyObject<boolean>>) => {
    this.setVisible(visible as Partial<Record<keyof V, boolean>>)
  }

  setDeepValues = (values: AnyObject, validate = true) => {
    this.setValues(values, validate)
  }

  validateField = async <K extends keyof V>(fieldName: K) => {
    const validator = this.validateMap.get(fieldName)
    if (validator) {
      runInAction(() => {
        setWith(this.validateStatus, fieldName, 'validating', Object)
      })
      const error = await validator(get(this.values, fieldName), this.values)
      runInAction(() => {
        setWith(this.errors, fieldName, error, Object)
        setWith(this.validateStatus, fieldName, error ? 'error' : 'success', Object)
      })
      if (!error) {
        this.validateSuccessMap.get(fieldName)?.(get(this.values, fieldName))
      }
    }
  }

  /**
   * 对表单进行校验
   * @param fieldNames 需要校验的字段，不填写则校验所有字段
   */
  validate = async <F extends unknown[] = Array<keyof V>>(fieldNames?: F): Promise<Readonly<ValidateReturnType<V>>> => {
    const uniqueFieldNames = [...new Set(fieldNames)]
    const validators: Array<Promise<string | undefined>> = []
    const keys: Array<keyof V> = []
    this.validateMap.forEach((value, key) => {
      /**
       * 加入到校验队列的条件：
       * 1. key 关联的 Field 组件为显示状态
       * 2. fieldNames 为空或者 key 为 fieldNames 中的一员
       */
      if (get(this.visible, key) && (!fieldNames || uniqueFieldNames.includes(key))) {
        validators.push(this.validateMap.get(key)!(get(this.values, key), this.values))
        keys.push(key)
      }
    })
    const errorsArray = await Promise.all(validators)
    const errors: FormErrors<V> = keys.reduce((prev, next, index) => {
      if (errorsArray[index]) {
        setWith(prev, next, errorsArray[index], Object)
        runInAction(() => {
          setWith(this.validateStatus, next, 'error', Object)
        })
      }
      return prev
    }, {})
    runInAction(() => {
      this.errors = errors
    })
    return {
      hasError: errorsArray.some(Boolean),
      errors,
    }
  }

  submit = async (validate = true): Promise<Readonly<SubmitReturnType<V>>> => {
    ++this.submitCount
    const errors: ValidateReturnType<V> = validate ? await this.validate() : { errors: {}, hasError: false }
    return {
      ...errors,
      values: this.values,
      visible: this.visible,
    }
  }

  updateInitialValue = (values: V) => {
    this.initialValue = this.deepMerge(this.initialValue, values)
  }

  resetForm = (values?: V) => {
    runInAction(() => {
      const newValues = this.deepMerge(this.initialValue, values)
      Object.keys(this.values).forEach(_ => {
        set(this.values, _, newValues[_])
      })
      runInAction(() => {
        Object.keys(this.validateStatus).forEach(_ => {
          setWith(this.validateStatus, _, undefined, Object)
        })
      })
      this.submitCount = 0
      this.errors = {}
      this.touched = {}
    })
  }

  registerValidateMethod<K extends keyof V>(fieldName: K, fn: (value: V[K], values: Readonly<V>) => Promise<string | undefined>) {
    this.validateMap.set(fieldName, fn)
  }

  /**
   * Field 组件卸载的情况控制显示隐藏时，删除验证函数
   * @param fieldName 字段名
   */
  unregisterValidateMethod<K extends keyof V>(fieldName: K) {
    this.validateMap.delete(fieldName)
  }

  registerValidateSuccessMethod<K extends keyof V>(fieldName: K, fn: (value: any) => void) {
    this.validateSuccessMap.set(fieldName, fn)
  }

  /**
   * Field 组件卸载的情况控制显示隐藏时，删除验证成功的函数
   * @param fieldName 字段名
   */
  unregisterValidateSuccessMethod<K extends keyof V>(fieldName: K) {
    this.validateSuccessMap.delete(fieldName)
  }
}
