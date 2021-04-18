/**
 * 将 url search 字符串解析为 query 给组件
 */
import React from 'react'
import { history } from '@/common/navigation'
import querystring from 'query-string'

export interface WithQuery<Q extends {} = {}> {
  query: Q
}

export function withQuery<T>(target: T): T

export function withQuery<P extends WithQuery>(Component: React.ComponentType<P>): React.ComponentType<Subtract<P, WithQuery>> {
  return props => React.createElement(Component, { ...props, query: querystring.parse(history.location.search) } as P)
}

export default withQuery
