/**
 * 这个文件复写一些功能不完善的类型
 */
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
