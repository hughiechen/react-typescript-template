/*
 * @Author: Hughie
 * @Date: 2020-06-21 11:41:09
 * @LastEditTime: 2020-06-21 12:36:02
 * @LastEditors: Hughie
 * @Description:
 */

import { Stack } from '../Stack'

const stack = new Stack()

beforeEach(() => {
  stack.clear()
})

it('Stack push', () => {
  expect(stack.push(1).length).toBe(1)
})

it('Stack pop', () => {
  stack.push(1, 2, 3)
  expect(stack.pop()).toBe(3)
  expect(stack.size()).toBe(2)
})

it('Stack pop with argument', () => {
  stack.push(1, 2, 3)
  expect(stack.pop(2)).toStrictEqual([2, 3])
  expect(stack.toArray()).toStrictEqual([1])
})

it('Stack peek', () => {
  stack.push(1, 2, 3)
  expect(stack.peek()).toBe(3)
  expect(stack.toArray()).toStrictEqual([1, 2, 3])
})

it('Stack isEmpty', () => {
  expect(stack.isEmpty()).toBeTruthy()
})

it('Stack clear', () => {
  stack.push(1, 2, 3)
  stack.clear()
  expect(stack.isEmpty()).toBeTruthy()
})
