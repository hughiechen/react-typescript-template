import { debounce } from 'lodash'

type NormalFunction = (...args: any[]) => any

// 数装饰器生成器
export const decoratorCreator = (intercept: (f: NormalFunction, ...args: any) => void) => {
  return (target: object, propertyKey: PropertyKey, descriptor: TypedPropertyDescriptor<NormalFunction>) => {
    const fn = descriptor.value
    descriptor.value = function (...args: any) {
      return intercept.call(this, fn!.bind(this, ...args), ...args)
    }
  }
}

/**
 * 防抖装饰器
 * @param delay 延时
 */
export function Debounce(delay = 400) {
  return decoratorCreator(handler => debounce(handler, delay))
}
