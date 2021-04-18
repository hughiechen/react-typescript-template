/*
 * @Author: Hughie
 * @Date: 2020-07-27 17:33:48
 * @LastEditTime: 2021-04-18 18:16:08
 * @LastEditors: Hughie
 * @Description:
 */

import _ from 'lodash'
import { commonAPI } from '@/api/common'
import { LoginRequest, LoginResponse, CheckTokenResponse } from '@/api/common/types'
import { createSearch, getQuery, navigation } from '@/common/navigation'
import { RoleEnum } from '@/common/types/enum'
import { observable, runInAction, action } from 'mobx'
import Authority from './Authority'
// import { checkUpdate } from '@/api/checkUpdate'

import configStore from './configStore'

export class AppStore {
  @observable
  isLogin: boolean | null = false

  // @observable isAuthenticated = false

  @observable user: LoginResponse | null = null

  authority = new Authority()

  @action.bound
  async checkToken() {
    const { token, ...query } = getQuery()
    if (token) {
      localStorage.setItem('token', token)
    }
    try {
      // const result: CheckTokenResponse = await commonAPI.checkToken()
      const result = {
        id: 1,
        nickname: 'Admin',
      } as LoginResponse
      this.handleUserResult(result)
      const search = _.isEmpty(query) ? '' : createSearch(query)
      if (search) {
        navigation.replace({
          pathname: location.pathname,
          query,
        })
      }
    } catch (e) {
      navigation.toLogin()
    }
  }

  // 登录
  @action.bound
  async login(body: LoginRequest) {
    await commonAPI.login(body)
    const result = { id: 1, nickname: 'Admin' } as LoginResponse
    this.handleUserResult(result)
  }

  // 退出登录
  @action.bound
  async logOut() {
    runInAction(() => {
      localStorage.removeItem('token')
      navigation.toLogin()
      this.isLogin = false
      // this.user = null
      // this.isAuthenticated = false
    })
  }

  private handleUserResult(result: LoginResponse | CheckTokenResponse) {
    runInAction(() => {
      if (result?.token) {
        localStorage.setItem('token', result?.token)
      }
      this.user = result
      this.authority.permissions = { admin: result?.role === RoleEnum.ADMIN, normal: result?.role === RoleEnum.NORMAL }
      // this.isAuthenticated = true
      this.isLogin = true
    })
  }

  /** 检测网站是否有更新 */
  @action.bound
  checkUpdate(callback: () => void) {
    configStore.checkUpdate(callback)
  }

  /** 全屏 */
  // @observable isFullScreen = false
  // TODO: 临时适配，后面上层直接使用 configStore
  get isFullScreen() {
    return configStore.isFullScreen
  }

  @action
  requestFullscreen() {
    configStore.requestFullscreen()
  }

  @action
  exitFullscreen() {
    console.log('exitFullscreen 1')
    configStore.exitFullscreen()
  }

  // 不能使用intl里面的determineLocale，因为它内部使用了 return navigator.language || navigator.userLanguage;，这在移动端的chrome上会有问题返回语言"zh-cn"而不是zh-CN
  determineLocale() {
    configStore.determineLocale()
  }
}

const appStore = new AppStore()

window.appStore = appStore

declare global {
  interface Window {
    appStore: AppStore
  }
}

export { appStore }
