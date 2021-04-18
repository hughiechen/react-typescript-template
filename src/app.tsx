import _ from 'lodash'
// import path from 'path'
import React from 'react'
import { observer } from 'mobx-react'
import LoginLoading from './components/LoginLoading'
import WebSiteApp from './block/WebSiteApp'
import { Button, notification } from 'antd'
import { EnvUtil } from './common/utils'
import { history, navigation } from './common/navigation'
import { SmileOutlined } from '@ant-design/icons'
import { appStore } from './stores/appStore'
import { Router } from 'react-router-dom'
import { RouteConfigContext } from './block/WebSiteApp/RouteConfigContext'
import { asideMenuConfig } from './config/menu'
import routerConfig from './config/routes'

const value = { baseUrl: '/', routerConfig, asideMenuConfig, title: 'sass平台' }

const TIMEOUT = 30 * 60 * 1000 // 设置超时时间： 30分钟

interface AppState {
  loading: boolean
}
@observer
export default class App extends React.PureComponent<any, AppState> {
  lastTime = new Date().getTime()

  currentTime = new Date().getTime()

  opBroadcast = new BroadcastChannel('checkOP')

  checkTimer = 0

  debounceMessage: _.DebouncedFunc<() => void>

  constructor(props: any) {
    super(props)
    this.debounceMessage = _.throttle(() => this.opBroadcast.postMessage({}), 5000)
  }

  componentDidMount() {
    // this.checkBrowser()
    this.checkVersion()
    appStore.checkToken()
    this.checkNOP()
  }

  componentWillUnmount() {
    // 为了解决热更新导致资源没有回收的问题
    window.clearInterval(this.checkTimer)
    window.removeEventListener('mouseover', this.dealOperate)
    window.removeEventListener('mousewheel', this.dealOperate)
    this.debounceMessage.cancel()
    this.opBroadcast.close()
  }

  private leavePage = () => {
    this.currentTime = new Date().getTime() // 更新当前时间

    if (this.currentTime - this.lastTime > TIMEOUT) {
      // 判断是否超时
      navigation.toLogin()
    }
  }

  dealOperate = () => {
    this.lastTime = new Date().getTime()
    this.debounceMessage()
  }

  // 检测无操作
  checkNOP() {
    window.addEventListener('mouseover', this.dealOperate)
    window.addEventListener('mousewheel', this.dealOperate)
    this.checkTimer = window.setInterval(this.leavePage, 5000)
    this.opBroadcast.onmessage = () => {
      const curTime = new Date().getTime()
      this.lastTime = this.lastTime > curTime ? this.lastTime : curTime
    }
  }

  checkVersion() {
    window.appStore.checkUpdate(() => {
      notification.open({
        key: 'updatable',
        message: '温馨提示',
        description: '网站已更新，请重新刷新页面',
        duration: 0,
        icon: <SmileOutlined style={{ color: '#36C3E0' }} />,
        btn: (
          <Button type="primary" onClick={() => window.location.reload()}>
            刷新
          </Button>
        ),
      })
    })
  }

  checkBrowser() {
    const re = EnvUtil.isValidChrome()
    if (re === null) {
      this.openNotification('请使用chrome浏览器')
    } else if (!re) {
      this.openNotification('您的浏览器版本过低，建议使用最新的Chrome浏览器')
    }
  }

  openNotification = (description: string) => {
    notification.open({
      message: '温馨提示',
      description,
      duration: 0,
      icon: <SmileOutlined style={{ color: '#108ee9' }} />,
    })
  }

  render() {
    if (!appStore!.isLogin) {
      return <LoginLoading fullScreen />
    } else {
      return (
        <Router history={history}>
          <RouteConfigContext.Provider value={value}>
            <WebSiteApp />
          </RouteConfigContext.Provider>
        </Router>
      )
    }
  }
}
