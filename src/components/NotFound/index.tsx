/*
 * @Author: Hughie
 * @Date: 2020-10-09 09:42:58
 * @LastEditTime: 2021-01-31 10:39:35
 * @LastEditors: Hughie
 * @Description:
 */

import React from 'react'
import { Icon } from '@/common/components/basic'
import styles from './index.module.less'

export const NotFound: React.FC = React.memo(() => (
  <div className={styles.notFound}>
    <div className={styles.outsideBox}>
      <Icon type="404" className={styles.iconType} />
      <span className={styles.description}>抱歉，你访问的页面不存在~</span>
    </div>
  </div>
))

export default NotFound
