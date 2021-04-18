/*
 * @Author: Hughie
 * @Date: 2019-11-26 11:19:03
 * @Last Modified by: Hughie
 * @Last Modified time: 2020-07-13 16:58:11
 * 目前改用的后台省、市、区的id作为code 地址编码唯一表示
 */
import { memoize } from 'lodash'
import { provinces } from './provinces'
import type { CascaderOptionType } from 'antd/lib/cascader'

export type OptionsLevel = 'province' | 'city' | 'district'

const getDistrictDataSource: () => CascaderOptionType[] = memoize(
  () => {
    return (provinces.data.provinces.edges || []).map(({ node: province }) => ({
      label: province.name,
      value: province.id,
      children: (province.cities.edges || []).map(({ node: city }) => ({
        label: city.name,
        value: city.id,
        children: (city.districts.edges || []).map(({ node: district }) => ({ label: district.name, value: district.id })),
      })),
    }))
  },
  () => getDistrictDataSource
)

const getCityDataSource: () => CascaderOptionType[] = memoize(
  () => {
    return (provinces.data.provinces.edges || []).map(({ node: province }) => ({
      label: province.name,
      value: province.id,
      children: (province.cities.edges || []).map(({ node: city }) => ({
        label: city.name,
        value: city.id,
      })),
    }))
  },
  () => getCityDataSource
)

const getProvinceDataSource: () => CascaderOptionType[] = memoize(
  () => {
    return (provinces.data.provinces.edges || []).map(({ node: province }) => ({
      label: province.name,
      value: province.id,
    }))
  },
  () => getProvinceDataSource
)

export function getAddressOptions(level: OptionsLevel) {
  switch (level) {
    case 'district':
      return getDistrictDataSource()
    case 'city':
      return getCityDataSource()
    case 'province':
      return getProvinceDataSource()
  }
}
