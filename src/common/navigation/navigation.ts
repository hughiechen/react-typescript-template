import { hStack } from './hStack'
import { history } from './history'
import { createSearch } from './utils'
import type { LocationDescriptorObject, Path, LocationState } from 'history'

export interface NavigationLocation extends Omit<LocationDescriptorObject, 'search'> {
  query?: string | AnyObject
}

class Navigation {
  readonly history = history

  /** 路由缓存 */
  get cache() {
    return hStack.contextCache
  }

  private transformLocation(location: NavigationLocation) {
    return { ...location, ...(typeof location.query === 'object' ? { search: createSearch(location.query) } : null) } as LocationDescriptorObject
  }

  init() {
    hStack.hookHistory(history)
  }

  /** 保持 Navigation.cache 不被清除的，并且跳转页面 */
  pushKeepCache(url: string, query?: AnyObject) {
    hStack.push(url, query)
  }

  /**
   * 同 history.push，search 替换为 query，支持对象
   * @example history.push({ pathname: '/url', query: { id: 'xx' } })
   */
  push(location: NavigationLocation): void

  push(path: Path, state?: LocationState): void

  push(location: Path | NavigationLocation, state?: LocationState) {
    if (typeof location === 'string') {
      this.history.push(location, state)
      return
    }
    this.history.push(this.transformLocation(location))
  }

  /**
   * 同 history.replace，search 替换为 query，支持对象
   * @example history.replace({ pathname: '/url', query: { id: 'xx' } })
   */
  replace(location: NavigationLocation): void

  replace(path: Path, state?: LocationState): void

  replace(location: Path | NavigationLocation, state?: LocationState) {
    if (typeof location === 'string') {
      this.history.replace(location, state)
      return
    }
    this.history.replace(this.transformLocation(location))
  }

  goBack = () => {
    this.history.goBack()
  }

  goForward = () => {
    this.history.goForward()
  }

  go = (n: number) => {
    this.history.go(n)
  }

  /**
   * 导航到登录页面
   * @description 使用 location.href 跳转到登录页，这样会走 nginx 服务器重定向
   */
  toLogin() {
    window.location.href = '/login'
  }

  /** 打开新的标签页，且开启 noopener， noreferrer */
  openNewWindow(url: string) {
    const a = document.createElement('a')
    a.href = url
    a.rel = 'noopener noreferrer'
    a.target = '_blank'
    document.body.appendChild(a)
    a.click()
    a.remove()
  }
}

export const navigation = new Navigation()
