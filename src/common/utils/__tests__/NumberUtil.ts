/*
 * @Author: Hughie
 * @Date: 2020-05-16 11:37:32
 * @LastEditTime: 2020-07-22 14:44:26
 * @LastEditors: Hughie
 * @Description:
 */

import { NumberUtil } from '../basic/NumberUtil'

describe('NumberUtil', () => {
  // afterAll
  test('toTCString', () => {
    const tcStr = NumberUtil.toTCString(12345)
    expect(tcStr).toBe('壹万贰千叁百肆拾伍元整')

    const tcStr2 = NumberUtil.toTCString(12345.1)
    expect(tcStr2).toBe('壹万贰千叁百肆拾伍元壹角')

    const tcStr3 = NumberUtil.toTCString(12345.14)
    expect(tcStr3).toBe('壹万贰千叁百肆拾伍元壹角肆分')

    const tcStr4 = NumberUtil.toTCString(0.14)
    expect(tcStr4).toBe('壹角肆分')
  })
})
