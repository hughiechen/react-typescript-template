/*
 * @Author: Hughie
 * @Date: 2020-03-20 19:57:42
 * @LastEditTime: 2020-08-19 20:44:27
 * @LastEditors: Please set LastEditors
 * @Description:
 */
/**
 * webpack 环境变量
 */
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production'
  }
}

declare const IS_DEBUG: boolean

declare const RELEASE: string

declare const ENV: string

declare const OPEN_SENTRY: boolean

declare const IS_TEST: boolean

declare const PROXY: string

// FIXME: .d.ts 无法导入 LocationDescriptorObject
/**
 * 路由配置
 */
declare namespace AluRouteConfig {
  interface ISubRouteItem {
    name: string
    path: string
    component: React.LazyExoticComponent
    icon?: JSX.Element
    authority?: string
    exact?: boolean
    count?: number
    onClick?: (goToPath: (config?: Omit<LocationDescriptorObject, 'pathname'>) => void) => void | Promise<void>
  }
}

/**
 * 所有分页数据的标准格式
 */
declare interface PagingTableData<T, P extends PagingTableQuery = PagingTableQuery> {
  list: T
  query: P
  totalCount: number
  loading: boolean
}

declare interface PagingTableQuery {
  pageSize: number
  pageNum: number
}

/**
 * 所有工具类的接口全部放在这里
 */
/**
 * 获取可选字段, 用于 React 类组件的默认属性类型声明
 * @example
 *
 * static defaultProps: PickOptional<Props> = {}
 */
declare type PickOptional<T> = Pick<T, { [K in keyof T]-?: {} extends { [P in K]: T[K] } ? K : never }[keyof T]>

/** 去除 __typename ,用于 graphql 获取数据后过滤类型 */
declare type OmitTypeName<T extends { __typename: string }> = Omit<T, '__typename'>

/** 适用于编写高阶组件，将 T1 中去除 T2 含有的属性 */
declare type Subtract<T1, T2> = Omit<T1, keyof T2>

/** 获取组件的属性 */
declare type GetProps<T> = T extends React.ComponentType<infer P> ? P : never

/** 任意 key-value 形式的对象 */
declare interface AnyObject<T = any> {
  [k: string]: T
}

/** 定义类似 React.setState 函数声明 */
declare type SetStateLikeMethod<S extends AnyObject> = <K extends keyof S>(state: Pick<S, K> | ((state: Readonly<S>) => Pick<S, K> | S | null)) => void

/**
 * 可选查询参数的函数定义，一般结合 hooks 定义查询数据的函数
 * @example
 *
 * const getDiagnosesList = React.useCallback<OptionalQueryParamsMethod<State>>(
 *  async query => {
 *    const finalQuery = { ...state.query, ...query } // 合并搜索条件
 *    const result = await fetch(finalQuery)
 *  },
 * [state, store, setState]
 * )
 */
declare type OptionalParamsMethod<S extends AnyObject, R = Promise<void>> = <K extends keyof S>(state?: Pick<S, K>) => R

/**
 * 获取 Promise 返回值的类型
 */
declare type PromiseReturnType<T> = T extends (...args: any) => Promise<infer P> ? P : never

/**
 * 增强 Omit 类型检查功能
 */
declare type Omit2<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

declare type StaticPropertyType<T extends new (...args: any[]) => any> = {
  [K in Exclude<keyof T, 'prototype'>]: T[K]
}
