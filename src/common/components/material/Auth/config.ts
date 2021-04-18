/*
 * @Author: Hughie
 * @Date: 2020-02-26 20:57:17
 * @LastEditTime: 2020-06-23 10:08:03
 * @LastEditors: Hughie
 * @Description: 权限声明（目前只声明操作权限，因为Auth组件就是用于操作权限，UI的显示的，路由权限不声明在这地方）
 */

export enum AuthConfig {
  /* 医生站 */
  AuthDoctorWorkstation = 'DoctorWorkstation',
  /* CDSS */
  CDSS = 'CDSS',
  /* 医保权限 */
  Medicare = 'Medicare',
  /** 自营权限 */
  OwnerClinic = 'OwnerClinic',
}
