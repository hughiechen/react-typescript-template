/*
 * @Author: Hughie
 * @Date: 2021-01-31 13:55:14
 * @LastEditTime: 2021-02-05 09:52:31
 * @LastEditors: Hughie
 * @Description:
 */
import { regexpMap } from './regexpMap'
import { ValidateMethod } from './ValidateMethod'
import { ValidateType } from '../Field'
import { Validate, ValidateRegExp } from '../core/Field'

// NOTE: 如需扩展这里的验证对象，需要增加 ValidateType 联合类型
export const validateTypeMap: Record<ValidateType, Validate<any, any> | ValidateRegExp[]> = {
  /**
   * 身份证号码
   */
  IdCard: ValidateMethod.IdCard,
  /**
   * 手机号码
   */
  PhoneNumber: [{ pattern: regexpMap.phoneNumber, message: '请输入正确的手机号码' }],
  /**
   * 密码
   */
  password: [{ pattern: regexpMap.password, message: '密码限制输入6~12位，可输入数字、字母、（·_-！@#￥%&*,./）字符！' }],
  /**
   * 文件列表
   */
  fileList: ValidateMethod.fileList,
}
