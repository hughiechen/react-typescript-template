/*
 * @Author: Hughie
 * @Date: 2020-06-21 11:41:09
 * @LastEditTime: 2020-06-21 11:57:34
 * @LastEditors: Hughie
 * @Description:
 */

import { Cache } from '../Cache'

const cache = new Cache()

beforeEach(() => {
  cache.clear()
})

it('Cache setItem & getItem', () => {
  cache.setItem('A', 1)
  expect(cache.getItem('A')).toEqual(1)
})

it('Cache removeItem', () => {
  cache.setItem('A', 1)
  expect(cache.getItem('A')).toEqual(1)
  expect(cache.removeItem('A')).toBeUndefined()
})

it('Cache popItem ', () => {
  cache.setItem('A', 1)
  expect(cache.popItem('A')).toEqual(1)
  expect(cache.isEmpty).toBeTruthy()
})

it('Cache mergeItem ', () => {
  cache.setItem('A', { a: 1 })
  expect(cache.getItem('A')).toEqual({ a: 1 })
  cache.mergeItem('A', { b: 1 })
  expect(cache.getItem('A')).toEqual({
    a: 1,
    b: 1,
  })
})
