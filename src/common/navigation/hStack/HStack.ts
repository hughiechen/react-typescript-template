/*
 * @Author: Hughie
 * @Date: 2020-06-17 15:31:01
 * @LastEditTime: 2020-06-18 09:28:36
 * @LastEditors: Hughie
 * @Description:用于状态保存，针对replace 不做处理，所以在使用subpage 切换tab页的时候，各个界面需自己在unmount中清除自己相关的缓存
 * HStack.contextCache 上下文缓存 和路由相关（排除replace），每次push的时候 会把当前contextCache 压栈，goback 的时候把 之前保存的上下文还原到
 * HStack.contextCache中
 */

import { History, UnregisterCallback } from 'history'
import { Stack } from './Stack'
import { Cache } from './Cache'
import { createSearch } from '../utils'

interface IHistoryItem {
  pathname: string
  cache?: Cache
}

class HStack {
  contextCache = new Cache()

  private history: History | null = null

  // 下一个简要push到堆栈的url
  private next: string | null = null

  private readonly stack: Stack<IHistoryItem> = new Stack<IHistoryItem>()

  private unRegister?: UnregisterCallback

  /** 注入 history */
  hookHistory(history: History) {
    if (this.unRegister) {
      this.stack.clear()
      this.unRegister()
    }
    this.history = history
    this.unRegister = history.listen((location, action) => {
      if (action === 'POP') {
        let count = 0
        const reverseList = this.stack.toArray().reverse()

        const isInStack = reverseList.some(({ pathname }) => {
          return location.pathname === pathname
        })
        if (!isInStack) return

        reverseList.some(({ pathname }) => {
          if (location.pathname === pathname) {
            return true
          }
          count++
          return false
        })

        if (count > 0) {
          this.stack.pop(count)
        }
        this.contextCache = this.stack.peek().cache || new Cache()
      } else if (action === 'PUSH') {
        const last = this.stack.peek()
        if (!last) return

        if (location.pathname !== this.next) {
          this.stack.clear()
          this.contextCache.clear()
        }
      }
    })
  }

  /** 不清除缓存跳转页面 */
  push(url: string, query?: AnyObject) {
    if (!this.history) {
      throw new Error('history is required')
    }

    const { pathname } = this.history.location
    this.next = url.split('?')[0]

    this.stack.push({ pathname, cache: this.contextCache })
    this.contextCache = new Cache()

    if (query) {
      this.history.push({ pathname: url, search: createSearch(query) })
      return
    }
    this.history.push(url)
  }
}

export const hStack = new HStack()
