/*
 * @Author: Hughie
 * @Date: 2020-05-16 11:37:32
 * @LastEditTime: 2020-05-16 18:03:12
 * @LastEditors: Hughie
 * @Description:
 */

import { EnvUtil } from '../EnvUtil'

describe('Chrome/81', () => {
  // afterAll
  test('EnvUtil', () => {
    jest.spyOn(window, 'navigator', 'get').mockImplementation(
      () =>
        ({
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36',
        } as Navigator)
    )
    jest.clearAllMocks()
    expect(EnvUtil.isValidChrome()).toBe(true)
  })
})

describe('Chrome/72', () => {
  // afterAll
  test('EnvUtil', () => {
    const fn = jest.spyOn(window, 'navigator', 'get')
    fn.mockReturnValueOnce({
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.4044.138 Safari/537.36',
    } as Navigator)
    expect(EnvUtil.isValidChrome()).toBe(false)
  })
})

describe('not chrome', () => {
  // afterAll
  test('EnvUtil', () => {
    const fn = jest.spyOn(window, 'navigator', 'get')
    fn.mockReturnValueOnce({
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Safari/537.36',
    } as Navigator)
    expect(EnvUtil.isValidChrome()).toBeNull()
  })
})
