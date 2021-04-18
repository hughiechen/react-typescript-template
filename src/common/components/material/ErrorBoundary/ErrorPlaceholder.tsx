import * as React from 'react'
import { Icon } from '../../basic/Icon'
import styles from './index.module.less'

export const ErrorPlaceholder: React.FC = React.memo(() => (
  <div className={styles.errorPlaceholder}>
    <Icon type="error" className={styles.errorIcon} />
    <span>{intl.get('an_exception_occurred,_please_try_again_later').d('发生异常，请稍后再试')}</span>
  </div>
))
