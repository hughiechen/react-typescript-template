/*
 * @Author: Hughie
 * @Date: 2021-04-09 16:51:53
 * @LastEditTime: 2021-04-09 17:03:36
 * @LastEditors: Hughie
 * @Description:
 */

import { request } from '@/utils/network'
import { CascaderOptionType } from 'antd/lib/cascader'

interface Area extends CascaderOptionType {
  code: string
  name: string
  children?: Array<Area>
}

const transAreaToCascaderOption = (area: Area) => {
  area.label = area.name
  area.value = area.code
  if (area.children) {
    area.children.forEach(a => transAreaToCascaderOption(a))
  }
}

export async function getAreas(): Promise<CascaderOptionType[]> {
  const rs = await request<Area[]>(
    {
      url: '/areas',
      query: {},
    },
    'common'
  )
  rs.forEach(c => {
    transAreaToCascaderOption(c)
  })
  return rs
}
