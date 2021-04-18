/*
 * @Author: Hughie
 * @Date: 2021-01-31 13:55:14
 * @LastEditTime: 2021-01-31 14:01:15
 * @LastEditors: Hughie
 * @Description:
 */
import { regexpMap } from './regexpMap'
import { Validate } from '../core/Field'
// import { UploadFile } from '@/components-x/Upload/type'

// 身份证地区编码
const regionalCode = {
  11: '北京',
  12: '天津',
  13: '河北',
  14: '山西',
  15: '内蒙古',
  21: '辽宁',
  22: '吉林',
  23: '黑龙江 ',
  31: '上海',
  32: '江苏',
  33: '浙江',
  34: '安徽',
  35: '福建',
  36: '江西',
  37: '山东',
  41: '河南',
  42: '湖北 ',
  43: '湖南',
  44: '广东',
  45: '广西',
  46: '海南',
  50: '重庆',
  51: '四川',
  52: '贵州',
  53: '云南',
  54: '西藏 ',
  61: '陕西',
  62: '甘肃',
  63: '青海',
  64: '宁夏',
  65: '新疆',
  71: '台湾',
  81: '香港',
  82: '澳门',
  91: '国外 ',
}

export class ValidateMethod {
  /**
   * 身份证
   */
  static IdCard: Validate<any, any> = (code: string) => {
    // 正则校验
    if (!regexpMap.idCard.test(code)) {
      return '身份证号格式错误'
    }
    // 省份地区校验
    if (!regionalCode[code.substr(0, 2)]) {
      return '身份证号前两位数字输入错误'
    }
    // 18位身份证校验最后一位校验码
    if (code.length === 18) {
      const factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
      const parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2]
      const codeArr = code.split('')
      const checkCode = codeArr.pop()!.toString()
      const sum = codeArr.reduce((prev, next, index) => {
        prev += Number(next) * factor[index]
        return prev
      }, 0)
      if (parity[sum % 11].toString() !== checkCode.toUpperCase()) {
        return '身份证号输入错误'
      }
    }
    return undefined
  }

  /**
   * 文件列表
   */
  static fileList(fileList: any[] = []) {
    // 当 fileList 为空数组，或者每一个都是 error 状态，那么返回错误信息
    // every 在数组为空时，恒返回 true
    if (fileList.every(_ => _.status === 'error')) {
      return '无上传成功文件'
    }
    return undefined
  }
}
