import moment from 'moment'

export class StringUtil {
  /**
   * 根据身份证计算出性别和年龄
   * @param IdCard 省份证号
   */
  static getPersonInfoByIdCard(IdCard: string) {
    let gender = Number(IdCard.slice(-2, -1)) % 2 === 0 ? ('female' as const) : ('male' as const)
    const year = Number(IdCard.substr(6, 4))
    const month = Number(IdCard.substr(10, 2))
    const date = Number(IdCard.substr(12, 2))
    if (IdCard.length === 15) {
      gender = Number(IdCard.slice(-1)) % 2 === 0 ? ('female' as const) : ('male' as const)
    }
    return {
      gender,
      dateOfBirth: moment()
        .year(year)
        .month(month - 1)
        .date(date),
    }
  }

  /**
   * 获取随机的唯一 id
   */
  static uuid() {
    return window.btoa(`${Date.now().toString(16)}-${Math.floor(Math.random() * 10000000).toString(16)}`)
  }
}
