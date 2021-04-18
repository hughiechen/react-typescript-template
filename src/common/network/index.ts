/*
 * @Author: Hughie
 * @Date: 2020-10-13 18:14:10
 * @LastEditTime: 2020-10-13 18:15:07
 * @LastEditors: Hughie
 * @Description:
 */
import { APIException } from './Exception'

export * from './request'
export * from './Exception'

export function extractAPIException(error: any): APIException {
  if (error instanceof APIException) {
    return error
  }
  throw error
}
