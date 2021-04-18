/*
 * @Author: Hughie
 * @Date: 2020-05-06 17:28:03
 * @Last Modified by: Hughie
 * @Last Modified time: 2020-11-19 11:57:44
 * 环境相关
 */

export class EnvUtil {
  /**
   * 判断 Chrome 版本
   * @description
   * 返回 boolean 表示 chrome 版本号是否大于 76，返回  null 表示不是chrome
   */
  static isValidChrome(): boolean | null {
    const VERSION = 76
    const raw = navigator.userAgent.match(/\b(Chrom(e|ium)|CriOS)\/\d+\b/)
    return raw?.[0] ? Number.parseInt(raw[0].split('/')[1], 10) > VERSION : null
  }
}
