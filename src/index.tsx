/*
 * @Author: Hughie
 * @Date: 2021-03-08 15:59:03
 * @LastEditors: Hughie
 * @LastEditTime: 2021-03-16 19:04:46
 * @Description:
 */
import { hot } from 'react-hot-loader/root'
import React from 'react'
import ReactDOM from 'react-dom'
import { Intl } from './components/Intl'
import { ConfigProvider } from 'antd'
import { configure } from 'mobx'
import 'mobx-react-lite/batchingForReactDom'
import zhCN from 'antd/es/locale/zh_CN'
import enUS from 'antd/es/locale/en_US'
import { ErrorBoundary } from './common/components/material'

import './styles/index.less'
import App from './app'
import { errorHandler } from '@/common/utils'
import { navigation } from '@/common/navigation'
import moment from 'moment'
import 'moment/locale/zh-cn'
import { basicIntl } from '@/common/components/basic/locales'

// 错误捕获函数
errorHandler.addGlobalExceptionListener()
navigation.init()

// 启用 mobx 严格模式
configure({ enforceActions: 'observed' })

moment.locale(window.lang.toLocaleLowerCase(), {
  week: {
    dow: 1, // 设置周一为一周的第一天
  },
})
// 初始化基础组件的语言环境
basicIntl.init(window.lang)
const element = () => (
  <ErrorBoundary>
    <ConfigProvider locale={window.lang === 'zh-CN' ? zhCN : enUS} getPopupContainer={trigger => trigger.parentNode as HTMLElement}>
      <Intl>
        <App />
      </Intl>
    </ConfigProvider>
  </ErrorBoundary>
)

const HotApp = hot(element)

const ICE_CONTAINER = document.getElementById('ice-container')

if (!ICE_CONTAINER) {
  throw new Error(intl.get('no_ice_container_in_page'))
}

ReactDOM.render(<HotApp />, ICE_CONTAINER)
