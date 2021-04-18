/*
 * @Author: laiyangli
 * @Date: 2021-01-31 16:30:20
 * @LastEditTime: 2021-03-04 17:45:54
 * @LastEditors: Hughie
 * @Description:
 */

import React from 'react'
import { Layout } from 'antd'
import Header from './components/Header'
import classnames from 'classnames'
import styles from './index.module.less'
import Aside from './components/Aside'
import { observer } from 'mobx-react'
import { appStore } from '@/stores/appStore'

@observer
export default class BasicLayout extends React.PureComponent {
  public render() {
    const isFullScreen = appStore.isFullScreen
    return (
      <Layout
        style={{ height: '100vh' }}
        className={classnames({
          [styles.hidden]: isFullScreen,
        })}
      >
        <Layout.Header className={styles.antdLayoutHeader}>
          <Header />
        </Layout.Header>
        <Layout>
          <Layout.Sider className={styles.aside} width="auto">
            <Aside />
          </Layout.Sider>
          <Layout.Content className={styles.main}>
            <div className={styles.wrap}>
              <div className={styles.content}>{this.props.children}</div>
            </div>
          </Layout.Content>
        </Layout>
      </Layout>
    )
  }
}

export const HeaderLayout: React.FC = React.memo(props => {
  return (
    <Layout style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Layout.Header style={{ padding: '0 20px', height: 50 }}>
        <Header />
      </Layout.Header>
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>{props.children}</div>
    </Layout>
  )
})
