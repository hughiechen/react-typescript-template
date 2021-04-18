/*
 * @Author: Hughie
 * @Date: 2020-06-17 15:27:27
 * @LastEditTime: 2020-06-17 18:02:50
 * @LastEditors: Hughie
 * @Description: 栈结构
 */

export class Stack<T> {
  private items: T[]

  constructor(...items: T[]) {
    this.items = []

    if (items.length > 0) items.forEach(item => this.items.push(item))
  }

  push(...items: T[]) {
    // push item to the stack
    items.forEach(item => this.items.push(item))
    return this.items
  }

  pop(count = 0) {
    // pull out the topmost item (last item) from stack
    if (count === 0) return this.items.pop()
    else return this.items.splice(-count, count)
  }

  peek() {
    // see what's the last item in stack
    return this.items[this.items.length - 1]
  }

  size() {
    // no. of items in stack
    return this.items.length
  }

  isEmpty() {
    // return whether the stack is empty or not
    return this.items.length === 0
  }

  toArray() {
    return [...this.items]
  }

  clear() {
    this.items = []
  }
}
