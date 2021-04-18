/*
 * @Author: Hughie
 * @Date: 2020-06-17 17:03:55
 * @LastEditTime: 2020-06-29 12:15:18
 * @LastEditors: Hughie
 * @Description:
 */

import { createMemoryHistory } from 'history'
import { hStack } from '../HStack'

const history = createMemoryHistory()

beforeEach(() => {
  history.go(-history.length)
  hStack.hookHistory(history)
  hStack.contextCache.clear()
})

// 1
test('a ->b', () => {
  history.replace('/a')
  hStack.contextCache.setItem('pageA', {
    input: 1,
  })

  hStack.push('/b')
  expect(hStack.contextCache.isEmpty).toBeTruthy()
  // console.log('hStack.contextCache.keys', hStack.contextCache.isEmpty)
})
// 2
test('a->b,b push c', () => {
  history.replace('/a')
  hStack.contextCache.setItem('pageA', {
    input: 1,
  })
  // ---->B
  hStack.push('/b')
  expect(hStack.contextCache.isEmpty).toBeTruthy()
  hStack.contextCache.setItem('pageB', {
    inputB: 9,
  })
  expect(hStack.contextCache.isEmpty).toBeFalsy()
  // console.log('hStack.contextCache.values', hStack.contextCache.values())

  // ---->B
  history.push('/c')
  expect(hStack.contextCache.isEmpty).toBeTruthy()
})
// 3
test('a->b,b->c, c back-> b, b back-a', () => {
  history.replace('/a')
  const stateA = {
    inputA: 1,
  }
  // console.log('history1', history)
  hStack.contextCache.setItem('pageA', stateA)
  // ---->B
  hStack.push('/b')
  const stateB = {
    inputB: 2,
  }
  hStack.contextCache.setItem('pageB', stateB)
  // ~~~>c
  hStack.push('/c')
  // back-> b
  history.goBack()
  // console.log('history2', history)
  expect(history.location.pathname).toEqual('/b')
  expect(hStack.contextCache.getItem('pageB')).toEqual(stateB)
  // back-> a
  history.goBack()
  expect(history.location.pathname).toEqual('/a')
  expect(hStack.contextCache.getItem('pageA')).toEqual(stateA)
  expect(hStack.contextCache.getItem('pageB')).toBeUndefined()
})
// 4
test('a replace /a/1, /a/1 replace /a/2 , /a/2 -> /b , /b back /a/2', () => {
  history.replace('/a')
  const stateA = {
    inputA: 1,
  }
  hStack.contextCache.setItem('pageA', stateA)

  history.replace('/a/1')
  const stateA1 = {
    inputAC: 2,
  }
  hStack.contextCache.setItem('pageA1', stateA1)

  history.replace('/a/2')
  const stateA2 = {
    inputAC: 3,
  }
  hStack.contextCache.setItem('pageA2', stateA2)

  // ---->B
  hStack.push('/b')
  const stateB = {
    inputB: 13,
  }
  hStack.contextCache.setItem('pageB', stateB)

  // back-> /a/2
  history.goBack()
  expect(history.location.pathname).toEqual('/a/2')
  expect(hStack.contextCache.getItem('pageA2')).toEqual(stateA2)
  expect(hStack.contextCache.getItem('pageA')).toEqual(stateA)
  // console.log('hStack.contextCache', hStack.contextCache.values())
  // back-> a
  //   history.goBack()
})

// 5
test('a->b, b->c, c back-> b, b back-a', () => {
  history.replace('/a')
  const stateA = {
    inputA: 7,
  }

  hStack.contextCache.setItem('pageA', stateA)
  // ---->B
  hStack.push('/b')

  // ~~~>c
  hStack.push('/c')

  // back-> b
  history.goBack()
  // console.log('hStack.contextCache.values1', hStack.contextCache.values())
  expect(hStack.contextCache.getItem('pageA')).toBeUndefined()
  expect(hStack.contextCache.getItem('pageB')).toBeUndefined()
  history.goBack()
  // console.log('hStack.contextCache.values2', hStack.contextCache.values())
  expect(history.location.pathname).toEqual('/a')
  expect(hStack.contextCache.getItem('pageA')).toEqual(stateA)
  expect(hStack.contextCache.getItem('pageB')).toBeUndefined()
})

// 6 跳转到外围时，状态清除为
test('6= a->b, b push c ，c back b', () => {
  history.replace('/a')
  hStack.contextCache.setItem('pageA', {
    input: 11,
  })
  // ---->B
  hStack.push('/b')
  expect(history.location.pathname).toEqual('/b')
  expect(hStack.contextCache.isEmpty).toBeTruthy()
  hStack.contextCache.setItem('pageB', {
    inputB: 19,
  })
  expect(hStack.contextCache.isEmpty).toBeFalsy()
  // console.log('hStack.contextCache.values', hStack.contextCache.values())

  // ---->B
  history.push('/c')
  expect(history.location.pathname).toEqual('/c')
  expect(hStack.contextCache.isEmpty).toBeTruthy()

  history.goBack()
  expect(history.location.pathname).toEqual('/b')
  expect(hStack.contextCache.getItem('pageB')).toBeUndefined()

  history.goBack()
  expect(history.location.pathname).toEqual('/a')
  expect(hStack.contextCache.getItem('pageA')).toBeUndefined()
})

test('7 push同一个 页面，下一页面获取不了上以页面的缓存', () => {
  history.replace('/a')
  const stateA = {
    input: 111,
  }
  hStack.contextCache.setItem('pageA', stateA)
  hStack.push('/a')
  expect(hStack.contextCache.getItem('pageA')).toBeUndefined()
  history.goBack()
  expect(hStack.contextCache.getItem('pageA')).toEqual(stateA)
})
