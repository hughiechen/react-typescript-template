export class ObjectUtil {
  /**
   * 清除 api 返回数据中的 __typename 字段
   * @param obj api 返回的 json 数据
   */
  static clearTypeNameFields(data: object) {
    return JSON.parse(
      JSON.stringify(data, (key, value) => {
        if (key === '__typename') {
          return undefined
        }
        return value
      })
    )
  }
}
