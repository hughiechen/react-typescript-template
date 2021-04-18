/*
 * @Author: yang
 * @Date: 2019-11-15 15:48:29
 * @Last Modified by: Hughie
 * @Last Modified time: 2020-07-13 16:59:53
 * 省市区选择
 */

import React from 'react'
import { Cascader } from 'antd'
import { OptionsLevel, getAddressOptions } from './options'
import type { CascaderOptionType, CascaderValueType } from 'antd/lib/cascader'

export interface SimpleAddressCascaderProps {
  value?: string[]
  onChange?: (value?: string[], selectedOptions?: CascaderOptionType[]) => void
  disabled?: boolean
  style?: React.CSSProperties
  level?: OptionsLevel
}

export const SimpleAddressCascader: React.FC<SimpleAddressCascaderProps> = React.memo(props => {
  const onChangeValue = React.useCallback(
    (value: CascaderValueType, selectedOptions?: CascaderOptionType[]) => {
      props.onChange?.(value ? (value.length !== 0 ? (value as string[]) : undefined) : undefined, selectedOptions)
    },
    [props]
  )

  return <Cascader disabled={props.disabled} allowClear showSearch value={props.value} onChange={onChangeValue} options={getAddressOptions(props.level!)} style={props.style} />
})

SimpleAddressCascader.defaultProps = {
  level: 'district',
}

export default SimpleAddressCascader
