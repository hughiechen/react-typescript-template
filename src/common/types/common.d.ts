// TODO/alex: 删除，暂时没用到
declare namespace COMMON {
  interface DefaultListFilter {
    pageIndex: number
    pageSize: number
  }

  export interface Clinic {
    id: string
    name: string
    provinceId: string
    cityId: string
  }
  /** 主体 */
  export interface ClinicEntity extends Clinic {
    entityClinic: {
      entityId: string
    }
  }
  /** 工作站类型 */
  export interface SysSite {
    id: string
    name: string
    code: string
  }

  export interface SysUser {
    id: string
    username: string
    realName: string
    // minGroup: number
    gender: number
  }

  /** 用户,存储于session */
  export interface Session {
    sysUser: SysUser
    accessToken: string
  }

  export interface SysUserModule {
    id: string
    name: string
    code: string
    type: string
    selected?: boolean
    children?: SysUserModule[]
  }

  export interface ClinicConfig {
    id: string
    parseValue: object
    key: string
  }
  export interface ExternalClinicConfig {
    clinic: Clinic
    status: number
  }

  export interface DoctorType {
    code: string
    name: string
  }
}
