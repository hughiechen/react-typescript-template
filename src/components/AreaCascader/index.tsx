/*
 * @Author: Hughie
 * @Date: 2021-04-09 13:52:07
 * @LastEditTime: 2021-04-09 17:02:53
 * @LastEditors: Hughie
 * @Description:
 */

import { useDidMount, useSetState } from '@/common/hooks'
import { Cascader } from 'antd'
import { CascaderOptionType, CascaderProps } from 'antd/lib/cascader'
import * as React from 'react'
import { getAreas } from './api/getAreas'

interface AreaCascaderProps extends Omit<CascaderProps, 'options'> {}

const cache = {
  options: [] as CascaderOptionType[],
}

export const AreaCascader: React.FC<AreaCascaderProps> = React.memo(props => {
  const [state, setState] = useSetState({ options: cache.options })

  useDidMount(async () => {
    if (cache.options.length < 1) {
      cache.options = await getAreas()
      setState({
        options: cache.options,
      })
    }
  })
  // props.value?.slice()} 解决 mobx 获取 数据下标越界 警告，原生js中 const a = [] ; a[0] 返回的是undefined，mobx 这样做会有警告
  return <Cascader options={state.options} {...props} value={props.value?.slice()} />
})

AreaCascader.defaultProps = {
  showSearch: true,
}
