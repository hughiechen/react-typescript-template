/* @Author: Hughie
 * @Date: 2019-12-02 10:54:50
 * @LastEditTime: 2020-03-22 09:19:07
 * @LastEditors: Hughie
 * @Description: 用于处理一些 UI 配置相关，比如全屏（隐藏顶部状态栏），后期字体大小、主题等
 */
import { checkUpdate } from '@/api/checkUpdate'
import { observable, action } from 'mobx'
import { getQuery } from '@/common/navigation/utils'

export class ConfigStore {
  /** 是否全屏 */
  @observable isFullScreen = false

  private timeId?: number

  @action
  requestFullscreen() {
    this.isFullScreen = true
  }

  @action
  exitFullscreen() {
    this.isFullScreen = false
  }

  /** 检测网站是否有更新 */
  @action.bound
  checkUpdate(callback: () => void) {
    checkUpdate().then(hasNew => {
      if (hasNew) {
        callback()
      }
    })
    if (this.timeId) {
      window.clearInterval(this.timeId)
    }

    this.timeId = window.setInterval(() => {
      checkUpdate().then(hasNew => {
        if (hasNew) {
          callback()
        }
      })
    }, 1000 * 60 * 10)
  }

  // 不能使用intl里面的determineLocale，因为它内部使用了 return navigator.language || navigator.userLanguage;，这在移动端的chrome上会有问题返回语言"zh-cn"而不是zh-CN
  determineLocale() {
    const qLang = getQuery().lang
    console.log('qLang', qLang)
    if (qLang) {
      const lang = qLang !== 'en-US' ? 'zh-CN' : 'en-US'
      window.localStorage.setItem('lang', lang)
      return qLang
    } else {
      return window.lang
    }
  }
}

const configStore = new ConfigStore()

window.configStore = configStore

declare global {
  interface Window {
    configStore: ConfigStore
  }
}

export default configStore
