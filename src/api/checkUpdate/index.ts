/*
 * @Author: Hughie
 * @Date: 2020-09-23 09:13:22
 * @LastEditors: Hughie
 * @LastEditTime: 2020-09-23 09:13:22
 * @Description:  检测版本更新
 */

import axios from 'axios'

// 返回true 代表有网站内容有更新
export async function checkUpdate() {
  const version = RELEASE
  if (IS_DEBUG) {
    // 调试环境下默认没返回没有更新
    return false
  }

  try {
    const res = await axios.get(`/version.json?time=${new Date().getTime()}`, {
      headers: {
        'Cache-Control': 'no-cache',
      },
    })
    if (res.data.version && version !== res.data.version) {
      return true
    }
  } catch (err) {
    console.log('无法获取当前版本')
  }
  return false
}
