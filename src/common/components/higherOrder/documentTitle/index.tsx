/**
 * 设置 document title
 */
import React from 'react'
import { useDidMount } from '@/common/hooks/lifecycle'

export function documentTitle(title: string): <T extends React.ComponentType<any>>(target: T) => T

export function documentTitle(title: string): <P>(Component: React.ComponentType<P>) => React.ComponentType<P> {
  return Component => props => {
    useDidMount(() => {
      document.title = title
    })
    return <Component {...props} />
  }
}

export default documentTitle
