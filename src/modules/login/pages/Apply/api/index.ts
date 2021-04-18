/*
 * @Author: Hughie
 * @Date: 2021-04-14 09:21:13
 * @LastEditors: Hughie
 * @LastEditTime: 2021-04-14 09:21:13
 * @Description: 申请试用
 */

// TOOD: 申请试用
export interface IAddVariables {
  proposer: string
  phoneNumber: string
  smsCode: string
  orgName: string
}

export const addApplyTrial = async (args: IAddVariables): Promise<boolean> => {
  // const { proposer, phoneNumber, smsCode, orgName } = args
  console.log(args)

  return await Promise.resolve(true)
}
