/**
 * 请求失败，比如参数传入错误，返回的 status === 400
 */
export class BadRequestException {
  readonly message: any

  readonly date = new Date().toISOString() // 发生异常的时间

  readonly path = location.href // 发生异常的地址栏

  readonly variables: any // 请求错误的参数

  constructor(message: any, variables: any) {
    this.message = message
    this.variables = variables
  }
}

/**
 * API 相关的异常，比如密码错误，账号不存在这种异常
 */
export class APIException {
  constructor(public code: number | string, public message: string) {}
}

/**
 * 网络异常
 */
export class NetworkException {
  readonly message: string

  constructor(message = intl.get('check_network').d('请查看网络是否连接')) {
    this.message = message
  }
}
