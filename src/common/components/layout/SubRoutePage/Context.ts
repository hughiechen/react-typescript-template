import * as React from 'react'

export interface ContextState {
  isMount: boolean
  getParentPageCard: () => HTMLElement | null
}

/**
 * 为 SubRoutePage 创建上下文，提供 SubRoutePage 是否加载完（isMount）的状态，为 SubRoutePagePortal 组件提供挂载容器
 */
export const Context = React.createContext<ContextState>({ isMount: false, getParentPageCard: () => null })
