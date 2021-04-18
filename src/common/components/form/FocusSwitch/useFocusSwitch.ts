import React from 'react'
import { NextManager } from './NextManager'
import { useIsFirstRender } from '@/common/hooks/lifecycle'

export function useFocusSwitch() {
  const contextRef = React.useRef<NextManager | null>(null)
  const isFirstRender = useIsFirstRender()
  if (isFirstRender) {
    contextRef.current = new NextManager()
  }
  return contextRef.current!
}
