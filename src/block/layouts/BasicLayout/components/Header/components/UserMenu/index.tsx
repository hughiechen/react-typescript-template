/*
 * @Author: Hughie
 * @Date: 2021-01-31 17:54:23
 * @LastEditors: Hughie
 * @LastEditTime: 2021-03-04 17:48:54
 * @Description: 用户头部信息
 */

import React, { useCallback, useState } from 'react'
import { Popover } from 'antd'
import moment from 'moment'
import { Avatar } from '@/common/components/material'
import styles from './index.module.less'
import { DownOutlined } from '@ant-design/icons'
import { Modal } from '@/common/components/basic'
import { GenderEnum } from '@/common/types/enum'
import { useModalVisible } from '@/common/hooks'
import { ResetPassWordModal } from '../ResetPassWordModal'

interface UserMenuProps {
  nickname?: string
  logout: () => void
  gender?: GenderEnum
  avatar?: string
}

const getHourStr = (hour: number) => {
  if (hour >= 4 && hour <= 10) {
    return '早上'
  } else if (hour >= 11 && hour < 13) {
    return '中午'
  } else if (hour >= 13 && hour <= 16) {
    return '下午'
  } else if (hour >= 17 && hour <= 18) {
    return '傍晚'
  } else {
    return '晚上'
  }
}

const UserMenu: React.FC<UserMenuProps> = React.memo(props => {
  const { nickname, logout, gender, avatar } = props

  const [hovered, setHovered] = useState(false)
  const resetPasswordModal = useModalVisible()

  const handleClickChange = useCallback(
    visible => {
      setHovered(visible)
    },
    [setHovered]
  )

  const content = (
    <div>
      <div onClick={resetPasswordModal.open} className={styles.menu}>
        修改密码
      </div>
      <div
        onClick={() => {
          Modal.confirm({
            content: '您是否要退出账号?',
            onOk: logout,
          })
        }}
        className={styles.menu}
      >
        退出账号
      </div>
    </div>
  )

  return (
    <>
      <Popover trigger="click" placement="bottom" content={content} visible={hovered} onVisibleChange={handleClickChange}>
        <div className={styles.title}>
          <Avatar src={avatar} style={{ borderRadius: '50%' }} sex={gender === 0 ? 'female' : gender === 1 ? 'male' : 'unknown'} type="doctor" />
          <span style={{ margin: '0 10px' }}>
            {getHourStr(moment().hour())}好{nickname ? `, ${nickname}` : ''}
          </span>
          <DownOutlined style={{ fontSize: 12, color: '#bfbfbf' }} />
        </div>
      </Popover>
      {resetPasswordModal.state.visible && <ResetPassWordModal visible={resetPasswordModal.state.visible} onCancel={resetPasswordModal.cancel} />}
    </>
  )
})

export default UserMenu
