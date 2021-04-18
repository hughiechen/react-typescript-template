import React from 'react'
import { Button, notification } from 'antd'
import { EnvUtil } from '@/common/utils'
import { SmileOutlined } from '@ant-design/icons'
import { history } from '@/common/navigation'
import { WebLoginApp } from '@/block/WebLoginApp'
import { Router } from 'react-router-dom'
import loginRouter from './config/routes'

// TODO: 后期考虑重构，目前该 app和 主app很多相同的代码
export default class App extends React.PureComponent {
  async componentDidMount() {
    this.checkBrowser()
    this.checkVersion()
  }

  checkBrowser = () => {
    const re = EnvUtil.isValidChrome()
    if (re === null) {
      this.openNotification(intl.get('please_use_chrome_browser').d('请使用chrome浏览器'))
    } else if (!re) {
      this.openNotification(intl.get('your_browser_is_too_low').d('您的浏览器版本过低，建议使用最新的Chrome浏览器'))
    }
  }

  openNotification = (description: string) => {
    notification.open({
      message: intl.get('tips'),
      description,
      duration: 0,
      icon: <SmileOutlined style={{ color: '#108ee9' }} />,
    })
  }

  checkVersion() {
    window.configStore.checkUpdate(() => {
      notification.open({
        key: 'updatable',
        message: intl.get('tips'),
        description: intl.get('website_updated_please_reload').d('网站已更新，请重新刷新页面'),
        duration: 0,
        icon: <SmileOutlined style={{ color: '#E77F65' }} />,
        btn: (
          <Button type="primary" onClick={() => window.location.reload()}>
            {intl.get('operate_refresh')}
          </Button>
        ),
      })
    })
  }

  render() {
    return (
      <Router history={history}>
        <WebLoginApp routes={loginRouter} />
      </Router>
    )
  }
}
