/*
 * @Author: Hughie
 * @Date: 2020-07-27 17:45:31
 * @LastEditTime: 2020-07-27 17:46:55
 * @LastEditors: Hughie
 * @Description:
 */

export default class Authority {
  permissions: { [k: string]: boolean } = {}

  // 检测是否有权限
  checkPermission(authority?: string) {
    const authorityMap = this.permissions
    if (authority === undefined) return true

    const authorityList = authority.split('|')

    const result = authorityList.some(rightItem => {
      return !rightItem.split('&').some(item => {
        return !authorityMap[item]
      })
    })
    return result
  }
}
