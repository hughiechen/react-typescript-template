import React from 'react'
import { NextManagerContext } from './context'

export function useNext() {
  const nextManager = React.useContext(NextManagerContext)
  return React.useCallback((selector?: string) => nextManager.next(selector), [nextManager])
}
