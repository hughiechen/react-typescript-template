/*
 * @Author: Hughie
 * @Date: 2020-06-17 15:28:11
 * @LastEditTime: 2020-06-17 17:01:43
 * @LastEditors: Hughie
 * @Description: 缓存结果
 */

export class Cache extends Map<string, any> {
  popItem<T>(key: string): T | undefined {
    const cachedValue = this.getItem(key)
    super.delete(key)
    return cachedValue
  }

  setItem<T = any>(key: string, value: T) {
    super.set(key, value)
  }

  mergeItem(key: string, value: object) {
    const v = super.get(key)
    // if(object.prototype.toString.call(v) === '[object Object]'){
    //     super.set(key, {...v, ...value})
    // }
    super.set(key, { ...v, ...value })
    return this
  }

  getItem<T = any>(key: string): T | undefined {
    return super.get(key)
  }

  removeItem(key: string) {
    this.delete(key)
  }

  get isEmpty() {
    return this.size === 0
  }
}
