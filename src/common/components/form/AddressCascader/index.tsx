/*
 * @Author: yang
 * @Date: 2019-11-15 15:48:29
 * @Last Modified by: Hughie
 * @Last Modified time: 2020-07-13 16:58:31
 * 省市区选择
 */

import React from 'react'
import { Cascader, Input } from 'antd'
import styles from './index.module.less'
import type { CascaderValueType, CascaderOptionType } from 'antd/lib/cascader'
import { OptionsLevel, getAddressOptions } from './options'

export * from './SimpleAddressCascader'

interface AddressCascaderValue {
  area: string[]
  address: string
}

export interface AddressCascaderProps {
  value?: AddressCascaderValue
  vertical?: boolean
  onChange?: (value?: AddressCascaderValue, selectedOptions?: CascaderOptionType[]) => void
  disabled?: boolean
  /** 显示的等级，省，市，区 */
  level?: OptionsLevel
}

export const AddressCascader: React.FC<AddressCascaderProps> = React.memo(props => {
  const onChangeArea = React.useCallback(
    (value: CascaderValueType, selectedOptions?: CascaderOptionType[]) => {
      props.onChange?.({ area: value as string[], address: props.value?.address || '' }, selectedOptions)
    },
    [props]
  )

  const onChangeAddress = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      props.onChange?.({ address: event.target.value, area: props.value?.area || [] })
    },
    [props]
  )

  return (
    <div className={props.vertical ? styles.vertical : styles.horizontal}>
      <Cascader disabled={props.disabled} className={styles.cascader} allowClear showSearch value={props.value?.area} onChange={onChangeArea} options={getAddressOptions(props.level!)} />
      <Input disabled={props.disabled} className={styles.input} value={props.value?.address} onChange={onChangeAddress} allowClear placeholder="请输入详细地址" maxLength={30} />
    </div>
  )
})

AddressCascader.defaultProps = {
  level: 'district',
}

export default AddressCascader
